import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';

export const runtime = 'nodejs';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const fullName = String(body.fullName ?? '').trim();
    const firmName = String(body.firmName ?? '').trim();
    const email = String(body.email ?? '').trim().toLowerCase();
    const firmType = String(body.firmType ?? '').trim();

    if (!fullName || !firmName || !firmType) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const adminDb = getAdminDb();
    const createdAt = new Date().toISOString();

    await adminDb.collection('whiteLabelDemoRequests').add({
      createdAt,
      email,
      firmName,
      firmType,
      fullName,
      source: 'white-label-page',
      status: 'new',
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: 'Unable to submit your request right now. Please try again shortly.' },
      { status: 500 }
    );
  }
}
