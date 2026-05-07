import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="bg-gray-900 text-gray-300 mt-0">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <div class="flex items-center gap-2 mb-3">
              <span class="text-2xl">🛍️</span>
              <span class="text-xl font-bold text-white">Discart</span>
            </div>
            <p class="text-gray-400 text-sm leading-relaxed">
              Your one-stop shop for quality products at great prices.
            </p>
          </div>
          <div>
            <h3 class="text-white font-semibold text-sm mb-3 uppercase tracking-wide">Quick Links</h3>
            <ul class="space-y-2">
              <li><a routerLink="/" class="text-gray-400 hover:text-white text-sm transition">🏠 Home</a></li>
              <li><a routerLink="/products" class="text-gray-400 hover:text-white text-sm transition">🛍️ Products</a></li>
              <li><a routerLink="/cart" class="text-gray-400 hover:text-white text-sm transition">🛒 Cart</a></li>
              <li><a routerLink="/my-orders" class="text-gray-400 hover:text-white text-sm transition">📦 My Orders</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-semibold text-sm mb-3 uppercase tracking-wide">Contact</h3>
            <ul class="space-y-2 text-sm text-gray-400">
              <li class="flex items-center gap-2"><span>📧</span> ejviolata@gmail.com</li>
              <li class="flex items-center gap-2"><span>📞</span> +63 9687456364</li>
              <li class="flex items-center gap-2"><span>📍</span> Barotac, Nuevo</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="border-t border-gray-800">
        <div class="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p class="text-gray-500 text-xs sm:text-sm">© 2026 Discart. All rights reserved.</p>
          <p class="text-gray-600 text-xs">Built with Angular + Firebase + Node.js</p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
