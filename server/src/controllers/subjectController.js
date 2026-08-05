const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

exports.createSubject = async (req, res) => {
  try {
    const { subjects, isStatus } = req.body;
    const currentUserId = req.user ? req.user.id : 1;

    const subject = await prisma.subjectMaster.create({
      data: {
        subjects,
        isStatus: isStatus !== undefined ? parseInt(isStatus) : 1,
        createdBy: currentUserId,
        createdDate: new Date(),
      },
    });

    return sendSuccess(res, 'Subject created successfully', subject, 201);
  } catch (error) {
    console.error('Create subject error:', error);
    return sendError(res, 'Server error while creating subject');
  }
};

exports.getSubjects = async (req, res) => {
  try {
    const subjectsList = await prisma.subjectMaster.findMany({
      where: {
        isDelete: 0,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return sendSuccess(res, 'Subjects retrieved successfully', subjectsList);
  } catch (error) {
    console.error('Get subjects error:', error);
    return sendError(res, 'Server error while retrieving subjects');
  }
};

exports.getSubjectById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const subject = await prisma.subjectMaster.findUnique({
      where: { id },
    });

    if (!subject || subject.isDelete === 1) {
      return sendError(res, 'Subject not found', 404);
    }

    return sendSuccess(res, 'Subject retrieved successfully', subject);
  } catch (error) {
    console.error('Get subject by id error:', error);
    return sendError(res, 'Server error while retrieving subject');
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { subjects, isStatus } = req.body;
    const currentUserId = req.user ? req.user.id : 1;

    const existingSubject = await prisma.subjectMaster.findUnique({ where: { id } });
    if (!existingSubject || existingSubject.isDelete === 1) {
      return sendError(res, 'Subject not found', 404);
    }

    const subject = await prisma.subjectMaster.update({
      where: { id },
      data: {
        subjects: subjects !== undefined ? subjects : existingSubject.subjects,
        isStatus: isStatus !== undefined ? parseInt(isStatus) : existingSubject.isStatus,
        modifiedBy: currentUserId,
        modifiedDate: new Date(),
      },
    });

    return sendSuccess(res, 'Subject updated successfully', subject);
  } catch (error) {
    console.error('Update subject error:', error);
    return sendError(res, 'Server error while updating subject');
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const currentUserId = req.user ? req.user.id : 1;

    const existingSubject = await prisma.subjectMaster.findUnique({ where: { id } });
    if (!existingSubject || existingSubject.isDelete === 1) {
      return sendError(res, 'Subject not found', 404);
    }

    const subject = await prisma.subjectMaster.update({
      where: { id },
      data: {
        isDelete: 1,
        deletedBy: currentUserId,
        deletedDate: new Date(),
      },
    });

    return sendSuccess(res, 'Subject deleted successfully', subject);
  } catch (error) {
    console.error('Delete subject error:', error);
    return sendError(res, 'Server error while deleting subject');
  }
};
