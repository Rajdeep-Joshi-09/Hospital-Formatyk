const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedReviews() {
  try {
    const doctor = await prisma.doctor.findFirst({ where: { isDelete: 0 } });
    const patient = await prisma.patient.findFirst({ where: { isDelete: 0 } });

    if (!doctor || !patient) {
      console.log('Doctor or Patient missing, skipping review seed.');
      return;
    }

    await prisma.review.createMany({
      data: [
        {
          patientId: patient.id,
          doctorId: doctor.id,
          reviewDescription: "The level of care and personal attention I received at LuxCare was beyond anything I've experienced. The doctors took time to explain everything.",
          ratings: 5
        },
        {
          patientId: patient.id,
          doctorId: doctor.id,
          reviewDescription: "Excellent facility and great staff. The recovery was quick and painless. Highly recommend to anyone looking for specialized care.",
          ratings: 4
        },
        {
          patientId: patient.id,
          doctorId: doctor.id,
          reviewDescription: "Very professional and compassionate team. The advanced technology used here really makes a difference in treatment outcomes.",
          ratings: 5
        }
      ]
    });
    
    console.log('Reviews seeded successfully.');
  } catch (error) {
    console.error('Error seeding reviews:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedReviews();
