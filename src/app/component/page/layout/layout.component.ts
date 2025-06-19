import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { CartService } from '../../../service/cart.service';
import { AuthService } from '../../../service/auth-service.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  private authService = inject(AuthService);

  showDropdown = false;
  cartCount = 0;

  constructor(private router: Router, private cartService: CartService) {
    this.cartService.cart$.subscribe(items => this.cartCount = items.length);
  }


  onProfile() {
    const userData = localStorage.getItem('userData');
    debugger;
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
