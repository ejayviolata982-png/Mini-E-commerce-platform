import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-manage-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Categories</h1>
          <p class="text-gray-500 text-sm mt-1">{{ categories.length }} categories</p>
        </div>
        <button (click)="openModal()"
                class="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition shadow-sm">
          + Add Category
        </button>
      </div>

      <div *ngIf="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div *ngFor="let i of [1,2,3,4,5,6]" class="h-24 bg-gray-200 rounded-2xl animate-pulse"></div>
      </div>

      <div *ngIf="!loading" class="space-y-4">
        <div *ngFor="let cat of categories"
             class="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-sm transition">

          <!-- Category Header -->
          <div class="p-5 flex items-center justify-between">
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <div class="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                {{ cat.icon || '📦' }}
              </div>
              <div class="min-w-0">
                <p class="font-semibold text-gray-900">{{ cat.name }}</p>
                <p class="text-xs text-gray-400">{{ cat.description || 'No description' }}</p>
              </div>
            </div>

            <div class="flex items-center gap-2 flex-shrink-0 ml-3">
              <!-- Product count badge -->
              <span class="text-xs font-semibold px-2.5 py-1 bg-orange-50 text-orange-600 border border-orange-200 rounded-full">
                {{ getProductCount(cat.id) }} products
              </span>

              <!-- Expand button -->
              <button (click)="toggleExpand(cat.id)"
                      class="text-gray-400 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition text-lg">
                {{ expandedCat === cat.id ? '▲' : '▼' }}
              </button>

              <button (click)="openModal(cat)"
                      class="text-blue-500 hover:text-blue-700 text-xs font-medium px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition">Edit</button>
              <button (click)="confirmDelete(cat)"
                      class="text-red-500 hover:text-red-700 text-xs font-medium px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition">Delete</button>
            </div>
          </div>

          <!-- Expanded Product List -->
          <div *ngIf="expandedCat === cat.id" class="border-t border-gray-100">

            <!-- Loading products -->
            <div *ngIf="loadingProducts[cat.id]" class="p-4 space-y-2">
              <div *ngFor="let i of [1,2,3]" class="h-12 bg-gray-100 rounded-xl animate-pulse"></div>
            </div>

            <!-- Products list -->
            <div *ngIf="!loadingProducts[cat.id]">
              <div *ngIf="getCategoryProducts(cat.id).length === 0" class="p-6 text-center">
                <span class="text-3xl">🛍️</span>
                <p class="text-gray-400 text-sm mt-2">No products in this category</p>
              </div>

              <div *ngIf="getCategoryProducts(cat.id).length > 0">
                <!-- Products table header -->
                <div class="px-4 py-2 bg-gray-50 grid grid-cols-12 gap-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <div class="col-span-5">Product</div>
                  <div class="col-span-2">Price</div>
                  <div class="col-span-2">Stock</div>
                  <div class="col-span-3">Status</div>
                </div>

                <div *ngFor="let product of getCategoryProducts(cat.id)"
                     class="px-4 py-3 grid grid-cols-12 gap-3 items-center border-t border-gray-50 hover:bg-gray-50 transition">
                  <!-- Image + Name -->
                  <div class="col-span-5 flex items-center gap-3 min-w-0">
                    <div class="w-9 h-9 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img *ngIf="product.imageUrl" [src]="product.imageUrl" [alt]="product.name"
                           class="w-full h-full object-cover"/>
                      <div *ngIf="!product.imageUrl" class="w-full h-full flex items-center justify-center text-base">🛍️</div>
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">{{ product.name }}</p>
                      <p class="text-xs text-gray-400 truncate">{{ product.description }}</p>
                    </div>
                  </div>

                  <!-- Price -->
                  <div class="col-span-2 text-sm font-bold text-gray-900">
                    ₱{{ product.price | number:'1.2-2' }}
                  </div>

                  <!-- Stock -->
                  <div class="col-span-2">
                    <span [class]="product.stock > 10 ? 'text-green-600 bg-green-50' : product.stock > 0 ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50'"
                          class="px-2 py-0.5 rounded-full text-xs font-semibold">
                      {{ product.stock }}
                    </span>
                  </div>

                  <!-- Status -->
                  <div class="col-span-3">
                    <span [class]="getProductStatusClass(product.status)"
                          class="px-2 py-0.5 rounded-full text-xs font-semibold border">
                      {{ product.status?.replace('_', ' ') | titlecase }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="categories.length === 0" class="text-center py-12">
          <span class="text-4xl">📁</span>
          <p class="text-gray-500 mt-3">No categories yet</p>
        </div>
      </div>

      <!-- Toast -->
      <div *ngIf="toast" class="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium z-50">{{ toast }}</div>

      <!-- Modal -->
      <div *ngIf="showModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 class="font-bold text-gray-900 text-lg">{{ editingCat ? 'Edit Category' : 'Add Category' }}</h2>
            <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition">×</button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Category Name *</label>
              <input [(ngModel)]="form.name" type="text" placeholder="e.g. Electronics"
                     class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Icon (emoji)</label>
              <input [(ngModel)]="form.icon" type="text" placeholder="e.g. 💻"
                     class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <input [(ngModel)]="form.description" type="text" placeholder="Short description"
                     class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"/>
            </div>
            <div *ngIf="formError" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{{ formError }}</div>
          </div>
          <div class="flex gap-3 p-6 border-t border-gray-200">
            <button (click)="closeModal()" class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 text-sm transition">Cancel</button>
            <button (click)="save()" [disabled]="saving"
                    class="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition">
              {{ saving ? 'Saving...' : (editingCat ? 'Update' : 'Create') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Confirm -->
      <div *ngIf="deleteTarget" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
          <span class="text-4xl">🗑️</span>
          <h3 class="font-bold text-gray-900 mt-3">Delete Category?</h3>
          <p class="text-gray-500 text-sm mt-1">Delete <strong>{{ deleteTarget.name }}</strong>? Products in this category will not be deleted.</p>
          <div class="flex gap-3 mt-5">
            <button (click)="deleteTarget = null" class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 text-sm transition">Cancel</button>
            <button (click)="deleteCategory()" [disabled]="deleting"
                    class="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition">
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ManageCategoriesComponent implements OnInit {
  categories: any[] = [];
  allProducts: any[] = [];
  loading = true;
  loadingProducts: { [key: string]: boolean } = {};
  expandedCat: string | null = null;
  showModal = false;
  editingCat: any = null;
  deleteTarget: any = null;
  saving = false;
  deleting = false;
  toast = '';
  formError = '';
  form: any = { name: '', icon: '', description: '' };

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.categoryService.getAll().subscribe({
      next: (cats) => {
        this.categories = cats;
        this.loading = false;
        this.cdr.detectChanges();
        // Pre-load all products once
        this.productService.getAll({ limit: 1000 }).subscribe({
          next: (res) => {
            this.allProducts = res.products || res;
            this.cdr.detectChanges();
          }
        });
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  toggleExpand(catId: string) {
    this.expandedCat = this.expandedCat === catId ? null : catId;
    this.cdr.detectChanges();
  }

  getCategoryProducts(catId: string): any[] {
    return this.allProducts.filter(p => p.categoryId === catId);
  }

  getProductCount(catId: string): number {
    return this.getCategoryProducts(catId).length;
  }

  getProductStatusClass(status: string) {
    const map: any = {
      available: 'bg-green-50 text-green-700 border-green-200',
      low_stock: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      out_of_stock: 'bg-red-50 text-red-700 border-red-200',
    };
    return map[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  }

  openModal(cat?: any) {
    this.editingCat = cat || null;
    this.formError = '';
    this.form = cat
      ? { name: cat.name, icon: cat.icon || '', description: cat.description || '' }
      : { name: '', icon: '', description: '' };
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal() { this.showModal = false; this.editingCat = null; this.cdr.detectChanges(); }

  save() {
    if (!this.form.name) { this.formError = 'Category name is required.'; this.cdr.detectChanges(); return; }
    this.saving = true;
    this.cdr.detectChanges();
    const obs = this.editingCat
      ? this.categoryService.update(this.editingCat.id, this.form)
      : this.categoryService.create(this.form);
    obs.subscribe({
      next: () => {
        this.closeModal();
        this.load();
        this.showToast(this.editingCat ? '✅ Updated!' : '✅ Created!');
        this.saving = false;
        this.cdr.detectChanges();
      },
      error: (e: any) => { this.formError = e?.error?.message || 'Save failed.'; this.saving = false; this.cdr.detectChanges(); }
    });
  }

  confirmDelete(cat: any) { this.deleteTarget = cat; this.cdr.detectChanges(); }

  deleteCategory() {
    this.deleting = true;
    this.cdr.detectChanges();
    this.categoryService.delete(this.deleteTarget.id).subscribe({
      next: () => {
        this.deleteTarget = null;
        this.deleting = false;
        this.load();
        this.showToast('🗑️ Deleted!');
      },
      error: () => { this.deleting = false; this.cdr.detectChanges(); }
    });
  }

  showToast(msg: string) {
    this.toast = msg;
    this.cdr.detectChanges();
    setTimeout(() => { this.toast = ''; this.cdr.detectChanges(); }, 3000);
  }
}