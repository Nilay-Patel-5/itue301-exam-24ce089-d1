const trainerGuard = (req, res, next) => {
  if (!req.member) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }
  if (req.member.role !== 'trainer') {
    return res.status(403).json({ success: false, message: 'Access denied. Trainer privileges required.' });
  }
  if (!req.member.trainerProfileId) {
    return res.status(400).json({ success: false, message: 'Trainer account is not linked to a trainer profile.' });
  }
  next();
};

module.exports = trainerGuard;
