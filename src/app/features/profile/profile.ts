import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';

interface Listing {
    id: number;
    title: string;
    price: number;
    bids: number;
    timeLeft: string;
    seller: string;
}

@Component({
    selector: 'app-profile',
    imports: [CommonModule],
    templateUrl: './profile.html',
    styleUrl: './profile.scss',
})
export class Profile {
    private authService = inject(AuthService);
    currentUser = this.authService.currentUser;

    // Mock data for user's listings
    myListings: Listing[] = [
        { id: 1, title: 'Laptop ThinkPad T480 - Refurbished', price: 1200, bids: 5, timeLeft: '2h 15m', seller: 'current_user' },
        { id: 4, title: 'Tastatură Mecanică Custom', price: 400, bids: 2, timeLeft: '4h', seller: 'current_user' },
    ];

    editPhoto() {
        // In a real app, this would open a file picker or modal
        window.alert('OPEN_MODAL: [EDIT_PHOTO_INTERFACE]');
    }

    deletePhoto() {
        if (confirm('WARNING: DELETE_ASSET [PROFILE_PHOTO]?')) {
            window.alert('ASSET_DELETED: [PROFILE_PHOTO]');
        }
    }
}
