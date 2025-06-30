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
  isAdmin = false;
  inventoryData: any[] = [];
  totalAvailable = 0;
  
  // Edit Modal properties
  showEditModal = false;
  editedFilm: any = {};
  categoryOptions: any[] = [];
  languageOptions: any[] = [];
  selectedCategories: number[] = [];
  specialFeaturesOptions: string[] = ['Trailers', 'Commentaries', 'Deleted Scenes', 'Behind the Scenes'];
  
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
    this.loadFormOptions();
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

  loadFormOptions() {
    if (this.isAdmin) {
      this.filmService.getCategoryOptions().subscribe(opts => this.categoryOptions = opts);
      this.filmService.getLanguageOptions().subscribe(opts => this.languageOptions = opts);
    }
  }

  calculateTotalAvailable() {
    this.totalAvailable = this.inventoryData.reduce((total, store) => {
      return total + (store.copies_count || 0);
    }, 0);
  }

  checkUserRole() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      this.isAdmin = user.role === 'admin';
    }
  }

  openEditModal() {
    if (!this.isAdmin || !this.film) {
      return;
    }
    
    // Initialize edit form with current film data
    this.editedFilm = {
      film_id: this.film.film_id,
      title: this.film.title,
      description: this.film.description,
      release_year: this.film.release_year,
      language_id: this.film.language_id,
      rental_duration: this.film.rental_duration,
      rental_rate: this.film.rental_rate,
      replacement_cost: this.film.replacement_cost,
      rating: this.film.rating,
      length: this.film.length,
      special_features: this.film.special_features
    };
    
    // Set selected categories
    this.selectedCategories = this.film.categories?.map(cat => cat.category_id) || [];
    
    this.showEditModal = true;
    this.saveSuccess = false;
    this.saveError = '';
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editedFilm = {};
    this.selectedCategories = [];
    this.saveSuccess = false;
    this.saveError = '';
  }

  onUpdateFilm() {
    if (!this.editedFilm || !this.isAdmin) return;
    
    // Add selected categories to the film data
    this.editedFilm.categories = this.selectedCategories;
    
    this.loading = true;
    this.filmService.updateFilm(this.editedFilm).subscribe({
      next: (response) => {
        // Refresh the film data
        const filmId = this.route.snapshot.paramMap.get('id');
        if (filmId) {
          this.filmService.getFilmById(filmId).subscribe({
            next: (res) => {
              this.film = res.film || res;
              if (res.inventory || res.film?.inventory) {
                this.inventoryData = res.inventory || res.film?.inventory || [];
                this.calculateTotalAvailable();
              }
              this.loading = false;
              this.saveSuccess = true;
              this.saveError = '';
              
              // Auto-close modal after success
              setTimeout(() => {
                this.closeEditModal();
              }, 2000);
            },
            error: () => {
              this.loading = false;
            }
          });
        }
      },
      error: (err) => {
        this.saveSuccess = false;
        this.saveError = err?.error?.message || 'Failed to update film.';
        this.loading = false;
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

  getCategoriesString(): string {
    if (!this.film?.categories || this.film.categories.length === 0) {
      return 'No categories';
    }
    return this.film.categories.map(cat => cat.name).join(', ');
  }
}
