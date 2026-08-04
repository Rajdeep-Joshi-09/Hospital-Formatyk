const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validate } = require('../middlewares/validate');
const { createUserSchema, updateUserSchema } = require('../validations/userValidation');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Protect all user routes with JWT authentication
router.use(authenticateToken);

// Routes
router.post('/', validate(createUserSchema), userController.createUser);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', validate(updateUserSchema), userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
