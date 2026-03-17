const Business = require('../models/Business');

// @desc    Setup Business Profile
// @route   POST /api/business/setup
exports.setupBusiness = async (req, res) => {
  const { shopName, mobile, city, logoUrl } = req.body;
  const userId = req.user.id;

  try {
    const businessExists = await Business.findOne({ where: { userId } });

    if (businessExists) {
      return res.status(400).json({
        success: false,
        message: 'Business profile already set up.',
      });
    }

    const business = await Business.create({
      shopName,
      mobile,
      city,
      logoUrl,
      userId,
    });

    res.json({
      success: true,
      message: 'Business profile has been set up successfully.',
      data: {
        business,
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