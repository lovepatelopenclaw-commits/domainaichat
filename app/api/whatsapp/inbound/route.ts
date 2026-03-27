import { NextRequest, NextResponse } from 'next/server';
import { DOMAINS } from '@/lib/domains';
import { getAdminDb } from '@/lib/firebase-admin';
import {
  buildProtectionInput,
  sanitizeAssistantResponse,
} from '@/lib/identity-response';
import { getDomainSystemPrompt } from '@/lib/server-domains';
import { streamChat } from '@/lib/ai';
import { getTwilioWhatsappNumber } from '@/lib/twilio';
import {
  buildWhiteLabelSystemPrompt,
  getWhiteLabelConfigByOwnerUserId,
  getWhiteLabelKnowledgeBaseContext,
} from '@/lib/whitelabel';
import { DomainId } from '@/types';

export const runtime = 'nodejs';

function normaliseSectionText(value: string) {
  return value
    .replace(/[*_`>#-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractSection(answer: string, headings: string[]) {
  for (const heading of headings) {
    const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(
      `(?:^|\\n)(?:#{1,6}\\s*|\\*\\*\\s*)?${escapedHeading}(?:\\s*\\*\\*)?\\s*:?\\s*\\n([\\s\\S]*?)(?=\\n(?:#{1,6}\\s*|\\*\\*\\s*)?[A-Z][A-Za-z ]+(?:\\s*\\*\\*)?\\s*:?\\s*\\n|$)`,
      'i'
    );
    const match = answer.match(regex);

    if (match?.[1]) {
      return normaliseSectionText(match[1]);
    }
  }

  return '';
}

function buildWhatsappMessage(answer: string, desk: DomainId) {
  const mainAnswer = extractSection(answer, ['Answer', 'Summary']) || normaliseSectionText(answer).slice(0, 900);
  const documentsNeeded =
    extractSection(answer, ['Documents needed', 'Documents', 'Required documents']) || 'Not specified.';
  const nextStep =
    extractSection(answer, ['Next step', 'Next steps', 'Recommended next step']) ||
    'Review the full answer in BuildDesk and verify important decisions with a qualified professional.';

  return `*BuildDesk - ${DOMAINS[desk].name}*

*Answer:*
${mainAnswer}

*Documents needed:*
${documentsNeeded}

*Next step:*
${nextStep}

*Disclaimer:* ${DOMAINS[desk].disclaimer ?? 'This is AI guidance, not professional advice.'}

Reply with a follow-up question to continue.`;
}

async function buildAnswer(
  phoneNumber: string,
  body: string,
  desk: DomainId,
  ownerUserId?: string
) {
  const adminDb = getAdminDb();
  const threadRef = adminDb.collection('whatsappThreads').doc(phoneNumber).collection('messages');
  const snapshot = await threadRef.orderBy('createdAt', 'desc').limit(8).get();
  const history = snapshot.docs
    .map((doc) => doc.data())
    .reverse()
    .map((message) => ({
      content: String(message.body ?? ''),
      role: message.direction === 'inbound' ? ('user' as const) : ('assistant' as const),
    }));

  const whiteLabelConfig = ownerUserId
    ? await getWhiteLabelConfigByOwnerUserId(ownerUserId)
    : null;
  const knowledgeBaseContext = whiteLabelConfig
    ? await getWhiteLabelKnowledgeBaseContext(whiteLabelConfig)
    : null;
  const result = await streamChat({
    messages: [...history, { content: body, role: 'user' }],
    systemPrompt: whiteLabelConfig
      ? buildWhiteLabelSystemPrompt(whiteLabelConfig, desk)
      : getDomainSystemPrompt(desk),
    documentContext: knowledgeBaseContext || undefined,
  });

  let fullAnswer = '';

  for await (const chunk of result.stream) {
    fullAnswer += chunk.choices[0]?.delta?.content || '';
  }

  const protectionInput = buildProtectionInput(
    [...history.map((message) => message.content), body]
  );
  const protectedResponse = sanitizeAssistantResponse(protectionInput, fullAnswer);
  const formattedAnswer = buildWhatsappMessage(protectedResponse.content, desk);

  await threadRef.add({
    body,
    createdAt: new Date().toISOString(),
    desk,
    direction: 'inbound',
    phoneNumber,
  });

  await threadRef.add({
    body: formattedAnswer,
    createdAt: new Date().toISOString(),
    desk,
    direction: 'outbound',
    phoneNumber,
  });

  return formattedAnswer;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const from = String(formData.get('From') ?? '').trim();
    const body = String(formData.get('Body') ?? '').trim();
    const to = String(formData.get('To') ?? getTwilioWhatsappNumber()).trim();
    const adminDb = getAdminDb();

    const connectionsSnapshot = await adminDb
      .collection('whatsappConnections')
      .where('phoneNumber', '==', from)
      .where('status', '==', 'verified')
      .limit(1)
      .get();

    if (connectionsSnapshot.empty) {
      return new NextResponse(
        `<Response><Message>Your WhatsApp number is not connected to BuildDesk yet.</Message></Response>`,
        { headers: { 'Content-Type': 'text/xml' } }
      );
    }

    const connection = connectionsSnapshot.docs[0].data();
    const userSnapshot = await adminDb.collection('users').doc(connection.ownerUserId).get();
    const preferredDesk = (userSnapshot.data()?.preferredDesk as DomainId | undefined) ?? 'ca-tax';
    const answer = await buildAnswer(from, body, preferredDesk, connection.ownerUserId);

    await adminDb.collection('whatsappInboundLogs').add({
      body,
      createdAt: new Date().toISOString(),
      from,
      ownerUserId: connection.ownerUserId,
      to,
    });

    return new NextResponse(`<Response><Message>${answer}</Message></Response>`, {
      headers: { 'Content-Type': 'text/xml' },
    });
  } catch (error) {
    return new NextResponse(
      `<Response><Message>${
        error instanceof Error ? error.message : 'BuildDesk could not answer right now.'
      }</Message></Response>`,
      {
        headers: { 'Content-Type': 'text/xml' },
        status: 500,
      }
    );
  }
}
