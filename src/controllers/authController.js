const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const user = await User.create({
      name,
      email,
      password, // Password hashing logic model hooks me hai
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: 'Signup successful. Please check your email for verification.',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        },
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (user && (await user.comparePassword(password))) {
      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token: generateToken(user.id),
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        },
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Forgot Password - Send OTP
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email.',
      });
    }

    // Generate static OTP for demo purposes
    const otp = '123456';
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins expiry
    await user.save();

    res.json({
      success: true,
      message: 'A password reset link (OTP) has been sent to your email.',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ where: { email, otp } });

    if (user && user.otpExpires > Date.now()) {
      res.json({
        success: true,
        message: 'OTP verified successfully.',
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP.',
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { email, otp } });

    if (user && user.otpExpires > Date.now()) {
      user.password = newPassword; // Hashing hook me hogi
      user.otp = null;
      user.otpExpires = null;
      await user.save();

      res.json({
        success: true,
        message: 'Password has been reset successfully.',
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid OTP or email.',
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};