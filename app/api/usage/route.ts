import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { getTodayDateKey, getUsageDocumentId } from '@/lib/firestore-admin';
import { getUsageLimit } from '@/lib/usage';
import { verifyRequestUser } from '@/lib/server-auth';

export async function GET(req: NextRequest) {
  try {
    const authUser = await verifyRequestUser(req);

    if (authUser) {
      const date = getTodayDateKey();
      const usageId = getUsageDocumentId(authUser.userId, date);
      const adminDb = getAdminDb();
      const usageSnapshot = await adminDb.collection('usage').doc(usageId).get();
      const current = usageSnapshot.data()?.count ?? 0;
      const limit = getUsageLimit(authUser.plan);
      const remaining = Number.isFinite(limit) ? Math.max(limit - current, 0) : null;

      return NextResponse.json({
        current,
        date,
        limit: Number.isFinite(limit) ? limit : null,
        plan: authUser.plan,
        remaining,
      });
    }

    const guestCount = parseInt(req.cookies.get('vyarah_guest_count')?.value || '0', 10);
    const limit = getUsageLimit('guest');

    return NextResponse.json({
      current: guestCount,
      date: getTodayDateKey(),
      limit,
      plan: 'guest',
      remaining: Math.max(0, limit - guestCount),
    });
  } catch {
    return NextResponse.json(
      { error: 'Unable to load usage' },
      { status: 500 }
    );
  }
}
