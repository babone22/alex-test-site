import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductSize } from '../../models/product.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-size-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="size-selector" *ngIf="availableSizes.length > 0">
      <h4>Selectează mărimea:</h4>
      
      <div class="size-grid">
        <div 
          *ngFor="let size of availableSizes" 
          class="size-option"
          [class.selected]="selectedSize === size.size"
          [class.out-of-stock]="!size.isAvailable"
          (click)="selectSize(size.size)"
        >
          <span class="size-number">{{ size.size }}</span>
          <span class="size-price">{{ size.price | currency:'EUR':'symbol':'1.2-2' }}</span>
          <span class="size-stock" *ngIf="size.stock > 0">{{ size.stock }} buc</span>
        </div>
      </div>

      <div class="quantity-selector" *ngIf="selectedSize">
        <label for="quantity">Cantitate:</label>
        <div class="quantity-controls">
          <button 
            type="button" 
            class="quantity-btn" 
            (click)="decreaseQuantity()"
            [disabled]="quantity <= 1"
          >
            -
          </button>
          <input 
            type="number" 
            id="quantity"
            [(ngModel)]="quantity" 
            min="1" 
            [max]="getMaxQuantity()"
            class="quantity-input"
          >
          <button 
            type="button" 
            class="quantity-btn" 
            (click)="increaseQuantity()"
            [disabled]="quantity >= getMaxQuantity()"
          >
            +
          </button>
        </div>
      </div>

      <div class="add-to-cart-section" *ngIf="selectedSize">
        <div class="price-summary">
          <span class="total-price">
            Total: {{ getTotalPrice() | currency:'EUR':'symbol':'1.2-2' }}
          </span>
        </div>
        
        <button 
          class="btn btn-primary btn-add-to-cart"
          (click)="addToCart()"
          [disabled]="!canAddToCart()"
        >
          <span *ngIf="isInCart">Actualizează în coș</span>
          <span *ngIf="!isInCart">Adaugă în coș</span>
        </button>
      </div>

      <div class="no-sizes" *ngIf="availableSizes.length === 0">
        <p>Acest produs nu este disponibil în nicio mărime.</p>
      </div>
    </div>
  `,
  styles: [`
    .size-selector {
      margin-top: 1rem;
    }

    .size-selector h4 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .size-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .size-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.75rem 0.5rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      background: white;
      text-align: center;
    }

    .size-option:hover {
      border-color: #3b82f6;
      background: #f0f9ff;
    }

    .size-option.selected {
      border-color: #3b82f6;
      background: #dbeafe;
    }

    .size-option.out-of-stock {
      opacity: 0.5;
      cursor: not-allowed;
      background: #f9fafb;
    }

    .size-number {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.25rem;
    }

    .size-price {
      font-size: 0.85rem;
      font-weight: 600;
      color: #059669;
      margin-bottom: 0.25rem;
    }

    .size-stock {
      font-size: 0.75rem;
      color: #6b7280;
    }

    .quantity-selector {
      margin-bottom: 1.5rem;
    }

    .quantity-selector label {
      display: block;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .quantity-btn {
      width: 40px;
      height: 40px;
      border: 2px solid #e5e7eb;
      background: white;
      border-radius: 6px;
      font-size: 1.2rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .quantity-btn:hover:not(:disabled) {
      border-color: #3b82f6;
      background: #f0f9ff;
    }

    .quantity-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .quantity-input {
      width: 80px;
      height: 40px;
      border: 2px solid #e5e7eb;
      border-radius: 6px;
      text-align: center;
      font-size: 1rem;
      font-weight: 600;
    }

    .quantity-input:focus {
      outline: none;
      border-color: #3b82f6;
    }

    .add-to-cart-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 2rem;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      margin-top: 1.5rem;
      gap: 2rem;
    }

    .price-summary {
      display: flex;
      flex-direction: column;
    }

    .total-price {
      font-size: 1.4rem;
      font-weight: 700;
      color: #1f2937;
      letter-spacing: 0.025em;
    }

    .btn-add-to-cart {
      padding: 1rem 2rem;
      font-size: 1.1rem;
      font-weight: 600;
      min-width: 180px;
      border-radius: 10px;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
      
      &:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      }
      
      &:active:not(:disabled) {
        transform: translateY(0);
      }
    }

    .no-sizes {
      text-align: center;
      padding: 2rem;
      color: #6b7280;
      background: #f9fafb;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }

    @media (max-width: 768px) {
      .size-grid {
        grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
        gap: 0.5rem;
      }

      .add-to-cart-section {
        flex-direction: column;
        gap: 1.5rem;
        align-items: stretch;
        padding: 1.25rem 1.5rem;
        margin-top: 1.25rem;
      }

      .btn-add-to-cart {
        width: 100%;
        padding: 0.875rem 1.5rem;
        font-size: 1rem;
      }
    }
  `]
})
export class SizeSelectorComponent implements OnInit {
  @Input() product!: Product;
  @Output() addedToCart = new EventEmitter<void>();

  availableSizes: ProductSize[] = [];
  selectedSize: number | null = null;
  quantity: number = 1;
  isInCart: boolean = false;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadAvailableSizes();
  }

  private loadAvailableSizes(): void {
    this.availableSizes = this.cartService.getAvailableSizes(this.product);
    
    // Selectează prima mărime disponibilă dacă există
    if (this.availableSizes.length > 0) {
      this.selectedSize = this.availableSizes[0].size;
      this.checkIfInCart();
    }
  }

  selectSize(size: number): void {
    const sizeOption = this.availableSizes.find(s => s.size === size);
    if (sizeOption && sizeOption.isAvailable) {
      this.selectedSize = size;
      this.quantity = 1;
      this.checkIfInCart();
    }
  }

  increaseQuantity(): void {
    if (this.quantity < this.getMaxQuantity()) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  getMaxQuantity(): number {
    if (!this.selectedSize) return 0;
    const sizeOption = this.availableSizes.find(s => s.size === this.selectedSize);
    return sizeOption ? sizeOption.stock : 0;
  }

  getTotalPrice(): number {
    if (!this.selectedSize) return 0;
    const sizeOption = this.availableSizes.find(s => s.size === this.selectedSize);
    return sizeOption ? sizeOption.price * this.quantity : 0;
  }

  canAddToCart(): boolean {
    return this.selectedSize !== null && this.quantity > 0 && this.quantity <= this.getMaxQuantity();
  }

  addToCart(): void {
    if (this.canAddToCart() && this.selectedSize) {
      // Dacă produsul este deja în coș, folosește updateQuantity în loc de addToCart
      if (this.isInCart) {
        this.cartService.updateQuantity(this.product.id, this.selectedSize, this.quantity);
      } else {
        this.cartService.addToCart(this.product, this.selectedSize, this.quantity);
      }
      this.checkIfInCart();
      this.addedToCart.emit();
    }
  }

  private checkIfInCart(): void {
    if (this.selectedSize) {
      this.isInCart = this.cartService.isInCart(this.product.id, this.selectedSize);
      if (this.isInCart) {
        this.quantity = this.cartService.getQuantityInCart(this.product.id, this.selectedSize);
      }
    }
  }
}
