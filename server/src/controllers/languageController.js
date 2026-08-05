const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

exports.createLanguage = async (req, res) => {
  try {
    const { lang, isStatus } = req.body;
    const currentUserId = req.user ? req.user.id : 1;

    const language = await prisma.languageMaster.create({
      data: {
        lang,
        isStatus: isStatus !== undefined ? isStatus : 1,
        createdBy: currentUserId,
        createdDate: new Date(),
      },
    });

    return sendSuccess(res, 'Language created successfully', language, 201);
  } catch (error) {
    console.error('Create language error:', error);
    return sendError(res, 'Server error while creating language');
  }
};

exports.getLanguages = async (req, res) => {
  try {
    const languages = await prisma.languageMaster.findMany({
      where: {
        isDelete: 0,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return sendSuccess(res, 'Languages retrieved successfully', languages);
  } catch (error) {
    console.error('Get languages error:', error);
    return sendError(res, 'Server error while retrieving languages');
  }
};

exports.getLanguageById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const language = await prisma.languageMaster.findUnique({
      where: { id },
    });

    if (!language || language.isDelete === 1) {
      return sendError(res, 'Language not found', 404);
    }

    return sendSuccess(res, 'Language retrieved successfully', language);
  } catch (error) {
    console.error('Get language by id error:', error);
    return sendError(res, 'Server error while retrieving language');
  }
};

exports.updateLanguage = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { lang, isStatus } = req.body;
    const currentUserId = req.user ? req.user.id : 1;

    const existingLanguage = await prisma.languageMaster.findUnique({ where: { id } });
    if (!existingLanguage || existingLanguage.isDelete === 1) {
      return sendError(res, 'Language not found', 404);
    }

    const language = await prisma.languageMaster.update({
      where: { id },
      data: {
        lang: lang !== undefined ? lang : existingLanguage.lang,
        isStatus: isStatus !== undefined ? isStatus : existingLanguage.isStatus,
        modifiedBy: currentUserId,
        modifiedDate: new Date(),
      },
    });

    return sendSuccess(res, 'Language updated successfully', language);
  } catch (error) {
    console.error('Update language error:', error);
    return sendError(res, 'Server error while updating language');
  }
};

exports.deleteLanguage = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const currentUserId = req.user ? req.user.id : 1;

    const existingLanguage = await prisma.languageMaster.findUnique({ where: { id } });
    if (!existingLanguage || existingLanguage.isDelete === 1) {
      return sendError(res, 'Language not found', 404);
    }

    const language = await prisma.languageMaster.update({
      where: { id },
      data: {
        isDelete: 1,
        deletedBy: currentUserId,
        deletedDate: new Date(),
      },
    });

    return sendSuccess(res, 'Language deleted successfully', language);
  } catch (error) {
    console.error('Delete language error:', error);
    return sendError(res, 'Server error while deleting language');
  }
};
