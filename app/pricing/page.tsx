import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: 'Rs0',
    description: 'For individuals starting with a structured expert workspace.',
    tone: 'light' as const,
    features: ['Guest access before sign-in', 'All 6 expert desks', 'Saved history after sign-in', 'Follow-up suggestions'],
  },
  {
    name: 'Pro',
    price: 'Rs199',
    description: 'For professionals who want continuity, uploads, and repeated daily use.',
    tone: 'dark' as const,
    features: ['Unlimited questions', 'Full saved history', 'Upload-ready workflow', 'Priority support'],
  },
];

const faqs = [
  {
    q: 'Can I use BuildDesk before creating an account?',
    a: 'Yes. You can start immediately and sign in later when you want continuity across sessions.',
  },
  {
    q: 'What desks are included?',
    a: 'CA & Tax, Legal, Medical, Real Estate, Business, and General Finance are available across plans.',
  },
  {
    q: 'When does Pro make sense?',
    a: 'Usually once BuildDesk becomes part of your daily work and you need more volume and a steadier workflow.',
  },
  {
    q: 'Can I upgrade later?',
    a: 'Yes. The free plan is designed as a proper starting point rather than a crippled trial.',
  },
];

export default function PricingPage() {
  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <section className="border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-[1280px] px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="swiss-chip px-3 py-2 text-[11px] font-medium uppercase tracking-[0.22em]">
              Pricing
            </div>
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
              Clear tiers. No ornament.
            </div>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="eyebrow-label">Plan structure</p>
              <h1 className="mt-4 font-display text-[clamp(3.2rem,9vw,6.8rem)] font-bold uppercase leading-[0.9] tracking-[-0.05em]">
                Pay only when the workflow sticks.
              </h1>
            </div>
            <p className="max-w-[36rem] self-end text-[16px] font-medium leading-8 text-[var(--color-text-secondary)] sm:text-[18px]">
              Start with the free desk. Move to Pro when continuity, daily usage, and uploads become part of how you
              work.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-px bg-[var(--color-border)] lg:grid-cols-2">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={plan.tone === 'dark' ? 'bg-[#111111] p-6 text-[#f2f2f2] sm:p-8' : 'bg-[var(--color-bg)] p-6 sm:p-8'}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div
                    className={`text-[11px] uppercase tracking-[0.22em] ${
                      plan.tone === 'dark' ? 'text-[#bfbfbf]' : 'text-[var(--color-text-secondary)]'
                    }`}
                  >
                    {plan.name} plan
                  </div>
                  <div className="mt-4 font-display text-[64px] font-bold leading-none tracking-[-0.06em]">
                    {plan.price}
                  </div>
                </div>
                <div
                  className={`border px-3 py-2 text-[11px] uppercase tracking-[0.2em] ${
                    plan.tone === 'dark'
                      ? 'border-white/18 bg-white/4 text-[#d9d9d9]'
                      : 'border-[var(--color-border)] bg-white/40 text-[var(--color-text-secondary)]'
                  }`}
                >
                  {plan.tone === 'dark' ? 'Most used' : 'Start here'}
                </div>
              </div>

              <p
                className={`mt-5 max-w-[28rem] text-[15px] leading-7 ${
                  plan.tone === 'dark' ? 'text-[#d1d1d1]' : 'text-[var(--color-text-secondary)]'
                }`}
              >
                {plan.description}
              </p>

              <div className="mt-8 grid gap-px bg-current/12">
                {plan.features.map((feature, index) => (
                  <div
                    key={feature}
                    className={`flex items-center justify-between px-4 py-4 text-[14px] ${
                      plan.tone === 'dark' ? 'bg-[#151515] text-[#f2f2f2]' : 'bg-[var(--color-bg)] text-[var(--color-text-primary)]'
                    }`}
                  >
                    <span>{feature}</span>
                    <span className="font-display text-[24px] leading-none tracking-[-0.05em]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href={plan.tone === 'dark' ? '/signup' : '/chat'}
                className={
                  plan.tone === 'dark'
                    ? 'swiss-button-muted mt-8 px-6 py-4 text-[13px] font-medium uppercase tracking-[0.18em]'
                    : 'swiss-button mt-8 px-6 py-4 text-[13px] font-medium uppercase tracking-[0.18em]'
                }
              >
                {plan.tone === 'dark' ? 'Upgrade to Pro' : 'Start Free'}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--color-border)] bg-white/28">
        <div className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6 sm:py-20">
          <div className="flex flex-col gap-5 border-b border-[var(--color-border)] pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow-label">Questions</p>
              <h2 className="mt-3 font-display text-[40px] font-bold uppercase leading-[0.92] tracking-[-0.05em]">
                Common points
              </h2>
            </div>
            <p className="max-w-[30rem] text-[15px] leading-7 text-[var(--color-text-secondary)]">
              The pricing model is intentionally simple so the product remains legible at a glance.
            </p>
          </div>

          <div className="mt-8 grid gap-px bg-[var(--color-border)] md:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-[var(--color-bg)] p-6">
                <h3 className="font-display text-[25px] font-bold uppercase leading-[0.96] tracking-[-0.05em]">
                  {faq.q}
                </h3>
                <p className="mt-4 text-[15px] leading-7 text-[var(--color-text-secondary)]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
