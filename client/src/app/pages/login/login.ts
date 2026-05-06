import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <span class="text-4xl">🛍️</span>
          <h1 class="text-2xl font-bold text-gray-900 mt-2">Welcome back</h1>
          <p class="text-gray-500 text-sm mt-1">Sign in to your ShopEase account</p>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-6 text-sm">
            {{ error }}
          </div>
          <div class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input [(ngModel)]="email" type="email" placeholder="you@example.com"
                     class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input [(ngModel)]="password" type="password" placeholder="••••••••"
                     (keyup.enter)="login()"
                     class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"/>
            </div>
            <button (click)="login()" [disabled]="loading"
                    class="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition text-sm">
              {{ loading ? 'Signing in...' : 'Sign In' }}
            </button>
          </div>
          <p class="text-center text-sm text-gray-500 mt-6">
            Don't have an account?
            <a routerLink="/register" class="text-orange-500 font-semibold hover:underline">Register</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

  async login() {
    if (!this.email || !this.password) { this.error = 'Please fill in all fields.'; return; }
    this.loading = true; this.error = '';
    this.cdr.detectChanges();
    try {
      const user = await this.auth.login(this.email, this.password);
      user?.role === 'admin' ? this.router.navigate(['/admin/dashboard']) : this.router.navigate(['/']);
    } catch (e: any) {
      this.error = e?.message?.includes('invalid-credential') ? 'Invalid email or password.' : 'Login failed. Please try again.';
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}