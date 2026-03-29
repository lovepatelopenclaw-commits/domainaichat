export function getBaseAppUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '');
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();

  if (vercelUrl) {
    return `https://${vercelUrl.replace(/\/$/, '')}`;
  }

  return 'https://vyarah.com';
}

export function getShareUrl(shareId: string) {
  return `${getBaseAppUrl()}/share/${shareId}`;
}
