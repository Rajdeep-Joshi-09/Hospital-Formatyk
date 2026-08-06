const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

exports.getPatients = async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      where: { isDelete: 0 },
      orderBy: { id: 'desc' }
    });
    return sendSuccess(res, 'Patients retrieved successfully', patients);
  } catch (error) {
    console.error('Get patients error:', error);
    return sendError(res, 'Server error while retrieving patients');
  }
};
