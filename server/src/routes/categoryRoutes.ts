import express from 'express';
import {
  getAllCategories, createCategory,
  updateCategory, deleteCategory
} from '../controllers/categoryController';
import { verifyToken } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/roleMiddleware';

const router = express.Router();
router.get('/', getAllCategories);
router.post('/', verifyToken, requireAdmin, createCategory);
router.put('/:id', verifyToken, requireAdmin, updateCategory);
router.delete('/:id', verifyToken, requireAdmin, deleteCategory);
export default router;