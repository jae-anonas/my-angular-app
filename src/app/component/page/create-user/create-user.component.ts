import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth-service.service';
import { MessageService } from '../../../service/message.service';
import { FilmService } from '../../../service/film.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent implements OnInit {
  createUserForm!: FormGroup;
  loading = false;
  error = '';
  storeOptions: any[] = [];
  messageService = inject(MessageService);

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private filmService: FilmService) {}

  ngOnInit() {
    this.createUserForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      store_id: ['', Validators.required]
    });

    // Load store options
    this.loadStoreOptions();
  }

  loadStoreOptions() {
    this.filmService.getStoreOptions().subscribe({
      next: (stores) => {
        this.storeOptions = stores;
      },
      error: (error) => {
        console.error('Error loading store options:', error);
        // Provide fallback mock data if API fails
        this.storeOptions = [
          { store_id: 1, label: 'Store 1 - Downtown' },
          { store_id: 2, label: 'Store 2 - Mall' }
        ];
      }
    });
  }

  onSubmit() {
    this.error = '';
    if (this.createUserForm.invalid) {
      this.error = 'Please fill in all fields correctly.';
      return;
    }
    if (this.createUserForm.value.password !== this.createUserForm.value.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }
    if (!this.createUserForm.value.store_id) {
      this.error = 'Please select a store.';
      return;
    }
    this.loading = true;

    console.log('Creating user with data:', this.createUserForm.value);

    this.authService.createUser(this.createUserForm.value).subscribe({
      next: () => { 
        this.loading = false;
        this.messageService.show('User created!', 'success');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.loading = false;
        this.error = error?.error?.message || 'Failed to create user. Please try again.';
      }
    });
  }

  onBackToLogin() {
    this.router.navigate(['/login']);
  }
}
