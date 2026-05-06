import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products').then(m => m.ProductsComponent)
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./pages/product-detail/product-detail').then(m => m.ProductDetailComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart').then(m => m.CartComponent),
    canActivate: [authGuard]
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout').then(m => m.CheckoutComponent),
    canActivate: [authGuard]
  },
  {
    path: 'my-orders',
    loadComponent: () => import('./pages/my-orders/my-orders').then(m => m.MyOrdersComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin-layout/admin-layout').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin/dashboard/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/admin/manage-products/manage-products').then(m => m.ManageProductsComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./pages/admin/manage-categories/manage-categories').then(m => m.ManageCategoriesComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./pages/admin/manage-orders/manage-orders').then(m => m.ManageOrdersComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/admin/manage-users/manage-users').then(m => m.ManageUsersComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
