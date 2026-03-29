import type { Metadata } from 'next';
import Link from 'next/link';
import { BLOG_CATEGORIES, BLOG_POSTS } from '@/lib/blog';
import { getBaseAppUrl } from '@/lib/app-url';
import { SITE_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  alternates: {
    canonical: '/blog',
  },
  description:
    'Read BuildDesk guides on Indian tax, legal, medical, startup, and finance questions designed for practical first-step clarity.',
  openGraph: {
    description:
      'Read BuildDesk guides on Indian tax, legal, medical, startup, and finance questions designed for practical first-step clarity.',
    title: `Blog | ${SITE_NAME}`,
    url: `${getBaseAppUrl()}/blog`,
  },
  title: 'Blog',
};

export default function BlogIndexPage() {
  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <section className="border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-[1360px] px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="swiss-chip px-3 py-2 text-[11px] font-medium uppercase tracking-[0.22em]">
              BuildDesk Blog
            </div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
              Practical guides for Indian professional questions
            </div>
          </div>

          <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,0.86fr)_minmax(320px,0.64fr)]">
            <div>
              <p className="eyebrow-label">SEO and product education</p>
              <h1 className="mt-4 max-w-[12ch] font-display text-[clamp(3rem,7vw,5.8rem)] leading-[0.9] tracking-[-0.05em]">
                Articles that help people get to the right question faster.
              </h1>
              <p className="mt-6 max-w-[44rem] text-[17px] leading-8 text-[var(--color-text-secondary)]">
                Clear guides for tax, legal, medical, real estate, business, and finance topics in India, written to
                bridge the gap between search intent and a useful first next step.
              </p>
            </div>

            <div className="grid gap-px bg-[var(--color-border)] sm:grid-cols-2 xl:grid-cols-1">
              {BLOG_CATEGORIES.map((category) => (
                <div key={category} className="bg-[var(--color-bg)] px-4 py-4 text-[12px] uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
                  {category}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1360px] px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          {BLOG_POSTS.map((post) => (
            <article key={post.slug} className="surface-card flex h-full flex-col p-6 sm:p-7">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
                  {post.category}
                </span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                  {post.readTime}
                </span>
              </div>

              <h2 className="mt-4 max-w-[18ch] font-display text-[34px] leading-[0.94] tracking-[-0.05em]">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>

              <p className="mt-4 flex-1 text-[15px] leading-7 text-[var(--color-text-secondary)]">{post.excerpt}</p>

              <Link
                href={`/blog/${post.slug}`}
                className="mt-8 inline-flex text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-text-secondary)]"
              >
                Read article →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
