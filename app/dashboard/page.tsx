'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Clock3,
  Crown,
  MessageSquare,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { fetchWithAuth } from '@/lib/client-api';
import { useAuth } from '@/components/providers/AuthProvider';
import { getDomainVisual } from '@/components/chat/domain-theme';
import { Conversation, UsageSummary } from '@/types';
import { DOMAINS } from '@/lib/domains';
import { canAccessWhatsapp, canAccessWhitelabel, getPlanLabel } from '@/lib/plans';

export default function DashboardPage() {
  const router = useRouter();
  const { loading, user } = useAuth();
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [recentChats, setRecentChats] = useState<Conversation[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?next=/dashboard');
    }
  }, [loading, router, user]);

  useEffect(() => {
    let ignore = false;

    async function loadDashboardData() {
      if (!user) {
        return;
      }

      const [usageResponse, conversationsResponse] = await Promise.all([
        fetchWithAuth('/api/usage'),
        fetchWithAuth('/api/conversations'),
      ]);

      if (!ignore && usageResponse.ok) {
        const usageData = await usageResponse.json();
        setUsage(usageData);
      }

      if (!ignore && conversationsResponse.ok) {
        const conversationData = await conversationsResponse.json();
        setRecentChats((conversationData.conversations ?? []).slice(0, 6));
      }
    }

    loadDashboardData().catch(() => {
      if (!ignore) {
        setUsage(null);
        setRecentChats([]);
      }
    });

    return () => {
      ignore = true;
    };
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[var(--color-bg)]">
        <div className="flex items-center gap-3 text-[14px] text-[var(--color-text-secondary)]">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent)]" />
          Loading your BuildDesk workspace...
        </div>
      </div>
    );
  }

  const planLabel = usage ? getPlanLabel(usage.plan) : 'Personal';
  const canSeeWhitelabel = usage ? canAccessWhitelabel(usage.plan) : false;
  const canSeeWhatsapp = usage ? canAccessWhatsapp(usage.plan) : false;
  const usageLabel = usage
    ? usage.limit === null
      ? `${usage.current} today`
      : `${usage.current}/${usage.limit} today`
    : 'Loading...';

  return (
    <div className="flex-1 bg-[var(--color-bg)]">
      <div className="mx-auto max-w-[1080px] px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
              Workspace
            </p>
            <h1 className="mt-4 font-display text-[40px] leading-none text-[var(--color-text-primary)]">
              Welcome back
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-7 text-[var(--color-text-secondary)]">
              Track usage, revisit recent conversations, and keep BuildDesk moving with you through the day.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[13px] font-medium text-[var(--color-text-primary)]">
              <Crown className="h-4 w-4 text-[var(--color-accent)]" />
              {planLabel} Plan
            </div>
            {usage?.plan === 'guest' || usage?.plan === 'personal' ? (
              <Link
                href="/pricing"
                className="inline-flex items-center rounded-[var(--radius-sm)] border border-[var(--color-accent)] px-4 py-2 text-[13px] font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent-soft)]"
              >
                Upgrade
              </Link>
            ) : null}
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="surface-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[24px] font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">
                  {recentChats.length}
                </div>
                <div className="text-[13px] text-[var(--color-text-secondary)]">Recent conversations</div>
              </div>
            </div>
          </div>

          <div className="surface-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-accent-soft)] text-[var(--finance)]">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[24px] font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">
                  {usageLabel}
                </div>
                <div className="text-[13px] text-[var(--color-text-secondary)]">Today&apos;s usage</div>
              </div>
            </div>
          </div>

          <div className="surface-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-accent-soft)] text-[var(--ca-tax)]">
                <Clock3 className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[16px] font-semibold text-[var(--color-text-primary)]">
                  {recentChats[0]
                    ? new Date(recentChats[0].updatedAt).toLocaleDateString(undefined, {
                        day: 'numeric',
                        month: 'short',
                      })
                    : 'No recent chats'}
                </div>
                <div className="text-[13px] text-[var(--color-text-secondary)]">Last activity</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="surface-card p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-[28px] leading-none text-[var(--color-text-primary)]">
                  Daily usage
                </h2>
                <p className="mt-3 text-[14px] leading-7 text-[var(--color-text-secondary)]">
                  A quick view of how much BuildDesk you&apos;ve used today.
                </p>
              </div>
              <Sparkles className="h-5 w-5 text-[var(--color-accent)]" />
            </div>

            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between text-[13px] text-[var(--color-text-secondary)]">
                <span>Usage progress</span>
                <span>
                  {usage
                    ? usage.limit === null
                      ? 'Unlimited'
                      : `${usage.current} of ${usage.limit}`
                    : 'Loading...'}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-[var(--radius-sm)] bg-[#ece8e1]">
                <div
                  className="h-full rounded-[var(--radius-sm)] bg-[var(--color-accent)] transition-all"
                  style={{
                    width:
                      usage && typeof usage.limit === 'number'
                        ? `${Math.min((usage.current / usage.limit) * 100, 100)}%`
                        : '100%',
                  }}
                />
              </div>
              {usage?.plan === 'guest' || usage?.plan === 'personal' ? (
                <p className="mt-3 text-[13px] text-[var(--color-text-secondary)]">
                  Move up when you need team workflows, APIs, or white-label controls.
                </p>
              ) : null}
            </div>
          </section>

          <section className="rounded-[var(--radius-md)] bg-[var(--color-text-primary)] p-7 text-white">
            <h2 className="font-display text-[28px] leading-none">Your account</h2>
            <p className="mt-3 text-[14px] leading-7 text-white/72">
              Signed in as {user.email}. Your BuildDesk workspace is ready across every domain.
            </p>
            <div className="mt-8 space-y-3 text-[14px]">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-white/72">Plan</span>
                <span>{planLabel}</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-white/72">Saved chats</span>
                <span>{recentChats.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/72">Workspace</span>
                <span>BuildDesk</span>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/chat"
                className="inline-flex items-center rounded-[var(--radius-sm)] border border-[var(--color-accent)] px-4 py-2 text-[13px] font-medium text-[var(--color-accent)] transition-colors hover:bg-white/6"
              >
                Open chat <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              {canSeeWhatsapp ? (
                <Link
                  href="/dashboard/integrations/whatsapp"
                  className="inline-flex items-center rounded-[var(--radius-sm)] border border-white/18 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-white/6"
                >
                  WhatsApp
                </Link>
              ) : null}
              {canSeeWhitelabel ? (
                <Link
                  href="/dashboard/whitelabel"
                  className="inline-flex items-center rounded-[var(--radius-sm)] border border-white/18 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-white/6"
                >
                  White-label
                </Link>
              ) : null}
            </div>
          </section>
        </div>

        <section className="mt-8 surface-card p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-[28px] leading-none text-[var(--color-text-primary)]">
                Recent conversations
              </h2>
              <p className="mt-3 text-[14px] leading-7 text-[var(--color-text-secondary)]">
                Pick up where you left off without hunting through the sidebar.
              </p>
            </div>
            <Link
              href="/chat"
              className="inline-flex items-center text-[13px] font-medium text-[var(--color-accent)] hover:underline"
            >
              Open BuildDesk
            </Link>
          </div>

          <div className="mt-8 space-y-3">
            {recentChats.length === 0 ? (
              <div className="rounded-[var(--radius-sm)] border border-dashed border-[var(--color-border)] px-4 py-8 text-center text-[14px] text-[var(--color-text-secondary)]">
                Your saved conversations will appear here once you start using BuildDesk.
              </div>
            ) : (
              recentChats.map((chat) => {
                const visual = getDomainVisual(chat.domain);
                const Icon = visual.icon;
                const domainName = DOMAINS[chat.domain].name;

                return (
                  <Link
                    key={chat.id}
                    href="/chat"
                    className="flex items-center gap-4 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 transition-colors hover:border-[var(--color-accent)]"
                  >
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-accent-soft)]"
                      style={{ color: visual.color }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[14px] font-medium text-[var(--color-text-primary)]">
                        {chat.title}
                      </div>
                      <div className="mt-1 text-[12px] text-[var(--color-text-secondary)]">
                        {domainName} · {new Date(chat.updatedAt).toLocaleString()}
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
