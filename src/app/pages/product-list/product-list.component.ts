import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product, ProductFilter } from '../../models/product.model';
import { FilterDropdownComponent } from '../../components/filter-dropdown/filter-dropdown.component';
import { GenderFilter } from '../../components/gender-filter/gender-filter.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FilterDropdownComponent],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>{{ pageTitle }}</h1>
        <p class="page-description">{{ pageDescription }}</p>
      </div>

      <div class="filters-section">
        <div class="search-bar">
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (input)="onSearch()"
            placeholder="Caută produse..."
            class="search-input"
          >
        </div>
        
        <div class="filters-container">
          <app-filter-dropdown
            label="Gen"
            [options]="genderOptions"
            [selectedValue]="selectedGenderFilter"
            (selectionChange)="onGenderFilterChange($event)">
          </app-filter-dropdown>
          
          <app-filter-dropdown
            label="Categorie"
            [options]="categoryOptions"
            [selectedValue]="selectedCategory"
            (selectionChange)="onCategoryChange($event)">
          </app-filter-dropdown>
          
          <app-filter-dropdown
            label="Preț"
            [options]="priceRanges"
            [selectedValue]="selectedPriceRange"
            (selectionChange)="onPriceRangeChange($event)">
          </app-filter-dropdown>
          
          <app-filter-dropdown
            label="Sortare"
            [options]="sortOptions"
            [selectedValue]="sortBy"
            (selectionChange)="onSortChange($event)">
          </app-filter-dropdown>
        </div>
      </div>

      <div class="products-grid" *ngIf="filteredProducts && filteredProducts.length > 0; else noProducts">
        <div class="product-card" *ngFor="let product of filteredProducts" (click)="navigateToProduct(product)" [class.clickable]="true">
        <div class="product-image" (click)="expandImage(product, $event)">
          <img [src]="product.image" [alt]="product.name" loading="lazy" style="object-fit: contain; background: #f8f9fa;">
            <div class="product-badge" *ngIf="product.originalPrice">
              -{{ getDiscountPercentage(product.price, product.originalPrice) }}%
            </div>
            <div class="image-overlay">
              <span class="expand-icon">🔍</span>
            </div>
          </div>
          
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-description">{{ product.description }}</p>
            
            <div class="product-rating" *ngIf="product.rating">
              <div class="stars">
                <span *ngFor="let star of getStars(product.rating)" class="star">★</span>
              </div>
              <span class="rating-text">{{ product.rating }} ({{ product.reviewCount }})</span>
            </div>
            
          <div class="product-price">
            <div class="price-info">
              <span class="current-price">{{ product.price | currency:'EUR':'symbol':'1.2-2' }}</span>
              <span class="original-price" *ngIf="product.originalPrice">
                {{ product.originalPrice | currency:'EUR':'symbol':'1.0-0' }}
              </span>
            </div>
            <button class="btn-favorite" (click)="toggleFavorite(product, $event)">
              <span class="favorite-icon">{{ isFavorite(product) ? '❤️' : '🤍' }}</span>
            </button>
          </div>
          
          <div class="product-price-ranges" *ngIf="product.priceRanges && product.priceRanges.length > 1">
            <div class="price-ranges-compact">
              <span class="price-range-item" *ngFor="let range of product.priceRanges.slice(0, 2)">
                <span class="size-range">{{ range.sizeRange }}:</span>
                <span class="price">{{ range.price | currency:'EUR':'symbol':'1.2-2' }}</span>
              </span>
              <span *ngIf="product.priceRanges.length > 2" class="more-prices">+{{ product.priceRanges.length - 2 }} prețuri</span>
            </div>
          </div>
            
            <div class="product-sizes" *ngIf="product.features && product.features.length > 0">
              <strong>Mărimi disponibile:</strong>
              <div class="sizes-container">
                <span 
                  *ngFor="let size of product.features.slice(0, 6); let i = index"
                  class="size-chip"
                  [class.more-sizes]="i === 5 && product.features.length > 6"
                >
                  {{ i === 5 && product.features.length > 6 ? '+' + (product.features.length - 5) : extractSizeNumber(size) }}
                </span>
              </div>
            </div>
            
            <div class="product-actions" (click)="$event.stopPropagation()">
              <button 
                class="btn btn-primary" 
                [routerLink]="['/product', product.id]"
                [disabled]="!product.isAvailable"
              >
                {{ product.isAvailable ? 'Adaugă în coș' : 'Indisponibil' }}
              </button>
              <button 
                class="btn btn-secondary" 
                [routerLink]="['/product', product.id]"
              >
                Vezi detalii
              </button>
            </div>
          </div>
        </div>
      </div>

      <ng-template #noProducts>
        <div class="no-products">
          <h3>Nu s-au găsit produse</h3>
          <p>Încearcă să modifici filtrele sau termenii de căutare.</p>
          <p>Debug: Total produse: {{ products.length }}, Produse filtrate: {{ filteredProducts.length || 0 }}</p>
        </div>
      </ng-template>
    </div>

    <!-- Modal pentru expand imagine -->
    <div class="image-modal" *ngIf="expandedImage" (click)="closeImageModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="closeImageModal()">×</button>
        <img [src]="expandedImage.image" [alt]="expandedImage.name" class="modal-image">
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      text-align: center;
      margin-bottom: 3rem;
    }
    
    .page-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 1rem;
    }
    
    .page-description {
      font-size: 1.1rem;
      color: #6b7280;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .filters-section {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }
    
    .search-bar {
      margin-bottom: 1.5rem;
    }
    
    .search-input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
      
      &:focus {
        outline: none;
        border-color: #3b82f6;
      }
    }
    
    .filters-container {
      display: flex;
      justify-content: flex-start;
      align-items: flex-end;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    
    
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .product-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      
      &.clickable {
        cursor: pointer;
      }
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      }
    }
    
    .product-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }
    
    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      transition: transform 0.3s ease;
      background: #f8f9fa;
    }
    
    .product-card:hover .product-image img {
      transform: scale(1.05);
    }
    
    .product-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: #ef4444;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 600;
    }
    

    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      cursor: pointer;
    }

    .product-image:hover .image-overlay {
      opacity: 1;
    }

    .expand-icon {
      font-size: 2rem;
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }

    .image-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
    }

    .modal-content {
      position: relative;
      max-width: 95vw;
      max-height: 95vh;
      background: transparent;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    .close-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(0, 0, 0, 0.5);
      color: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      font-size: 1.5rem;
      cursor: pointer;
      z-index: 1001;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.3s ease;

      &:hover {
        background: rgba(0, 0, 0, 0.7);
      }
    }

    .modal-image {
      width: 100%;
      height: auto;
      max-height: 95vh;
      object-fit: contain;
      background: #f8f9fa;
      border-radius: 12px;
    }
    
    .product-info {
      padding: 1.5rem;
    }
    
    .product-name {
      font-size: 1.2rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.5rem;
      line-height: 1.4;
    }
    
    .product-description {
      color: #6b7280;
      font-size: 0.9rem;
      margin-bottom: 1rem;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .product-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    
    .stars {
      color: #fbbf24;
    }
    
    .rating-text {
      font-size: 0.8rem;
      color: #6b7280;
    }
    
    .product-price {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .price-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-favorite {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 50%;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-favorite:hover {
      background: #f3f4f6;
      transform: scale(1.1);
    }

    .favorite-icon {
      font-size: 1.2rem;
      transition: all 0.3s ease;
    }
    
    .product-sizes {
      margin-bottom: 1rem;
      font-size: 0.9rem;
      color: #6b7280;
    }
    
    .sizes-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
      margin-top: 0.5rem;
    }
    
    .size-chip {
      background: #f3f4f6;
      color: #374151;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 500;
      border: 1px solid #e5e7eb;
      transition: all 0.2s ease;
      cursor: pointer;
      min-width: 24px;
      text-align: center;
    }
    
    .size-chip:hover {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
      transform: translateY(-1px);
    }
    
    .size-chip.more-sizes {
      background: #6b7280;
      color: white;
      border-color: #6b7280;
    }
    
    .size-chip.more-sizes:hover {
      background: #4b5563;
      border-color: #4b5563;
    }
    
    .product-price-ranges {
      margin-bottom: 1rem;
      padding: 0.75rem;
      background: #f0f9ff;
      border-radius: 6px;
      border-left: 3px solid #3b82f6;
    }
    
    .price-ranges-compact {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .price-range-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
    }
    
    .size-range {
      font-weight: 600;
      color: #374151;
    }
    
    .price {
      font-weight: 700;
      color: #1f2937;
    }
    
    .more-prices {
      font-size: 0.8rem;
      color: #6b7280;
      font-style: italic;
      text-align: center;
      margin-top: 0.25rem;
    }
    
    .current-price {
      font-size: 1.3rem;
      font-weight: 700;
      color: #1f2937;
    }
    
    .original-price {
      font-size: 1rem;
      color: #9ca3af;
      text-decoration: line-through;
      margin-left: 0.5rem;
    }
    
    .product-actions {
      display: flex;
      gap: 0.5rem;
    }
    
    .no-products {
      text-align: center;
      padding: 4rem 2rem;
      color: #6b7280;
    }
    
    .no-products h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #1f2937;
    }
    
    @media (max-width: 768px) {
      .products-grid {
        grid-template-columns: 1fr;
      }
      
      .filters {
        justify-content: stretch;
      }
      
      .filter-select {
        width: 100%;
      }
      
      .page-header h1 {
        font-size: 2rem;
      }
      
      .sizes-container {
        gap: 0.2rem;
      }
      
      .size-chip {
        font-size: 0.75rem;
        padding: 0.2rem 0.4rem;
        min-width: 20px;
      }
      
      
      
      .filters-container {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  favorites: Set<number> = new Set();
  expandedImage: Product | null = null;
  
  searchQuery: string = '';
  sortBy: string = 'name';
  selectedPriceRange: string = 'all';
  selectedGenderFilter: GenderFilter = 'all';
  selectedCategory: string = 'all';
  
  priceRanges = [
    { value: 'all', label: 'Toate prețurile' },
    { value: '0-20', label: 'Sub 20€' },
    { value: '20-30', label: '20€ - 30€' },
    { value: '30-50', label: '30€ - 50€' }
  ];

  genderOptions = [
    { value: 'all', label: 'Toate' },
    { value: 'boy', label: 'Băieți' },
    { value: 'girl', label: 'Fete' }
  ];

  sortOptions = [
    { value: 'name', label: 'Nume' },
    { value: 'price-asc', label: 'Preț crescător' },
    { value: 'price-desc', label: 'Preț descrescător' },
    { value: 'rating', label: 'Rating' }
  ];

  categoryOptions = [
    { value: 'all', label: 'Toate categoriile' },
    { value: 'Balerini', label: 'Balerini' },
    { value: 'Ghete', label: 'Ghete' },
    { value: 'Pantofi Sport', label: 'Pantofi Sport' },
    { value: 'Cizme', label: 'Cizme' }
  ];
  
  pageTitle: string = 'Toate produsele';
  pageDescription: string = 'Descoperă gama noastră completă de produse de calitate';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadFavorites();
  }

  private loadProducts(): void {
    console.log('ProductListComponent: Încep să încarc produsele...');
    this.productService.getProducts().subscribe(products => {
      console.log('ProductListComponent: Produse încărcate:', products.length);
      console.log('ProductListComponent: Primele 3 produse:', products.slice(0, 3));
      this.products = products;
      this.filteredProducts = [...products];
      this.applySorting();
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onSortChange(sortValue: string): void {
    this.sortBy = sortValue;
    this.applySorting();
  }

  onPriceRangeChange(range: string): void {
    this.selectedPriceRange = range;
    this.applyFilters();
  }

  onGenderFilterChange(gender: string): void {
    this.selectedGenderFilter = gender as GenderFilter;
    this.applyFilters();
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  private applyFilters(): void {
    const filter: ProductFilter = {
      search: this.searchQuery || undefined,
      gender: this.selectedGenderFilter !== 'all' ? this.selectedGenderFilter : undefined,
      category: this.selectedCategory !== 'all' ? this.selectedCategory : undefined
    };

    this.productService.filterProducts(filter).subscribe(filtered => {
      this.filteredProducts = filtered;
      this.applyPriceFilter();
      this.applySorting();
    });
  }

  private applyPriceFilter(): void {
    if (this.selectedPriceRange === 'all') {
      return; // Nu aplicăm filtrarea după preț
    }

    this.filteredProducts = this.filteredProducts.filter(product => {
      const price = product.price;
      
      switch (this.selectedPriceRange) {
        case '0-20':
          return price < 20;
        case '20-30':
          return price >= 20 && price <= 30;
        case '30-50':
          return price >= 30 && price <= 50;
        default:
          return true;
      }
    });
  }

  private applySorting(): void {
    switch (this.sortBy) {
      case 'name':
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-asc':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        this.filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }
  }

  getDiscountPercentage(currentPrice: number, originalPrice: number): number {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  getStars(rating: number): number[] {
    const stars = Math.floor(rating);
    return Array(stars).fill(0);
  }

  extractSizeNumber(sizeText: string): string {
    // Extrage doar numărul mărimii din textul "Mărimea 22: 3 bucăți"
    const match = sizeText.match(/Mărimea\s+(\d+)/);
    return match ? match[1] : sizeText;
  }

  private loadFavorites(): void {
    try {
      const favoritesData = localStorage.getItem('favorites');
      if (favoritesData) {
        const favoritesArray = JSON.parse(favoritesData);
        this.favorites = new Set(favoritesArray);
      }
    } catch (error) {
      console.error('Eroare la încărcarea favoritelor:', error);
    }
  }

  private saveFavorites(): void {
    try {
      const favoritesArray = Array.from(this.favorites);
      localStorage.setItem('favorites', JSON.stringify(favoritesArray));
    } catch (error) {
      console.error('Eroare la salvarea favoritelor:', error);
    }
  }

  toggleFavorite(product: Product, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (this.favorites.has(product.id)) {
      this.favorites.delete(product.id);
    } else {
      this.favorites.add(product.id);
    }
    this.saveFavorites();
  }

  isFavorite(product: Product): boolean {
    return this.favorites.has(product.id);
  }

  navigateToProduct(product: Product): void {
    this.router.navigate(['/product', product.id]);
  }

  expandImage(product: Product, event: Event): void {
    event.stopPropagation();
    this.expandedImage = product;
  }

  closeImageModal(): void {
    this.expandedImage = null;
  }
}
