import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FilmService } from '../../../service/film.service';
import { FilmData } from '../../../model/film-data';

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
  private route = inject(ActivatedRoute);
  private filmService = inject(FilmService);

  ngOnInit() {
    const filmId = this.route.snapshot.paramMap.get('id');
    if (filmId) {
      this.loading = true;
      this.filmService.getFilmById(filmId).subscribe({
        next: (res) => {
          this.film = res.film || res;
          this.loading = false;
        },
        error: () => {
          this.film = null;
          this.loading = false;
        }
      });
    }
  }

  toggleEdit() {
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
}
