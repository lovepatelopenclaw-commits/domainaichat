import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { toIsoString } from '@/lib/firestore-admin';
import { verifyRequestUser } from '@/lib/server-auth';
import { Conversation } from '@/types';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const authUser = await verifyRequestUser(req);

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminDb = getAdminDb();
    const snapshot = await adminDb
      .collection('conversations')
      .where('userId', '==', authUser.userId)
      .get();

    const conversations: Conversation[] = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        createdAt: toIsoString(data.createdAt),
        domain: data.domain,
        id: doc.id,
        title: data.title,
        updatedAt: toIsoString(data.updatedAt),
        userId: data.userId,
      };
    }).sort((left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
    ).slice(0, 25);

    return NextResponse.json({ conversations });
  } catch {
    return NextResponse.json(
      { error: 'Unable to load conversations' },
      { status: 500 }
    );
  }
}
