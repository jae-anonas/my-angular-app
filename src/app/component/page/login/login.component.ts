import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../service/auth-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  error = '';
  loginForm!: FormGroup;
  loading = false;
  returnUrl!: string;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    // Example login logic
    this.authService.login(this.loginForm.value.username, this.loginForm.value.password)
      .subscribe({
        next: (response) => {
          this.loading = false;
          // Store user data in local storage
          localStorage.setItem('userData', JSON.stringify(response.userData));
          this.router.navigate(['/films']);
        }, error: (err: any) => {
          this.error = 'Login failed';
          this.loading = false;
        }
      });
  }

  onNewUser() {
    // Redirect to registration page or show registration modal
    this.router.navigate(['/create-user']);
  }

  onForgotPassword() {
    // Implement forgot password logic or navigation
    alert('Forgot password functionality coming soon!');
  }

  onHelp() {
    // Implement help logic or navigation
    alert('Help functionality coming soon!');
  }
}
