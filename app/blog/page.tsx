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
  const [featuredPost, ...otherPosts] = BLOG_POSTS;

  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <section className="border-b border-[var(--color-border)]">
        <div className="page-shell section-shell">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="swiss-chip px-3 py-2 text-[11px] font-medium uppercase tracking-[0.22em]">BuildDesk Blog</div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
              Practical guides for Indian professional questions
            </div>
          </div>

          <div className="mt-10 grid gap-10 xl:grid-cols-[minmax(0,0.84fr)_minmax(320px,0.76fr)]">
            <div>
              <p className="eyebrow-label">SEO and product education</p>
              <h1 className="mt-4 max-w-[12ch] font-display text-[clamp(3rem,7vw,5.7rem)] leading-[0.9] tracking-[-0.06em]">
                Articles that get people to the right question faster.
              </h1>
              <p className="mt-6 max-w-[44rem] text-[17px] leading-8 text-[var(--color-text-secondary)]">
                Clear guides for tax, legal, medical, real estate, business, and finance topics in India, written to
                bridge the gap between search intent and a genuinely useful first next step.
              </p>
            </div>

            <div className="grid gap-px bg-[var(--color-border)] sm:grid-cols-2 xl:grid-cols-1">
              {BLOG_CATEGORIES.map((category) => (
                <div key={category} className="metric-card px-4 py-4 text-[12px] uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
                  {category}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 section-frame grid gap-8 p-6 lg:grid-cols-[minmax(0,0.84fr)_minmax(260px,0.66fr)] lg:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">Featured guide</p>
              <h2 className="mt-4 max-w-[16ch] font-display text-[40px] leading-[0.94] tracking-[-0.05em]">
                <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
              </h2>
              <p className="mt-4 max-w-[42rem] text-[15px] leading-7 text-[var(--color-text-secondary)]">
                {featuredPost.excerpt}
              </p>
            </div>
            <div className="grid gap-px bg-[var(--color-border)]">
              {[
                ['Category', featuredPost.category],
                ['Read time', featuredPost.readTime],
                ['CTA', 'Open article'],
              ].map(([label, value]) => (
                <div key={label} className="metric-card px-4 py-4">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">{label}</div>
                  <div className="mt-2 text-[14px] leading-6 text-[var(--color-text-primary)]">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell section-shell">
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {otherPosts.map((post) => (
            <article key={post.slug} className="interactive-card surface-card flex h-full flex-col p-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
                  {post.category}
                </span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                  {post.readTime}
                </span>
              </div>

              <h2 className="mt-4 max-w-[18ch] font-display text-[30px] leading-[0.96] tracking-[-0.05em]">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="mt-4 flex-1 text-[15px] leading-7 text-[var(--color-text-secondary)]">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="text-link mt-8">
                Read article
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
