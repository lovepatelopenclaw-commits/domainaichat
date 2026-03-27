'use client';

import { Domain } from '@/types';
import { getDomainVisual } from './domain-theme';

interface EmptyStateProps {
  domain: Domain;
  onSelectQuestion: (question: string) => void;
}

export function EmptyState({ domain, onSelectQuestion }: EmptyStateProps) {
  const visual = getDomainVisual(domain.id);

  return (
    <div className="flex w-full items-center justify-center py-8">
      <div className="w-full max-w-[980px]">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
          Vyarah AI BuildDesk
        </p>
        <h2 className="mt-3 font-display text-[34px] leading-[0.92] tracking-[-0.05em] text-[var(--color-text-primary)] sm:text-[46px]">
          {domain.name}
        </h2>
        <p className="mt-4 max-w-[44rem] text-[15px] leading-7 text-[var(--color-text-secondary)]">
          Ask a concrete question about {domain.name.toLowerCase()} and start from one of these prompts. The interface
          stays quiet so the answer is what you focus on.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {domain.suggestedQuestions.slice(0, 4).map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => onSelectQuestion(question)}
              className="interactive-card group relative overflow-hidden border border-[var(--color-border)] bg-[rgba(255,255,255,0.42)] p-5 text-left"
            >
              <span
                className="absolute inset-y-0 left-0 w-1"
                style={{ backgroundColor: visual.color }}
              />
              <span className="block pr-4 text-[15px] leading-7 text-[var(--color-text-primary)]">
                {question}
              </span>
              <span
                className="mt-5 inline-flex text-[12px] font-medium uppercase tracking-[0.18em] transition-colors group-hover:text-[var(--color-text-primary)]"
                style={{ color: visual.color }}
              >
                Ask this
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
