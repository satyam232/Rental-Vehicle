import express from 'express';
import { register, signin, getProfile,logoutUser } from '../controller/userController.js';
import auth from '../middleware/auth.js';
// import {logoutUser} from '../controller/userController.js';

const router = express.Router();

// Register a new user
router.post('/register', register);

// Sign in user
router.post('/signin', signin);

// Get user profile
router.get('/me', auth, getProfile);

router.post('/logout', auth, logoutUser);

export default router;