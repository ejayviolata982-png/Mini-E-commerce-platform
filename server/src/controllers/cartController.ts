import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { AuthRequest } from '../middleware/authMiddleware';

export const getCart = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const uid = req.user?.uid;
  try {
    const cartDoc = await db.collection('carts').doc(uid).get();
    if (!cartDoc.exists) {
      res.json({ items: [], total: 0 });
      return;
    }
    res.json(cartDoc.data());
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const addToCart = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const uid = req.user?.uid;
  const { productId, name, price, imageUrl, quantity, unit } = req.body;

  if (!productId || !quantity) {
    res.status(400).json({ message: 'Product and quantity required' });
    return;
  }

  try {
    const cartRef = db.collection('carts').doc(uid);
    const cartDoc = await cartRef.get();

    let items: any[] = [];
    if (cartDoc.exists) {
      items = cartDoc.data()?.items || [];
    }

    // Check if product already in cart
    const existingIndex = items.findIndex(
      (item: any) => item.productId === productId
    );

    if (existingIndex >= 0) {
      items[existingIndex].quantity += Number(quantity);
    } else {
      items.push({
        productId,
        name,
        price: Number(price),
        imageUrl: imageUrl || '',
        quantity: Number(quantity),
        unit: unit || 'pcs',
      });
    }

    const total = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity, 0
    );

    await cartRef.set({ items, total, updatedAt: new Date().toISOString() });
    res.json({ message: 'Added to cart', items, total });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCartItem = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const uid = req.user?.uid;
  const { productId } = req.params;
  const { quantity } = req.body;

  try {
    const cartRef = db.collection('carts').doc(uid);
    const cartDoc = await cartRef.get();
    let items: any[] = cartDoc.data()?.items || [];

    if (Number(quantity) <= 0) {
      items = items.filter((item: any) => item.productId !== productId);
    } else {
      const idx = items.findIndex((item: any) => item.productId === productId);
      if (idx >= 0) items[idx].quantity = Number(quantity);
    }

    const total = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity, 0
    );

    await cartRef.set({ items, total, updatedAt: new Date().toISOString() });
    res.json({ message: 'Cart updated', items, total });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const clearCart = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const uid = req.user?.uid;
  try {
    await db.collection('carts').doc(uid).set({
      items: [],
      total: 0,
      updatedAt: new Date().toISOString()
    });
    res.json({ message: 'Cart cleared' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};