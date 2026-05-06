import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="max-w-lg mx-auto px-4 sm:px-6 py-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">👤 My Profile</h1>

      <div class="bg-white rounded-2xl border border-gray-200 p-6">

        <!-- Avatar + Info -->
        <div class="flex items-center gap-4 mb-6">
          <div class="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-2xl font-bold text-white">
            {{ user?.name?.charAt(0)?.toUpperCase() }}
          </div>
          <div>
            <p class="font-bold text-gray-900 text-lg">{{ user?.name }}</p>
            <p class="text-gray-500 text-sm">{{ user?.email }}</p>
            <span class="inline-block mt-1 px-2 py-0.5 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-medium rounded-full">
              {{ user?.role | titlecase }}
            </span>
          </div>
        </div>

        <!-- Alerts -->
        <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-4 text-sm flex gap-2">
          <span>⚠️</span><span>{{ error }}</span>
        </div>
        <div *ngIf="msg" class="bg-green-50 border border-green-200 text-green-600 rounded-xl px-4 py-3 mb-4 text-sm flex gap-2">
          <span>✅</span><span>{{ msg }}</span>
        </div>

        <div class="space-y-4">

          <!-- Full Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <input [(ngModel)]="form.name" type="text" placeholder="Juan dela Cruz"
                   class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"/>
          </div>

          <!-- Email (read-only) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input [value]="user?.email" disabled type="email"
                   class="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-sm text-gray-400 cursor-not-allowed"/>
            <p class="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>

          <!-- Phone -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
            <div class="flex gap-2">
              <span class="px-3 py-2.5 bg-gray-100 border border-gray-300 rounded-xl text-sm text-gray-600 font-medium">+63</span>
              <input [(ngModel)]="phoneLocal" (ngModelChange)="onPhoneChange()" type="tel"
                     placeholder="9XX XXX XXXX" maxlength="10"
                     class="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"/>
            </div>
            <p *ngIf="fieldErrors.phone" class="text-red-500 text-xs mt-1">{{ fieldErrors.phone }}</p>
          </div>

          <!-- Gender + Age -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
              <select [(ngModel)]="form.gender"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Age</label>
              <input [(ngModel)]="form.age" (ngModelChange)="onAgeChange()" type="number"
                     placeholder="25" min="13" max="120"
                     class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"/>
              <p *ngIf="fieldErrors.age" class="text-red-500 text-xs mt-1">{{ fieldErrors.age }}</p>
            </div>
          </div>

          <!-- Address -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
            <textarea [(ngModel)]="form.address" rows="2" placeholder="Street, City, Province"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"></textarea>
          </div>

        </div>

        <button (click)="save()" [disabled]="saving"
                class="mt-6 w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition text-sm">
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  user: any = null;
  form = { name: '', gender: '', age: null as number | null, address: '' };
  phoneLocal = '';
  fieldErrors: any = {};
  msg = ''; error = ''; saving = false;

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.user = this.auth.getCurrentUser();
    this.form.name = this.user?.name || '';
    this.form.gender = this.user?.gender || '';
    this.form.age = this.user?.age || null;
    this.form.address = this.user?.address || '';
    // Strip +63 prefix for display
    const phone = this.user?.phone || '';
    this.phoneLocal = phone.startsWith('+63') ? phone.slice(3) : phone;
  }

  onPhoneChange() {
    this.fieldErrors.phone = '';
    this.phoneLocal = this.phoneLocal.replace(/\D/g, '').slice(0, 10);
    if (this.phoneLocal.length > 0 && !this.phoneLocal.startsWith('9')) {
      this.fieldErrors.phone = 'Must start with 9';
    }
  }

  onAgeChange() {
    this.fieldErrors.age = '';
    const age = Number(this.form.age);
    if (age < 13) this.fieldErrors.age = 'Must be at least 13';
    else if (age > 120) this.fieldErrors.age = 'Invalid age';
  }

  validate(): boolean {
    this.fieldErrors = {};
    let valid = true;
    if (!this.form.name.trim()) {
      this.fieldErrors.name = 'Name is required'; valid = false;
    }
    if (this.phoneLocal && this.phoneLocal.length !== 10) {
      this.fieldErrors.phone = 'Must be 10 digits'; valid = false;
    }
    if (this.phoneLocal && !this.phoneLocal.startsWith('9')) {
      this.fieldErrors.phone = 'Must start with 9'; valid = false;
    }
    if (this.form.age && (Number(this.form.age) < 13 || Number(this.form.age) > 120)) {
      this.fieldErrors.age = 'Invalid age'; valid = false;
    }
    return valid;
  }

  save() {
    if (!this.validate()) return;
    this.saving = true; this.error = ''; this.msg = '';

    const payload = {
      name: this.form.name.trim(),
      phone: this.phoneLocal ? '+63' + this.phoneLocal : '',
      gender: this.form.gender,
      age: this.form.age ? Number(this.form.age) : null,
      address: this.form.address
    };

    this.http.put(`${environment.apiUrl}/users/profile`, payload).subscribe({
      next: (updated: any) => {
        const merged = { ...this.user, ...payload };
        localStorage.setItem('user', JSON.stringify(merged));
        this.user = merged;
        this.msg = 'Profile updated successfully!';
        this.saving = false;
        this.cdr.detectChanges();
        setTimeout(() => { this.msg = ''; this.cdr.detectChanges(); }, 3000);
      },
      error: (e) => {
        this.error = e?.error?.message || 'Failed to update profile.';
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }
}