import express from 'express';
import {
  createOrder, getMyOrders,
  getAllOrders, updateOrderStatus,
  getDashboardStats, requestCancelOrder, handleCancelRequest
} from '../controllers/orderController';
import { verifyToken } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/roleMiddleware';
import { db } from '../config/firebase';

const router = express.Router();
router.post('/', verifyToken, createOrder);
router.get('/my', verifyToken, getMyOrders);
router.get('/dashboard', verifyToken, requireAdmin, getDashboardStats);
router.get('/', verifyToken, requireAdmin, getAllOrders);
router.patch('/:id/status', verifyToken, requireAdmin, updateOrderStatus);
router.post('/:id/cancel-request', verifyToken, requestCancelOrder);
router.post('/:id/cancel-action', verifyToken, handleCancelRequest);
router.delete('/:id', verifyToken, async (req: any, res: any) => {
  const uid = req.user?.uid;
  try {
    const orderDoc = await db.collection('orders').doc(req.params.id).get();
    if (!orderDoc.exists) { res.status(404).json({ message: 'Order not found' }); return; }
    const order = orderDoc.data() as any;
    if (order.userId !== uid) { res.status(403).json({ message: 'Not your order' }); return; }
    if (order.status !== 'pending') { res.status(400).json({ message: 'Only pending orders can be cancelled' }); return; }
    await db.collection('orders').doc(req.params.id).delete();
    res.json({ message: 'Order cancelled' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});
export default router;