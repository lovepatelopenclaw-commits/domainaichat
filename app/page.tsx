import Link from 'next/link';
import { DOMAIN_LIST } from '@/lib/domains';

const echoLayers = [
  { color: '#bfbfbf', offset: '-0.04em' },
  { color: '#c8c8c8', offset: '-0.08em' },
  { color: '#d1d1d1', offset: '-0.12em' },
  { color: '#d9d9d9', offset: '-0.16em' },
];

const principles = [
  {
    index: '01',
    title: 'Use the right desk first',
    copy: 'Tax, legal, medical, property, business, and finance each keep their own context instead of collapsing into one generic assistant.',
  },
  {
    index: '02',
    title: 'Ask the real question',
    copy: 'The system is built for the messy way people actually ask for help: with partial numbers, rough dates, and practical constraints.',
  },
  {
    index: '03',
    title: 'Read structured output',
    copy: 'Answers are easier to scan, easier to continue, and easier to turn into the next step of actual work.',
  },
  {
    index: '04',
    title: 'Keep continuity when needed',
    copy: 'BuildDesk works as a quick guest session or a repeat workspace with saved conversations and follow-ups.',
  },
];

const workflow = [
  {
    label: 'Question',
    value: 'My landlord is not returning my deposit. What should I do first?',
  },
  {
    label: 'Answer shape',
    value: 'Rights, immediate steps, documents to collect, escalation path, and a practical disclaimer.',
  },
  {
    label: 'Next move',
    value: 'Use a suggested follow-up instead of reformulating the whole issue from scratch.',
  },
];

function EchoWord({ word }: { word: string }) {
  return (
    <div className="echo-line">
      {echoLayers.map((layer) => (
        <span
          key={layer.offset}
          aria-hidden="true"
          className="echo-layer font-display text-[clamp(4.2rem,13vw,9rem)] font-bold uppercase leading-[0.9] tracking-[-0.05em]"
          style={{
            color: layer.color,
            transform: `translate(${layer.offset}, ${layer.offset})`,
          }}
        >
          {word}
        </span>
      ))}
      <span className="echo-foreground font-display text-[clamp(4.2rem,13vw,9rem)] font-bold uppercase leading-[0.9] tracking-[-0.05em] text-[#111111]">
        {word}
      </span>
    </div>
  );
}

