import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <!-- Success State -->
      <div *ngIf="success" class="text-center py-16">
        <div class="text-6xl mb-4">🎉</div>
        <h2 class="text-2xl font-bold text-gray-900">Order Placed!</h2>
        <p class="text-gray-500 mt-2 mb-2">Your order has been confirmed.</p>
        <p class="text-orange-500 text-sm font-medium">Redirecting to your orders in {{ countdown }}s...</p>
        <a routerLink="/my-orders"
           class="mt-6 inline-block bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition">
          View My Orders
        </a>
      </div>

      <div *ngIf="!success" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">

          <!-- Shipping -->
          <div class="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 class="font-bold text-gray-900 mb-4">📦 Shipping Address</h2>
            <div class="space-y-4">
                  <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Full Name <span class="text-red-400">*</span></label>
                <input [(ngModel)]="form.name" (ngModelChange)="fieldErrors.name=''" type="text" placeholder="Juan dela Cruz"
                       [class]="inputClass(!!fieldErrors.name)"/>
                <p *ngIf="fieldErrors.name" class="text-red-500 text-xs mt-1">⚠️ {{ fieldErrors.name }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Phone Number <span class="text-red-400">*</span></label>
                <input [(ngModel)]="form.phone" (ngModelChange)="fieldErrors.phone=''" type="text" 
                       placeholder="09XX XXX XXXX" maxlength="13"
                       [class]="inputClass(!!fieldErrors.phone)"/>
                <p *ngIf="fieldErrors.phone" class="text-red-500 text-xs mt-1">⚠️ {{ fieldErrors.phone }}</p>
                <p *ngIf="!fieldErrors.phone && form.phone" class="text-gray-400 text-xs mt-1">Format: 09XX XXX XXXX or +639XX XXX XXXX</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Delivery Address <span class="text-red-400">*</span></label>
                <textarea [(ngModel)]="form.address" (ngModelChange)="fieldErrors.address=''" rows="3"
                          placeholder="e.g. 123 Rizal St, Barangay Sto. Niño, Cebu City, Cebu"
                          [class]="inputClass(!!fieldErrors.address) + ' resize-none'"></textarea>
                <p *ngIf="fieldErrors.address" class="text-red-500 text-xs mt-1">⚠️ {{ fieldErrors.address }}</p>
                <p *ngIf="!fieldErrors.address" class="text-gray-400 text-xs mt-1">Include street, barangay, city and province</p>
              </div>
            </div>
          </div>

          <!-- Payment -->
          <div class="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 class="font-bold text-gray-900 mb-4">💳 Payment Method</h2>
            <div class="space-y-3">
              <label *ngFor="let method of paymentMethods"
                     class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-orange-50 transition"
                     [class.border-orange-400]="form.paymentMethod === method.value"
                     [class.bg-orange-50]="form.paymentMethod === method.value"
                     [class.border-gray-200]="form.paymentMethod !== method.value">
                <input type="radio" [(ngModel)]="form.paymentMethod" [value]="method.value" class="accent-orange-500"/>
                <span class="text-lg">{{ method.icon }}</span>
                <span class="text-sm font-medium text-gray-700">{{ method.label }}</span>
              </label>
            </div>
          </div>

          <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm flex gap-2">
            <span>⚠️</span><span>{{ error }}</span>
          </div>

          <button (click)="placeOrder()" [disabled]="loading"
                  class="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2">
            <span *ngIf="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {{ loading ? 'Placing Order...' : '✅ Place Order' }}
          </button>
        </div>

        <!-- Order Summary -->
        <div class="bg-white rounded-2xl border border-gray-200 p-6 h-fit sticky top-20">
          <h2 class="font-bold text-gray-900 mb-4">Order Summary</h2>
          <div class="space-y-3 mb-4">
            <div *ngFor="let item of cart?.items" class="flex justify-between text-sm">
              <span class="text-gray-600 truncate flex-1 mr-2">{{ item.name }} × {{ item.quantity }}</span>
              <span class="font-medium flex-shrink-0">₱{{ (item.price * item.quantity) | number:'1.2-2' }}</span>
            </div>
          </div>
          <div class="border-t border-gray-200 pt-3 space-y-1">
            <div class="flex justify-between text-sm text-gray-500">
              <span>Shipping</span><span class="text-green-600 font-medium">Free</span>
            </div>
            <div class="flex justify-between font-bold text-gray-900 text-base">
              <span>Total</span>
              <span>₱{{ cart?.total | number:'1.2-2' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CheckoutComponent implements OnInit {
  cart: any = { items: [], total: 0 };
  loading = false;
  success = false;
  submitted = false;
  error = '';
  countdown = 3;
  form = { name: '', phone: '', address: '', paymentMethod: 'cod' };
  fieldErrors: any = {};
  paymentMethods = [
    { value: 'cod', icon: '💵', label: 'Cash on Delivery' },
    { value: 'gcash', icon: '📱', label: 'GCash' },
    { value: 'bank', icon: '🏦', label: 'Bank Transfer' },
  ];

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const user = this.auth.getCurrentUser();
    if (user) {
      this.form.name = user.name || '';
      this.form.phone = user.phone || '';
      this.form.address = user.address || '';
    }

    // Get selected items from cart page
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state || history.state;

    if (state?.selectedItems?.length) {
      this.cart = { items: state.selectedItems, total: state.total };
      this.cdr.detectChanges();
    } else {
      // Fallback: load full cart
      this.cartService.getCart().subscribe(c => {
        this.cart = c;
        this.cdr.detectChanges();
      });
    }
  }

  inputClass(hasError: boolean) {
    const base = 'w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition ';
    return hasError
      ? base + 'border-red-400 focus:ring-red-300'
      : base + 'border-gray-300 focus:ring-orange-400 focus:border-transparent';
  }

  validate(): boolean {
    this.fieldErrors = {};
    let valid = true;

    if (!this.form.name.trim()) {
      this.fieldErrors.name = 'Full name is required'; valid = false;
    } else if (this.form.name.trim().length < 2) {
      this.fieldErrors.name = 'Name must be at least 2 characters'; valid = false;
    }

    const rawPhone = this.form.phone.replace(/\D/g, '');
    if (!this.form.phone.trim()) {
      this.fieldErrors.phone = 'Phone number is required'; valid = false;
    } else if (rawPhone.length < 10) {
      this.fieldErrors.phone = 'Phone number is too short'; valid = false;
    } else if (!/^(09|\+639|9)\d{9}$/.test(this.form.phone.replace(/\s/g, ''))) {
      this.fieldErrors.phone = 'Enter a valid Philippine number (e.g. 09XX XXX XXXX)'; valid = false;
    }

    if (!this.form.address.trim()) {
      this.fieldErrors.address = 'Delivery address is required'; valid = false;
    } else if (this.form.address.trim().length < 10) {
      this.fieldErrors.address = 'Please enter a complete address (street, barangay, city)'; valid = false;
    } else if (!/[a-zA-Z]{2,}/.test(this.form.address)) {
      this.fieldErrors.address = 'Address must contain valid text'; valid = false;
    }

    if (!this.cart?.items?.length) {
      this.error = 'Your cart is empty'; valid = false;
    }

    return valid;
  }

  placeOrder() {
    this.submitted = true;
    this.error = '';

    if (!this.validate()) {
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    const items = this.cart.items.map((item: any) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      imageUrl: item.imageUrl || ''
    }));

    this.orderService.create({
      items,
      shippingAddress: {
        name: this.form.name.trim(),
        phone: this.form.phone.trim(),
        address: this.form.address.trim()
      },
      paymentMethod: this.form.paymentMethod,
      totalAmount: this.cart.total
    }).subscribe({
      next: () => {
        this.cartService.clearCart().subscribe();
        this.success = true;
        this.loading = false;
        this.cdr.detectChanges();
        const interval = setInterval(() => {
          this.countdown--;
          this.cdr.detectChanges();
          if (this.countdown <= 0) {
            clearInterval(interval);
            this.router.navigate(['/my-orders']);
          }
        }, 1000);
      },
      error: (e: any) => {
        this.error = e?.error?.message || 'Failed to place order. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}