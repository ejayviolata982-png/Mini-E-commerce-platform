import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      <!-- Stats Cards -->
      <div *ngIf="loading" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div *ngFor="let i of [1,2,3,4]" class="h-28 bg-gray-200 rounded-2xl animate-pulse"></div>
      </div>

      <div *ngIf="!loading" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-2xl border border-gray-200 p-5">
          <div class="flex items-center justify-between mb-3">
            <span class="text-2xl">💰</span>
            <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Revenue</span>
          </div>
          <p class="text-xl sm:text-2xl font-bold text-gray-900">₱{{ stats.revenue | number:'1.2-2' }}</p>
          <p class="text-xs text-gray-500 mt-1">Total Revenue</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-200 p-5">
          <div class="flex items-center justify-between mb-3">
            <span class="text-2xl">📦</span>
            <span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Orders</span>
          </div>
          <p class="text-xl sm:text-2xl font-bold text-gray-900">{{ stats.totalOrders }}</p>
          <p class="text-xs text-gray-500 mt-1">Total Orders</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-200 p-5">
          <div class="flex items-center justify-between mb-3">
            <span class="text-2xl">👥</span>
            <span class="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Users</span>
          </div>
          <p class="text-xl sm:text-2xl font-bold text-gray-900">{{ stats.totalUsers }}</p>
          <p class="text-xs text-gray-500 mt-1">Registered Users</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-200 p-5">
          <div class="flex items-center justify-between mb-3">
            <span class="text-2xl">🛍️</span>
            <span class="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Products</span>
          </div>
          <p class="text-xl sm:text-2xl font-bold text-gray-900">{{ stats.totalProducts }}</p>
          <p class="text-xs text-gray-500 mt-1">Active Products</p>
        </div>
      </div>

      <!-- Order Status Breakdown -->
      <div *ngIf="!loading" class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 class="font-bold text-gray-900 mb-4">Order Status</h2>
          <div class="space-y-3">
            <div *ngFor="let s of statusBreakdown" class="flex items-center gap-3">
              <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" [style.background]="s.color"></span>
              <span class="text-sm text-gray-600 flex-1">{{ s.label }}</span>
              <span class="text-sm font-bold text-gray-900">{{ s.count }}</span>
              <div class="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full rounded-full" [style.width]="s.pct + '%'" [style.background]="s.color"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 class="font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div class="grid grid-cols-2 gap-3">
            <a routerLink="/admin/products"
               class="flex flex-col items-center gap-2 p-4 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 transition">
              <span class="text-2xl">🛍️</span>
              <span class="text-xs font-semibold text-orange-700">Add Product</span>
            </a>
            <a routerLink="/admin/orders"
               class="flex flex-col items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition">
              <span class="text-2xl">📦</span>
              <span class="text-xs font-semibold text-blue-700">View Orders</span>
            </a>
            <a routerLink="/admin/categories"
               class="flex flex-col items-center gap-2 p-4 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition">
              <span class="text-2xl">📁</span>
              <span class="text-xs font-semibold text-purple-700">Categories</span>
            </a>
            <a routerLink="/admin/users"
               class="flex flex-col items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition">
              <span class="text-2xl">👥</span>
              <span class="text-xs font-semibold text-green-700">Manage Users</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Recent Orders -->
      <div *ngIf="!loading && recentOrders.length > 0" class="bg-white rounded-2xl border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-bold text-gray-900">Recent Orders</h2>
          <a routerLink="/admin/orders" class="text-orange-500 text-sm font-medium hover:underline">View all →</a>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100">
                <th class="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order ID</th>
                <th class="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                <th class="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                <th class="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of recentOrders" class="border-b border-gray-50 hover:bg-gray-50 transition">
                <td class="py-3 px-3 font-mono text-xs text-gray-500">#{{ order.id?.slice(-8).toUpperCase() }}</td>
                <td class="py-3 px-3 font-medium text-gray-900">{{ order.userName || 'Customer' }}</td>
                <td class="py-3 px-3 font-semibold text-gray-900">₱{{ order.total | number:'1.2-2' }}</td>
                <td class="py-3 px-3">
                  <span [class]="getStatusClass(order.status)"
                        class="px-2 py-1 rounded-full text-xs font-semibold border">
                    {{ order.status | titlecase }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  loading = true;
  stats: any = { revenue: 0, totalOrders: 0, totalUsers: 0, totalProducts: 0 };
  recentOrders: any[] = [];
  statusBreakdown: any[] = [];

  constructor(private orderService: OrderService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.orderService.getDashboard().subscribe({
      next: (data) => {
        this.stats = {
          revenue: data.stats?.totalRevenue || 0,
          totalOrders: data.stats?.totalOrders || 0,
          totalUsers: data.stats?.totalUsers || 0,
          totalProducts: data.stats?.totalProducts || 0,
        };
        this.recentOrders = data.recentOrders || [];
        this.buildStatusBreakdown({
          pending: data.stats?.pending || 0,
          processing: data.stats?.processing || 0,
          shipped: data.stats?.shipped || 0,
          delivered: data.stats?.delivered || 0,
          cancelled: data.stats?.cancelled || 0,
        });
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  buildStatusBreakdown(counts: any) {
    const total = Object.values(counts).reduce((a: any, b: any) => a + b, 0) || 1;
    const statuses = [
      { key: 'pending', label: 'Pending', color: '#f59e0b' },
      { key: 'processing', label: 'Processing', color: '#3b82f6' },
      { key: 'shipped', label: 'Shipped', color: '#8b5cf6' },
      { key: 'delivered', label: 'Delivered', color: '#10b981' },
      { key: 'cancelled', label: 'Cancelled', color: '#ef4444' },
    ];
    this.statusBreakdown = statuses.map(s => ({
      ...s,
      count: counts[s.key] || 0,
      pct: Math.round(((counts[s.key] || 0) / (total as number)) * 100)
    }));
    this.cdr.detectChanges();
  }

  getStatusClass(status: string) {
    const map: any = {
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      processing: 'bg-blue-50 text-blue-700 border-blue-200',
      shipped: 'bg-purple-50 text-purple-700 border-purple-200',
      delivered: 'bg-green-50 text-green-700 border-green-200',
      cancelled: 'bg-red-50 text-red-700 border-red-200',
    };
    return map[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  }
}