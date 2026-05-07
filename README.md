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
- ![Home Page](screenshots/User_first_screen_db.png) — Landing page with hero banner, category pills, and featured products grid
- ![All Products](screenshots/User_product_view.png) — Product listing with search bar, category filter, stock count, and Add to Cart button
- ![Shopping Cart](screenshots/User_cart_view_db.png) — Cart with item selection, quantity controls, order summary, and total price
- ![Checkout](screenshots/user_address_details_and_payment_method_img.png) — Shipping address form with payment method selection (COD, GCash, Bank Transfer)
- ![My Orders](screenshots/User_orders_view_status.png) — Order history showing order number, items, payment method, and status
- ![Shop by Category](screenshots/Shop_Category.png) — Home page category section with clickable pill buttons for filtering products

### 🔐 Admin Panel
- ![Login](screenshots/admin_login.png) — Admin authentication and login page
- ![Dashboard](screenshots/Main_dashboard.png) — Overview of total revenue, orders, users, active products, and order status breakdown
- ![Manage Products](screenshots/Admin_Product_Db.png) — Product list with category, price, stock, and edit/delete controls
- ![Add Product](screenshots/ADD_product_.png) — Modal form for adding a new product with name, price, stock, category, description, and image URL
- ![Manage Categories](screenshots/Categories_db.png) — Category list with expandable product view showing price, stock, and availability status
- ![Manage Orders](screenshots/Orders_status_db.png) — Orders table with customer info, shipping address, total, status, and cancel request controls
- ![Order Details](screenshots/Order_details.png) — Modal showing customer info, shipping address, items ordered, and payment method
- ![Manage Users](screenshots/User_db.png) — List of all registered users with name, email, role, and join date
- ![Admin Profile](screenshots/Admin_profile.png) — Admin profile page with editable name, phone, gender, age, and address

### 📡 API Documentation (Swagger)
- ![Swagger UI](screenshots/swager_fs.png) — Interactive API docs listing all endpoints grouped by Auth, Products, Cart, Orders, and Users
- ![GET /products](screenshots/Get_product.png) — Fetch all products with search, category, page, and limit query parameters
- ![GET /categories](screenshots/Get_Categories.png) — Retrieve all product categories with full CRUD endpoints listed
- ![GET /cart](screenshots/Get_Cart.png) — Get the current authenticated user's cart with all cart endpoints listed
- ![GET /orders](screenshots/Get_Order.png) — Fetch all orders (Admin) with status and search filter parameters
- ![GET /users](screenshots/Get_User.png) — Retrieve all registered users (Admin only) with user endpoints listed
- ![POST /auth/register](screenshots/Post_Register_1.png) — Register a new user with name, email, password, and phone fields
- ![POST /auth/login](screenshots/post_login1.png) — Authenticate a user with email and password, returns JWT token
- ![POST /cart](screenshots/Post_Cart.png) — Add a product item to the user's cart with request body schema
- ![POST /orders](screenshots/Post_Order.png) — Place a new order with items, shipping address, payment method, and total amount
- ![POST /products](screenshots/post_Product.png) — Create a new product (Admin only) with full product schema
- ![PUT /categories/:id](screenshots/Put_Categories.png) — Update an existing category with name, icon, and description fields
- ![PUT /users/:id](screenshots/Put_user_id.png) — Update a user's profile with name, phone, and address fields

