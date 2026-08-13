const { Resend } = require('resend');

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
  console.log('[RESEND DEBUG] Starting sendAppointmentApprovalEmail via Resend...');
  console.log('[RESEND DEBUG] Recipient (to):', to);

  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY is not configured in environment variables.');
  }

  const resend = new Resend(resendApiKey);
  
  // Use onboarding@resend.dev as sender for free tier testing if SMTP_FROM is not properly configured for Resend
  const from = process.env.SMTP_FROM || 'CliFormatyk <onboarding@resend.dev>';
  
  const html = buildApprovalEmailHtml({ patientName, doctorName, appointmentDate, appointmentTime, message });
  const subject = 'Your Appointment Has Been Approved';

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      text: message,
      html,
    });

    if (error) {
      console.error('❌ [RESEND ERROR] Failed to send approval email via Resend API:', error);
      throw error;
    }

    console.log('✅ [RESEND SUCCESS] Approval email sent successfully via Resend API:', data.id);
    return data;
  } catch (error) {
    console.error('❌ [RESEND EXCEPTION] Error in sendAppointmentApprovalEmail:', error);
    throw error;
  }
};

module.exports = {
  sendAppointmentApprovalEmail,
};