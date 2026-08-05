require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Truncating tables...");
  
  // Truncate tables with cascade
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Doctor" RESTART IDENTITY CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Specialities" RESTART IDENTITY CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "ExpertiesMaster" RESTART IDENTITY CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "LanguageMaster" RESTART IDENTITY CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "TreatmentTypeMaster" RESTART IDENTITY CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "SubjectMaster" RESTART IDENTITY CASCADE;');

  console.log("Inserting ExpertiesMaster...");
  const experties = [
    'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology',
    'Dermatology', 'Gastroenterology', 'Endocrinology', 'Psychiatry', 'Urology',
    'Ophthalmology', 'ENT (Otorhinolaryngology)', 'Pulmonology', 'Rheumatology', 'Nephrology',
    'Hematology', 'Gynecology', 'Radiology', 'Anesthesiology', 'General Surgery'
  ];
  for (const exp of experties) {
    await prisma.expertiesMaster.create({ data: { expertyType: exp, createdBy: 1 } });
  }

  console.log("Inserting LanguageMaster...");
  const languages = [
    'English', 'Spanish', 'Mandarin Chinese', 'Hindi', 'French',
    'Arabic', 'Russian', 'Portuguese', 'Bengali', 'German',
    'Japanese', 'Korean', 'Italian', 'Turkish', 'Vietnamese',
    'Telugu', 'Marathi', 'Tamil', 'Urdu', 'Gujarati'
  ];
  for (const lang of languages) {
    await prisma.languageMaster.create({ data: { lang: lang, createdBy: 1 } });
  }

  console.log("Inserting TreatmentTypeMaster...");
  const treatTypes = [
    'Outpatient Consultation', 'Inpatient Care', 'Major Surgery', 'Minor Surgery', 'Preventive Checkup',
    'Diagnostic Imaging', 'Physical Therapy', 'Rehabilitation', 'Palliative Care', 'Emergency Room',
    'Cosmetic Procedure', 'Alternative Medicine', 'Holistic Therapy', 'Intensive Care (ICU)', 'Day Care Surgery',
    'Home Healthcare', 'Telemedicine Consultation', 'Follow-up Visit', 'Specialist Consultation', 'Second Opinion'
  ];
  for (const type of treatTypes) {
    await prisma.treatmentTypeMaster.create({ data: { treatType: type, createdBy: 1 } });
  }

  console.log("Inserting SubjectMaster...");
  const subjects = [
    'Clinical Anatomy', 'Human Physiology', 'Medical Biochemistry', 'Clinical Pharmacology', 'Surgical Pathology',
    'Medical Microbiology', 'Forensic Medicine', 'Community Health', 'Internal Medicine', 'General Surgery',
    'Pediatric Medicine', 'Obstetrics', 'Gynecology', 'Orthopedic Surgery', 'Ophthalmology',
    'Otorhinolaryngology', 'Clinical Psychiatry', 'Dermatology', 'Anesthesiology', 'Diagnostic Radiology'
  ];
  for (const sub of subjects) {
    await prisma.subjectMaster.create({ data: { subjects: sub, createdBy: 1 } });
  }

  console.log("Inserting Doctors...");
  const doctorNames = [
    'Dr. Sarah Jenkins', 'Dr. Michael Chen', 'Dr. Emily Rodriguez', 'Dr. James Wilson', 'Dr. Aisha Patel',
    'Dr. Robert Taylor', 'Dr. Lisa Wong', 'Dr. David Miller', 'Dr. Maria Garcia', 'Dr. John Smith',
    'Dr. Anna Kowalski', 'Dr. William Brown', 'Dr. Jessica Davis', 'Dr. Thomas Anderson', 'Dr. Sofia Martinez',
    'Dr. Richard Moore', 'Dr. Elizabeth Taylor', 'Dr. Joseph Clark', 'Dr. Margaret Lewis', 'Dr. Christopher Lee'
  ];
  for (let i = 0; i < 20; i++) {
    await prisma.doctor.create({
      data: {
        name: doctorNames[i],
        image: null,
        experties: Math.floor(Math.random() * 20) + 1,
        description: `Highly experienced professional in their field with a dedicated track record of patient care and successful clinical outcomes.`,
        yearOfExp: Math.floor(Math.random() * 30) + 5, // 5 to 34 years
        education: 'MBBS, MD',
        languages: Math.floor(Math.random() * 20) + 1,
        createdBy: 1
      }
    });
  }

  console.log("Inserting Specialities...");
  const specialityNames = [
    'Advanced Cardiology Center', 'Pediatric Neurology Clinic', 'Joint Replacement Unit', 'Comprehensive Oncology Care', 'Dermatological Surgery',
    'Gastrointestinal Endoscopy', 'Endocrinology & Diabetes Clinic', 'Geriatric Psychiatry Center', 'Urological Oncology', 'Cataract & Lasik Surgery',
    'Advanced ENT Care', 'Pulmonary Rehabilitation Center', 'Rheumatoid Arthritis Clinic', 'Advanced Dialysis Center', 'Blood Disorders Clinic',
    'High-Risk Pregnancy Unit', 'Advanced MRI & CT Scan Center', 'Chronic Pain Management', 'Minimally Invasive Surgery', 'Sports Medicine Institute'
  ];
  for (let i = 0; i < 20; i++) {
    await prisma.specialities.create({
      data: {
        speciality: specialityNames[i],
        description: `Providing state-of-the-art treatments and comprehensive care in ${specialityNames[i].toLowerCase()} using the latest medical technologies.`,
        experience: Math.floor(Math.random() * 15) + 5, // 5 to 19 years
        icon: null,
        treatType: Math.floor(Math.random() * 20) + 1,
        createdBy: 1
      }
    });
  }

  console.log("Seeding complete!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
