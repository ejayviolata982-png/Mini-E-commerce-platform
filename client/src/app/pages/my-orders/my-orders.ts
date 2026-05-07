import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">📦 My Orders</h1>

      <div *ngIf="loading" class="space-y-4">
        <div *ngFor="let i of [1,2,3]" class="h-32 bg-gray-200 rounded-2xl animate-pulse"></div>
      </div>

      <div *ngIf="!loading && orders.length === 0" class="text-center py-16">
        <span class="text-5xl">📦</span>
        <p class="text-gray-500 mt-4">No orders yet</p>
        <a routerLink="/products" class="mt-4 inline-block bg-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-orange-600 transition text-sm">
          Start Shopping
        </a>
      </div>

      <div *ngIf="!loading" class="space-y-4">
        <div *ngFor="let order of orders" class="bg-white rounded-2xl border border-gray-200 p-6">
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
            <div>
              <p class="font-bold text-gray-900 text-sm">Order #{{ order.id?.slice(-8).toUpperCase() }}</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ order.createdAt | date:'medium' }}</p>
            </div>
            <div class="flex flex-col items-start sm:items-end gap-2">
              <span [class]="getStatusClass(order.status)"
                    class="px-3 py-1 rounded-full text-xs font-semibold border">
                {{ order.status | titlecase }}
              </span>

              <!-- Cancel request badge -->
              <span *ngIf="order.cancelRequest?.status === 'pending'"
                    class="px-3 py-1 rounded-full text-xs font-semibold border bg-orange-50 text-orange-700 border-orange-200">
                ⏳ Cancel Requested
              </span>
              <span *ngIf="order.cancelRequest?.status === 'rejected'"
                    class="px-3 py-1 rounded-full text-xs font-semibold border bg-red-50 text-red-700 border-red-200">
                ❌ Cancel Rejected
              </span>

              <!-- Cancel button: show if order is pending/processing and no active cancel request -->
              <button *ngIf="canRequestCancel(order)"
                      (click)="openCancelModal(order)"
                      class="text-red-500 hover:text-red-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition border border-red-200">
                Request Cancel
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <div *ngFor="let item of order.items" class="flex justify-between text-sm">
              <span class="text-gray-600">{{ item.name }} × {{ item.quantity }}</span>
              <span class="font-medium">₱{{ (item.price * item.quantity) | number:'1.2-2' }}</span>
            </div>
          </div>
          <div class="border-t border-gray-100 mt-4 pt-3">
            <div class="flex justify-between text-sm text-gray-500 mb-1">
              <span>Payment Method</span>
              <span class="font-medium uppercase">{{ order.paymentMethod || 'N/A' }}</span>
            </div>
            <div class="flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span class="text-orange-600">₱{{ (order.total || order.totalAmount || 0) | number:'1.2-2' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Cancel Request Modal -->
      <div *ngIf="cancelTarget" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
          <div class="text-center mb-4">
            <span class="text-4xl">🚫</span>
            <h3 class="font-bold text-gray-900 mt-3">Request Cancellation</h3>
            <p class="text-gray-500 text-sm mt-1">
              Order <strong>#{{ cancelTarget.id?.slice(-8).toUpperCase() }}</strong><br>
              Your request will be reviewed by admin.
            </p>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Reason <span class="text-red-400">*</span></label>
            <textarea [(ngModel)]="cancelReason" rows="3"
                      placeholder="Why do you want to cancel this order?"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"></textarea>
            <p *ngIf="cancelError" class="text-red-500 text-xs mt-1">{{ cancelError }}</p>
          </div>
          <div class="flex gap-3">
            <button (click)="cancelTarget = null; cancelReason = ''; cancelError = ''"
                    class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 text-sm transition">
              Keep Order
            </button>
            <button (click)="submitCancelRequest()" [disabled]="submitting"
                    class="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition">
              {{ submitting ? 'Submitting...' : 'Submit Request' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Toast -->
      <div *ngIf="toast" class="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium z-50">
        {{ toast }}
      </div>
    </div>
  `
})
export class MyOrdersComponent implements OnInit {
  orders: any[] = [];
  loading = true;
  cancelTarget: any = null;
  cancelReason = '';
  cancelError = '';
  submitting = false;
  toast = '';

  constructor(private orderService: OrderService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.loadOrders(); }

  loadOrders() {
    this.loading = true;
    this.orderService.getMyOrders().subscribe({
      next: (orders) => { this.orders = orders; this.loading = false; this.cdr.detectChanges(); },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  canRequestCancel(order: any): boolean {
    if (['cancelled', 'shipped', 'delivered'].includes(order.status)) return false;
    if (!order.cancelRequest?.status) return true;
    if (order.cancelRequest?.status === 'rejected') return true;
    return false;
  }

  openCancelModal(order: any) {
    this.cancelTarget = order;
    this.cancelReason = '';
    this.cancelError = '';
    this.cdr.detectChanges();
  }

  submitCancelRequest() {
    if (!this.cancelReason.trim()) {
      this.cancelError = 'Please provide a reason.';
      this.cdr.detectChanges();
      return;
    }
    this.submitting = true;
    this.orderService.requestCancel(this.cancelTarget.id, this.cancelReason).subscribe({
      next: () => {
        // Update local state immediately
        const order = this.orders.find(o => o.id === this.cancelTarget.id);
        if (order) {
          order.cancelRequest = { status: 'pending', reason: this.cancelReason };
        }
        this.cancelTarget = null;
        this.cancelReason = '';
        this.submitting = false;
        this.showToast('✅ Cancel request submitted!');
      },
      error: (e: any) => {
        this.cancelError = e?.error?.message || 'Failed to submit request.';
        this.submitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  showToast(msg: string) {
    this.toast = msg;
    this.cdr.detectChanges();
    setTimeout(() => { this.toast = ''; this.cdr.detectChanges(); }, 3000);
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