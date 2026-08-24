const jwt = require('jsonwebtoken');
const Member = require('../models/Member');

const authGuard = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token missing. Access denied.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fitzone_secret_key_2026');

    const member = await Member.findById(decoded.id).select('-password');
    if (!member) {
      return res.status(401).json({
        success: false,
        message: 'Member account no longer exists.'
      });
    }

    req.member = member;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.'
    });
  }
};

module.exports = authGuard;
