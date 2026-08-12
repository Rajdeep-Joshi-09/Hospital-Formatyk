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
  const apiKey = process.env.RESEND_API_KEY;
  console.log('[EMAIL DEBUG] Starting sendAppointmentApprovalEmail process...');
  console.log('[EMAIL DEBUG] Target recipient email (to):', to);
  console.log('[EMAIL DEBUG] RESEND_API_KEY present:', !!apiKey, apiKey ? `(starts with ${apiKey.substring(0, 7)}...)` : '');

  if (!apiKey) {
    console.error('[EMAIL ERROR] RESEND_API_KEY is not configured in environment variables.');
    throw new Error('RESEND_API_KEY is not configured in environment variables.');
  }

  // Resend DOES NOT allow sending from @gmail.com without domain verification.
  // Use onboarding@resend.dev if RESEND_FROM is not set or uses @gmail.com
  let from = process.env.RESEND_FROM || 'CliFormatyk <onboarding@resend.dev>';
  if (from.includes('@gmail.com') || from.includes('@yahoo.com') || from.includes('@hotmail.com')) {
    console.warn(`[EMAIL WARNING] RESEND_FROM "${from}" uses a free email provider (@gmail/@yahoo) which Resend blocks. Falling back to "CliFormatyk <onboarding@resend.dev>".`);
    from = 'CliFormatyk <onboarding@resend.dev>';
  }

  console.log('[EMAIL DEBUG] Sender email (from):', from);

  const html = buildApprovalEmailHtml({ patientName, doctorName, appointmentDate, appointmentTime, message });
  const subject = 'Your Appointment Has Been Approved';

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
        text: message,
      }),
    });

    const responseData = await response.json().catch(() => ({}));
    console.log('[EMAIL DEBUG] Resend API Response Status:', response.status);
    console.log('[EMAIL DEBUG] Resend API Response Data:', JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      throw new Error(`Resend API Error (${response.status}): ${JSON.stringify(responseData)}`);
    }

    console.log('✅ [EMAIL SUCCESS] Approval email sent via Resend API successfully to:', to, 'Email ID:', responseData?.id);
    return responseData;
  } catch (err) {
    console.error('❌ [EMAIL ERROR] Failed to send email via Resend:', err.message);
    throw err;
  }
};

module.exports = {
  sendAppointmentApprovalEmail,
};