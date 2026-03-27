'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowRight, Mail, User } from 'lucide-react';
import { createUserWithEmailAndPassword, getRedirectResult, signInWithPopup, signInWithRedirect, updateProfile } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { syncAuthenticatedUser } from '@/lib/client-api';
import { getAuthErrorMessage, shouldUseGoogleRedirectFallback } from '@/lib/auth-errors';
import { BrandMark } from '@/components/brand/BrandMark';
import { isFirebaseClientConfigured } from '@/lib/firebase';

const FIREBASE_UNAVAILABLE_MESSAGE =
  'Sign-up is temporarily unavailable because Firebase is not configured on this deployment yet.';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const firebaseUnavailable = !auth || !isFirebaseClientConfigured;

  useEffect(() => {
    if (!auth) {
      return;
    }

    const currentAuth = auth;
    let ignore = false;

    async function completeRedirectSignup() {
      try {
        const result = await getRedirectResult(currentAuth);

        if (!result?.user || ignore) {
          return;
        }

        setGoogleLoading(true);
        const profile = await syncAuthenticatedUser(result.user);

        if (!ignore) {
          router.push(profile.onboardingCompleted ? '/chat' : '/onboarding');
        }
      } catch (error) {
        if (!ignore) {
          setError(getAuthErrorMessage(error, 'Google sign-up failed. Please try again.'));
          setGoogleLoading(false);
        }
      }
    }

    completeRedirectSignup();

    return () => {
      ignore = true;
    };
  }, [router]);

  const handleGoogleSignup = async () => {
    if (!auth || !googleProvider) {
      setError(FIREBASE_UNAVAILABLE_MESSAGE);
      return;
    }

    const currentAuth = auth;
    const currentGoogleProvider = googleProvider;
    setGoogleLoading(true);
    setError('');

    try {
      const result = await signInWithPopup(currentAuth, currentGoogleProvider);
      const profile = await syncAuthenticatedUser(result.user);
      router.push(profile.onboardingCompleted ? '/chat' : '/onboarding');
    } catch (error) {
      if (shouldUseGoogleRedirectFallback(error)) {
        await signInWithRedirect(currentAuth, currentGoogleProvider);
        return;
      }

      setError(getAuthErrorMessage(error, 'Google sign-up failed. Please try again.'));
      setGoogleLoading(false);
    }
  };

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!auth) {
      setError(FIREBASE_UNAVAILABLE_MESSAGE);
      return;
    }

    const currentAuth = auth;
    setLoading(true);
    setError('');

    try {
      const result = await createUserWithEmailAndPassword(currentAuth, email, password);

      if (name.trim()) {
        await updateProfile(result.user, {
          displayName: name.trim(),
        });
      }

      const profile = await syncAuthenticatedUser(result.user);
      router.push(profile.onboardingCompleted ? '/chat' : '/onboarding');
    } catch (error) {
      setError(getAuthErrorMessage(error, 'Unable to create your account right now. Please try again.'));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <aside className="hidden bg-[var(--color-sidebar)] px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <BrandMark size={38} />
              <div>
                <div className="text-[16px] font-semibold tracking-[-0.02em]">Vyarah</div>
                <div className="text-[11px] text-[#a59f97]">AI BuildDesk</div>
              </div>
            </div>
            <div className="mt-20 max-w-md">
              <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8f877e]">
                Built for steady work
              </p>
              <h1 className="mt-5 font-display text-[48px] leading-[1.05] tracking-[-0.03em]">
                Create a desk
                <br />
                you can return to.
              </h1>
              <p className="mt-6 text-[15px] leading-7 text-[#c7c1b8]">
                Save your chats, keep your context, and use one workspace across tax, legal, medical, property, business, and finance.
              </p>
            </div>
          </div>

          <blockquote className="max-w-md border-l border-[#3a352f] pl-5">
            <p className="font-display text-[30px] leading-[1.15] text-white">
              &ldquo;The interface feels measured. It lets the answer do the talking.&rdquo;
            </p>
            <footer className="mt-4 text-[13px] text-[#a59f97]">
              Ahmedabad founder
            </footer>
          </blockquote>
        </aside>

        <main className="flex items-center justify-center px-4 py-10 sm:px-6">
          <div className="w-full max-w-[440px] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-subtle)] sm:p-10">
            <div className="mb-8">
              <div className="flex items-center gap-3 lg:hidden">
                <BrandMark size={34} />
                <div>
                  <div className="text-[15px] font-semibold tracking-[-0.02em] text-[var(--color-text-primary)]">
                    Vyarah
                  </div>
                  <div className="text-[11px] text-[var(--color-text-muted)]">AI BuildDesk</div>
                </div>
              </div>
              <h1 className="mt-6 font-display text-[36px] leading-none text-[var(--color-text-primary)]">
                Create your account
              </h1>
              <p className="mt-3 text-[14px] leading-7 text-[var(--color-text-secondary)]">
                Start with a cleaner BuildDesk workspace and keep your conversations organised.
              </p>
            </div>

            {error || firebaseUnavailable ? (
              <div className="mb-5 flex items-start gap-2 rounded-[var(--radius-sm)] border border-[#f3d5d5] bg-[#fff5f5] px-3 py-3 text-[13px] text-[#b42318]">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error || (firebaseUnavailable ? FIREBASE_UNAVAILABLE_MESSAGE : '')}</span>
              </div>
            ) : null}

            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={googleLoading || firebaseUnavailable}
              className="inline-flex h-11 w-full items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white px-4 text-[14px] font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-accent-soft)] disabled:opacity-60"
            >
              {googleLoading ? (
                'Connecting...'
              ) : (
                <>
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-[var(--color-border)]" />
              <span className="text-[12px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                or
              </span>
              <div className="h-px flex-1 bg-[var(--color-border)]" />
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="mb-2 block text-[14px] font-medium text-[var(--color-text-primary)]">
                  Full name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <input
                    placeholder="Your name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white pl-10 pr-3 text-[14px] text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-text-primary)]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[14px] font-medium text-[var(--color-text-primary)]">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white pl-10 pr-3 text-[14px] text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-text-primary)]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[14px] font-medium text-[var(--color-text-primary)]">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white px-3 text-[14px] text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-text-primary)]"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading || firebaseUnavailable}
                className="inline-flex h-11 w-full items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-text-primary)] px-4 text-[14px] font-medium text-white transition-colors hover:bg-[var(--color-accent)] disabled:opacity-60"
              >
                {loading ? 'Creating account...' : 'Create account'}
                {!loading ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
              </button>
            </form>

            <p className="mt-6 text-center text-[14px] text-[var(--color-text-secondary)]">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-[var(--color-text-primary)] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
