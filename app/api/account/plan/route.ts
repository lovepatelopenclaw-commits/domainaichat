import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { normalizeUsagePlan } from '@/lib/plans';
import { verifyRequestUser } from '@/lib/server-auth';
import { UsagePlan } from '@/types';

export const runtime = 'nodejs';

const MANAGEABLE_PLANS: UsagePlan[] = [
  'personal',
  'professional',
  'business',
  'white-label',
];

function getAdminEmails() {
  return (process.env.VYARAH_ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function canManageOwnPlan(email?: string | null) {
  if (!email) {
    return false;
  }

  return getAdminEmails().includes(email.trim().toLowerCase());
}

export async function GET(req: NextRequest) {
  try {
    const authUser = await verifyRequestUser(req);

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      availablePlans: MANAGEABLE_PLANS,
      canManageOwnPlan: canManageOwnPlan(authUser.email),
      currentPlan: normalizeUsagePlan(authUser.plan),
    });
  } catch {
    return NextResponse.json({ error: 'Unable to load account plan tools' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authUser = await verifyRequestUser(req);

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!canManageOwnPlan(authUser.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const rawPlan = String(body.plan ?? '').trim();
    const nextPlan = normalizeUsagePlan(rawPlan);

    if (!rawPlan || !MANAGEABLE_PLANS.includes(nextPlan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    await getAdminDb().collection('users').doc(authUser.userId).set(
      {
        plan: nextPlan,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return NextResponse.json({
      currentPlan: nextPlan,
      ok: true,
    });
  } catch {
    return NextResponse.json({ error: 'Unable to update account plan' }, { status: 500 });
  }
}
