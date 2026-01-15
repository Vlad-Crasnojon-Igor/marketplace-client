import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth'; // Keeping AuthService for state management if needed later

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private authService = inject(AuthService); // We might want to update auth state on success
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isLoading = false;
  errorMessage = '';

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.userService.login({ email, password }).subscribe({
        next: (response) => {
          console.log('Login Raw Response:', response);

          let userData: any = {};

          try {
            // Try to parse if it's a JSON string
            if (typeof response === 'string') {
              // Check if it looks like JSON
              if (response.trim().startsWith('{')) {
                userData = JSON.parse(response);
              } else {
                // It's a plain string like "ok"
                console.warn('Login returned plain text:', response);
              }
            } else {
              // It's already an object (though with responseType text this shouldn't happen usually)
              userData = response;
            }
          } catch (e) {
            console.error('Error parsing login response:', e);
          }

          // Fetch user details with the email
          this.userService.getUserByEmail(email).subscribe({
            next: (userDetails) => {
              console.log('User Details Fetched:', userDetails);
              this.authService.currentUser.set({
                id: userDetails.id || 0,
                email: userDetails.email,
                firstName: userDetails.firstName || 'User',
                lastName: userDetails.lastName || 'Name',
                phoneNumber: userDetails.phoneNumber || '',
                userProfile: userDetails.userProfile
              });
              this.router.navigate(['/']);
              this.isLoading = false;
            },
            error: (fetchErr) => {
              console.error('Error fetching user details:', fetchErr);
              // Fallback: log in with basic email info if fetch fails
              this.authService.currentUser.set({
                id: 0,
                email: email,
                firstName: 'User',
                lastName: 'Name',
                phoneNumber: ''
              });
              this.router.navigate(['/']);
              this.isLoading = false;
            }
          });


        },
        error: (err) => {
          console.error('Login Error:', err);
          this.errorMessage = 'An error occurred during login. Check console for details.';
          this.isLoading = false;
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  onForgotPassword(event: Event) {
    event.preventDefault();
    window.alert('Reset password feature coming soon!');
  }
}
