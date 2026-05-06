import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <span class="text-4xl">🛍️</span>
          <h1 class="text-2xl font-bold text-gray-900 mt-2">Create account</h1>
          <p class="text-gray-500 text-sm mt-1">Join ShopEase today</p>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <!-- Error / Success -->
          <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-6 text-sm flex gap-2 items-start">
            <span>⚠️</span><span>{{ error }}</span>
          </div>
          <div *ngIf="success" class="bg-green-50 border border-green-200 text-green-600 rounded-xl px-4 py-3 mb-6 text-sm flex gap-2 items-start">
            <span>✅</span><span>{{ success }}</span>
          </div>

          <div class="space-y-4">

            <!-- Full Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Full Name <span class="text-red-400">*</span></label>
              <input [(ngModel)]="form.name" (ngModelChange)="clearFieldError('name')" type="text" placeholder="Juan dela Cruz"
                     [class]="inputClass(fieldErrors.name)"/>
              <p *ngIf="fieldErrors.name" class="text-red-500 text-xs mt-1">{{ fieldErrors.name }}</p>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Email <span class="text-red-400">*</span></label>
              <input [(ngModel)]="form.email" (ngModelChange)="clearFieldError('email')" type="email" placeholder="you@example.com"
                     [class]="inputClass(fieldErrors.email)"/>
              <p *ngIf="fieldErrors.email" class="text-red-500 text-xs mt-1">{{ fieldErrors.email }}</p>
            </div>

            <!-- Phone Number -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Phone Number <span class="text-red-400">*</span></label>
              <div class="flex gap-2">
                <span class="px-3 py-3 bg-gray-100 border border-gray-300 rounded-xl text-sm text-gray-600 font-medium">+63</span>
                <input [(ngModel)]="form.phone" (ngModelChange)="onPhoneChange()" type="tel" placeholder="9XX XXX XXXX"
                       maxlength="10" [class]="inputClass(fieldErrors.phone) + ' flex-1'"/>
              </div>
              <p *ngIf="fieldErrors.phone" class="text-red-500 text-xs mt-1">{{ fieldErrors.phone }}</p>
              <p *ngIf="!fieldErrors.phone && form.phone.length > 0" class="text-gray-400 text-xs mt-1">{{ form.phone.length }}/10 digits</p>
            </div>

            <!-- Gender + Age row -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Gender <span class="text-red-400">*</span></label>
                <select [(ngModel)]="form.gender" (ngModelChange)="clearFieldError('gender')"
                        [class]="inputClass(fieldErrors.gender) + ' bg-white'">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not">Prefer not to say</option>
                </select>
                <p *ngIf="fieldErrors.gender" class="text-red-500 text-xs mt-1">{{ fieldErrors.gender }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Age <span class="text-red-400">*</span></label>
                <input [(ngModel)]="form.age" (ngModelChange)="onAgeChange()" type="number" placeholder="18" min="13" max="120"
                       [class]="inputClass(fieldErrors.age)"/>
                <p *ngIf="fieldErrors.age" class="text-red-500 text-xs mt-1">{{ fieldErrors.age }}</p>
              </div>
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Password <span class="text-red-400">*</span></label>
              <div class="relative">
                <input [(ngModel)]="form.password" (ngModelChange)="onPasswordChange()" [type]="showPassword ? 'text' : 'password'"
                       placeholder="Create a strong password" [class]="inputClass(fieldErrors.password) + ' pr-10'"/>
                <button type="button" (click)="showPassword = !showPassword"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>

              <!-- Password strength bar -->
              <div *ngIf="form.password.length > 0" class="mt-2">
                <div class="flex gap-1 mb-1">
                  <div *ngFor="let i of [1,2,3,4]"
                       [class]="'h-1.5 flex-1 rounded-full transition-all ' + getStrengthBarColor(i)"></div>
                </div>
                <p [class]="'text-xs font-medium ' + strengthTextColor">
                  {{ strengthLabel }} password
                </p>
                <ul class="mt-1.5 space-y-0.5">
                  <li *ngFor="let tip of passwordTips" class="text-xs flex gap-1.5 items-center"
                      [class]="tip.met ? 'text-green-600' : 'text-gray-400'">
                    <span>{{ tip.met ? '✓' : '○' }}</span>{{ tip.label }}
                  </li>
                </ul>
              </div>
              <p *ngIf="fieldErrors.password" class="text-red-500 text-xs mt-1">{{ fieldErrors.password }}</p>
            </div>

            <!-- Confirm Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password <span class="text-red-400">*</span></label>
              <div class="relative">
                <input [(ngModel)]="form.confirmPassword" (ngModelChange)="clearFieldError('confirmPassword')"
                       [type]="showConfirm ? 'text' : 'password'" placeholder="Repeat your password"
                       [class]="inputClass(fieldErrors.confirmPassword) + ' pr-10'"/>
                <button type="button" (click)="showConfirm = !showConfirm"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">
                  {{ showConfirm ? '🙈' : '👁️' }}
                </button>
              </div>
              <p *ngIf="fieldErrors.confirmPassword" class="text-red-500 text-xs mt-1">{{ fieldErrors.confirmPassword }}</p>
              <p *ngIf="!fieldErrors.confirmPassword && form.confirmPassword && form.confirmPassword === form.password"
                 class="text-green-600 text-xs mt-1">✓ Passwords match</p>
            </div>

            <!-- Terms -->
            <div class="flex items-start gap-2.5">
              <input [(ngModel)]="form.agreed" type="checkbox" id="terms"
                     class="mt-0.5 w-4 h-4 text-orange-500 border-gray-300 rounded accent-orange-500"/>
              <label for="terms" class="text-xs text-gray-500 leading-relaxed">
                I agree to the <a href="#" class="text-orange-500 font-medium hover:underline">Terms of Service</a> and
                <a href="#" class="text-orange-500 font-medium hover:underline">Privacy Policy</a>
              </label>
            </div>
            <p *ngIf="fieldErrors.agreed" class="text-red-500 text-xs -mt-2">{{ fieldErrors.agreed }}</p>

            <!-- Submit -->
            <button (click)="register()" [disabled]="loading"
                    class="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition text-sm mt-2">
              {{ loading ? 'Creating account...' : 'Create Account' }}
            </button>
          </div>

          <p class="text-center text-sm text-gray-500 mt-6">
            Already have an account?
            <a routerLink="/login" class="text-orange-500 font-semibold hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  form = {
    name: '', email: '', phone: '', gender: '',
    age: null as number | null,
    password: '', confirmPassword: '', agreed: false
  };

  fieldErrors: any = {};
  error = ''; success = '';
  loading = false;
  showPassword = false;
  showConfirm = false;
  passwordStrength = 0;

  get strengthLabel() {
    if (this.passwordStrength <= 1) return 'Weak';
    if (this.passwordStrength === 2) return 'Fair';
    if (this.passwordStrength === 3) return 'Good';
    return 'Strong';
  }

  get strengthTextColor() {
    if (this.passwordStrength <= 1) return 'text-red-500';
    if (this.passwordStrength === 2) return 'text-yellow-500';
    if (this.passwordStrength === 3) return 'text-blue-500';
    return 'text-green-600';
  }

  get passwordTips() {
    const p = this.form.password;
    return [
      { label: 'At least 8 characters', met: p.length >= 8 },
      { label: 'Contains uppercase letter', met: /[A-Z]/.test(p) },
      { label: 'Contains number', met: /[0-9]/.test(p) },
      { label: 'Contains special character (!@#$...)', met: /[^A-Za-z0-9]/.test(p) },
    ];
  }

  getStrengthBarColor(index: number) {
    if (this.passwordStrength === 0) return 'bg-gray-200';
    if (index <= this.passwordStrength) {
      if (this.passwordStrength <= 1) return 'bg-red-400';
      if (this.passwordStrength === 2) return 'bg-yellow-400';
      if (this.passwordStrength === 3) return 'bg-blue-400';
      return 'bg-green-500';
    }
    return 'bg-gray-200';
  }

  inputClass(hasError: string) {
    const base = 'w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition ';
    return hasError
      ? base + 'border-red-400 focus:ring-red-300'
      : base + 'border-gray-300 focus:ring-orange-400 focus:border-transparent';
  }

  onPasswordChange() {
    this.clearFieldError('password');
    const p = this.form.password;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    this.passwordStrength = score;
  }

  onPhoneChange() {
    this.clearFieldError('phone');
    this.form.phone = this.form.phone.replace(/\D/g, '').slice(0, 10);
    if (this.form.phone.length > 0 && !this.form.phone.startsWith('9')) {
      this.fieldErrors.phone = 'Philippine mobile numbers must start with 9';
    } else if (this.form.phone.length === 10) {
      this.fieldErrors.phone = '';
    }
  }

  onAgeChange() {
    this.clearFieldError('age');
    const age = Number(this.form.age);
    if (age < 13) this.fieldErrors.age = 'You must be at least 13 years old';
    else if (age > 120) this.fieldErrors.age = 'Please enter a valid age';
  }

  clearFieldError(field: string) {
    this.fieldErrors[field] = '';
    this.error = '';
  }

  validate(): boolean {
    this.fieldErrors = {};
    let valid = true;

    if (!this.form.name.trim()) {
      this.fieldErrors.name = 'Full name is required'; valid = false;
    } else if (this.form.name.trim().length < 2) {
      this.fieldErrors.name = 'Name must be at least 2 characters'; valid = false;
    }

    if (!this.form.email) {
      this.fieldErrors.email = 'Email is required'; valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
      this.fieldErrors.email = 'Please enter a valid email address'; valid = false;
    }

    if (!this.form.phone) {
      this.fieldErrors.phone = 'Phone number is required'; valid = false;
    } else if (this.form.phone.length !== 10) {
      this.fieldErrors.phone = 'Phone number must be 10 digits'; valid = false;
    } else if (!this.form.phone.startsWith('9')) {
      this.fieldErrors.phone = 'Philippine mobile numbers must start with 9'; valid = false;
    }

    if (!this.form.gender) {
      this.fieldErrors.gender = 'Please select a gender'; valid = false;
    }

    if (!this.form.age) {
      this.fieldErrors.age = 'Age is required'; valid = false;
    } else if (Number(this.form.age) < 13) {
      this.fieldErrors.age = 'You must be at least 13 years old'; valid = false;
    } else if (Number(this.form.age) > 120) {
      this.fieldErrors.age = 'Please enter a valid age'; valid = false;
    }

    if (!this.form.password) {
      this.fieldErrors.password = 'Password is required'; valid = false;
    } else if (this.passwordStrength < 3) {
      this.fieldErrors.password = 'Password is too weak — add uppercase, numbers, or special characters'; valid = false;
    }

    if (!this.form.confirmPassword) {
      this.fieldErrors.confirmPassword = 'Please confirm your password'; valid = false;
    } else if (this.form.confirmPassword !== this.form.password) {
      this.fieldErrors.confirmPassword = 'Passwords do not match'; valid = false;
    }

    if (!this.form.agreed) {
      this.fieldErrors.agreed = 'You must agree to the Terms of Service'; valid = false;
    }

    return valid;
  }

  constructor(private auth: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

  async register() {
    if (!this.validate()) return;
    this.loading = true;
    this.error = '';
    this.auth.register({
      name: this.form.name.trim(),
      email: this.form.email,
      password: this.form.password,
      phone: '+63' + this.form.phone,
      gender: this.form.gender,
      age: Number(this.form.age)
    }).subscribe({
      next: () => {
        this.success = '🎉 Account created! Redirecting to login...';
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (e) => {
        this.error = e?.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}