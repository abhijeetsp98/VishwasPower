import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import User from '../model/User.js';

export const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Try string _id first (handles migrated data where _id is stored as string)
    let userDoc = await User.collection.findOne({ _id: decoded.id });

    // If not found, try ObjectId (handles new users where _id is a proper ObjectId)
    if (!userDoc) {
      try {
        userDoc = await User.collection.findOne({ _id: new Types.ObjectId(decoded.id) });
      } catch (e) {
        // decoded.id is not a valid ObjectId format — leave userDoc as null
      }
    }

    req.user = userDoc || null;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Role-based authorization middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, please login first' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. You don't have permission to access this resource. Required role: ${roles.join(' or ')}` 
      });
    }

    next();
  };
};