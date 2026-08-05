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
        languageMaster: true
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
