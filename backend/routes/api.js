const express = require('express');
const router = express.Router();

const { login } = require('../controllers/authController');
const { getTrainers } = require('../controllers/trainerController');
const { createBooking, getMyBookings, updateBookingStatus } = require('../controllers/bookingController');
const { getAllMembers, getAllBookings, toggleTrainerAvailability, updateAnyBookingStatus } = require('../controllers/adminController');
const { getMySchedule, updateAssignedBookingStatus, toggleMyAvailability, getMyProfile } = require('../controllers/trainerScheduleController');

const authGuard  = require('../middleware/authGuard');
const adminGuard  = require('../middleware/adminGuard');
const trainerGuard = require('../middleware/trainerGuard');

// ─── Public Routes ────────────────────────────────────────────────────────────
router.post('/auth/login', login);
router.get('/trainers', getTrainers);

// ─── Member Protected Routes ──────────────────────────────────────────────────
router.post('/bookings',           authGuard, createBooking);
router.get('/bookings/my',         authGuard, getMyBookings);
router.patch('/bookings/:id/status', authGuard, updateBookingStatus);

// ─── Trainer-Only Routes (authGuard + trainerGuard) ───────────────────────────
router.get('/trainer/profile',                     authGuard, trainerGuard, getMyProfile);
router.get('/trainer/schedule',                    authGuard, trainerGuard, getMySchedule);
router.patch('/trainer/availability',              authGuard, trainerGuard, toggleMyAvailability);
router.patch('/trainer/bookings/:id/status',       authGuard, trainerGuard, updateAssignedBookingStatus);

// ─── Admin-Only Routes (authGuard + adminGuard) ───────────────────────────────
router.get('/admin/members',                       authGuard, adminGuard, getAllMembers);
router.get('/admin/bookings',                      authGuard, adminGuard, getAllBookings);
router.patch('/admin/trainers/:id/availability',   authGuard, adminGuard, toggleTrainerAvailability);
router.patch('/admin/bookings/:id/status',         authGuard, adminGuard, updateAnyBookingStatus);

module.exports = router;
