import express from 'express';
import {
  getCart, addToCart,
  updateCartItem, clearCart
} from '../controllers/cartController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();
router.get('/', verifyToken, getCart);
router.post('/', verifyToken, addToCart);
router.put('/:productId', verifyToken, updateCartItem);
router.delete('/', verifyToken, clearCart);
export default router;