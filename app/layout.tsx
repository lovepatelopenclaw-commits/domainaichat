import type { Metadata } from 'next';
import { DM_Sans, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { AuthProvider } from '@/components/providers/AuthProvider';

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
  applicationName: 'Vyarah AI BuildDesk',
  description:
    'Get instant expert answers on tax, legal, medical, real estate and finance from Vyarah AI BuildDesk.',
  icons: {
    apple: '/vyarah-logo.png',
    icon: '/vyarah-logo.png',
  },
  keywords: [
    'Vyarah AI',
    'India tax help',
    'legal guidance India',
    'medical answers India',
    'real estate help India',
    'finance guidance India',
  ],
  title: {
    default: 'Vyarah AI BuildDesk',
    template: '%s | Vyarah AI BuildDesk',
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
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
