import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';
import { UserService } from '../../core/services/user.service';

import { AnnouncementService } from '../../core/services/announcement.service';
import { Announcement } from '../../core/models/announcement.model';
import { AchievementService } from '../../core/services/achievement.service';
import { Achievement } from '../../core/models/achievement.model';

@Component({
    selector: 'app-profile',
    imports: [CommonModule],
    templateUrl: './profile.html',
    styleUrl: './profile.scss',
})
export class Profile {
    private authService = inject(AuthService);
    private announcementService = inject(AnnouncementService);
    private achievementService = inject(AchievementService); // Inject service
    private router = inject(Router);
    currentUser = this.authService.currentUser;

    listings = signal<Announcement[]>([]);
    achievements = signal<Achievement[]>([]); // Update type

    // Delete Modal State
    showDeleteConfirm = signal(false);
    listingToDelete = signal<number | null>(null);

    // Profile Delete State
    showDeleteProfileConfirm = signal(false);

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
            this.loadAchievements(user.id);
        }
    }

    loadListings(userId: number) {
        this.announcementService.getAnnouncementsByUserId(userId).subscribe({
            next: (data) => this.listings.set(data),
            error: (err) => console.error('Failed to load listings', err)
        });
    }

    loadAchievements(userId: number) {
        this.achievementService.getUserAchievements(userId).subscribe({
            next: (data) => this.achievements.set(data),
            error: (err) => console.error('Failed to load achievements', err)
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

                    // Assign "Profile Manager" achievement (ID: 3)
                    if (user.id) {
                        this.achievementService.assignAchievement(user.id, 3).subscribe({
                            error: err => console.error('Failed to assign profile description achievement', err)
                        });
                    }
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

    deleteProfile() {
        this.showDeleteProfileConfirm.set(true);
    }

    cancelDeleteProfile() {
        this.showDeleteProfileConfirm.set(false);
    }

    confirmDeleteProfile() {
        const user = this.currentUser();
        if (user && user.id) {
            this.userService.deleteUser(user.id).subscribe({
                next: () => {
                    this.authService.logout();
                    this.router.navigate(['/login']);
                    this.showDeleteProfileConfirm.set(false);
                },
                error: (err) => {
                    console.error('Failed to delete user profile', err);
                    alert('Failed to delete profile');
                    this.showDeleteProfileConfirm.set(false);
                }
            });
        }
    }
}
