
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule,NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-moderator-signup',
  standalone: true,
  templateUrl: './moderator-sign-up.component.html',
  styleUrls: ['./moderator-sign-up.component.scss'],
  imports : [NgIf,CommonModule,FormsModule]
})
export class ModeratorSignupComponent {
  username = '';
  email = '';
  password = '';
  error = '';
  success = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.error = '';
    this.success = '';
    const userData = {
      username: this.username,
      email: this.email,
      password: this.password
    };
    this.authService.signup(userData).subscribe({
      next: res => {
        this.success = res.message || 'User account created successfully.';
        this.username = '';
        this.email = '';
        this.password = '';
      },
      error: err => {
        this.error = err.error.message || 'Signup failed';
      }
    });
  }
}
