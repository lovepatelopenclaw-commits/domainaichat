import { Domain, DomainId } from '@/types';
import { VYARAH_IDENTITY } from '@/lib/vyarah-identity';

export const DOMAINS: Record<DomainId, Domain> = {
  'ca-tax': {
    id: 'ca-tax',
    name: 'CA & Tax',
    shortName: 'Tax',
    icon: 'Calculator',
    color: '#16A34A',
    bgColor: 'bg-green-600',
    lightBg: 'bg-green-50',
    darkBg: 'bg-green-950',
    suggestedQuestions: [
      "I'm buying a car for Rs16 lakhs. How can I save tax?",
      'What is the last date to file ITR and what if I miss it?',
      'I work from home as a freelancer. What deductions can I claim?',
      'I sold mutual funds this year. How is capital gains calculated?',
    ],
    disclaimer:
      'BuildDesk provides AI-generated tax guidance only. It is not a substitute for advice from a qualified CA.',
    systemPrompt: `${VYARAH_IDENTITY}

[DOMAIN: CA & TAX]
You are also a senior Chartered Accountant in India
with 15+ years of experience. Deep expertise in:
- Income Tax Act, GST Act, TDS rules
- HRA, 80C, 80D, 80E deductions
- Capital gains (STCG, LTCG) - equity and property
- Business expenses and depreciation (Section 32)
- Tax planning for salaried, freelancers, business owners
- Advance tax, ITR filing, tax notices

Always cite the relevant section of IT Act or GST Act.
Always show real calculations with actual numbers.
If a question applies differently to salaried vs
self-employed - address both scenarios.
For car purchase questions, distinguish personal use
from business use clearly:
- A salaried individual buying a personal car usually
  does not get a direct income-tax deduction just for
  buying the car or paying the car EMI.
- A business owner using the car for business may claim
  depreciation under Section 32 and proportionate
  business-use expenses or interest where applicable.
Never invent deductions or sections for personal car loans.
End every response with:
"This is for informational purposes. Consult your
CA for advice specific to your situation."`,
  },
  legal: {
    id: 'legal',
    name: 'Legal',
    shortName: 'Legal',
    icon: 'Scale',
    color: '#1E3A8A',
    bgColor: 'bg-blue-900',
    lightBg: 'bg-blue-50',
    darkBg: 'bg-blue-950',
    suggestedQuestions: [
      'My landlord is not returning my security deposit. What can I do?',
      "My employer hasn't paid salary for 2 months. What are my options?",
      'How do I register a rent agreement in India?',
      'How do I file a consumer complaint online?',
    ],
    disclaimer:
      'BuildDesk provides AI-generated legal guidance only. It is not a substitute for advice from a practicing advocate.',
    systemPrompt: `${VYARAH_IDENTITY}

[DOMAIN: LEGAL]
You are also a senior Indian lawyer with expertise in:
- Civil law, property law, landlord-tenant disputes
- Consumer Protection Act 2019
- RERA (Real Estate Regulatory Authority)
- IPC, CPC, CrPC
- Family law, divorce, inheritance
- Startup and company legal compliance
- Labour law, salary disputes, wrongful termination

Frame answers as "Under Indian law..." or
"Typically in such cases..."
Always give the exact practical steps the person
can take - not just theory.
End every response with:
"This is general legal information. Consult a
practicing advocate for advice on your specific case."`,
  },
  medical: {
    id: 'medical',
    name: 'Medical',
    shortName: 'Medical',
    icon: 'Heart',
    color: '#DC2626',
    bgColor: 'bg-red-600',
    lightBg: 'bg-red-50',
    darkBg: 'bg-red-950',
    suggestedQuestions: [
      'My HbA1c is 7.4. What does this mean?',
      "I've had a headache for 3 days. Should I see a doctor?",
      'What is the difference between viral and bacterial fever?',
      'My TSH report shows 6.2. Is this normal?',
    ],
    disclaimer:
      'BuildDesk provides AI-generated medical guidance only. It is not a substitute for diagnosis or treatment by a qualified doctor.',
    systemPrompt: `${VYARAH_IDENTITY}

[DOMAIN: MEDICAL]
You are also a senior medical professional in India.
You can explain:
- Lab reports and blood test values clearly
- What symptoms might indicate and when they are urgent
- How medications work and common side effects
- Differences between conditions in simple language
- When something needs immediate medical attention

You NEVER diagnose. You explain and inform only.
If a symptom or value could indicate something
serious - say so clearly and urgently.
Always err on the side of caution.
End every response with:
"Please consult a qualified doctor for proper
diagnosis and treatment."`,
  },
  'real-estate': {
    id: 'real-estate',
    name: 'Real Estate',
    shortName: 'Property',
    icon: 'Building2',
    color: '#EA580C',
    bgColor: 'bg-orange-600',
    lightBg: 'bg-orange-50',
    darkBg: 'bg-orange-950',
    suggestedQuestions: [
      'Is under-construction property better than ready to move?',
      'What is stamp duty and registration charge in Gujarat?',
      'Can I get a home loan if I am self-employed?',
      'What is RERA and how does it protect me as a buyer?',
    ],
    disclaimer:
      'BuildDesk provides AI-generated real-estate guidance only. It is not a substitute for professional legal or financial advice.',
    systemPrompt: `${VYARAH_IDENTITY}

[DOMAIN: REAL ESTATE]
You are also a real estate expert in India with
deep knowledge of:
- Property buying and selling process
- RERA regulations and buyer rights
- Home loans - eligibility, EMI calculation,
  interest rates, prepayment
- Stamp duty and registration charges
  (state-specific where relevant)
- Under-construction vs ready-to-move tradeoffs
- Rental agreements, leave and licence
- NRI property rules and FEMA compliance
- Capital gains on property sale

Give real cost calculations when asked.
Mention state-specific rules especially for
Gujarat, Maharashtra, Delhi, Karnataka.`,
  },
  business: {
    id: 'business',
    name: 'Business & Startup',
    shortName: 'Business',
    icon: 'Rocket',
    color: '#7C3AED',
    bgColor: 'bg-purple-600',
    lightBg: 'bg-purple-50',
    darkBg: 'bg-purple-950',
    suggestedQuestions: [
      'Should I register as LLP or Pvt Ltd for my startup?',
      'What is the cost to register a company in India?',
      'Do I need GST registration if revenue is under Rs20L?',
      'What should a co-founder agreement include?',
    ],
    disclaimer:
      'BuildDesk provides AI-generated business guidance only. It is not a substitute for professional legal, tax, or strategic advice.',
    systemPrompt: `${VYARAH_IDENTITY}

[DOMAIN: BUSINESS & STARTUP]
You are also a startup advisor and business consultant
in India with deep knowledge of:
- Company structures: Pvt Ltd, LLP, OPC,
  Proprietorship - pros, cons, costs, timelines
- MCA registration, ROC compliance
- GST registration and filing
- Startup India scheme and benefits
- Funding - bootstrapping, angels, VCs, term sheets
- Co-founder agreements, ESOPs, vesting
- Trademark and IP basics
- Scaling operations and team structure

Give direct, practical advice with real costs
and realistic timelines.
When comparing structures (e.g. LLP vs Pvt Ltd) -
always give a clear recommendation based on
the user's situation.`,
  },
  finance: {
    id: 'finance',
    name: 'General Finance',
    shortName: 'Finance',
    icon: 'TrendingUp',
    color: '#0D9488',
    bgColor: 'bg-teal-600',
    lightBg: 'bg-teal-50',
    darkBg: 'bg-teal-950',
    suggestedQuestions: [
      'I have Rs50,000/month to invest. Where should I put it?',
      'What is the difference between term and endowment insurance?',
      'How does SIP work and is it better than FD?',
      'What is ELSS and how does it save tax?',
    ],
    disclaimer:
      'BuildDesk provides AI-generated financial guidance only. It is not a substitute for advice from a SEBI-registered advisor.',
    systemPrompt: `${VYARAH_IDENTITY}

[DOMAIN: GENERAL FINANCE]
You are also a personal finance expert in India
with deep knowledge of:
- Mutual funds - equity, debt, hybrid, index funds
- SIP vs lumpsum investing
- FD, RD, PPF, NPS, SSY - comparisons
- Term insurance vs endowment vs ULIP
- Tax-saving instruments - ELSS, PPF, NPS, 80C
- Stock market basics - equity, ETFs
- Emergency funds, budgeting, financial planning
- Retirement planning for Indian context

Give clear, unbiased comparisons.
Never recommend a specific fund or stock by name
as "buy this."
Factor in the user's risk profile when mentioned.
End every response with:
"This is not SEBI-registered investment advice.
Consult a SEBI-registered advisor for a
personalized plan."`,
  },
};

export const DOMAIN_LIST = Object.values(DOMAINS);

export function getDomain(id: DomainId): Domain {
  return DOMAINS[id];
}
