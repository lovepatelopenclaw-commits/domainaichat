'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode';
import { fetchWithAuth } from '@/lib/client-api';
import { useAuth } from '@/components/providers/AuthProvider';
import { DOMAIN_LIST } from '@/lib/domains';
import { WhiteLabelConfig } from '@/types';

type Analytics = {
  dailyActiveUsers: { date: string; users: number }[];
  mostUsedDesk: string;
  topQuestions: { count: number; question: string }[];
  totalQuestions: number;
};

export default function WhiteLabelDashboardPage() {
  const router = useRouter();
  const { loading, user } = useAuth();
  const [config, setConfig] = useState<WhiteLabelConfig | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [directLink, setDirectLink] = useState('');
  const [embedSnippet, setEmbedSnippet] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?next=/dashboard/whitelabel');
    }
  }, [loading, router, user]);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      const response = await fetchWithAuth('/api/whitelabel');

      if (!response.ok) {
        if (response.status === 403) {
          router.push('/dashboard');
        }
        return;
      }

      const data = await response.json();

      if (!ignore) {
        setAnalytics(data.analytics);
        setConfig(data.config);
        setDirectLink(data.directLink);
        setEmbedSnippet(data.embedSnippet);
      }
    }

    if (user) {
      loadData().catch(() => undefined);
    }

    return () => {
      ignore = true;
    };
  }, [router, user]);

  useEffect(() => {
    if (!directLink) {
      return;
    }

    QRCode.toDataURL(directLink, {
      color: {
        dark: '#111111',
        light: '#f2f2f2',
      },
      margin: 1,
      width: 180,
    }).then(setQrCodeUrl).catch(() => undefined);
  }, [directLink]);

  async function saveConfig(nextConfig: WhiteLabelConfig) {
    setSaving(true);

    const response = await fetchWithAuth('/api/whitelabel', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nextConfig),
    });

    const data = await response.json();
    setConfig(data.config);
    setSaving(false);
  }

  async function handleUpload(file: File, kind: 'logo' | 'knowledge-base') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('kind', kind);

    const response = await fetchWithAuth('/api/whitelabel/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!config) {
      return;
    }

    if (kind === 'logo' && data.logoUrl) {
      setConfig({
        ...config,
        branding: {
          ...config.branding,
          logoUrl: data.logoUrl,
        },
      });
      return;
    }

    if (kind === 'knowledge-base' && data.document) {
      setConfig({
        ...config,
        knowledgeBase: [...config.knowledgeBase, data.document],
      });
    }
  }

  if (loading || !user || !config || !analytics) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[var(--color-bg)] text-[14px] text-[var(--color-text-secondary)]">
        Loading white-label workspace...
      </div>
    );
  }

  const maxUsers = Math.max(...analytics.dailyActiveUsers.map((point) => point.users), 1);
  const polylinePoints = analytics.dailyActiveUsers
    .map((point, index) => {
      const x = (index / Math.max(analytics.dailyActiveUsers.length - 1, 1)) * 100;
      const y = 100 - (point.users / maxUsers) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="flex-1 bg-[var(--color-bg)]">
      <div className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6">
        <div className="border-b border-[var(--color-border)] pb-8">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
            White-label workspace
          </p>
          <h1 className="mt-4 font-display text-[42px] leading-none text-[var(--color-text-primary)]">
            Configure your branded BuildDesk
          </h1>
          <p className="mt-4 max-w-[46rem] text-[15px] leading-7 text-[var(--color-text-secondary)]">
            Set brand identity, tune desks, add your knowledge base, manage users, and hand your team a direct link
            they can deploy.
          </p>
        </div>

        <div className="mt-8 space-y-8">
          <section className="surface-card p-6">
            <h2 className="font-display text-[28px] leading-none">Brand Identity</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input
                value={config.branding.brandName}
                onChange={(event) =>
                  setConfig({
                    ...config,
                    branding: {
                      ...config.branding,
                      brandName: event.target.value,
                    },
                  })
                }
                placeholder="Brand name"
                className="h-12 border border-[var(--color-border)] bg-[var(--color-bg)] px-4 text-[14px] outline-none"
              />
              <input
                value={config.branding.customDomain}
                onChange={(event) =>
                  setConfig({
                    ...config,
                    branding: {
                      ...config.branding,
                      customDomain: event.target.value,
                    },
                  })
                }
                placeholder="chat.theirfirm.com"
                className="h-12 border border-[var(--color-border)] bg-[var(--color-bg)] px-4 text-[14px] outline-none"
              />
              <input
                type="color"
                value={config.branding.primaryColor}
                onChange={(event) =>
                  setConfig({
                    ...config,
                    branding: {
                      ...config.branding,
                      primaryColor: event.target.value,
                    },
                  })
                }
                className="h-12 w-full border border-[var(--color-border)] bg-[var(--color-bg)] px-2"
              />
              <label className="flex min-h-12 cursor-pointer items-center border border-[var(--color-border)] bg-[var(--color-bg)] px-4 text-[14px]">
                Upload logo
                <input
                  type="file"
                  accept=".png,.svg,.jpg,.jpeg"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      void handleUpload(file, 'logo');
                    }
                  }}
                />
              </label>
            </div>
            {config.branding.logoUrl ? (
              <img src={config.branding.logoUrl} alt="Uploaded logo" className="mt-4 h-12 object-contain" />
            ) : null}
            <p className="mt-4 text-[13px] text-[var(--color-text-secondary)]">
              Point your DNS CNAME to Vercel after saving the custom domain field.
            </p>
          </section>

          <section className="surface-card p-6">
            <h2 className="font-display text-[28px] leading-none">Desk Configuration</h2>
            <div className="mt-6 space-y-4">
              {config.deskConfigs.map((desk) => (
                <div key={desk.id} className="grid gap-3 border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <strong>{desk.id}</strong>
                    <label className="text-[13px] text-[var(--color-text-secondary)]">
                      <input
                        type="checkbox"
                        checked={desk.enabled}
                        onChange={(event) =>
                          setConfig({
                            ...config,
                            deskConfigs: config.deskConfigs.map((item) =>
                              item.id === desk.id ? { ...item, enabled: event.target.checked } : item
                            ),
                          })
                        }
                      />{' '}
                      Enabled
                    </label>
                  </div>
                  <input
                    value={desk.name}
                    onChange={(event) =>
                      setConfig({
                        ...config,
                        deskConfigs: config.deskConfigs.map((item) =>
                          item.id === desk.id ? { ...item, name: event.target.value } : item
                        ),
                      })
                    }
                    className="h-11 border border-[var(--color-border)] bg-white px-3 text-[14px] outline-none"
                  />
                  <textarea
                    value={desk.welcomeMessage}
                    onChange={(event) =>
                      setConfig({
                        ...config,
                        deskConfigs: config.deskConfigs.map((item) =>
                          item.id === desk.id ? { ...item, welcomeMessage: event.target.value } : item
                        ),
                      })
                    }
                    rows={3}
                    className="border border-[var(--color-border)] bg-white px-3 py-3 text-[14px] outline-none"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="surface-card p-6">
            <h2 className="font-display text-[28px] leading-none">Knowledge Base</h2>
            <label className="mt-6 inline-flex min-h-11 cursor-pointer items-center border border-[var(--color-border)] bg-[var(--color-bg)] px-4 text-[13px] font-medium uppercase tracking-[0.16em]">
              Upload PDF
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    void handleUpload(file, 'knowledge-base');
                  }
                }}
              />
            </label>
            <div className="mt-6 space-y-3">
              {config.knowledgeBase.map((document) => (
                <div key={document.id} className="flex items-center justify-between border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-[14px]">
                  <span>{document.name}</span>
                  <span className="text-[var(--color-text-secondary)]">{document.status}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="surface-card p-6">
            <h2 className="font-display text-[28px] leading-none">User Management</h2>
            <div className="mt-6 space-y-3">
              {config.userManagement.map((member, index) => (
                <div key={`${member.email}-${index}`} className="grid gap-3 md:grid-cols-[1fr_140px_120px]">
                  <input value={member.email} readOnly className="h-11 border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-[14px] outline-none" />
                  <input value={member.role} readOnly className="h-11 border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-[14px] outline-none" />
                  <input value={member.status} readOnly className="h-11 border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-[14px] outline-none" />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setConfig({
                  ...config,
                  userManagement: [
                    ...config.userManagement,
                    { email: `invite-${config.userManagement.length + 1}@example.com`, role: 'viewer', status: 'invited' },
                  ],
                })
              }
              className="mt-4 min-h-11 border border-[var(--color-border)] px-4 py-2 text-[13px] font-medium uppercase tracking-[0.16em]"
            >
              Invite Team Member
            </button>
          </section>

          <section className="surface-card p-6">
            <h2 className="font-display text-[28px] leading-none">Analytics</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                <div className="text-[12px] uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">Total questions</div>
                <div className="mt-3 text-[28px]">{analytics.totalQuestions}</div>
              </div>
              <div className="border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                <div className="text-[12px] uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">Most used desk</div>
                <div className="mt-3 text-[28px]">{analytics.mostUsedDesk}</div>
              </div>
              <div className="border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                <div className="text-[12px] uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">Active users</div>
                <div className="mt-3 text-[28px]">{analytics.dailyActiveUsers.reduce((sum, point) => sum + point.users, 0)}</div>
              </div>
            </div>
            <div className="mt-6 border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
              <svg viewBox="0 0 100 100" className="h-48 w-full">
                <polyline
                  fill="none"
                  stroke={config.branding.primaryColor}
                  strokeWidth="2"
                  points={polylinePoints}
                />
              </svg>
            </div>
            <div className="mt-6 space-y-2">
              {analytics.topQuestions.map((item) => (
                <div key={item.question} className="flex items-center justify-between border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-[14px]">
                  <span className="truncate pr-4">{item.question}</span>
                  <span className="text-[var(--color-text-secondary)]">{item.count}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="surface-card p-6">
            <h2 className="font-display text-[28px] leading-none">Embed & Share</h2>
            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_220px]">
              <div>
                <input value={directLink} readOnly className="h-11 w-full border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-[14px] outline-none" />
                <textarea value={embedSnippet} readOnly rows={4} className="mt-4 w-full border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-3 text-[13px] outline-none" />
                <Link href={directLink} className="mt-4 inline-flex text-[13px] font-medium text-[var(--color-text-primary)] underline">
                  Open branded instance
                </Link>
              </div>
              <div className="border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                {qrCodeUrl ? <img src={qrCodeUrl} alt="QR code" className="h-[180px] w-[180px]" /> : null}
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => void saveConfig(config)}
            disabled={saving}
            className="swiss-button min-h-11 px-5 py-3 text-[13px] font-medium uppercase tracking-[0.18em] disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save workspace'}
          </button>
        </div>
      </div>
    </div>
  );
}
