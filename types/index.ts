export type DomainId = 'ca-tax' | 'legal' | 'medical' | 'real-estate' | 'business' | 'finance';

export interface Domain {
  id: DomainId;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  bgColor: string;
  lightBg: string;
  darkBg: string;
  systemPrompt: string;
  suggestedQuestions: string[];
}

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  conversationId?: string;
  role: MessageRole;
  content: string;
  domain?: DomainId;
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  domain: DomainId;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export type UsagePlan = 'guest' | 'free' | 'pro';

export interface UserProfile {
  id: string;
  email: string;
  plan: UsagePlan;
  createdAt: string;
}

export interface UsageRecord {
  id: string;
  userId: string;
  date: string;
  count: number;
}

export interface ChatRequest {
  messages: { role: MessageRole; content: string }[];
  domain: DomainId;
  conversationId?: string;
  documentContext?: string;
}

export interface UsageSummary {
  plan: UsagePlan;
  current: number;
  limit: number | null;
  remaining: number | null;
  date: string;
}
