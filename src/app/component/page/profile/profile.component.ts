import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, UserService, CustomerData } from '../../../service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../../service/message.service';
import { AuthService } from '../../../service/auth-service.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  
  user: any;
  customerData: CustomerData | null = null;
  loading = false;
  editMode = false;
  editedCustomer: Partial<CustomerData> = {};
  isCurrentUser = false;

  userService = inject(UserService);
  messageService = inject(MessageService);

  constructor() {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    const currentUser = this.authService.userValue;
    
    // Check if viewing own profile
    this.isCurrentUser = currentUser && currentUser.id?.toString() === userId;
    
    if (userId) {
      this.loading = true;
      
      // First get user data to find customer_id
      this.userService.getUserById(userId).subscribe({
        next: (response) => {
          this.user = response.user;
          
          // If user has a customer_id, fetch detailed customer data
          if (this.user && this.user.customer_id) {
            this.loadCustomerData(this.user.customer_id);
          } else {
            this.customerData = null;
            this.loading = false;
          }
        },
        error: () => {
          this.user = null;
          this.customerData = null;
          this.loading = false;
          this.messageService.show('Failed to load profile', 'error');
        }
      });
    } else {
      this.messageService.show('User ID is required to view profile.', 'error');
      this.router.navigate(['/home']);
    }
  }

  private loadCustomerData(customerId: number) {
    this.userService.getCustomerById(customerId).subscribe({
      next: (response) => {
        this.customerData = response.customer;
        this.editedCustomer = { ...this.customerData };
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading customer data:', error);
        // Fallback to user.customer data if available
        if (this.user.customer) {
          this.customerData = this.user.customer;
          this.editedCustomer = { ...this.customerData };
        } else {
          this.customerData = null;
        }
        this.loading = false;
      }
    });
  }

  enableEdit() {
    if (!this.isCurrentUser) {
      this.messageService.show('You can only edit your own profile', 'error');
      return;
    }
    this.editMode = true;
    this.editedCustomer = { ...this.customerData };
  }

  cancelEdit() {
    this.editMode = false;
    this.editedCustomer = { ...this.customerData };
  }

  saveProfile() {
    if (!this.isCurrentUser) {
      this.messageService.show('You can only edit your own profile', 'error');
      return;
    }

    if (!this.editedCustomer.first_name?.trim() || !this.editedCustomer.last_name?.trim() || !this.editedCustomer.email?.trim()) {
      this.messageService.show('First name, last name, and email are required', 'error');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.editedCustomer.email!)) {
      this.messageService.show('Please enter a valid email address', 'error');
      return;
    }

    this.loading = true;
    
    // Update customer data directly using the new updateCustomer method
    const updateData = {
      customer_id: this.customerData?.customer_id,
      first_name: this.editedCustomer.first_name,
      last_name: this.editedCustomer.last_name,
      email: this.editedCustomer.email
    };

    this.userService.updateCustomer(updateData).subscribe({
      next: (response) => {
        // Update local data with response
        this.customerData = response.customer;
        this.editedCustomer = { ...this.customerData };
        
        // Update auth service user data
        const currentUser = this.authService.userValue;
        if (currentUser && currentUser.customer) {
          currentUser.customer.first_name = response.customer.first_name;
          currentUser.customer.last_name = response.customer.last_name;
          currentUser.customer.email = response.customer.email;
          localStorage.setItem('userData', JSON.stringify(currentUser));
        }
        
        this.editMode = false;
        this.loading = false;
        this.messageService.show('Profile updated successfully!', 'success');
      },
      error: (error) => {
        this.loading = false;
        const errorMessage = error?.error?.message || 'Failed to update profile';
        this.messageService.show(errorMessage, 'error');
        console.error('Profile update error:', error);
      }
    });
  }
}
