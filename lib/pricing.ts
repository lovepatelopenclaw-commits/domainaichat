export type PricingFaq = {
  answer: string;
  question: string;
};

export type PublicPlanOffer = {
  category: 'free' | 'monthly' | 'yearly' | 'custom';
  name: string;
  price?: number;
  priceCurrency?: 'INR';
  unitText?: string;
};

export const PRICING_FAQS: PricingFaq[] = [
  {
    question: 'Can I switch plans anytime?',
    answer:
      'Yes. You can move between plans as your workflow changes, and the product is designed to scale up without forcing a new interface.',
  },
  {
    question: 'Is this a substitute for a CA or lawyer?',
    answer:
      'No. BuildDesk is meant to help you think, prepare, and structure questions faster, but important decisions should still be reviewed by a qualified professional.',
  },
  {
    question: 'What is the white-label plan?',
    answer:
      'It is a branded version of BuildDesk for firms that want their own domain, identity, desk setup, and knowledge base under a client-facing experience.',
  },
  {
    question: 'Is there an annual discount?',
    answer: 'Yes. Switching to yearly billing applies a 20% discount across the paid plans.',
  },
];

export const PUBLIC_PLAN_OFFERS: PublicPlanOffer[] = [
  {
    category: 'free',
    name: 'Guest',
    price: 0,
    priceCurrency: 'INR',
  },
  {
    category: 'monthly',
    name: 'Personal',
    price: 499,
    priceCurrency: 'INR',
    unitText: 'MONTH',
  },
  {
    category: 'monthly',
    name: 'Professional',
    price: 1499,
    priceCurrency: 'INR',
    unitText: 'MONTH',
  },
  {
    category: 'monthly',
    name: 'Business',
    price: 7999,
    priceCurrency: 'INR',
    unitText: 'MONTH',
  },
  {
    category: 'yearly',
    name: 'White-Label',
    price: 50000,
    priceCurrency: 'INR',
    unitText: 'YEAR',
  },
];
