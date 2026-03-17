const ProductInstance = require('../models/ProductInstance');
const InstallmentPayment = require('../models/InstallmentPayment');
const Customer = require('../models/Customer');

// @desc    Add Product to Customer
// @route   POST /api/installments/add-product
exports.addProductToCustomer = async (req, res) => {
    const { customerId, productName, costPrice, profitPercentage, totalSalePrice, downPayment, installmentsCount, monthlyAmount, saleDate } = req.body;

    try {
        const customer = await Customer.findByPk(customerId);
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        const product = await ProductInstance.create({
            customerId,
            productName,
            costPrice,
            profitPercentage,
            totalSalePrice,
            downPayment,
            installmentsCount,
            monthlyAmount,
            saleDate: saleDate || new Date(),
        });

        res.status(201).json({
            success: true,
            message: "Product added to customer successfully",
            data: product
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get Installment History for a specific product
// @route   GET /api/installments/history/:productId
exports.getInstallmentHistory = async (req, res) => {
    try {
        const history = await InstallmentPayment.findAll({
            where: { productInstanceId: req.params.productId },
            order: [['paymentDate', 'DESC']]
        });

        const formattedHistory = history.map(h => ({
            id: h.id,
            amount: h.amountPaid,
            date: h.paymentDate,
            status: h.status,
            method: h.paymentMethod
        }));

        res.json({ success: true, data: formattedHistory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Collect Installment (Payment)
// @route   POST /api/installments/collect
exports.collectInstallment = async (req, res) => {
    const { customerId, productId, amountPaid, paymentDate, paymentMethod } = req.body;

    try {
        const product = await ProductInstance.findByPk(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const payment = await InstallmentPayment.create({
            productInstanceId: productId,
            amountPaid,
            paymentDate: paymentDate || new Date(),
            paymentMethod,
            status: 'Paid'
        });

        res.json({
            success: true,
            message: "Installment collected successfully.",
            data: payment
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};