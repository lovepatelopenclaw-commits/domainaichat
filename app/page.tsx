import Link from 'next/link';
import type { Metadata } from 'next';
import { DOMAIN_LIST } from '@/lib/domains';
import { getBaseAppUrl } from '@/lib/app-url';
import { serializeJsonLd } from '@/lib/json-ld';
import { PUBLIC_PLAN_OFFERS, PRICING_FAQS } from '@/lib/pricing';
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from '@/lib/seo';

const echoLayers = [
  { color: '#c5c0b9', offset: '-0.04em' },
  { color: '#cec8c0', offset: '-0.08em' },
  { color: '#d8d2ca', offset: '-0.12em' },
  { color: '#e1dbd4', offset: '-0.16em' },
];

const heroNotes = [
  'Built for Indian tax, legal, medical, property, business, and finance questions',
  'Designed to reduce the time between confusion and a usable next step',
];

const stats = [
  ['500+', 'Questions answered'],
  ['6', 'Expert desks'],
  ['Free to start', 'No card required'],
];

const principles = [
  {
    index: '01',
    title: 'Desk-based context',
    copy: 'Each desk keeps its own mental model, so a legal question does not get flattened into generic assistant language.',
  },
  {
    index: '02',
    title: 'Readable structure',
    copy: 'Answers are shaped for action: what matters, what to collect, what to ask next, and what not to assume.',
  },
  {
    index: '03',
    title: 'Calm interface',
    copy: 'The product stays visually restrained so hard questions feel easier to assess, compare, and continue.',
  },
];

const workflow = [
  {
    label: '1. Start with the desk',
    value: 'Pick tax, legal, medical, property, business, or finance so the answer starts in the right context.',
  },
  {
    label: '2. Ask the messy version',
    value: 'Use rough numbers, partial details, and the real question you would normally need ten minutes to explain.',
  },
  {
    label: '3. Keep moving',
    value: 'Use follow-up suggestions, continuity, and structured outputs to turn the answer into the next action.',
  },
];

// TODO: Replace with real testimonials before major launch.
const testimonials = [
  {
    quote:
      'I used to spend 30 minutes explaining my situation to my CA before every meeting. Now I use BuildDesk first to understand the basics, then the meeting takes 10 minutes.',
    person: 'Rohan S.',
    role: 'Freelance Consultant, Mumbai',
  },
  {
    quote:
      'My landlord refused to return my deposit. BuildDesk told me exactly what documents to collect and what to say. Got the money back in 3 weeks.',
    person: 'Priya M.',
    role: 'Software Engineer, Bangalore',
  },
  {
    quote:
      'As a CA I use the tax desk to quickly verify my understanding on edge cases. It is faster than searching through circulars.',
    person: 'Amit T.',
    role: 'Chartered Accountant, Ahmedabad',
  },
];

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    description: SITE_DESCRIPTION,
    title: SITE_TITLE,
    url: getBaseAppUrl(),
  },
  title: SITE_NAME,
};

function EchoWord({ word }: { word: string }) {
  return (
    <div className="echo-line">
      {echoLayers.map((layer) => (
        <span
          key={layer.offset}
          aria-hidden="true"
          className="echo-layer font-display text-[clamp(4.6rem,13vw,9.6rem)] font-bold uppercase leading-[0.88] tracking-[-0.07em]"
          style={{
            color: layer.color,
            transform: `translate(${layer.offset}, ${layer.offset})`,
          }}
        >
          {word}
        </span>
      ))}
      <span className="echo-foreground font-display text-[clamp(4.6rem,13vw,9.6rem)] font-bold uppercase leading-[0.88] tracking-[-0.07em] text-[#111111]">
        {word}
      </span>
    </div>
  );
}

