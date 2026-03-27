'use client';

import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

function buildHeaders(
  headers?: HeadersInit,
  token?: string
): Headers {
  const nextHeaders = new Headers(headers);

  if (token) {
    nextHeaders.set('Authorization', `Bearer ${token}`);
  }

  return nextHeaders;
}

export async function fetchWithAuth(
  input: RequestInfo | URL,
  init: RequestInit = {}
) {
  const token = auth?.currentUser ? await auth.currentUser.getIdToken() : undefined;

  return fetch(input, {
    ...init,
    headers: buildHeaders(init.headers, token),
  });
}

export async function syncAuthenticatedUser(user: User) {
  const token = await user.getIdToken();

  const response = await fetch('/api/auth/session', {
    method: 'POST',
    headers: buildHeaders(undefined, token),
  });

  if (!response.ok) {
    let message = 'Failed to sync account';

    try {
      const data = await response.json();

      if (typeof data?.error === 'string' && data.error.trim()) {
        message = data.error.trim();
      }
    } catch {
      // Ignore JSON parsing failures and keep the fallback message.
    }

    throw new Error(message);
  }

  return response.json();
}
