import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FilmDataResponse, FilmData, FilmDataByCategoryResponse } from '../model/film-data';

@Injectable({ providedIn: 'root' })
export class FilmService {
  private apiUrl = 'http://localhost:3000/films/';

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
    // This should call your backend, but here is a mock for demo purposes
    return this.http.post<FilmDataByCategoryResponse[]>(this.apiUrl + 'by-categories', {categories: categories, limit: 3});
    // return this.http.get<{ name: string; films: FilmData[] }[]>(this.apiUrl + 'by-category');
  }
}
