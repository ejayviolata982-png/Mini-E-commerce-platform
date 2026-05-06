import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Products</h1>
          <p class="text-gray-500 text-sm mt-1">{{ total }} products total</p>
        </div>
        <button (click)="openModal()"
                class="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition shadow-sm">
          + Add Product
        </button>
      </div>

      <!-- Filters -->
      <div class="flex flex-col sm:flex-row gap-3 mb-6">
        <input [(ngModel)]="search" (ngModelChange)="onSearch()" type="text" placeholder="Search products..."
               class="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"/>
        <select [(ngModel)]="filterCategory" (ngModelChange)="loadProducts()"
                class="px-4 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400">
          <option value="">All Categories</option>
          <option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</option>
        </select>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div *ngIf="loading" class="p-8 space-y-3">
          <div *ngFor="let i of [1,2,3,4,5]" class="h-14 bg-gray-100 rounded-xl animate-pulse"></div>
        </div>

        <div *ngIf="!loading" class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Category</th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Stock</th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr *ngFor="let p of products" class="hover:bg-gray-50 transition">
                <td class="py-3 px-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                      <img *ngIf="p.imageUrl" [src]="p.imageUrl" [alt]="p.name" class="w-full h-full object-cover"/>
                      <div *ngIf="!p.imageUrl" class="w-full h-full flex items-center justify-center text-lg">🛍️</div>
                    </div>
                    <div class="min-w-0">
                      <p class="font-semibold text-gray-900 truncate max-w-40">{{ p.name }}</p>
                      <p class="text-xs text-gray-400 truncate max-w-40">{{ p.description }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600 hidden sm:table-cell">{{ p.categoryName || '—' }}</td>
                <td class="py-3 px-4 font-bold text-gray-900">₱{{ p.price | number:'1.2-2' }}</td>
                <td class="py-3 px-4 hidden md:table-cell">
                  <span [class]="p.stock > 10 ? 'text-green-600 bg-green-50' : p.stock > 0 ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50'"
                        class="px-2 py-1 rounded-full text-xs font-semibold">
                    {{ p.stock }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <div class="flex items-center gap-2">
                    <button (click)="openModal(p)"
                            class="text-blue-500 hover:text-blue-700 font-medium text-xs px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition">Edit</button>
                    <button (click)="confirmDelete(p)"
                            class="text-red-500 hover:text-red-700 font-medium text-xs px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="products.length === 0" class="text-center py-12">
            <span class="text-4xl">🛍️</span>
            <p class="text-gray-500 mt-3">No products found</p>
          </div>
        </div>
      </div>

      <!-- Toast -->
      <div *ngIf="toast" class="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium z-50">{{ toast }}</div>

      <!-- Modal -->
      <div *ngIf="showModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 class="font-bold text-gray-900 text-lg">{{ editingProduct ? 'Edit Product' : 'Add Product' }}</h2>
            <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition">×</button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
              <input [(ngModel)]="form.name" type="text" placeholder="e.g. iPhone 15 Pro"
                     class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"/>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Price (₱) *</label>
                <input [(ngModel)]="form.price" type="number" placeholder="0.00"
                       class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"/>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Stock *</label>
                <input [(ngModel)]="form.stock" type="number" placeholder="0"
                       class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"/>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select [(ngModel)]="form.categoryId"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value="">Select category</option>
                <option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea [(ngModel)]="form.description" rows="3" placeholder="Product description..."
                        class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label>
              <input [(ngModel)]="form.imageUrl" type="text" placeholder="https://example.com/image.jpg"
                     class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"/>
              <div *ngIf="form.imageUrl" class="mt-3">
                <img [src]="form.imageUrl" class="h-24 w-24 object-cover rounded-xl border border-gray-200"
                     (error)="form.imageUrl = ''"/>
              </div>
            </div>
            <div *ngIf="formError" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{{ formError }}</div>
          </div>
          <div class="flex gap-3 p-6 border-t border-gray-200">
            <button (click)="closeModal()" class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 text-sm transition">
              Cancel
            </button>
            <button (click)="saveProduct()" [disabled]="saving"
                    class="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition">
              {{ saving ? 'Saving...' : (editingProduct ? 'Update' : 'Create') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Confirm -->
      <div *ngIf="deleteTarget" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
          <div class="text-center mb-4">
            <span class="text-4xl">🗑️</span>
            <h3 class="font-bold text-gray-900 mt-3">Delete Product?</h3>
            <p class="text-gray-500 text-sm mt-1">Are you sure you want to delete <strong>{{ deleteTarget.name }}</strong>? This cannot be undone.</p>
          </div>
          <div class="flex gap-3">
            <button (click)="deleteTarget = null" class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 text-sm transition">Cancel</button>
            <button (click)="deleteProduct()" [disabled]="deleting"
                    class="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition">
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ManageProductsComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  loading = true;
  total = 0;
  search = '';
  filterCategory = '';
  showModal = false;
  editingProduct: any = null;
  deleteTarget: any = null;
  saving = false;
  deleting = false;
  toast = '';
  formError = '';
  form: any = { name: '', price: '', stock: '', categoryId: '', description: '', imageUrl: '' };
  private searchTimeout: any;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.categoryService.getAll().subscribe(cats => {
      this.categories = cats;
      this.cdr.detectChanges();
    });
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;

    this.productService.getAll({ search: this.search }).subscribe({
      next: (res) => {
        let products: any[] = res.products || res;
        // Filter by category name locally (more reliable than categoryId)
        if (this.filterCategory) {
          const categoryName = this.categories.find((c: any) => c.id === this.filterCategory)?.name;
          if (categoryName) {
            products = products.filter((p: any) => p.categoryName === categoryName);
          }
        }
        this.products = products;
        this.total = products.length;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  onSearch() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.loadProducts(), 400);
  }

  openModal(product?: any) {
    this.editingProduct = product || null;
    this.formError = '';
    this.form = product
      ? { name: product.name, price: product.price, stock: product.stock, categoryId: product.categoryId || '', description: product.description || '', imageUrl: product.imageUrl || '' }
      : { name: '', price: '', stock: '', categoryId: '', description: '', imageUrl: '' };
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal() {
    this.showModal = false;
    this.editingProduct = null;
    this.cdr.detectChanges();
  }

  saveProduct() {
    if (!this.form.name || !this.form.price || this.form.stock === '') {
      this.formError = 'Name, price, and stock are required.';
      this.cdr.detectChanges();
      return;
    }
    this.saving = true; this.formError = '';
    this.cdr.detectChanges();

    const payload = {
      name: this.form.name,
      price: Number(this.form.price),
      stock: Number(this.form.stock),
      categoryId: this.form.categoryId,
      categoryName: this.categories.find((c: any) => c.id === this.form.categoryId)?.name || '',
      description: this.form.description || '',
      imageUrl: this.form.imageUrl || ''
    };

    const obs = this.editingProduct
      ? this.productService.update(this.editingProduct.id, payload)
      : this.productService.create(payload);

    obs.subscribe({
      next: () => {
        this.closeModal();
        this.loadProducts();
        this.showToast(this.editingProduct ? '✅ Product updated!' : '✅ Product created!');
        this.saving = false;
        this.cdr.detectChanges();
      },
      error: (e: any) => {
        this.formError = e?.error?.message || 'Save failed.';
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  confirmDelete(product: any) {
    this.deleteTarget = product;
    this.cdr.detectChanges();
  }

  deleteProduct() {
    if (!this.deleteTarget) return;
    this.deleting = true;
    this.cdr.detectChanges();
    this.productService.delete(this.deleteTarget.id).subscribe({
      next: () => {
        this.deleteTarget = null;
        this.deleting = false;
        this.loadProducts();
        this.showToast('🗑️ Product deleted!');
      },
      error: () => {
        this.deleting = false;
        this.cdr.detectChanges();
      }
    });
  }

  showToast(msg: string) {
    this.toast = msg;
    this.cdr.detectChanges();
    setTimeout(() => { this.toast = ''; this.cdr.detectChanges(); }, 3000);
  }
}