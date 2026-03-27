import { NextRequest, NextResponse } from 'next/server';
import { DOMAINS, DOMAIN_LIST } from '@/lib/domains';
import { getBaseAppUrl } from '@/lib/app-url';
import { getAdminDb } from '@/lib/firebase-admin';
import { canAccessWhitelabel } from '@/lib/plans';
import { verifyRequestUser } from '@/lib/server-auth';
import { WhiteLabelConfig } from '@/types';

export const runtime = 'nodejs';

function buildDefaultConfig(userId: string): WhiteLabelConfig {
  const now = new Date().toISOString();

  return {
    analyticsWindowDays: 30,
    branding: {
      brandName: 'BuildDesk',
      customDomain: '',
      logoUrl: null,
      primaryColor: '#111111',
    },
    createdAt: now,
    deskConfigs: DOMAIN_LIST.map((domain) => ({
      enabled: true,
      id: domain.id,
      name: domain.name,
      welcomeMessage: `Welcome to ${domain.name}. Ask anything - we'll keep up.`,
    })),
    embedToken: crypto.randomUUID(),
    knowledgeBase: [],
    ownerUserId: userId,
    updatedAt: now,
    userManagement: [],
  };
}

function buildAnalytics(events: { createdAt: string; domain: string; question: string; userId?: string | null }[]) {
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const filteredEvents = events.filter((event) => new Date(event.createdAt).getTime() >= cutoff);
  const domainCounts = new Map<string, number>();
  const questionCounts = new Map<string, number>();
  const dailyUsers = new Map<string, Set<string>>();

  for (const event of filteredEvents) {
    domainCounts.set(event.domain, (domainCounts.get(event.domain) ?? 0) + 1);
    questionCounts.set(event.question, (questionCounts.get(event.question) ?? 0) + 1);

    const day = event.createdAt.slice(0, 10);
    const userKey = event.userId ?? 'guest';
    const existing = dailyUsers.get(day) ?? new Set<string>();
    existing.add(userKey);
    dailyUsers.set(day, existing);
  }

  const topDesk = [...domainCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'ca-tax';
  const topQuestions = [...questionCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([question, count]) => ({ count, question }));

  const last30Days = Array.from({ length: 30 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - index));
    const key = date.toISOString().slice(0, 10);

    return {
      date: key,
      users: dailyUsers.get(key)?.size ?? 0,
    };
  });

  return {
    dailyActiveUsers: last30Days,
    mostUsedDesk: DOMAINS[topDesk as keyof typeof DOMAINS]?.name ?? DOMAINS['ca-tax'].name,
    topQuestions,
    totalQuestions: filteredEvents.length,
  };
}

export async function GET(req: NextRequest) {
  try {
    const authUser = await verifyRequestUser(req);

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!canAccessWhitelabel(authUser.plan)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const adminDb = getAdminDb();
    const configRef = adminDb.collection('whitelabelConfigs').doc(authUser.userId);
    const configSnapshot = await configRef.get();
    const config = configSnapshot.exists
      ? (configSnapshot.data() as WhiteLabelConfig)
      : buildDefaultConfig(authUser.userId);

    if (!configSnapshot.exists) {
      await configRef.set(config);
    }

    const eventsSnapshot = await adminDb
      .collection('questionEvents')
      .where('userId', '==', authUser.userId)
      .get();

    const analytics = buildAnalytics(
      eventsSnapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          createdAt: String(data.createdAt ?? new Date().toISOString()),
          domain: String(data.domain ?? 'ca-tax'),
          question: String(data.question ?? ''),
          userId: data.userId ?? null,
        };
      })
    );

    const directLink = config.branding.customDomain
      ? `https://${config.branding.customDomain}`
      : `${getBaseAppUrl()}/chat?workspace=${config.embedToken}`;

    return NextResponse.json({
      analytics,
      config,
      directLink,
      embedSnippet: `<iframe src="${directLink}" width="100%" height="720" style="border:0;"></iframe>`,
    });
  } catch {
    return NextResponse.json({ error: 'Unable to load white-label workspace' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authUser = await verifyRequestUser(req);

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!canAccessWhitelabel(authUser.plan)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const adminDb = getAdminDb();
    const configRef = adminDb.collection('whitelabelConfigs').doc(authUser.userId);
    const currentSnapshot = await configRef.get();
    const currentConfig = currentSnapshot.exists
      ? (currentSnapshot.data() as WhiteLabelConfig)
      : buildDefaultConfig(authUser.userId);

    const nextConfig: WhiteLabelConfig = {
      ...currentConfig,
      branding: body.branding ?? currentConfig.branding,
      deskConfigs: body.deskConfigs ?? currentConfig.deskConfigs,
      knowledgeBase: body.knowledgeBase ?? currentConfig.knowledgeBase,
      updatedAt: new Date().toISOString(),
      userManagement: body.userManagement ?? currentConfig.userManagement,
    };

    await configRef.set(nextConfig);

    return NextResponse.json({ config: nextConfig });
  } catch {
    return NextResponse.json({ error: 'Unable to update white-label workspace' }, { status: 500 });
  }
}
