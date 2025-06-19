import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserDataService } from './service/user-data.service';
import { FilmData } from './model/film-data';

import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'my-angular-app';

  public films: FilmData[] = [];

  constructor(private userDataService: UserDataService) { }

}


