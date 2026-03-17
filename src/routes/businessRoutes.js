const express = require('express');
const router = express.Router();
const { setupBusiness } = require('../controllers/businessController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/setup', protect, setupBusiness);

module.exports = router;