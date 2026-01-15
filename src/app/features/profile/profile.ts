import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';
import { UserService } from '../../core/services/user.service';

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

    // Photo editing methods removed

    // Bio Editing
    userService = inject(UserService);
    isEditingBio = signal(false);
    bioText = signal('');

    wordCount = computed(() => {
        const text = this.bioText() || '';
        return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    });

    // Initialize bio text from current user profile
    constructor() {
        // We use an effect or just simple assignment in constructor if signal is set
        const user = this.currentUser();
        if (user?.userProfile?.description) {
            this.bioText.set(user.userProfile.description);
        }
    }

    startEditBio() {
        const user = this.currentUser();
        this.bioText.set(user?.userProfile?.description || '');
        this.isEditingBio.set(true);
    }

    cancelEditBio() {
        this.isEditingBio.set(false);
    }

    saveBio(newBio: string) {
        if (newBio.split(/\s+/).length > 150) {
            alert('Description cannot exceed 150 words.'); // Simple validation
            return;
        }

        const user = this.currentUser();
        if (user && user.id) {
            this.userService.updateBio(user.id, newBio).subscribe({
                next: (res: any) => {
                    // Update local state
                    const updatedUser = { ...user };
                    if (!updatedUser.userProfile) {
                        updatedUser.userProfile = { upId: 0, userId: user.id || 0, pfp: '', description: '' };
                    }
                    updatedUser.userProfile.description = newBio;

                    this.authService.currentUser.set(updatedUser);
                    this.isEditingBio.set(false);
                },
                error: (err: any) => {
                    console.error('Error updating bio:', err);
                    if (err.error?.errors) {
                        console.error('Validation Errors:', err.error.errors);
                    }
                    alert('Failed to update bio. Check console for details.');
                }
            });
        }
    }
}
