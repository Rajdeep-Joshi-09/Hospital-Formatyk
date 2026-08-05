const express = require('express');
const router = express.Router();
const languageController = require('../controllers/languageController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.use(authenticateToken);

router.post('/', languageController.createLanguage);
router.get('/', languageController.getLanguages);
router.get('/:id', languageController.getLanguageById);
router.put('/:id', languageController.updateLanguage);
router.delete('/:id', languageController.deleteLanguage);

module.exports = router;
