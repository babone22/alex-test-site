import { Product, ProductCategory } from '../models/product.model';
import { TableRow, convertTableRowToProduct, convertTableRowToCategory } from '../utils/data-loader';

/**
 * Exemplu de date din tabel - adaptează la structura tabelului tău
 * 
 * Acest fișier demonstrează cum să convertești datele din tabelul tău
 * în formatul necesar pentru aplicația Angular.
 */

// Exemplu de date din tabel (adaptă la structura tabelului tău)
export const sampleTableData: TableRow[] = [
  {
    nume: 'Laptop Gaming ASUS ROG',
    pret: 4500,
    pret_original: 5000,
    categorie: 'Electronice',
    subcategorie: 'Laptopuri',
    brand: 'ASUS',
    sku: 'ASUS-ROG-001',
    stoc: 15,
    descriere: 'Laptop gaming de înaltă performanță cu procesor Intel i7 și placa video RTX 4060',
    imagine: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    caracteristici: 'Intel i7-12700H, RTX 4060 8GB, 16GB RAM DDR5, SSD 1TB',
    specificatii: '{"Procesor": "Intel Core i7-12700H", "Memorie": "16GB DDR5", "Stocare": "1TB SSD NVMe", "Placă video": "NVIDIA RTX 4060 8GB"}',
    taguri: 'gaming, laptop, asus, rtx',
    rating: 4.5,
    recenzii: 128
  },
  {
    nume: 'iPhone 15 Pro',
    pret: 4200,
    pret_original: 4500,
    categorie: 'Electronice',
    subcategorie: 'Telefoane',
    brand: 'Apple',
    sku: 'IPHONE-15-PRO-001',
    stoc: 8,
    descriere: 'Cel mai nou iPhone cu chip A17 Pro și cameră profesională',
    imagine: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    caracteristici: 'Chip A17 Pro, Cameră 48MP, Titanium, USB-C',
    specificatii: '{"Chip": "A17 Pro", "Memorie": "8GB RAM", "Stocare": "256GB", "Cameră": "48MP ProRAW"}',
    taguri: 'iphone, apple, smartphone, pro',
    rating: 4.8,
    recenzii: 256
  },
  {
    nume: 'Samsung Galaxy S24 Ultra',
    pret: 3800,
    pret_original: 4200,
    categorie: 'Electronice',
    subcategorie: 'Telefoane',
    brand: 'Samsung',
    sku: 'SAMSUNG-S24-ULTRA-001',
    stoc: 12,
    descriere: 'Smartphone premium cu AI integrat și cameră de 200MP',
    imagine: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    caracteristici: 'AI Galaxy, Cameră 200MP, S Pen, Titanium',
    specificatii: '{"Chip": "Snapdragon 8 Gen 3", "Memorie": "12GB RAM", "Stocare": "256GB", "Cameră": "200MP + 50MP + 10MP"}',
    taguri: 'samsung, galaxy, ultra, ai',
    rating: 4.6,
    recenzii: 189
  },
  {
    nume: 'MacBook Air M3',
    pret: 5200,
    pret_original: 5500,
    categorie: 'Electronice',
    subcategorie: 'Laptopuri',
    brand: 'Apple',
    sku: 'MACBOOK-AIR-M3-001',
    stoc: 6,
    descriere: 'Laptop ultraportabil cu chip Apple M3 și ecran Liquid Retina',
    imagine: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    caracteristici: 'Chip M3, Ecran 13.6", Baterie 18h, MagSafe',
    specificatii: '{"Chip": "Apple M3", "Memorie": "8GB RAM", "Stocare": "256GB SSD", "Ecran": "13.6\\" Liquid Retina"}',
    taguri: 'macbook, apple, m3, ultraportabil',
    rating: 4.7,
    recenzii: 95
  },
  {
    nume: 'AirPods Pro 2',
    pret: 800,
    pret_original: 900,
    categorie: 'Electronice',
    subcategorie: 'Căști',
    brand: 'Apple',
    sku: 'AIRPODS-PRO-2-001',
    stoc: 25,
    descriere: 'Căști wireless cu cancelare activă a zgomotului și spațial audio',
    imagine: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400',
    caracteristici: 'Cancelare zgomot, Spațial audio, Rezistență la apă, H2 chip',
    specificatii: '{"Baterie": "6h + 24h în caz", "Rezistență": "IPX4", "Conexiune": "Bluetooth 5.3", "Chip": "H2"}',
    taguri: 'airpods, wireless, noise-cancelling, apple',
    rating: 4.4,
    recenzii: 312
  }
];

// Exemplu de categorii din tabel
export const sampleCategoryData: TableRow[] = [
  {
    nume: 'Electronice',
    descriere: 'Produse electronice și gadget-uri',
    imagine: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300'
  },
  {
    nume: 'Laptopuri',
    descriere: 'Laptopuri și computere portabile',
    categorie_parinte: 1
  },
  {
    nume: 'Telefoane',
    descriere: 'Smartphone-uri și telefoane mobile',
    categorie_parinte: 1
  },
  {
    nume: 'Căști',
    descriere: 'Căști și accesorii audio',
    categorie_parinte: 1
  }
];

/**
 * Funcție pentru a încărca datele în aplicație
 * 
 * Folosește această funcție în ProductService pentru a încărca datele din tabelul tău
 */
export function loadSampleData(): { products: Product[]; categories: ProductCategory[] } {
  const products = sampleTableData.map((row, index) => convertTableRowToProduct(row, index));
  const categories = sampleCategoryData.map((row, index) => convertTableRowToCategory(row, index));
  
  return { products, categories };
}

/**
 * Instrucțiuni pentru utilizarea datelor tale:
 * 
 * 1. Înlocuiește sampleTableData cu datele din tabelul tău
 * 2. Adaptează proprietățile din TableRow la coloanele tabelului tău
 * 3. În ProductService, înlocuiește initializeSampleData() cu:
 * 
 * private initializeSampleData(): void {
 *   const { products, categories } = loadSampleData();
 *   this.productsSubject.next(products);
 *   this.categoriesSubject.next(categories);
 * }
 * 
 * SAU pentru datele tale direct:
 * 
 * private initializeSampleData(): void {
 *   const yourTableData: TableRow[] = [
 *     // datele din tabelul tău
 *   ];
 *   
 *   const products = yourTableData.map((row, index) => convertTableRowToProduct(row, index));
 *   this.productsSubject.next(products);
 * }
 */
