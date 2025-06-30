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

  // Add inventory modal
  showAddInventoryModal = false;
  addingInventory = false;
  films: any[] = [];
  newInventory = {
    film_id: null,
    store_id: null,
    quantity: 1
  };

  constructor(private filmService: FilmService) {}

  ngOnInit(): void {
    this.loadInventoryData();
    this.loadFilms();
  }

  loadFilms(): void {
    // Load films for the add inventory dropdown
    this.filmService.getFilms(1, 100).subscribe({
      next: (response) => {
        this.films = response.films || [];
      },
      error: (error) => {
        console.error('Error loading films:', error);
        this.films = [];
      }
    });
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

  // Add inventory methods
  openAddInventoryModal(): void {
    this.showAddInventoryModal = true;
    this.resetNewInventory();
  }

  closeAddInventoryModal(): void {
    this.showAddInventoryModal = false;
    this.resetNewInventory();
  }

  resetNewInventory(): void {
    this.newInventory = {
      film_id: null,
      store_id: null,
      quantity: 1
    };
  }

  addInventory(): void {
    if (!this.newInventory.film_id || !this.newInventory.store_id || this.newInventory.quantity < 1) {
      alert('Please fill in all required fields with valid values.');
      return;
    }

    this.addingInventory = true;

    const inventoryData = {
      film_id: Number(this.newInventory.film_id),
      store_id: Number(this.newInventory.store_id),
      quantity: this.newInventory.quantity
    };

    this.filmService.addInventory(inventoryData).subscribe({
      next: (response) => {
        console.log('Inventory added successfully:', response);
        this.addingInventory = false;
        this.closeAddInventoryModal();
        this.loadInventoryData(); // Refresh the inventory data
        alert('Inventory added successfully!');
      },
      error: (error) => {
        console.error('Error adding inventory:', error);
        this.addingInventory = false;
        alert('Failed to add inventory. Please try again.');
      }
    });
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
