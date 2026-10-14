import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import generateToken from '../utils/generateToken.js';
import {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
} from '../validators/auth.validator.js';
import { toPublicPath, removeUploadedFile } from '../middlewares/upload.middleware.js';

// POST /api/auth/register  (students only; role is always "student")
export const register = async (req, res) => {
  try {
    const data = validateRegister(req.body);

    const [emailTaken, idTaken] = await Promise.all([
      User.exists({ email: data.email }),
      User.exists({ studentId: data.studentId }),
    ]);
    if (emailTaken) throw new ApiError(409, 'Email is already registered');
    if (idTaken) throw new ApiError(409, 'Student ID is already registered');

    const user = await User.create({
      ...data,
      role: 'student',
      studentCard: toPublicPath(req.file),
    });

    res.status(201).json({ success: true, token: generateToken(user._id), user });
  } catch (err) {
    removeUploadedFile(req.file);
    throw err;
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = validateLogin(req.body);

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }
  if (user.status === 'suspended') {
    throw new ApiError(403, 'Your account has been suspended');
  }

  res.json({ success: true, token: generateToken(user._id), user });
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// PUT /api/auth/profile  (name, department, profileImage)
export const updateProfile = async (req, res) => {
  try {
    const updates = validateProfileUpdate(req.body);
    if (req.file) updates.profileImage = toPublicPath(req.file);

    if (Object.keys(updates).length === 0) {
      throw new ApiError(400, 'No valid fields to update');
    }

    Object.assign(req.user, updates);
    await req.user.save();

    res.json({ success: true, user: req.user });
  } catch (err) {
    removeUploadedFile(req.file);
    throw err;
  }
};
