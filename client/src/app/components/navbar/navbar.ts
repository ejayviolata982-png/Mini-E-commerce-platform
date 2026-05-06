import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  userName = '';
  menuOpen = false;
  cartCount = 0;

  constructor(
    private auth: AuthService,
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.zone.run(() => { this.menuOpen = false; this.cdr.detectChanges(); });
      }
    });
  }

  ngOnInit(): void {
    this.auth.currentUser$.subscribe((user: any) => {
      this.zone.run(() => {
        this.isLoggedIn = !!user;
        this.userName = user?.name || '';
        this.isAdmin = user?.role === 'admin';
        this.cdr.detectChanges();
        if (user) {
          this.cartService.getCart().subscribe(() => this.cdr.detectChanges());
        }
      });
    });

    this.cartService.cart$.subscribe(cart => {
      this.zone.run(() => {
        this.cartCount = cart?.items?.length || 0;
        this.cdr.detectChanges();
      });
    });
  }

  goHome(): void {
    this.isAdmin ? this.router.navigate(['/admin/dashboard']) : this.router.navigate(['/']);
  }

  toggleMenu(event: MouseEvent): void { event.stopPropagation(); this.menuOpen = !this.menuOpen; }
  closeMenu(): void { this.menuOpen = false; }
  async logout(): Promise<void> { this.menuOpen = false; await this.auth.logout(); }
}