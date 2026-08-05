const express = require('express');
const router = express.Router();
const userTypeController = require('../controllers/userTypeController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', userTypeController.createUserType);
router.get('/', userTypeController.getUserTypes);
router.get('/:id', userTypeController.getUserTypeById);
router.put('/:id', userTypeController.updateUserType);
router.delete('/:id', userTypeController.deleteUserType);

module.exports = router;
