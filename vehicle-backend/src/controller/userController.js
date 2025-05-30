import User from '../models/user.js';

// Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }


    // Create new user
    const user = new User({
      name,
      email,
      password
    });

    await user.save();

    // Generate token
    const token = user.generateAuthToken();

    res.status(201)
      .header('Authorization', `Bearer ${token}`)
      .json({
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        }

// Get all users (admin only)

      });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }

// Get all users (admin only)

};
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password -__v');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Sign in user
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

// Get all users (admin only)


    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

// Get all users (admin only)

    // Generate token
    const token = user.generateAuthToken();

    res.header('Authorization', `Bearer ${token}`)
      .json({
        message: 'Signed in successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        }

// Get all users (admin only)

      });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }

// Get all users (admin only)

};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({user:user});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

// Get all users (admin only)

};



export const logoutUser = (req, res) => {
  res.status(200).json({
    message: 'Successfully logged out',
    action: 'clear_authentication_header'
  });
};