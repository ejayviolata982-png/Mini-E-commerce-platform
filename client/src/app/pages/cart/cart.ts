import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">🛒 Shopping Cart</h1>
        <span *ngIf="cart?.items?.length > 0" class="text-sm text-gray-500">{{ cart.items.length }} item(s)</span>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="space-y-4">
        <div *ngFor="let i of [1,2,3]" class="h-24 bg-gray-200 rounded-2xl animate-pulse"></div>
      </div>

      <!-- Empty -->
      <div *ngIf="!loading && cart?.items?.length === 0" class="text-center py-16">
        <span class="text-5xl">🛒</span>
        <p class="text-gray-500 mt-4 text-lg">Your cart is empty</p>
        <a routerLink="/products" class="mt-4 inline-block bg-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-orange-600 transition text-sm">
          Browse Products
        </a>
      </div>

      <div *ngIf="!loading && cart?.items?.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-3">

          <!-- Select All -->
          <div class="flex items-center gap-3 px-2 pb-2 border-b border-gray-100">
            <input type="checkbox" [checked]="allSelected" (change)="toggleAll($event)"
                   class="w-4 h-4 accent-orange-500 cursor-pointer"/>
            <span class="text-sm font-medium text-gray-600">Select All</span>
            <span class="ml-auto text-xs text-gray-400">{{ selectedCount }} selected</span>
          </div>

          <!-- Cart Items -->
          <div *ngFor="let item of cart.items"
               class="bg-white rounded-2xl border transition"
               [class.border-orange-300]="isSelected(item)"
               [class.border-gray-200]="!isSelected(item)">
            <div class="p-4 flex gap-3 items-start">

              <!-- Checkbox -->
              <div class="pt-1">
                <input type="checkbox" [checked]="isSelected(item)" (change)="toggleItem(item, $event)"
                       class="w-4 h-4 accent-orange-500 cursor-pointer"/>
              </div>

              <!-- Image -->
              <div class="w-18 h-18 w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                <img *ngIf="item.imageUrl" [src]="item.imageUrl" [alt]="item.name" class="w-full h-full object-cover"/>
                <div *ngIf="!item.imageUrl" class="w-full h-full flex items-center justify-center text-2xl">🛍️</div>
              </div>

              <!-- Details -->
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-900 text-sm truncate">{{ item.name }}</h3>
                <p class="text-orange-500 font-bold mt-0.5">₱{{ item.price | number:'1.2-2' }}</p>
                <div class="flex items-center gap-2 mt-2">
                  <button (click)="decrement(item)"
                          class="w-7 h-7 border border-gray-300 rounded-lg hover:bg-gray-100 font-bold flex items-center justify-center transition active:scale-95 text-sm">−</button>
                  <span class="text-sm font-semibold w-6 text-center">{{ item.quantity }}</span>
                  <button (click)="increment(item)"
                          class="w-7 h-7 border border-gray-300 rounded-lg hover:bg-gray-100 font-bold flex items-center justify-center transition active:scale-95 text-sm">+</button>
                  <button (click)="removeItem(item)"
                          class="ml-2 text-red-400 hover:text-red-600 text-xs font-medium transition">Remove</button>
                </div>
              </div>

              <!-- Subtotal -->
              <div class="text-right flex-shrink-0">
                <p class="font-bold text-gray-900 text-sm">₱{{ (item.price * item.quantity) | number:'1.2-2' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="bg-white rounded-2xl border border-gray-200 p-6 h-fit sticky top-20">
          <h2 class="font-bold text-gray-900 text-lg mb-4">Order Summary</h2>

          <!-- Selected items breakdown -->
          <div class="space-y-2 mb-3">
            <div *ngFor="let item of selectedItems" class="flex justify-between text-xs text-gray-500">
              <span class="truncate flex-1 mr-2">{{ item.name }} ×{{ item.quantity }}</span>
              <span>₱{{ (item.price * item.quantity) | number:'1.2-2' }}</span>
            </div>
          </div>

          <div *ngIf="selectedItems.length === 0" class="text-center py-4 text-gray-400 text-sm">
            No items selected
          </div>

          <div class="border-t border-gray-100 pt-3 space-y-2 text-sm text-gray-600 mb-4">
            <div class="flex justify-between">
              <span>Items ({{ selectedCount }})</span>
              <span>₱{{ selectedTotal | number:'1.2-2' }}</span>
            </div>
            <div class="flex justify-between">
              <span>Shipping</span>
              <span class="text-green-600 font-medium">Free</span>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-3 mb-4">
            <div class="flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span>₱{{ selectedTotal | number:'1.2-2' }}</span>
            </div>
          </div>

          <button (click)="checkout()" [disabled]="selectedCount === 0"
                  class="block w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-center transition text-sm">
            {{ selectedCount === 0 ? 'Select items to checkout' : 'Proceed to Checkout →' }}
          </button>
          <a routerLink="/products"
             class="block w-full text-center text-gray-500 hover:text-gray-700 text-sm font-medium mt-3 transition">
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
  `
})
export class CartComponent implements OnInit {
  cart: any = { items: [], total: 0 };
  loading = true;
  selectedIds = new Set<string>();

  constructor(
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.cartService.getCart().subscribe({
      next: (c) => {
        this.cart = c;
        // Select all by default
        this.selectedIds = new Set(c?.items?.map((i: any) => i.productId) || []);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  isSelected(item: any) { return this.selectedIds.has(item.productId); }

  get allSelected() {
    return this.cart?.items?.length > 0 &&
      this.cart.items.every((i: any) => this.selectedIds.has(i.productId));
  }

  get selectedItems() {
    return (this.cart?.items || []).filter((i: any) => this.selectedIds.has(i.productId));
  }

  get selectedCount() { return this.selectedItems.length; }

  get selectedTotal() {
    return this.selectedItems.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0);
  }

  toggleAll(event: any) {
    if (event.target.checked) {
      this.selectedIds = new Set(this.cart.items.map((i: any) => i.productId));
    } else {
      this.selectedIds = new Set();
    }
    this.cdr.detectChanges();
  }

  toggleItem(item: any, event: any) {
    if (event.target.checked) {
      this.selectedIds.add(item.productId);
    } else {
      this.selectedIds.delete(item.productId);
    }
    this.cdr.detectChanges();
  }

  increment(item: any) {
    item.quantity += 1;
    this.recalcTotal();
    this.cdr.detectChanges();
    this.cartService.updateItem(item.productId, item.quantity).subscribe({
      next: (c) => { this.cart = c; this.cdr.detectChanges(); },
      error: () => { item.quantity -= 1; this.recalcTotal(); this.cdr.detectChanges(); }
    });
  }

  decrement(item: any) {
    if (item.quantity <= 1) { this.removeItem(item); return; }
    item.quantity -= 1;
    this.recalcTotal();
    this.cdr.detectChanges();
    this.cartService.updateItem(item.productId, item.quantity).subscribe({
      next: (c) => { this.cart = c; this.cdr.detectChanges(); },
      error: () => { item.quantity += 1; this.recalcTotal(); this.cdr.detectChanges(); }
    });
  }

  removeItem(item: any) {
    this.selectedIds.delete(item.productId);
    this.cart.items = this.cart.items.filter((i: any) => i.productId !== item.productId);
    this.recalcTotal();
    this.cdr.detectChanges();
    this.cartService.updateItem(item.productId, 0).subscribe({
      next: (c) => { this.cart = c; this.cdr.detectChanges(); },
      error: () => { this.cart.items.push(item); this.recalcTotal(); this.cdr.detectChanges(); }
    });
  }

  recalcTotal() {
    this.cart.total = this.cart.items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0);
  }

  checkout() {
    if (this.selectedCount === 0) return;
    // Pass selected items to checkout via state
    this.router.navigate(['/checkout'], {
      state: { selectedItems: this.selectedItems, total: this.selectedTotal }
    });
  }
}