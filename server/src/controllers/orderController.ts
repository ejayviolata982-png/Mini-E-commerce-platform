import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { AuthRequest } from '../middleware/authMiddleware';
import { v4 as uuidv4 } from 'uuid';

export const createOrder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { items, shippingAddress, paymentMethod, totalAmount } = req.body;
  const uid = req.user?.uid;

  if (!items || !items.length || !shippingAddress || !totalAmount) {
    res.status(400).json({ message: 'Items, address and total required' });
    return;
  }

  try {
    // Get user info
    const userDoc = await db.collection('users').doc(uid).get();
    const user = userDoc.data();

    const id = uuidv4();
    const orderNumber = `ORD-${Date.now()}`;

    await db.collection('orders').doc(id).set({
      id,
      orderNumber,
      userId: uid,
      userName: user?.name || '',
      userEmail: user?.email || '',
      items,
      shippingAddress,
      paymentMethod: paymentMethod || 'cash_on_delivery',
      totalAmount: Number(totalAmount),
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    // Update stock for each item
    for (const item of items) {
      const productRef = db.collection('products').doc(item.productId);
      const productDoc = await productRef.get();
      if (productDoc.exists) {
        const currentStock = productDoc.data()?.stock || 0;
        const newStock = currentStock - item.quantity;
        let status = 'available';
        if (newStock <= 0) status = 'out_of_stock';
        else if (newStock <= 10) status = 'low_stock';
        await productRef.update({ stock: newStock, status });
      }
    }

    res.status(201).json({
      message: 'Order placed successfully',
      id,
      orderNumber
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyOrders = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const uid = req.user?.uid;
  try {
    const snapshot = await db.collection('orders')
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .get();
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { status, search } = req.query;
  try {
    let query: any = db.collection('orders').orderBy('createdAt', 'desc');
    if (status) query = query.where('status', '==', status);

    const snapshot = await query.get();
    let orders = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));

    if (search) {
      const s = (search as string).toLowerCase();
      orders = orders.filter((o: any) =>
        o.orderNumber?.toLowerCase().includes(s) ||
        o.userName?.toLowerCase().includes(s) ||
        o.userEmail?.toLowerCase().includes(s)
      );
    }

    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await db.collection('orders').doc(id).update({
      status,
      updatedAt: new Date().toISOString(),
    });
    res.json({ message: 'Order status updated' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getDashboardStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [orders, products, users, categories] = await Promise.all([
      db.collection('orders').get(),
      db.collection('products').get(),
      db.collection('users').get(),
      db.collection('categories').get(),
    ]);

    const orderDocs = orders.docs.map(d => d.data());

    const totalRevenue = orderDocs
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const pending = orderDocs.filter(o => o.status === 'pending').length;
    const processing = orderDocs.filter(o => o.status === 'processing').length;
    const shipped = orderDocs.filter(o => o.status === 'shipped').length;
    const delivered = orderDocs.filter(o => o.status === 'delivered').length;
    const cancelled = orderDocs.filter(o => o.status === 'cancelled').length;

    const recentOrders = orderDocs
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    const productDocs = products.docs.map(d => d.data());
    const lowStock = productDocs.filter(p => p.status === 'low_stock').length;
    const outOfStock = productDocs.filter(p => p.status === 'out_of_stock').length;

    res.json({
      stats: {
        totalOrders: orders.size,
        totalProducts: products.size,
        totalUsers: users.size,
        totalCategories: categories.size,
        totalRevenue,
        pending,
        processing,
        shipped,
        delivered,
        cancelled,
        lowStock,
        outOfStock,
      },
      recentOrders,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};