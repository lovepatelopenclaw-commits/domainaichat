import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { toIsoString } from '@/lib/firestore-admin';
import { verifyRequestUser } from '@/lib/server-auth';
import { Message } from '@/types';

export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  context: RouteContext<'/api/conversations/[id]/messages'>
) {
  try {
    const authUser = await verifyRequestUser(req);

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const adminDb = getAdminDb();
    const conversationRef = adminDb.collection('conversations').doc(id);
    const conversationSnapshot = await conversationRef.get();

    if (!conversationSnapshot.exists) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const conversation = conversationSnapshot.data();

    if (conversation?.userId !== authUser.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const messagesSnapshot = await conversationRef
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .get();

    const messages: Message[] = messagesSnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        content: data.content,
        conversationId: id,
        createdAt: toIsoString(data.createdAt),
        id: doc.id,
        role: data.role,
      };
    });

    return NextResponse.json({ messages });
  } catch {
    return NextResponse.json(
      { error: 'Unable to load conversation messages' },
      { status: 500 }
    );
  }
}
