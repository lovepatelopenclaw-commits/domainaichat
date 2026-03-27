import type { MetadataRoute } from 'next';
import { getBaseAppUrl } from '@/lib/app-url';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseAppUrl();

  return {
    host: baseUrl,
    rules: {
      allow: '/',
      userAgent: '*',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
