const express = require('express');
const router = express.Router();
const { setupBusiness } = require('../controllers/businessController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.post('/setup', protect, upload.single('logo'), setupBusiness);

module.exports = router;