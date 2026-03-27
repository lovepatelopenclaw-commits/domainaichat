import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { buildEmailContent, EmailJobRecord, sendEmail } from '@/lib/email';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && req.headers.get('Authorization') !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminDb = getAdminDb();
    const snapshot = await adminDb
      .collection('emailJobs')
      .where('status', '==', 'pending')
      .get();

    const now = Date.now();
    let sent = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data() as EmailJobRecord;

      if (new Date(data.dueAt).getTime() > now) {
        continue;
      }

      const content = buildEmailContent(data.type, data.payload);
      await sendEmail(data.payload.email, content.subject, content.html, content.text);

      await doc.ref.set(
        {
          sentAt: new Date().toISOString(),
          status: 'sent',
        },
        { merge: true }
      );

      sent += 1;
    }

    return NextResponse.json({ sent });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unable to process email jobs',
      },
      { status: 500 }
    );
  }
}
