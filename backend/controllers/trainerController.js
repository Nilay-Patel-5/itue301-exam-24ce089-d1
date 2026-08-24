const Trainer = require('../models/Trainer');

// @desc    Get all trainers
// @route   GET /api/v1/trainers
// @access  Public
const getTrainers = async (req, res, next) => {
  try {
    const trainers = await Trainer.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: trainers.length,
      data: trainers
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTrainers
};
