import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { canAccessWhatsapp } from '@/lib/plans';
import { verifyRequestUser } from '@/lib/server-auth';
import { getTwilioClient, getTwilioVerifyServiceSid, getTwilioWhatsappNumber } from '@/lib/twilio';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const authUser = await verifyRequestUser(req);

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!canAccessWhatsapp(authUser.plan)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const snapshot = await getAdminDb().collection('whatsappConnections').doc(authUser.userId).get();

    return NextResponse.json({
      connection: snapshot.exists ? snapshot.data() : null,
      serviceNumber: getTwilioWhatsappNumber(),
    });
  } catch {
    return NextResponse.json({ error: 'Unable to load WhatsApp connection' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await verifyRequestUser(req);

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!canAccessWhatsapp(authUser.plan)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const phoneNumber = String(body.phoneNumber ?? '').trim();
    const client = getTwilioClient();
    const serviceSid = getTwilioVerifyServiceSid();

    await client.verify.v2.services(serviceSid).verifications.create({
      channel: 'whatsapp',
      to: phoneNumber,
    });

    await getAdminDb().collection('whatsappConnections').doc(authUser.userId).set(
      {
        createdAt: new Date().toISOString(),
        ownerUserId: authUser.userId,
        phoneNumber,
        plan: authUser.plan,
        provider: 'twilio',
        status: 'pending',
        verifiedAt: null,
      },
      { merge: true }
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to start verification' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authUser = await verifyRequestUser(req);

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!canAccessWhatsapp(authUser.plan)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const phoneNumber = String(body.phoneNumber ?? '').trim();
    const code = String(body.code ?? '').trim();
    const client = getTwilioClient();
    const serviceSid = getTwilioVerifyServiceSid();
    const result = await client.verify.v2.services(serviceSid).verificationChecks.create({
      code,
      to: phoneNumber,
    });

    if (result.status !== 'approved') {
      return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
    }

    const verifiedAt = new Date().toISOString();

    await getAdminDb().collection('whatsappConnections').doc(authUser.userId).set(
      {
        phoneNumber,
        status: 'verified',
        verifiedAt,
      },
      { merge: true }
    );

    return NextResponse.json({ ok: true, status: 'verified', verifiedAt });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to verify code' },
      { status: 500 }
    );
  }
}
