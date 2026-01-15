import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-add-product',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './add-product.html',
    styleUrl: './add-product.scss',
})
export class AddProduct {
    private fb = inject(FormBuilder);
    private router = inject(Router);

    productForm: FormGroup = this.fb.group({
        title: ['', [Validators.required, Validators.minLength(5)]],
        description: ['', [Validators.required, Validators.minLength(20)]],
        category: ['', [Validators.required]],
        price: ['', [Validators.required, Validators.min(0)]],
        photo: [null] // File handling would be more complex in real app
    });

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.productForm.patchValue({ photo: file });
        }
    }

    onSubmit() {
        if (this.productForm.valid) {
            console.log('Product Data:', this.productForm.value);
            // Here you would call a service to save the product
            alert('Product published successfully! (Mock)');
            this.router.navigate(['/']);
        }
    }

    onCancel() {
        this.router.navigate(['/']);
    }
}
