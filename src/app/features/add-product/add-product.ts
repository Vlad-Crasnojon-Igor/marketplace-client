import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AnnouncementService } from '../../core/services/announcement.service';
import { CategoryService } from '../../core/services/category.service';
import { AuthService } from '../../core/services/auth';
import { Category } from '../../core/models/category.model';

@Component({
    selector: 'app-add-product',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './add-product.html',
    styleUrl: './add-product.scss',
})
export class AddProduct {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private announcementService = inject(AnnouncementService);
    private categoryService = inject(CategoryService);
    private authService = inject(AuthService);

    categories = signal<Category[]>([]);

    productForm: FormGroup = this.fb.group({
        title: ['', [Validators.required, Validators.minLength(5)]],
        description: ['', [Validators.required, Validators.minLength(5)]],
        categoryId: [null, [Validators.required]],
        price: [null, [Validators.required, Validators.min(0)]],
        imageUrl: ['']
    });

    constructor() {
        this.categoryService.getCategories().subscribe({
            next: (cats) => this.categories.set(cats),
            error: (err) => console.error('Failed to load categories', err)
        });
    }

    onSubmit() {
        if (this.productForm.valid) {
            const currentUser = this.authService.currentUser();
            if (!currentUser || !currentUser.id) {
                alert('You must be logged in to post an announcement.');
                return;
            }

            const payload = {
                ...this.productForm.value,
                userId: currentUser.id,
                // Ensure numbers are numbers
                price: Number(this.productForm.value.price),
                categoryId: Number(this.productForm.value.categoryId),
                imageUrl: this.productForm.value.imageUrl || ''
            };

            this.announcementService.createAnnouncement(payload).subscribe({
                next: () => {
                    this.router.navigate(['/']);
                },
                error: (err) => {
                    console.error('Error creating announcement', err);
                    alert('Failed to create announcement.');
                }
            });
        } else {
            this.productForm.markAllAsTouched();
        }
    }

    onCancel() {
        this.router.navigate(['/']);
    }
}
