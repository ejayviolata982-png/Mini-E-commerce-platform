import express from 'express';
import {
  createOrder, getMyOrders,
  getAllOrders, updateOrderStatus,
  getDashboardStats
} from '../controllers/orderController';
import { verifyToken } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/roleMiddleware';

const router = express.Router();
router.post('/', verifyToken, createOrder);
router.get('/my', verifyToken, getMyOrders);
router.get('/dashboard', verifyToken, requireAdmin, getDashboardStats);
router.get('/', verifyToken, requireAdmin, getAllOrders);
router.patch('/:id/status', verifyToken, requireAdmin, updateOrderStatus);
export default router;