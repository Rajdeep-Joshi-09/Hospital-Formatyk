const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

exports.createSpeciality = async (req, res) => {
  try {
    const { speciality, description, experience, icon, treatType, isStatus } = req.body;
    const currentUserId = req.user ? req.user.id : 1;

    const newSpeciality = await prisma.specialities.create({
      data: {
        speciality,
        description,
        experience: experience ? parseInt(experience) : null,
        icon,
        treatType: parseInt(treatType),
        isStatus: isStatus !== undefined ? parseInt(isStatus) : 1,
        createdBy: currentUserId,
        createdDate: new Date(),
      },
      include: {
        treatmentType: true
      }
    });

    return sendSuccess(res, 'Speciality created successfully', newSpeciality, 201);
  } catch (error) {
    console.error('Create speciality error:', error);
    return sendError(res, 'Server error while creating speciality');
  }
};

exports.getSpecialities = async (req, res) => {
  try {
    const specialities = await prisma.specialities.findMany({
      where: {
        isDelete: 0,
      },
      include: {
        treatmentType: true
      },
      orderBy: {
        id: 'desc',
      },
    });

    return sendSuccess(res, 'Specialities retrieved successfully', specialities);
  } catch (error) {
    console.error('Get specialities error:', error);
    return sendError(res, 'Server error while retrieving specialities');
  }
};

exports.getSpecialityById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const speciality = await prisma.specialities.findUnique({
      where: { id },
      include: {
        treatmentType: true
      }
    });

    if (!speciality || speciality.isDelete === 1) {
      return sendError(res, 'Speciality not found', 404);
    }

    return sendSuccess(res, 'Speciality retrieved successfully', speciality);
  } catch (error) {
    console.error('Get speciality by id error:', error);
    return sendError(res, 'Server error while retrieving speciality');
  }
};

exports.updateSpeciality = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { speciality, description, experience, icon, treatType, isStatus } = req.body;
    const currentUserId = req.user ? req.user.id : 1;

    const existingSpeciality = await prisma.specialities.findUnique({ where: { id } });
    if (!existingSpeciality || existingSpeciality.isDelete === 1) {
      return sendError(res, 'Speciality not found', 404);
    }

    const updatedSpeciality = await prisma.specialities.update({
      where: { id },
      data: {
        speciality: speciality !== undefined ? speciality : existingSpeciality.speciality,
        description: description !== undefined ? description : existingSpeciality.description,
        experience: experience !== undefined ? parseInt(experience) : existingSpeciality.experience,
        icon: icon !== undefined ? icon : existingSpeciality.icon,
        treatType: treatType !== undefined ? parseInt(treatType) : existingSpeciality.treatType,
        isStatus: isStatus !== undefined ? parseInt(isStatus) : existingSpeciality.isStatus,
        modifiedBy: currentUserId,
        modifiedDate: new Date(),
      },
      include: {
        treatmentType: true
      }
    });

    return sendSuccess(res, 'Speciality updated successfully', updatedSpeciality);
  } catch (error) {
    console.error('Update speciality error:', error);
    return sendError(res, 'Server error while updating speciality');
  }
};

exports.deleteSpeciality = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const currentUserId = req.user ? req.user.id : 1;

    const existingSpeciality = await prisma.specialities.findUnique({ where: { id } });
    if (!existingSpeciality || existingSpeciality.isDelete === 1) {
      return sendError(res, 'Speciality not found', 404);
    }

    const deletedSpeciality = await prisma.specialities.update({
      where: { id },
      data: {
        isDelete: 1,
        deletedBy: currentUserId,
        deletedDate: new Date(),
      },
    });

    return sendSuccess(res, 'Speciality deleted successfully', deletedSpeciality);
  } catch (error) {
    console.error('Delete speciality error:', error);
    return sendError(res, 'Server error while deleting speciality');
  }
};
