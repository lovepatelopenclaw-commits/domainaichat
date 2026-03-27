import { Timestamp } from 'firebase-admin/firestore';
import { DomainId, MessageRole } from '@/types';

export interface FirestoreConversation {
  createdAt: string;
  domain: DomainId;
  title: string;
  updatedAt: string;
  userId: string;
}

export interface FirestoreMessage {
  content: string;
  createdAt: string;
  role: MessageRole;
}

export function toIsoString(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  return new Date().toISOString();
}

export function getUsageDocumentId(userId: string, date: string) {
  return `${userId}_${date}`;
}

export function getTodayDateKey() {
  return new Date().toISOString().slice(0, 10);
}

export function createConversationTitle(content: string) {
  const normalized = content.replace(/\s+/g, ' ').trim();
  return normalized.slice(0, 80) || 'New Conversation';
}
