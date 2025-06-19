import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilmData } from '../../../model/film-data';
import { CartService } from '../../../service/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  cart: FilmData[] = [];

  constructor(private cartService: CartService) {
    this.cartService.cart$.subscribe(items => this.cart = items);
  }

  removeFromCart(filmId: number) {
    this.cartService.removeFromCart(filmId);
  }

  clearCart() {
    this.cartService.clearCart();
  }
}
