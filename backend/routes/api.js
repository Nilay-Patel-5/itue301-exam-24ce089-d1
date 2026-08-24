const express = require('express');
const router = express.Router();

const { login } = require('../controllers/authController');
const { getTrainers } = require('../controllers/trainerController');
const {
  createBooking,
  getMyBookings,
  updateBookingStatus
} = require('../controllers/bookingController');

const authGuard = require('../middleware/authGuard');

// Public Routes
router.post('/auth/login', login);
router.get('/trainers', getTrainers);

// Protected Routes (authGuard middleware)
router.post('/bookings', authGuard, createBooking);
router.get('/bookings/my', authGuard, getMyBookings);
router.patch('/bookings/:id/status', authGuard, updateBookingStatus);

module.exports = router;
