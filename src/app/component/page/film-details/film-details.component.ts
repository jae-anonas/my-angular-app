import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FilmService } from '../../../service/film.service';
import { FilmData } from '../../../model/film-data';
import { CartService } from '../../../service/cart.service';

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
  private route = inject(ActivatedRoute);
  private filmService = inject(FilmService);
  private cartService = inject(CartService);

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
    if (this.film && this.totalAvailable > 0) {
      this.cartService.addToCart(this.film);
    }
  }
}
