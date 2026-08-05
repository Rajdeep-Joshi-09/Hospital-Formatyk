const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

exports.createTreatmentType = async (req, res) => {
  try {
    const { treatType, isStatus } = req.body;
    const currentUserId = req.user ? req.user.id : 1;

    const treatmentType = await prisma.treatmentTypeMaster.create({
      data: {
        treatType,
        isStatus: isStatus !== undefined ? parseInt(isStatus) : 1,
        createdBy: currentUserId,
        createdDate: new Date(),
      },
    });

    return sendSuccess(res, 'Treatment Type created successfully', treatmentType, 201);
  } catch (error) {
    console.error('Create treatment type error:', error);
    return sendError(res, 'Server error while creating treatment type');
  }
};

exports.getTreatmentTypes = async (req, res) => {
  try {
    const treatmentTypes = await prisma.treatmentTypeMaster.findMany({
      where: {
        isDelete: 0,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return sendSuccess(res, 'Treatment Types retrieved successfully', treatmentTypes);
  } catch (error) {
    console.error('Get treatment types error:', error);
    return sendError(res, 'Server error while retrieving treatment types');
  }
};

exports.getTreatmentTypeById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const treatmentType = await prisma.treatmentTypeMaster.findUnique({
      where: { id },
    });

    if (!treatmentType || treatmentType.isDelete === 1) {
      return sendError(res, 'Treatment Type not found', 404);
    }

    return sendSuccess(res, 'Treatment Type retrieved successfully', treatmentType);
  } catch (error) {
    console.error('Get treatment type by id error:', error);
    return sendError(res, 'Server error while retrieving treatment type');
  }
};

exports.updateTreatmentType = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { treatType, isStatus } = req.body;
    const currentUserId = req.user ? req.user.id : 1;

    const existingTreatmentType = await prisma.treatmentTypeMaster.findUnique({ where: { id } });
    if (!existingTreatmentType || existingTreatmentType.isDelete === 1) {
      return sendError(res, 'Treatment Type not found', 404);
    }

    const treatmentType = await prisma.treatmentTypeMaster.update({
      where: { id },
      data: {
        treatType: treatType !== undefined ? treatType : existingTreatmentType.treatType,
        isStatus: isStatus !== undefined ? parseInt(isStatus) : existingTreatmentType.isStatus,
        modifiedBy: currentUserId,
        modifiedDate: new Date(),
      },
    });

    return sendSuccess(res, 'Treatment Type updated successfully', treatmentType);
  } catch (error) {
    console.error('Update treatment type error:', error);
    return sendError(res, 'Server error while updating treatment type');
  }
};

exports.deleteTreatmentType = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const currentUserId = req.user ? req.user.id : 1;

    const existingTreatmentType = await prisma.treatmentTypeMaster.findUnique({ where: { id } });
    if (!existingTreatmentType || existingTreatmentType.isDelete === 1) {
      return sendError(res, 'Treatment Type not found', 404);
    }

    const treatmentType = await prisma.treatmentTypeMaster.update({
      where: { id },
      data: {
        isDelete: 1,
        deletedBy: currentUserId,
        deletedDate: new Date(),
      },
    });

    return sendSuccess(res, 'Treatment Type deleted successfully', treatmentType);
  } catch (error) {
    console.error('Delete treatment type error:', error);
    return sendError(res, 'Server error while deleting treatment type');
  }
};
