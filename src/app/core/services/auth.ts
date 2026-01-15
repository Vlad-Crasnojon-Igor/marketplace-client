import { Injectable, signal, inject } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { UserService, User } from './user.service';

export type { User };

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userService = inject(UserService);

  // Signal to hold the current user state
  currentUser = signal<User | null>(null);

  login(email: string, password: string): Observable<boolean> {
    return this.userService.getUsers().pipe(
      map(users => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          this.currentUser.set(user);
          return true;
        }
        return false;
      })
    );
  }

  logout(): void {
    this.currentUser.set(null);
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser();
  }
}
