import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[rgba(242,242,242,0.92)]">
      <div className="mx-auto max-w-[1280px] px-4 py-5 sm:px-6">
        <p className="text-[12px] leading-6 text-[var(--color-text-secondary)]">
          Built by{' '}
          <Link
            href="https://www.vyarah.com"
            target="_blank"
            rel="noreferrer"
            className="text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-text-secondary)]"
          >
            Vyarah
          </Link>{' '}
          — AI-powered growth systems
        </p>
      </div>
    </footer>
  );
}
