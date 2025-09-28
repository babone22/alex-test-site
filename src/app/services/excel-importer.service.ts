import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import * as XLSX from 'xlsx';
import { Product, ProductCategory, PriceRange, ProductSize } from '../models/product.model';
import { getCloudinaryImageUrl } from '../config/cloudinary.config';

@Injectable({
  providedIn: 'root'
})
export class ExcelImporterService {

  constructor(private http: HttpClient) {}

  /**
   * Încarcă și procesează fișierul Excel cu produsele
   */
  loadProductsFromExcel(): Observable<{ products: Product[]; categories: ProductCategory[] }> {
    console.log('Încep să încarc fișierul Excel...');
    return this.http.get('/assets/stock.xlsx', { responseType: 'arraybuffer' }).pipe(
      map(data => {
        console.log('Fișierul Excel a fost încărcat, dimensiune:', data.byteLength);
        return this.processExcelData(data);
      }),
      catchError(error => {
        console.error('Eroare la încărcarea fișierului Excel:', error);
        console.log('Folosesc datele de exemplu...');
        return of({ products: [], categories: [] });
      })
    );
  }

  /**
   * Procesează datele din fișierul Excel
   */
  private processExcelData(arrayBuffer: ArrayBuffer): { products: Product[]; categories: ProductCategory[] } {
    try {
      // Citește fișierul Excel
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      // Obține primul sheet (foaia de lucru)
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convertește în JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length < 2) {
        console.warn('Fișierul Excel nu conține date suficiente');
        return { products: [], categories: [] };
      }
      
      // Caută linia cu header-urile (prima linie care conține 'Codice prodotto')
      let headerRowIndex = -1;
      let headers: string[] = [];
      
      console.log('Caut header-urile în Excel...');
      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i] as any[];
        console.log(`Verific rândul ${i}:`, row);
        if (row && row.some(cell => cell && String(cell).toLowerCase().includes('codice prodotto'))) {
          headerRowIndex = i;
          headers = row.map(cell => String(cell || '').trim());
          console.log('Header-urile găsite la rândul', i, ':', headers);
          break;
        }
      }
      
      if (headerRowIndex === -1) {
        console.error('Nu s-au găsit header-urile în Excel');
        return { products: [], categories: [] };
      }
      
      // Rândurile de date sunt după header-uri
      const dataRows = jsonData.slice(headerRowIndex + 1) as any[][];
      
      console.log('Header-urile din Excel:', headers);
      console.log('Primele 3 rânduri de date:', dataRows.slice(0, 3));
      console.log('Toate rândurile de date:', dataRows);
      
      // Procesează datele
      console.log('Procesez', dataRows.length, 'rânduri de date...');
      const products = this.convertExcelRowsToProducts(dataRows, headers);
      const categories = this.extractCategories(products);
      
      console.log('Am procesat', products.length, 'produse și', categories.length, 'categorii');
      return { products, categories };
    } catch (error) {
      console.error('Eroare la procesarea datelor Excel:', error);
      return { products: [], categories: [] };
    }
  }

  /**
   * Convertește rândurile din Excel în obiecte Product
   */
  private convertExcelRowsToProducts(dataRows: any[][], headers: string[]): Product[] {
    const products: Product[] = [];
    
    console.log('Încep să procesez rândurile...');
    
    dataRows.forEach((row, index) => {
      console.log(`Procesez rândul ${index + 2}:`, row);
      
      if (!row || row.length === 0) {
        console.log(`Rândul ${index + 2} este gol, îl sar`);
        return;
      }
      
      try {
        const product = this.createProductFromRow(row, headers, index);
        if (product) {
          console.log(`Produs creat pentru rândul ${index + 2}:`, product);
          products.push(product);
        } else {
          console.log(`Nu s-a putut crea produs pentru rândul ${index + 2}`);
        }
      } catch (error) {
        console.warn(`Eroare la procesarea rândului ${index + 2}:`, error);
      }
    });
    
    console.log(`Total produse create: ${products.length}`);
    return products;
  }

  /**
   * Creează un obiect Product din rândul Excel
   */
  private createProductFromRow(row: any[], headers: string[], index: number): Product | null {
    // Creează un obiect cu valorile din rând
    const rowData: { [key: string]: any } = {};
    headers.forEach((header, i) => {
      if (header && header.trim() !== '' && i < row.length) {
        rowData[header.toLowerCase().trim()] = row[i];
      }
    });
    
    console.log(`Procesez rândul ${index + 2}:`, rowData);
    
    // Verifică dacă există cel puțin codul produsului
    console.log(`Caut codul produsului în rândul ${index + 2}...`);
    const codiceProdotto = this.findValue(rowData, ['codice prodotto', 'codice_prodotto', 'cod_produs', 'sku']);
    console.log(`Codul produsului găsit:`, codiceProdotto);
    console.log(`Cheile disponibile în rowData:`, Object.keys(rowData));
    
    if (!codiceProdotto) {
      console.warn(`Rândul ${index + 2} nu are cod produs. Cheile disponibile:`, Object.keys(rowData));
      return null;
    }
    
    // Extrage datele specifice din structura ta
    const foto = this.findValue(rowData, ['foto', 'photo', 'imagine', 'image']);
    const fascia = this.findValue(rowData, ['fascia', 'range', 'gama']);
    const sizeRange1 = this.findValue(rowData, ['1st size range', '1st_size_range', 'size_range']);
    const priceRange1 = this.findValue(rowData, ['st price range', '1st price range', '1st_price_range', 'price_range']);
    const sizeRange2 = this.findValue(rowData, ['2nd size range', '2nd_size_range']);
    const priceRange2 = this.findValue(rowData, ['2nd price range', '2nd_price_range']);
    const sizeRange3 = this.findValue(rowData, ['3rd size range', '3rd_size_range']);
    const priceRange3 = this.findValue(rowData, ['3rd price range', '3rd_price_range']);
    const paia = this.parseNumber(this.findValue(rowData, ['paia', 'stoc_total', 'total_stock']));
    
    console.log(`Datele extrase:`, {
      foto, fascia, sizeRange1, priceRange1, sizeRange2, priceRange2, sizeRange3, priceRange3, paia
    });
    
    // Generează lista de imagini pentru produs (inclusiv imagini multiple)
    const productImages = this.generateProductImages(String(codiceProdotto));
    console.log(`Imaginile generate pentru produsul ${codiceProdotto}:`, productImages);
    
    // Folosește întotdeauna prima imagine generată ca imagine principală
    const processedImage = productImages[0];
    console.log(`Imaginea procesată pentru produsul ${codiceProdotto}:`, processedImage);
    console.log(`Foto din Excel:`, foto);
    
    // Calculează stocul total din coloanele de mărimi
    const totalStock = this.calculateTotalStockFromSizes(rowData, headers);
    
    // Calculează prețul corect în funcție de mărimile disponibile
    const calculatedPrice = this.calculatePriceFromSizes(rowData, headers, priceRange1, priceRange2, priceRange3);
    
    // Creează intervalele de prețuri
    const priceRanges = this.createPriceRanges(rowData, headers, priceRange1, priceRange2, priceRange3);
    
    // Creează mărimile individuale
    const sizes = this.createIndividualSizes(rowData, headers, priceRange1, priceRange2, priceRange3);
    
    // Creează obiectul Product
    const product: Product = {
      id: index + 1,
      name: String(codiceProdotto), // Folosim codul ca nume pentru moment
      description: `Produs ${codiceProdotto}${fascia ? ` - ${fascia}` : ''}${sizeRange1 ? ` (${sizeRange1})` : ''}`,
      price: calculatedPrice,
      originalPrice: undefined,
      image: processedImage || this.getPlaceholderImage(),
      images: productImages.length > 0 ? productImages : [processedImage || this.getPlaceholderImage()],
      category: fascia || 'General',
      subcategory: sizeRange1,
      brand: undefined,
      sku: String(codiceProdotto),
      stock: totalStock || paia || 0,
      isAvailable: (totalStock || paia || 0) > 0,
      rating: undefined,
      reviewCount: undefined,
      features: this.extractSizeFeatures(rowData, headers, priceRange1, priceRange2, priceRange3),
      specifications: this.createSpecificationsFromRow(rowData, headers),
      tags: this.createTagsFromRow(rowData, fascia, sizeRange1),
      priceRanges: priceRanges,
      sizes: sizes,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return product;
  }

  /**
   * Caută o valoare în obiectul rowData folosind mai multe chei posibile
   */
  private findValue(rowData: { [key: string]: any }, possibleKeys: string[]): any {
    console.log('Caut cheia în:', Object.keys(rowData));
    console.log('Cheile posibile:', possibleKeys);
    
    for (const key of possibleKeys) {
      console.log(`Încerc cheia: "${key}"`);
      if (rowData[key] !== undefined && rowData[key] !== null && rowData[key] !== '') {
        console.log(`Găsit valoarea pentru "${key}":`, rowData[key]);
        return rowData[key];
      }
    }
    
    // Încercă să găsești cheia prin căutare parțială
    for (const possibleKey of possibleKeys) {
      for (const actualKey of Object.keys(rowData)) {
        if (actualKey.toLowerCase().includes(possibleKey.toLowerCase())) {
          console.log(`Găsit cheie parțială "${actualKey}" pentru "${possibleKey}":`, rowData[actualKey]);
          return rowData[actualKey];
        }
      }
    }
    
    console.log('Nu s-a găsit nicio valoare pentru cheile:', possibleKeys);
    return null;
  }

  /**
   * Parsează un număr din string
   */
  private parseNumber(value: any): number | undefined {
    console.log(`Parsez numărul:`, value, 'Tip:', typeof value);
    
    if (value === null || value === undefined || value === '') {
      console.log('Valoarea este null/undefined/gol');
      return undefined;
    }
    
    // Curăță valoarea - păstrează doar cifre, puncte, virgule și spații
    const cleanedValue = String(value)
      .replace(/[^\d.,\s]/g, '') // Elimină toate caracterele care nu sunt cifre, puncte, virgule sau spații
      .replace(/\s+/g, '') // Elimină spațiile
      .replace(',', '.'); // Înlocuiește virgula cu punct
    
    console.log(`Valoarea curățată:`, cleanedValue);
    
    const num = parseFloat(cleanedValue);
    console.log(`Numărul parsat:`, num, 'isNaN:', isNaN(num));
    
    return isNaN(num) ? undefined : num;
  }

  /**
   * Parsează un boolean din string
   */
  private parseBoolean(value: any): boolean | undefined {
    if (value === null || value === undefined || value === '') return undefined;
    const str = String(value).toLowerCase();
    return str === 'true' || str === '1' || str === 'da' || str === 'yes' || str === 'disponibil';
  }

  /**
   * Parsează un array din string (separat prin virgulă)
   */
  private parseArray(value: any): string[] | undefined {
    if (!value) return undefined;
    const str = String(value);
    return str.split(',').map(item => item.trim()).filter(item => item.length > 0);
  }

  /**
   * Parsează imaginile din string
   */
  private parseImages(value: any): string[] | undefined {
    if (!value) return undefined;
    const images = this.parseArray(value);
    return images && images.length > 0 ? images : undefined;
  }

  /**
   * Parsează specificațiile din string
   */
  private parseSpecifications(value: any): { [key: string]: string } | undefined {
    if (!value) return undefined;
    
    try {
      // Încearcă să parsezi ca JSON
      return JSON.parse(String(value));
    } catch {
      // Dacă nu e JSON, încearcă să parsezi ca key:value pairs
      const specs: { [key: string]: string } = {};
      const pairs = String(value).split(',');
      
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
   * Extrage categoriile unice din produse
   */
  private extractCategories(products: Product[]): ProductCategory[] {
    const categoryMap = new Map<string, ProductCategory>();
    
    products.forEach(product => {
      if (product.category && !categoryMap.has(product.category)) {
        categoryMap.set(product.category, {
          id: categoryMap.size + 1,
          name: product.category,
          slug: this.createSlug(product.category),
          description: `Produse din categoria ${product.category}`
        });
      }
    });
    
    return Array.from(categoryMap.values());
  }

  /**
   * Creează un slug din text
   */
  private createSlug(text: string): string {
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
   * Calculează prețul corect în funcție de mărimile disponibile
   */
  private calculatePriceFromSizes(rowData: { [key: string]: any }, headers: string[], priceRange1: any, priceRange2: any, priceRange3: any): number {
    console.log('Calculez prețul din mărimi:', { priceRange1, priceRange2, priceRange3 });
    
    // Verifică ce mărimi sunt disponibile în stoc
    const availableSizes = this.getAvailableSizes(rowData, headers);
    console.log('Mărimile disponibile:', availableSizes);
    
    // Determină prețul în funcție de mărimile disponibile
    if (availableSizes.length === 0) {
      // Dacă nu sunt mărimi disponibile, folosește primul preț
      return this.parseNumber(priceRange1) || 0;
    }
    
    const firstPriceRange = this.parseNumber(priceRange1);
    const secondPriceRange = this.parseNumber(priceRange2);
    const thirdPriceRange = this.parseNumber(priceRange3);
    
    // Verifică ce intervale de prețuri sunt disponibile
    const hasFirstRange = firstPriceRange && availableSizes.some(size => this.isSizeInRange(size, '19-24'));
    const hasSecondRange = secondPriceRange && availableSizes.some(size => this.isSizeInRange(size, '25-29'));
    const hasThirdRange = thirdPriceRange && availableSizes.some(size => this.isSizeInRange(size, '30-35'));
    
    console.log('Intervalele disponibile:', { hasFirstRange, hasSecondRange, hasThirdRange });
    
    // Dacă sunt multiple intervale, afișează prețul primului interval disponibil (cel mai mic mărime)
    if (hasFirstRange && hasSecondRange) {
      console.log('Ambele intervale disponibile, folosesc primul preț:', firstPriceRange);
      return firstPriceRange;
    }
    
    if (hasFirstRange && hasThirdRange) {
      console.log('Primul și al treilea interval disponibile, folosesc primul preț:', firstPriceRange);
      return firstPriceRange;
    }
    
    if (hasSecondRange && hasThirdRange) {
      console.log('Al doilea și al treilea interval disponibile, folosesc al doilea preț:', secondPriceRange);
      return secondPriceRange;
    }
    
    // Dacă este doar un interval disponibil
    if (hasFirstRange) {
      console.log('Folosesc primul preț:', firstPriceRange);
      return firstPriceRange;
    }
    
    if (hasSecondRange) {
      console.log('Folosesc al doilea preț:', secondPriceRange);
      return secondPriceRange;
    }
    
    if (hasThirdRange) {
      console.log('Folosesc al treilea preț:', thirdPriceRange);
      return thirdPriceRange;
    }
    
    // Fallback la primul preț
    return firstPriceRange || 0;
  }

  /**
   * Verifică dacă o mărime este într-un interval
   */
  private isSizeInRange(size: number, range: string): boolean {
    const [min, max] = range.split('-').map(n => parseInt(n.trim()));
    return size >= min && size <= max;
  }

  /**
   * Obține mărimile care au stoc disponibil
   */
  private getAvailableSizes(rowData: { [key: string]: any }, headers: string[]): number[] {
    const availableSizes: number[] = [];
    
    // Caută coloanele care sunt mărimi (numere de la 18 la 40)
    Object.keys(rowData).forEach(key => {
      const sizeNumber = parseInt(key.trim());
      if (!isNaN(sizeNumber) && sizeNumber >= 18 && sizeNumber <= 40) {
        const stock = this.parseNumber(rowData[key]);
        if (stock && stock > 0) {
          availableSizes.push(sizeNumber);
        }
      }
    });
    
    return availableSizes.sort((a, b) => a - b);
  }

  /**
   * Calculează stocul total din coloanele de mărimi
   */
  private calculateTotalStockFromSizes(rowData: { [key: string]: any }, headers: string[]): number {
    let totalStock = 0;
    
    // Caută coloanele care par să fie mărimi (conțin numere și nu sunt coloanele principale)
    const excludedColumns = [
      'foto', 'photo', 'imagine', 'image',
      'codice prodotto', 'codice_prodotto', 'cod_produs', 'sku',
      'fascia', 'range', 'gama',
      '1st size range', '1st_size_range', 'size_range',
      'st price range', '1st price range', '1st_price_range', 'price_range',
      '2nd size range', '2nd price range', '3rd size range', '3rd price range',
      'paia', 'stoc_total', 'total_stock',
      'descrizione linea', 'descrizione modello', 'descrizione prodotto',
      'campagna', 'descrizione tipologia', 'descrizione classe'
    ];
    
    Object.keys(rowData).forEach(key => {
      const isExcluded = excludedColumns.some(excluded => 
        key.toLowerCase().includes(excluded.toLowerCase())
      );
      
      if (!isExcluded && rowData[key] !== null && rowData[key] !== undefined && rowData[key] !== '') {
        const stock = this.parseNumber(rowData[key]);
        if (stock !== undefined && stock > 0) {
          totalStock += stock;
        }
      }
    });
    
    return totalStock;
  }

  /**
   * Extrage caracteristicile de mărimi
   */
  private extractSizeFeatures(rowData: { [key: string]: any }, headers: string[], priceRange1?: any, priceRange2?: any, priceRange3?: any): string[] | undefined {
    const features: string[] = [];
    const excludedColumns = [
      'foto', 'photo', 'imagine', 'image',
      'codice prodotto', 'codice_prodotto', 'cod_produs', 'sku',
      'fascia', 'range', 'gama',
      '1st size range', '1st_size_range', 'size_range',
      'st price range', '1st price range', '1st_price_range', 'price_range',
      '2nd size range', '2nd price range', '3rd size range', '3rd price range',
      'paia', 'stoc_total', 'total_stock',
      'descrizione linea', 'descrizione modello', 'descrizione prodotto',
      'campagna', 'descrizione tipologia', 'descrizione classe'
    ];
    
    // Informațiile despre prețuri sunt afișate în secțiunea dedicată, nu aici
    
    // Adaugă mărimile disponibile
    Object.keys(rowData).forEach(key => {
      const isExcluded = excludedColumns.some(excluded => 
        key.toLowerCase().includes(excluded.toLowerCase())
      );
      
      if (!isExcluded && rowData[key] !== null && rowData[key] !== undefined && rowData[key] !== '') {
        const stock = this.parseNumber(rowData[key]);
        if (stock !== undefined && stock > 0) {
          features.push(`Mărimea ${key}: ${stock} bucăți`);
        }
      }
    });
    
    return features.length > 0 ? features : undefined;
  }

  /**
   * Creează specificațiile din rând
   */
  private createSpecificationsFromRow(rowData: { [key: string]: any }, headers: string[]): { [key: string]: string } | undefined {
    const specs: { [key: string]: string } = {};
    
    // Adaugă informațiile principale
    if (rowData['fascia']) specs['Gama'] = String(rowData['fascia']);
    if (rowData['1st size range']) specs['Interval mărimi'] = String(rowData['1st size range']);
    if (rowData['1st price range']) specs['Preț'] = String(rowData['1st price range']);
    if (rowData['paia']) specs['Stoc total'] = String(rowData['paia']);
    
    return Object.keys(specs).length > 0 ? specs : undefined;
  }

  /**
   * Creează tag-urile din rând
   */
  private createTagsFromRow(rowData: { [key: string]: any }, fascia?: any, sizeRange?: any): string[] | undefined {
    const tags: string[] = [];
    
    if (fascia) tags.push(String(fascia).toLowerCase());
    if (sizeRange) tags.push(String(sizeRange).toLowerCase());
    
    return tags.length > 0 ? tags : undefined;
  }

  /**
   * Extrage codul produsului din numele imaginii
   * Format: 202528850011_1 -> 8850011_1
   */
  private extractProductCodeFromImage(imageName: string): string {
    if (!imageName) return '';
    
    // Pentru formatul 202528850011_3, extrage codul produsului 8850011
    if (imageName.startsWith('20252')) {
      // Elimină prefixul 20252 și sufixul _1/_2/_3
      let productCode = imageName.substring(5); // Elimină primele 5 caractere (20252)
      
      // Elimină sufixul _1, _2, _3 etc.
      const underscoreIndex = productCode.lastIndexOf('_');
      if (underscoreIndex !== -1) {
        productCode = productCode.substring(0, underscoreIndex);
      }
      
      console.log(`Extrag codul produsului din "${imageName}" -> "${productCode}"`);
      return productCode;
    }
    
    console.log(`Extrag codul produsului din "${imageName}" -> "${imageName}"`);
    return imageName;
  }

  /**
   * Generează lista de imagini pentru un produs
   * Caută imagini cu sufixele _1, _2, _3, etc.
   */
  private generateProductImages(productCode: string): string[] {
    const images: string[] = [];
    
    // Generează imagini Cloudinary pentru produs
    const fullImagePrefix = `20252${productCode}`;
    
    // Generează imagini cu sufixe _1, _2, _3 folosind Cloudinary
    for (let i = 1; i <= 3; i++) {
      const imageName = `${fullImagePrefix}_${i}`;
      const cloudinaryUrl = getCloudinaryImageUrl(`products/${imageName}.jpg`, 400, 300);
      images.push(cloudinaryUrl);
    }
    
    console.log(`Imagini Cloudinary generate pentru produsul ${productCode}:`, images);
    return images;
  }

  /**
   * Procesează URL-ul imaginii
   */
  private processImageUrl(imageUrl: any, productCode?: string): string {
    console.log('Procesez imaginea:', imageUrl, 'Tip:', typeof imageUrl, 'Cod produs:', productCode);
    
    // Dacă avem cod produs, folosim Cloudinary
    if (productCode) {
      const cloudinaryUrl = getCloudinaryImageUrl(`products/${productCode}.jpg`, 400, 300);
      console.log(`Folosesc Cloudinary pentru: ${productCode} -> ${cloudinaryUrl}`);
      return cloudinaryUrl;
    }
    
    // Dacă nu există imagine sau este null/undefined
    if (!imageUrl || imageUrl === null || imageUrl === undefined) {
      console.log('Nu există URL de imagine în Excel, folosesc placeholder');
      return this.getPlaceholderImage();
    }
    
    const url = String(imageUrl).trim();
    console.log(`URL imagine din Excel: "${url}" (lungime: ${url.length})`);
    
    // Dacă este gol sau doar spații, probabil că imaginea este atașată în Excel
    if (url === '' || url === ' ' || url.length < 3) {
      console.log('Imagine atașată în Excel detectată, folosesc placeholder');
      return this.getPlaceholderImage();
    }
    
    // Dacă este un URL valid
    if (url.startsWith('http://') || url.startsWith('https://')) {
      console.log('URL valid găsit:', url);
      return url;
    }
    
    // Dacă este un path relativ, încearcă să-l faci absolut
    if (url.startsWith('/') || url.startsWith('./')) {
      console.log('Path relativ găsit:', url);
      return url;
    }
    
    // Dacă pare să fie doar un nume de fișier, încearcă să-l găsești în assets
    if (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') || url.includes('.gif')) {
      console.log('Nume fișier găsit:', url);
      
      // Dacă este în formatul nou (202528850011_1), returnează numele complet
      if (url.startsWith('20252')) {
        return `/assets/images/${url}`;
      }
      
      return `/assets/images/${url}`;
    }
    
    // Pentru orice altceva, folosește placeholder-ul pentru imaginile atașate
    console.log(`URL imagine necunoscut: "${url}", folosesc placeholder pentru imagine atașată`);
    return this.getPlaceholderImage();
  }

  /**
   * Returnează o imagine placeholder pentru imaginile atașate în Excel
   */
  private getPlaceholderImage(): string {
    return 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=📸+Imagine+din+Excel';
  }

  /**
   * Returnează o imagine default
   */
  private getDefaultImage(): string {
    return 'https://via.placeholder.com/400x300?text=Imagine+Produs';
  }

  /**
   * Creează intervalele de prețuri pentru produs
   */
  private createPriceRanges(rowData: { [key: string]: any }, headers: string[], priceRange1?: any, priceRange2?: any, priceRange3?: any): PriceRange[] {
    const priceRanges: PriceRange[] = [];
    
    console.log('Creez intervalele de prețuri:', { priceRange1, priceRange2, priceRange3 });
    
    // Primul interval de prețuri
    const firstPrice = this.parseNumber(priceRange1);
    const firstSizeRange = this.findValue(rowData, ['1st size range', '1st_size_range', 'size_range']);
    if (firstPrice && firstSizeRange) {
      const firstRangeStock = this.calculateStockForSizeRange(rowData, headers, firstSizeRange);
      priceRanges.push({
        sizeRange: firstSizeRange,
        price: firstPrice,
        stock: firstRangeStock,
        isAvailable: firstRangeStock > 0
      });
    }
    
    // Al doilea interval de prețuri (25-30)
    const secondPrice = this.parseNumber(priceRange2);
    const secondSizeRange = this.findValue(rowData, ['2nd size range', '2nd_size_range']);
    if (secondPrice && secondSizeRange) {
      const secondRangeStock = this.calculateStockForSizeRange(rowData, headers, secondSizeRange);
      priceRanges.push({
        sizeRange: secondSizeRange,
        price: secondPrice,
        stock: secondRangeStock,
        isAvailable: secondRangeStock > 0
      });
    }
    
    // Al treilea interval de prețuri
    const thirdPrice = this.parseNumber(priceRange3);
    const thirdSizeRange = this.findValue(rowData, ['3rd size range', '3rd_size_range']);
    if (thirdPrice && thirdSizeRange) {
      const thirdRangeStock = this.calculateStockForSizeRange(rowData, headers, thirdSizeRange);
      priceRanges.push({
        sizeRange: thirdSizeRange,
        price: thirdPrice,
        stock: thirdRangeStock,
        isAvailable: thirdRangeStock > 0
      });
    }
    
    console.log('Intervalele de prețuri create:', priceRanges);
    return priceRanges;
  }

  /**
   * Calculează stocul pentru un interval de mărimi specific
   */
  private calculateStockForSizeRange(rowData: { [key: string]: any }, headers: string[], range: string): number {
    const [minSize, maxSize] = range.split('-').map(n => parseInt(n.trim()));
    let totalStock = 0;
    
    console.log(`Calculez stocul pentru intervalul ${range} (${minSize}-${maxSize})`);
    console.log('Coloanele disponibile:', Object.keys(rowData));
    
    // Caută coloanele care sunt mărimi în intervalul specificat
    Object.keys(rowData).forEach(key => {
      const sizeNumber = parseInt(key.trim());
      if (!isNaN(sizeNumber) && sizeNumber >= minSize && sizeNumber <= maxSize) {
        const stock = this.parseNumber(rowData[key]);
        console.log(`Mărimea ${sizeNumber}: stoc = ${stock}`);
        if (stock && stock > 0) {
          totalStock += stock;
        }
      }
    });
    
    console.log(`Total stoc pentru intervalul ${range}: ${totalStock}`);
    return totalStock;
  }

  /**
   * Creează mărimile individuale pentru produs
   */
  private createIndividualSizes(rowData: { [key: string]: any }, headers: string[], priceRange1?: any, priceRange2?: any, priceRange3?: any): ProductSize[] {
    const sizes: ProductSize[] = [];
    
    console.log('Creez mărimile individuale pentru produs');
    
    // Obține prețurile și intervalele pentru fiecare interval
    const firstPrice = this.parseNumber(priceRange1);
    const firstSizeRange = this.findValue(rowData, ['1st size range', '1st_size_range', 'size_range']);
    
    const secondPrice = this.parseNumber(priceRange2);
    const secondSizeRange = this.findValue(rowData, ['2nd size range', '2nd_size_range']);
    
    const thirdPrice = this.parseNumber(priceRange3);
    const thirdSizeRange = this.findValue(rowData, ['3rd size range', '3rd_size_range']);
    
    console.log('Intervalele de prețuri găsite:', { firstSizeRange, secondSizeRange, thirdSizeRange });
    
    // Caută coloanele care sunt mărimi individuale (numere de la 18 la 40)
    Object.keys(rowData).forEach(key => {
      const sizeNumber = parseInt(key.trim());
      if (!isNaN(sizeNumber) && sizeNumber >= 18 && sizeNumber <= 40) {
        const stock = this.parseNumber(rowData[key]);
        if (stock !== undefined && stock > 0) {
          // Determină prețul pentru această mărime folosind intervalele reale
          let price = firstPrice || 0;
          
          if (firstSizeRange && this.isSizeInRange(sizeNumber, firstSizeRange) && firstPrice) {
            price = firstPrice;
          } else if (secondSizeRange && this.isSizeInRange(sizeNumber, secondSizeRange) && secondPrice) {
            price = secondPrice;
          } else if (thirdSizeRange && this.isSizeInRange(sizeNumber, thirdSizeRange) && thirdPrice) {
            price = thirdPrice;
          }
          
          console.log(`Mărimea ${sizeNumber}: stoc=${stock}, preț=${price}`);
          
          sizes.push({
            size: sizeNumber,
            stock: stock,
            price: price,
            isAvailable: stock > 0
          });
        }
      }
    });
    
    console.log('Mărimile individuale create:', sizes);
    return sizes.sort((a, b) => a.size - b.size);
  }
}
