import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { EmailJobRecord } from '@/lib/email';
import { DomainId, OnboardingPersona } from '@/types';
import { verifyRequestUser } from '@/lib/server-auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const authUser = await verifyRequestUser(req);

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const persona = body.persona as OnboardingPersona;
    const preferredDesk = body.preferredDesk as DomainId;
    const city = typeof body.city === 'string' ? body.city.trim() : '';
    const now = new Date().toISOString();

    const adminDb = getAdminDb();
    const userRef = adminDb.collection('users').doc(authUser.userId);

    await userRef.set(
      {
        city: city || null,
        onboardingCompleted: true,
        onboardingCompletedAt: now,
        onboardingEmailQueuedAt: now,
        persona,
        preferredDesk,
        updatedAt: now,
      },
      { merge: true }
    );

    const emailJob: EmailJobRecord = {
      createdAt: now,
      dueAt: now,
      payload: {
        city: city || null,
        desk: preferredDesk,
        email: authUser.email ?? '',
        persona,
      },
      status: 'pending',
      type: 'onboarding-follow-up',
    };

    await adminDb.collection('emailJobs').doc(`onboarding-${authUser.userId}`).set(emailJob, { merge: true });

    return NextResponse.json({
      city: city || null,
      onboardingCompleted: true,
      persona,
      preferredDesk,
    });
  } catch {
    return NextResponse.json({ error: 'Unable to save onboarding' }, { status: 500 });
  }
}
