import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOG_DISCLAIMER, BLOG_POSTS, getBlogPost, getRelatedBlogPosts } from '@/lib/blog';
import { getBaseAppUrl } from '@/lib/app-url';
import { serializeJsonLd } from '@/lib/json-ld';
import { SITE_NAME } from '@/lib/seo';

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: 'Blog',
    };
  }

  const url = `${getBaseAppUrl()}/blog/${post.slug}`;

  return {
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    description: post.description,
    openGraph: {
      description: post.description,
      images: [`/blog/${post.slug}/opengraph-image`],
      title: `${post.title} | ${SITE_NAME}`,
      type: 'article',
      url,
    },
    title: post.title,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const baseUrl = getBaseAppUrl();
  const url = `${baseUrl}/blog/${post.slug}`;
  const relatedPosts = getRelatedBlogPosts(post.slug, 2);
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    articleSection: post.category,
    author: {
      '@type': 'Organization',
      name: 'Vyarah AI BuildDesk',
    },
    dateModified: post.publishedAt,
    datePublished: post.publishedAt,
    description: post.description,
    headline: post.title,
    mainEntityOfPage: url,
    publisher: {
      '@type': 'Organization',
      name: 'Vyarah',
      url: 'https://www.vyarah.com',
    },
    url,
  };

  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <article className="page-shell-narrow section-shell">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd) }}
        />

        <Link href="/blog" className="text-link">
          Back to blog
        </Link>

        <header className="mt-8 section-frame px-6 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">{post.category}</span>
            <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">{post.readTime}</span>
          </div>

          <h1 className="mt-4 max-w-[16ch] font-display text-[clamp(2.8rem,6vw,5rem)] leading-[0.9] tracking-[-0.06em]">
            {post.title}
          </h1>
          <p className="mt-5 max-w-[44rem] text-[17px] leading-8 text-[var(--color-text-secondary)]">{post.description}</p>
        </header>

        <div className="mt-6 grid gap-4">
          {post.notice ? (
            <div className="surface-card px-5 py-4 text-[14px] leading-7 text-[var(--color-text-primary)]">{post.notice}</div>
          ) : null}
          <div className="surface-card px-5 py-4 text-[14px] leading-7 text-[var(--color-text-secondary)]">
            {BLOG_DISCLAIMER}
          </div>
        </div>

        <div className="surface-card mt-8 px-6 py-8 sm:px-8 sm:py-10">
          <div className="article-prose">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.list ? (
                  <ul>
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          <div className="mt-10 border-t border-[var(--color-border)] pt-8">
            <Link href={post.ctaHref} className="swiss-button min-h-12 px-5 py-3 text-[12px] font-medium uppercase tracking-[0.18em]">
              {post.ctaLabel}
            </Link>
          </div>
        </div>
      </article>

      <section className="border-t border-[var(--color-border)] bg-white/22">
        <div className="page-shell-narrow section-shell-sm">
          <div className="flex items-end justify-between gap-4 border-b border-[var(--color-border)] pb-6">
            <div>
              <p className="eyebrow-label">Related posts</p>
              <h2 className="mt-3 font-display text-[34px] leading-[0.94] tracking-[-0.05em]">Keep reading</h2>
            </div>
            <Link href="/blog" className="text-link">
              Back to blog
            </Link>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {relatedPosts.map((relatedPost) => (
              <article key={relatedPost.slug} className="interactive-card surface-card p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
                    {relatedPost.category}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                    {relatedPost.readTime}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-[28px] leading-[0.96] tracking-[-0.05em]">
                  <Link href={`/blog/${relatedPost.slug}`}>{relatedPost.title}</Link>
                </h3>
                <p className="mt-4 text-[15px] leading-7 text-[var(--color-text-secondary)]">{relatedPost.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
