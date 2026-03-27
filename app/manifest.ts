import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: '#f2f2f2',
    description:
      'Structured AI help for Indian tax, legal, medical, real-estate, business, and finance questions.',
    display: 'standalone',
    icons: [
      {
        sizes: '512x512',
        src: '/vyarah-logo.png',
        type: 'image/png',
      },
      {
        sizes: '192x192',
        src: '/vyarah-logo.png',
        type: 'image/png',
      },
    ],
    name: 'Vyarah AI BuildDesk',
    short_name: 'BuildDesk',
    start_url: '/',
    theme_color: '#111111',
  };
}
