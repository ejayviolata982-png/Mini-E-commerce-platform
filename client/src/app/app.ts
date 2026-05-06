import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { FooterComponent } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <ng-container *ngIf="!isAdminRoute">
      <app-navbar></app-navbar>
    </ng-container>
    <main [class]="isAdminRoute ? '' : 'min-h-screen bg-gray-50'">
      <router-outlet></router-outlet>
    </main>
    <ng-container *ngIf="!isAdminRoute">
      <app-footer></app-footer>
    </ng-container>
  `
})
export class AppComponent implements OnInit {
  isAdminRoute = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.isAdminRoute = e.url.startsWith('/admin');
      }
    });
  }
}
