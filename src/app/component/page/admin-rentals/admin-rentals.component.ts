import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../service/auth-service.service';
import { RentalService, ActiveRental, ActiveRentalsResponse, ReturnRentalRequest } from '../../../service/rental.service';

@Component({
  selector: 'app-admin-rentals',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-rentals.component.html',
  styleUrl: './admin-rentals.component.scss'
})
export class AdminRentalsComponent implements OnInit {
  rentals: ActiveRental[] = [];
  loading = false;
  error = '';
  returningRentalId: number | null = null;
  
  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  totalRentals = 0;

  private authService = inject(AuthService);
  private rentalService = inject(RentalService);

  ngOnInit() {
    this.loadAllActiveRentals();
  }

  loadAllActiveRentals(page: number = 1) {
    this.loading = true;
    this.error = '';
    this.currentPage = page;

    this.rentalService.getAllActiveRentals(page, this.pageSize).subscribe({
      next: (response: ActiveRentalsResponse) => {
        this.rentals = response.activeRentals || [];
        this.currentPage = response.page;
        this.totalRentals = response.total;
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

  returnRental(rental: ActiveRental) {
    const userData = this.authService.userValue;
    // Use staff_id if available, otherwise default to 1 (this should be configurable in a real app)
    const staffId = userData?.staff?.staff_id || 1;

    if (confirm(`Are you sure you want to return "${rental.inventory.film.title}" for ${rental.customer.first_name} ${rental.customer.last_name}?`)) {
      this.returningRentalId = rental.rental_id;
      
      const returnRequest: ReturnRentalRequest = {
        rental_id: rental.rental_id,
        staff_id: staffId
      };

      this.rentalService.returnRental(returnRequest).subscribe({
        next: (response) => {
          console.log('Rental returned successfully:', response);
          console.log(`Returned: ${response.rental.film_title} for ${response.rental.customer_name}`);
          this.returningRentalId = null;
          // Refresh the current page to show updated data
          this.loadAllActiveRentals(this.currentPage);
        },
        error: (error: any) => {
          console.error('Error returning rental:', error);
          this.error = error?.error?.message || 'Failed to return rental.';
          this.returningRentalId = null;
        }
      });
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.loadAllActiveRentals(page);
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

  isOverdue(rental: ActiveRental): boolean {
    if (rental.return_date) return false;
    const daysRented = this.getDaysRented(rental.rental_date);
    const rentalDuration = rental.inventory?.film?.rental_duration || 7;
    return daysRented > rentalDuration;
  }

  getStatusClass(rental: ActiveRental): string {
    if (rental.return_date) return 'returned';
    return this.isOverdue(rental) ? 'overdue' : 'active';
  }

  getStatusText(rental: ActiveRental): string {
    if (rental.return_date) return 'Returned';
    const daysRented = this.getDaysRented(rental.rental_date);
    const rentalDuration = rental.inventory?.film?.rental_duration || 7;
    
    if (this.isOverdue(rental)) {
      return `Overdue (${daysRented} days)`;
    } else {
      const daysLeft = rentalDuration - daysRented;
      return `${daysLeft} days left`;
    }
  }
}
