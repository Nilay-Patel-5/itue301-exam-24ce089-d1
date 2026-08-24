const Member = require('../models/Member');
const Trainer = require('../models/Trainer');
const ClassBooking = require('../models/ClassBooking');

// @desc    Get all registered gym members
// @route   GET /api/v1/admin/members
// @access  Admin only
const getAllMembers = async (req, res, next) => {
  try {
    const members = await Member.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ALL bookings system-wide (with populated member & trainer)
// @route   GET /api/v1/admin/bookings
// @access  Admin only
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await ClassBooking.find()
      .populate('memberId', 'name email membershipType')
      .populate('trainerId', 'name specialization')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle trainer availability (available <-> unavailable)
// @route   PATCH /api/v1/admin/trainers/:id/availability
// @access  Admin only
const toggleTrainerAvailability = async (req, res, next) => {
  try {
    const trainer = await Trainer.findById(req.params.id);

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'Trainer not found'
      });
    }

    trainer.available = !trainer.available;
    await trainer.save();

    res.status(200).json({
      success: true,
      message: `Trainer availability updated to ${trainer.available ? 'Available' : 'Unavailable'}`,
      data: trainer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update any booking status (admin can manage all bookings)
// @route   PATCH /api/v1/admin/bookings/:id/status
// @access  Admin only
const updateAnyBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['booked', 'attended', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Allowed: booked, attended, cancelled'
      });
    }

    const booking = await ClassBooking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('memberId', 'name email membershipType')
      .populate('trainerId', 'name specialization');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMembers,
  getAllBookings,
  toggleTrainerAvailability,
  updateAnyBookingStatus
};
