const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { userTypeSchema } = require('../validations/userTypeValidation');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

exports.createUserType = async (req, res) => {
  try {
    const { error } = userTypeSchema.validate(req.body);
    if (error) {
      return sendError(res, error.details[0].message, 400);
    }

    const { userType, isStatus } = req.body;
    const currentUserId = req.user ? req.user.id : 1;

    const newUserType = await prisma.userTypeMaster.create({
      data: {
        userType,
        isStatus: isStatus !== undefined ? isStatus : 1,
        createdBy: currentUserId,
        deletedBy: 0,
      },
    });

    return sendSuccess(res, 'User Type created successfully', newUserType, 201);
  } catch (error) {
    console.error('Create User Type error:', error);
    return sendError(res, 'Server error while creating user type');
  }
};

exports.getUserTypes = async (req, res) => {
  try {
    const userTypes = await prisma.userTypeMaster.findMany({
      where: { isDelete: 0 },
      orderBy: { id: 'asc' },
    });
    return sendSuccess(res, 'User Types retrieved successfully', userTypes);
  } catch (error) {
    console.error('Get User Types error:', error);
    return sendError(res, 'Server error while retrieving user types');
  }
};

exports.getUserTypeById = async (req, res) => {
  try {
    const userTypeId = parseInt(req.params.id);
    const userType = await prisma.userTypeMaster.findUnique({
      where: { id: userTypeId },
    });

    if (!userType || userType.isDelete === 1) {
      return sendError(res, 'User Type not found', 404);
    }

    return sendSuccess(res, 'User Type retrieved successfully', userType);
  } catch (error) {
    console.error('Get User Type by id error:', error);
    return sendError(res, 'Server error while retrieving user type');
  }
};

exports.updateUserType = async (req, res) => {
  try {
    const { error } = userTypeSchema.validate(req.body);
    if (error) {
      return sendError(res, error.details[0].message, 400);
    }

    const userTypeId = parseInt(req.params.id);
    const { userType, isStatus } = req.body;
    const currentUserId = req.user ? req.user.id : 1;

    const existingUserType = await prisma.userTypeMaster.findUnique({ where: { id: userTypeId } });
    if (!existingUserType || existingUserType.isDelete === 1) {
      return sendError(res, 'User Type not found', 404);
    }

    const updatedUserType = await prisma.userTypeMaster.update({
      where: { id: userTypeId },
      data: {
        userType,
        isStatus: isStatus !== undefined ? isStatus : existingUserType.isStatus,
        modifiedBy: currentUserId,
      },
    });

    return sendSuccess(res, 'User Type updated successfully', updatedUserType);
  } catch (error) {
    console.error('Update User Type error:', error);
    return sendError(res, 'Server error while updating user type');
  }
};

exports.deleteUserType = async (req, res) => {
  try {
    const userTypeId = parseInt(req.params.id);
    const currentUserId = req.user ? req.user.id : 1;

    const existingUserType = await prisma.userTypeMaster.findUnique({ where: { id: userTypeId } });
    if (!existingUserType || existingUserType.isDelete === 1) {
      return sendError(res, 'User Type not found', 404);
    }

    const deletedUserType = await prisma.userTypeMaster.update({
      where: { id: userTypeId },
      data: {
        isDelete: 1,
        deletedBy: currentUserId,
        deletedDate: new Date(),
      },
    });

    return sendSuccess(res, 'User Type deleted successfully', deletedUserType);
  } catch (error) {
    console.error('Delete User Type error:', error);
    return sendError(res, 'Server error while deleting user type');
  }
};
