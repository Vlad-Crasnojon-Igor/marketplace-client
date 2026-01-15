import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './core/services/auth';

@Component({
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet, RouterLink],
    templateUrl: './app.html',
    styleUrls: ['./app.scss']
})
export class AppComponent {
    authService = inject(AuthService);
    currentUser = this.authService.currentUser;

    logout() {
        this.authService.logout();
    }
}