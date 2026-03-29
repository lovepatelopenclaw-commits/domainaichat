import type { MetadataRoute } from 'next';
import { getBaseAppUrl } from '@/lib/app-url';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseAppUrl();
  const now = new Date();

  return [
    {
      changeFrequency: 'weekly',
      lastModified: now,
      priority: 1,
      url: baseUrl,
    },
    {
      changeFrequency: 'weekly',
      lastModified: now,
      priority: 0.9,
      url: `${baseUrl}/pricing`,
    },
    {
      changeFrequency: 'weekly',
      lastModified: now,
      priority: 0.8,
      url: `${baseUrl}/chat`,
    },
    {
      changeFrequency: 'monthly',
      lastModified: now,
      priority: 0.6,
      url: `${baseUrl}/login`,
    },
    {
      changeFrequency: 'monthly',
      lastModified: now,
      priority: 0.6,
      url: `${baseUrl}/signup`,
    },
  ];
}
