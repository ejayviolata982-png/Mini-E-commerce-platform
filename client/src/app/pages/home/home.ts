import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 flex flex-col sm:flex-row items-center gap-10">
        <div class="flex-1 text-center sm:text-left">
          <span class="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">🎉 New arrivals every week</span>
          <h1 class="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">Shop Smarter,<br>Live Better</h1>
          <p class="text-orange-100 text-lg mb-8 max-w-md">Discover thousands of products at unbeatable prices. Fast delivery, easy returns.</p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
            <a routerLink="/products" class="bg-white text-orange-600 font-bold px-8 py-3 rounded-xl hover:bg-orange-50 transition shadow-lg text-center">Shop Now →</a>
            <a *ngIf="!isLoggedIn" routerLink="/register" class="border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-white/10 transition text-center">Join Free</a>
          </div>
        </div>
        <div class="flex-shrink-0 text-center">
          <div class="w-48 h-48 sm:w-64 sm:h-64 bg-white/20 rounded-3xl flex items-center justify-center text-8xl sm:text-9xl shadow-2xl">🛍️</div>
        </div>
      </div>
    </section>

    <section class="bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-3 gap-4 text-center">
        <div><p class="text-2xl font-extrabold text-gray-900">10K+</p><p class="text-xs text-gray-500 mt-1">Products</p></div>
        <div><p class="text-2xl font-extrabold text-gray-900">50K+</p><p class="text-xs text-gray-500 mt-1">Customers</p></div>
        <div><p class="text-2xl font-extrabold text-gray-900">4.9★</p><p class="text-xs text-gray-500 mt-1">Rating</p></div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-gray-900">Shop by Category</h2>
        <a routerLink="/products" class="text-orange-500 text-sm font-medium hover:underline">View all →</a>
      </div>
      <div *ngIf="loadingCats" class="flex gap-3 overflow-x-auto pb-2">
        <div *ngFor="let i of [1,2,3,4,5]" class="flex-shrink-0 w-28 h-24 bg-gray-200 rounded-2xl animate-pulse"></div>
      </div>
      <div *ngIf="!loadingCats" class="flex gap-3 overflow-x-auto pb-2">
        <a routerLink="/products" class="flex-shrink-0 flex flex-col items-center gap-2 px-5 py-4 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 transition min-w-[90px]">
          <span class="text-2xl">🛍️</span><span class="text-xs font-semibold">All</span>
        </a>
        <a *ngFor="let cat of categories" [routerLink]="['/products']" [queryParams]="{category: cat.id}"
           class="flex-shrink-0 flex flex-col items-center gap-2 px-5 py-4 bg-white border border-gray-200 rounded-2xl hover:border-orange-300 hover:shadow-sm transition min-w-[90px]">
          <span class="text-2xl">{{ cat.icon || '📦' }}</span>
          <span class="text-xs font-semibold text-gray-700 text-center">{{ cat.name }}</span>
        </a>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-gray-900">Featured Products</h2>
        <a routerLink="/products" class="text-orange-500 text-sm font-medium hover:underline">See all →</a>
      </div>
      <div *ngIf="loadingProducts" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div *ngFor="let i of [1,2,3,4]" class="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
      </div>
      <div *ngIf="!loadingProducts" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div *ngFor="let product of featuredProducts" class="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition group">
          <a [routerLink]="['/products', product.id]" class="block">
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img *ngIf="product.imageUrl" [src]="product.imageUrl" [alt]="product.name" class="w-full h-full object-cover group-hover:scale-105 transition duration-300"/>
              <div *ngIf="!product.imageUrl" class="w-full h-full flex items-center justify-center text-4xl">🛍️</div>
            </div>
            <div class="p-3">
              <p class="text-xs text-orange-500 font-medium mb-1">{{ product.categoryName || 'General' }}</p>
              <h3 class="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">{{ product.name }}</h3>
              <p class="text-base font-bold text-gray-900">₱{{ product.price | number:'1.2-2' }}</p>
            </div>
          </a>
          <div class="px-3 pb-3">
            <button (click)="addToCart(product)" [disabled]="product.stock === 0 || !isLoggedIn"
                    class="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-2 rounded-xl text-xs transition">
              {{ !isLoggedIn ? 'Login to Buy' : product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart' }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section *ngIf="!isLoggedIn" class="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
      <div class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 sm:p-12 text-center text-white">
        <h2 class="text-2xl sm:text-3xl font-extrabold mb-3">Ready to start shopping?</h2>
        <p class="text-orange-100 mb-6">Create your free account and get access to exclusive deals.</p>
        <a routerLink="/register" class="inline-block bg-white text-orange-600 font-bold px-8 py-3 rounded-xl hover:bg-orange-50 transition shadow-lg">Get Started Free →</a>
      </div>
    </section>

    <div *ngIf="toast" class="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium z-50">{{ toast }}</div>
  `
})
export class HomeComponent implements OnInit {
  categories: any[] = [];
  featuredProducts: any[] = [];
  loadingCats = true;
  loadingProducts = true;
  isLoggedIn = false;
  toast = '';
  addingIds = new Set<string>();

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.auth.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.cdr.detectChanges();
    });
    this.categoryService.getAll().subscribe({
      next: (cats) => { this.categories = cats.slice(0, 8); this.loadingCats = false; this.cdr.detectChanges(); },
      error: () => { this.loadingCats = false; this.cdr.detectChanges(); }
    });
    this.productService.getAll({ limit: 8 }).subscribe({
      next: (res) => { this.featuredProducts = (res.products || res).slice(0, 8); this.loadingProducts = false; this.cdr.detectChanges(); },
      error: () => { this.loadingProducts = false; this.cdr.detectChanges(); }
    });
  }

  addToCart(product: any) {
    if (this.addingIds.has(product.id)) return;
    this.addingIds.add(product.id);
    this.showToast('✅ Added to cart!');
    this.cdr.detectChanges();

    this.cartService.addToCart({ productId: product.id, quantity: 1 }).subscribe({
      next: () => {
        this.addingIds.delete(product.id);
        this.cdr.detectChanges();
      },
      error: () => {
        this.addingIds.delete(product.id);
        this.showToast('❌ Failed to add');
        this.cdr.detectChanges();
      }
    });
  }

  showToast(msg: string) {
    this.zone.run(() => {
      this.toast = msg;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.toast = '';
        this.cdr.detectChanges();
      }, 2500);
    });
  }
}