function ProductPreview() {
  return (
    <div className="swiss-panel grid min-h-[560px] grid-rows-[auto_1fr]">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
            Live product shape
          </div>
          <div className="mt-1 font-display text-[28px] leading-none tracking-[-0.05em]">/chat</div>
        </div>
        <div className="border border-[var(--color-border)] bg-white/40 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
          Helpdesk view
        </div>
      </div>

      <div className="grid min-h-0 lg:grid-cols-[220px_1fr]">
        <div className="border-b border-[var(--color-border)] p-4 lg:border-b-0 lg:border-r">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">Desks</div>
          <div className="mt-4 space-y-2">
            {DOMAIN_LIST.map((domain, index) => (
              <div
                key={domain.id}
                className={`flex items-center justify-between border px-3 py-2 text-[13px] ${
                  domain.id === 'legal'
                    ? 'border-[rgba(17,17,17,0.26)] bg-[#111111] text-[#f2f2f2]'
                    : 'border-[var(--color-border)] bg-white/32 text-[var(--color-text-primary)]'
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
          <div className="border-b border-[var(--color-border)] px-5 py-4">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">Current thread</div>
            <div className="mt-2 max-w-[34rem] border border-[#111111] bg-[#111111] px-4 py-3 text-[13px] leading-6 text-[#f2f2f2]">
              My landlord is not returning my security deposit. What can I do first?
            </div>
          </div>

          <div className="min-h-0 space-y-4 px-5 py-5">
            <div className="max-w-[40rem] border border-[var(--color-border)] bg-white/48 px-5 py-4">
              <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">Legal answer</div>
              <div className="mt-3 space-y-3 text-[14px] leading-7 text-[var(--color-text-primary)]">
                <p>Start by collecting the rent agreement, payment proof, and any written messages about the deposit.</p>
                <p>Send one clear written demand first. If the landlord still refuses, you can move toward a legal notice or consumer/civil remedy depending on the facts.</p>
                <p className="text-[var(--color-text-secondary)]">Under Indian law, the practical sequence matters as much as the right itself.</p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {[
                ['Documents', 'Agreement, receipts, chat history'],
                ['Next step', 'Written demand before escalation'],
                ['Follow-up', 'What if there is no written agreement?'],
              ].map(([title, body]) => (
                <div key={title} className="border border-[var(--color-border)] bg-white/34 px-4 py-4">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">{title}</div>
                  <div className="mt-2 text-[13px] leading-6 text-[var(--color-text-primary)]">{body}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--color-border)] px-5 py-4">
            <div className="grid gap-2 md:grid-cols-[1fr_auto]">
              <div className="border border-[var(--color-border)] bg-white/40 px-4 py-3 text-[13px] text-[var(--color-text-secondary)]">
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
  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <section className="border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-[1360px] px-4 pb-14 pt-10 sm:px-6 sm:pb-20 sm:pt-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="swiss-chip px-3 py-2 text-[11px] font-medium uppercase tracking-[0.22em]">
              Built for actual professional questions
            </div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
              Swiss-inspired. Product-first.
            </div>
          </div>

          <div className="mt-10 grid gap-12 xl:grid-cols-[minmax(0,0.92fr)_minmax(560px,1.08fr)]">
            <div className="flex flex-col justify-between">
              <div>
                <p className="eyebrow-label">Vyarah AI BuildDesk</p>
                <div className="mt-5">
                  <EchoWord word="Exact" />
                </div>
                <h1 className="mt-6 max-w-[12ch] font-display text-[clamp(2.8rem,7vw,5.6rem)] leading-[0.92] tracking-[-0.05em]">
                  Answers for messy professional questions.
                </h1>
                <p className="mt-6 max-w-[38rem] text-[17px] leading-8 text-[var(--color-text-secondary)]">
                  BuildDesk is a focused AI helpdesk for Indian tax, legal, medical, property, business, and finance
                  queries. It is designed to feel quiet, legible, and useful when the problem itself is not.
                </p>

                <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/chat"
                    className="swiss-button px-6 py-4 text-[13px] font-medium uppercase tracking-[0.18em]"
                  >
                    Start a free session
                  </Link>
                  <Link
                    href="/pricing"
                    className="swiss-button-muted px-6 py-4 text-[13px] font-medium uppercase tracking-[0.18em]"
                  >
                    See pricing
                  </Link>
                </div>
              </div>

              <div className="mt-12 grid gap-px bg-[var(--color-border)] sm:grid-cols-3">
                {[
                  ['06', 'Expert desks'],
                  ['Guest', 'Start without friction'],
                  ['Saved', 'Keep continuity when signed in'],
                ].map(([value, label]) => (
                  <div key={label} className="bg-[var(--color-bg)] px-4 py-5">
                    <div className="font-display text-[34px] leading-none tracking-[-0.05em]">{value}</div>
                    <div className="mt-2 text-[12px] uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <ProductPreview />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1360px] px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="eyebrow-label">Desk Index</p>
            <h2 className="mt-3 max-w-[10ch] font-display text-[42px] leading-[0.92] tracking-[-0.05em]">
              Six ways in.
            </h2>
            <p className="mt-5 max-w-[28rem] text-[15px] leading-7 text-[var(--color-text-secondary)]">
              The homepage should make the product legible at a glance, so each desk is presented as a clean entry into
              a different kind of professional problem.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-px bg-[var(--color-border)] xl:grid-cols-3">
            {DOMAIN_LIST.map((domain, index) => (
              <Link
                key={domain.id}
                href="/chat"
                className="interactive-card flex min-h-[220px] flex-col justify-between bg-[var(--color-bg)] p-4 sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="font-display text-[30px] leading-none tracking-[-0.05em] text-[var(--gray-depth-1)]">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
                    {domain.shortName}
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-display text-[22px] leading-[0.95] tracking-[-0.05em] sm:text-[28px]">
                    {domain.name}
                  </h3>
                  <p className="mt-4 text-[14px] leading-6 text-[var(--color-text-secondary)]">
                    {domain.suggestedQuestions[0]}
                  </p>
                </div>

                <div className="mt-8 border-t border-[var(--color-border)] pt-4 text-[12px] uppercase tracking-[0.2em] text-[var(--color-text-primary)]">
                  Open desk
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--color-border)] bg-white/26">
        <div className="mx-auto max-w-[1360px] px-4 py-14 sm:px-6 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <p className="eyebrow-label">Why this shape works</p>
              <h2 className="mt-3 max-w-[12ch] font-display text-[42px] leading-[0.92] tracking-[-0.05em]">
                Calm on purpose.
              </h2>
              <p className="mt-5 max-w-[30rem] text-[15px] leading-7 text-[var(--color-text-secondary)]">
                The interface is not trying to entertain anyone. It is trying to make a hard question easier to enter,
                read, and continue.
              </p>
            </div>

            <div className="grid gap-px bg-[var(--color-border)]">
              {principles.map((item) => (
                <div key={item.index} className="grid gap-4 bg-[var(--color-bg)] p-6 md:grid-cols-[120px_1fr]">
                  <div className="font-display text-[52px] leading-none tracking-[-0.06em] text-[var(--gray-depth-1)]">
                    {item.index}
                  </div>
                  <div>
                    <h3 className="font-display text-[26px] leading-[0.96] tracking-[-0.05em]">{item.title}</h3>
                    <p className="mt-3 max-w-[40rem] text-[15px] leading-7 text-[var(--color-text-secondary)]">
                      {item.copy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1360px] px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-8 xl:grid-cols-[1.04fr_0.96fr]">
          <div className="swiss-panel p-6 sm:p-8">
            <p className="eyebrow-label">Typical workflow</p>
            <h2 className="mt-3 max-w-[14ch] font-display text-[40px] leading-[0.92] tracking-[-0.05em]">
              A clearer path from question to next step.
            </h2>

            <div className="mt-8 grid gap-px bg-[var(--color-border)]">
              {workflow.map((item) => (
                <div key={item.label} className="grid gap-3 bg-[rgba(255,255,255,0.28)] px-4 py-5 md:grid-cols-[150px_1fr]">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
                    {item.label}
                  </div>
                  <div className="text-[15px] leading-7 text-[var(--color-text-primary)]">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-px bg-[var(--color-border)]">
            {[
              ['Free', 'Start as a guest. Sign in when you want continuity.'],
              ['Pro', 'Use uploads, save more context, and keep working without daily friction.'],
              ['Trust', 'The UI stays restrained so the answer feels easier to verify, compare, and continue.'],
            ].map(([title, copy], index) => (
              <div
                key={title}
                className={index === 1 ? 'bg-[#111111] px-6 py-7 text-[#f2f2f2]' : 'bg-[var(--color-bg)] px-6 py-7'}
              >
                <div
                  className={`text-[11px] uppercase tracking-[0.22em] ${
                    index === 1 ? 'text-[#bfbfbf]' : 'text-[var(--color-text-secondary)]'
                  }`}
                >
                  {title}
                </div>
                <div className="mt-3 font-display text-[34px] leading-[0.94] tracking-[-0.05em]">{title}</div>
                <p className={`mt-4 text-[15px] leading-7 ${index === 1 ? 'text-[#d1d1d1]' : 'text-[var(--color-text-secondary)]'}`}>
                  {copy}
                </p>
              </div>
            ))}

            <Link
              href="/chat"
              className="swiss-button justify-between px-6 py-4 text-[13px] font-medium uppercase tracking-[0.18em]"
            >
              Open BuildDesk
              <span>Now</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
