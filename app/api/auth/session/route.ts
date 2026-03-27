import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { normalizeUsagePlan } from '@/lib/plans';
import { verifyRequestUser } from '@/lib/server-auth';

export const runtime = 'nodejs';

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim() && error.message !== 'Error') {
    return error.message.trim();
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'errorInfo' in error &&
    typeof error.errorInfo === 'object' &&
    error.errorInfo !== null &&
    'message' in error.errorInfo &&
    typeof error.errorInfo.message === 'string' &&
    error.errorInfo.message.trim()
  ) {
    return error.errorInfo.message.trim();
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string' &&
    error.message.trim() &&
    error.message !== 'Error'
  ) {
    return error.message.trim();
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string' &&
    error.code.trim()
  ) {
    return `Session sync failed (${error.code.trim()})`;
  }

  return 'Unable to sync session';
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await verifyRequestUser(req);

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminDb = getAdminDb();
    const userRef = adminDb.collection('users').doc(authUser.userId);
    const snapshot = await userRef.get();
    const createdAt = snapshot.exists
      ? snapshot.data()?.createdAt
      : new Date().toISOString();

    await userRef.set(
      {
        createdAt,
        email: authUser.email,
        onboardingCompleted: snapshot.data()?.onboardingCompleted ?? false,
        persona: snapshot.data()?.persona ?? null,
        plan: normalizeUsagePlan(snapshot.data()?.plan),
        preferredDesk: snapshot.data()?.preferredDesk ?? null,
      },
      { merge: true }
    );

    const user = (await userRef.get()).data();

    return NextResponse.json({
      createdAt: user?.createdAt ?? createdAt,
      email: user?.email ?? authUser.email,
      onboardingCompleted: user?.onboardingCompleted ?? false,
      persona: user?.persona ?? null,
      plan: normalizeUsagePlan(user?.plan),
      preferredDesk: user?.preferredDesk ?? null,
      userId: authUser.userId,
    });
  } catch (error) {
    console.error('Failed to sync authenticated user session', error);

    const errorMessage =
      process.env.NODE_ENV !== 'production'
        ? getErrorMessage(error)
        : 'Unable to sync session';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
