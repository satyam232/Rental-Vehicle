import Vehicle from '../models/vehicle.js';

// Get all vehicles
export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single vehicle
export const getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a vehicle

export const createVehicle = async (req, res) => {
    const vehicle = new Vehicle({
      name: req.body.name,
      type: req.body.type,
      image: req.body.image,
      price: req.body.price,
      rating: req.body.rating,
      seats: req.body.seats,
      luggage: req.body.luggage,
      transmission: req.body.transmission,
      fuelType: req.body.fuelType,
      available: req.body.available ?? true, // Default to true if not provided
    });
  
    try {
      const newVehicle = await vehicle.save();
      res.status(201).json(newVehicle);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
// Update a vehicle
export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    Object.assign(vehicle, req.body);
    vehicle.updatedAt = Date.now();
    
    const updatedVehicle = await vehicle.save();
    res.json(updatedVehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a vehicle
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    await vehicle.deleteOne();
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};