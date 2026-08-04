require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seed() {
  const currentUserId = 1;

  // Clear existing for a clean state
  await prisma.menu.deleteMany();

  const menus = [
    {
      menuName: 'Dashboard',
      pageName: 'AdminDashboard',
      listPageRoute: '/admin',
      sortOrder: 1,
      icon: 'LayoutDashboard',
      createdBy: currentUserId,
      updatedBy: currentUserId,
      deletedBy: 0,
    },
    {
      menuName: 'Manage Users',
      pageName: 'UserList',
      listPageRoute: '/admin/users',
      sortOrder: 2,
      icon: 'Users',
      createdBy: currentUserId,
      updatedBy: currentUserId,
      deletedBy: 0,
    },
    {
      menuName: 'Manage Menus',
      pageName: 'MenuList',
      listPageRoute: '/admin/menus',
      sortOrder: 3,
      icon: 'MenuSquare',
      createdBy: currentUserId,
      updatedBy: currentUserId,
      deletedBy: 0,
    },
    {
      menuName: 'Analytics',
      pageName: 'Analytics',
      listPageRoute: '/admin/analytics',
      sortOrder: 4,
      icon: 'Activity',
      createdBy: currentUserId,
      updatedBy: currentUserId,
      deletedBy: 0,
    },
    {
      menuName: 'Settings',
      pageName: 'Settings',
      listPageRoute: '/admin/settings',
      sortOrder: 5,
      icon: 'Settings',
      createdBy: currentUserId,
      updatedBy: currentUserId,
      deletedBy: 0,
    }
  ];

  for (const m of menus) {
    await prisma.menu.create({ data: m });
  }

  console.log('Menus seeded successfully!');
  process.exit(0);
}

seed();
