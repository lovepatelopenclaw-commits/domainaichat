'use client';

import { FormEvent, useState } from 'react';

const firmTypes = [
  'CA Firm',
  'Law Firm',
  'Clinic',
  'Financial Advisory',
  'Other',
] as const;

type FirmType = (typeof firmTypes)[number];

export function WhiteLabelDemoForm() {
  const [form, setForm] = useState<{
    email: string;
    firmName: string;
    firmType: FirmType;
    fullName: string;
  }>({
    email: '',
    firmName: '',
    firmType: firmTypes[0],
    fullName: '',
  });
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('saving');
    setError('');

    try {
      const response = await fetch('/api/white-label-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to submit your request right now.');
      }

      setStatus('success');
      setForm({
        email: '',
        firmName: '',
        firmType: firmTypes[0],
        fullName: '',
      });
    } catch (submissionError) {
      setStatus('error');
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Unable to submit your request right now.'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="surface-card p-6 sm:p-7">
      <div className="flex items-end justify-between gap-4 border-b border-[var(--color-border)] pb-6">
        <div>
          <p className="eyebrow-label">Demo request</p>
          <h2 className="mt-3 font-display text-[34px] leading-[0.94] tracking-[-0.05em]">
            See your branded BuildDesk
          </h2>
        </div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
          Response within one business day
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <label className="grid gap-2">
          <span className="text-[12px] uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
            Full Name
          </span>
          <input
            required
            type="text"
            value={form.fullName}
            onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
            className="min-h-12 border border-[var(--color-border)] bg-white/40 px-4 text-[14px] outline-none transition-colors focus:border-[rgba(17,17,17,0.28)]"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-[12px] uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
            Firm Name
          </span>
          <input
            required
            type="text"
            value={form.firmName}
            onChange={(event) => setForm((current) => ({ ...current, firmName: event.target.value }))}
            className="min-h-12 border border-[var(--color-border)] bg-white/40 px-4 text-[14px] outline-none transition-colors focus:border-[rgba(17,17,17,0.28)]"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-[12px] uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
            Email
          </span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            className="min-h-12 border border-[var(--color-border)] bg-white/40 px-4 text-[14px] outline-none transition-colors focus:border-[rgba(17,17,17,0.28)]"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-[12px] uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
            Firm Type
          </span>
          <select
            value={form.firmType}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                firmType: event.target.value as FirmType,
              }))
            }
            className="min-h-12 border border-[var(--color-border)] bg-white/40 px-4 text-[14px] outline-none transition-colors focus:border-[rgba(17,17,17,0.28)]"
          >
            {firmTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>

      {status === 'success' ? (
        <p className="mt-5 border border-[var(--color-border)] bg-white/32 px-4 py-3 text-[14px] text-[var(--color-text-primary)]">
          Thanks. We have your request and will reach out shortly.
        </p>
      ) : null}

      {status === 'error' ? (
        <p className="mt-5 border border-[rgba(17,17,17,0.2)] bg-white/32 px-4 py-3 text-[14px] text-[var(--color-text-primary)]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === 'saving'}
        className="swiss-button mt-6 min-h-12 w-full px-5 py-3 text-[13px] font-medium uppercase tracking-[0.18em] disabled:opacity-60"
      >
        {status === 'saving' ? 'Submitting...' : 'Request a Demo'}
      </button>
    </form>
  );
}
