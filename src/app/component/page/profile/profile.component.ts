import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, UserService } from '../../../service/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  user: any;
  loading = false;
  

  userService = inject(UserService);

  constructor() {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    
    debugger;
    if (userId) {
      this.loading = true;
      this.userService.getUserById(userId).subscribe({
        next: (response) => {
          debugger;
          this.user = response.user;
          this.loading = false;
        },
        error: () => {
          this.user = null;
          this.loading = false;
        }
      });
    } else {
      alert('User ID is required to view profile.');
    }
  }
}
