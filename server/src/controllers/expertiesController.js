const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

exports.createExperties = async (req, res) => {
  try {
    const { expertyType, isStatus } = req.body;
    const currentUserId = req.user ? req.user.id : 1;

    const experty = await prisma.expertiesMaster.create({
      data: {
        expertyType,
        isStatus: isStatus !== undefined ? isStatus : 1,
        createdBy: currentUserId,
        createdDate: new Date(),
      },
    });

    return sendSuccess(res, 'Experties created successfully', experty, 201);
  } catch (error) {
    console.error('Create experties error:', error);
    return sendError(res, 'Server error while creating experties');
  }
};

exports.getExperties = async (req, res) => {
  try {
    const experties = await prisma.expertiesMaster.findMany({
      where: {
        isDelete: 0,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return sendSuccess(res, 'Experties retrieved successfully', experties);
  } catch (error) {
    console.error('Get experties error:', error);
    return sendError(res, 'Server error while retrieving experties');
  }
};

exports.getExpertiesById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const experty = await prisma.expertiesMaster.findUnique({
      where: { id },
    });

    if (!experty || experty.isDelete === 1) {
      return sendError(res, 'Experties not found', 404);
    }

    return sendSuccess(res, 'Experties retrieved successfully', experty);
  } catch (error) {
    console.error('Get experties by id error:', error);
    return sendError(res, 'Server error while retrieving experties');
  }
};

exports.updateExperties = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { expertyType, isStatus } = req.body;
    const currentUserId = req.user ? req.user.id : 1;

    const existingExperty = await prisma.expertiesMaster.findUnique({ where: { id } });
    if (!existingExperty || existingExperty.isDelete === 1) {
      return sendError(res, 'Experties not found', 404);
    }

    const experty = await prisma.expertiesMaster.update({
      where: { id },
      data: {
        expertyType: expertyType !== undefined ? expertyType : existingExperty.expertyType,
        isStatus: isStatus !== undefined ? isStatus : existingExperty.isStatus,
        modifiedBy: currentUserId,
        modifiedDate: new Date(),
      },
    });

    return sendSuccess(res, 'Experties updated successfully', experty);
  } catch (error) {
    console.error('Update experties error:', error);
    return sendError(res, 'Server error while updating experties');
  }
};

exports.deleteExperties = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const currentUserId = req.user ? req.user.id : 1;

    const existingExperty = await prisma.expertiesMaster.findUnique({ where: { id } });
    if (!existingExperty || existingExperty.isDelete === 1) {
      return sendError(res, 'Experties not found', 404);
    }

    const experty = await prisma.expertiesMaster.update({
      where: { id },
      data: {
        isDelete: 1,
        deletedBy: currentUserId,
        deletedDate: new Date(),
      },
    });

    return sendSuccess(res, 'Experties deleted successfully', experty);
  } catch (error) {
    console.error('Delete experties error:', error);
    return sendError(res, 'Server error while deleting experties');
  }
};
