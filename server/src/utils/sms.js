const DEFAULT_COUNTRY_CODE = process.env.DEFAULT_COUNTRY_CODE || '91';

const normalizePhoneNumber = (phone) => {
  if (!phone) {
    return null;
  }

  const trimmed = String(phone).trim();

  if (trimmed.startsWith('+')) {
    return trimmed;
  }

  const digits = trimmed.replace(/\D/g, '');

  if (!digits) {
    return null;
  }

  if (digits.length === 10) {
    return `+${DEFAULT_COUNTRY_CODE}${digits}`;
  }

  return `+${digits}`;
};

const sendApprovalSms = async ({ phone, message }) => {
  const to = normalizePhoneNumber(phone);

  if (!to) {
    console.warn('SMS skipped: patient phone number is missing or invalid');
    return { sent: false, reason: 'invalid-phone' };
  }

  const provider = (process.env.SMS_PROVIDER || 'mock').toLowerCase();

  if (provider !== 'twilio') {
    console.log(`[SMS mock] To: ${to} | Message: ${message}`);
    return { sent: true, provider: 'mock', to };
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const apiKeySid = process.env.TWILIO_API_KEY_SID;
  const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !fromNumber || (!authToken && !(apiKeySid && apiKeySecret))) {
    throw new Error('Twilio SMS is not configured. Set TWILIO_ACCOUNT_SID and TWILIO_PHONE_NUMBER, plus either TWILIO_AUTH_TOKEN or TWILIO_API_KEY_SID/TWILIO_API_KEY_SECRET.');
  }

  const username = apiKeySid || accountSid;
  const password = apiKeySecret || authToken;

  const payload = new URLSearchParams({
    To: to,
    From: fromNumber,
    Body: message,
  });

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: payload,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Twilio SMS failed (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  console.log('SMS sent successfully to patient:', to, result.sid);
  return { sent: true, provider: 'twilio', to, sid: result.sid };
};

module.exports = {
  sendApprovalSms,
};