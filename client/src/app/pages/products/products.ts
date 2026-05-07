import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">All Products</h1>
        <p class="text-gray-500 text-sm mt-1">{{ total }} products available</p>
      </div>

      <!-- Search -->
      <div class="mb-4">
        <input [(ngModel)]="search" (ngModelChange)="onSearch()" type="text" placeholder="Search products..."
               class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"/>
      </div>

      <!-- Category Tabs -->
      <div class="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
        <button (click)="selectCategory('')"
                [class]="selectedCategory === '' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'"
                class="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap">
          🛍️ All
        </button>
        <button *ngFor="let c of categories"
                (click)="selectCategory(c.name)"
                [class]="selectedCategory === c.name ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'"
                class="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap">
          {{ c.icon || '📦' }} {{ c.name }}
        </button>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div *ngFor="let i of [1,2,3,4,5,6,7,8]" class="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
          <div class="h-48 bg-gray-200"></div>
          <div class="p-4 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Products Grid -->
      <div *ngIf="!loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div *ngFor="let product of products"
             class="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition group">
          <a [routerLink]="['/products', product.id]" class="block">
            <div class="relative h-48 bg-gray-100 overflow-hidden">
              <img *ngIf="product.imageUrl" [src]="product.imageUrl" [alt]="product.name"
                   class="w-full h-full object-cover group-hover:scale-105 transition duration-300"/>
              <div *ngIf="!product.imageUrl" class="w-full h-full flex items-center justify-center text-4xl">🛍️</div>
              <span *ngIf="product.stock === 0" class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg font-medium">Out of Stock</span>
            </div>
            <div class="p-4">
              <p class="text-xs text-orange-500 font-medium mb-1">{{ product.categoryName || 'Uncategorized' }}</p>
              <h3 class="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">{{ product.name }}</h3>
              <p class="text-lg font-bold text-gray-900">₱{{ product.price | number:'1.2-2' }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ product.stock }} in stock</p>
            </div>
          </a>
          <div class="px-4 pb-4">
            <button (click)="addToCart(product)" [disabled]="product.stock === 0 || !isLoggedIn || addingIds.has(product.id)"
                    class="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-2 rounded-xl text-sm transition">
              {{ !isLoggedIn ? 'Login to Buy' : product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart' }}
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && products.length === 0" class="text-center py-16">
        <span class="text-5xl">🔍</span>
        <p class="text-gray-500 mt-4">No products found</p>
      </div>

      <div *ngIf="toast" class="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium z-50">
        {{ toast }}
      </div>
    </div>
  `
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  loading = true;
  search = '';
  selectedCategory = '';
  total = 0;
  isLoggedIn = false;
  toast = '';
  addingIds = new Set<string>();
  private searchTimeout: any;

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
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe(cats => {
      this.categories = cats;
      this.cdr.detectChanges();
    });
  }

  loadProducts() {
    this.loading = true;
    this.productService.getAll({ search: this.search, category: this.selectedCategory }).subscribe({
      next: (res) => {
        this.products = res.products || res;
        this.total = res.total || this.products.length;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearch() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.loadProducts(), 400);
  }

  selectCategory(categoryId: string) {
    this.selectedCategory = categoryId;
    this.loadProducts();
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
        this.showToast('❌ Failed to add to cart');
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