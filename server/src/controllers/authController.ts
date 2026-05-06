import { Request, Response } from 'express';
import { db, auth } from '../config/firebase';
import { AuthRequest } from '../middleware/authMiddleware';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, phone, gender, age, address } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: 'Name, email and password required' });
    return;
  }

  // Validate age
  if (age && (Number(age) < 13 || Number(age) > 120)) {
    res.status(400).json({ message: 'Invalid age provided' });
    return;
  }

  // Validate phone format
  if (phone && !/^\+63[0-9]{10}$/.test(phone)) {
    res.status(400).json({ message: 'Invalid Philippine phone number' });
    return;
  }

  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
      phoneNumber: phone || undefined,
    });

    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      name,
      email,
      phone: phone || '',
      gender: gender || '',
      age: age ? Number(age) : null,
      address: address || '',
      role: 'user',
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ message: 'Registered successfully' });
  } catch (err: any) {
    if (err.code === 'auth/email-already-exists') {
      res.status(400).json({ message: 'Email already in use' });
      return;
    }
    if (err.code === 'auth/phone-number-already-exists') {
      res.status(400).json({ message: 'Phone number already in use' });
      return;
    }
    if (err.code === 'auth/invalid-phone-number') {
      // Phone rejected by Firebase Auth but still save to Firestore without it
      try {
        const userRecord2 = await auth.createUser({ email, password, displayName: name });
        await db.collection('users').doc(userRecord2.uid).set({
          uid: userRecord2.uid,
          name, email,
          phone: phone || '',
          gender: gender || '',
          age: age ? Number(age) : null,
          address: address || '',
          role: 'user',
          createdAt: new Date().toISOString(),
        });
        res.status(201).json({ message: 'Registered successfully' });
        return;
      } catch (e: any) {
        res.status(500).json({ message: e.message });
        return;
      }
    }
    res.status(500).json({ message: err.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
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

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, phone, gender, age, address } = req.body;
  const uid = req.user?.uid;
  try {
    await db.collection('users').doc(uid).update({
      name: name || '',
      phone: phone || '',
      gender: gender || '',
      age: age ? Number(age) : null,
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

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const snapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
    const users = snapshot.docs.map(doc => doc.data());
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};