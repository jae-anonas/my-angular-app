import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilmData, FilmDataByCategoryResponse, FilmDataResponse } from '../../../model/film-data';
import { FilmService } from '../../../service/film.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  categories: FilmDataByCategoryResponse[] = [];
  loading = false;
  gradients = [
    'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
    'linear-gradient(135deg, #fcb69f 0%, #ffecd2 100%)',
    'linear-gradient(135deg, #fdcbf1 0%, #e0c3fc 100%)',
    'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
    'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  ];

  constructor(private filmService: FilmService) {}

  ngOnInit() {
    this.loading = true;
    this.filmService.getFilmsByCategory(["horror","comedy"]).subscribe({
      next: (data: FilmDataByCategoryResponse[]) => {
        this.categories = data;
        this.loading = false;
      },
      error: () => {
        this.categories = [];
        this.loading = false;
      }
    });
  }

  getRandomGradient(id: number): string {
    return this.gradients[id % this.gradients.length];
  }
}
