const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

// Public routes for doctors
router.get('/doctors', publicController.getPublicDoctors);
router.get('/doctors/:id', publicController.getPublicDoctorById);

// Public routes for specialities
router.get('/specialities', publicController.getPublicSpecialities);
router.get('/specialities/:id', publicController.getPublicSpecialityById);

// Public routes for treatment types (useful for booking form)
router.get('/treatment-types', publicController.getPublicTreatmentTypes);
// Public routes for subjects
router.get('/subjects', publicController.getPublicSubjects);

// Public routes for reviews
router.get('/reviews', publicController.getPublicReviews);

// Public routes for inquiries and appointments
router.post('/inquiries', publicController.createPublicInquiry);
router.post('/appointments', publicController.createPublicAppointment);

module.exports = router;
