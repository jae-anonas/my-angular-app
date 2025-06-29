import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FilmService } from '../../../service/film.service';
import { FilmData } from '../../../model/film-data';
import { CartService } from '../../../service/cart.service';
import { AvailabilityService, FilmAvailabilityResponse } from '../../../service/availability.service';
import { AuthService } from '../../../service/auth-service.service';

@Component({
  selector: 'app-film-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './film-details.component.html',
  styleUrl: './film-details.component.scss'
})
export class FilmDetailsComponent implements OnInit {
  film: FilmData | null = null;
  loading = false;
  saveSuccess = false;
  saveError = '';
  editable = false;
  isAdmin = false;
  inventoryData: any[] = [];
  totalAvailable = 0;
  
  // Availability properties
  availabilityData: FilmAvailabilityResponse | null = null;
  loadingAvailability = false;
  isAvailableInUserStore = false;
  
  private route = inject(ActivatedRoute);
  private filmService = inject(FilmService);
  private cartService = inject(CartService);
  private availabilityService = inject(AvailabilityService);
  private authService = inject(AuthService);

  ngOnInit() {
    this.checkUserRole();
    const filmId = this.route.snapshot.paramMap.get('id');
    if (filmId) {
      this.loading = true;
      this.filmService.getFilmById(filmId).subscribe({
        next: (res) => {
          this.film = res.film || res;
          // Process inventory data if included in response
          if (res.inventory || res.film?.inventory) {
            this.inventoryData = res.inventory || res.film?.inventory || [];
            this.calculateTotalAvailable();
          }
          this.loading = false;
          
          // Check availability in user's store for non-admin users
          if (!this.isAdmin && this.film) {
            this.checkFilmAvailabilityInUserStore(parseInt(filmId));
          }
        },
        error: () => {
          this.film = null;
          this.loading = false;
        }
      });
    }
  }

  calculateTotalAvailable() {
    this.totalAvailable = this.inventoryData.reduce((total, store) => {
      return total + (store.available_count || store.total_inventory_count || 0);
    }, 0);
  }

  checkUserRole() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      this.isAdmin = user.role === 'admin';
    }
  }

  toggleEdit() {
    if (!this.isAdmin) {
      return; // Prevent non-admin users from editing
    }
    this.editable = !this.editable;
    this.saveSuccess = false;
    this.saveError = '';
  }

  onSave() {
    console.log('Saving film:', this.film);
    if (!this.film) return;
    this.filmService.updateFilm(this.film).subscribe({
      next: () => {
        this.saveSuccess = true;
        this.saveError = '';
      },
      error: (err) => {
        this.saveSuccess = false;
        this.saveError = err?.error?.message || 'Failed to update film.';
      }
    });
  }

  addToCart() {
    if (!this.film) return;
    
    // For non-admin users, check if the film is available in their store
    if (!this.isAdmin && !this.isAvailableInUserStore) {
      return; // Button should already be disabled, but prevent action just in case
    }
    
    // For admin users, use the general availability check
    if (this.isAdmin && this.totalAvailable > 0) {
      this.cartService.addToCart(this.film);
    } else if (!this.isAdmin && this.isAvailableInUserStore) {
      this.cartService.addToCart(this.film);
    }
  }

  checkFilmAvailabilityInUserStore(filmId: number) {
    const userData = this.authService.userValue;
    if (!userData || !userData.customer?.store_id) {
      console.warn('User store information not available');
      this.isAvailableInUserStore = false;
      return;
    }

    this.loadingAvailability = true;
    this.availabilityService.checkFilmAvailabilityInStore(filmId, userData.customer.store_id).subscribe({
      next: (response) => {
        this.availabilityData = response;
        this.isAvailableInUserStore = response.availability.is_available;
        this.loadingAvailability = false;
      },
      error: (error) => {
        console.error('Error checking film availability:', error);
        this.isAvailableInUserStore = false;
        this.loadingAvailability = false;
      }
    });
  }
}
