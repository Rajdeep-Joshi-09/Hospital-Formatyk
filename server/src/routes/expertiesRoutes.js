const express = require('express');
const router = express.Router();
const expertiesController = require('../controllers/expertiesController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.use(authenticateToken);

router.post('/', expertiesController.createExperties);
router.get('/', expertiesController.getExperties);
router.get('/:id', expertiesController.getExpertiesById);
router.put('/:id', expertiesController.updateExperties);
router.delete('/:id', expertiesController.deleteExperties);

module.exports = router;
