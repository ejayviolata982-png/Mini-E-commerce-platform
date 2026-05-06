import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.html',
})
export class AdminLayoutComponent implements OnInit {
  userName = '';
  sidebarOpen = false;
  currentPath = '';

  navItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/products', icon: '🛍️', label: 'Products' },
    { path: '/admin/categories', icon: '📁', label: 'Categories' },
    { path: '/admin/orders', icon: '📦', label: 'Orders' },
    { path: '/admin/users', icon: '👥', label: 'Users' },
  ];

  constructor(private auth: AuthService, private router: Router) {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.currentPath = e.url;
        this.sidebarOpen = false;
      }
    });
  }

  ngOnInit(): void {
    this.auth.currentUser$.subscribe((user: any) => {
      this.userName = user?.name || 'Admin';
    });
    this.currentPath = this.router.url;
  }

  isActive(path: string): boolean {
    return this.currentPath === path || this.currentPath.startsWith(path + '/');
  }

  async logout(): Promise<void> { await this.auth.logout(); }
  toggleSidebar(): void { this.sidebarOpen = !this.sidebarOpen; }
}
