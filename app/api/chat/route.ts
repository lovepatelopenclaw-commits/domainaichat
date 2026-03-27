import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import {
  createConversationTitle,
  getTodayDateKey,
  getUsageDocumentId,
} from '@/lib/firestore-admin';
import { generateFollowUpQuestions, streamChat } from '@/lib/ai';
import { DOMAINS } from '@/lib/domains';
import {
  buildProtectionInput,
  getProtectedIdentityResponse,
  sanitizeAssistantResponse,
} from '@/lib/identity-response';
import { verifyRequestUser } from '@/lib/server-auth';
import { getDomainSystemPrompt } from '@/lib/server-domains';
import { isUsageExceeded } from '@/lib/usage';
import {
  buildWhiteLabelSystemPrompt,
  getWhiteLabelConfigByEmbedToken,
  getWhiteLabelKnowledgeBaseContext,
} from '@/lib/whitelabel';
import { ChatRequest, UsagePlan } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const authUser = await verifyRequestUser(req);
    const body = await req.json();
    const { messages, domain, documentContext, conversationId, workspaceToken } = body as ChatRequest;

    // Validate domain
    const domainConfig = DOMAINS[domain];
    if (!domainConfig) {
      return NextResponse.json({ error: 'Invalid domain' }, { status: 400 });
    }

    const lastUserMessage = [...messages].reverse().find((message) => message.role === 'user');

    if (!lastUserMessage) {
      return NextResponse.json({ error: 'A user message is required' }, { status: 400 });
    }

    let activeConversationId = conversationId;
    let plan: UsagePlan = 'guest';
    let nextGuestCount: number | null = null;

    if (authUser) {
      const adminDb = getAdminDb();
      plan = authUser.plan;
      const date = getTodayDateKey();
      const usageId = getUsageDocumentId(authUser.userId, date);
      const usageRef = adminDb.collection('usage').doc(usageId);
      const usageSnapshot = await usageRef.get();
      const current = usageSnapshot.data()?.count ?? 0;

      if (isUsageExceeded(current, plan)) {
        return NextResponse.json(
          {
            error: 'Limit reached',
            limit: true,
            message: "You've reached your daily question limit. Upgrade to Pro for unlimited access.",
          },
          { status: 429 }
        );
      }

      await usageRef.set(
        {
          count: FieldValue.increment(1),
          date,
          userId: authUser.userId,
        },
        { merge: true }
      );

      if (activeConversationId) {
        const existingConversation = await adminDb
          .collection('conversations')
          .doc(activeConversationId)
          .get();

        if (!existingConversation.exists) {
          return NextResponse.json(
            { error: 'Conversation not found' },
            { status: 404 }
          );
        }

        if (existingConversation.data()?.userId !== authUser.userId) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
      } else {
        const conversationRef = adminDb.collection('conversations').doc();
        activeConversationId = conversationRef.id;

        await conversationRef.set({
          createdAt: new Date().toISOString(),
          domain,
          title: createConversationTitle(lastUserMessage.content),
          updatedAt: new Date().toISOString(),
          userId: authUser.userId,
        });
      }

      await adminDb
        .collection('conversations')
        .doc(activeConversationId)
        .collection('messages')
        .add({
          content: lastUserMessage.content,
          createdAt: new Date().toISOString(),
          role: 'user',
        });

      await adminDb.collection('conversations').doc(activeConversationId).set(
        {
          domain,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } else {
      const guestCount = parseInt(req.cookies.get('vyarah_guest_count')?.value || '0', 10);

      if (isUsageExceeded(guestCount, 'guest')) {
        return NextResponse.json(
          {
            error: 'Limit reached',
            limit: true,
            message: "You've reached your daily question limit. Upgrade to Pro for unlimited access.",
          },
          { status: 429 }
        );
      }

      nextGuestCount = guestCount + 1;
    }

    try {
      const adminDb = getAdminDb();
      await adminDb.collection('questionEvents').add({
        createdAt: new Date().toISOString(),
        domain,
        plan,
        question: lastUserMessage.content,
        userId: authUser?.userId ?? null,
        workspaceToken: workspaceToken?.trim() || null,
      });
    } catch {
      // Analytics should never block the primary chat flow.
    }

    // Validate API key is configured
    if (!process.env.OPENROUTER_API_KEY && !process.env.NVIDIA_NIM_API_KEY) {
      return NextResponse.json(
        { error: 'Vyarah AI is temporarily unavailable. Please try again shortly.' },
        { status: 500 }
      );
    }

    const chatMessages = messages.map((m) => ({
      role: m.role as 'user' | 'assistant' | 'system',
      content: m.content,
    }));
    const protectionInput = buildProtectionInput(
      messages.filter((message) => message.role === 'user').map((message) => message.content)
    );
    const protectedIdentityResponse = getProtectedIdentityResponse(protectionInput);
    let systemPrompt = getDomainSystemPrompt(domain);
    let combinedDocumentContext = documentContext?.trim() || '';

    if (workspaceToken?.trim()) {
      const workspaceConfig = await getWhiteLabelConfigByEmbedToken(workspaceToken);

      if (!workspaceConfig) {
        return NextResponse.json(
          { error: 'This branded workspace is unavailable right now.' },
          { status: 404 }
        );
      }

      const workspaceDesk = workspaceConfig.deskConfigs.find((desk) => desk.id === domain);

      if (!workspaceDesk?.enabled) {
        return NextResponse.json(
          { error: 'This desk is not enabled in the selected workspace.' },
          { status: 403 }
        );
      }

      systemPrompt = buildWhiteLabelSystemPrompt(workspaceConfig, domain);

      const whiteLabelKnowledgeBase = await getWhiteLabelKnowledgeBaseContext(workspaceConfig);
      combinedDocumentContext = [combinedDocumentContext, whiteLabelKnowledgeBase]
        .filter(Boolean)
        .join('\n\n');
    }

    // Stream response
    let stream: Awaited<ReturnType<typeof streamChat>>['stream'] | null = null;
    if (!protectedIdentityResponse) {
      try {
        const result = await streamChat({
          messages: chatMessages,
          systemPrompt,
          documentContext: combinedDocumentContext || undefined,
        });
        stream = result.stream;
      } catch (error) {
        if (error instanceof Error && error.message === 'AI_UNAVAILABLE') {
          return NextResponse.json(
            { error: 'Vyarah AI is temporarily unavailable. Please try again shortly.' },
            { status: 503 }
          );
        }

        return NextResponse.json(
          { error: 'Something went wrong. Please try again.' },
          { status: 500 }
        );
      }
    }

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          let fullResponse = '';
          if (protectedIdentityResponse) {
            fullResponse = protectedIdentityResponse;
          } else if (stream) {
            for await (const chunk of stream) {
              const content = chunk.choices[0]?.delta?.content || '';
              if (content) {
                fullResponse += content;
              }
            }
          }

          const protectedResponse = sanitizeAssistantResponse(
            protectionInput,
            fullResponse
          );
          fullResponse = protectedResponse.content;

          if (fullResponse) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: fullResponse })}\n\n`));
          }

          // Generate follow-up questions
          try {
            if (authUser && activeConversationId) {
              const adminDb = getAdminDb();
              await adminDb
                .collection('conversations')
                .doc(activeConversationId)
                .collection('messages')
                .add({
                  content: fullResponse,
                  createdAt: new Date().toISOString(),
                  role: 'assistant',
                });

              await adminDb.collection('conversations').doc(activeConversationId).set(
                {
                  updatedAt: new Date().toISOString(),
                },
                { merge: true }
              );
            }

            const followUps = protectedIdentityResponse || protectedResponse.blocked
              ? []
              : await generateFollowUpQuestions(domainConfig.name, fullResponse);
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  conversationId: activeConversationId,
                  done: true,
                  followUpQuestions: followUps,
                })}\n\n`
              )
            );
          } catch {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  conversationId: activeConversationId,
                  done: true,
                })}\n\n`
              )
            );
          }

          controller.close();
        } catch {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                error: 'Vyarah AI encountered an issue. Please try again.',
              })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    const response = new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });

    if (nextGuestCount !== null) {
      response.headers.append(
        'Set-Cookie',
        `vyarah_guest_count=${nextGuestCount}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`
      );
    }

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
