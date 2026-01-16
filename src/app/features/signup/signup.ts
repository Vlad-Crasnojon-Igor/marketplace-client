import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService, User } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth';
import { AchievementService } from '../../core/services/achievement.service';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private achievementService = inject(AchievementService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(9), Validators.pattern('^[0-9]*$')]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  isLoading = false;
  errorMessage = '';

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formValue = this.loginForm.value;
      const userPayload = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        password: formValue.password,
        phoneNumber: formValue.phone
      };

      this.userService.createUser(userPayload).subscribe({
        next: (createdUser: User) => {
          this.authService.currentUser.set(createdUser);
          // Assign "Account Created" achievement (ID: 1)
          if (createdUser.id) {
            this.achievementService.assignAchievement(createdUser.id, 1).subscribe({
              error: err => console.error('Failed to assign account creation achievement', err)
            });
          }
          this.router.navigate(['/']);
        },
        error: (err) => {
          if (err.status === 409 && err.error?.message) {
            const emailControl = this.loginForm.get('email');
            emailControl?.setValue('');
            emailControl?.setErrors({ conflict: err.error.message });
            emailControl?.markAsTouched();
          } else {
            this.errorMessage = 'Sign up failed. Please try again.';
          }
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }


}
