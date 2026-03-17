const express = require('express');
const router = express.Router();
const { addProductToCustomer, getInstallmentHistory, collectInstallment } = require('../controllers/installmentController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/add-product', protect, addProductToCustomer);
router.get('/history/:productId', protect, getInstallmentHistory);
router.post('/collect', protect, collectInstallment);

module.exports = router;