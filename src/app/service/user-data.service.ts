import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FilmData } from '../model/film-data';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private readonly filmsList = '/api/query';
  constructor(
  private http: HttpClient) { }

  getUserData(): Observable<FilmData[]> {
    return this.http.get<FilmData[]>(this.filmsList);
  }
}
