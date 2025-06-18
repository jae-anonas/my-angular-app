import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserDataService } from './service/user-data.service';
import { FilmData } from './model/film-data';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'my-angular-app';

  public films: FilmData[] = [];

  constructor(private userDataService: UserDataService) {
    this.getFilmList();
  }

  getFilmList() {
    // This method can be used to trigger any logic related to film list retrieval
    this.userDataService.getUserData().subscribe((data: FilmData[]) => {
      this.films = data;
      console.log('Film list retrieved:', this.films);
    }, (error: any) => {
      console.error('Error retrieving film list:', error);
    });
  }
}


