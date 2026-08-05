const express = require('express');
const router = express.Router();
const specialitiesController = require('../controllers/specialitiesController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.use(authenticateToken);

router.post('/', specialitiesController.createSpeciality);
router.get('/', specialitiesController.getSpecialities);
router.get('/:id', specialitiesController.getSpecialityById);
router.put('/:id', specialitiesController.updateSpeciality);
router.delete('/:id', specialitiesController.deleteSpeciality);

module.exports = router;
