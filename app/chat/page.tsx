import { Suspense } from 'react';
import { ChatClient } from './chat-client';

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100dvh] items-center justify-center bg-[var(--color-bg)] text-[14px] text-[var(--color-text-secondary)]">
          Loading chat...
        </div>
      }
    >
      <ChatClient />
    </Suspense>
  );
}
