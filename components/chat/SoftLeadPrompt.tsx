'use client';

import { useState } from 'react';

interface SoftLeadPromptProps {
  color: string;
  onSave: (email: string) => Promise<void>;
  onSkip: () => void;
}

export function SoftLeadPrompt({ color, onSave, onSkip }: SoftLeadPromptProps) {
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    if (!email.trim()) {
      setError('Enter your email to save this conversation.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await onSave(email.trim());
    } catch {
      setError('Unable to save right now. Please try again.');
      setSaving(false);
    }
  }

  return (
    <div className="max-w-[min(100%,56rem)]">
      <div className="mb-1.5 flex items-center gap-2 pl-0.5">
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
          BuildDesk
        </span>
      </div>
      <div
        className="rounded-[12px] rounded-tl-[2px] border bg-[var(--color-surface)] px-5 py-4 shadow-[var(--shadow-subtle)]"
        style={{
          borderColor: 'var(--color-border)',
          borderLeft: `3px solid ${color}`,
        }}
      >
        <p className="text-[15px] leading-7 text-[var(--color-text-primary)]">
          Want to save this conversation? Enter your email and we&apos;ll keep it for you.
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            className="min-h-11 border border-[var(--color-border)] bg-white/70 px-4 text-[14px] outline-none"
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="swiss-button min-h-11 px-4 py-2 text-[13px] font-medium uppercase tracking-[0.16em] disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save & Continue'}
          </button>
        </div>

        {error ? (
          <p className="mt-3 text-[13px] text-[#b42318]">{error}</p>
        ) : (
          <p className="mt-3 text-[13px] text-[var(--color-text-secondary)]">
            No spam. No password needed yet.
          </p>
        )}

        <button
          type="button"
          onClick={onSkip}
          className="mt-4 text-[12px] uppercase tracking-[0.16em] text-[var(--color-text-secondary)]"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
