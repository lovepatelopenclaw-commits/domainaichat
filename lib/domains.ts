import { Domain, DomainId } from '@/types';

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
  },
};

export const DOMAIN_LIST = Object.values(DOMAINS);

export function getDomain(id: DomainId): Domain {
  return DOMAINS[id];
}
