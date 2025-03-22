import User from '../models/user.js';

// Make a user an admin
export const makeAdmin = async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if the target user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user to admin
    user.isAdmin = true;
    await user.save();

    res.json({
      message: 'User successfully made admin',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};