const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const admin = require('../utils/firebaseAdmin');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { patient: true, doctor: true }
    });

    if (!appointment) {
      return sendError(res, 'Appointment not found', 404);
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: { status, modifiedBy: createdBy }
    });

    // If status is Approved, generate a notification for the patient
    if (status === 'Approved') {
      const title = 'Appointment Approved';
      const description = `Your appointment with Dr. ${appointment.doctor?.name || ''} on ${new Date(appointment.appointmentDate).toLocaleDateString()} at ${appointment.appointmentTime} has been approved.`;

      await prisma.notification.create({
        data: {
          title,
          description,
          patientId: appointment.patientId,
          createdBy: createdBy || 0
        }
      });

      // Send Firebase Push Notification if token exists
      if (appointment.patient?.fcmToken) {
        try {
          await admin.messaging().send({
            token: appointment.patient.fcmToken,
            notification: {
              title,
              body: description
            }
          });
          console.log('Push notification sent successfully to patient:', appointment.patientId);
        } catch (fcmError) {
          console.error('Error sending push notification:', fcmError);
        }
      }
    }

    return sendSuccess(res, 'Appointment status updated successfully', updatedAppointment);
  } catch (error) {
    console.error('Update appointment status error:', error);
    return sendError(res, 'Server error while updating appointment status');
  }
};
