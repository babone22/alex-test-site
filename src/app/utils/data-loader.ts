import { Product, ProductCategory } from '../models/product.model';

/**
 * Utilitar pentru încărcarea datelor din tabel în aplicația Angular
 * 
 * Instrucțiuni de utilizare:
 * 1. Convertește tabelul tău într-un array de obiecte JavaScript
 * 2. Folosește funcțiile de mai jos pentru a transforma datele în formatul aplicației
 * 3. Încarcă datele în ProductService prin metoda loadProductsFromTable()
 */

export interface TableRow {
  // Adaptează aceste proprietăți la structura tabelului tău
  id?: number;
  nume?: string;
  denumire?: string;
  titlu?: string;
  descriere?: string;
  pret?: number;
  preț?: number;
  pret_original?: number;
  imagine?: string;
  imagini?: string;
  categorie?: string;
  subcategorie?: string;
  brand?: string;
  marca?: string;
  sku?: string;
  cod?: string;
  stoc?: number;
  cantitate?: number;
  disponibil?: boolean;
  rating?: number;
  recenzii?: number;
  descrizione_classe?: string; // Coloana pentru gen (Neonato, Neonata, Bambina, Bambino)
  caracteristici?: string;
  specificatii?: string;
  taguri?: string;
  data_creare?: string;
  data_modificare?: string;
  [key: string]: any; // Pentru proprietăți suplimentare
}

/**
 * Convertește un rând din tabel într-un obiect Product
 */
export function convertTableRowToProduct(row: TableRow, index: number): Product {
  return {
    id: row.id || index + 1,
    name: row.nume || row.denumire || row.titlu || `Produs ${index + 1}`,
    description: row.descriere || 'Descriere produs',
    price: parseFloat(String(row.pret || row.preț || 0)),
    originalPrice: row.pret_original ? parseFloat(String(row.pret_original)) : undefined,
    image: row.imagine || 'https://via.placeholder.com/400x300?text=Imagine+Produs',
    images: row.imagini ? row.imagini.split(',').map(img => img.trim()) : undefined,
    category: row.categorie || 'General',
    subcategory: row.subcategorie,
    brand: row.brand || row.marca,
    sku: row.sku || row.cod || `SKU-${index + 1}`,
    stock: parseInt(String(row.stoc || row.cantitate || 0)),
    isAvailable: row.disponibil !== false && (row.stoc || row.cantitate || 0) > 0,
    rating: row.rating ? parseFloat(String(row.rating)) : undefined,
    reviewCount: row.recenzii ? parseInt(String(row.recenzii)) : undefined,
    features: row.caracteristici ? row.caracteristici.split(',').map(f => f.trim()) : undefined,
    specifications: parseSpecifications(row.specificatii),
    tags: row.taguri ? row.taguri.split(',').map(t => t.trim()) : undefined,
    gender: determineGender(row.descrizione_classe),
    createdAt: row.data_creare ? new Date(row.data_creare) : new Date(),
    updatedAt: row.data_modificare ? new Date(row.data_modificare) : new Date()
  };
}

/**
 * Determină genul produsului bazat pe coloana "Descrizione classe"
 */
function determineGender(descrizioneClasse?: string): 'boy' | 'girl' | 'unisex' {
  if (!descrizioneClasse) return 'unisex';
  
  const classe = descrizioneClasse.toLowerCase().trim();
  
  // Băieți: Neonato + Bambino
  if (classe === 'neonato' || classe === 'bambino') {
    return 'boy';
  }
  
  // Fete: Neonata + Bambina
  if (classe === 'neonata' || classe === 'bambina') {
    return 'girl';
  }
  
  // Default: unisex
  return 'unisex';
}

/**
 * Convertește un rând din tabel într-un obiect ProductCategory
 */
export function convertTableRowToCategory(row: TableRow, index: number): ProductCategory {
  return {
    id: row.id || index + 1,
    name: row.nume || row.denumire || row.categorie || `Categorie ${index + 1}`,
    slug: createSlug(row.nume || row.denumire || row.categorie || `categorie-${index + 1}`),
    description: row.descriere,
    image: row.imagine,
    parentId: row.parent_id || row.categorie_parinte
  };
}

/**
 * Parsează specificațiile din string în obiect
 */
function parseSpecifications(specsString?: string): { [key: string]: string } | undefined {
  if (!specsString) return undefined;
  
  try {
    // Încearcă să parsezi ca JSON
    return JSON.parse(specsString);
  } catch {
    // Dacă nu e JSON, încearcă să parsezi ca key:value pairs
    const specs: { [key: string]: string } = {};
    const pairs = specsString.split(',');
    
    pairs.forEach(pair => {
      const [key, value] = pair.split(':').map(s => s.trim());
      if (key && value) {
        specs[key] = value;
      }
    });
    
    return Object.keys(specs).length > 0 ? specs : undefined;
  }
}

/**
 * Creează un slug din text
 */
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimină diacriticele
    .replace(/[^a-z0-9\s-]/g, '') // Elimină caracterele speciale
    .replace(/\s+/g, '-') // Înlocuiește spațiile cu liniuțe
    .replace(/-+/g, '-') // Elimină liniuțele multiple
    .trim();
}

/**
 * Exemplu de utilizare:
 * 
 * // Datele din tabelul tău
 * const tableData: TableRow[] = [
 *   {
 *     nume: 'Laptop Gaming',
 *     pret: 4500,
 *     categorie: 'Electronice',
 *     brand: 'ASUS',
 *     stoc: 10,
 *     descriere: 'Laptop gaming de înaltă performanță'
 *   },
 *   // ... mai multe rânduri
 * ];
 * 
 * // Convertește datele
 * const products = tableData.map((row, index) => convertTableRowToProduct(row, index));
 * 
 * // Încarcă în serviciu
 * this.productService.loadProductsFromTable(products);
 */
