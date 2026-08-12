const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { sendAppointmentApprovalEmail } = require('../utils/email');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const buildApprovalMessage = (appointment) => {
  const doctorName = appointment.doctor?.name || 'your doctor';
  const appointmentDate = new Date(appointment.appointmentDate).toLocaleDateString('en-GB');

  return `Your appointment with Dr. ${doctorName} on ${appointmentDate} at ${appointment.appointmentTime} has been approved.`;
};

const buildApprovalEmailData = (appointment) => {
  const doctorName = appointment.doctor?.name || 'your doctor';
  const appointmentDate = new Date(appointment.appointmentDate).toLocaleDateString('en-GB');

  return {
    patientName: appointment.patient?.name || 'there',
    doctorName,
    appointmentDate,
    appointmentTime: appointment.appointmentTime,
    message: `Your appointment with Dr. ${doctorName} on ${appointmentDate} at ${appointment.appointmentTime} has been approved.`,
  };
};

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        patient: true,
        doctor: true
      },
      orderBy: {
        id: 'desc'
      }
    });
    return sendSuccess(res, 'Appointments retrieved successfully', appointments);
  } catch (error) {
    console.error('Get appointments error:', error);
    return sendError(res, 'Server error while retrieving appointments');
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status, createdBy } = req.body; // e.g. "Approved", "Rejected"

    console.log(`[APPOINTMENT DEBUG] updateAppointmentStatus called for appointment ID: ${id}, Target Status: "${status}"`);

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { patient: true, doctor: true }
    });

    if (!appointment) {
      console.warn(`[APPOINTMENT DEBUG] Appointment ID ${id} not found in database.`);
      return sendError(res, 'Appointment not found', 404);
    }

    console.log(`[APPOINTMENT DEBUG] Found Appointment ID: ${appointment.id}, Patient ID: ${appointment.patientId}, Patient Email: "${appointment.patient?.email || 'N/A'}"`);

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: { status, modifiedBy: createdBy }
    });

    // If status is Approved, generate a notification for the patient
    if (status === 'Approved') {
      console.log(`[APPOINTMENT DEBUG] Status is Approved. Creating notification and checking patient email...`);
      const title = 'Appointment Approved';
      const description = buildApprovalMessage(appointment);
      const emailData = buildApprovalEmailData(appointment);

      await prisma.notification.create({
        data: {
          title,
          description,
          patientId: appointment.patientId,
          createdBy: createdBy || 0
        }
      });

      if (appointment.patient?.email) {
        console.log(`[APPOINTMENT DEBUG] Patient email found (${appointment.patient.email}). Attempting to send approval email...`);
        try {
          await sendAppointmentApprovalEmail({
            to: appointment.patient.email,
            patientName: emailData.patientName,
            doctorName: emailData.doctorName,
            appointmentDate: emailData.appointmentDate,
            appointmentTime: emailData.appointmentTime,
            message: emailData.message
          });
          console.log('✅ [APPOINTMENT DEBUG] Approval email sent successfully to patient email:', appointment.patient.email);
        } catch (emailError) {
          console.error('❌ [APPOINTMENT ERROR] Error sending approval email:', emailError);
        }
      } else {
        console.warn('⚠️ [APPOINTMENT WARNING] Approval email skipped: patient email is missing or empty for patient ID:', appointment.patientId);
      }
    } else {
      console.log(`[APPOINTMENT DEBUG] Status is "${status}" (not Approved), so email sending was not triggered.`);
    }

    return sendSuccess(res, 'Appointment status updated successfully', updatedAppointment);
  } catch (error) {
    console.error('❌ [APPOINTMENT ERROR] Update appointment status error:', error);
    return sendError(res, 'Server error while updating appointment status');
  }
};
