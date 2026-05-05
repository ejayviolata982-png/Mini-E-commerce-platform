import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import { db } from '../config/firebase';

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const uid = req.user?.uid;
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }
    next();
  } catch {
    res.status(500).json({ message: 'Authorization error' });
  }
};