'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { BrandMark } from '@/components/brand/BrandMark';
import { useAuth } from '@/components/providers/AuthProvider';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/white-label', label: 'White-Label' },
  { href: '/blog', label: 'Blog' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOutUser } = useAuth();

  if (pathname === '/chat' || pathname === '/login' || pathname === '/signup') {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[rgba(239,237,232,0.84)] backdrop-blur-xl">
      <div className="page-shell">
        <div className="flex h-[78px] items-center justify-between gap-4">
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

          <nav className="hidden items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/44 px-2 py-2 lg:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-[12px] font-medium uppercase tracking-[0.18em] transition-colors ${
                    isActive
                      ? 'bg-[var(--color-text-primary)] text-white'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden items-center gap-3 lg:flex">
                <Link
                  href="/dashboard"
                  className="text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={signOutUser}
                  className="swiss-button-muted min-h-11 px-4 py-2 text-[12px] font-medium uppercase tracking-[0.18em]"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)] lg:inline-flex"
              >
                Login
              </Link>
            )}

            <Link
              href="/chat"
              className="swiss-button hidden min-h-11 px-5 py-2 text-[12px] font-medium uppercase tracking-[0.18em] sm:inline-flex"
            >
              {user ? 'Open BuildDesk' : 'Start Free'}
            </Link>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center border border-[var(--color-border)] bg-white/44 text-[var(--color-text-primary)] lg:hidden"
              onClick={() => setMobileOpen((current) => !current)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-[var(--color-border)] bg-[rgba(239,237,232,0.95)] lg:hidden">
          <div className="page-shell py-4">
            <div className="grid gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full border border-transparent bg-white/24 px-4 py-3 text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border)] hover:bg-white/56 hover:text-[var(--color-text-primary)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-4 grid gap-2">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-full border border-[var(--color-border)] bg-white/44 px-4 py-3 text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-primary)]"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={signOutUser}
                    className="rounded-full border border-[var(--color-border)] bg-white/44 px-4 py-3 text-left text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-primary)]"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-full border border-[var(--color-border)] bg-white/44 px-4 py-3 text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-primary)]"
                  >
                    Login
                  </Link>
                  <Link
                    href="/chat"
                    onClick={() => setMobileOpen(false)}
                    className="swiss-button min-h-11 px-4 py-3 text-[12px] font-medium uppercase tracking-[0.18em]"
                  >
                    Start Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
