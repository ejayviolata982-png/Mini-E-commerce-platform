import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <a routerLink="/products" class="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm mb-6 transition">
        ← Back to Products
      </a>

      <div *ngIf="loading" class="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="h-80 bg-gray-200 rounded-2xl"></div>
        <div class="space-y-4">
          <div class="h-8 bg-gray-200 rounded w-3/4"></div>
          <div class="h-6 bg-gray-200 rounded w-1/4"></div>
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>

      <div *ngIf="error" class="text-center py-16">
        <span class="text-5xl">⚠️</span>
        <p class="text-gray-700 font-semibold mt-4">Failed to load product</p>
        <p class="text-gray-400 text-sm mt-1">The server may be waking up. Please try again.</p>
        <button (click)="retry()" class="mt-4 px-6 py-2 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition">
          🔄 Retry
        </button>
        <a routerLink="/products" class="block text-orange-500 font-medium hover:underline mt-3">← Back to Products</a>
      </div>

      <div *ngIf="!loading && !error && product" class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <img *ngIf="product.imageUrl" [src]="product.imageUrl" [alt]="product.name" class="w-full h-80 object-cover"/>
          <div *ngIf="!product.imageUrl" class="w-full h-80 flex items-center justify-center text-6xl bg-gray-50">🛍️</div>
        </div>

        <div class="space-y-4">
          <div>
            <p class="text-sm text-orange-500 font-medium mb-1">{{ product.categoryName || 'Uncategorized' }}</p>
            <h1 class="text-2xl font-bold text-gray-900">{{ product.name }}</h1>
          </div>
          <p class="text-3xl font-bold text-gray-900">₱{{ product.price | number:'1.2-2' }}</p>
          <p class="text-gray-600 text-sm leading-relaxed">{{ product.description }}</p>

          <div class="flex items-center gap-2">
            <span [class]="product.stock > 0 ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200'"
                  class="px-3 py-1 rounded-full text-xs font-medium border">
              {{ product.stock > 0 ? product.stock + ' in stock' : 'Out of Stock' }}
            </span>
          </div>

          <div *ngIf="product.stock > 0" class="flex items-center gap-3">
            <label class="text-sm font-medium text-gray-700">Qty:</label>
            <div class="flex items-center border border-gray-300 rounded-xl overflow-hidden">
              <button (click)="qty > 1 ? qty = qty - 1 : null" class="px-3 py-2 hover:bg-gray-100 text-gray-700 font-bold transition">−</button>
              <span class="px-4 py-2 text-sm font-semibold border-x border-gray-300">{{ qty }}</span>
              <button (click)="qty < product.stock ? qty = qty + 1 : null" class="px-3 py-2 hover:bg-gray-100 text-gray-700 font-bold transition">+</button>
            </div>
          </div>

          <button (click)="addToCart()" [disabled]="product.stock === 0 || !isLoggedIn || adding"
                  class="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 rounded-xl transition">
            {{ !isLoggedIn ? '🔒 Login to Purchase' : adding ? 'Adding...' : '🛒 Add to Cart' }}
          </button>

          <div *ngIf="toast" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
            {{ toast }}
          </div>
        </div>
      </div>

      <div *ngIf="!loading && !error && !product" class="text-center py-16">
        <span class="text-5xl">😕</span>
        <p class="text-gray-500 mt-4">Product not found</p>
        <a routerLink="/products" class="text-orange-500 font-medium hover:underline mt-2 inline-block">Browse Products</a>
      </div>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  product: any = null;
  loading = true;
  error = false;
  qty = 1;
  adding = false;
  toast = '';
  isLoggedIn = false;
  private productId = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.auth.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.loadProduct();
  }

  loadProduct() {
    this.loading = true;
    this.error = false;
    this.productService.getById(this.productId).subscribe({
      next: (p) => { this.product = p; this.loading = false; },
      error: () => { this.loading = false; this.error = true; }
    });
  }

  retry() {
    this.loadProduct();
  }

  addToCart() {
    this.adding = true;
    this.cartService.addToCart({ productId: this.product.id, quantity: this.qty }).subscribe({
      next: () => { this.toast = '✅ Added to cart!'; this.adding = false; setTimeout(() => this.toast = '', 2500); },
      error: () => { this.toast = '❌ Failed'; this.adding = false; }
    });
  }
}