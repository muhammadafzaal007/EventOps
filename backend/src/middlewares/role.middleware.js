import ApiError from '../utils/ApiError.js';

// Usage: router.get('/x', authMiddleware, roleMiddleware('admin', 'organizer'), handler)
const roleMiddleware =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user) throw new ApiError(401, 'Not authorized');
    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, 'Forbidden: you do not have permission for this action');
    }
    next();
  };

export default roleMiddleware;
