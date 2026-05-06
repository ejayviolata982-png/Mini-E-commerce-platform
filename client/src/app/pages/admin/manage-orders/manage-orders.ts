import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Orders</h1>
          <p class="text-gray-500 text-sm mt-1">{{ orders.length }} orders total</p>
        </div>
        <div *ngIf="pendingCancelCount > 0"
             class="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-sm font-semibold">
          🚫 {{ pendingCancelCount }} Cancel Request{{ pendingCancelCount > 1 ? 's' : '' }}
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 mb-6">
        <input [(ngModel)]="search" (ngModelChange)="onSearch()" type="text" placeholder="Search by customer or order ID..."
               class="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"/>
        <select [(ngModel)]="filterStatus" (ngModelChange)="loadOrders()"
                class="px-4 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
          <option value="cancel_requested">Cancel Requested</option>
        </select>
      </div>

      <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div *ngIf="loading" class="p-8 space-y-3">
          <div *ngFor="let i of [1,2,3,4,5]" class="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
        </div>

        <div *ngIf="!loading" class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order</th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Customer</th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Address</th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr *ngFor="let order of filteredOrders"
                  [class.bg-orange-50]="order.cancelRequest?.status === 'pending'"
                  class="hover:bg-gray-50 transition">
                <td class="py-3 px-4">
                  <p class="font-mono text-xs font-bold text-gray-700">#{{ order.id?.slice(-8).toUpperCase() }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">{{ order.createdAt | date:'shortDate' }}</p>
                  <p class="text-xs text-orange-500 font-medium mt-0.5">{{ order.items?.length || 0 }} item(s)</p>
                </td>
                <td class="py-3 px-4 hidden sm:table-cell">
                  <p class="font-medium text-gray-900">{{ order.userName || 'Customer' }}</p>
                  <p class="text-xs text-gray-400">{{ order.userEmail }}</p>
                </td>
                <!-- Address column -->
                <td class="py-3 px-4 hidden md:table-cell max-w-[200px]">
                  <div *ngIf="order.shippingAddress; else noAddress">
                    <p class="text-xs text-gray-700 font-medium">{{ order.shippingAddress.name }}</p>
                    <p class="text-xs text-gray-400">{{ order.shippingAddress.phone }}</p>
                    <p class="text-xs text-gray-400 truncate">{{ order.shippingAddress.address }}</p>
                  </div>
                  <ng-template #noAddress>
                    <span class="text-xs text-gray-300 italic">No address</span>
                  </ng-template>
                </td>
                <td class="py-3 px-4 font-bold text-gray-900">₱{{ order.total | number:'1.2-2' }}</td>
                <td class="py-3 px-4">
                  <div class="flex flex-col gap-1">
                    <span [class]="getStatusClass(order.status)"
                          class="px-2 py-1 rounded-full text-xs font-semibold border w-fit">
                      {{ order.status | titlecase }}
                    </span>
                    <span *ngIf="order.cancelRequest?.status === 'pending'"
                          class="px-2 py-1 rounded-full text-xs font-semibold border bg-orange-50 text-orange-700 border-orange-300 w-fit">
                      🚫 Cancel Requested
                    </span>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <div class="flex flex-col gap-2">
                    <!-- View Details button -->
                    <button (click)="viewOrderDetails(order)"
                            class="text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium px-3 py-1.5 rounded-lg transition border border-blue-200 w-full text-left">
                      📋 View Details
                    </button>
                    <select [ngModel]="order.status" (ngModelChange)="updateStatus(order, $event)"
                            class="px-2 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-orange-400">
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <div *ngIf="order.cancelRequest?.status === 'pending'" class="flex gap-1">
                      <button (click)="viewCancelRequest(order)"
                              class="flex-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-2 py-1.5 rounded-lg transition">
                        View
                      </button>
                      <button (click)="handleCancel(order, 'approve')"
                              class="flex-1 text-xs bg-green-500 hover:bg-green-600 text-white font-medium px-2 py-1.5 rounded-lg transition">
                        Approve
                      </button>
                      <button (click)="handleCancel(order, 'reject')"
                              class="flex-1 text-xs bg-red-500 hover:bg-red-600 text-white font-medium px-2 py-1.5 rounded-lg transition">
                        Reject
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="filteredOrders.length === 0" class="text-center py-12">
            <span class="text-4xl">📦</span>
            <p class="text-gray-500 mt-3">No orders found</p>
          </div>
        </div>
      </div>

      <!-- ===== ORDER DETAILS MODAL ===== -->
      <div *ngIf="viewingOrder" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
            <div>
              <h3 class="font-bold text-gray-900 text-lg">Order Details</h3>
              <p class="text-xs text-gray-400 mt-0.5">#{{ viewingOrder.id?.slice(-8).toUpperCase() }} · {{ viewingOrder.createdAt | date:'medium' }}</p>
            </div>
            <button (click)="viewingOrder = null"
                    class="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition">×</button>
          </div>

          <div class="p-6 space-y-5">

            <!-- Customer Info -->
            <div class="bg-gray-50 rounded-xl p-4">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">👤 Customer Info</p>
              <div class="space-y-1">
                <p class="text-sm font-semibold text-gray-900">{{ viewingOrder.userName || 'Customer' }}</p>
                <p class="text-xs text-gray-500">{{ viewingOrder.userEmail }}</p>
              </div>
            </div>

            <!-- Shipping Address -->
            <div class="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p class="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-3">📍 Shipping Address</p>
              <div *ngIf="viewingOrder.shippingAddress; else noAddrModal" class="space-y-1">
                <p class="text-sm font-semibold text-gray-900">{{ viewingOrder.shippingAddress.name }}</p>
                <p class="text-xs text-gray-600">📞 {{ viewingOrder.shippingAddress.phone }}</p>
                <p class="text-xs text-gray-600">📍 {{ viewingOrder.shippingAddress.address }}</p>
              </div>
              <ng-template #noAddrModal>
                <p class="text-xs text-gray-400 italic">No shipping address provided</p>
              </ng-template>
            </div>

            <!-- Order Items -->
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">🛍️ Items Ordered</p>
              <div class="space-y-3">
                <div *ngFor="let item of viewingOrder.items"
                     class="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <!-- Product image -->
                  <div class="w-12 h-12 bg-white rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                    <img *ngIf="item.imageUrl" [src]="item.imageUrl" [alt]="item.name"
                         class="w-full h-full object-cover"/>
                    <div *ngIf="!item.imageUrl"
                         class="w-full h-full flex items-center justify-center text-xl">🛍️</div>
                  </div>
                  <!-- Item details -->
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</p>
                    <p class="text-xs text-gray-400">Qty: {{ item.quantity }} × ₱{{ item.price | number:'1.2-2' }}</p>
                  </div>
                  <!-- Subtotal -->
                  <p class="text-sm font-bold text-gray-900 flex-shrink-0">
                    ₱{{ (item.price * item.quantity) | number:'1.2-2' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Payment & Total -->
            <div class="bg-gray-50 rounded-xl p-4 space-y-2">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">💳 Payment Summary</p>
              <div class="flex justify-between text-sm text-gray-600">
                <span>Payment Method</span>
                <span class="font-medium uppercase">{{ viewingOrder.paymentMethod || 'N/A' }}</span>
              </div>
              <div class="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>₱{{ viewingOrder.subtotal | number:'1.2-2' }}</span>
              </div>
              <div *ngIf="viewingOrder.shippingFee" class="flex justify-between text-sm text-gray-600">
                <span>Shipping Fee</span>
                <span>₱{{ viewingOrder.shippingFee | number:'1.2-2' }}</span>
              </div>
              <div class="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span class="text-orange-600">₱{{ viewingOrder.total | number:'1.2-2' }}</span>
              </div>
            </div>

            <!-- Order Status -->
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-gray-500 uppercase">Current Status</span>
              <span [class]="getStatusClass(viewingOrder.status)"
                    class="px-3 py-1.5 rounded-full text-xs font-semibold border">
                {{ viewingOrder.status | titlecase }}
              </span>
            </div>

          </div>

          <!-- Footer -->
          <div class="p-6 border-t border-gray-200 sticky bottom-0 bg-white rounded-b-2xl">
            <button (click)="viewingOrder = null"
                    class="w-full px-4 py-2.5 bg-gray-900 hover:bg-gray-700 text-white font-semibold rounded-xl text-sm transition">
              Close
            </button>
          </div>
        </div>
      </div>

      <!-- Cancel Request Modal -->
      <div *ngIf="viewingCancel" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
          <div class="text-center mb-4">
            <span class="text-4xl">🚫</span>
            <h3 class="font-bold text-gray-900 mt-3">Cancel Request</h3>
            <p class="text-xs text-gray-400 mt-1">Order #{{ viewingCancel.id?.slice(-8).toUpperCase() }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4 mb-4">
            <p class="text-xs font-semibold text-gray-500 uppercase mb-1">Customer</p>
            <p class="text-sm font-medium text-gray-900">{{ viewingCancel.userName }}</p>
            <p class="text-xs text-gray-500">{{ viewingCancel.userEmail }}</p>
          </div>
          <div class="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
            <p class="text-xs font-semibold text-orange-700 uppercase mb-1">Reason</p>
            <p class="text-sm text-gray-700">{{ viewingCancel.cancelRequest?.reason }}</p>
            <p class="text-xs text-gray-400 mt-2">{{ viewingCancel.cancelRequest?.requestedAt | date:'medium' }}</p>
          </div>
          <div class="flex gap-3">
            <button (click)="viewingCancel = null"
                    class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 text-sm transition">
              Close
            </button>
            <button (click)="handleCancel(viewingCancel, 'reject'); viewingCancel = null"
                    class="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition">
              Reject
            </button>
            <button (click)="handleCancel(viewingCancel, 'approve'); viewingCancel = null"
                    class="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition">
              Approve
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="toast" class="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium z-50">{{ toast }}</div>
    </div>
  `
})
export class ManageOrdersComponent implements OnInit {
  orders: any[] = [];
  loading = true;
  search = '';
  filterStatus = '';
  toast = '';
  viewingCancel: any = null;
  viewingOrder: any = null;
  private searchTimeout: any;

  constructor(private orderService: OrderService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.loadOrders(); }

  loadOrders() {
    this.loading = true;
    this.orderService.getAllOrders({ status: this.filterStatus === 'cancel_requested' ? '' : this.filterStatus, search: this.search }).subscribe({
      next: (orders) => { this.orders = orders; this.loading = false; this.cdr.detectChanges(); },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  get filteredOrders() {
    if (this.filterStatus === 'cancel_requested') {
      return this.orders.filter(o => o.cancelRequest?.status === 'pending');
    }
    return this.orders;
  }

  get pendingCancelCount() {
    return this.orders.filter(o => o.cancelRequest?.status === 'pending').length;
  }

  onSearch() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.loadOrders(), 400);
  }

  viewOrderDetails(order: any) {
    this.viewingOrder = order;
    this.cdr.detectChanges();
  }

  updateStatus(order: any, status: string) {
    const prev = order.status;
    order.status = status;
    this.cdr.detectChanges();
    this.orderService.updateStatus(order.id, status).subscribe({
      next: () => this.showToast('✅ Status updated!'),
      error: () => { order.status = prev; this.showToast('❌ Failed to update'); this.cdr.detectChanges(); }
    });
  }

  viewCancelRequest(order: any) {
    this.viewingCancel = order;
    this.cdr.detectChanges();
  }

  handleCancel(order: any, action: 'approve' | 'reject') {
    this.orderService.handleCancelRequest(order.id, action).subscribe({
      next: () => {
        const o = this.orders.find(x => x.id === order.id);
        if (o) {
          o.cancelRequest = { status: action === 'approve' ? 'approved' : 'rejected' };
          if (action === 'approve') o.status = 'cancelled';
        }
        this.showToast(action === 'approve' ? '✅ Order cancelled!' : '❌ Cancel request rejected');
        this.cdr.detectChanges();
      },
      error: () => this.showToast('❌ Failed to process request')
    });
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

  showToast(msg: string) {
    this.toast = msg;
    this.cdr.detectChanges();
    setTimeout(() => { this.toast = ''; this.cdr.detectChanges(); }, 3000);
  }
}