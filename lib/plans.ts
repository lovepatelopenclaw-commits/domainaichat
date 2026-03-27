import { UsagePlan } from '@/types';

const PLAN_LABELS: Record<UsagePlan, string> = {
  guest: 'Guest',
  personal: 'Personal',
  professional: 'Professional',
  business: 'Business',
  'white-label': 'White-Label',
};

export function normalizeUsagePlan(plan?: string | null): UsagePlan {
  switch (plan) {
    case 'guest':
    case 'personal':
    case 'professional':
    case 'business':
    case 'white-label':
      return plan;
    case 'free':
      return 'personal';
    case 'pro':
      return 'professional';
    default:
      return 'personal';
  }
}

export function getPlanLabel(plan: UsagePlan) {
  return PLAN_LABELS[plan];
}

export function isUnlimitedPlan(plan: UsagePlan) {
  return plan !== 'guest';
}

export function canUploadFiles(plan: UsagePlan) {
  return plan !== 'guest';
}

export function canAccessShare() {
  return true;
}

export function canAccessWhitelabel(plan: UsagePlan) {
  return plan === 'business' || plan === 'white-label';
}

export function canAccessWhatsapp(plan: UsagePlan) {
  return plan === 'professional' || plan === 'business' || plan === 'white-label';
}
