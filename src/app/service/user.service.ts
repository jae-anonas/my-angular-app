import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: string) {
    return this.http.get<any>('http://localhost:3000/users/by-id', { params: { id } });
  }

  saveUserEdits(user: Partial<User>) {
    // Expects user object with id and fields to update
    return this.http.put<any>('http://localhost:3000/users/edit', user);
  }
}
