import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';

const authMiddleware = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new ApiError(401, 'Not authorized: token missing');
  }

  let decoded;
  try {
    decoded = jwt.verify(header.split(' ')[1], env.jwtSecret);
  } catch (err) {
    const message =
      err.name === 'TokenExpiredError'
        ? 'Not authorized: token expired'
        : 'Not authorized: invalid token';
    throw new ApiError(401, message);
  }

  const user = await User.findById(decoded.id);
  if (!user) throw new ApiError(401, 'Not authorized: user no longer exists');
  if (user.status === 'suspended') {
    throw new ApiError(403, 'Your account has been suspended');
  }

  req.user = user;
  next();
};

export default authMiddleware;
