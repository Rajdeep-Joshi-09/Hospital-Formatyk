const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

exports.getPublicDoctors = async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany({
      where: {
        isDelete: 0,
        isStatus: 1
      },
      include: {
        expertiesMaster: true,
        languageMaster: true
      },
      orderBy: {
        id: 'desc',
      },
    });

    return sendSuccess(res, 'Doctors retrieved successfully', doctors);
  } catch (error) {
    console.error('Get public doctors error:', error);
    return sendError(res, 'Server error while retrieving doctors');
  }
};

exports.getPublicDoctorById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        expertiesMaster: true,
        languageMaster: true,
        reviews: {
          where: { isDelete: 0, isStatus: 1 },
          include: { patient: true },
          orderBy: { id: 'desc' }
        }
      }
    });

    if (!doctor || doctor.isDelete === 1 || doctor.isStatus === 0) {
      return sendError(res, 'Doctor not found', 404);
    }

    return sendSuccess(res, 'Doctor retrieved successfully', doctor);
  } catch (error) {
    console.error('Get public doctor by id error:', error);
    return sendError(res, 'Server error while retrieving doctor');
  }
};

exports.getPublicSpecialities = async (req, res) => {
  try {
    const specialities = await prisma.specialities.findMany({
      where: {
        isDelete: 0,
        isStatus: 1
      },
      include: {
        treatmentType: true
      },
      orderBy: {
        id: 'asc',
      },
    });

    return sendSuccess(res, 'Specialities retrieved successfully', specialities);
  } catch (error) {
    console.error('Get public specialities error:', error);
    return sendError(res, 'Server error while retrieving specialities');
  }
};

exports.getPublicSpecialityById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const speciality = await prisma.specialities.findUnique({
      where: { id },
      include: {
        treatmentType: true
      }
    });

    if (!speciality || speciality.isDelete === 1 || speciality.isStatus === 0) {
      return sendError(res, 'Speciality not found', 404);
    }

    return sendSuccess(res, 'Speciality retrieved successfully', speciality);
  } catch (error) {
    console.error('Get public speciality by id error:', error);
    return sendError(res, 'Server error while retrieving speciality');
  }
};

exports.getPublicTreatmentTypes = async (req, res) => {
  try {
    const treatmentTypes = await prisma.treatmentTypeMaster.findMany({
      where: {
        isDelete: 0,
        isStatus: 1
      },
      orderBy: {
        id: 'asc'
      }
    });

    return sendSuccess(res, 'Treatment types retrieved successfully', treatmentTypes);
  } catch (error) {
    console.error('Get public treatment types error:', error);
    return sendError(res, 'Server error while retrieving treatment types');
  }
};

exports.getPublicSubjects = async (req, res) => {
  try {
    const subjects = await prisma.subjectMaster.findMany({
      where: {
        isDelete: 0,
        isStatus: 1
      },
      orderBy: {
        id: 'asc'
      }
    });
    return sendSuccess(res, 'Subjects retrieved successfully', subjects);
  } catch (error) {
    console.error('Get public subjects error:', error);
    return sendError(res, 'Server error while retrieving subjects');
  }
};

exports.createPublicInquiry = async (req, res) => {
  try {
    const { name, email, phone, subjectId, message } = req.body;

    if (!name || !phone || !subjectId || !message) {
      return sendError(res, 'Name, phone, subject, and message are required', 400);
    }

    // Auto-create or find patient by phone
    let patient = await prisma.patient.findFirst({
      where: { phone, isDelete: 0 }
    });

    if (!patient) {
      patient = await prisma.patient.create({
        data: {
          name,
          phone,
          createdBy: 0
        }
      });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email: email || '',
        phoneNumber: phone,
        subjectId: parseInt(subjectId),
        message,
        createdBy: 0
      }
    });

    return sendSuccess(res, 'Inquiry submitted successfully', inquiry, 201);
  } catch (error) {
    console.error('Create public inquiry error:', error);
    return sendError(res, 'Server error while submitting inquiry');
  }
};

exports.createPublicAppointment = async (req, res) => {
  try {
    const { name, phone, doctorId, appointmentDate, appointmentTime, reason, fcmToken } = req.body;

    if (!name || !phone || !doctorId || !appointmentDate || !appointmentTime) {
      return sendError(res, 'Name, phone, doctor, date, and time are required', 400);
    }

    // Auto-create or find patient by phone
    let patient = await prisma.patient.findFirst({
      where: { phone, isDelete: 0 }
    });

    if (!patient) {
      patient = await prisma.patient.create({
        data: {
          name,
          phone,
          fcmToken,
          createdBy: 0
        }
      });
    } else if (fcmToken && patient.fcmToken !== fcmToken) {
      patient = await prisma.patient.update({
        where: { id: patient.id },
        data: { fcmToken }
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: parseInt(doctorId),
        appointmentDate: new Date(appointmentDate),
        appointmentTime,
        reason: reason || '',
        createdBy: 0
      }
    });

    return sendSuccess(res, 'Appointment booked successfully', appointment, 201);
  } catch (error) {
    console.error('Create public appointment error:', error);
    return sendError(res, 'Server error while booking appointment');
  }
};

exports.getPublicReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        isDelete: 0,
        isStatus: 1
      },
      include: {
        patient: true,
        doctor: {
          include: { expertiesMaster: true }
        }
      },
      orderBy: {
        ratings: 'desc'
      },
      take: 6
    });
    return sendSuccess(res, 'Reviews retrieved successfully', reviews);
  } catch (error) {
    console.error('Get public reviews error:', error);
    return sendError(res, 'Server error while retrieving reviews');
  }
};
