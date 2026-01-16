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
    selectedFileName = signal<string>('');

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

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFileName.set(file.name);
            // We store the file object to upload it on submit
            this.productForm.patchValue({ imageUrl: file });
        }
    }

    onSubmit() {
        if (this.productForm.valid) {
            const currentUser = this.authService.currentUser();
            if (!currentUser || !currentUser.id) {
                alert('You must be logged in to post an announcement.');
                return;
            }

            const formValue = this.productForm.value;
            const file = formValue.imageUrl instanceof File ? formValue.imageUrl : null;

            const createPayload = (imageUrl: string) => ({
                title: formValue.title,
                description: formValue.description,
                categoryId: Number(formValue.categoryId),
                price: Number(formValue.price),
                userId: currentUser.id,
                imageUrl: imageUrl
            });

            if (file) {
                this.announcementService.uploadImage(file).subscribe({
                    next: (res) => {
                        this.createAnnouncement(createPayload(res.url));
                    },
                    error: (err) => {
                        console.error('Image upload failed', err);
                        alert('Failed to upload image. Please try again.');
                    }
                });
            } else {
                this.createAnnouncement(createPayload(''));
            }
        } else {
            this.productForm.markAllAsTouched();
        }
    }

    private createAnnouncement(payload: any) {
        this.announcementService.createAnnouncement(payload).subscribe({
            next: () => {
                this.router.navigate(['/']);
            },
            error: (err) => {
                console.error('Error creating announcement', err);
                alert('Failed to create announcement.');
            }
        });
    }

    onCancel() {
        this.router.navigate(['/']);
    }
}
