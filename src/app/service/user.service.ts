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

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = API_ENDPOINTS.USERS;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: string) {
    return this.http.get<any>('/api/users/by-id', { params: { id } });
  }

  saveUserEdits(user: Partial<User>) {
    // Expects user object with id and fields to update
    return this.http.put<any>('/api/users/edit', user);
  }
}
