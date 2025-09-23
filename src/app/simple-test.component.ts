import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExcelImporterService } from './services/excel-importer.service';
import { ProductService } from './services/product.service';

@Component({
  selector: 'app-simple-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h1>Test Simplu - Import Excel</h1>
      
      <div style="margin: 20px 0;">
        <button (click)="testImport()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Testează Import Excel
        </button>
      </div>
      
      <div *ngIf="loading" style="color: #666;">
        Se încarcă...
      </div>
      
      <div *ngIf="result" style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>Rezultat:</h3>
        <pre>{{ result }}</pre>
      </div>
      
      <div *ngIf="error" style="background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>Eroare:</h3>
        <pre>{{ error }}</pre>
      </div>
      
      <div *ngIf="products.length > 0" style="background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>🎉 Produse încărcate cu succes ({{ products.length }}):</h3>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px;">
          <div *ngFor="let product of products" class="product-card">
            <div class="product-image">
              <img [src]="product.image" [alt]="product.name" 
                   (error)="onImageError($event)"
                   (load)="onImageLoad($event)"
                   style="width: 100%; height: 200px; object-fit: contain; border-radius: 8px; border: 2px solid #ddd; background: #f8f9fa;">
              <div class="image-debug" style="font-size: 12px; color: #666; margin-top: 5px; padding: 5px; background: #f0f0f0; border-radius: 3px;">
                <div><strong>URL imagine:</strong> {{ product.image }}</div>
                <div><strong>Tip:</strong> {{ getImageType(product.image) }}</div>
                <div><strong>Status:</strong> <span id="status-{{product.id}}">⏳ Se încarcă...</span></div>
                <div><strong>Lungime URL:</strong> {{ product.image.length }} caractere</div>
                <div><strong>Cod produs:</strong> {{ product.sku }}</div>
              </div>
            </div>
            
            <div class="product-info">
              <h4 style="margin: 10px 0; color: #1f2937;">{{ product.name }}</h4>
              
              <div class="product-details">
              <div class="detail-item">
                <strong>Preț:</strong> {{ product.price | currency:'EUR':'symbol':'1.2-2' }}
              </div>
                
                <div class="detail-item" *ngIf="product.category">
                  <strong>Categorie:</strong> {{ product.category }}
                </div>
                
                <div class="detail-item" *ngIf="product.subcategory">
                  <strong>Gama mărimi:</strong> {{ product.subcategory }}
                </div>
                
                <div class="detail-item">
                  <strong>Stoc total:</strong> 
                  <span [style.color]="product.stock > 0 ? '#059669' : '#dc2626'">
                    {{ product.stock }} bucăți
                  </span>
                </div>
                
                <div class="detail-item" *ngIf="product.sku">
                  <strong>Cod produs:</strong> {{ product.sku }}
                </div>
              </div>
              
              <div *ngIf="product.features && product.features.length > 0" class="product-features">
                <strong>Mărimi disponibile:</strong>
                <ul style="margin: 5px 0; padding-left: 20px;">
                  <li *ngFor="let feature of product.features.slice(0, 5)">{{ feature }}</li>
                </ul>
              </div>
              
              <div *ngIf="product.specifications" class="product-specs">
                <strong>Specificații:</strong>
                <div style="margin: 5px 0;">
                  <div *ngFor="let spec of getSpecifications(product)" class="spec-item">
                    <span class="spec-label">{{ spec.label }}:</span>
                    <span class="spec-value">{{ spec.value }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }
    
    .product-info {
      padding: 20px;
    }
    
    .product-details {
      margin: 15px 0;
    }
    
    .detail-item {
      margin: 8px 0;
      font-size: 14px;
      color: #4b5563;
    }
    
    .product-features {
      margin: 15px 0;
      font-size: 14px;
    }
    
    .product-features ul {
      color: #6b7280;
    }
    
    .product-specs {
      margin: 15px 0;
      font-size: 14px;
    }
    
    .spec-item {
      display: flex;
      justify-content: space-between;
      margin: 5px 0;
      padding: 5px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .spec-label {
      font-weight: 600;
      color: #374151;
    }
    
    .spec-value {
      color: #6b7280;
    }
    
    @media (max-width: 768px) {
      .product-card {
        margin-bottom: 20px;
      }
    }
  `]
})
export class SimpleTestComponent implements OnInit {
  loading = false;
  result = '';
  error = '';
  products: any[] = [];

  constructor(
    private excelImporter: ExcelImporterService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    console.log('SimpleTestComponent inițializat');
  }

  async testImport() {
    this.loading = true;
    this.result = '';
    this.error = '';
    
    try {
      console.log('Încep testul de import...');
      
      // Testează importul direct
      this.excelImporter.loadProductsFromExcel().subscribe({
        next: (data) => {
          console.log('Import reușit:', data);
          this.result = `Import reușit! Produse: ${data.products.length}, Categorii: ${data.categories.length}`;
          this.products = data.products;
          
          // Afișează detalii suplimentare
          if (data.products.length === 0) {
            this.result += '\n\n⚠️ Nu s-au găsit produse! Verifică consola pentru detalii.';
          } else {
            this.result += `\n\n✅ ${data.products.length} produse găsite cu succes!`;
          }
          
          this.loading = false;
        },
        error: (err) => {
          console.error('Eroare la import:', err);
          this.error = `Eroare: ${err.message || err}`;
          this.loading = false;
        }
      });
      
    } catch (err: any) {
      console.error('Eroare în test:', err);
      this.error = `Eroare: ${err.message || err}`;
      this.loading = false;
    }
  }

  getSpecifications(product: any): { label: string; value: string }[] {
    if (!product.specifications) return [];
    
    return Object.entries(product.specifications).map(([key, value]) => ({
      label: key,
      value: String(value)
    }));
  }

  onImageError(event: any): void {
    console.log('❌ Eroare la încărcarea imaginii:', event.target.src);
    // Setează o imagine default
    event.target.src = 'https://via.placeholder.com/400x300/ff6b6b/ffffff?text=❌+Eroare';
    
    // Actualizează statusul
    const productId = event.target.getAttribute('alt');
    const statusElement = document.getElementById(`status-${productId}`);
    if (statusElement) {
      statusElement.textContent = '❌ Eroare la încărcare';
      statusElement.style.color = '#dc2626';
    }
  }

  onImageLoad(event: any): void {
    console.log('✅ Imagine încărcată cu succes:', event.target.src);
    
    // Actualizează statusul
    const productId = event.target.getAttribute('alt');
    const statusElement = document.getElementById(`status-${productId}`);
    if (statusElement) {
      statusElement.textContent = '✅ Încărcat cu succes';
      statusElement.style.color = '#059669';
    }
  }

  getImageType(imageUrl: string): string {
    if (imageUrl.includes('placeholder')) {
      return '📸 Placeholder (imagine atașată în Excel)';
    } else if (imageUrl.includes('/assets/images/')) {
      return '📁 Imagine locală din folderul images';
    } else if (imageUrl.startsWith('http')) {
      return '🌐 URL extern';
    } else {
      return '❓ Tip necunoscut';
    }
  }
}
