import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { SizeSelectorComponent } from '../../components/size-selector/size-selector.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, SizeSelectorComponent],
  template: `
    <div class="container" *ngIf="product; else loading">
      <div class="breadcrumb">
        <a routerLink="/products">Produse</a>
        <span>></span>
        <span>{{ product.category }}</span>
        <span>></span>
        <span>{{ product.name }}</span>
      </div>

      <div class="product-detail">
        <div class="product-gallery">
          <div class="main-image">
            <div class="image-wrapper">
              <img [src]="selectedImage" [alt]="product.name" loading="lazy" (click)="openImageModal()">
              <div class="image-overlay" (click)="openImageModal()">
                <span class="expand-icon">🔍</span>
              </div>
            </div>
          </div>
          <div class="thumbnail-images" *ngIf="product.images && product.images.length > 1">
            <img 
              *ngFor="let image of product.images; let i = index"
              [src]="image" 
              [alt]="product.name + ' ' + (i + 1)"
              (click)="selectImage(image)"
              [class.active]="image === selectedImage"
              class="thumbnail"
            >
          </div>
        </div>

        <div class="product-info">
          <div class="product-header">
            <h1 class="product-title">{{ product.name }}</h1>
            <div class="product-rating" *ngIf="product.rating">
              <div class="stars">
                <span *ngFor="let star of getStars(product.rating)" class="star">★</span>
              </div>
              <span class="rating-text">{{ product.rating }} ({{ product.reviewCount }} recenzii)</span>
            </div>
          </div>

          <div class="product-description">
            <p>{{ product.description }}</p>
          </div>

          <div class="product-price">
            <div class="price-info">
              <span class="current-price">{{ product.price | currency:'EUR':'symbol':'1.2-2' }}</span>
              <span class="original-price" *ngIf="product.originalPrice">
                {{ product.originalPrice | currency:'EUR':'symbol':'1.0-0' }}
              </span>
              <div class="discount-badge" *ngIf="product.originalPrice">
                Economisești {{ getDiscountAmount(product.price, product.originalPrice) | currency:'EUR':'symbol':'1.0-0' }}
              </div>
            </div>
            <button class="btn-favorite" (click)="toggleFavorite()">
              <span class="favorite-icon">{{ isFavorite ? '❤️' : '🤍' }}</span>
            </button>
          </div>

          <div class="product-price-ranges" *ngIf="getPriceRanges().length > 0">
            <h3>Prețuri pe intervale de mărimi:</h3>
            <div class="price-ranges-list">
              <div class="price-range-item" *ngFor="let range of getPriceRanges()">
                <div class="range-info">
                  <span class="size-range">{{ range.sizeRange }}</span>
                  <span class="stock-info" [class.in-stock]="range.isAvailable" [class.out-of-stock]="!range.isAvailable">
                    {{ range.isAvailable ? (range.stock ? range.stock + ' bucăți' : 'În stoc') : 'Indisponibil' }}
                  </span>
                </div>
                <span class="price">{{ range.price | currency:'EUR':'symbol':'1.2-2' }}</span>
              </div>
            </div>
          </div>

          <div class="product-meta">
            <div class="meta-item">
              <strong>SKU:</strong> {{ product.sku }}
            </div>
            <div class="meta-item">
              <strong>Stoc:</strong> 
              <span [class]="product.stock > 0 ? 'in-stock' : 'out-of-stock'">
                {{ product.stock > 0 ? 'În stoc (' + product.stock + ' bucăți)' : 'Indisponibil' }}
              </span>
            </div>
          </div>


          <div class="product-specifications" *ngIf="product.specifications">
            <h3>Specificații tehnice:</h3>
            <div class="specs-grid">
              <div class="spec-item" *ngFor="let spec of getSpecifications()">
                <span class="spec-label">{{ spec.label }}:</span>
                <span class="spec-value">{{ spec.value }}</span>
              </div>
            </div>
          </div>

          <div class="product-actions">
            <app-size-selector 
              [product]="product"
              (addedToCart)="onAddedToCart()"
            ></app-size-selector>
          </div>

        </div>
      </div>

      <div class="related-products" *ngIf="relatedProducts.length > 0">
        <h2>Produse similare</h2>
        <div class="related-grid">
          <div class="related-card" *ngFor="let relatedProduct of relatedProducts">
            <img [src]="relatedProduct.image" [alt]="relatedProduct.name" loading="lazy">
            <div class="related-info">
              <h4>{{ relatedProduct.name }}</h4>
              <div class="related-price">{{ relatedProduct.price | currency:'EUR':'symbol':'1.0-0' }}</div>
              <button class="btn btn-primary" [routerLink]="['/product', relatedProduct.id]">
                Vezi detalii
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loading>
      <div class="loading">
        <div class="spinner"></div>
        <p>Se încarcă produsul...</p>
      </div>
    </ng-template>

    <!-- Modal pentru carusel imagini -->
    <div class="image-modal" *ngIf="showImageModal" (click)="closeImageModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="closeImageModal()">×</button>
        
        <div class="carousel-container">
          <button class="carousel-btn prev-btn" (click)="previousImage()" [disabled]="currentImageIndex === 0">‹</button>
          
          <div class="carousel-image">
            <img [src]="product?.images?.[currentImageIndex]" [alt]="product?.name + ' ' + (currentImageIndex + 1)">
          </div>
          
          <button class="carousel-btn next-btn" (click)="nextImage()" [disabled]="currentImageIndex === (product?.images?.length || 0) - 1">›</button>
        </div>
        
        <div class="carousel-thumbnails" *ngIf="hasMultipleImages()">
          <img 
            *ngFor="let image of product?.images; let i = index"
            [src]="image" 
            [alt]="product?.name + ' ' + (i + 1)"
            (click)="setCurrentImage(i)"
            [class.active]="i === currentImageIndex"
            class="carousel-thumbnail"
          >
        </div>
        
        <div class="image-counter" *ngIf="hasMultipleImages()">
          {{ currentImageIndex + 1 }} / {{ product?.images?.length }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 2rem;
      font-size: 0.9rem;
      color: #6b7280;
    }
    
    .breadcrumb a {
      color: #3b82f6;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
    
    .product-detail {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      margin-bottom: 4rem;
    }
    
    .product-gallery {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .main-image {
      width: 100%;
      height: 400px;
      border-radius: 12px;
      overflow: hidden;
      background: #f8f9fa;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .image-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .main-image img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      background: transparent;
      cursor: pointer;
      transition: transform 0.3s ease;
    }

    .image-wrapper:hover img {
      transform: scale(1.02);
    }
    
    .thumbnail-images {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      padding: 0.5rem 0;
    }
    
    .thumbnail {
      width: 80px;
      height: 80px;
      object-fit: contain;
      border-radius: 8px;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.3s ease;
      border: 2px solid transparent;
      background: #f8f9fa;
      
      &:hover,
      &.active {
        opacity: 1;
        border-color: #3b82f6;
      }
    }
    
    .product-info {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .product-header {
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 1rem;
    }
    
    .product-title {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 0.5rem;
      line-height: 1.3;
    }
    
    .product-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .stars {
      color: #fbbf24;
      font-size: 1.1rem;
    }
    
    .rating-text {
      color: #6b7280;
      font-size: 0.9rem;
    }
    
    .product-description {
      font-size: 1.1rem;
      line-height: 1.6;
      color: #4b5563;
    }
    
    .product-price {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .price-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .btn-favorite {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.75rem;
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
      font-size: 1.5rem;
      transition: all 0.3s ease;
    }
    
    .current-price {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1f2937;
    }
    
    .original-price {
      font-size: 1.5rem;
      color: #9ca3af;
      text-decoration: line-through;
    }
    
    .discount-badge {
      background: #dcfce7;
      color: #166534;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 600;
    }
    
    .product-price-ranges {
      background: #f0f9ff;
      padding: 1.5rem;
      border-radius: 8px;
      border-left: 4px solid #3b82f6;
      margin-bottom: 2.5rem;
    }
    
    .product-price-ranges h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e40af;
      margin-bottom: 1rem;
    }
    
    .price-ranges-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .price-range-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: white;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
    }
    
    .range-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .size-range {
      font-weight: 600;
      color: #374151;
      font-size: 1rem;
    }
    
    .stock-info {
      font-size: 0.85rem;
      font-weight: 500;
      
      &.in-stock {
        color: #059669;
      }
      
      &.out-of-stock {
        color: #dc2626;
      }
    }
    
    .price {
      font-weight: 700;
      color: #1f2937;
      font-size: 1.1rem;
    }

    .product-meta {
      background: #f9fafb;
      padding: 1.5rem;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }
    
    .meta-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .in-stock {
      color: #059669;
      font-weight: 600;
    }
    
    .out-of-stock {
      color: #dc2626;
      font-weight: 600;
    }
    
    .product-specifications {
      margin-bottom: 2rem;
    }

    .product-specifications h3 {
      font-size: 1.2rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 1rem;
    }
    
    .specs-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }
    
    .spec-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .spec-label {
      font-weight: 600;
      color: #374151;
    }
    
    .spec-value {
      color: #6b7280;
    }
    
    .product-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-top: 1rem;
      padding: 1.5rem;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }
    
    .btn-large {
      padding: 1rem 2rem;
      font-size: 1.1rem;
      min-width: 150px;
    }
    
    
    .related-products {
      margin-top: 4rem;
      padding-top: 2rem;
      border-top: 1px solid #e5e7eb;
    }
    
    .related-products h2 {
      font-size: 1.8rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 2rem;
    }
    
    .related-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }
    
    .related-card {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
      }
    }
    
    .related-card img {
      width: 100%;
      height: 150px;
      object-fit: contain;
      background: #f8f9fa;
    }
    
    .related-info {
      padding: 1rem;
    }
    
    .related-info h4 {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }
    
    .related-price {
      font-size: 1.1rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 1rem;
    }
    
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      color: #6b7280;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e5e7eb;
      border-top: 4px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @media (max-width: 768px) {
      .product-detail {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      
      .product-title {
        font-size: 1.5rem;
      }
      
      .current-price {
        font-size: 2rem;
      }
      
      .product-actions {
        flex-direction: column;
        padding: 1rem;
        margin-top: 1.5rem;
      }
      
      .btn-large {
        width: 100%;
      }
    }

    /* Stiluri pentru modal și carusel */
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
      pointer-events: none;
      border-radius: 8px;
    }

    .image-wrapper:hover .image-overlay {
      opacity: 1;
      pointer-events: auto;
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
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: flex-start;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
      padding-top: 2rem;
      overflow-y: auto;
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

    .carousel-container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      max-width: 90vw;
      max-height: 80vh;
    }

    .carousel-image {
      max-width: 100%;
      max-height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .carousel-image img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      border-radius: 8px;
      max-width: 1000px;
      max-height: 800px;
    }

    .carousel-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(0, 0, 0, 0.5);
      color: white;
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      font-size: 1.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      z-index: 1002;

      &:hover:not(:disabled) {
        background: rgba(0, 0, 0, 0.7);
        transform: translateY(-50%) scale(1.1);
      }

      &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      &.prev-btn {
        left: 1rem;
      }

      &.next-btn {
        right: 1rem;
      }
    }

    .carousel-thumbnails {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 1rem;
      padding: 0 2rem;
    }

    .carousel-thumbnail {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 6px;
      cursor: pointer;
      opacity: 0.7;
      transition: all 0.3s ease;
      border: 2px solid transparent;

      &:hover {
        opacity: 1;
        transform: scale(1.05);
      }

      &.active {
        opacity: 1;
        border-color: #3b82f6;
        transform: scale(1.1);
      }
    }

    .image-counter {
      text-align: center;
      color: white;
      font-size: 0.9rem;
      margin-top: 0.5rem;
      background: rgba(0, 0, 0, 0.5);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      display: inline-block;
      margin-left: 50%;
      transform: translateX(-50%);
    }

    @media (max-width: 768px) {
      .image-modal {
        padding-top: 1rem;
      }

      .carousel-container {
        max-width: 98vw;
        max-height: 70vh;
      }

      .carousel-btn {
        width: 40px;
        height: 40px;
        font-size: 1.2rem;

        &.prev-btn {
          left: 0.5rem;
        }

        &.next-btn {
          right: 0.5rem;
        }
      }

      .carousel-thumbnails {
        padding: 0 1rem;
      }

      .carousel-thumbnail {
        width: 50px;
        height: 50px;
      }

      .carousel-image img {
        max-width: 500px;
        max-height: 450px;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  selectedImage: string = '';
  relatedProducts: Product[] = [];
  isFavorite: boolean = false;
  
  // Proprietăți pentru carusel
  showImageModal: boolean = false;
  currentImageIndex: number = 0;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Scroll la începutul paginii când se încarcă componenta
    window.scrollTo(0, 0);
    
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.loadProduct(productId);
    });
  }

  private loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe(product => {
      if (product) {
        this.product = product;
        this.selectedImage = product.image;
        this.loadRelatedProducts();
        this.checkFavoriteStatus();
        
        // Scroll la începutul paginii după ce se încarcă produsul
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);
      } else {
        this.router.navigate(['/products']);
      }
    });
  }

  private loadRelatedProducts(): void {
    if (!this.product) return;

    this.productService.getProductsByCategory(this.product.category).subscribe(products => {
      this.relatedProducts = products
        .filter(p => p.id !== this.product!.id)
        .slice(0, 4);
    });
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  getStars(rating: number): number[] {
    const stars = Math.floor(rating);
    return Array(stars).fill(0);
  }

  getDiscountAmount(currentPrice: number, originalPrice: number): number {
    return originalPrice - currentPrice;
  }

  getSpecifications(): { label: string; value: string }[] {
    if (!this.product?.specifications) return [];
    
    return Object.entries(this.product.specifications).map(([key, value]) => ({
      label: key,
      value: value
    }));
  }

  getPriceRanges(): { sizeRange: string; price: number; stock?: number; isAvailable?: boolean }[] {
    if (!this.product?.priceRanges) return [];
    
    return this.product.priceRanges.map(range => ({
      sizeRange: range.sizeRange,
      price: range.price,
      stock: range.stock,
      isAvailable: range.isAvailable
    }));
  }

  onAddedToCart(): void {
    // Poți adăuga aici logica pentru notificări sau alte acțiuni după adăugarea în coș
    console.log('Produs adăugat în coș!');
  }

  private checkFavoriteStatus(): void {
    if (!this.product) return;
    
    try {
      const favoritesData = localStorage.getItem('favorites');
      if (favoritesData) {
        const favoritesArray = JSON.parse(favoritesData);
        this.isFavorite = favoritesArray.includes(this.product.id);
      }
    } catch (error) {
      console.error('Eroare la verificarea favoritelor:', error);
    }
  }

  toggleFavorite(): void {
    if (!this.product) return;

    try {
      const favoritesData = localStorage.getItem('favorites');
      let favoritesArray = favoritesData ? JSON.parse(favoritesData) : [];

      if (this.isFavorite) {
        favoritesArray = favoritesArray.filter((id: number) => id !== this.product!.id);
      } else {
        favoritesArray.push(this.product.id);
      }

      localStorage.setItem('favorites', JSON.stringify(favoritesArray));
      this.isFavorite = !this.isFavorite;
    } catch (error) {
      console.error('Eroare la gestionarea favoritelor:', error);
    }
  }

  // Metode pentru carusel
  openImageModal(): void {
    if (this.product && this.product.images && this.product.images.length > 0) {
      this.currentImageIndex = this.product.images.indexOf(this.selectedImage);
      if (this.currentImageIndex === -1) {
        this.currentImageIndex = 0;
      }
      
      // Salvează poziția curentă de scroll
      const scrollY = window.scrollY;
      
      this.showImageModal = true;
      
      // Previne scroll-ul paginii când se deschide modalul
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    }
  }

  closeImageModal(): void {
    this.showImageModal = false;
    
    // Restaurează scroll-ul paginii când se închide modalul
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    
    // Restaurează poziția de scroll
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }

  nextImage(): void {
    if (this.product && this.product.images && this.currentImageIndex < this.product.images.length - 1) {
      this.currentImageIndex++;
    }
  }

  previousImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  setCurrentImage(index: number): void {
    this.currentImageIndex = index;
  }

  hasMultipleImages(): boolean {
    return !!(this.product?.images && this.product.images.length > 1);
  }
}
