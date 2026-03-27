export type DomainId =
  | 'ca-tax'
  | 'legal'
  | 'medical'
  | 'real-estate'
  | 'business'
  | 'finance';

export type UsagePlan =
  | 'guest'
  | 'personal'
  | 'professional'
  | 'business'
  | 'white-label';

export type OnboardingPersona =
  | 'salaried-professional'
  | 'business-owner'
  | 'ca-lawyer-doctor'
  | 'student'
  | 'investor'
  | 'other';

export type TeamMemberRole = 'admin' | 'viewer';

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
  disclaimer?: string;
}

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  conversationId?: string;
  role: MessageRole;
  content: string;
  domain?: DomainId;
  createdAt: string;
  shareId?: string | null;
}

export interface Conversation {
  id: string;
  userId: string;
  domain: DomainId;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  city?: string | null;
  onboardingCompleted?: boolean;
  onboardingEmailQueuedAt?: string | null;
  onboardingEmailSentAt?: string | null;
  persona?: OnboardingPersona | null;
  preferredDesk?: DomainId | null;
}

export interface UserProfile extends UserPreferences {
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
  workspaceToken?: string;
}

export interface UsageSummary {
  plan: UsagePlan;
  current: number;
  limit: number | null;
  remaining: number | null;
  date: string;
}

export interface SharedAnswerRecord {
  id: string;
  answer: string;
  createdAt: string;
  desk: DomainId;
  question: string;
  sharerUserId?: string | null;
}

export interface SoftLeadRecord {
  id: string;
  approximateQuestionCount: number;
  createdAt: string;
  desk: DomainId;
  email: string;
  emailSentAt?: string | null;
  followUpDueAt: string;
  lastAnswer?: string | null;
  sessionId: string;
  status: 'pending' | 'sent' | 'skipped';
}

export interface WhiteLabelDeskConfig {
  enabled: boolean;
  id: DomainId;
  name: string;
  welcomeMessage: string;
}

export interface WhiteLabelDocument {
  id: string;
  name: string;
  status: 'processing' | 'ready';
  storagePath?: string | null;
  uploadedAt: string;
}

export interface WhiteLabelTeamMember {
  email: string;
  role: TeamMemberRole;
  status: 'active' | 'invited';
}

export interface WhiteLabelBranding {
  brandName: string;
  customDomain: string;
  logoUrl?: string | null;
  primaryColor: string;
}

export interface WhiteLabelConfig {
  analyticsWindowDays: number;
  branding: WhiteLabelBranding;
  createdAt: string;
  deskConfigs: WhiteLabelDeskConfig[];
  embedToken: string;
  knowledgeBase: WhiteLabelDocument[];
  ownerUserId: string;
  updatedAt: string;
  userManagement: WhiteLabelTeamMember[];
}

export interface PublicWhiteLabelWorkspace {
  branding: WhiteLabelBranding;
  deskConfigs: WhiteLabelDeskConfig[];
  embedToken: string;
}

export interface WhatsAppConnection {
  createdAt: string;
  phoneNumber: string;
  plan: UsagePlan;
  provider: 'twilio';
  status: 'pending' | 'verified';
  verifiedAt?: string | null;
  ownerUserId: string;
}

export interface WhatsAppThreadMessage {
  body: string;
  createdAt: string;
  direction: 'inbound' | 'outbound';
  desk: DomainId;
  phoneNumber: string;
}
