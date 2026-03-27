import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, getAdminStorage } from '@/lib/firebase-admin';
import { canAccessWhitelabel } from '@/lib/plans';
import { verifyRequestUser } from '@/lib/server-auth';
import { WhiteLabelConfig, WhiteLabelDocument } from '@/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const authUser = await verifyRequestUser(req);

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!canAccessWhitelabel(authUser.plan)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const kind = String(formData.get('kind') ?? 'knowledge-base');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bucket = getAdminStorage();
    const adminDb = getAdminDb();
    const fileId = crypto.randomUUID();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
    const filePath = `whitelabel/${authUser.userId}/${fileId}-${safeName}`;
    const uploadFile = bucket.file(filePath);
    const buffer = Buffer.from(await file.arrayBuffer());

    await uploadFile.save(buffer, {
      contentType: file.type,
      resumable: false,
    });

    const [signedUrl] = await uploadFile.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });

    if (kind === 'logo') {
      await adminDb.collection('whitelabelConfigs').doc(authUser.userId).set(
        {
          branding: {
            logoUrl: signedUrl,
          },
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      return NextResponse.json({ logoUrl: signedUrl });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Please upload a PDF.' }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse');
    const extracted = await pdfParse(buffer);

    await adminDb.collection('whitelabelKnowledgeBase').doc(fileId).set({
      ownerUserId: authUser.userId,
      storagePath: filePath,
      text: String(extracted.text ?? '').slice(0, 15000),
      uploadedAt: new Date().toISOString(),
    });

    const configRef = adminDb.collection('whitelabelConfigs').doc(authUser.userId);
    const configSnapshot = await configRef.get();
    const config = configSnapshot.data() as WhiteLabelConfig | undefined;
    const knowledgeBase = config?.knowledgeBase ?? [];

    if (knowledgeBase.length >= 5) {
      return NextResponse.json({ error: 'You can upload up to 5 PDF documents.' }, { status: 400 });
    }

    const nextDocument: WhiteLabelDocument = {
      id: fileId,
      name: file.name,
      status: 'ready',
      storagePath: filePath,
      uploadedAt: new Date().toISOString(),
    };

    await configRef.set(
      {
        knowledgeBase: [...knowledgeBase, nextDocument],
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return NextResponse.json({ document: nextDocument });
  } catch {
    return NextResponse.json({ error: 'Unable to upload file' }, { status: 500 });
  }
}
