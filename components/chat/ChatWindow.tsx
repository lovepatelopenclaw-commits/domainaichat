'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Message, DomainId, UsagePlan } from '@/types';
import { DOMAINS } from '@/lib/domains';
import { canUploadFiles } from '@/lib/plans';
import { fetchWithAuth } from '@/lib/client-api';
import { useAuth } from '@/components/providers/AuthProvider';
import { EmptyState } from './EmptyState';
import { InputBar } from './InputBar';
import { MessageBubble } from './MessageBubble';
import { SoftLeadPrompt } from './SoftLeadPrompt';
import { SuggestedQuestions } from './SuggestedQuestions';
import { getDomainVisual } from './domain-theme';

interface ChatWindowProps {
  conversationId: string | null;
  domain: DomainId;
  onConversationSaved?: (conversationId: string | null) => void;
  onUsageLimitReached?: () => void;
  resetToken: number;
  usagePlan?: UsagePlan;
  initialStarterQuestion?: string | null;
  welcomeMessage?: string | null;
  workspaceToken?: string | null;
}

export function ChatWindow({
  domain,
  conversationId,
  onConversationSaved,
  onUsageLimitReached,
  resetToken,
  usagePlan = 'guest',
  initialStarterQuestion,
  welcomeMessage,
  workspaceToken,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [loadingConversation, setLoadingConversation] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(conversationId);
  const [guestSessionId, setGuestSessionId] = useState<string | null>(null);
  const [softLeadState, setSoftLeadState] = useState<'hidden' | 'prompt' | 'saved' | 'skipped'>('hidden');
  const bottomRef = useRef<HTMLDivElement>(null);
  const domainConfig = DOMAINS[domain];
  const domainVisual = getDomainVisual(domain);
  const { user } = useAuth();

  useEffect(() => {
    setCurrentConversationId(conversationId);
  }, [conversationId]);

  useEffect(() => {
    setMessages([]);
    setFollowUpQuestions([]);
    setCurrentConversationId(null);
  }, [resetToken]);

  useEffect(() => {
    let ignore = false;

    async function loadConversationMessages() {
      if (!user || !conversationId) {
        if (!conversationId) {
          setMessages([]);
          setFollowUpQuestions([]);
        }

        return;
      }

      setLoadingConversation(true);
      const response = await fetchWithAuth(`/api/conversations/${conversationId}/messages`);

      if (!response.ok) {
        if (!ignore) {
          setLoadingConversation(false);
        }

        return;
      }

      const data = await response.json();

      if (!ignore) {
        setMessages(data.messages ?? []);
        setFollowUpQuestions([]);
        setLoadingConversation(false);
      }
    }

    loadConversationMessages().catch(() => {
      if (!ignore) {
        setLoadingConversation(false);
      }
    });

    return () => {
      ignore = true;
    };
  }, [conversationId, user]);

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [followUpQuestions, isStreaming, messages]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const existingSessionId = window.sessionStorage.getItem('vyarah_guest_session_id');
    const nextSessionId = existingSessionId || crypto.randomUUID();
    window.sessionStorage.setItem('vyarah_guest_session_id', nextSessionId);
    setGuestSessionId(nextSessionId);

    const captureState = window.sessionStorage.getItem(`vyarah_guest_capture_${nextSessionId}`);

    if (captureState === 'saved' || captureState === 'skipped') {
      setSoftLeadState(captureState);
    }
  }, []);

  useEffect(() => {
    if (initialStarterQuestion && messages.length === 0 && !isStreaming) {
      void sendMessage(initialStarterQuestion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialStarterQuestion]);

  useEffect(() => {
    if (user || softLeadState === 'saved' || softLeadState === 'skipped') {
      return;
    }

    const assistantAnswers = messages.filter(
      (message) => message.role === 'assistant' && message.content.trim().length > 0
    ).length;

    if (assistantAnswers >= 2) {
      setSoftLeadState('prompt');
    }
  }, [messages, softLeadState, user]);

  const sendMessage = async (content: string) => {
    if (isStreaming || !content.trim()) {
      return;
    }

    const userMessage: Message = {
      content: content.trim(),
      conversationId: currentConversationId ?? undefined,
      createdAt: new Date().toISOString(),
      domain,
      id: crypto.randomUUID(),
      role: 'user',
    };

    const assistantMessage: Message = {
      content: '',
      conversationId: currentConversationId ?? undefined,
      createdAt: new Date().toISOString(),
      domain,
      id: crypto.randomUUID(),
      role: 'assistant',
    };

    const nextMessages = [...messages, userMessage];
    setMessages((current) => [...current, userMessage, assistantMessage]);
    setIsStreaming(true);
    setFollowUpQuestions([]);

    try {
      const response = await fetchWithAuth('/api/chat', {
        body: JSON.stringify({
          conversationId: currentConversationId,
          domain,
          messages: nextMessages.map((message) => ({
            content: message.content,
            role: message.role,
          })),
          workspaceToken,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      if (response.status === 429) {
        const data = await response.json();
        setMessages((current) => current.filter((message) => message.id !== assistantMessage.id));
        onUsageLimitReached?.();
        alert(data.message || "You've reached your daily question limit. Upgrade to Pro for unlimited access.");
        setIsStreaming(false);
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Unable to get a response' }));
        throw new Error(data.error || 'Unable to get a response');
      }

      const reader = response.body?.getReader();

      if (!reader) {
        throw new Error('Unable to read the response stream');
      }

      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) {
            continue;
          }

          try {
            const data = JSON.parse(line.slice(6));

            if (data.error) {
              throw new Error(data.error);
            }

            if (data.content) {
              fullContent += data.content;
              setMessages((current) =>
                current.map((message) =>
                  message.id === assistantMessage.id
                    ? { ...message, content: fullContent }
                    : message
                )
              );
            }

            if (data.followUpQuestions) {
              setFollowUpQuestions(data.followUpQuestions);
            }

            if (data.conversationId) {
              setCurrentConversationId(data.conversationId);
              onConversationSaved?.(data.conversationId);
            }
          } catch (error) {
            if (error instanceof SyntaxError) {
              continue;
            }

            throw error;
          }
        }
      }
    } catch {
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantMessage.id
            ? {
                ...message,
                content:
                  'Sorry, I encountered an error processing your request. Please try again.',
              }
            : message
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  const handleSaveGuestLead = async (email: string) => {
    if (!guestSessionId) {
      throw new Error('Guest session missing');
    }

    const latestAssistantMessage = [...messages]
      .reverse()
      .find((message) => message.role === 'assistant' && message.content.trim());

    const response = await fetch('/api/guest-leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        approximateQuestionCount: messages.filter((message) => message.role === 'user').length,
        desk: domain,
        email,
        lastAnswer: latestAssistantMessage?.content ?? null,
        sessionId: guestSessionId,
      }),
    });

    if (!response.ok) {
      throw new Error('Unable to save lead');
    }

    window.sessionStorage.setItem(`vyarah_guest_capture_${guestSessionId}`, 'saved');
    setSoftLeadState('saved');
  };

  const handleSkipGuestLead = () => {
    if (guestSessionId) {
      window.sessionStorage.setItem(`vyarah_guest_capture_${guestSessionId}`, 'skipped');
    }

    setSoftLeadState('skipped');
  };

  const handleShare = async (messageId: string) => {
    const messageIndex = messages.findIndex((message) => message.id === messageId);
    const answerMessage = messages[messageIndex];
    const questionMessage = [...messages.slice(0, messageIndex)]
      .reverse()
      .find((message) => message.role === 'user');

    if (!answerMessage || !questionMessage) {
      throw new Error('Unable to create share link');
    }

    const response = await fetch('/api/share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answer: answerMessage.content,
        desk: domain,
        question: questionMessage.content,
      }),
    });

    if (!response.ok) {
      throw new Error('Unable to create share link');
    }

    const data = await response.json();
    await navigator.clipboard.writeText(data.url);
  };

  const showSuggested = !loadingConversation && messages.length === 0;

  return (
    <div className="grid h-full min-h-0 grid-rows-[1fr_auto] bg-[var(--color-bg)]">
      <div className="min-h-0 overflow-y-auto overscroll-contain">
        <div className="mx-auto flex min-h-full w-full max-w-[980px] flex-col px-4 sm:px-6">
          {loadingConversation ? (
            <div className="flex items-center gap-2 py-6 pl-1 text-[var(--color-text-secondary)]">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-[14px]">Loading conversation...</span>
            </div>
          ) : null}

          {showSuggested ? (
            <div className="flex flex-1 items-center py-6">
              <EmptyState domain={domainConfig} onSelectQuestion={handleSuggestedQuestion} />
            </div>
          ) : (
            <div className="w-full space-y-5 py-6">
              {welcomeMessage && messages.length === 0 ? (
                <div className="max-w-[min(100%,56rem)] border border-[var(--color-border)] bg-white/40 px-4 py-3 text-[14px] text-[var(--color-text-secondary)]">
                  {welcomeMessage}
                </div>
              ) : null}
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  domainColor={domainVisual.color}
                  domainName={domainConfig.name}
                  isStreaming={
                    isStreaming &&
                    message.id === messages[messages.length - 1]?.id &&
                    message.role === 'assistant'
                  }
                  onShare={
                    message.role === 'assistant' && message.content.trim()
                      ? () => handleShare(message.id)
                      : undefined
                  }
                />
              ))}

              {softLeadState === 'prompt' ? (
                <SoftLeadPrompt
                  color={domainVisual.color}
                  onSave={handleSaveGuestLead}
                  onSkip={handleSkipGuestLead}
                />
              ) : null}

              {softLeadState === 'saved' ? (
                <div className="max-w-[min(100%,56rem)] border border-[var(--color-border)] bg-white/40 px-4 py-3 text-[14px] text-[var(--color-text-primary)]">
                  Got it - your answers are saved.
                </div>
              ) : null}

              {isStreaming &&
              messages[messages.length - 1]?.role === 'assistant' &&
              messages[messages.length - 1]?.content === '' ? (
                <div className="animate-message-in max-w-[min(100%,54rem)]">
                  <div className="mb-1.5 pl-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    Vyarah AI is thinking...
                  </div>
                  <div
                    className="rounded-[12px] rounded-tl-[2px] border bg-[var(--color-surface)] px-5 py-4 shadow-[var(--shadow-subtle)]"
                    style={{
                      borderColor: 'var(--color-border)',
                      borderLeft: `3px solid ${domainVisual.color}`,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="thinking-dot h-2 w-2 rounded-full"
                        style={{ backgroundColor: domainVisual.color }}
                      />
                      <span
                        className="thinking-dot h-2 w-2 rounded-full"
                        style={{ backgroundColor: domainVisual.color }}
                      />
                      <span
                        className="thinking-dot h-2 w-2 rounded-full"
                        style={{ backgroundColor: domainVisual.color }}
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {!isStreaming && followUpQuestions.length > 0 ? (
                <div className="space-y-2 pl-1 pt-1">
                  <p className="text-[12px] font-medium text-[var(--color-text-muted)]">
                    Suggested next questions
                  </p>
                  <SuggestedQuestions
                    questions={followUpQuestions}
                    onSelect={handleSuggestedQuestion}
                    color={domainVisual.color}
                    compact
                  />
                </div>
              ) : null}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <div
        className="sticky bottom-0 border-t border-[var(--color-border)] bg-[rgba(242,242,242,0.94)] px-3 py-3 backdrop-blur-md sm:px-6 sm:py-4"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <div className="mx-auto max-w-[980px]">
          <InputBar
            onSend={sendMessage}
            disabled={isStreaming || loadingConversation}
            placeholder="Ask Vyarah AI anything..."
            color={domainVisual.color}
            showAttachment={canUploadFiles(usagePlan)}
          />
          <p className="mt-2 text-center text-[11px] text-[var(--color-text-muted)]">
            Built for India. Verify important decisions with a qualified professional.
          </p>
        </div>
      </div>
    </div>
  );
}
