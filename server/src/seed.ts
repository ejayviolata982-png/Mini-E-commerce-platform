import dotenv from 'dotenv';
dotenv.config();

import admin from 'firebase-admin';
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const auth = admin.auth();

// =====================
// SEED CATEGORIES
// =====================
const categories = [
  { id: 'cat-1', name: 'Electronics', description: 'Phones, laptops and gadgets' },
  { id: 'cat-2', name: 'Clothing', description: 'Fashion and apparel' },
  { id: 'cat-3', name: 'Food & Beverages', description: 'Snacks, drinks and groceries' },
  { id: 'cat-4', name: 'Home & Living', description: 'Furniture and home decor' },
  { id: 'cat-5', name: 'Sports', description: 'Sports equipment and accessories' },
];

// =====================
// SEED PRODUCTS
// =====================
const products = [
  {
    id: 'prod-1', name: 'iPhone 15 Pro', description: 'Latest Apple smartphone',
    categoryId: 'cat-1', categoryName: 'Electronics',
    price: 59999, stock: 50, unit: 'pcs', imageUrl: '', status: 'available',
    rating: 4.8, reviewCount: 120,
  },
  {
    id: 'prod-2', name: 'Samsung Galaxy S24', description: 'Samsung flagship phone',
    categoryId: 'cat-1', categoryName: 'Electronics',
    price: 49999, stock: 35, unit: 'pcs', imageUrl: '', status: 'available',
    rating: 4.7, reviewCount: 85,
  },
  {
    id: 'prod-3', name: 'MacBook Air M3', description: 'Apple laptop with M3 chip',
    categoryId: 'cat-1', categoryName: 'Electronics',
    price: 89999, stock: 8, unit: 'pcs', imageUrl: '', status: 'low_stock',
    rating: 4.9, reviewCount: 200,
  },
  {
    id: 'prod-4', name: 'Wireless Earbuds', description: 'Noise cancelling earbuds',
    categoryId: 'cat-1', categoryName: 'Electronics',
    price: 2999, stock: 100, unit: 'pcs', imageUrl: '', status: 'available',
    rating: 4.5, reviewCount: 300,
  },
  {
    id: 'prod-5', name: 'Men\'s Polo Shirt', description: 'Classic fit polo shirt',
    categoryId: 'cat-2', categoryName: 'Clothing',
    price: 599, stock: 200, unit: 'pcs', imageUrl: '', status: 'available',
    rating: 4.3, reviewCount: 150,
  },
  {
    id: 'prod-6', name: 'Women\'s Dress', description: 'Elegant casual dress',
    categoryId: 'cat-2', categoryName: 'Clothing',
    price: 899, stock: 5, unit: 'pcs', imageUrl: '', status: 'low_stock',
    rating: 4.6, reviewCount: 90,
  },
  {
    id: 'prod-7', name: 'Running Shoes', description: 'Lightweight running shoes',
    categoryId: 'cat-2', categoryName: 'Clothing',
    price: 3499, stock: 60, unit: 'pairs', imageUrl: '', status: 'available',
    rating: 4.4, reviewCount: 175,
  },
  {
    id: 'prod-8', name: 'Instant Noodles Pack', description: 'Assorted flavors 10 packs',
    categoryId: 'cat-3', categoryName: 'Food & Beverages',
    price: 150, stock: 500, unit: 'pack', imageUrl: '', status: 'available',
    rating: 4.2, reviewCount: 400,
  },
  {
    id: 'prod-9', name: 'Coffee Beans 1kg', description: 'Premium Arabica coffee beans',
    categoryId: 'cat-3', categoryName: 'Food & Beverages',
    price: 799, stock: 80, unit: 'kg', imageUrl: '', status: 'available',
    rating: 4.7, reviewCount: 220,
  },
  {
    id: 'prod-10', name: 'Energy Drink 24-pack', description: 'Assorted energy drinks',
    categoryId: 'cat-3', categoryName: 'Food & Beverages',
    price: 999, stock: 0, unit: 'pack', imageUrl: '', status: 'out_of_stock',
    rating: 4.1, reviewCount: 95,
  },
  {
    id: 'prod-11', name: 'Office Chair', description: 'Ergonomic office chair',
    categoryId: 'cat-4', categoryName: 'Home & Living',
    price: 5999, stock: 20, unit: 'pcs', imageUrl: '', status: 'available',
    rating: 4.5, reviewCount: 130,
  },
  {
    id: 'prod-12', name: 'LED Desk Lamp', description: 'Adjustable LED desk lamp',
    categoryId: 'cat-4', categoryName: 'Home & Living',
    price: 899, stock: 45, unit: 'pcs', imageUrl: '', status: 'available',
    rating: 4.3, reviewCount: 88,
  },
  {
    id: 'prod-13', name: 'Yoga Mat', description: 'Non-slip yoga mat 6mm',
    categoryId: 'cat-5', categoryName: 'Sports',
    price: 799, stock: 7, unit: 'pcs', imageUrl: '', status: 'low_stock',
    rating: 4.6, reviewCount: 165,
  },
  {
    id: 'prod-14', name: 'Dumbbell Set 20kg', description: 'Adjustable dumbbell set',
    categoryId: 'cat-5', categoryName: 'Sports',
    price: 4999, stock: 15, unit: 'set', imageUrl: '', status: 'available',
    rating: 4.8, reviewCount: 210,
  },
  {
    id: 'prod-15', name: 'Basketball', description: 'Official size basketball',
    categoryId: 'cat-5', categoryName: 'Sports',
    price: 1299, stock: 30, unit: 'pcs', imageUrl: '', status: 'available',
    rating: 4.4, reviewCount: 75,
  },
];

