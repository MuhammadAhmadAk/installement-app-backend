const Customer = require('../models/Customer');
const Business = require('../models/Business');
const ProductInstance = require('../models/ProductInstance');
const InstallmentPayment = require('../models/InstallmentPayment');

// @desc    List All Customers for the business
// @route   GET /api/customers
exports.listCustomers = async (req, res) => {
    try {
        const business = await Business.findOne({ where: { userId: req.user.id } });
        if (!business) {
            return res.status(404).json({ success: false, message: 'Business not found' });
        }

        const customers = await Customer.findAll({
            where: { businessId: business.id },
            include: [{
                model: ProductInstance,
                as: 'products',
                include: [{ model: InstallmentPayment, as: 'installmentHistory' }]
            }]
        });

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const formattedCustomers = customers.map(cust => {
            const custData = cust.toJSON();
            if (custData.imageUrl && !custData.imageUrl.startsWith('http')) {
                custData.imageUrl = `${baseUrl}/${custData.imageUrl}`;
            }

            let totalBalance = 0;
            let totalMonthlyAmount = 0;
            let totalPaidOnTime = 0;
            let totalInstallmentsDue = 0;

            const activeProducts = custData.products.filter(p => p.isActive);

            activeProducts.forEach(product => {
                const totalToPay = parseFloat(product.totalSalePrice) - parseFloat(product.downPayment);
                const totalPaid = product.installmentHistory.reduce((sum, pay) => sum + parseFloat(pay.amountPaid), 0);

                totalBalance += (totalToPay - totalPaid);
                totalMonthlyAmount += parseFloat(product.monthlyAmount);

                // Simple Reliability Calculation Logic
                const monthsSinceSale = Math.max(1, Math.floor((new Date() - new Date(product.saleDate)) / (1000 * 60 * 60 * 24 * 30)));
                const installmentsDue = Math.min(product.installmentsCount, monthsSinceSale);
                const installmentsPaid = product.installmentHistory.length;

                totalInstallmentsDue += installmentsDue;
                totalPaidOnTime += installmentsPaid;
            });

            custData.purchasedCount = custData.products.length;
            custData.balance = totalBalance.toFixed(2);
            custData.amount = totalMonthlyAmount.toFixed(2);

            // statusType: 0 for Active, 1 for Completed/No Active
            custData.statusType = activeProducts.length > 0 ? 0 : 1;

            // Reliability Calculation
            const reliabilityScore = totalInstallmentsDue > 0
                ? Math.min(100, Math.round((totalPaidOnTime / totalInstallmentsDue) * 100))
                : 100;
            custData.reliability = `${reliabilityScore}%`;

            return custData;
        });

        res.json({ success: true, data: formattedCustomers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add New Customer
// @route   POST /api/customers
exports.addCustomer = async (req, res) => {
    const { name, phone, cnic, address, reference } = req.body;

    try {
        const business = await Business.findOne({ where: { userId: req.user.id } });
        if (!business) {
            return res.status(404).json({ success: false, message: 'Business not found. Please setup business first.' });
        }

        let imageUrl = null;
        if (req.file) {
            imageUrl = `public/uploads/customers/${req.file.filename}`;
        }

        const customer = await Customer.create({
            name,
            phone,
            cnic,
            address,
            reference,
            imageUrl,
            businessId: business.id
        });

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const customerData = customer.toJSON();
        if (customerData.imageUrl) {
            customerData.imageUrl = `${baseUrl}/${customerData.imageUrl}`;
        }

        res.status(201).json({
            success: true,
            message: "Customer added successfully",
            data: customerData
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get Customer Details
// @route   GET /api/customers/:id
exports.getCustomerDetails = async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id, {
            include: [{
                model: ProductInstance,
                as: 'products',
                include: [{ model: InstallmentPayment, as: 'installmentHistory' }]
            }]
        });

        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const customerData = customer.toJSON();
        if (customerData.imageUrl && !customerData.imageUrl.startsWith('http')) {
            customerData.imageUrl = `${baseUrl}/${customerData.imageUrl}`;
        }

        // Format products for response with actual calculations
        customerData.products = customerData.products.map(p => {
            const totalPaid = p.installmentHistory.reduce((sum, pay) => sum + parseFloat(pay.amountPaid), 0);
            const totalToPay = parseFloat(p.totalSalePrice) - parseFloat(p.downPayment);
            const remainingBalance = totalToPay - totalPaid;

            return {
                id: p.id,
                title: p.productName,
                date: p.saleDate,
                isActive: p.isActive,
                progress: p.installmentHistory.length, // Number of payments made
                totalProgress: p.installmentsCount, // Total installments planned
                monthlyPrice: p.monthlyAmount,
                remainingBalance: remainingBalance.toFixed(2),
                totalSalePrice: p.totalSalePrice,
                downPayment: p.downPayment
            };
        });

        res.json({ success: true, data: customerData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};