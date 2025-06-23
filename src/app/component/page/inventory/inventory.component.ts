import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilmService } from '../../../service/film.service';
import { FilmDataResponse, FilmData } from '../../../model/film-data';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class InventoryComponent implements OnInit {
  films: FilmData[] = [];

  constructor(private filmService: FilmService) {}

  ngOnInit(): void {
    this.filmService.getFilms(1, 100).subscribe((response: FilmDataResponse) => {
      this.films = response.films;
    });
  }
}
