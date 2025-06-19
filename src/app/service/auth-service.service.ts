import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserData } from '../model/user-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<any>;
  public user: Observable<any>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    let userStorage: any = localStorage.getItem('userData');
    this.userSubject = new BehaviorSubject<any>(JSON.parse(userStorage));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): any {
    return this.userSubject.value;
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>('http://localhost:3000/signin', { username, password });
  }

  createUser(userData: UserData): Observable<any> {
    // Simulate user creation
    console.log('Create user:', JSON.stringify(userData));
    return this.http.post<any>('http://localhost:3000/signup', { userData });
  }

  logout() {
    this.userSubject.next(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userData');
    this.router.navigate(['/login']);
  }
}