import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';

import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import cartRoutes from './routes/cartRoutes';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middleware/errorHandler';

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

// Initialize Firebase
import './config/firebase';

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://mini-e-commerce-platform-ochre.vercel.app',
    'http://localhost:4200'
  ],
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

// Swagger Docs
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.get('/', (req, res) => {
  res.json({ message: '🛍️ Mini E-Commerce API is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);

// Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🔥 Firebase connected!`);
});