import { DomainId } from '@/types';
import { getBaseAppUrl } from '@/lib/app-url';
import { DOMAINS } from '@/lib/domains';

export type EmailJobType = 'soft-lead-follow-up' | 'onboarding-follow-up';

export interface EmailJobPayload {
  city?: string | null;
  desk?: DomainId;
  email: string;
  persona?: string | null;
}

export interface EmailJobRecord {
  createdAt: string;
  dueAt: string;
  payload: EmailJobPayload;
  status: 'pending' | 'sent';
  sentAt?: string | null;
  type: EmailJobType;
}

export function buildEmailContent(type: EmailJobType, payload: EmailJobPayload) {
  const baseUrl = getBaseAppUrl();

  if (type === 'soft-lead-follow-up') {
    const deskName = payload.desk ? DOMAINS[payload.desk].name : 'BuildDesk';

    return {
      html: `
        <div style="font-family: Arial, sans-serif; color: #111111; line-height: 1.6;">
          <p>You asked some questions on <strong>${deskName}</strong> yesterday.</p>
          <p>Sign up free to keep your history and pick up where you left off.</p>
          <p><a href="${baseUrl}/signup" style="color: #111111;">Continue with BuildDesk</a></p>
        </div>
      `,
      subject: 'Your BuildDesk session from yesterday',
      text: `You asked some questions on ${deskName} yesterday. Sign up free to keep your history and pick up where you left off: ${baseUrl}/signup`,
    };
  }

  const deskName = payload.desk ? DOMAINS[payload.desk].name : 'BuildDesk';

  return {
    html: `
      <div style="font-family: Arial, sans-serif; color: #111111; line-height: 1.6;">
        <p>Your workspace is ready.</p>
        <p>Here are a few ways BuildDesk can help inside <strong>${deskName}</strong>.</p>
        <p><a href="${baseUrl}/chat?desk=${payload.desk ?? 'ca-tax'}" style="color: #111111;">Open your desk</a></p>
      </div>
    `,
    subject: `A better start inside ${deskName}`,
    text: `Your BuildDesk workspace is ready. Open your desk here: ${baseUrl}/chat?desk=${payload.desk ?? 'ca-tax'}`,
  };
}

export async function sendEmail(to: string, subject: string, html: string, text: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    throw new Error('Email provider is not configured');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      html,
      subject,
      text,
      to,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Failed to send email: ${details}`);
  }

  return response.json();
}
