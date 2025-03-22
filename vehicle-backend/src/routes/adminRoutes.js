import express from 'express';
import { makeAdmin } from '../controller/adminController.js';
import { getAllUsers } from '../controller/userController.js';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Admin-only routes
router.post('/make-admin',auth,adminAuth, makeAdmin);
router.get('/users', auth,adminAuth, getAllUsers);

export default router;