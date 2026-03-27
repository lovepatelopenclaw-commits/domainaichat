import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { normalizeUsagePlan } from '@/lib/plans';
import { verifyRequestUser } from '@/lib/server-auth';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const authUser = await verifyRequestUser(req);

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminDb = getAdminDb();
    const snapshot = await adminDb.collection('users').doc(authUser.userId).get();
    const data = snapshot.data() ?? {};

    return NextResponse.json({
      city: data.city ?? null,
      createdAt: data.createdAt ?? new Date().toISOString(),
      email: data.email ?? authUser.email,
      onboardingCompleted: data.onboardingCompleted ?? false,
      persona: data.persona ?? null,
      plan: normalizeUsagePlan(data.plan),
      preferredDesk: data.preferredDesk ?? null,
      userId: authUser.userId,
    });
  } catch {
    return NextResponse.json({ error: 'Unable to load profile' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authUser = await verifyRequestUser(req);

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const adminDb = getAdminDb();
    const userRef = adminDb.collection('users').doc(authUser.userId);

    await userRef.set(
      {
        city: body.city ?? null,
        onboardingCompleted: body.onboardingCompleted ?? false,
        onboardingEmailQueuedAt: body.onboardingEmailQueuedAt ?? null,
        persona: body.persona ?? null,
        preferredDesk: body.preferredDesk ?? null,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    const snapshot = await userRef.get();
    const data = snapshot.data() ?? {};

    return NextResponse.json({
      city: data.city ?? null,
      onboardingCompleted: data.onboardingCompleted ?? false,
      onboardingEmailQueuedAt: data.onboardingEmailQueuedAt ?? null,
      persona: data.persona ?? null,
      preferredDesk: data.preferredDesk ?? null,
    });
  } catch {
    return NextResponse.json({ error: 'Unable to update profile' }, { status: 500 });
  }
}
