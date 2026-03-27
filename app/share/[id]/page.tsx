import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DOMAINS } from '@/lib/domains';
import { getAdminDb } from '@/lib/firebase-admin';
import { toIsoString } from '@/lib/firestore-admin';
import { DomainId } from '@/types';

type SharePageProps = {
  params: Promise<{ id: string }>;
};

async function getSharedAnswer(id: string) {
  const adminDb = getAdminDb();
  const snapshot = await adminDb.collection('sharedAnswers').doc(id).get();

  if (!snapshot.exists) {
    return null;
  }

  const data = snapshot.data();

  if (!data) {
    return null;
  }

  return {
    answer: String(data.answer ?? ''),
    createdAt: toIsoString(data.createdAt),
    desk: data.desk as DomainId,
    id: snapshot.id,
    question: String(data.question ?? ''),
  };
}

function truncate(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength).trim()}...` : value;
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const { id } = await params;
  const shared = await getSharedAnswer(id);

  if (!shared) {
    return {
      title: 'Shared answer not found',
    };
  }

  const title = `Answer from BuildDesk: ${truncate(shared.question, 60)}`;
  const description = truncate(shared.answer.replace(/\s+/g, ' ').trim(), 120);

  return {
    description,
    openGraph: {
      description,
      images: ['/opengraph-image'],
      title,
      type: 'article',
    },
    title,
    twitter: {
      card: 'summary_large_image',
      description,
      images: ['/opengraph-image'],
      title,
    },
  };
}

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;
  const shared = await getSharedAnswer(id);

  if (!shared) {
    notFound();
  }

  const domain = DOMAINS[shared.desk];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <div className="mx-auto max-w-[860px] px-4 py-10 sm:px-6 sm:py-14">
        <div className="border-b border-[var(--color-border)] pb-8">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
            Shared from BuildDesk
          </div>
          <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4rem)] leading-[0.92] tracking-[-0.05em]">
            {shared.question}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-[12px] uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
            <span>{domain.name}</span>
            <span>{new Date(shared.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mt-8 border border-[var(--color-border)] bg-white/40 px-5 py-5 sm:px-7 sm:py-7">
          <div className="message-prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{shared.answer}</ReactMarkdown>
          </div>
        </div>

        <div className="mt-8 grid gap-4 border-t border-[var(--color-border)] pt-8 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
              Disclaimer
            </div>
            <p className="mt-3 max-w-[42rem] text-[14px] leading-7 text-[var(--color-text-secondary)]">
              {domain.disclaimer ??
                'BuildDesk provides AI-generated guidance only. It is not a substitute for professional advice.'}
            </p>
          </div>
          <Link
            href="/"
            className="swiss-button min-h-12 px-5 py-3 text-[13px] font-medium uppercase tracking-[0.18em]"
          >
            Ask your own question
          </Link>
        </div>

        <footer className="mt-10 border-t border-[var(--color-border)] pt-5 text-[12px] uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
          Vyarah BuildDesk
        </footer>
      </div>
    </div>
  );
}
