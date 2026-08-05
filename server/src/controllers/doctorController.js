const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

exports.createDoctor = async (req, res) => {
  try {
    const { name, image, experties, description, yearOfExp, education, languages, isStatus } = req.body;
    const currentUserId = req.user ? req.user.id : 1;

    const doctor = await prisma.doctor.create({
      data: {
        name,
        image,
        experties: parseInt(experties),
        description,
        yearOfExp: yearOfExp ? parseInt(yearOfExp) : null,
        education,
        languages: parseInt(languages),
        isStatus: isStatus !== undefined ? parseInt(isStatus) : 1,
        createdBy: currentUserId,
        createdDate: new Date(),
      },
      include: {
        expertiesMaster: true,
        languageMaster: true
      }
    });

    return sendSuccess(res, 'Doctor created successfully', doctor, 201);
  } catch (error) {
    console.error('Create doctor error:', error);
    return sendError(res, 'Server error while creating doctor');
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany({
      where: {
        isDelete: 0,
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
    console.error('Get doctors error:', error);
    return sendError(res, 'Server error while retrieving doctors');
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        expertiesMaster: true,
        languageMaster: true
      }
    });

    if (!doctor || doctor.isDelete === 1) {
      return sendError(res, 'Doctor not found', 404);
    }

    return sendSuccess(res, 'Doctor retrieved successfully', doctor);
  } catch (error) {
    console.error('Get doctor by id error:', error);
    return sendError(res, 'Server error while retrieving doctor');
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, image, experties, description, yearOfExp, education, languages, isStatus } = req.body;
    const currentUserId = req.user ? req.user.id : 1;

    const existingDoctor = await prisma.doctor.findUnique({ where: { id } });
    if (!existingDoctor || existingDoctor.isDelete === 1) {
      return sendError(res, 'Doctor not found', 404);
    }

    const doctor = await prisma.doctor.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingDoctor.name,
        image: image !== undefined ? image : existingDoctor.image,
        experties: experties !== undefined ? parseInt(experties) : existingDoctor.experties,
        description: description !== undefined ? description : existingDoctor.description,
        yearOfExp: yearOfExp !== undefined ? parseInt(yearOfExp) : existingDoctor.yearOfExp,
        education: education !== undefined ? education : existingDoctor.education,
        languages: languages !== undefined ? parseInt(languages) : existingDoctor.languages,
        isStatus: isStatus !== undefined ? parseInt(isStatus) : existingDoctor.isStatus,
        modifiedBy: currentUserId,
        modifiedDate: new Date(),
      },
      include: {
        expertiesMaster: true,
        languageMaster: true
      }
    });

    return sendSuccess(res, 'Doctor updated successfully', doctor);
  } catch (error) {
    console.error('Update doctor error:', error);
    return sendError(res, 'Server error while updating doctor');
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const currentUserId = req.user ? req.user.id : 1;

    const existingDoctor = await prisma.doctor.findUnique({ where: { id } });
    if (!existingDoctor || existingDoctor.isDelete === 1) {
      return sendError(res, 'Doctor not found', 404);
    }

    const doctor = await prisma.doctor.update({
      where: { id },
      data: {
        isDelete: 1,
        deletedBy: currentUserId,
        deletedDate: new Date(),
      },
    });

    return sendSuccess(res, 'Doctor deleted successfully', doctor);
  } catch (error) {
    console.error('Delete doctor error:', error);
    return sendError(res, 'Server error while deleting doctor');
  }
};
