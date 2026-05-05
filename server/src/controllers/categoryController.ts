import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { v4 as uuidv4 } from 'uuid';

export const getAllCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const snapshot = await db.collection('categories')
      .orderBy('createdAt', 'desc')
      .get();
    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description } = req.body;
  if (!name) {
    res.status(400).json({ message: 'Category name required' });
    return;
  }
  try {
    const id = uuidv4();
    await db.collection('categories').doc(id).set({
      id,
      name,
      description: description || '',
      createdAt: new Date().toISOString(),
    });
    res.status(201).json({ message: 'Category created', id });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    await db.collection('categories').doc(id).update({
      name,
      description: description || '',
      updatedAt: new Date().toISOString(),
    });
    res.json({ message: 'Category updated' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await db.collection('categories').doc(req.params.id).delete();
    res.json({ message: 'Category deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};