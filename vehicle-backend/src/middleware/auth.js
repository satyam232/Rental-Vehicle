import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
      audience: 'vehicle-app',
      issuer: 'vehicle-backend',
      maxAge: '1d'
    });

    // Validate token claims
    if (!decoded._id || !decoded.email) {
      return res.status(401).json({ message: 'Invalid token claims' });
    }

    const user = await User.findOne({ 
      _id: decoded._id,
      email: decoded.email
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found or token invalid' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};

export default auth;