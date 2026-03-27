import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { getShareUrl } from '@/lib/app-url';
import { DomainId } from '@/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const question = String(body.question ?? '').trim();
    const answer = String(body.answer ?? '').trim();
    const desk = body.desk as DomainId;

    if (!question || !answer || !desk) {
      return NextResponse.json({ error: 'Missing share data.' }, { status: 400 });
    }

    const adminDb = getAdminDb();
    const docRef = adminDb.collection('sharedAnswers').doc();

    await docRef.set({
      answer,
      createdAt: new Date().toISOString(),
      desk,
      question,
    });

    return NextResponse.json({
      shareId: docRef.id,
      url: getShareUrl(docRef.id),
    });
  } catch {
    return NextResponse.json({ error: 'Unable to create share link.' }, { status: 500 });
  }
}
