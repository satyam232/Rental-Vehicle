import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';

// Initialize environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the vehicle backend server' });
});

// Routes
import vehicleRoutes from './src/routes/vehicleRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import bookingRoutes from './src/routes/bookingRoutes.js';
import usreRoutes from './src/routes/userRoutes.js';

app.use('/api/users', usreRoutes);

app.use('/api/vehicles', vehicleRoutes);
app.use('/api/admin', adminRoutes);

app.use('/api/bookings', bookingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
