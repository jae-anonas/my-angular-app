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

export interface ActiveRental {
  rental_id: number;
  rental_date: string;
  inventory_id: number;
  customer_id: number;
  return_date: string | null;
  staff_id: number;
  last_update: string;
  inventory: {
    inventory_id: number;
    film_id: number;
    store_id: number;
    last_update: string;
    film: {
      film_id: number;
      title: string;
      rental_rate: string;
      rental_duration: number;
    };
    store: {
      store_id: number;
      manager_staff_id?: number;
      address_id?: number;
      last_update?: string;
    };
  };
  customer: {
    customer_id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface ActiveRentalsResponse {
  page: number;
  pageSize: number;
  total: number;
  activeRentals: ActiveRental[];
}

export interface ReturnRentalRequest {
  rental_id: number;
  staff_id: number;
}

export interface ReturnRentalResponse {
  success: boolean;
  message: string;
  rental: {
    rental_id: number;
    return_date: string;
    film_title: string;
    customer_name: string;
  };
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

  // Get active rentals for a customer with pagination
  getActiveRentals(customerId: number, page: number = 1, pageSize: number = 10): Observable<ActiveRentalsResponse> {
    return this.http.get<ActiveRentalsResponse>(this.apiUrl + 'active', {
      params: {
        customer_id: customerId.toString(),
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  // Get all active rentals for admin (all customers) with pagination
  getAllActiveRentals(page: number = 1, pageSize: number = 10): Observable<ActiveRentalsResponse> {
    return this.http.get<ActiveRentalsResponse>(this.apiUrl + 'active', {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  // Return a rental
  returnRental(rentalData: ReturnRentalRequest): Observable<ReturnRentalResponse> {
    return this.http.put<ReturnRentalResponse>(this.apiUrl + 'return', rentalData);
  }
}
