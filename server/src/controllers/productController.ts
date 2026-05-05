import { Request, Response } from 'express';
import { db, storage } from '../config/firebase';
import { v4 as uuidv4 } from 'uuid';

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { search, category, status, page = 1, limit = 12 } = req.query;
  try {
    let query: any = db.collection('products');

    if (category) query = query.where('categoryId', '==', category);
    if (status) query = query.where('status', '==', status);

    query = query.orderBy('createdAt', 'desc');
    const snapshot = await query.get();

    let products = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));

    // Search filter
    if (search) {
      const s = (search as string).toLowerCase();
      products = products.filter((p: any) =>
        p.name.toLowerCase().includes(s) ||
        p.description?.toLowerCase().includes(s)
      );
    }

    // Pagination
    const total = products.length;
    const start = (Number(page) - 1) * Number(limit);
    const paginated = products.slice(start, start + Number(limit));

    res.json({
      products: paginated,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const doc = await db.collection('products').doc(req.params.id).get();
    if (!doc.exists) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    name, description, categoryId, categoryName,
    price, stock, unit
  } = req.body;

  if (!name || !price || stock === undefined) {
    res.status(400).json({ message: 'Name, price and stock required' });
    return;
  }

  try {
    let imageUrl = '';

    // Upload image to Firebase Storage
    if (req.file) {
      const bucket = storage.bucket();
      const fileName = `products/${uuidv4()}-${req.file.originalname}`;
      const fileRef = bucket.file(fileName);
      await fileRef.save(req.file.buffer, {
        metadata: { contentType: req.file.mimetype }
      });
      await fileRef.makePublic();
      imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    }

    const stockNum = Number(stock);
    let status = 'available';
    if (stockNum === 0) status = 'out_of_stock';
    else if (stockNum <= 10) status = 'low_stock';

    const id = uuidv4();
    await db.collection('products').doc(id).set({
      id,
      name,
      description: description || '',
      categoryId: categoryId || '',
      categoryName: categoryName || '',
      price: Number(price),
      stock: stockNum,
      unit: unit || 'pcs',
      imageUrl,
      status,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ message: 'Product created', id });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const {
    name, description, categoryId,
    categoryName, price, stock, unit
  } = req.body;

  try {
    const stockNum = Number(stock);
    let status = 'available';
    if (stockNum === 0) status = 'out_of_stock';
    else if (stockNum <= 10) status = 'low_stock';

    const updateData: any = {
      name,
      description: description || '',
      categoryId: categoryId || '',
      categoryName: categoryName || '',
      price: Number(price),
      stock: stockNum,
      unit: unit || 'pcs',
      status,
      updatedAt: new Date().toISOString(),
    };

    if (req.file) {
      const bucket = storage.bucket();
      const fileName = `products/${uuidv4()}-${req.file.originalname}`;
      const fileRef = bucket.file(fileName);
      await fileRef.save(req.file.buffer, {
        metadata: { contentType: req.file.mimetype }
      });
      await fileRef.makePublic();
      updateData.imageUrl =
        `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    }

    await db.collection('products').doc(id).update(updateData);
    res.json({ message: 'Product updated' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await db.collection('products').doc(req.params.id).delete();
    res.json({ message: 'Product deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};