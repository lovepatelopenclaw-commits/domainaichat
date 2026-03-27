'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/lib/client-api';
import { useAuth } from '@/components/providers/AuthProvider';

export default function WhatsAppIntegrationPage() {
  const router = useRouter();
  const { loading, user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'pending' | 'verified'>('idle');
  const [serviceNumber, setServiceNumber] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?next=/dashboard/integrations/whatsapp');
    }
  }, [loading, router, user]);

  useEffect(() => {
    let ignore = false;

    async function loadConnection() {
      const response = await fetchWithAuth('/api/whatsapp/connection');

      if (!response.ok) {
        if (response.status === 403) {
          router.push('/dashboard');
        }
        return;
      }

      const data = await response.json();

      if (!ignore) {
        setPhoneNumber(data.connection?.phoneNumber ?? '');
        setServiceNumber(data.serviceNumber);
        setStatus(data.connection?.status ?? 'idle');
      }
    }

    if (user) {
      loadConnection().catch(() => undefined);
    }

    return () => {
      ignore = true;
    };
  }, [router, user]);

  async function startVerification() {
    setMessage('');

    const response = await fetchWithAuth('/api/whatsapp/connection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? 'Unable to send verification');
      return;
    }

    setStatus('pending');
    setMessage('Verification code sent via WhatsApp.');
  }

  async function verifyCode() {
    setMessage('');

    const response = await fetchWithAuth('/api/whatsapp/connection', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, phoneNumber }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? 'Unable to verify code');
      return;
    }

    setStatus('verified');
    setMessage('WhatsApp is connected.');
  }

  if (loading || !user) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[var(--color-bg)] text-[14px] text-[var(--color-text-secondary)]">
        Loading WhatsApp integration...
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[var(--color-bg)]">
      <div className="mx-auto max-w-[820px] px-4 py-10 sm:px-6">
        <div className="border-b border-[var(--color-border)] pb-8">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
            Integrations
          </p>
          <h1 className="mt-4 font-display text-[40px] leading-none text-[var(--color-text-primary)]">
            WhatsApp
          </h1>
          <p className="mt-4 max-w-[40rem] text-[15px] leading-7 text-[var(--color-text-secondary)]">
            Connect your number, verify it over WhatsApp, and continue BuildDesk conversations from your phone.
          </p>
        </div>

        <div className="mt-8 surface-card p-6">
          <div className="grid gap-4">
            <input
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="+919876543210"
              className="h-12 border border-[var(--color-border)] bg-[var(--color-bg)] px-4 text-[14px] outline-none"
            />
            <button
              type="button"
              onClick={startVerification}
              className="swiss-button min-h-11 px-4 py-2 text-[13px] font-medium uppercase tracking-[0.16em]"
            >
              Send verification code
            </button>

            {status === 'pending' ? (
              <>
                <input
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="Verification code"
                  className="h-12 border border-[var(--color-border)] bg-[var(--color-bg)] px-4 text-[14px] outline-none"
                />
                <button
                  type="button"
                  onClick={verifyCode}
                  className="border border-[var(--color-border)] px-4 py-3 text-[13px] font-medium uppercase tracking-[0.16em]"
                >
                  Verify code
                </button>
              </>
            ) : null}

            {status === 'verified' ? (
              <div className="border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-4 text-[14px]">
                Connected. Send questions to {serviceNumber}.
              </div>
            ) : null}

            {message ? <p className="text-[14px] text-[var(--color-text-secondary)]">{message}</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
