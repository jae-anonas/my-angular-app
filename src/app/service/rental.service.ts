import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api.constants';

export interface CreateRentalRequest {
  inventory_id: number[];
  customer_id: number;
  staff_id: number;
}

export interface CreateRentalResponse {
  success: boolean;
  rental_ids: number[];
  message: string;
}

export interface InventoryItem {
  inventory_id: number;
  film_id: number;
  store_id: number;
  available: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  private apiUrl = API_ENDPOINTS.RENTALS;

  constructor(private http: HttpClient) {}

  createRental(rentalData: CreateRentalRequest): Observable<CreateRentalResponse> {
    return this.http.post<CreateRentalResponse>(this.apiUrl + 'create', rentalData);
  }

  // Get available inventory for a specific film
  getAvailableInventory(filmId: number): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(API_ENDPOINTS.BASE_URL + 'inventory/available', {
      params: { film_id: filmId.toString() }
    });
  }
}