// =====================
// SEED ADMIN USER
// =====================
const adminUser = {
  email: 'admin@ecommerce.com',
  password: 'Admin#12345',
  name: 'Admin User',
  phone: '09123456789',
  address: 'Cebu City, Philippines',
};

// =====================
// SEED FUNCTIONS
// =====================
async function seedCategories(): Promise<void> {
  console.log('🌱 Seeding categories...');
  const batch = db.batch();
  for (const cat of categories) {
    const ref = db.collection('categories').doc(cat.id);
    batch.set(ref, {
      ...cat,
      createdAt: new Date().toISOString(),
    });
  }
  await batch.commit();
  console.log(`✅ ${categories.length} categories seeded!`);
}

async function seedProducts(): Promise<void> {
  console.log('🌱 Seeding products...');
  const batch = db.batch();
  for (const product of products) {
    const ref = db.collection('products').doc(product.id);
    batch.set(ref, {
      ...product,
      createdAt: new Date().toISOString(),
    });
  }
  await batch.commit();
  console.log(`✅ ${products.length} products seeded!`);
}

async function seedAdminUser(): Promise<void> {
  console.log('🌱 Seeding admin user...');
  try {
    // Check if admin already exists
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(adminUser.email);
      console.log('⚠️ Admin user already exists, updating Firestore...');
    } catch {
      // Create new admin in Firebase Auth
      userRecord = await auth.createUser({
        email: adminUser.email,
        password: adminUser.password,
        displayName: adminUser.name,
      });
      console.log('✅ Admin user created in Firebase Auth!');
    }

    // Save admin to Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      name: adminUser.name,
      email: adminUser.email,
      phone: adminUser.phone,
      address: adminUser.address,
      role: 'admin',
      createdAt: new Date().toISOString(),
    });

    console.log('✅ Admin user saved to Firestore!');
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`🔑 Password: ${adminUser.password}`);
    console.log(`🆔 UID: ${userRecord.uid}`);
  } catch (err: any) {
    console.error('❌ Admin seed error:', err.message);
  }
}

// =====================
// RUN ALL SEEDS
// =====================
async function runSeed(): Promise<void> {
  console.log('🚀 Starting database seed...\n');
  try {
    await seedCategories();
    await seedProducts();
    await seedAdminUser();
    console.log('\n🎉 All data seeded successfully!');
    console.log('\n📋 Summary:');
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Products: ${products.length}`);
    console.log(`   Admin: ${adminUser.email}`);
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

runSeed();