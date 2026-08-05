const express = require('express');
const router = express.Router();
const treatmentTypeController = require('../controllers/treatmentTypeController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.use(authenticateToken);

router.post('/', treatmentTypeController.createTreatmentType);
router.get('/', treatmentTypeController.getTreatmentTypes);
router.get('/:id', treatmentTypeController.getTreatmentTypeById);
router.put('/:id', treatmentTypeController.updateTreatmentType);
router.delete('/:id', treatmentTypeController.deleteTreatmentType);

module.exports = router;
