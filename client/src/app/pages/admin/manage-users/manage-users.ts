import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Users</h1>
        <p class="text-gray-500 text-sm mt-1">{{ users.length }} registered users</p>
      </div>

      <div class="mb-6">
        <input [(ngModel)]="search" type="text" placeholder="Search by name or email..."
               class="w-full sm:max-w-sm px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"/>
      </div>

      <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div *ngIf="loading" class="p-8 space-y-3">
          <div *ngFor="let i of [1,2,3,4,5]" class="h-14 bg-gray-100 rounded-xl animate-pulse"></div>
        </div>

        <div *ngIf="!loading" class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Email</th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr *ngFor="let user of filteredUsers" class="hover:bg-gray-50 transition">
                <td class="py-3 px-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {{ user.name?.charAt(0)?.toUpperCase() }}
                    </div>
                    <span class="font-medium text-gray-900">{{ user.name }}</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-500 hidden sm:table-cell">{{ user.email }}</td>
                <td class="py-3 px-4">
                  <span [class]="user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-gray-50 text-gray-700 border-gray-200'"
                        class="px-2 py-1 rounded-full text-xs font-semibold border">
                    {{ user.role | titlecase }}
                  </span>
                </td>
                <td class="py-3 px-4 text-gray-400 text-xs hidden md:table-cell">
                  {{ user.createdAt?.toDate ? user.createdAt.toDate() : user.createdAt | date:'mediumDate' }}
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="filteredUsers.length === 0" class="text-center py-12">
            <span class="text-4xl">👥</span>
            <p class="text-gray-500 mt-3">No users found</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ManageUsersComponent implements OnInit {
  users: any[] = [];
  loading = true;
  search = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/users`).subscribe({
      next: (users) => { this.users = users; this.loading = false; this.cdr.detectChanges(); },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  get filteredUsers() {
    if (!this.search) return this.users;
    const q = this.search.toLowerCase();
    return this.users.filter(u => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
  }
}