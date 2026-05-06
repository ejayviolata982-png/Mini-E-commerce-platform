import { Router, Response } from 'express';
import { db, auth } from '../config/firebase';
import { verifyToken, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

// GET all users (admin only)
router.get('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const userData = userDoc.data();
    if (userData?.role !== 'admin') {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }
    const snap = await db.collection('users').orderBy('createdAt', 'desc').get();
    const users = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(users);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// PUT update own profile
router.put('/profile', verifyToken, async (req: AuthRequest, res: Response) => {
  const uid = req.user?.uid;
  const { name, phone, gender, age, address } = req.body;

  try {
    const updateData: any = {
      updatedAt: new Date().toISOString()
    };

    if (name !== undefined) updateData.name = name.trim();
    if (phone !== undefined) updateData.phone = phone;
    if (gender !== undefined) updateData.gender = gender;
    if (age !== undefined) updateData.age = age ? Number(age) : null;
    if (address !== undefined) updateData.address = address;

    await db.collection('users').doc(uid).update(updateData);

    // Update display name in Firebase Auth
    if (name) await auth.updateUser(uid, { displayName: name.trim() });

    const updated = await db.collection('users').doc(uid).get();
    res.json({ message: 'Profile updated', ...updated.data() });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// GET own profile
router.get('/me', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const uid = req.user?.uid;
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(userDoc.data());
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;