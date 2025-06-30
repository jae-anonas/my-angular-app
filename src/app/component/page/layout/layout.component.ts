import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { CartService } from '../../../service/cart.service';
import { AuthService } from '../../../service/auth-service.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  private authService = inject(AuthService);

  showDropdown = false;
  cartCount = 0;
  isAdmin = false;
  customerInfo: any = null;
  isWideContentPage = false;

  constructor(private router: Router, private cartService: CartService) {
    this.cartService.cart$.subscribe(items => this.cartCount = items.length);
    
    // Listen to route changes to detect admin pages that need wider content
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkIfWideContentNeeded(event.url);
    });
  }

  ngOnInit() {
    this.checkUserRole();
    // Check initial route for wide content
    this.checkIfWideContentNeeded(this.router.url);
  }

  checkUserRole() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      this.isAdmin = user.role === 'admin';
      this.customerInfo = user.customer || null;
    }
  }

  checkIfWideContentNeeded(url: string) {
    // Pages that need wider content (admin tables, etc.)
    const wideContentPages = [
      '/admin-rentals',
      '/user-list',
      '/inventory'
    ];
    
    this.isWideContentPage = wideContentPages.some(page => url.includes(page));
  }

  onProfile() {
    const userData = localStorage.getItem('userData');
    // Navigate to profile page or show profile modal
    this.router.navigate(['/profile/' + (userData ? JSON.parse(userData).id : '')]);
  }

  onLogout() {
    // Implement logout logic here
    localStorage.removeItem('userData'); // Clear user data from local storage
    localStorage.removeItem('user'); // Clear user session
    this.router.navigate(['/login']);
  }
}
