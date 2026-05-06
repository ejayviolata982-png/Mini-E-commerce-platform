import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';


import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import cartRoutes from './routes/cartRoutes';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middleware/errorHandler';

import swaggerUi from 'swagger-ui-express';
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
const swaggerDocument = {
  openapi: '3.0.0',
  info: { title: 'ShopEase API', description: 'Mini E-Commerce Platform REST API', version: '1.0.0' },
  servers: [
    { url: 'https://shopease-server-lqqa.onrender.com/api', description: 'Production' },
    { url: 'http://localhost:3000/api', description: 'Local' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/auth/register': {
      post: { tags: ['Auth'], summary: 'Register a new user', security: [],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: {
          name: { type: 'string', example: 'Juan dela Cruz' },
          email: { type: 'string', example: 'juan@email.com' },
          password: { type: 'string', example: 'Password@123' },
          phone: { type: 'string', example: '09123456789' }
        }}}}},
        responses: { 201: { description: 'User registered' }, 400: { description: 'Validation error' } }
      }
    },
    '/auth/login': {
      post: { tags: ['Auth'], summary: 'Login user', security: [],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: {
          email: { type: 'string', example: 'juan@email.com' },
          password: { type: 'string', example: 'Password@123' }
        }}}}},
        responses: { 200: { description: 'Login successful' }, 401: { description: 'Invalid credentials' } }
      }
    },
    '/auth/me': {
      get: { tags: ['Auth'], summary: 'Get current user',
        responses: { 200: { description: 'User data' }, 401: { description: 'Unauthorized' } }
      }
    },
    '/products': {
      get: { tags: ['Products'], summary: 'Get all products', security: [],
        parameters: [
          { in: 'query', name: 'search', schema: { type: 'string' } },
          { in: 'query', name: 'category', schema: { type: 'string' } },
          { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 12 } }
        ],
        responses: { 200: { description: 'List of products' } }
      },
      post: { tags: ['Products'], summary: 'Create product (Admin)',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: {
          name: { type: 'string' }, price: { type: 'number' }, stock: { type: 'integer' },
          categoryId: { type: 'string' }, categoryName: { type: 'string' },
          description: { type: 'string' }, imageUrl: { type: 'string' }
        }}}}},
        responses: { 201: { description: 'Product created' } }
      }
    },
    '/products/{id}': {
      get: { tags: ['Products'], summary: 'Get product by ID', security: [],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Product data' }, 404: { description: 'Not found' } }
      },
      put: { tags: ['Products'], summary: 'Update product (Admin)',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: {
          name: { type: 'string' }, price: { type: 'number' }, stock: { type: 'integer' },
          categoryId: { type: 'string' }, categoryName: { type: 'string' },
          description: { type: 'string' }, imageUrl: { type: 'string' }
        }}}}},
        responses: { 200: { description: 'Product updated' } }
      },
      delete: { tags: ['Products'], summary: 'Delete product (Admin)',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Product deleted' } }
      }
    },
    '/categories': {
      get: { tags: ['Categories'], summary: 'Get all categories', security: [],
        responses: { 200: { description: 'List of categories' } }
      },
      post: { tags: ['Categories'], summary: 'Create category (Admin)',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: {
          name: { type: 'string' }, icon: { type: 'string' }, description: { type: 'string' }
        }}}}},
        responses: { 201: { description: 'Category created' } }
      }
    },
    '/categories/{id}': {
      put: { tags: ['Categories'], summary: 'Update category (Admin)',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: {
          name: { type: 'string' }, icon: { type: 'string' }, description: { type: 'string' }
        }}}}},
        responses: { 200: { description: 'Category updated' } }
      },
      delete: { tags: ['Categories'], summary: 'Delete category (Admin)',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Category deleted' } }
      }
    },
    '/orders': {
      post: { tags: ['Orders'], summary: 'Place a new order',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: {
          items: { type: 'array', items: { type: 'object', properties: {
            productId: { type: 'string' }, name: { type: 'string' },
            price: { type: 'number' }, quantity: { type: 'integer' }, imageUrl: { type: 'string' }
          }}},
          shippingAddress: { type: 'object', properties: {
            name: { type: 'string' }, phone: { type: 'string' }, address: { type: 'string' }
          }},
          paymentMethod: { type: 'string', example: 'cod' },
          totalAmount: { type: 'number' }
        }}}}},
        responses: { 201: { description: 'Order placed' } }
      },
      get: { tags: ['Orders'], summary: 'Get all orders (Admin)',
        parameters: [
          { in: 'query', name: 'status', schema: { type: 'string' } },
          { in: 'query', name: 'search', schema: { type: 'string' } }
        ],
        responses: { 200: { description: 'List of orders' } }
      }
    },
    '/orders/my': {
      get: { tags: ['Orders'], summary: 'Get my orders',
        responses: { 200: { description: 'User orders' } }
      }
    },
    '/orders/dashboard': {
      get: { tags: ['Orders'], summary: 'Dashboard stats (Admin)',
        responses: { 200: { description: 'Stats data' } }
      }
    },
    '/orders/{id}/status': {
      patch: { tags: ['Orders'], summary: 'Update order status (Admin)',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: {
          status: { type: 'string', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] }
        }}}}},
        responses: { 200: { description: 'Status updated' } }
      }
    },
    '/orders/{id}/cancel-request': {
      post: { tags: ['Orders'], summary: 'Request order cancellation',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: {
          reason: { type: 'string', example: 'Changed my mind' }
        }}}}},
        responses: { 200: { description: 'Cancel request submitted' } }
      }
    },
    '/orders/{id}/cancel-action': {
      post: { tags: ['Orders'], summary: 'Approve or reject cancel (Admin)',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: {
          action: { type: 'string', enum: ['approve', 'reject'] }
        }}}}},
        responses: { 200: { description: 'Request handled' } }
      }
    },
    '/cart': {
      get: { tags: ['Cart'], summary: 'Get user cart', responses: { 200: { description: 'Cart data' } } },
      post: { tags: ['Cart'], summary: 'Add item to cart',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: {
          productId: { type: 'string' }, name: { type: 'string' },
          price: { type: 'number' }, quantity: { type: 'integer' }, imageUrl: { type: 'string' }
        }}}}},
        responses: { 200: { description: 'Item added' } }
      },
      delete: { tags: ['Cart'], summary: 'Clear cart', responses: { 200: { description: 'Cart cleared' } } }
    },
    '/cart/{itemId}': {
      put: { tags: ['Cart'], summary: 'Update cart item quantity',
        parameters: [{ in: 'path', name: 'itemId', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: {
          quantity: { type: 'integer' }
        }}}}},
        responses: { 200: { description: 'Item updated' } }
      },
      delete: { tags: ['Cart'], summary: 'Remove cart item',
        parameters: [{ in: 'path', name: 'itemId', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Item removed' } }
      }
    },
    '/users': {
      get: { tags: ['Users'], summary: 'Get all users (Admin)', responses: { 200: { description: 'Users list' } } }
    },
    '/users/{id}': {
      get: { tags: ['Users'], summary: 'Get user by ID',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'User data' } }
      },
      put: { tags: ['Users'], summary: 'Update user profile',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: {
          name: { type: 'string' }, phone: { type: 'string' }, address: { type: 'string' }
        }}}}},
        responses: { 200: { description: 'User updated' } }
      }
    }
  }
};

// Swagger Docs
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