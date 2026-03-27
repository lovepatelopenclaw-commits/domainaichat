import twilio from 'twilio';

export function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error('Twilio is not configured');
  }

  return twilio(accountSid, authToken);
}

export function getTwilioVerifyServiceSid() {
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

  if (!serviceSid) {
    throw new Error('Twilio Verify is not configured');
  }

  return serviceSid;
}

export function getTwilioWhatsappNumber() {
  return process.env.TWILIO_WHATSAPP_NUMBER ?? 'whatsapp:+14155238886';
}
