import { DOMAINS } from '@/lib/domains';
import { getAdminDb } from '@/lib/firebase-admin';
import { PublicWhiteLabelWorkspace, WhiteLabelConfig } from '@/types';

export async function getWhiteLabelConfigByEmbedToken(embedToken: string): Promise<WhiteLabelConfig | null> {
  const token = embedToken.trim();

  if (!token) {
    return null;
  }

  const snapshot = await getAdminDb()
    .collection('whitelabelConfigs')
    .where('embedToken', '==', token)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs[0].data() as WhiteLabelConfig;
}

export async function getWhiteLabelConfigByOwnerUserId(
  ownerUserId: string
): Promise<WhiteLabelConfig | null> {
  const userId = ownerUserId.trim();

  if (!userId) {
    return null;
  }

  const snapshot = await getAdminDb().collection('whitelabelConfigs').doc(userId).get();

  if (!snapshot.exists) {
    return null;
  }

  return snapshot.data() as WhiteLabelConfig;
}

export function toPublicWhiteLabelWorkspace(
  config: WhiteLabelConfig
): PublicWhiteLabelWorkspace {
  return {
    branding: config.branding,
    deskConfigs: config.deskConfigs.filter((desk) => desk.enabled),
    embedToken: config.embedToken,
  };
}

export async function getWhiteLabelKnowledgeBaseContext(
  config: WhiteLabelConfig
): Promise<string | null> {
  if (config.knowledgeBase.length === 0) {
    return null;
  }

  const knowledgeSnippets = await Promise.all(
    config.knowledgeBase.slice(0, 5).map(async (document) => {
      const snapshot = await getAdminDb()
        .collection('whitelabelKnowledgeBase')
        .doc(document.id)
        .get();

      if (!snapshot.exists) {
        return null;
      }

      const data = snapshot.data();
      const text = String(data?.text ?? '').trim();

      if (!text) {
        return null;
      }

      return `Reference: ${document.name}\n${text.slice(0, 5000)}`;
    })
  );

  const content = knowledgeSnippets.filter(Boolean).join('\n\n');
  return content || null;
}

export function buildWhiteLabelSystemPrompt(
  config: WhiteLabelConfig,
  domainId: keyof typeof DOMAINS
): string {
  const deskConfig = config.deskConfigs.find((desk) => desk.id === domainId);
  const domain = DOMAINS[domainId];

  return [
    domain.systemPrompt,
    `You are answering inside the branded workspace for ${config.branding.brandName}.`,
    `When naming this desk, refer to it as "${deskConfig?.name ?? domain.name}".`,
    deskConfig?.welcomeMessage
      ? `Use this workspace guidance when it helps the answer stay on-brand: ${deskConfig.welcomeMessage}`
      : null,
  ]
    .filter(Boolean)
    .join('\n\n');
}
