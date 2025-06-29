import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilmService } from '../../../service/film.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class InventoryComponent implements OnInit {
  inventoryData: any[] = [];
  loading = false;
  
  // Filter options
  filmTitle = '';
  selectedCategory = '';
  selectedStoreId: number | null = null;
  
  // Available options for dropdowns
  categories = ['action', 'comedy', 'drama', 'horror', 'sci-fi', 'romance', 'documentary'];
  stores = [
    { id: 1, name: 'Store 1' },
    { id: 2, name: 'Store 2' }
  ];

  constructor(private filmService: FilmService) {}

  ngOnInit(): void {
    this.loadInventoryData();
  }

  loadInventoryData(): void {
    this.loading = true;
    
    const params: any = {
      groupBy: 'film'  // Always group by film
    };
    
    if (this.filmTitle.trim()) {
      params.film_title = this.filmTitle.trim();
    }
    
    if (this.selectedCategory) {
      params.category = this.selectedCategory;
    }
    
    if (this.selectedStoreId) {
      params.store_id = this.selectedStoreId;
    }

    this.filmService.getInventoryData(params).subscribe({
      next: (response) => {
        console.log('Inventory API Response:', response);
        // Handle the actual API response structure
        this.inventoryData = response?.results || [];
        this.loading = false;
        console.log('Processed inventory data:', this.inventoryData);
      },
      error: (error) => {
        console.error('Error loading inventory data:', error);
        console.log('Using mock data for development...');
        // Use mock data for development if API is not available
        this.inventoryData = this.getMockInventoryData();
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.loadInventoryData();
  }

  onClearFilters(): void {
    this.filmTitle = '';
    this.selectedCategory = '';
    this.selectedStoreId = null;
    this.loadInventoryData();
  }

  private getMockInventoryData(): any[] {
    return [
      {
        film_title: 'The Matrix',
        total_copies: 15,
        release_year: 1999,
        rating: 'R',
        category: 'Action',
        stores: [
          { store_name: 'Store 1', count: 8 },
          { store_name: 'Store 2', count: 7 }
        ]
      },
      {
        film_title: 'Finding Nemo',
        total_copies: 12,
        release_year: 2003,
        rating: 'G',
        category: 'Animation',
        stores: [
          { store_name: 'Store 1', count: 5 },
          { store_name: 'Store 2', count: 7 }
        ]
      }
    ];
  }
}
