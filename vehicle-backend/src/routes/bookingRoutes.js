import express from 'express';
import { createBooking, getBooking, getUserBookings, cancelBooking, updateBookingStatus, confirmBooking } from '../controller/bookingController.js';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Create booking (authenticated users)
router.post('/', auth, createBooking);

// Get user's bookings
router.get('/', auth, getUserBookings);

// Get single booking
router.get('/:id', auth, getBooking);

// Cancel booking
router.post('/:id/cancel', auth, cancelBooking);

// Confirm booking
router.patch('/:id/confirm', auth, confirmBooking);

// Update booking status (admin only)
router.patch('/:id/status', auth, adminAuth, updateBookingStatus);

export default router;