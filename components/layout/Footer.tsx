import Link from 'next/link';

const links = [
  { href: '/', label: 'Home' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/white-label', label: 'White-Label' },
  { href: '/blog', label: 'Blog' },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[rgba(239,237,232,0.9)]">
      <div className="page-shell section-shell-sm">
        <div className="grid gap-10 border-b border-[var(--color-border)] pb-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(320px,0.72fr)]">
          <div>
            <p className="eyebrow-label">Vyarah AI BuildDesk</p>
            <h2 className="mt-3 max-w-[12ch] font-display text-[32px] leading-[0.94] tracking-[-0.05em]">
              Structured AI help for real Indian professional questions.
            </h2>
            <p className="mt-4 max-w-[34rem] text-[14px] leading-7 text-[var(--color-text-secondary)]">
              Tax, legal, medical, real estate, business, and finance guidance designed to make hard questions easier
              to enter, read, and continue.
            </p>
          </div>

          <div className="grid gap-px bg-[var(--color-border)] sm:grid-cols-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="bg-[var(--color-bg)] px-4 py-4 text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-5 text-[12px] leading-6 text-[var(--color-text-secondary)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            Built by{' '}
            <Link
              href="https://www.vyarah.com"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-text-secondary)]"
            >
              Vyarah
            </Link>{' '}
            - AI-powered growth systems
          </p>
          <p>Calm on purpose. Product-first. Built for trust.</p>
        </div>
      </div>
    </footer>
  );
}
