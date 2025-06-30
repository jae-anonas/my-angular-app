import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../service/auth-service.service';
import { RentalService, ActiveRental, ActiveRentalsResponse } from '../../../service/rental.service';

@Component({
  selector: 'app-active-rentals',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './active-rentals.component.html',
  styleUrl: './active-rentals.component.scss'
})
export class ActiveRentalsComponent implements OnInit {
  rentals: ActiveRental[] = [];
  loading = false;
  error = '';
  
  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  totalRentals = 0;

  private authService = inject(AuthService);
  private rentalService = inject(RentalService);

  ngOnInit() {
    this.loadActiveRentals();
  }

  loadActiveRentals(page: number = 1) {
    const userData = this.authService.userValue;
    if (!userData || !userData.customer?.customer_id) {
      this.error = 'User information not found. Please log in again.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.currentPage = page;

    this.rentalService.getActiveRentals(userData.customer.customer_id, page, this.pageSize).subscribe({
      next: (response: ActiveRentalsResponse) => {
        this.rentals = response.activeRentals || [];
        this.currentPage = response.page;
        this.totalRentals = response.total;
        // Calculate total pages from total and pageSize
        this.totalPages = Math.ceil(response.total / response.pageSize);
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading active rentals:', error);
        this.error = error?.error?.message || 'Failed to load active rentals.';
        this.loading = false;
        this.rentals = [];
      }
    });
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.loadActiveRentals(page);
    }
  }

  getVisiblePages(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getDaysRented(rentalDate: string): number {
    const rental = new Date(rentalDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - rental.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isOverdue(rentalDate: string, rentalDuration: number): boolean {
    return this.getDaysRented(rentalDate) > rentalDuration;
  }

  getReturnStatus(rental: ActiveRental): { text: string; class: string } {
    if (rental.return_date) {
      return { text: 'Returned', class: 'returned' };
    }

    const daysRented = this.getDaysRented(rental.rental_date);
    // Get rental duration from film details, with fallback to 7 days
    const rentalDuration = rental.inventory?.film?.rental_duration || 7;
    const isOverdue = this.isOverdue(rental.rental_date, rentalDuration);

    if (isOverdue) {
      return { text: `Overdue (${daysRented} days)`, class: 'overdue' };
    } else {
      const daysLeft = rentalDuration - daysRented;
      return { text: `${daysLeft} days left`, class: 'active' };
    }
  }
}
