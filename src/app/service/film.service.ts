import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FilmDataResponse, FilmData, FilmDataByCategoryResponse } from '../model/film-data';

@Injectable({ providedIn: 'root' })
export class FilmService {
  private apiUrl = '/api/films/';

  constructor(private http: HttpClient) {}

  getFilms(page: number = 1, pageSize: number = 8, search: string = ''): Observable<FilmDataResponse> {
    
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);
    if (search) {
      params = params.set('title', search);
      params = params.set('category', search);
    }
    return this.http.get<FilmDataResponse>(this.apiUrl + 'search', { params });
  }

  getFilmsByCategory(categories: string[]): Observable<FilmDataByCategoryResponse[]> {
    return this.http.post<FilmDataByCategoryResponse[]>(this.apiUrl + 'by-categories', {categories: categories, limit: 13});
  }

  getFilmById(id: string) {
    return this.http.get<any>(this.apiUrl + 'by-id', { params: { id } });
  }

  createFilm(film: any) {
    return this.http.post(this.apiUrl + 'create', film);
  }

  updateFilm(film: any) {
    return this.http.put(this.apiUrl + 'edit', film);
  }

  getCategoryOptions() {
    return this.http.get<any[]>('/api/categories/options');
  }

  getLanguageOptions() {
    return this.http.get<any[]>('/api/languages/options');
  }
}
