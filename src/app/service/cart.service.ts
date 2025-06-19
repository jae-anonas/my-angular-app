import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FilmData } from '../model/film-data';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartSubject = new BehaviorSubject<FilmData[]>([]);
  cart$ = this.cartSubject.asObservable();

  getCart(): FilmData[] {
    return this.cartSubject.value;
  }

  addToCart(film: FilmData) {
    const cart = this.getCart();
    if (!cart.find(f => f.film_id === film.film_id)) {
      this.cartSubject.next([...cart, film]);
    }
  }

  removeFromCart(filmId: number) {
    const cart = this.getCart().filter(f => f.film_id !== filmId);
    this.cartSubject.next(cart);
  }

  clearCart() {
    this.cartSubject.next([]);
  }
}
