import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { EmailJobRecord } from '@/lib/email';
import { DomainId } from '@/types';

export const runtime = 'nodejs';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email ?? '').trim().toLowerCase();
    const desk = body.desk as DomainId;
    const sessionId = String(body.sessionId ?? '').trim();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 });
    }

    if (!sessionId) {
      return NextResponse.json({ error: 'Session not found.' }, { status: 400 });
    }

    const adminDb = getAdminDb();
    const createdAt = new Date().toISOString();
    const followUpDueAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    await adminDb.collection('softLeads').doc(sessionId).set(
      {
        approximateQuestionCount: Number(body.approximateQuestionCount ?? 0),
        createdAt,
        desk,
        email,
        followUpDueAt,
        lastAnswer: body.lastAnswer ?? null,
        sessionId,
        status: 'pending',
        tag: 'soft-lead',
      },
      { merge: true }
    );

    const emailJob: EmailJobRecord = {
      createdAt,
      dueAt: followUpDueAt,
      payload: {
        desk,
        email,
      },
      status: 'pending',
      type: 'soft-lead-follow-up',
    };

    await adminDb.collection('emailJobs').doc(`soft-lead-${sessionId}`).set(emailJob, { merge: true });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Unable to save your email right now.' }, { status: 500 });
  }
}
