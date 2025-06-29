import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api.constants';

export interface Film {
  film_id: number;
  title: string;
  rental_rate: string;
  rental_duration: number;
}

export interface Store {
  store_id: number;
  manager_staff_id: number;
  address_id: number;
}

export interface Availability {
  is_available: boolean;
  total_copies: number;
  available_copies: number;
  rented_copies: number;
  available_inventory_ids: number[];
  rented_inventory_ids: number[];
}

export interface InventoryDetail {
  inventory_id: number;
  film_id: number;
  store_id: number;
  status: string;
}

export interface FilmAvailabilityResponse {
  film: Film;
  store: Store;
  availability: Availability;
  inventory_details: InventoryDetail[];
}

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {
  private apiUrl = API_ENDPOINTS.INVENTORY;

  constructor(private http: HttpClient) {}

  checkFilmAvailabilityInStore(filmId: number, storeId: number): Observable<FilmAvailabilityResponse> {
    const params = new HttpParams()
      .set('film_id', filmId.toString())
      .set('store_id', storeId.toString());

    return this.http.get<FilmAvailabilityResponse>(this.apiUrl + 'available-in-store', { params });
  }
}
