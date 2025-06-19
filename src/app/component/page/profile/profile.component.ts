import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, UserService } from '../../../service/user.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../../service/message.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  user: any;
  loading = false;
  editMode = false;
  editedUser: any = {};

  userService = inject(UserService);
    messageService = inject(MessageService);

  constructor() {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.loading = true;
      this.userService.getUserById(userId).subscribe({
        next: (response) => {
          this.user = response.user;
          this.editedUser = { ...response.user };
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

  enableEdit() {
    this.editMode = true;
    this.editedUser = { ...this.user };
  }

  cancelEdit() {
    this.editMode = false;
    this.editedUser = { ...this.user };
  }

  saveProfile() {
    // Exclude id, created_at, updated_at from being sent
    const { id, created_at, updated_at, ...userToUpdate } = this.editedUser;
    debugger;
    userToUpdate.id = this.user.id;
    this.userService.saveUserEdits(userToUpdate).subscribe({
      next: (response) => {
        this.user = { ...this.user, ...userToUpdate };
        this.editMode = false;
        this.messageService.show('Saved changes', 'success');
      },
      error: () => {
        this.messageService.show('Failed to save changes', 'error');
      }
    });
  }
}
