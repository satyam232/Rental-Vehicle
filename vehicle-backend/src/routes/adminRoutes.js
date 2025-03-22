import express from 'express';
import { makeAdmin } from '../controller/adminController.js';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Admin-only routes
router.post('/make-admin',adminAuth, makeAdmin);

export default router;