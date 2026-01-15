import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';
import { UserService } from '../../core/services/user.service';

import { AnnouncementService } from '../../core/services/announcement.service';
import { Announcement } from '../../core/models/announcement.model';

@Component({
    selector: 'app-profile',
    imports: [CommonModule],
    templateUrl: './profile.html',
    styleUrl: './profile.scss',
})
export class Profile {
    private authService = inject(AuthService);
    private announcementService = inject(AnnouncementService);
    currentUser = this.authService.currentUser;

    listings = signal<Announcement[]>([]);

    // Delete Modal State
    showDeleteConfirm = signal(false);
    listingToDelete = signal<number | null>(null);

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

        if (user && user.id) {
            this.loadListings(user.id);
        }
    }

    loadListings(userId: number) {
        this.announcementService.getAnnouncementsByUserId(userId).subscribe({
            next: (data) => this.listings.set(data),
            error: (err) => console.error('Failed to load listings', err)
        });
    }

    deleteListing(id: number) {
        this.listingToDelete.set(id);
        this.showDeleteConfirm.set(true);
    }

    confirmDelete() {
        const id = this.listingToDelete();
        if (id) {
            this.announcementService.deleteAnnouncement(id).subscribe({
                next: () => {
                    this.listings.update(current => current.filter(item => item.id !== id));
                    this.closeDeleteModal();
                },
                error: (err) => {
                    console.error('Failed to delete listing', err);
                    alert('Failed to delete listing');
                    this.closeDeleteModal();
                }
            });
        }
    }

    cancelDelete() {
        this.closeDeleteModal();
    }

    private closeDeleteModal() {
        this.showDeleteConfirm.set(false);
        this.listingToDelete.set(null);
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
