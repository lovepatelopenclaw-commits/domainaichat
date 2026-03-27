'use client';

interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
  color?: string;
  compact?: boolean;
}

export function SuggestedQuestions({
  questions,
  onSelect,
  color = 'var(--color-accent)',
  compact = false,
}: SuggestedQuestionsProps) {
  if (!questions.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 pb-1">
      {questions.map((question, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelect(question)}
          className={`max-w-[320px] rounded-[var(--radius-sm)] border bg-[var(--color-surface)] text-left text-[var(--color-text-secondary)] transition-colors ${
            compact ? 'px-3 py-2 text-[13px]' : 'px-3.5 py-2.5 text-[13px]'
          }`}
          style={{ borderColor: 'var(--color-border)' }}
          onMouseEnter={(event) => {
            event.currentTarget.style.borderColor = color;
            event.currentTarget.style.color = color;
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.borderColor = 'var(--color-border)';
            event.currentTarget.style.color = 'var(--color-text-secondary)';
          }}
        >
          {question}
        </button>
      ))}
    </div>
  );
}
