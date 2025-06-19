import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth-service.service';

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

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.createUserForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
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
    this.loading = true;

    console.log('Creating user with data:', this.createUserForm.value);

    this.authService.createUser(this.createUserForm.value).subscribe({
      next: () => { 
        this.loading = false;
        this.router.navigate(['/login']);
      }
    });
  }

  onBackToLogin() {
    this.router.navigate(['/login']);
  }
}
