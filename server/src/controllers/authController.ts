import { Request, Response } from 'express';
import { db, auth } from '../config/firebase';
import { AuthRequest } from '../middleware/authMiddleware';

export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, password, phone, address } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ message: 'Name, email and password required' });
    return;
  }
  try {
    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // Save additional info in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      name,
      email,
      phone: phone || '',
      address: address || '',
      role: 'user',
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ message: 'Registered successfully' });
  } catch (err: any) {
    if (err.code === 'auth/email-already-exists') {
      res.status(400).json({ message: 'Email already exists' });
      return;
    }
    res.status(500).json({ message: err.message });
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
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
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { name, phone, address } = req.body;
  const uid = req.user?.uid;
  try {
    await db.collection('users').doc(uid).update({
      name: name || '',
      phone: phone || '',
      address: address || '',
      updatedAt: new Date().toISOString(),
    });

    await auth.updateUser(uid, { displayName: name });

    const updated = await db.collection('users').doc(uid).get();
    res.json({ message: 'Profile updated', ...updated.data() });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const snapshot = await db.collection('users')
      .orderBy('createdAt', 'desc')
      .get();
    const users = snapshot.docs.map(doc => doc.data());
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};