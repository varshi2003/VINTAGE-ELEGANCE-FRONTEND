
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, NgIf, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.error = '';
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
      
        if (this.authService.hasRole('ROLE_ADMIN')) {
          this.router.navigate(['/admin/statistics']);
        } else if (this.authService.hasRole('ROLE_MODERATOR')) {
          this.router.navigate(['/moderator/signup']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: err => {
        this.error = err.error?.message || 'Login failed';
      }
    });
  }
}
