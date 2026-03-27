'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, LogIn, LogOut, Plus, Settings } from 'lucide-react';
import { DOMAINS } from '@/lib/domains';
import { fetchWithAuth } from '@/lib/client-api';
import { useAuth } from '@/components/providers/AuthProvider';
import { BrandMark } from '@/components/brand/BrandMark';
import { DomainSelector } from '@/components/chat/DomainSelector';
import { getDomainVisual } from '@/components/chat/domain-theme';
import { getPlanLabel } from '@/lib/plans';
import {
  Conversation,
  DomainId,
  PublicWhiteLabelWorkspace,
  UsagePlan,
} from '@/types';

interface SidebarProps {
  activeConversationId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onDomainChange: (domain: DomainId) => void;
  onNewChat: () => void;
  onSelectConversation: (conversation: Conversation) => void;
  refreshToken: number;
  selectedDomain: DomainId;
  usagePlan?: UsagePlan;
  workspace?: PublicWhiteLabelWorkspace | null;
}

export function Sidebar({
  activeConversationId,
  selectedDomain,
  onDomainChange,
  onNewChat,
  isOpen,
  onClose,
  onSelectConversation,
  refreshToken,
  usagePlan = 'guest',
  workspace = null,
}: SidebarProps) {
  const { signOutUser, user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    let ignore = false;

    async function loadConversations() {
      if (!user) {
        setConversations([]);
        return;
      }

      const response = await fetchWithAuth('/api/conversations');

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      if (!ignore) {
        setConversations(data.conversations ?? []);
      }
    }

    loadConversations().catch(() => {
      if (!ignore) {
        setConversations([]);
      }
    });

    return () => {
      ignore = true;
    };
  }, [refreshToken, user]);

  const recentItems = useMemo(
    () =>
      [...conversations]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 10),
    [conversations]
  );

  const userInitial = (user?.displayName || user?.email || 'V').trim().charAt(0).toUpperCase();
  const planLabel = getPlanLabel(usagePlan);
  const brandName = workspace?.branding.brandName ?? 'Vyarah BuildDesk';
  const sidebarDomains = workspace
    ? workspace.deskConfigs.map((desk) => ({
        ...DOMAINS[desk.id],
        name: desk.name,
        shortName: desk.name,
      }))
    : undefined;

  return (
    <>
      {isOpen ? (
        <div className="fixed inset-0 z-40 bg-black/45 md:hidden" onClick={onClose} />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-[#2c2c2c] bg-[var(--color-sidebar)] transition-transform duration-300 md:relative md:z-0 md:w-[280px] ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="border-b border-[#2c2c2c] p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              {workspace?.branding.logoUrl ? (
                <img
                  src={workspace.branding.logoUrl}
                  alt={brandName}
                  className="h-8 w-8 object-contain"
                />
              ) : (
                <BrandMark size={32} />
              )}
              <div className="min-w-0">
                <div className="text-[15px] font-semibold tracking-[-0.02em] text-white">
                  {workspace ? brandName : 'Vyarah'}
                </div>
                <div className="mt-1 text-[11px] text-[#9d978f]">
                  {workspace ? 'White-label workspace' : 'AI BuildDesk'}
                </div>
              </div>
            </div>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-[#d7d2ca] md:hidden"
              onClick={onClose}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="border-b border-[#2c2c2c] px-5 py-4">
          <div>
            <div className="eyebrow-label mb-3">Domain</div>
            <DomainSelector
              domains={sidebarDomains}
              selected={selectedDomain}
              onSelect={onDomainChange}
              variant="list"
            />
          </div>

          <button
            type="button"
            onClick={onNewChat}
            className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 border border-[#333] bg-transparent text-[14px] font-medium text-white transition-colors hover:bg-[var(--color-sidebar-hover)]"
          >
            <Plus className="h-4 w-4" />
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="eyebrow-label mb-3">Recent</div>

          {!user ? (
            <div className="border border-[#2c2c2c] px-4 py-4 text-[13px] leading-6 text-[#9d978f]">
              Sign in to keep your recent BuildDesk conversations.
            </div>
          ) : recentItems.length === 0 ? (
            <div className="border border-[#2c2c2c] px-4 py-4 text-[13px] leading-6 text-[#9d978f]">
              Your recent chats will appear here once you start asking questions.
            </div>
          ) : (
            <div className="space-y-1">
              {recentItems.map((item) => {
                const visual = getDomainVisual(item.domain);
                const isActive = activeConversationId === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectConversation(item)}
                    className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors ${
                      isActive ? 'bg-[var(--color-sidebar-hover)]' : 'hover:bg-[var(--color-sidebar-hover)]'
                    }`}
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: visual.color }}
                    />
                    <span className="min-w-0 flex-1 truncate text-[13px] text-[#f6f3ee]">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-[#8b857f]">
                      {new Date(item.updatedAt).toLocaleDateString(undefined, {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {user ? (
            <Link
              href="/dashboard"
              className="mt-4 inline-flex text-[13px] font-medium text-[#c9c1b4] transition-colors hover:text-white"
            >
              See all
            </Link>
          ) : null}
        </div>

        <div className="border-t border-[#2c2c2c] px-5 py-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center bg-[#2a2a2a] text-[14px] font-semibold text-white">
                {userInitial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] text-white">{user.email}</div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="bg-[#25211d] px-2 py-1 text-[11px] font-medium text-[#e9c49d]">
                    {planLabel}
                  </span>
                </div>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex h-9 w-9 items-center justify-center border border-[#333] text-[#c9c1b4] transition-colors hover:bg-[var(--color-sidebar-hover)] hover:text-white"
              >
                <Settings className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={signOutUser}
                className="inline-flex h-9 w-9 items-center justify-center border border-[#333] text-[#c9c1b4] transition-colors hover:bg-[var(--color-sidebar-hover)] hover:text-white"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center gap-2 border border-[#333] px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-[var(--color-sidebar-hover)]"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign in</span>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
