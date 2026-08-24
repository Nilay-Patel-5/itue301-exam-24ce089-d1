const ClassBooking = require('../models/ClassBooking');

// @desc    Create a new class booking
// @route   POST /api/v1/bookings
// @access  Protected
const createBooking = async (req, res, next) => {
  try {
    const { trainerId, className, date, timeSlot } = req.body;

    const booking = await ClassBooking.create({
      memberId: req.member._id,
      trainerId,
      className,
      date,
      timeSlot,
      status: 'booked'
    });

    const populatedBooking = await ClassBooking.findById(booking._id)
      .populate('memberId', 'name email')
      .populate('trainerId', 'name specialization');

    res.status(201).json({
      success: true,
      message: 'Class booked successfully',
      data: populatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in member's bookings
// @route   GET /api/v1/bookings/my
// @access  Protected
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await ClassBooking.find({ memberId: req.member._id })
      .populate('memberId', 'name email')
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

// @desc    Update booking status
// @route   PATCH /api/v1/bookings/:id/status
// @access  Protected
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['booked', 'attended', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Allowed values: booked, attended, cancelled'
      });
    }

    const booking = await ClassBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Ensure member owns the booking or is admin
    if (booking.memberId.toString() !== req.member._id.toString() && req.member.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    booking.status = status;
    await booking.save();

    const updatedBooking = await ClassBooking.findById(booking._id)
      .populate('memberId', 'name email')
      .populate('trainerId', 'name specialization');

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: updatedBooking
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  updateBookingStatus
};
