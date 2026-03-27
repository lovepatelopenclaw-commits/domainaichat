import { NextRequest } from 'next/server';
import { DecodedIdToken } from 'firebase-admin/auth';
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';
import { UsagePlan } from '@/types';

export interface AuthenticatedUser {
  email: string | null;
  plan: UsagePlan;
  token: DecodedIdToken;
  userId: string;
}

export function getBearerToken(req: NextRequest) {
  const header = req.headers.get('Authorization');

  if (!header?.startsWith('Bearer ')) {
    return null;
  }

  return header.replace('Bearer ', '').trim();
}

export async function verifyRequestUser(
  req: NextRequest
): Promise<AuthenticatedUser | null> {
  const token = getBearerToken(req);

  if (!token) {
    return null;
  }

  const adminAuth = getAdminAuth();
  const adminDb = getAdminDb();
  const decoded = await adminAuth.verifyIdToken(token);
  const userRef = adminDb.collection('users').doc(decoded.uid);
  const snapshot = await userRef.get();
  const existingData = snapshot.exists ? snapshot.data() : undefined;
  const createdAt = existingData?.createdAt ?? new Date().toISOString();
  const plan = (existingData?.plan as UsagePlan | undefined) ?? 'free';

  if (!snapshot.exists) {
    await userRef.set({
      email: decoded.email ?? null,
      plan,
      createdAt,
    });
  }

  return {
    email: decoded.email ?? null,
    plan,
    token: decoded,
    userId: decoded.uid,
  };
}
