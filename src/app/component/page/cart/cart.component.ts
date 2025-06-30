import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilmData } from '../../../model/film-data';
import { CartService } from '../../../service/cart.service';
import { RentalService, InventoryItem } from '../../../service/rental.service';
import { AuthService } from '../../../service/auth-service.service';
import { MessageService } from '../../../service/message.service';
import { AvailabilityService } from '../../../service/availability.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  cart: FilmData[] = [];
  isCheckingOut = false;
  showConfirmModal = false;
  showSuccessModal = false;
  checkoutSummary: any = null;
  private messageService = inject(MessageService);

  constructor(
    private cartService: CartService, 
    private rentalService: RentalService,
    private authService: AuthService,
    private availabilityService: AvailabilityService
  ) {
    this.cartService.cart$.subscribe(items => this.cart = items);
  }

  removeFromCart(filmId: number) {
    this.cartService.removeFromCart(filmId);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  getTotalCost(): number {
    return this.cart.reduce((total, film) => total + parseFloat(film.rental_rate), 0);
  }

  onCheckout() {
    if (this.cart.length === 0) {
      this.messageService.show('Your cart is empty!', 'error');
      return;
    }

    // Show confirmation modal instead of proceeding directly
    this.showConfirmModal = true;
  }

  closeConfirmModal() {
    this.showConfirmModal = false;
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
    this.checkoutSummary = null;
  }

  confirmCheckout() {
    this.showConfirmModal = false;

    const userData = this.authService.userValue;
    if (!userData || !userData.customer?.customer_id || !userData.customer?.store_id) {
      this.messageService.show('User information not found. Please log in again.', 'error');
      return;
    }

    this.isCheckingOut = true;

    // Get availability for each film in the user's store
    const availabilityRequests = this.cart.map(film => 
      this.availabilityService.checkFilmAvailabilityInStore(film.film_id, userData.customer.store_id)
    );

    forkJoin(availabilityRequests).subscribe({
      next: (availabilityResults) => {
        // Get available inventory IDs for each film
        const inventoryIds: number[] = [];
        const unavailableFilms: string[] = [];

        availabilityResults.forEach((availability, index) => {
          if (availability.availability.is_available && availability.availability.available_inventory_ids.length > 0) {
            // Take the first available inventory ID for this film
            inventoryIds.push(availability.availability.available_inventory_ids[0]);
          } else {
            unavailableFilms.push(this.cart[index].title);
          }
        });

        if (unavailableFilms.length > 0) {
          this.isCheckingOut = false;
          this.messageService.show(`The following films are no longer available in your store: ${unavailableFilms.join(', ')}`, 'error');
          return;
        }

        if (inventoryIds.length === 0) {
          this.isCheckingOut = false;
          this.messageService.show('No inventory available for checkout in your store.', 'error');
          return;
        }

        const rentalData = {
          inventory_id: inventoryIds,
          customer_id: userData.customer.customer_id,
          staff_id: 1 // You might want to make this configurable or get it from somewhere else
        };

        this.rentalService.createRental(rentalData).subscribe({
          next: (response) => {
            this.isCheckingOut = false;
            if (response.success) {
              // Create checkout summary using the actual API response structure
              this.checkoutSummary = {
                films: [...this.cart],
                total: this.getTotalCost(),
                rentalIds: response.rentals.map((rental: any) => rental.rental_id),
                checkoutDate: new Date(),
                rentals: response.rentals,
                message: response.message,
                createdCount: response.created_count,
                requestedCount: response.requested_count
              };
              
              // Clear cart and show success modal
              this.cartService.clearCart();
              this.showSuccessModal = true;
              this.messageService.show(response.message || 'Rental created successfully!', 'success');
            } else {
              this.messageService.show(response.message || 'Checkout failed. Please try again.', 'error');
            }
          },
          error: (error) => {
            this.isCheckingOut = false;
            console.error('Checkout error:', error);
            this.messageService.show(error?.error?.message || 'Checkout failed. Please try again.', 'error');
          }
        });
      },
      error: (error) => {
        this.isCheckingOut = false;
        console.error('Error checking availability:', error);
        this.messageService.show('Error checking film availability. Please try again.', 'error');
      }
    });
  }
}
