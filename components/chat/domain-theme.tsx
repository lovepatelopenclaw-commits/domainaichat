import type { DomainId } from '@/types';
import {
  Building2,
  Calculator,
  HeartPulse,
  Landmark,
  Scale,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';

type DomainVisual = {
  color: string;
  emoji: string;
  icon: LucideIcon;
};

export const DOMAIN_VISUALS: Record<DomainId, DomainVisual> = {
  'ca-tax': {
    color: 'var(--ca-tax)',
    emoji: '📊',
    icon: Calculator,
  },
  legal: {
    color: 'var(--legal)',
    emoji: '⚖️',
    icon: Scale,
  },
  medical: {
    color: 'var(--medical)',
    emoji: '🩺',
    icon: HeartPulse,
  },
  'real-estate': {
    color: 'var(--real-estate)',
    emoji: '🏠',
    icon: Building2,
  },
  business: {
    color: 'var(--business)',
    emoji: '🏢',
    icon: Landmark,
  },
  finance: {
    color: 'var(--finance)',
    emoji: '₹',
    icon: TrendingUp,
  },
};

export function getDomainVisual(domainId: DomainId) {
  return DOMAIN_VISUALS[domainId];
}
