import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api.constants';

export interface User {
  id: number;
  name: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerData {
  customer_id: number;
  first_name: string;
  last_name: string;
  email: string;
  active: boolean;
  address_id: number;
  store_id: number;
  create_date: string;
  last_update: string;
}

export interface CustomerResponse {
  customer: CustomerData;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = API_ENDPOINTS.USERS;
  private customersAPIUrl = API_ENDPOINTS.CUSTOMERS;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: string) {
    return this.http.get<any>(this.apiUrl + '/by-id', { params: { id } });
  }

  getCustomerById(customerId: number): Observable<CustomerResponse> {
    return this.http.get<CustomerResponse>(this.customersAPIUrl + 'by-id', { params: { id: customerId.toString() } });
  }

  saveUserEdits(user: Partial<User>) {
    // Expects user object with id and fields to update
    return this.http.put<any>(this.apiUrl + '/edit', user);
  }

  updateCustomer(customerData: Partial<CustomerData>): Observable<CustomerResponse> {
    return this.http.put<CustomerResponse>(this.customersAPIUrl + 'edit', customerData);
  }

  deleteUser(customerId: number) {
    return this.http.delete<any>(this.apiUrl + '/delete/' + customerId);
  }
}
