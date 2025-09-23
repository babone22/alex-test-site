import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from './services/cart.service';
import { Cart } from './models/product.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule],
  template: `
    <div class="app-container">
      <header class="header">
        <div class="container">
          <div class="header-content">
            <h1 class="logo">
              <a routerLink="/products">ProductSite</a>
            </h1>
            <nav class="nav">
              <a routerLink="/products" class="nav-link products-link">
                <span class="nav-icon">🛍️</span>
                <span class="nav-text">Produse</span>
              </a>
              <button class="cart-button" routerLink="/cart">
                <span class="cart-icon">🛒</span>
                <span class="cart-text">Coș</span>
                <span class="cart-count" *ngIf="cart.itemCount > 0">{{ cart.itemCount }}</span>
              </button>
            </nav>
          </div>
        </div>
      </header>
      
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      
      <footer class="footer">
        <div class="container">
          <div class="footer-content">
            <p>&copy; 2024 ProductSite. Toate drepturile rezervate.</p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .header {
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
    }
    
    .logo a {
      font-size: 1.5rem;
      font-weight: 700;
      color: #3b82f6;
      text-decoration: none;
    }
    
    .nav {
      display: flex;
      gap: 2rem;
    }
    
    .nav-link {
      color: #6b7280;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
      
      &:hover {
        color: #3b82f6;
      }
    }

    .products-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #f8fafc;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      padding: 0.75rem 1.25rem;
      font-weight: 600;
      color: #475569;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;

      &:hover {
        background: #3b82f6;
        border-color: #3b82f6;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
      }

      &:active {
        transform: translateY(0);
      }

      .nav-icon {
        font-size: 1.1rem;
        transition: transform 0.3s ease;
      }

      .nav-text {
        font-size: 0.95rem;
        letter-spacing: 0.025em;
      }

      &:hover .nav-icon {
        transform: scale(1.1);
      }

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s ease;
      }

      &:hover::before {
        left: 100%;
      }
    }

    .cart-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 0.5rem 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      position: relative;

      &:hover {
        background: #2563eb;
        transform: translateY(-1px);
      }

      .cart-icon {
        font-size: 1.2rem;
      }

      .cart-text {
        font-size: 0.9rem;
      }

      .cart-count {
        position: absolute;
        top: -8px;
        right: -8px;
        background: #ef4444;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 600;
        min-width: 20px;
      }
    }
    
    .main-content {
      flex: 1;
      padding: 2rem 0;
    }
    
    .footer {
      background: #1f2937;
      color: white;
      padding: 2rem 0;
      margin-top: auto;
    }
    
    .footer-content {
      text-align: center;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
      }
      
      .nav {
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;
      }
      
      .products-link {
        padding: 0.6rem 1rem;
        font-size: 0.9rem;
        
        .nav-icon {
          font-size: 1rem;
        }
        
        .nav-text {
          font-size: 0.85rem;
        }
      }
      
      .cart-button {
        padding: 0.4rem 0.8rem;
        font-size: 0.85rem;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'product-site';
  cart: Cart = { items: [], total: 0, itemCount: 0 };

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
  }
}