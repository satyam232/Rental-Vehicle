import express from 'express';
import { getVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle } from '../controller/vehicleController.js';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Public routes
router.get('/', getVehicles);
router.get('/:id', getVehicle);

// Admin-only routes
router.post('/',auth,adminAuth, createVehicle);
router.put('/:id', auth, adminAuth, updateVehicle);
router.delete('/:id', auth, adminAuth, deleteVehicle);

export default router;