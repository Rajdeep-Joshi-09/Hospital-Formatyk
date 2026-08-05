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

module.exports = router;
