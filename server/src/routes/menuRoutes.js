const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { validate } = require('../middlewares/validate');
const { createMenuSchema, updateMenuSchema } = require('../validations/menuValidation');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Protect all menu routes
router.use(authenticateToken);

// Routes
router.post('/', validate(createMenuSchema), menuController.createMenu);
router.get('/', menuController.getMenus);
router.get('/:id', menuController.getMenuById);
router.put('/:id', validate(updateMenuSchema), menuController.updateMenu);
router.delete('/:id', menuController.deleteMenu);

module.exports = router;
