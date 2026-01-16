import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AnnouncementService } from '../../core/services/announcement.service';
import { Announcement } from '../../core/models/announcement.model';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/category.model';
import { AuthService } from '../../core/services/auth';
import { forkJoin, map } from 'rxjs';

interface CategoryWithCount extends Category {
  count: number;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private announcementService = inject(AnnouncementService);
  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;

  searchQuery: string = '';
  isFilterOpen = false;
  currentFilter = 'Newest';
  selectedProduct = signal<Announcement | null>(null);

  listings = signal<Announcement[]>([]);
  categoriesWithCounts = signal<CategoryWithCount[]>([]);

  ngOnInit() {
    this.announcementService.getAnnouncements().subscribe((data) => {
      this.listings.set(data);
    });

    this.categoryService.getCategories().subscribe((cats) => {
      // Create an array of observables to fetch counts for each category
      const requests = cats.map(cat =>
        this.announcementService.getAnnouncementsByCategoryId(cat.categoryId).pipe(
          map(items => ({ ...cat, count: items.length }))
        )
      );

      // Execute all requests in parallel
      forkJoin(requests).subscribe(results => {
        this.categoriesWithCounts.set(results);
      });
    });
  }

  toggleFilter() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  selectCategory(categoryId: number) {
    this.announcementService.getAnnouncementsByCategoryId(categoryId).subscribe(data => {
      this.listings.set(data);
    });
  }

  resetCategory() {
    this.announcementService.getAnnouncements().subscribe(data => {
      this.listings.set(data);
    });
  }

  executeSearch() {
    if (!this.searchQuery.trim()) {
      this.resetCategory();
      return;
    }

    this.announcementService.searchAnnouncements(this.searchQuery).subscribe(data => {
      this.listings.set(data);
    });
  }

  clearSearch() {
    this.searchQuery = '';
    this.resetCategory();
  }

  openProduct(product: Announcement) {
    this.selectedProduct.set(product);
  }

  closeProduct() {
    this.selectedProduct.set(null);
  }

  applyFilter(type: string) {
    this.currentFilter = type;
    this.isFilterOpen = false;

    this.listings.update((currentListings) => {
      const sorted = [...currentListings];
      switch (type) {
        case 'Newest':
          sorted.sort((a, b) => (b.id || 0) - (a.id || 0));
          break;
        case 'Oldest':
          sorted.sort((a, b) => (a.id || 0) - (b.id || 0));
          break;
        case 'Price: Low to High':
          sorted.sort((a, b) => a.price - b.price);
          break;
        case 'Price: High to Low':
          sorted.sort((a, b) => b.price - a.price);
          break;
        // Rating removed as it is not in the model
      }
      return sorted;
    });
  }
}
