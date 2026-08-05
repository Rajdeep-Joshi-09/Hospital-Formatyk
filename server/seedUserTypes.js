require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seed() {
  const currentUserId = 1;

  const userTypes = [
    { id: 1, userType: 'Admin', createdBy: currentUserId },
    { id: 2, userType: 'Staff', createdBy: currentUserId }
  ];

  for (const ut of userTypes) {
    await prisma.userTypeMaster.upsert({
      where: { id: ut.id },
      update: {},
      create: ut
    });
  }

  console.log('User types seeded successfully!');
  process.exit(0);
}

seed();
