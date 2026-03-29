'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const DISMISS_KEY = 'vyarah_business_upsell_dismissed';

export function BusinessUpsellBanner() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const nextDismissed = window.sessionStorage.getItem(DISMISS_KEY) === '1';
    setDismissed(nextDismissed);
  }, []);

  const handleDismiss = () => {
    window.sessionStorage.setItem(DISMISS_KEY, '1');
    setDismissed(true);
  };

  if (dismissed) {
    return null;
  }

  return (
    <div className="max-w-[min(100%,56rem)] border border-[var(--color-border)] bg-white/34 px-4 py-4 shadow-[var(--shadow-subtle)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
            For growing teams
          </p>
          <h3 className="mt-2 font-display text-[24px] leading-[0.96] tracking-[-0.04em] text-[var(--color-text-primary)]">
            Need a custom AI system built for your business?
          </h3>
          <p className="mt-3 max-w-[38rem] text-[14px] leading-7 text-[var(--color-text-secondary)]">
            Vyarah builds end-to-end AI automation and websites.
          </p>
          <Link
            href="https://www.vyarah.com/#contact"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-text-secondary)]"
          >
            Talk to Vyarah →
          </Link>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss banner"
          className="inline-flex h-9 w-9 items-center justify-center border border-[var(--color-border)] bg-white/50 text-[var(--color-text-secondary)] transition-colors hover:bg-white hover:text-[var(--color-text-primary)]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
