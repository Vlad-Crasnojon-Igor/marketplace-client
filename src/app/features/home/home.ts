import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Listing {
  id: number;
  title: string;
  price: number;
  bids: number;
  timeLeft: string;
  seller: string;
  rating: number;
  description: string;
  phone: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  searchQuery: string = '';
  isFilterOpen = false;
  currentFilter = 'Newest';
  selectedProduct: Listing | null = null;

  listings: Listing[] = [
    { id: 1, title: 'Laptop ThinkPad T480 - Refurbished', price: 1200, bids: 5, timeLeft: '2h 15m', seller: 'user_it', rating: 4.8, description: 'Intel Core i5-8350U, 16GB RAM, 512GB SSD. Perfect condition.', phone: '0722 123 456' },
    { id: 2, title: 'Iphone 12 Mini 64GB', price: 1500, bids: 0, timeLeft: '1d 4h', seller: 'alex_gsm', rating: 4.5, description: 'Blue color, battery health 88%, comes with box and cable.', phone: '0744 555 666' },
    { id: 3, title: 'Monitor Dell Ultrasharp 27"', price: 850, bids: 12, timeLeft: '30m', seller: 'office_supply', rating: 4.9, description: 'U2719D Model, QHD resolution, IPS panel. No dead pixels.', phone: '0766 888 999' },
    { id: 4, title: 'Custom Mechanical Keyboard', price: 400, bids: 2, timeLeft: '4h', seller: 'key_master', rating: 5.0, description: 'Keychron K2, Brown switches, RGB backlight. Aluminum frame.', phone: '0733 444 555' },
    { id: 5, title: 'Sony PlayStation 4 Pro', price: 900, bids: 8, timeLeft: '5h 20m', seller: 'gamer_ro', rating: 4.7, description: '1TB storage, comes with 2 controllers and God of War.', phone: '0755 111 222' },
    { id: 6, title: 'Vintage Road Bike', price: 650, bids: 1, timeLeft: '3d', seller: 'velo_city', rating: 4.2, description: 'Peugeot frame, Shimano gears, new tires. Ready to ride.', phone: '0721 987 654' },
  ];

  toggleFilter() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  openProduct(product: Listing) {
    this.selectedProduct = product;
  }

  closeProduct() {
    this.selectedProduct = null;
  }

  applyFilter(type: string) {
    this.currentFilter = type;
    this.isFilterOpen = false;

    switch (type) {
      case 'Newest':
        this.listings.sort((a, b) => b.id - a.id);
        break;
      case 'Oldest':
        this.listings.sort((a, b) => a.id - b.id);
        break;
      case 'Price: Low to High':
        this.listings.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        this.listings.sort((a, b) => b.price - a.price);
        break;
      case 'Rating':
        this.listings.sort((a, b) => b.rating - a.rating);
        break;
    }
  }
}
