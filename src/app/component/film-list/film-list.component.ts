import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilmData, FilmDataResponse } from '../../model/film-data';
import { FilmService } from '../../service/film.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth-service.service';

@Component({
  selector: 'app-film-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './film-list.component.html',
  styleUrl: './film-list.component.scss'
})
export class FilmListComponent implements OnInit {
  films: FilmData[] = [];
  pageSize = 8;
  page = 1;
  totalPages = 1;
  loading = false;
  searchTerm = '';
  isAdmin = false;

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

  constructor(private filmService: FilmService, private authService: AuthService) {}

  ngOnInit() {
    this.checkUserRole();
    this.loadFilms();
  }

  checkUserRole() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      this.isAdmin = user.role === 'admin';
    }
  }

  loadFilms(page: number = 1, search: string = '') {
    this.loading = true;
    this.filmService.getFilms(page, this.pageSize, search).subscribe({
      next: (res: FilmDataResponse) => {
        this.films = res.films;
        this.page = res.page;
        this.totalPages = Math.ceil(res.total / this.pageSize);
        this.loading = false;
      },
      error: () => {
        this.films = [];
        this.loading = false;
      }
    });
  }

  setPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.page = page;
    this.loadFilms(this.page, this.searchTerm);
  }

  onSearch() {
    this.page = 1;
    this.loadFilms(this.page, this.searchTerm);
  }

  getRandomGradient(id: number): string {
    return this.gradients[id % this.gradients.length];
  }

  getVisiblePages(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.page - 2);
    const end = Math.min(this.totalPages, this.page + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}
