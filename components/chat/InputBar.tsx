'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUp, Loader2, Paperclip } from 'lucide-react';

interface InputBarProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  color?: string;
  showAttachment?: boolean;
}

export function InputBar({
  onSend,
  disabled,
  placeholder,
  color,
  showAttachment = false,
}: InputBarProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');

      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border border-[var(--color-border)] bg-[rgba(255,255,255,0.52)] p-3 shadow-[var(--shadow-subtle)] transition-shadow focus-within:border-[var(--color-text-primary)]">
      <div className="flex items-end gap-3">
        {showAttachment ? (
          <button
            type="button"
            disabled
            title="File upload is available for Pro accounts."
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center text-[var(--color-text-muted)]"
          >
            <Paperclip className="h-4 w-4" />
          </button>
        ) : null}

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Ask Vyarah AI anything...'}
          disabled={disabled}
          className="min-h-[24px] max-h-[150px] flex-1 resize-none border-0 bg-transparent px-0 py-1 text-[15px] leading-6 text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
          rows={1}
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled || !input.trim()}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center bg-[var(--color-text-primary)] text-white transition-colors disabled:cursor-not-allowed disabled:bg-[#d6d2cb]"
          style={{
            backgroundColor: input.trim() && !disabled ? 'var(--color-text-primary)' : undefined,
          }}
          onMouseEnter={(event) => {
            if (!disabled && input.trim()) {
              event.currentTarget.style.backgroundColor = color || 'var(--color-accent)';
            }
          }}
          onMouseLeave={(event) => {
            if (!disabled && input.trim()) {
              event.currentTarget.style.backgroundColor = 'var(--color-text-primary)';
            }
          }}
        >
          {disabled ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
