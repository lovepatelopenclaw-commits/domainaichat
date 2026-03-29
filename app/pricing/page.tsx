'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PRICING_FAQS } from '@/lib/pricing';

type BillingCycle = 'monthly' | 'yearly';

type Plan = {
  ctaHref: string;
  ctaLabel: string;
  customPrice?: string;
  description: string;
  eyebrow: string;
  features: string[];
  isHighlighted?: boolean;
  monthlyPrice: number | null;
  name: string;
};

const YEARLY_DISCOUNT = 0.2;

const plans: Plan[] = [
  {
    name: 'Guest',
    eyebrow: 'Try before you trust',
    description: 'Start inside the product first, then decide whether BuildDesk belongs in your routine.',
    ctaHref: '/chat',
    ctaLabel: 'Start Free',
    monthlyPrice: 0,
    features: ['All 6 expert desks', 'Guest access without sign-in', 'Limited questions per day'],
  },
  {
    name: 'Personal',
    eyebrow: 'Individuals with regular professional questions',
    description: 'For people who want continuity, uploads, and a calmer place to return to.',
    ctaHref: '/signup',
    ctaLabel: 'Get Personal',
    monthlyPrice: 499,
    features: ['Unlimited questions', 'Saved history', 'File uploads', 'Export answers as PDF'],
  },
  {
    name: 'Professional',
    eyebrow: 'CAs, lawyers, doctors, consultants',
    description: 'The working plan for professionals who rely on deeper continuity and stronger output.',
    ctaHref: '/signup',
    ctaLabel: 'Go Professional',
    monthlyPrice: 1499,
    isHighlighted: true,
    features: ['Everything in Personal', 'Longer context memory', 'Priority answer quality', 'API access', 'PDF export with branding'],
  },
  {
    name: 'Business',
    eyebrow: 'Small firms deploying for their clients',
    description: 'A team workspace for firms that want a deployable BuildDesk setup without extra clutter.',
    ctaHref: '/signup',
    ctaLabel: 'Start Business Trial',
    monthlyPrice: 7999,
    features: ['Up to 5 team members', 'Custom desk configuration', 'Usage analytics dashboard', 'Dedicated support'],
  },
  {
    name: 'White-Label',
    eyebrow: 'Firms wanting their own branded version',
    description: 'A branded BuildDesk instance with its own workflow, appearance, and support model.',
    ctaHref: '/white-label',
    ctaLabel: 'Request a Demo',
    monthlyPrice: null,
    customPrice: 'Custom pricing',
    features: ['Custom domain + branding', 'Custom knowledge base', 'Unlimited users', 'Priority SLA'],
  },
];

