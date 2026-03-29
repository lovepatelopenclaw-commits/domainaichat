import type { Metadata } from 'next';
import Link from 'next/link';
import { WhiteLabelDemoForm } from '@/components/marketing/WhiteLabelDemoForm';
import { getBaseAppUrl } from '@/lib/app-url';
import { SITE_NAME } from '@/lib/seo';

const audience = [
  {
    title: 'CA & Accounting Firms',
    copy: 'Answer recurring tax, GST, filing, and compliance questions under your own firm identity.',
  },
  {
    title: 'Law Firms & Legal Consultants',
    copy: 'Give clients a first-pass legal helpdesk that reflects your language, workflows, and intake process.',
  },
  {
    title: 'Healthcare Clinics & Doctors',
    copy: 'Offer educational patient guidance, intake support, and follow-up clarity inside a branded experience.',
  },
  {
    title: 'Financial Advisors & Wealth Managers',
    copy: 'Deliver faster client answers on planning basics, product education, and recurring service queries.',
  },
];

const benefits = [
  'Custom domain (e.g. help.yourfirm.com)',
  'Branded UI with your logo and colors',
  "Custom knowledge base with your firm's documents",
  'Unlimited client users',
  'Usage analytics dashboard',
  'Priority support & SLA',
];

export const metadata: Metadata = {
  alternates: {
    canonical: '/white-label',
  },
  description:
    'Launch your own branded AI helpdesk for clients with BuildDesk white-label for CA firms, law firms, clinics, and financial advisors.',
  openGraph: {
    description:
      'Launch your own branded AI helpdesk for clients with BuildDesk white-label for CA firms, law firms, clinics, and financial advisors.',
    title: `White-Label | ${SITE_NAME}`,
    url: `${getBaseAppUrl()}/white-label`,
  },
  title: 'White-Label',
};

export default function WhiteLabelPage() {
  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <section className="border-b border-[var(--color-border)]">
        <div className="page-shell section-shell">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="swiss-chip px-3 py-2 text-[11px] font-medium uppercase tracking-[0.22em]">
              White-label BuildDesk
            </div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
              Built for firms with client-facing workflows
            </div>
          </div>

          <div className="mt-10 grid gap-10 xl:grid-cols-[minmax(0,0.92fr)_minmax(380px,0.88fr)] xl:items-start">
            <div className="space-y-8">
              <div>
                <p className="eyebrow-label">Your brand, your domain, your knowledge base</p>
                <h1 className="mt-4 max-w-[11ch] font-display text-[clamp(3rem,7vw,5.8rem)] leading-[0.9] tracking-[-0.06em]">
                  Your own branded AI helpdesk, powered by BuildDesk.
                </h1>
                <p className="mt-6 max-w-[42rem] text-[17px] leading-8 text-[var(--color-text-secondary)]">
                  Give your clients instant answers under your brand with a custom domain, branded interface, custom
                  knowledge base, and unlimited users.
                </p>
              </div>

              <div className="grid gap-px bg-[var(--color-border)] sm:grid-cols-3">
                {[
                  ['Brand', 'Client-facing experience shaped around your firm'],
                  ['Deploy', 'Launch on your own custom domain'],
                  ['Scale', 'Serve unlimited client users under one setup'],
                ].map(([title, copy]) => (
                  <div key={title} className="metric-card px-4 py-5">
                    <div className="font-display text-[28px] leading-none tracking-[-0.05em]">{title}</div>
                    <p className="mt-3 text-[13px] leading-6 text-[var(--color-text-secondary)]">{copy}</p>
                  </div>
                ))}
              </div>
            </div>

            <WhiteLabelDemoForm />
          </div>
        </div>
      </section>

      <section className="page-shell section-shell">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="eyebrow-label">Who it is for</p>
            <h2 className="section-title mt-3 max-w-[12ch]">Designed for firms people already trust.</h2>
            <p className="section-copy mt-5 max-w-[31rem]">
              White-label BuildDesk is for teams that answer the same high-context questions every week and want a
              client-facing first response layer that actually looks and feels like their own system.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {audience.map((item) => (
              <article key={item.title} className="surface-card p-6">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">Audience</p>
                <h3 className="mt-4 font-display text-[28px] leading-[0.94] tracking-[-0.05em]">{item.title}</h3>
                <p className="mt-4 text-[15px] leading-7 text-[var(--color-text-secondary)]">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--color-border)] bg-white/22">
        <div className="page-shell section-shell">
          <div className="grid gap-10 lg:grid-cols-[0.76fr_1.24fr]">
            <div>
              <p className="eyebrow-label">What they get</p>
              <h2 className="section-title mt-3 max-w-[11ch]">A real client helpdesk system, not a demo bot.</h2>
              <p className="section-copy mt-5 max-w-[31rem]">
                The white-label package is for firms that need branded deployment, knowledge control, analytics, and
                support with enough polish to put it in front of real clients.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {benefits.map((benefit, index) => (
                <div key={benefit} className="surface-card px-5 py-5">
                  <div className="font-display text-[30px] leading-none tracking-[-0.05em] text-[var(--gray-depth-1)]">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <p className="mt-4 text-[15px] leading-7 text-[var(--color-text-primary)]">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell section-shell">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.84fr)_minmax(320px,0.66fr)]">
          <div className="section-frame p-6 sm:p-8">
            <p className="eyebrow-label">Pricing</p>
            <h2 className="mt-3 font-display text-[40px] leading-[0.92] tracking-[-0.05em]">
              From Rs50,000/year, scoped to your firm size
            </h2>
            <p className="mt-5 max-w-[42rem] text-[15px] leading-7 text-[var(--color-text-secondary)]">
              Scope depends on desk mix, branding depth, knowledge base volume, and rollout support. We map the setup
              to your firm before finalizing the build.
            </p>
          </div>

          <div className="grid gap-5">
            {[
              ['Custom domain', 'Launch on your own subdomain or client-facing helpdesk URL.'],
              ['Custom knowledge', 'Use your own documents and firm-specific answer context.'],
              ['Priority support', 'Get guided setup and ongoing SLA-backed support.'],
            ].map(([title, copy]) => (
              <div key={title} className="surface-card px-5 py-5">
                <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">{title}</div>
                <p className="mt-3 text-[14px] leading-7 text-[var(--color-text-primary)]">{copy}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 section-frame grid gap-6 px-6 py-6 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(280px,0.68fr)] lg:items-center">
          <div>
            <p className="text-[13px] leading-7 text-[var(--color-text-secondary)]">
              BuildDesk provides AI-generated guidance only. It is not a substitute for professional advice.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Link href="/pricing" className="swiss-button-muted min-h-12 px-5 py-3 text-[12px] font-medium uppercase tracking-[0.18em]">
              Compare plans
            </Link>
            <Link href="/chat" className="swiss-button min-h-12 px-5 py-3 text-[12px] font-medium uppercase tracking-[0.18em]">
              Try live product
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
