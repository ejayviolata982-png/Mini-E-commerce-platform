import express from 'express';
import {
  getAllProducts, getProductById,
  createProduct, updateProduct, deleteProduct
} from '../controllers/productController';
import { verifyToken } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/roleMiddleware';
import { upload } from '../utils/upload';

const router = express.Router();
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', verifyToken, requireAdmin, upload.single('image'), createProduct);
router.put('/:id', verifyToken, requireAdmin, upload.single('image'), updateProduct);
router.delete('/:id', verifyToken, requireAdmin, deleteProduct);
export default router;