const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

exports.getInquiries = async (req, res) => {
  try {
    const inquiries = await prisma.inquiry.findMany({
      where: { isDelete: 0 },
      include: {
        subject: true
      },
      orderBy: { id: 'desc' }
    });
    return sendSuccess(res, 'Inquiries retrieved successfully', inquiries);
  } catch (error) {
    console.error('Get inquiries error:', error);
    return sendError(res, 'Server error while retrieving inquiries');
  }
};
