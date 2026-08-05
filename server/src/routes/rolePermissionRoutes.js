const express = require('express');
const router = express.Router();
const rolePermissionController = require('../controllers/rolePermissionController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.use(authenticateToken);

router.get('/:userTypeId', rolePermissionController.getPermissionsByUserType);
router.post('/', rolePermissionController.upsertPermissions);

module.exports = router;
