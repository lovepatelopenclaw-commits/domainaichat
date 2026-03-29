import type { Metadata } from 'next';
import { DM_Sans, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { AnalyticsScripts } from '@/components/analytics/AnalyticsScripts';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { getBaseAppUrl } from '@/lib/app-url';
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_TITLE } from '@/lib/seo';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body-fallback',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display-fallback',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono-fallback',
});

export const metadata: Metadata = {
  applicationName: SITE_NAME,
  alternates: {
    canonical: '/',
  },
  category: 'technology',
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  metadataBase: new URL(getBaseAppUrl()),
  openGraph: {
    description: SITE_DESCRIPTION,
    images: ['/opengraph-image'],
    locale: 'en_IN',
    siteName: SITE_NAME,
    title: SITE_TITLE,
    type: 'website',
    url: getBaseAppUrl(),
  },
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    index: true,
  },
  twitter: {
    card: 'summary_large_image',
    description: SITE_DESCRIPTION,
    images: ['/opengraph-image'],
    title: SITE_TITLE,
  },
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans antialiased">
        <AnalyticsScripts />
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
