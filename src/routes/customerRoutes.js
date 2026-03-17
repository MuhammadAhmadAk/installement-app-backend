const express = require('express');
const router = express.Router();
const { listCustomers, addCustomer, getCustomerDetails } = require('../controllers/customerController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', protect, listCustomers);
router.post('/', protect, upload.single('image'), addCustomer);
router.get('/:id', protect, getCustomerDetails);

module.exports = router;