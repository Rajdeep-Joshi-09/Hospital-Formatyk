const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

exports.createMenu = async (req, res) => {
  try {
    const { menuName, pageName, formPageRoute, listPageRoute, sortOrder, icon, parentId, isStatus } = req.body;
    const currentUserId = req.user ? req.user.id : 1;

    // Optional: check if parent exists
    if (parentId) {
      const parent = await prisma.menu.findUnique({ where: { id: parentId } });
      if (!parent || parent.isDelete === 1) {
        return sendError(res, 'Parent menu not found', 404);
      }
    }

    const menu = await prisma.menu.create({
      data: {
        menuName,
        pageName,
        formPageRoute,
        listPageRoute,
        sortOrder: sortOrder || 0,
        icon,
        parentId,
        isStatus: isStatus !== undefined ? isStatus : 1,
        createdBy: currentUserId,
        updatedBy: currentUserId,
        deletedBy: 0,
      },
    });

    return sendSuccess(res, 'Menu created successfully', menu, 201);
  } catch (error) {
    console.error('Create menu error:', error);
    return sendError(res, 'Server error while creating menu');
  }
};

exports.getMenus = async (req, res) => {
  try {
    const menus = await prisma.menu.findMany({
      where: {
        isDelete: 0,
      },
      include: {
        parent: true,
      },
      orderBy: [
        { sortOrder: 'asc' },
        { id: 'desc' }
      ]
    });

    return sendSuccess(res, 'Menus retrieved successfully', menus);
  } catch (error) {
    console.error('Get menus error:', error);
    return sendError(res, 'Server error while retrieving menus');
  }
};

exports.getMyMenus = async (req, res) => {
  try {
    const currentUserId = req.user ? req.user.id : 1;
    
    // Get the user's role
    const user = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { userType: true }
    });
    
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    // Get the permissions for this role where isRead is 1
    const permissions = await prisma.rolePermission.findMany({
      where: {
        userTypeId: user.userType,
        isRead: 1
      },
      select: {
        menuId: true
      }
    });

    const allowedMenuIds = permissions.map(p => p.menuId);

    // Fetch only the allowed menus
    const menus = await prisma.menu.findMany({
      where: {
        isDelete: 0,
        id: { in: allowedMenuIds }
      },
      include: {
        parent: true,
      },
      orderBy: [
        { sortOrder: 'asc' },
        { id: 'desc' }
      ]
    });

    return sendSuccess(res, 'My Menus retrieved successfully', menus);
  } catch (error) {
    console.error('Get my menus error:', error);
    return sendError(res, 'Server error while retrieving my menus');
  }
};

exports.getMenuById = async (req, res) => {
  try {
    const menuId = parseInt(req.params.id);

    const menu = await prisma.menu.findUnique({
      where: { id: menuId },
    });

    if (!menu || menu.isDelete === 1) {
      return sendError(res, 'Menu not found', 404);
    }

    return sendSuccess(res, 'Menu retrieved successfully', menu);
  } catch (error) {
    console.error('Get menu by id error:', error);
    return sendError(res, 'Server error while retrieving menu');
  }
};

exports.updateMenu = async (req, res) => {
  try {
    const menuId = parseInt(req.params.id);
    const updateData = { ...req.body };
    const currentUserId = req.user ? req.user.id : 1;

    const existingMenu = await prisma.menu.findUnique({ where: { id: menuId } });
    if (!existingMenu || existingMenu.isDelete === 1) {
      return sendError(res, 'Menu not found', 404);
    }

    if (updateData.parentId && updateData.parentId === menuId) {
      return sendError(res, 'A menu cannot be its own parent', 400);
    }

    updateData.updatedBy = currentUserId;

    const menu = await prisma.menu.update({
      where: { id: menuId },
      data: updateData,
    });

    return sendSuccess(res, 'Menu updated successfully', menu);
  } catch (error) {
    console.error('Update menu error:', error);
    return sendError(res, 'Server error while updating menu');
  }
};

exports.deleteMenu = async (req, res) => {
  try {
    const menuId = parseInt(req.params.id);
    const currentUserId = req.user ? req.user.id : 1;

    const existingMenu = await prisma.menu.findUnique({ where: { id: menuId } });
    if (!existingMenu || existingMenu.isDelete === 1) {
      return sendError(res, 'Menu not found', 404);
    }

    // Optional: check for children before soft deleting
    const childrenCount = await prisma.menu.count({
      where: { parentId: menuId, isDelete: 0 }
    });
    
    if (childrenCount > 0) {
      return sendError(res, 'Cannot delete menu because it has active submenus', 400);
    }

    const menu = await prisma.menu.update({
      where: { id: menuId },
      data: {
        isDelete: 1,
        deletedBy: currentUserId,
        deletedDate: new Date(),
      },
    });

    return sendSuccess(res, 'Menu deleted successfully', menu);
  } catch (error) {
    console.error('Delete menu error:', error);
    return sendError(res, 'Server error while deleting menu');
  }
};
