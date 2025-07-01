import { Component, OnInit, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilmData, FilmDataByCategoryResponse, FilmDataResponse } from '../../../model/film-data';
import { FilmService } from '../../../service/film.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit {
  categories: FilmDataByCategoryResponse[] = [];
  loading = false;
  gradients = [
    'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
    'linear-gradient(135deg, #fcb69f 0%, #ffecd2 100%)',
    'linear-gradient(135deg, #fdcbf1 0%, #e0c3fc 100%)',
    'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
    'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  ];

  @ViewChildren('carouselTrack') carouselTracks!: QueryList<ElementRef>;
  carouselAtStart: boolean[] = [];
  carouselAtEnd: boolean[] = [];

  constructor(private filmService: FilmService) {}

  ngOnInit() {
    this.loading = true;
    this.filmService.getFilmsByCategory(["horror","comedy","documentary","animation","classics"]).subscribe({
      next: (data: FilmDataByCategoryResponse[]) => {
        this.categories = data;
        this.loading = false;
      },
      error: () => {
        this.categories = [];
        this.loading = false;
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.updateCarouselArrows(), 0);
    this.carouselTracks.changes.subscribe(() => this.updateCarouselArrows());
  }

  scrollCarousel(index: number, direction: number) {
    const track = this.carouselTracks.toArray()[index]?.nativeElement;
    if (!track) return;
    const card = track.querySelector('.film-carousel-card');
    const scrollAmount = card ? card.offsetWidth * 3 : 540;
    track.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    setTimeout(() => this.updateCarouselArrows(), 350);
  }

  updateCarouselArrows() {
    this.carouselAtStart = [];
    this.carouselAtEnd = [];
    this.carouselTracks.forEach((trackRef, i) => {
      const track = trackRef.nativeElement;
      this.carouselAtStart[i] = track.scrollLeft <= 5;
      this.carouselAtEnd[i] = track.scrollLeft + track.offsetWidth >= track.scrollWidth - 5;
    });
  }

  getRandomGradient(id: number): string {
    return this.gradients[id % this.gradients.length];
  }
}
