'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandMark } from '@/components/brand/BrandMark';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOutUser } = useAuth();

  if (pathname === '/chat' || pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const navLinks = [
    { href: '/#desks', label: 'Desks' },
    { href: '/white-label', label: 'White-Label' },
    { href: '/blog', label: 'Blog' },
    { href: '/#how-it-works', label: 'How it works' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/#workflow', label: 'Workflow' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[rgba(242,242,242,0.84)] backdrop-blur-md">
      <div className="mx-auto flex h-[72px] w-full max-w-[1280px] items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <BrandMark size={34} />
          <div className="leading-none">
            <div className="font-display text-[15px] font-bold tracking-[-0.05em] text-[var(--color-text-primary)]">
              Vyarah
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
              AI BuildDesk
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/dashboard"
                className="text-[13px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={signOutUser}
                className="swiss-button-muted px-4 py-2 text-[13px] font-medium uppercase tracking-[0.16em]"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden text-[13px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)] md:inline-flex"
            >
              Login
            </Link>
          )}

          <Link
            href="/chat"
            className="swiss-button hidden min-h-11 px-5 py-2 text-[13px] font-medium uppercase tracking-[0.16em] md:inline-flex"
          >
            {user ? 'Open BuildDesk' : 'Start Free'}
          </Link>

          <Link
            href="/chat"
            className="swiss-button min-h-11 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.16em] md:hidden"
          >
            Start Free
          </Link>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center border border-[var(--color-border)] bg-[rgba(255,255,255,0.4)] text-[var(--color-text-primary)] md:hidden"
            onClick={() => setMobileOpen((current) => !current)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-[var(--color-border)] bg-[rgba(242,242,242,0.96)] p-4 md:hidden">
          <div className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block border border-transparent px-3 py-2 text-[13px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border)] hover:bg-white/40 hover:text-[var(--color-text-primary)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
          {user ? (
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="inline-flex border border-[var(--color-border)] px-3 py-2 text-[13px] font-medium uppercase tracking-[0.16em] text-[var(--color-text-primary)]"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={signOutUser}
                className="inline-flex border border-[var(--color-border)] px-3 py-2 text-left text-[13px] font-medium uppercase tracking-[0.16em] text-[var(--color-text-primary)]"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="inline-flex min-h-11 items-center border border-[var(--color-border)] px-3 py-2 text-[13px] font-medium uppercase tracking-[0.16em] text-[var(--color-text-primary)]"
              >
                Login
              </Link>
              <Link
                href="/chat"
                onClick={() => setMobileOpen(false)}
                className="swiss-button min-h-11 px-4 py-2 text-[13px] font-medium uppercase tracking-[0.16em]"
              >
                Start Free
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
