const adminGuard = (req, res, next) => {
  if (!req.member) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    });
  }

  if (req.member.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }

  next();
};

module.exports = adminGuard;