function formatInr(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

function getDisplayPrice(plan: Plan, billingCycle: BillingCycle) {
  if (plan.monthlyPrice === null) {
    return {
      amountLabel: plan.customPrice ?? 'Custom pricing',
      cadenceLabel: 'Let us scope it with you',
      strikeLabel: null,
    };
  }

  if (plan.monthlyPrice === 0) {
    return {
      amountLabel: 'Free',
      cadenceLabel: 'No card required',
      strikeLabel: null,
    };
  }

  if (billingCycle === 'yearly') {
    const discountedMonthlyPrice = Math.round(plan.monthlyPrice * (1 - YEARLY_DISCOUNT));

    return {
      amountLabel: `${formatInr(discountedMonthlyPrice)}/mo`,
      cadenceLabel: 'Billed yearly',
      strikeLabel: `${formatInr(plan.monthlyPrice)}/mo`,
    };
  }

  return {
    amountLabel: `${formatInr(plan.monthlyPrice)}/mo`,
    cadenceLabel: 'Billed monthly',
    strikeLabel: null,
  };
}

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <section className="border-b border-[var(--color-border)]">
        <div className="page-shell section-shell">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="swiss-chip px-3 py-2 text-[11px] font-medium uppercase tracking-[0.22em]">Pricing</div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
              Five tiers. One clear ladder.
            </div>
          </div>

          <div className="mt-10 grid gap-10 xl:grid-cols-[minmax(0,0.88fr)_minmax(360px,0.72fr)] xl:items-end">
            <div>
              <p className="eyebrow-label">Plan structure</p>
              <h1 className="mt-4 max-w-[10ch] font-display text-[clamp(3.2rem,7.2vw,6rem)] leading-[0.9] tracking-[-0.06em]">
                Pick the right BuildDesk depth.
              </h1>
              <p className="mt-6 max-w-[42rem] text-[17px] leading-8 text-[var(--color-text-secondary)]">
                Start with open guest access, then move into continuity, professional depth, business workflows, and
                white-label deployment without changing how the product feels to use.
              </p>
            </div>

            <div className="section-frame p-5">
              <div className="inline-flex border border-[var(--color-border)] bg-white/44 p-1">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`min-h-11 px-4 text-[12px] font-medium uppercase tracking-[0.18em] transition-colors ${
                    billingCycle === 'monthly' ? 'bg-[var(--color-text-primary)] text-white' : 'text-[var(--color-text-secondary)]'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  className={`min-h-11 px-4 text-[12px] font-medium uppercase tracking-[0.18em] transition-colors ${
                    billingCycle === 'yearly' ? 'bg-[var(--color-text-primary)] text-white' : 'text-[var(--color-text-secondary)]'
                  }`}
                >
                  Yearly
                </button>
              </div>

              <div className="mt-5 grid gap-px bg-[var(--color-border)] sm:grid-cols-3">
                {[
                  ['Guest', 'Use immediately with no card'],
                  ['Professional', 'Built for repeat expert workflows'],
                  ['White-label', 'Deploy under your own brand'],
                ].map(([title, copy]) => (
                  <div key={title} className="metric-card px-4 py-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">{title}</div>
                    <p className="mt-2 text-[13px] leading-6 text-[var(--color-text-primary)]">{copy}</p>
                  </div>
                ))}
              </div>

              {billingCycle === 'yearly' ? (
                <p className="mt-4 text-[12px] uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
                  Yearly billing applies a 20% discount on paid plans.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell section-shell">
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-5">
          {plans.map((plan) => {
            const displayPrice = getDisplayPrice(plan, billingCycle);
            const isDark = plan.isHighlighted;

            return (
              <article
                key={plan.name}
                className={
                  isDark
                    ? 'flex flex-col border border-[#111111] bg-[#111111] p-6 text-[#f2f2f2] shadow-[var(--shadow-floating)]'
                    : 'surface-card flex flex-col p-6'
                }
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className={`text-[11px] uppercase tracking-[0.22em] ${isDark ? 'text-[#bfbfbf]' : 'text-[var(--color-text-secondary)]'}`}>
                      {plan.name}
                    </div>
                    <h2 className="mt-4 font-display text-[34px] leading-[0.92] tracking-[-0.05em]">
                      {displayPrice.amountLabel}
                    </h2>
                    <div className={`mt-3 text-[12px] uppercase tracking-[0.18em] ${isDark ? 'text-[#d0d0d0]' : 'text-[var(--color-text-secondary)]'}`}>
                      {displayPrice.cadenceLabel}
                    </div>
                    {displayPrice.strikeLabel ? (
                      <div className={`mt-2 text-[13px] ${isDark ? 'text-[#9f9f9f]' : 'text-[var(--color-text-muted)]'}`}>
                        <span className="line-through">{displayPrice.strikeLabel}</span>
                      </div>
                    ) : null}
                  </div>

                  {plan.isHighlighted ? (
                    <div className="rounded-full border border-white/18 bg-white/6 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[#d9d9d9]">
                      Most used
                    </div>
                  ) : null}
                </div>

                <p className={`mt-6 text-[14px] leading-7 ${isDark ? 'text-[#d6d6d6]' : 'text-[var(--color-text-secondary)]'}`}>
                  {plan.eyebrow}
                </p>
                <p className={`mt-4 text-[14px] leading-7 ${isDark ? 'text-[#c8c8c8]' : 'text-[var(--color-text-secondary)]'}`}>
                  {plan.description}
                </p>

                <div className={`mt-8 grid gap-3 ${isDark ? '' : ''}`}>
                  {plan.features.map((feature, index) => (
                    <div
                      key={feature}
                      className={
                        isDark
                          ? 'flex items-center justify-between gap-3 border border-white/10 bg-[#171717] px-4 py-4 text-[14px]'
                          : 'metric-card flex items-center justify-between gap-3 px-4 py-4 text-[14px]'
                      }
                    >
                      <span>{feature}</span>
                      <span className="font-display text-[20px] leading-none tracking-[-0.05em]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href={plan.ctaHref}
                  className={
                    isDark
                      ? 'swiss-button-muted mt-8 min-h-12 px-4 py-3 text-[12px] font-medium uppercase tracking-[0.18em]'
                      : 'swiss-button mt-8 min-h-12 px-4 py-3 text-[12px] font-medium uppercase tracking-[0.18em]'
                  }
                >
                  {plan.ctaLabel}
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-[var(--color-border)] bg-white/22">
        <div className="page-shell section-shell">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="eyebrow-label">Questions</p>
              <h2 className="section-title mt-3 max-w-[10ch]">Pricing FAQ</h2>
              <p className="section-copy mt-5 max-w-[30rem]">
                The pricing surface should read like a product decision, not a spreadsheet. These are the core
                questions most people ask before choosing a plan.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {PRICING_FAQS.map((faq) => (
                <div key={faq.question} className="surface-card p-6">
                  <h3 className="font-display text-[26px] leading-[0.96] tracking-[-0.05em]">{faq.question}</h3>
                  <p className="mt-4 text-[15px] leading-7 text-[var(--color-text-secondary)]">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell section-shell-sm">
        <div className="section-frame grid gap-6 px-6 py-6 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(280px,0.72fr)] lg:items-center">
          <div>
            <p className="text-[12px] leading-6 text-[var(--color-text-secondary)]">
              BuildDesk provides AI-generated guidance only. It is not a substitute for professional legal, medical,
              tax, or financial advice.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Link href="/chat" className="swiss-button min-h-12 px-5 py-3 text-[12px] font-medium uppercase tracking-[0.18em]">
              Start free
            </Link>
            <Link href="/white-label" className="swiss-button-muted min-h-12 px-5 py-3 text-[12px] font-medium uppercase tracking-[0.18em]">
              Need white-label
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
