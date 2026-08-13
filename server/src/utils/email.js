const { google } = require('googleapis');

const buildApprovalEmailHtml = ({ patientName, doctorName, appointmentDate, appointmentTime, message }) => {
  return `
    <div style="margin:0;padding:0;background:#f7f3ef;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:640px;margin:0 auto;padding:32px 16px;">
        <div style="background:#251817;color:#fff;border-radius:24px 24px 0 0;padding:26px 32px;">
          <div style="font-size:14px;letter-spacing:2px;text-transform:uppercase;color:#f2d9d8;">CliFormatyk</div>
          <h1 style="margin:10px 0 0;font-size:28px;line-height:1.2;">Appointment Approved</h1>
        </div>
        <div style="background:#ffffff;border:1px solid #ead9d3;border-top:0;border-radius:0 0 24px 24px;padding:32px;box-shadow:0 12px 30px rgba(37,24,23,0.08);">
          <p style="margin:0 0 18px;font-size:16px;color:#251817;">Hello ${patientName || 'there'},</p>
          <p style="margin:0 0 22px;font-size:16px;line-height:1.7;color:#59413f;">${message}</p>
          <div style="background:#fff6f5;border:1px solid #f0d5d1;border-radius:18px;padding:18px 20px;margin:0 0 24px;">
            <table style="width:100%;border-collapse:collapse;font-size:15px;color:#251817;">
              <tr>
                <td style="padding:8px 0;color:#7b6460;width:130px;">Doctor</td>
                <td style="padding:8px 0;font-weight:700;">Dr. ${doctorName || 'your doctor'}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#7b6460;">Date</td>
                <td style="padding:8px 0;font-weight:700;">${appointmentDate || ''}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#7b6460;">Time</td>
                <td style="padding:8px 0;font-weight:700;">${appointmentTime || ''}</td>
              </tr>
            </table>
          </div>
          <p style="margin:0;font-size:14px;line-height:1.7;color:#7b6460;">If you need to reschedule or have any questions, please contact our team. We look forward to seeing you.</p>
        </div>
      </div>
    </div>
  `;
};

// Helper function to encode raw RFC 2822 email to URL-safe base64
const createRawEmail = ({ from, to, subject, html }) => {
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const messageParts = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${utf8Subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=utf-8`,
    ``,
    html
  ];
  const message = messageParts.join('\r\n');

  return Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const sendAppointmentApprovalEmail = async ({ to, patientName, doctorName, appointmentDate, appointmentTime, message }) => {
  console.log('[GMAIL API DEBUG] Starting sendAppointmentApprovalEmail via Gmail REST API...');
  console.log('[GMAIL API DEBUG] Recipient (to):', to);

  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
  const fromUser = process.env.GMAIL_USER || process.env.SMTP_USER || 'team.formatyk@gmail.com';

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Gmail OAuth2 credentials missing. Please set GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, and GMAIL_REFRESH_TOKEN in environment variables.');
  }

  const oAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'https://developers.google.com/oauthplayground'
  );

  oAuth2Client.setCredentials({ refresh_token: refreshToken });

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
  const html = buildApprovalEmailHtml({ patientName, doctorName, appointmentDate, appointmentTime, message });
  const subject = 'Your Appointment Has Been Approved';
  const from = `CliFormatyk <${fromUser}>`;

  const raw = createRawEmail({ from, to, subject, html });

  try {
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: raw,
      },
    });

    console.log('✅ [GMAIL API SUCCESS] Approval email sent successfully via Gmail REST API:', response.data.id);
    return response.data;
  } catch (error) {
    console.error('❌ [GMAIL API ERROR] Failed to send approval email via Gmail REST API:', error);
    throw error;
  }
};

module.exports = {
  sendAppointmentApprovalEmail,
};