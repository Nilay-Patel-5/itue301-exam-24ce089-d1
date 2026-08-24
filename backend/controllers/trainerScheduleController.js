const ClassBooking = require('../models/ClassBooking');
const Trainer = require('../models/Trainer');

// @desc    Get all bookings assigned to the logged-in trainer
// @route   GET /api/v1/trainer/schedule
// @access  Trainer only
const getMySchedule = async (req, res, next) => {
  try {
    const bookings = await ClassBooking.find({ trainerId: req.member.trainerProfileId })
      .populate('memberId', 'name email membershipType')
      .populate('trainerId', 'name specialization')
      .sort({ date: 1, timeSlot: 1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Trainer marks a booking as attended or cancels it
// @route   PATCH /api/v1/trainer/bookings/:id/status
// @access  Trainer only
const updateAssignedBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['attended', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Trainers can only set status to "attended" or "cancelled".'
      });
    }

    const booking = await ClassBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Ensure the booking is assigned to this trainer
    if (booking.trainerId.toString() !== req.member.trainerProfileId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this booking.'
      });
    }

    booking.status = status;
    await booking.save();

    const updated = await ClassBooking.findById(booking._id)
      .populate('memberId', 'name email membershipType')
      .populate('trainerId', 'name specialization');

    res.status(200).json({
      success: true,
      message: `Booking marked as ${status}`,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Trainer toggles their own availability
// @route   PATCH /api/v1/trainer/availability
// @access  Trainer only
const toggleMyAvailability = async (req, res, next) => {
  try {
    const trainer = await Trainer.findById(req.member.trainerProfileId);

    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer profile not found.' });
    }

    trainer.available = !trainer.available;
    await trainer.save();

    res.status(200).json({
      success: true,
      message: `Your availability updated to: ${trainer.available ? 'Available' : 'Unavailable'}`,
      data: trainer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trainer's own profile info
// @route   GET /api/v1/trainer/profile
// @access  Trainer only
const getMyProfile = async (req, res, next) => {
  try {
    const trainer = await Trainer.findById(req.member.trainerProfileId);

    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer profile not found.' });
    }

    res.status(200).json({ success: true, data: trainer });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMySchedule,
  updateAssignedBookingStatus,
  toggleMyAvailability,
  getMyProfile
};
