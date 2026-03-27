'use client';

import { DomainId } from '@/types';
import { DOMAIN_LIST } from '@/lib/domains';
import { getDomainVisual } from './domain-theme';

interface DomainSelectorProps {
  selected: DomainId;
  onSelect: (domain: DomainId) => void;
  variant?: 'grid' | 'list' | 'compact';
}

export function DomainSelector({
  selected,
  onSelect,
  variant = 'grid',
}: DomainSelectorProps) {
  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap gap-2">
        {DOMAIN_LIST.map((domain) => {
          const visual = getDomainVisual(domain.id);
          const isSelected = selected === domain.id;

          return (
            <button
              key={domain.id}
              type="button"
              onClick={() => onSelect(domain.id)}
              className={`inline-flex items-center gap-2 rounded-[var(--radius-sm)] border px-3 py-2 text-[13px] font-medium transition-colors ${
                isSelected
                  ? 'border-transparent bg-[var(--color-text-primary)] text-white'
                  : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-primary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <span className="text-base" aria-hidden="true">
                {visual.emoji}
              </span>
              {domain.shortName}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="space-y-1">
        {DOMAIN_LIST.map((domain) => {
          const visual = getDomainVisual(domain.id);
          const isSelected = selected === domain.id;

          return (
            <button
              key={domain.id}
              type="button"
              onClick={() => onSelect(domain.id)}
              className={`group relative flex h-9 w-full items-center gap-3 overflow-hidden rounded-[var(--radius-sm)] px-3 text-left text-[14px] font-medium transition-colors ${
                isSelected
                  ? 'bg-[var(--color-sidebar-hover)] text-white'
                  : 'text-[#d7d2ca] hover:bg-[#242424]'
              }`}
            >
              <span
                className={`absolute inset-y-0 left-0 w-0.5 transition-all duration-150 ${
                  isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'
                }`}
                style={{ backgroundColor: visual.color }}
              />
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: visual.color }}
              />
              <span className="truncate">{domain.name}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {DOMAIN_LIST.map((domain) => {
        const visual = getDomainVisual(domain.id);
        const isSelected = selected === domain.id;

        return (
          <button
            key={domain.id}
            type="button"
            onClick={() => onSelect(domain.id)}
            className={`interactive-card surface-card group relative flex flex-col items-start gap-3 p-6 text-left ${
              isSelected ? 'shadow-[var(--shadow-floating)]' : ''
            }`}
            style={{
              borderTop: `3px solid ${visual.color}`,
              boxShadow: isSelected ? '0 4px 20px rgba(0,0,0,0.08)' : undefined,
            }}
          >
            <span className="text-2xl" aria-hidden="true">
              {visual.emoji}
            </span>
            <span className="text-[16px] font-semibold text-[var(--color-text-primary)]">
              {domain.name}
            </span>
            <span className="text-[13px] italic text-[var(--color-text-secondary)]">
              {domain.suggestedQuestions[0]}
            </span>
            <span
              className="mt-2 text-[13px] font-medium opacity-0 transition-opacity group-hover:opacity-100"
              style={{ color: visual.color }}
            >
              Ask now →
            </span>
          </button>
        );
      })}
    </div>
  );
}
