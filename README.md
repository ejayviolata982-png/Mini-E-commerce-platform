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

Screenshots are stored in the `/screenshots` folder, organized by UI section and API documentation.

### User View Screenshots
- [User first screen](screenshots/User%20View%20db%20img/User%20first%20screen%20db.png) — Home screen with product browsing and category filter
- [User product view](screenshots/User%20View%20db%20img/User%20product%20view.png) — Product detail page with stock, price, and add-to-cart controls
- [User cart view](screenshots/User%20View%20db%20img/User%20cart%20view%20db.png) — Shopping cart with quantity controls, selection, and order summary
- [Checkout details](screenshots/User%20View%20db%20img/user%20address%20details%20and%20payment%20method%20img.png) — Checkout flow with shipping and payment entry
- [User orders status](screenshots/User%20View%20db%20img/User%20orders%20view%20status.png) — Order history with status tracking
- [Shop categories](screenshots/User%20View%20db%20img/Shop%20Category.png) — Category browsing UI

### Admin Screenshots
- [Admin login](screenshots/AdminDB%20img/admin%20login.png) — Admin authentication page
- [Dashboard](screenshots/AdminDB%20img/Main%20dashboard.png) — Dashboard overview with sales, orders, and metrics
- [Product management](screenshots/AdminDB%20img/Admin%20Product%20Db.png) — Product management interface
- [Category management](screenshots/AdminDB%20img/Categories%20db.png) — Category management UI
- [Orders status](screenshots/AdminDB%20img/Orders%20status%20db.png) — Orders table with status controls
- [Order details](screenshots/AdminDB%20img/Order%20details.png) — Order details modal showing items and shipping info
- [User management](screenshots/AdminDB%20img/User%20db.png) — User management screen
- [Admin profile](screenshots/AdminDB%20img/Admin%20profile.png) — Admin profile or settings view
- [Add product](screenshots/AdminDB%20img/ADD%20product%20.png) — Add product form

### Swagger / API Screenshots
- [Swagger UI](screenshots/swagger%20img/swager%20fs.png) — Swagger UI landing page
- [GET product](screenshots/swagger%20img/Get%20product.png) — Swagger GET product endpoint
- [GET categories](screenshots/swagger%20img/Get%20Categories.png) — Swagger GET categories endpoint
- [GET cart](screenshots/swagger%20img/Get%20Cart.png) — Swagger GET cart endpoint
- [GET order](screenshots/swagger%20img/Get%20Order.png) — Swagger GET order endpoint
- [GET user](screenshots/swagger%20img/Get%20User.png) — Swagger GET user endpoint
- [Register](screenshots/swagger%20img/Post%20Register%201.png) — Swagger register endpoint
- [Login](screenshots/swagger%20img/post%20login1.png) — Swagger login endpoint
- [Add cart](screenshots/swagger%20img/Post%20Cart.png) — Swagger add to cart endpoint
- [Place order](screenshots/swagger%20img/Post%20Order.png) — Swagger place order endpoint
- [Create product](screenshots/swagger%20img/post%20Product.png) — Swagger create product endpoint
- [Update category](screenshots/swagger%20img/Put%20Categories.png) — Swagger update category endpoint
- [Update user](screenshots/swagger%20img/Put%20user%20id.png) — Swagger update user endpoint

> Click the links above to open screenshots directly from the `/screenshots` folder.

