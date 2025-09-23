import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Product, ProductCategory, ProductFilter } from '../models/product.model';
import { ExcelImporterService } from './excel-importer.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  private categoriesSubject = new BehaviorSubject<ProductCategory[]>([]);

  constructor(private excelImporter: ExcelImporterService) {
    this.loadDataFromExcel();
  }

  /**
   * Încarcă datele din fișierul Excel
   */
  private loadDataFromExcel(): void {
    console.log('ProductService: Încep să încarc datele din Excel...');
    this.excelImporter.loadProductsFromExcel().subscribe({
      next: (data) => {
        console.log('ProductService: Datele au fost încărcate din Excel:', data);
        console.log('ProductService: Produse încărcate:', data.products.length);
        console.log('ProductService: Categorii încărcate:', data.categories.length);
        
        if (data.products.length === 0) {
          console.warn('ProductService: Nu s-au încărcat produse din Excel, folosesc datele de exemplu');
          this.initializeSampleData();
        } else {
          this.productsSubject.next(data.products);
          this.categoriesSubject.next(data.categories);
        }
      },
      error: (error) => {
        console.error('ProductService: Eroare la încărcarea datelor din Excel:', error);
        // Dacă nu reușește să încarce din Excel, folosește datele de exemplu
        this.initializeSampleData();
      }
    });
  }

  // Sample data - în locul acestuia vei încărca datele din tabelul tău
  private initializeSampleData(): void {
    const sampleProducts: Product[] = [
      {
        id: 1,
        name: 'Laptop Gaming ASUS ROG',
        description: 'Laptop gaming de înaltă performanță cu procesor Intel i7 și placa video RTX 4060',
        price: 4500,
        originalPrice: 5000,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        images: [
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'
        ],
        category: 'Electronice',
        subcategory: 'Laptopuri',
        brand: 'ASUS',
        sku: 'ASUS-ROG-001',
        stock: 15,
        isAvailable: true,
        rating: 4.5,
        reviewCount: 128,
        features: ['Intel i7-12700H', 'RTX 4060 8GB', '16GB RAM DDR5', 'SSD 1TB'],
        specifications: {
          'Procesor': 'Intel Core i7-12700H',
          'Memorie': '16GB DDR5',
          'Stocare': '1TB SSD NVMe',
          'Placă video': 'NVIDIA RTX 4060 8GB'
        },
        tags: ['gaming', 'laptop', 'asus', 'rtx'],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 2,
        name: 'iPhone 15 Pro',
        description: 'Cel mai nou iPhone cu chip A17 Pro și cameră profesională',
        price: 4200,
        originalPrice: 4500,
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
        images: [
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
        ],
        category: 'Electronice',
        subcategory: 'Telefoane',
        brand: 'Apple',
        sku: 'IPHONE-15-PRO-001',
        stock: 8,
        isAvailable: true,
        rating: 4.8,
        reviewCount: 256,
        features: ['Chip A17 Pro', 'Cameră 48MP', 'Titanium', 'USB-C'],
        specifications: {
          'Chip': 'A17 Pro',
          'Memorie': '8GB RAM',
          'Stocare': '256GB',
          'Cameră': '48MP ProRAW'
        },
        tags: ['iphone', 'apple', 'smartphone', 'pro'],
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
      },
      {
        id: 3,
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Smartphone premium cu AI integrat și cameră de 200MP',
        price: 3800,
        originalPrice: 4200,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        images: [
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'
        ],
        category: 'Electronice',
        subcategory: 'Telefoane',
        brand: 'Samsung',
        sku: 'SAMSUNG-S24-ULTRA-001',
        stock: 12,
        isAvailable: true,
        rating: 4.6,
        reviewCount: 189,
        features: ['AI Galaxy', 'Cameră 200MP', 'S Pen', 'Titanium'],
        specifications: {
          'Chip': 'Snapdragon 8 Gen 3',
          'Memorie': '12GB RAM',
          'Stocare': '256GB',
          'Cameră': '200MP + 50MP + 10MP'
        },
        tags: ['samsung', 'galaxy', 'ultra', 'ai'],
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-08')
      },
      {
        id: 4,
        name: 'MacBook Air M3',
        description: 'Laptop ultraportabil cu chip Apple M3 și ecran Liquid Retina',
        price: 5200,
        originalPrice: 5500,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
        images: [
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'
        ],
        category: 'Electronice',
        subcategory: 'Laptopuri',
        brand: 'Apple',
        sku: 'MACBOOK-AIR-M3-001',
        stock: 6,
        isAvailable: true,
        rating: 4.7,
        reviewCount: 95,
        features: ['Chip M3', 'Ecran 13.6"', 'Baterie 18h', 'MagSafe'],
        specifications: {
          'Chip': 'Apple M3',
          'Memorie': '8GB RAM',
          'Stocare': '256GB SSD',
          'Ecran': '13.6" Liquid Retina'
        },
        tags: ['macbook', 'apple', 'm3', 'ultraportabil'],
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05')
      },
      {
        id: 5,
        name: 'AirPods Pro 2',
        description: 'Căști wireless cu cancelare activă a zgomotului și spațial audio',
        price: 800,
        originalPrice: 900,
        image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400',
        images: [
          'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400'
        ],
        category: 'Electronice',
        subcategory: 'Căști',
        brand: 'Apple',
        sku: 'AIRPODS-PRO-2-001',
        stock: 25,
        isAvailable: true,
        rating: 4.4,
        reviewCount: 312,
        features: ['Cancelare zgomot', 'Spațial audio', 'Rezistență la apă', 'H2 chip'],
        specifications: {
          'Baterie': '6h + 24h în caz',
          'Rezistență': 'IPX4',
          'Conexiune': 'Bluetooth 5.3',
          'Chip': 'H2'
        },
        tags: ['airpods', 'wireless', 'noise-cancelling', 'apple'],
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12')
      }
    ];

    const sampleCategories: ProductCategory[] = [
      {
        id: 1,
        name: 'Electronice',
        slug: 'electronice',
        description: 'Produse electronice și gadget-uri',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300'
      },
      {
        id: 2,
        name: 'Laptopuri',
        slug: 'laptopuri',
        description: 'Laptopuri și computere portabile',
        parentId: 1
      },
      {
        id: 3,
        name: 'Telefoane',
        slug: 'telefoane',
        description: 'Smartphone-uri și telefoane mobile',
        parentId: 1
      },
      {
        id: 4,
        name: 'Căști',
        slug: 'casti',
        description: 'Căști și accesorii audio',
        parentId: 1
      }
    ];

    this.productsSubject.next(sampleProducts);
    this.categoriesSubject.next(sampleCategories);
  }

  // Metode pentru produse
  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  getProductById(id: number): Observable<Product | undefined> {
    const products = this.productsSubject.value;
    const product = products.find(p => p.id === id);
    return of(product);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    const products = this.productsSubject.value;
    const filteredProducts = products.filter(p => p.category === category);
    return of(filteredProducts);
  }

  searchProducts(query: string): Observable<Product[]> {
    const products = this.productsSubject.value;
    const filteredProducts = products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.brand?.toLowerCase().includes(query.toLowerCase()) ||
      p.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    return of(filteredProducts);
  }

  filterProducts(filter: ProductFilter): Observable<Product[]> {
    let products = this.productsSubject.value;

    if (filter.category) {
      products = products.filter(p => p.category === filter.category);
    }

    if (filter.brand) {
      products = products.filter(p => p.brand === filter.brand);
    }

    if (filter.minPrice !== undefined) {
      products = products.filter(p => p.price >= filter.minPrice!);
    }

    if (filter.maxPrice !== undefined) {
      products = products.filter(p => p.price <= filter.maxPrice!);
    }

    if (filter.inStock !== undefined) {
      products = products.filter(p => filter.inStock ? p.stock > 0 : p.stock === 0);
    }

    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.brand?.toLowerCase().includes(searchTerm)
      );
    }

    return of(products);
  }

  // Metode pentru categorii
  getCategories(): Observable<ProductCategory[]> {
    return this.categoriesSubject.asObservable();
  }

  getCategoryBySlug(slug: string): Observable<ProductCategory | undefined> {
    const categories = this.categoriesSubject.value;
    const category = categories.find(c => c.slug === slug);
    return of(category);
  }

  // Metodă pentru încărcarea datelor din tabel
  loadProductsFromTable(products: Product[]): void {
    this.productsSubject.next(products);
  }

  loadCategoriesFromTable(categories: ProductCategory[]): void {
    this.categoriesSubject.next(categories);
  }
}