function ProductPreview() {
  return (
    <div className="swiss-panel grid min-h-[610px] grid-rows-[auto_1fr]">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">Product preview</div>
          <div className="mt-1 font-display text-[28px] leading-none tracking-[-0.05em]">Focused chat workspace</div>
        </div>
        <div className="border border-[var(--color-border)] bg-white/56 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
          BuildDesk
        </div>
      </div>

      <div className="grid min-h-0 lg:grid-cols-[220px_1fr]">
        <div className="border-b border-[var(--color-border)] bg-white/18 p-4 lg:border-b-0 lg:border-r">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">Expert desks</div>
          <div className="mt-4 space-y-2">
            {DOMAIN_LIST.map((domain, index) => (
              <div
                key={domain.id}
                className={`flex items-center justify-between border px-3 py-2.5 text-[13px] ${
                  domain.id === 'legal'
                    ? 'border-[rgba(17,17,17,0.24)] bg-[#111111] text-[#f2f2f2]'
                    : 'border-[var(--color-border)] bg-white/52 text-[var(--color-text-primary)]'
                }`}
              >
                <span className="truncate">{domain.name}</span>
                <span className="font-display text-[18px] leading-none tracking-[-0.05em]">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid min-h-0 grid-rows-[auto_1fr_auto]">
          <div className="border-b border-[var(--color-border)] px-5 py-5">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">Current thread</div>
            <div className="mt-3 max-w-[34rem] border border-[#111111] bg-[#111111] px-4 py-3 text-[13px] leading-6 text-[#f2f2f2]">
              My landlord is not returning my security deposit. What should I do first?
            </div>
          </div>

          <div className="min-h-0 space-y-4 px-5 py-5">
            <div className="max-w-[42rem] border border-[var(--color-border)] bg-white/72 px-5 py-5">
              <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">Legal answer</div>
              <div className="mt-3 space-y-3 text-[14px] leading-7 text-[var(--color-text-primary)]">
                <p>Start by collecting the rent agreement, payment proof, and any written messages about the deposit.</p>
                <p>Send one clear written demand first. If the landlord still refuses, move toward a legal notice or consumer remedy depending on the facts.</p>
                <p className="text-[var(--color-text-secondary)]">The sequence matters as much as the right itself.</p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {[
                ['Documents', 'Agreement, receipts, messages'],
                ['Immediate step', 'Written demand before escalation'],
                ['Follow-up', 'Ask what changes if there is no written agreement'],
              ].map(([title, body]) => (
                <div key={title} className="metric-card px-4 py-4">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">{title}</div>
                  <div className="mt-2 text-[13px] leading-6 text-[var(--color-text-primary)]">{body}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--color-border)] px-5 py-4">
            <div className="grid gap-2 md:grid-cols-[1fr_auto]">
              <div className="border border-[var(--color-border)] bg-white/52 px-4 py-3 text-[13px] text-[var(--color-text-secondary)]">
                Ask a follow-up, refine a number, or switch desks.
              </div>
              <div className="border border-[#111111] bg-[#111111] px-5 py-3 text-[12px] uppercase tracking-[0.18em] text-[#f2f2f2]">
                Send
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const baseUrl = getBaseAppUrl();
  const homepageSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      description: SITE_DESCRIPTION,
      name: SITE_NAME,
      sameAs: ['https://www.vyarah.com'],
      url: baseUrl,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      applicationCategory: 'BusinessApplication',
      description: SITE_DESCRIPTION,
      featureList: [
        '6 expert desks for Indian professional questions',
        'Free guest sessions with no card required',
        'Structured AI answers with follow-up suggestions',
        'Saved conversations for signed-in users',
        'File uploads on paid plans',
        'White-label branded helpdesk workflows',
      ],
      isAccessibleForFree: true,
      name: SITE_NAME,
      offers: PUBLIC_PLAN_OFFERS.map((offer) => ({
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        category: offer.category,
        name: offer.name,
        price: offer.price,
        priceCurrency: offer.priceCurrency,
        url: offer.name === 'White-Label' ? `${baseUrl}/white-label` : `${baseUrl}/pricing`,
        ...(offer.unitText
          ? {
              priceSpecification: {
                '@type': 'UnitPriceSpecification',
                price: offer.price,
                priceCurrency: offer.priceCurrency,
                unitText: offer.unitText,
              },
            }
          : {}),
      })),
      operatingSystem: 'Web',
      url: baseUrl,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: PRICING_FAQS.map((faq) => ({
        '@type': 'Question',
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
        name: faq.question,
      })),
    },
  ];

  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(homepageSchemas) }}
      />

      <section className="border-b border-[var(--color-border)]">
        <div className="page-shell section-shell">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="swiss-chip px-3 py-2 text-[11px] font-medium uppercase tracking-[0.22em]">
              Built for actual professional questions
            </div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
              Swiss-minimal, product-led, high-trust
            </div>
          </div>

          <div className="mt-10 grid gap-10 xl:grid-cols-[minmax(0,0.88fr)_minmax(520px,1.12fr)] xl:items-start">
            <div className="flex flex-col gap-8">
              <div>
                <p className="eyebrow-label">Vyarah AI BuildDesk</p>
                <div className="mt-4">
                  <EchoWord word="Exact" />
                </div>
                <h1 className="mt-5 max-w-[11ch] font-display text-[clamp(3rem,6.5vw,6.1rem)] leading-[0.9] tracking-[-0.06em]">
                  Answers for messy professional questions.
                </h1>
                <p className="mt-6 max-w-[42rem] text-[17px] leading-8 text-[var(--color-text-secondary)]">
                  BuildDesk is an AI helpdesk for Indian tax, legal, medical, real estate, business, and finance
                  questions. It is built to make the first answer calmer, cleaner, and more useful.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/chat"
                  className="swiss-button min-h-12 px-6 py-4 text-[12px] font-medium uppercase tracking-[0.18em]"
                >
                  Start free session
                </Link>
                <Link
                  href="/pricing"
                  className="swiss-button-muted min-h-12 px-6 py-4 text-[12px] font-medium uppercase tracking-[0.18em]"
                >
                  See plans
                </Link>
              </div>

              <div className="grid gap-px bg-[var(--color-border)] sm:grid-cols-2">
                {heroNotes.map((note, index) => (
                  <div key={note} className={index === 0 ? 'bg-[var(--color-bg)] px-4 py-4' : 'bg-white/32 px-4 py-4'}>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
                      Why it matters
                    </div>
                    <p className="mt-2 text-[14px] leading-7 text-[var(--color-text-primary)]">{note}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-px bg-[var(--color-border)] md:grid-cols-3">
                {stats.map(([value, label]) => (
                  <div key={label} className="metric-card px-4 py-5">
                    <div className="font-display text-[34px] leading-none tracking-[-0.05em]">{value}</div>
                    <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <ProductPreview />
              <div className="grid gap-px bg-[var(--color-border)] sm:grid-cols-2">
                {[
                  ['Fast first pass', 'Use BuildDesk before the CA call, legal consult, clinic visit, or founder discussion.'],
                  ['Quietly premium', 'The interface is restrained on purpose, so the answer feels easier to trust and continue.'],
                ].map(([title, copy]) => (
                  <div key={title} className="story-card px-5 py-5">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">{title}</div>
                    <p className="mt-3 text-[14px] leading-7 text-[var(--color-text-primary)]">{copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="desks" className="page-shell section-shell">
        <div className="grid gap-12 lg:grid-cols-[0.68fr_1.32fr]">
          <div>
            <p className="eyebrow-label">Desk index</p>
            <h2 className="section-title mt-3 max-w-[10ch]">Six clear ways in.</h2>
            <p className="section-copy mt-5 max-w-[31rem]">
              The homepage should make the product legible fast. Each desk is a focused entry point for a different
              kind of professional problem instead of a generic single-chat promise.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {DOMAIN_LIST.map((domain, index) => (
              <Link key={domain.id} href="/chat" className="interactive-card surface-card flex min-h-[248px] flex-col justify-between p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="font-display text-[34px] leading-none tracking-[-0.06em] text-[var(--gray-depth-1)]">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="rounded-full border border-[var(--color-border)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
                    {domain.shortName}
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-display text-[30px] leading-[0.94] tracking-[-0.05em]">{domain.name}</h3>
                  <p className="mt-4 text-[14px] leading-7 text-[var(--color-text-secondary)]">
                    {domain.suggestedQuestions[0]}
                  </p>
                </div>

                <div className="mt-8 border-t border-[var(--color-border)] pt-4 text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-primary)]">
                  Open desk
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-[var(--color-border)] bg-white/22">
        <div className="page-shell section-shell">
          <div className="grid gap-10 lg:grid-cols-[0.74fr_1.26fr]">
            <div>
              <p className="eyebrow-label">Why this works</p>
              <h2 className="section-title mt-3 max-w-[11ch]">Calm on purpose.</h2>
              <p className="section-copy mt-5 max-w-[31rem]">
                The interface is not trying to entertain anyone. It is trying to make a hard question easier to enter,
                assess, and continue with better judgment.
              </p>
            </div>

            <div className="grid gap-5">
              {principles.map((item) => (
                <div key={item.index} className="section-frame grid gap-4 p-6 md:grid-cols-[96px_1fr]">
                  <div className="font-display text-[48px] leading-none tracking-[-0.06em] text-[var(--gray-depth-1)]">
                    {item.index}
                  </div>
                  <div>
                    <h3 className="font-display text-[28px] leading-[0.96] tracking-[-0.05em]">{item.title}</h3>
                    <p className="mt-3 text-[15px] leading-7 text-[var(--color-text-secondary)]">{item.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell section-shell">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="eyebrow-label">Testimonials</p>
            <h2 className="section-title mt-3 max-w-[12ch]">Proof before promise.</h2>
            <p className="section-copy mt-5 max-w-[31rem]">
              Placeholder testimonials for now, but this section should feel like practical credibility, not generic
              social proof wallpaper.
            </p>
          </div>

          <div className="grid gap-5">
            {testimonials.map((testimonial, index) => (
              <blockquote
                key={testimonial.person}
                className={
                  index === 1
                    ? 'border border-[#111111] bg-[#111111] px-6 py-6 text-[#f2f2f2] shadow-[var(--shadow-floating)]'
                    : 'story-card px-6 py-6'
                }
              >
                <p className={`text-[16px] leading-8 ${index === 1 ? 'text-[#f2f2f2]' : 'text-[var(--color-text-primary)]'}`}>
                  "{testimonial.quote}"
                </p>
                <footer className={`mt-5 ${index === 1 ? 'text-[#c9c9c9]' : 'text-[var(--color-text-secondary)]'}`}>
                  <div className="text-[12px] font-medium uppercase tracking-[0.18em]">{testimonial.person}</div>
                  <div className="mt-2 text-[14px] leading-7">{testimonial.role}</div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="border-y border-[var(--color-border)] bg-white/22">
        <div className="page-shell section-shell">
          <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
            <div className="swiss-panel p-6 sm:p-8">
              <p className="eyebrow-label">Typical workflow</p>
              <h2 className="mt-3 max-w-[14ch] font-display text-[42px] leading-[0.92] tracking-[-0.05em]">
                A cleaner path from question to next step.
              </h2>

              <div className="mt-8 grid gap-4">
                {workflow.map((item) => (
                  <div key={item.label} className="metric-card grid gap-3 px-4 py-5 md:grid-cols-[180px_1fr]">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
                      {item.label}
                    </div>
                    <div className="text-[15px] leading-7 text-[var(--color-text-primary)]">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5">
              {[
                ['Guest access', 'Start as a guest when you just need one clear answer. Sign in only when continuity becomes useful.'],
                ['Professional depth', 'Use plans and uploads when the question needs more context, longer memory, or repeat use.'],
                ['White-label path', 'When firms want a client-facing version, BuildDesk extends naturally into branded workflows.'],
              ].map(([title, copy], index) => (
                <div
                  key={title}
                  className={index === 1 ? 'border border-[#111111] bg-[#111111] px-6 py-7 text-[#f2f2f2]' : 'section-frame px-6 py-7'}
                >
                  <div className={`text-[11px] uppercase tracking-[0.22em] ${index === 1 ? 'text-[#bfbfbf]' : 'text-[var(--color-text-secondary)]'}`}>
                    {title}
                  </div>
                  <p className={`mt-3 text-[15px] leading-7 ${index === 1 ? 'text-[#d5d5d5]' : 'text-[var(--color-text-primary)]'}`}>{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell section-shell">
        <div className="section-frame grid gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(300px,0.68fr)] lg:items-end">
          <div>
            <p className="eyebrow-label">Next move</p>
            <h2 className="section-title mt-3 max-w-[12ch]">Use the right surface for the job.</h2>
            <p className="section-copy mt-5 max-w-[36rem]">
              Start with the live product, compare plans if you need continuity, or explore white-label if you want a
              branded client helpdesk under your own firm.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <Link href="/chat" className="swiss-button min-h-12 px-5 py-3 text-[12px] font-medium uppercase tracking-[0.18em]">
              Open BuildDesk
            </Link>
            <Link href="/pricing" className="swiss-button-muted min-h-12 px-5 py-3 text-[12px] font-medium uppercase tracking-[0.18em]">
              View pricing
            </Link>
            <Link href="/white-label" className="swiss-button-muted min-h-12 px-5 py-3 text-[12px] font-medium uppercase tracking-[0.18em]">
              Explore white-label
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
