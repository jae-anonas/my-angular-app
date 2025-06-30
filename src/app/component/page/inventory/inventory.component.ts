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
  filteredFilms: any[] = [];
  filmSearchTerm = '';
  showFilmDropdown = false;
  selectedFilm: any = null;
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
    // Load more films for better search experience
    this.filmService.getFilms(1, 1500).subscribe({
      next: (response) => {
        console.log('Films API Response:', response);
        this.films = response.films || [];
        this.filteredFilms = [...this.films];
        console.log('Loaded films:', this.films.length);
      },
      error: (error) => {
        console.error('Error loading films:', error);
        this.films = [];
        this.filteredFilms = [];
        // You might want to show a user-friendly error message here
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
    // Reset film search
    this.selectedFilm = null;
    this.filmSearchTerm = '';
    this.filteredFilms = [...this.films];
    this.showFilmDropdown = false;
    this.addingInventory = false;
    
    // Debug: Log the number of films available
    console.log('Films available for selection:', this.films.length);
    console.log('Filtered films:', this.filteredFilms.length);
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

  // Film search methods
  onFilmSearchInput(): void {
    const searchTerm = this.filmSearchTerm.trim().toLowerCase();
    
    if (searchTerm === '') {
      this.filteredFilms = [...this.films];
    } else {
      this.filteredFilms = this.films.filter(film => 
        film.title.toLowerCase().includes(searchTerm) ||
        film.release_year.toString().includes(searchTerm) ||
        (film.description && film.description.toLowerCase().includes(searchTerm)) ||
        (film.category && film.category.toLowerCase().includes(searchTerm))
      );
    }
    
    // Always show dropdown when there are results or when searching
    this.showFilmDropdown = true;
  }

  onFilmSearchFocus(): void {
    this.showFilmDropdown = true;
    // Always show all films when focused, regardless of search term
    if (this.filmSearchTerm.trim() === '') {
      this.filteredFilms = [...this.films];
    } else {
      // Re-run the search to ensure filtered results are current
      this.onFilmSearchInput();
    }
  }

  selectFilm(film: any): void {
    this.selectedFilm = film;
    this.newInventory.film_id = film.film_id;
    this.filmSearchTerm = `${film.title} (${film.release_year})`;
    this.showFilmDropdown = false;
  }

  clearFilmSelection(): void {
    this.selectedFilm = null;
    this.newInventory.film_id = null;
    this.filmSearchTerm = '';
    this.filteredFilms = [...this.films];
    this.showFilmDropdown = false;
  }

  onFilmDropdownBlur(): void {
    // Delay hiding dropdown to allow for click events
    setTimeout(() => {
      this.showFilmDropdown = false;
    }, 200);
  }

  // Add a method to manually trigger dropdown display for debugging
  toggleFilmDropdown(): void {
    this.showFilmDropdown = !this.showFilmDropdown;
    if (this.showFilmDropdown) {
      this.filteredFilms = [...this.films];
    }
    console.log('Dropdown toggled:', this.showFilmDropdown, 'Films available:', this.filteredFilms.length);
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
