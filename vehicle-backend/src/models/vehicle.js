import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Electric', 'Luxury', 'SUV', 'Economy', 'Van']
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  seats: {
    type: Number,
    required: true,
    min: 1
  },
  luggage: {
    type: Number,
    required: true,
    min: 0
  },
  transmission: {
    type: String,
    required: true,
    enum: ['Automatic', 'Manual']
  },
  fuelType: {
    type: String,
    required: true,
    enum: ['Electric', 'Gasoline', 'Hybrid', 'Diesel']
  },
  available: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;