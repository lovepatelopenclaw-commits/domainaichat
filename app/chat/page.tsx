'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Menu, Plus } from 'lucide-react';
import { Conversation, DomainId, UsagePlan } from '@/types';
import { DOMAINS } from '@/lib/domains';
import { fetchWithAuth } from '@/lib/client-api';
import { useAuth } from '@/components/providers/AuthProvider';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { getDomainVisual } from '@/components/chat/domain-theme';
import { Sidebar } from '@/components/layout/Sidebar';

export default function ChatPage() {
  const [selectedDomain, setSelectedDomain] = useState<DomainId>('ca-tax');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const [resetToken, setResetToken] = useState(0);
  const [usagePlan, setUsagePlan] = useState<UsagePlan>('guest');
  const { user } = useAuth();
  const router = useRouter();

  const domainConfig = DOMAINS[selectedDomain];
  const domainVisual = getDomainVisual(selectedDomain);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  useEffect(() => {
    let ignore = false;

    async function loadUsage() {
      if (!user) {
        setUsagePlan('guest');
        return;
      }

      const response = await fetchWithAuth('/api/usage');

      if (!response.ok) {
        if (!ignore) {
          setUsagePlan('free');
        }

        return;
      }

      const data = await response.json();

      if (!ignore) {
        setUsagePlan(data.plan ?? 'free');
      }
    }

    loadUsage().catch(() => {
      if (!ignore) {
        setUsagePlan(user ? 'free' : 'guest');
      }
    });

    return () => {
      ignore = true;
    };
  }, [user]);

  const handleNewChat = () => {
    setActiveConversationId(null);
    setResetToken((current) => current + 1);
    setSidebarOpen(false);
  };

  const handleDomainChange = (domain: DomainId) => {
    setSelectedDomain(domain);
    setActiveConversationId(null);
    setResetToken((current) => current + 1);
    setSidebarOpen(false);
  };

  const handleConversationSelected = (conversation: Conversation) => {
    setSelectedDomain(conversation.domain);
    setActiveConversationId(conversation.id);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[var(--color-bg)]">
      <Sidebar
        activeConversationId={activeConversationId}
        selectedDomain={selectedDomain}
        onDomainChange={handleDomainChange}
        onNewChat={handleNewChat}
        onSelectConversation={handleConversationSelected}
        refreshToken={refreshToken}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        usagePlan={usagePlan}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="h-1 md:hidden" style={{ backgroundColor: domainVisual.color }} />

        <div className="border-b border-[var(--color-border)] bg-[rgba(242,242,242,0.92)] backdrop-blur-md">
          <div className="flex min-h-16 items-center gap-3 px-4 py-3 sm:px-6">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center border border-[var(--color-border)] bg-[rgba(255,255,255,0.42)] text-[var(--color-text-primary)] transition-colors hover:bg-white md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 border border-[var(--color-border)] bg-[rgba(255,255,255,0.42)] px-3 py-2 text-[13px] font-medium text-[var(--color-text-primary)] transition-colors hover:bg-white"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
                {domainConfig.name}
              </p>
              <div className="mt-1 flex items-center gap-2 text-[14px] font-medium text-[var(--color-text-primary)]">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: domainVisual.color }}
                />
                <span className="truncate font-display text-[22px] leading-none tracking-[-0.05em]">
                  BuildDesk Chat
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNewChat}
              className="hidden items-center gap-2 border border-[var(--color-border)] bg-[rgba(255,255,255,0.42)] px-3 py-2 text-[13px] font-medium text-[var(--color-text-primary)] transition-colors hover:bg-white sm:inline-flex"
            >
              <Plus className="h-4 w-4" />
              New chat
            </button>

            {usagePlan !== 'pro' ? (
              <Link
                href="/pricing"
                className="inline-flex border border-[var(--color-text-primary)] bg-[var(--color-text-primary)] px-3 py-2 text-[12px] font-medium uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#2a2a2a]"
              >
                Upgrade
              </Link>
            ) : (
              <div className="hidden text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-secondary)] sm:block">
                Pro active
              </div>
            )}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
          <ChatWindow
            conversationId={activeConversationId}
            domain={selectedDomain}
            resetToken={resetToken}
            usagePlan={usagePlan}
            onConversationSaved={(conversationId) => {
              if (conversationId) {
                setActiveConversationId(conversationId);
              }

              setRefreshToken((current) => current + 1);
            }}
            onUsageLimitReached={() => {
              alert("You've reached your daily question limit. Upgrade to Pro for unlimited access.");
            }}
          />
        </div>
      </div>
    </div>
  );
}
