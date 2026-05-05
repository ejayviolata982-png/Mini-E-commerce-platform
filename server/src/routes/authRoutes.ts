import express from 'express';
import {
  register, getMe,
  updateProfile, getAllUsers
} from '../controllers/authController';
import { verifyToken } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/roleMiddleware';

const router = express.Router();
router.post('/register', register);
router.get('/me', verifyToken, getMe);
router.put('/profile', verifyToken, updateProfile);
router.get('/users', verifyToken, requireAdmin, getAllUsers);
export default router;