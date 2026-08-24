const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Member = require('../models/Member');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fitzone_secret_key_2026', {
    expiresIn: '7d'
  });
};

// @desc    Authenticate member & get token
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const member = await Member.findOne({ email: email.toLowerCase() });
    if (!member) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(member._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      member: {
        id: member._id,
        name: member.name,
        email: member.email,
        membershipType: member.membershipType,
        role: member.role
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login
};
