import { Router } from 'express';
import { register, login, getMe, updateProfile } from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { uploadStudentCard, uploadProfileImage } from '../middlewares/upload.middleware.js';

const router = Router();

router.post('/register', uploadStudentCard, register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.put('/profile', authMiddleware, uploadProfileImage, updateProfile);

export default router;
