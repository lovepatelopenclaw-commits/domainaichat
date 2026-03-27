import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  alternates: {
    canonical: '/pricing',
  },
  description:
    'Compare Guest, Personal, Professional, Business, and White-Label plans for Vyarah AI BuildDesk.',
  openGraph: {
    description:
      'Compare Guest, Personal, Professional, Business, and White-Label plans for Vyarah AI BuildDesk.',
    title: `Pricing | ${SITE_NAME}`,
    url: '/pricing',
  },
  title: 'Pricing',
};

export default function PricingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
