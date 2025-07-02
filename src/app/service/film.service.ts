import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FilmDataResponse, FilmData, FilmDataByCategoryResponse } from '../model/film-data';
import { API_ENDPOINTS } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class FilmService {
  private apiUrl = API_ENDPOINTS.FILMS;

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

  deleteFilm(filmId: number) {
    return this.http.delete<any>(this.apiUrl + 'delete/' + filmId);
  }

  getCategoryOptions() {
    return this.http.get<any[]>(API_ENDPOINTS.CATEGORIES);
  }

  getLanguageOptions() {
    return this.http.get<any[]>(API_ENDPOINTS.LANGUAGES);
  }

  getStoreOptions() {
    return this.http.get<any[]>(API_ENDPOINTS.STORES);
  }

  getFilmOptions() {
    return this.http.get<any[]>(this.apiUrl + 'options');
  }

  // Inventory endpoints
  getInventoryData(params: {
    film_title?: string;
    category?: string;
    store_id?: number;
    groupBy?: 'film' | 'store' | 'none';
  } = {}) {
    let httpParams = new HttpParams();
    
    if (params.film_title) {
      httpParams = httpParams.set('film_title', params.film_title);
    }
    if (params.category) {
      httpParams = httpParams.set('category', params.category);
    }
    if (params.store_id) {
      httpParams = httpParams.set('store_id', params.store_id.toString());
    }
    if (params.groupBy) {
      httpParams = httpParams.set('groupBy', params.groupBy);
    }

    return this.http.get<any>(API_ENDPOINTS.INVENTORY + 'search', { params: httpParams });
  }

  // Add inventory item
  addInventory(inventoryData: {
    film_id: number;
    store_id: number;
    quantity?: number;
  }) {
    return this.http.post<any>(API_ENDPOINTS.INVENTORY + 'create', inventoryData);
  }

  // Remove inventory by inventory_id
  deleteInventoryById(inventoryId: number) {
    return this.http.delete<any>(API_ENDPOINTS.INVENTORY + `delete/${inventoryId}`);
  }
}
