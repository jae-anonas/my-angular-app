import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilmService } from '../../../service/film.service';

@Component({
  selector: 'app-add-film',
  templateUrl: './add-film.component.html',
  styleUrls: ['./add-film.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class AddFilmComponent implements OnInit {
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
  selectedCategories: number[] = [];
  categoryOptions: any[] = [];
  languageOptions: any[] = [];
  success = false;
  error = '';

  constructor(private filmService: FilmService) {}

  ngOnInit() {
    this.filmService.getCategoryOptions().subscribe(opts => this.categoryOptions = opts);
    this.filmService.getLanguageOptions().subscribe(opts => this.languageOptions = opts);
  }

  onSubmit() {
    this.film.categories = this.selectedCategories;
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
