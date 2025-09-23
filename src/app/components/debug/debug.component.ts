import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product, ProductCategory } from '../../models/product.model';

@Component({
  selector: 'app-debug',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="debug-container">
      <h2>Debug - Date încărcate din Excel</h2>
      
      <div class="debug-stats">
        <div class="stat-item">
          <strong>Produse încărcate:</strong> {{ products.length }}
        </div>
        <div class="stat-item">
          <strong>Categorii încărcate:</strong> {{ categories.length }}
        </div>
      </div>

      <div class="debug-section" *ngIf="products.length > 0">
        <h3>Primele 5 produse:</h3>
        <div class="product-list">
          <div class="product-item" *ngFor="let product of products.slice(0, 5)">
            <div class="product-info">
              <strong>{{ product.name }}</strong>
              <div class="product-details">
                <span>Preț: {{ product.price | currency:'RON':'symbol':'1.0-0' }}</span>
                <span>Categorie: {{ product.category }}</span>
                <span>Brand: {{ product.brand || 'N/A' }}</span>
                <span>Stoc: {{ product.stock }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="debug-section" *ngIf="categories.length > 0">
        <h3>Categorii:</h3>
        <div class="category-list">
          <span class="category-tag" *ngFor="let category of categories">
            {{ category.name }}
          </span>
        </div>
      </div>

      <div class="debug-section" *ngIf="products.length === 0">
        <div class="no-data">
          <p>Nu s-au încărcat produse din Excel.</p>
          <p>Verifică:</p>
          <ul>
            <li>Dacă fișierul stock.xlsx există în src/assets/</li>
            <li>Dacă fișierul conține date valide</li>
            <li>Consola browserului pentru erori</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .debug-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .debug-stats {
      display: flex;
      gap: 2rem;
      margin-bottom: 2rem;
      padding: 1rem;
      background: #f3f4f6;
      border-radius: 8px;
    }
    
    .stat-item {
      font-size: 1.1rem;
    }
    
    .debug-section {
      margin-bottom: 2rem;
    }
    
    .debug-section h3 {
      color: #1f2937;
      margin-bottom: 1rem;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 0.5rem;
    }
    
    .product-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .product-item {
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #f9fafb;
    }
    
    .product-info strong {
      color: #1f2937;
      font-size: 1.1rem;
    }
    
    .product-details {
      display: flex;
      gap: 1rem;
      margin-top: 0.5rem;
      font-size: 0.9rem;
      color: #6b7280;
      flex-wrap: wrap;
    }
    
    .category-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .category-tag {
      background: #3b82f6;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
    }
    
    .no-data {
      padding: 2rem;
      text-align: center;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      color: #dc2626;
    }
    
    .no-data ul {
      text-align: left;
      max-width: 400px;
      margin: 1rem auto;
    }
    
    @media (max-width: 768px) {
      .debug-stats {
        flex-direction: column;
        gap: 1rem;
      }
      
      .product-details {
        flex-direction: column;
        gap: 0.25rem;
      }
    }
  `]
})
export class DebugComponent implements OnInit {
  products: Product[] = [];
  categories: ProductCategory[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      console.log('Debug - Produse încărcate:', products);
    });

    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;
      console.log('Debug - Categorii încărcate:', categories);
    });
  }
}
