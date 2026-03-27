'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
  domainColor: string;
  domainName: string;
  isStreaming?: boolean;
}

export function MessageBubble({
  message,
  domainColor,
  domainName,
  isStreaming,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Failed to copy message');
    }
  };

  if (isUser) {
    return (
      <div className="animate-message-in flex justify-end">
        <div className="max-w-[min(84%,42rem)]">
          <div className="rounded-[12px] rounded-br-[2px] bg-[var(--color-text-primary)] px-4 py-3 text-white shadow-[var(--shadow-subtle)]">
            <p className="whitespace-pre-wrap text-[15px] leading-6">{message.content}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-message-in group flex justify-start">
      <div className="max-w-[min(100%,56rem)]">
        <div className="mb-1.5 flex items-center gap-2 pl-0.5">
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            Vyarah AI
          </span>
          <span
            className="inline-flex items-center rounded-[var(--radius-sm)] px-2 py-1 text-[10px] font-medium"
            style={{
              backgroundColor: `color-mix(in srgb, ${domainColor} 15%, white)`,
              color: domainColor,
            }}
          >
            {domainName}
          </span>
        </div>

        <div
          className="relative rounded-[12px] rounded-tl-[2px] border bg-[var(--color-surface)] px-5 py-4 shadow-[var(--shadow-subtle)]"
          style={{
            borderColor: 'var(--color-border)',
            borderLeft: `3px solid ${domainColor}`,
          }}
        >
          {isStreaming && message.content ? (
            <div
              className="absolute right-4 top-4 h-2 w-2 rounded-full animate-pulse"
              style={{ backgroundColor: domainColor }}
            />
          ) : null}

          <div className="message-prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content || ' '}
            </ReactMarkdown>
          </div>

          {!isStreaming && message.content ? (
            <div className="mt-3 flex justify-end opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] px-2 py-1 text-[12px] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-text-primary)]"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy
                  </>
                )}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
