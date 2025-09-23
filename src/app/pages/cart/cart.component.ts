import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { Cart, CartItem } from '../../models/product.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Coșul de cumpărături</h1>
        <p class="page-description">Revizuiește produsele din coșul tău</p>
      </div>

      <div class="cart-content" *ngIf="cart.items.length > 0; else emptyCart">
        <div class="cart-items">
          <div class="cart-item" *ngFor="let item of cart.items; trackBy: trackByItem">
            <div class="item-image">
              <img [src]="item.product.image" [alt]="item.product.name" loading="lazy">
            </div>
            
            <div class="item-details">
              <h3 class="item-name">{{ item.product.name }}</h3>
              <p class="item-description">{{ item.product.description }}</p>
              <div class="item-specs">
                <span class="item-size">Mărimea: {{ item.size }}</span>
                <span class="item-price">{{ item.price | currency:'EUR':'symbol':'1.2-2' }}</span>
              </div>
            </div>
            
            <div class="item-quantity">
              <label for="quantity-{{ item.product.id }}-{{ item.size }}">Cantitate:</label>
              <div class="quantity-controls">
                <button 
                  type="button" 
                  class="quantity-btn" 
                  (click)="updateQuantity(item.product.id, item.size, item.quantity - 1)"
                  [disabled]="item.quantity <= 1"
                >
                  -
                </button>
                <input 
                  type="number" 
                  [id]="'quantity-' + item.product.id + '-' + item.size"
                  [(ngModel)]="item.quantity" 
                  min="1" 
                  [max]="getMaxQuantity(item)"
                  class="quantity-input"
                  (change)="updateQuantity(item.product.id, item.size, item.quantity)"
                >
                <button 
                  type="button" 
                  class="quantity-btn" 
                  (click)="updateQuantity(item.product.id, item.size, item.quantity + 1)"
                  [disabled]="item.quantity >= getMaxQuantity(item)"
                >
                  +
                </button>
              </div>
            </div>
            
            <div class="item-total">
              <span class="total-price">{{ getItemTotal(item) | currency:'EUR':'symbol':'1.2-2' }}</span>
            </div>
            
            <div class="item-actions">
              <button 
                class="btn btn-danger btn-sm"
                (click)="removeItem(item.product.id, item.size)"
              >
                Elimină
              </button>
            </div>
          </div>
        </div>

        <div class="cart-summary">
          <div class="summary-card">
            <h3>Rezumat comandă</h3>
            
            <div class="summary-row">
              <span>Produse ({{ cart.itemCount }}):</span>
              <span>{{ cart.total | currency:'EUR':'symbol':'1.2-2' }}</span>
            </div>
            
            <div class="summary-row">
              <span>Transport:</span>
              <span>Gratuit</span>
            </div>
            
            <div class="summary-divider"></div>
            
            <div class="summary-row total">
              <span>Total:</span>
              <span>{{ cart.total | currency:'EUR':'symbol':'1.2-2' }}</span>
            </div>
            
            <div class="checkout-actions">
              <button class="btn btn-primary btn-large" routerLink="/checkout">
                Finalizează comanda
              </button>
              <button class="btn btn-secondary btn-large" routerLink="/products">
                Continuă cumpărăturile
              </button>
            </div>
            
            <div class="clear-cart">
              <button class="btn btn-outline btn-sm" (click)="clearCart()">
                Golește coșul
              </button>
            </div>
          </div>
        </div>
      </div>

      <ng-template #emptyCart>
        <div class="empty-cart">
          <div class="empty-cart-icon">🛒</div>
          <h3>Coșul tău este gol</h3>
          <p>Nu ai produse în coș. Explorează produsele noastre și adaugă ceva!</p>
          <button class="btn btn-primary" routerLink="/products">
            Vezi produse
          </button>
        </div>
      </ng-template>
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

    .cart-content {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .cart-item {
      display: grid;
      grid-template-columns: 120px 1fr auto auto auto;
      gap: 1rem;
      align-items: center;
      padding: 1.5rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
    }

    .item-image {
      width: 120px;
      height: 120px;
      border-radius: 8px;
      overflow: hidden;
      background: #f8f9fa;
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .item-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .item-name {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    .item-description {
      font-size: 0.9rem;
      color: #6b7280;
      margin: 0;
      line-height: 1.4;
    }

    .item-specs {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .item-size {
      font-size: 0.85rem;
      color: #374151;
      font-weight: 500;
    }

    .item-price {
      font-size: 0.9rem;
      color: #059669;
      font-weight: 600;
    }

    .item-quantity {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      align-items: center;
    }

    .item-quantity label {
      font-size: 0.85rem;
      font-weight: 500;
      color: #374151;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .quantity-btn {
      width: 32px;
      height: 32px;
      border: 2px solid #e5e7eb;
      background: white;
      border-radius: 6px;
      font-size: 1rem;
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
      width: 60px;
      height: 32px;
      border: 2px solid #e5e7eb;
      border-radius: 6px;
      text-align: center;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .quantity-input:focus {
      outline: none;
      border-color: #3b82f6;
    }

    .item-total {
      text-align: center;
    }

    .total-price {
      font-size: 1.2rem;
      font-weight: 700;
      color: #1f2937;
    }

    .item-actions {
      display: flex;
      justify-content: center;
    }

    .cart-summary {
      position: sticky;
      top: 2rem;
      height: fit-content;
    }

    .summary-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
    }

    .summary-card h3 {
      font-size: 1.2rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      font-size: 0.95rem;
    }

    .summary-row.total {
      font-size: 1.1rem;
      font-weight: 700;
      color: #1f2937;
    }

    .summary-divider {
      height: 1px;
      background: #e5e7eb;
      margin: 1rem 0;
    }

    .checkout-actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin: 1.5rem 0;
    }

    .btn-large {
      padding: 1rem 1.5rem;
      font-size: 1rem;
      font-weight: 600;
      min-width: 200px;
    }

    .clear-cart {
      text-align: center;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .empty-cart {
      text-align: center;
      padding: 4rem 2rem;
      color: #6b7280;
    }

    .empty-cart-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-cart h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #1f2937;
    }

    .empty-cart p {
      font-size: 1rem;
      margin-bottom: 2rem;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
      text-align: center;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
    }

    .btn-primary:hover {
      background: #2563eb;
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: #6b7280;
      color: white;
    }

    .btn-secondary:hover {
      background: #4b5563;
      transform: translateY(-1px);
    }

    .btn-danger {
      background: #ef4444;
      color: white;
    }

    .btn-danger:hover {
      background: #dc2626;
      transform: translateY(-1px);
    }

    .btn-outline {
      background: transparent;
      color: #6b7280;
      border: 2px solid #e5e7eb;
    }

    .btn-outline:hover {
      background: #f9fafb;
      border-color: #d1d5db;
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.85rem;
    }

    @media (max-width: 1024px) {
      .cart-content {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .cart-summary {
        position: static;
      }
    }

    @media (max-width: 768px) {
      .cart-item {
        grid-template-columns: 1fr;
        gap: 1rem;
        text-align: center;
      }

      .item-image {
        width: 100%;
        height: 200px;
        margin: 0 auto;
      }

      .quantity-controls {
        justify-content: center;
      }

      .checkout-actions {
        gap: 0.5rem;
      }

      .btn-large {
        width: 100%;
      }
    }
  `]
})
export class CartComponent implements OnInit {
  cart: Cart = { items: [], total: 0, itemCount: 0 };

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
  }

  trackByItem(index: number, item: CartItem): string {
    return `${item.product.id}-${item.size}`;
  }

  updateQuantity(productId: number, size: number, quantity: number): void {
    this.cartService.updateQuantity(productId, size, quantity);
  }

  removeItem(productId: number, size: number): void {
    this.cartService.removeFromCart(productId, size);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  getItemTotal(item: CartItem): number {
    return item.price * item.quantity;
  }

  getMaxQuantity(item: CartItem): number {
    // Găsește mărimea în produs și returnează stocul disponibil
    const sizeOption = item.product.sizes?.find(s => s.size === item.size);
    return sizeOption ? sizeOption.stock : 0;
  }

}
