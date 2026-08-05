const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { rolePermissionSchema } = require('../validations/rolePermissionValidation');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

exports.getPermissionsByUserType = async (req, res) => {
  try {
    const userTypeId = parseInt(req.params.userTypeId);

    // Ensure the userType exists
    const userType = await prisma.userTypeMaster.findUnique({ where: { id: userTypeId } });
    if (!userType || userType.isDelete === 1) {
      return sendError(res, 'User Type not found', 404);
    }

    const permissions = await prisma.rolePermission.findMany({
      where: { userTypeId },
    });

    return sendSuccess(res, 'Permissions retrieved successfully', permissions);
  } catch (error) {
    console.error('Get Permissions error:', error);
    return sendError(res, 'Server error while retrieving permissions');
  }
};

exports.upsertPermissions = async (req, res) => {
  try {
    const { error } = rolePermissionSchema.validate(req.body);
    if (error) {
      return sendError(res, error.details[0].message, 400);
    }

    const { userTypeId, permissions } = req.body;
    const currentUserId = req.user ? req.user.id : 1;

    // Ensure the userType exists
    const userType = await prisma.userTypeMaster.findUnique({ where: { id: userTypeId } });
    if (!userType || userType.isDelete === 1) {
      return sendError(res, 'User Type not found', 404);
    }

    // Use a transaction to delete old permissions and insert new ones
    await prisma.$transaction(async (tx) => {
      // 1. Delete existing permissions for this userType
      await tx.rolePermission.deleteMany({
        where: { userTypeId },
      });

      // 2. Insert new permissions if there are any
      if (permissions && permissions.length > 0) {
        const dataToInsert = permissions.map(p => ({
          userTypeId,
          menuId: p.menuId,
          isRead: p.isRead,
          isWrite: p.isWrite,
          isEdit: p.isEdit,
          isDelete: p.isDelete,
          createdBy: currentUserId,
        }));

        await tx.rolePermission.createMany({
          data: dataToInsert,
        });
      }
    });

    return sendSuccess(res, 'Permissions updated successfully', {});
  } catch (error) {
    console.error('Upsert Permissions error:', error);
    return sendError(res, 'Server error while updating permissions');
  }
};
