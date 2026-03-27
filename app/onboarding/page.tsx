'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { fetchWithAuth } from '@/lib/client-api';
import { DOMAIN_LIST } from '@/lib/domains';
import { useAuth } from '@/components/providers/AuthProvider';
import { DomainId, OnboardingPersona } from '@/types';
import { getDomainVisual } from '@/components/chat/domain-theme';

const personas: { label: string; value: OnboardingPersona }[] = [
  { label: 'Salaried Professional', value: 'salaried-professional' },
  { label: 'Business Owner', value: 'business-owner' },
  { label: 'CA / Lawyer / Doctor', value: 'ca-lawyer-doctor' },
  { label: 'Student', value: 'student' },
  { label: 'Investor', value: 'investor' },
  { label: 'Other', value: 'other' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { loading, user } = useAuth();
  const [step, setStep] = useState(1);
  const [persona, setPersona] = useState<OnboardingPersona | null>(null);
  const [preferredDesk, setPreferredDesk] = useState<DomainId | null>(null);
  const [city, setCity] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?next=/onboarding');
    }
  }, [loading, router, user]);

  async function handleComplete() {
    if (!persona || !preferredDesk) {
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetchWithAuth('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city,
          persona,
          preferredDesk,
        }),
      });

      if (!response.ok) {
        throw new Error('Unable to save onboarding');
      }

      const starter = DOMAIN_LIST.find((domain) => domain.id === preferredDesk)?.suggestedQuestions[0];
      const url = new URL('/chat', window.location.origin);
      url.searchParams.set('desk', preferredDesk);
      if (starter) {
        url.searchParams.set('starter', starter);
      }
      url.searchParams.set('welcome', '1');
      router.push(`${url.pathname}?${url.searchParams.toString()}`);
    } catch {
      setError('Unable to save your setup right now. Please try again.');
      setSubmitting(false);
    }
  }

  if (loading || !user) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[var(--color-bg)] text-[14px] text-[var(--color-text-secondary)]">
        Loading onboarding...
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-[var(--color-bg)] px-4 py-10 sm:px-6">
      <div className="w-full max-w-[760px] border border-[var(--color-border)] bg-white/40 p-6 shadow-[var(--shadow-subtle)] sm:p-8">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
              Step {step} of 3
            </div>
            <h1 className="mt-3 font-display text-[34px] leading-[0.92] tracking-[-0.05em]">
              Welcome to BuildDesk
            </h1>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3].map((value) => (
              <span
                key={value}
                className={`h-1.5 w-10 ${value <= step ? 'bg-[var(--color-text-primary)]' : 'bg-[var(--color-border)]'}`}
              />
            ))}
          </div>
        </div>

        {step === 1 ? (
          <div className="pt-8">
            <h2 className="font-display text-[30px] leading-none">What best describes you?</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {personas.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPersona(option.value)}
                  className={`min-h-12 border px-4 py-4 text-left text-[15px] transition-colors ${
                    persona === option.value
                      ? 'border-[var(--color-text-primary)] bg-[var(--color-text-primary)] text-white'
                      : 'border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="pt-8">
            <h2 className="font-display text-[30px] leading-none">Which desk will you use most?</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {DOMAIN_LIST.map((domain) => {
                const visual = getDomainVisual(domain.id);

                return (
                  <button
                    key={domain.id}
                    type="button"
                    onClick={() => setPreferredDesk(domain.id)}
                    className={`min-h-12 border px-4 py-4 text-left transition-colors ${
                      preferredDesk === domain.id
                        ? 'border-[var(--color-text-primary)] bg-[var(--color-text-primary)] text-white'
                        : 'border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)]'
                    }`}
                  >
                    <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: preferredDesk === domain.id ? 'white' : visual.color }}>
                      {domain.shortName}
                    </div>
                    <div className="mt-2 text-[16px]">{domain.name}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="pt-8">
            <h2 className="font-display text-[30px] leading-none">What city are you in?</h2>
            <p className="mt-4 text-[15px] leading-7 text-[var(--color-text-secondary)]">
              Helps us give you more relevant guidance on local laws and regulations.
            </p>
            <input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Optional"
              className="mt-6 h-12 w-full border border-[var(--color-border)] bg-[var(--color-bg)] px-4 text-[15px] outline-none"
            />
            <button
              type="button"
              onClick={() => setCity('')}
              className="mt-4 text-[13px] uppercase tracking-[0.18em] text-[var(--color-text-secondary)]"
            >
              Skip for now
            </button>
          </div>
        ) : null}

        {error ? <p className="mt-6 text-[14px] text-[#b42318]">{error}</p> : null}

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-[var(--color-border)] pt-5">
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(1, current - 1))}
            className="min-h-11 border border-[var(--color-border)] px-4 py-2 text-[13px] font-medium uppercase tracking-[0.16em] text-[var(--color-text-primary)]"
            disabled={step === 1 || submitting}
          >
            Back
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((current) => Math.min(3, current + 1))}
              disabled={(step === 1 && !persona) || (step === 2 && !preferredDesk)}
              className="swiss-button min-h-11 px-4 py-2 text-[13px] font-medium uppercase tracking-[0.16em] disabled:opacity-50"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleComplete}
              disabled={!persona || !preferredDesk || submitting}
              className="swiss-button min-h-11 px-4 py-2 text-[13px] font-medium uppercase tracking-[0.16em] disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Finish setup'}
              {!submitting ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
