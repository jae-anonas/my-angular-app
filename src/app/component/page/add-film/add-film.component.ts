import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilmService } from '../../../service/film.service';

@Component({
  selector: 'app-add-film',
  templateUrl: './add-film.component.html',
  styleUrls: ['./add-film.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class AddFilmComponent {
  film: any = {
    title: '',
    description: '',
    release_year: '',
    language_id: '',
    rental_duration: '',
    rental_rate: '',
    replacement_cost: '',
    rating: '',
    length: '',
    categories: []
  };
  categoriesInput = '';
  success = false;
  error = '';

  constructor(private filmService: FilmService) {}

  onSubmit() {
    this.film.categories = this.categoriesInput.split(',').map((c: string) => c.trim()).filter((c: string) => c);
    this.filmService.createFilm(this.film).subscribe({
      next: () => {
        this.success = true;
        this.error = '';
      },
      error: (err) => {
        this.success = false;
        this.error = err?.error?.message || 'Failed to add film.';
      }
    });
  }
}
