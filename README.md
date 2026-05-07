# 🛍️ ShopEase — Mini E-Commerce Platform

A full-stack e-commerce web application built with Angular, Node.js, Express, TypeScript, and Firebase Firestore.

---

## 🌐 Live Links

| | URL |

https://shopease-server-lqqa.onrender.com
https://mini-e-commerce-platform-ochre.vercel.app
https://shopease-server-lqqa.onrender.com/api-docs
---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 17 + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Database | Firebase Firestore (NoSQL) |
| Authentication | Firebase Auth + JWT |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |


## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- npm v9+
- Angular CLI (`npm install -g @angular/cli`)

---

### 🖥️ Run Frontend

```bash
cd client
npm install
ng serve


---

### 🖧 Run Backend

```bash
cd server
npm install
npm run dev


## 📡 API Overview

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Products
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Get all products (search, filter, pagination) |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create product (Admin) |
| PUT | `/api/products/:id` | Update product (Admin) |
| DELETE | `/api/products/:id` | Delete product (Admin) |

### Categories
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/categories` | Get all categories |
| POST | `/api/categories` | Create category (Admin) |
| PUT | `/api/categories/:id` | Update category (Admin) |
| DELETE | `/api/categories/:id` | Delete category (Admin) |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Place an order |
| GET | `/api/orders/my` | Get my orders |
| GET | `/api/orders` | Get all orders (Admin) |
| PATCH | `/api/orders/:id/status` | Update order status (Admin) |
| POST | `/api/orders/:id/cancel-request` | Request order cancellation |
| POST | `/api/orders/:id/cancel-action` | Approve/reject cancel request (Admin) |
| GET | `/api/orders/dashboard` | Get dashboard stats (Admin) |

### Cart
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/cart` | Get user cart |
| POST | `/api/cart` | Add item to cart |
| PUT | `/api/cart/:itemId` | Update cart item |
| DELETE | `/api/cart/:itemId` | Remove cart item |
| DELETE | `/api/cart` | Clear cart |

### Users
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | Get all users (Admin) |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user profile |

---

## ✅ Features Implemented

### 👤 Authentication & Authorization
- User registration with validation (name, phone, email, password strength)
- User login with JWT token
- Role-based access control (Admin / User)
- Protected routes with Angular route guards

### 🛍️ Product Management
- Browse products with search, category filter, and pagination
- Product detail page
- Admin: Create, edit, delete products with image URL support
- Stock status tracking (available, low stock, out of stock)

### 📦 Order Management
- Add to cart with quantity control
- Checkout with shipping address and payment method selection
- My Orders page with order history
- Order cancellation request system (user requests → admin approves/rejects)
- Admin: View all orders, update order status, view full order details with shipping address

### 🗂️ Category Management
- Admin: Create, edit, delete categories
- Expandable category folders showing products inside each category

### 👥 User Management
- Admin: View all registered users

### 📊 Admin Dashboard
- Revenue, total orders, users, products stats
- Recent orders list
- Order status breakdown chart

### 🎨 UI/UX
- Fully responsive design with Tailwind CSS
- Loading skeletons and states
- Toast notifications
- Modal confirmations
- Mobile-friendly layout

---


## 📸 Screenshots

### 👤 User View
- ![Home Page](screenshots/admin_login.png) — Landing page with hero banner, category pills, and featured products grid
- ![All Products](screenshots/User_product_view.png) — Product listing with search bar, category filter, stock count, and Add to Cart button
- ![Shopping Cart](screenshots/User_cart_view_db.png) — Cart with item selection, quantity controls, order summary, and total price
- ![Checkout](screenshots/user_address_details_and_payment_method_img.png) — Shipping address form with payment method selection (COD, GCash, Bank Transfer)
- ![My Orders](screenshots/User_orders_view_status.png) — Order history showing order number, items, payment method, and status
- ![Shop by Category](screenshots/Shop_Category.png) — Home page category section with clickable pill buttons for filtering products

