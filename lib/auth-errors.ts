import { FirebaseError } from 'firebase/app';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/cancelled-popup-request': 'The Google sign-in popup was interrupted. Please try again.',
  'auth/configuration-not-found': 'Google sign-in is not configured for this Firebase project yet. Enable Google in Firebase Authentication and save the provider settings.',
  'auth/invalid-credential': 'The email or password is incorrect.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/invalid-login-credentials': 'The email or password is incorrect.',
  'auth/network-request-failed': 'Firebase could not be reached. Check your internet connection and try again.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled in Firebase Authentication yet.',
  'auth/popup-blocked': 'Your browser blocked the Google sign-in popup. Allow popups and try again.',
  'auth/popup-closed-by-user': 'The Google sign-in popup was closed before completing login.',
  'auth/too-many-requests': 'Too many login attempts were made. Wait a moment and try again.',
  'auth/unauthorized-domain': 'This domain is not authorized for Firebase Authentication. Add it in the Firebase console.',
  'auth/user-disabled': 'This account has been disabled in Firebase Authentication.',
  'auth/user-not-found': 'No account was found for that email address.',
  'auth/wrong-password': 'The email or password is incorrect.',
};

function normalizeMessage(message: string) {
  return message
    .replace(/^Firebase:\s*/i, '')
    .replace(/\s*\(auth\/[^)]+\)\.?$/i, '')
    .trim();
}

function isMeaningfulMessage(message?: string | null) {
  if (!message) {
    return false;
  }

  const normalized = message.trim();
  return normalized.length > 0 && normalized.toLowerCase() !== 'error';
}

function getErrorCode(error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
  ) {
    return error.code;
  }

  return null;
}

function getErrorMessage(error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }

  return null;
}

export function getAuthErrorMessage(error: unknown, fallback: string) {
  if (error instanceof FirebaseError) {
    const normalizedMessage = normalizeMessage(error.message);

    return AUTH_ERROR_MESSAGES[error.code]
      ?? (isMeaningfulMessage(normalizedMessage) ? normalizedMessage : null)
      ?? `Authentication failed (${error.code}).`;
  }

  if (error instanceof Error) {
    return isMeaningfulMessage(error.message) ? error.message : fallback;
  }

  const code = getErrorCode(error);
  const message = getErrorMessage(error);

  if (code && code in AUTH_ERROR_MESSAGES) {
    return AUTH_ERROR_MESSAGES[code];
  }

  if (isMeaningfulMessage(message)) {
    return message!;
  }

  if (code) {
    return `Authentication failed (${code}).`;
  }

  return fallback;
}

export function shouldUseGoogleRedirectFallback(error: unknown) {
  return error instanceof FirebaseError && error.code === 'auth/popup-blocked';
}
