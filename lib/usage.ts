import { UsagePlan } from '@/types';

export const USAGE_LIMITS: Record<UsagePlan, number> = {
  guest: 3,
  free: 10,
  pro: Infinity,
};

export interface UsageCheckResult {
  allowed: boolean;
  current: number;
  limit: number;
  plan: UsagePlan;
}

export function getUsageLimit(plan: UsagePlan): number {
  return USAGE_LIMITS[plan];
}

export function isUsageExceeded(count: number, plan: UsagePlan): boolean {
  const limit = USAGE_LIMITS[plan];
  return count >= limit;
}
