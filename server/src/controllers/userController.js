const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Helper to exclude password from user object
const excludePassword = (user) => {
  if (!user) return user;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Create a new User
exports.createUser = async (req, res) => {
  try {
    const { name, email, phone, password, userType, isStatus } = req.body;
    const currentUserId = req.user ? req.user.id : 1; // Fallback if no user is provided

    // Check for existing email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return sendError(res, 'Email already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        userType,
        isStatus: isStatus !== undefined ? isStatus : 1,
        createdBy: currentUserId,
        updatedBy: currentUserId,
        deletedBy: 0,
      },
    });

    return sendSuccess(res, 'User created successfully', excludePassword(user), 201);
  } catch (error) {
    console.error('Create user error:', error);
    return sendError(res, 'Server error while creating user');
  }
};

// Helper to define role ranks for hierarchy
const getRoleRank = (roleName) => {
  const name = (roleName || '').toLowerCase().trim();
  if (name === 'super admin') return 1;
  if (name === 'admin') return 2;
  if (name === 'sub admin') return 3;
  return 10; // Default lower rank for all others
};

// Get all active users
exports.getUsers = async (req, res) => {
  try {
    const currentUserId = req.user ? req.user.id : 1;
    
    // Get the current user to find their rank
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      include: { userTypeRole: true }
    });

    if (!currentUser) {
      return sendError(res, 'Current user not found', 404);
    }

    const currentUserRank = getRoleRank(currentUser.userTypeRole?.userType);

    const users = await prisma.user.findMany({
      where: {
        isDelete: 0,
      },
      include: {
        userTypeRole: true,
      },
      orderBy: {
        id: 'desc',
      },
    });

    // Filter based on rank (lower number = higher rank, so allowed if rank >= currentUserRank)
    const filteredUsers = users.filter(user => {
      const userRank = getRoleRank(user.userTypeRole?.userType);
      return userRank >= currentUserRank;
    });

    const safeUsers = filteredUsers.map(excludePassword);
    return sendSuccess(res, 'Users retrieved successfully', safeUsers);
  } catch (error) {
    console.error('Get users error:', error);
    return sendError(res, 'Server error while retrieving users');
  }
};

// Get single user by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const currentUserId = req.user ? req.user.id : 1;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { userTypeRole: true },
    });

    if (!user || user.isDelete === 1) {
      return sendError(res, 'User not found', 404);
    }

    // Hierarchy Check
    const currentUser = await prisma.user.findUnique({ where: { id: currentUserId }, include: { userTypeRole: true } });
    if (getRoleRank(user.userTypeRole?.userType) < getRoleRank(currentUser?.userTypeRole?.userType)) {
      return sendError(res, 'Unauthorized to view this user', 403);
    }

    return sendSuccess(res, 'User retrieved successfully', excludePassword(user));
  } catch (error) {
    console.error('Get user by id error:', error);
    return sendError(res, 'Server error while retrieving user');
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const updateData = { ...req.body };
    const currentUserId = req.user ? req.user.id : 1;

    const existingUser = await prisma.user.findUnique({ where: { id: userId }, include: { userTypeRole: true } });
    if (!existingUser || existingUser.isDelete === 1) {
      return sendError(res, 'User not found', 404);
    }

    // Hierarchy Check
    const currentUser = await prisma.user.findUnique({ where: { id: currentUserId }, include: { userTypeRole: true } });
    if (getRoleRank(existingUser.userTypeRole?.userType) < getRoleRank(currentUser?.userTypeRole?.userType)) {
      return sendError(res, 'Unauthorized to modify this user', 403);
    }

    // Handle email check
    if (updateData.email && updateData.email !== existingUser.email) {
      const emailTaken = await prisma.user.findUnique({ where: { email: updateData.email } });
      if (emailTaken) {
        return sendError(res, 'Email already in use', 409);
      }
    }

    // Handle password hashing if provided
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    updateData.updatedBy = currentUserId;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return sendSuccess(res, 'User updated successfully', excludePassword(user));
  } catch (error) {
    console.error('Update user error:', error);
    return sendError(res, 'Server error while updating user');
  }
};

// Soft delete user
exports.deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const currentUserId = req.user ? req.user.id : 1;

    const existingUser = await prisma.user.findUnique({ where: { id: userId }, include: { userTypeRole: true } });
    if (!existingUser || existingUser.isDelete === 1) {
      return sendError(res, 'User not found', 404);
    }

    // Hierarchy Check
    const currentUser = await prisma.user.findUnique({ where: { id: currentUserId }, include: { userTypeRole: true } });
    if (getRoleRank(existingUser.userTypeRole?.userType) < getRoleRank(currentUser?.userTypeRole?.userType)) {
      return sendError(res, 'Unauthorized to delete this user', 403);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        isDelete: 1,
        deletedBy: currentUserId,
        deletedDate: new Date(),
      },
    });

    return sendSuccess(res, 'User deleted successfully', excludePassword(user));
  } catch (error) {
    console.error('Delete user error:', error);
    return sendError(res, 'Server error while deleting user');
  }
};
