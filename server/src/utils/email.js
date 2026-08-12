const nodemailer = require('nodemailer');

const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE !== undefined 
    ? String(process.env.SMTP_SECURE).toLowerCase() === 'true'
    : true;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  console.log('[SMTP DEBUG] Creating Nodemailer transporter...');
  console.log('[SMTP DEBUG] Host:', host, 'Port:', port, 'Secure:', secure, 'User:', user);

  if (!user || !pass) {
    throw new Error('SMTP is not configured. Please set SMTP_USER and SMTP_PASS in environment variables.');
  }

  // Gmail-specific configuration forcing IPv4 family (family: 4) to avoid ENETUNREACH IPv6 blocks on Render
  if (host === 'smtp.gmail.com') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
      family: 4, // Force IPv4 resolution
      tls: { rejectUnauthorized: false },
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 20000,
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    family: 4, // Force IPv4 resolution
    tls: { rejectUnauthorized: false },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000,
  });
};

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

const sendAppointmentApprovalEmail = async ({ to, patientName, doctorName, appointmentDate, appointmentTime, message }) => {
  console.log('[SMTP DEBUG] Starting sendAppointmentApprovalEmail via Nodemailer...');
  console.log('[SMTP DEBUG] Recipient (to):', to);

  const transporter = createTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const html = buildApprovalEmailHtml({ patientName, doctorName, appointmentDate, appointmentTime, message });
  const subject = 'Your Appointment Has Been Approved';

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text: message,
      html,
    });
    console.log('✅ [SMTP SUCCESS] Approval email sent successfully over Nodemailer:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ [SMTP ERROR] Failed to send approval email via Nodemailer:', error);
    throw error;
  }
};

module.exports = {
  sendAppointmentApprovalEmail,
};