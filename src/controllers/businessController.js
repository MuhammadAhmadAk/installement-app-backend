const Business = require('../models/Business');

// @desc    Setup Business Profile
// @route   POST /api/business/setup
exports.setupBusiness = async (req, res) => {
    const { shopName, mobile, city } = req.body;
    const userId = req.user.id;

    try {
        const businessExists = await Business.findOne({ where: { userId } });

        if (businessExists) {
            return res.status(400).json({
                success: false,
                message: 'Business profile already set up.',
            });
        }

        // Handle File Upload (Logo)
        let logoUrl = req.body.logoUrl; // Fallback to URL if no file uploaded
        if (req.file) {
            // Store relative path with forward slashes
            logoUrl = `public/uploads/logos/${req.file.filename}`;
        }

        const business = await Business.create({
            shopName,
            mobile,
            city,
            logoUrl,
            userId,
        });

        // Append Base URL to Logo Path for Response
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const formattedBusiness = business.toJSON();
        if (formattedBusiness.logoUrl && !formattedBusiness.logoUrl.startsWith('http')) {
            formattedBusiness.logoUrl = `${baseUrl}/${formattedBusiness.logoUrl}`;
        }

        res.json({
            success: true,
            message: 'Business profile has been set up successfully.',
            data: {
                business: formattedBusiness,
            },
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Invalid business data provided.',
            errors: error.errors ? error.errors.reduce((acc, err) => {
                acc[err.path] = err.message;
                return acc;
            }, {}) : { message: error.message },
        });
    }
};