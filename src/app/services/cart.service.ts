import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart, CartItem, Product, ProductSize } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>({
    items: [],
    total: 0,
    itemCount: 0
  });

  public cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  /**
   * Adaugă un produs în coș
   */
  addToCart(product: Product, size: number, quantity: number = 1): void {
    const cart = this.cartSubject.value;
    const existingItemIndex = cart.items.findIndex(
      item => item.product.id === product.id && item.size === size
    );

    if (existingItemIndex > -1) {
      // Actualizează cantitatea pentru produsul existent cu noua cantitate
      cart.items[existingItemIndex].quantity = quantity;
    } else {
      // Adaugă un nou produs în coș
      const price = this.getPriceForSize(product, size);
      const newItem: CartItem = {
        product,
        size,
        quantity,
        price
      };
      cart.items.push(newItem);
    }

    this.updateCartTotals(cart);
    this.saveCartToStorage(cart);
  }

  /**
   * Elimină un produs din coș
   */
  removeFromCart(productId: number, size: number): void {
    const cart = this.cartSubject.value;
    cart.items = cart.items.filter(
      item => !(item.product.id === productId && item.size === size)
    );

    this.updateCartTotals(cart);
    this.saveCartToStorage(cart);
  }

  /**
   * Actualizează cantitatea unui produs din coș
   */
  updateQuantity(productId: number, size: number, quantity: number): void {
    const cart = this.cartSubject.value;
    const item = cart.items.find(
      item => item.product.id === productId && item.size === size
    );

    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId, size);
      } else {
        item.quantity = quantity;
        this.updateCartTotals(cart);
        this.saveCartToStorage(cart);
      }
    }
  }

  /**
   * Golește coșul
   */
  clearCart(): void {
    const emptyCart: Cart = {
      items: [],
      total: 0,
      itemCount: 0
    };
    this.cartSubject.next(emptyCart);
    this.saveCartToStorage(emptyCart);
  }

  /**
   * Obține mărimile disponibile pentru un produs
   */
  getAvailableSizes(product: Product): ProductSize[] {
    // Folosește mărimile individuale dacă sunt disponibile
    if (product.sizes && product.sizes.length > 0) {
      return product.sizes.filter(size => size.isAvailable && size.stock > 0);
    }

    // Fallback la intervalele de prețuri dacă nu sunt mărimi individuale
    const sizes: ProductSize[] = [];
    
    if (!product.priceRanges || product.priceRanges.length === 0) {
      return sizes;
    }

    // Pentru fiecare interval de prețuri, obține mărimile disponibile
    product.priceRanges.forEach(priceRange => {
      if (priceRange.isAvailable && priceRange.stock && priceRange.stock > 0) {
        // Parsează intervalul de mărimi (ex: "19-24")
        const [minSize, maxSize] = priceRange.sizeRange.split('-').map(s => parseInt(s.trim()));
        
        if (!isNaN(minSize) && !isNaN(maxSize)) {
          // Adaugă fiecare mărime din interval
          for (let size = minSize; size <= maxSize; size++) {
            // Verifică dacă mărimea este disponibilă în stoc
            const stockForSize = this.getStockForSize(product, size);
            if (stockForSize > 0) {
              sizes.push({
                size,
                stock: stockForSize,
                price: priceRange.price,
                isAvailable: true
              });
            }
          }
        }
      }
    });

    return sizes.sort((a, b) => a.size - b.size);
  }

  /**
   * Obține stocul pentru o mărime specifică
   */
  private getStockForSize(product: Product, size: number): number {
    // Folosește mărimile individuale dacă sunt disponibile
    if (product.sizes && product.sizes.length > 0) {
      const sizeOption = product.sizes.find(s => s.size === size);
      return sizeOption ? sizeOption.stock : 0;
    }

    // Fallback la calculul din intervalele de prețuri
    if (product.priceRanges && product.priceRanges.length > 0) {
      for (const priceRange of product.priceRanges) {
        const [minSize, maxSize] = priceRange.sizeRange.split('-').map(s => parseInt(s.trim()));
        if (size >= minSize && size <= maxSize) {
          return priceRange.stock || 0;
        }
      }
    }

    return 0;
  }

  /**
   * Obține prețul pentru o mărime specifică
   */
  private getPriceForSize(product: Product, size: number): number {
    // Folosește mărimile individuale dacă sunt disponibile
    if (product.sizes && product.sizes.length > 0) {
      const sizeOption = product.sizes.find(s => s.size === size);
      if (sizeOption) {
        return sizeOption.price;
      }
    }

    // Fallback la intervalele de prețuri
    if (product.priceRanges && product.priceRanges.length > 0) {
      // Găsește intervalul de prețuri care conține mărimea
      for (const priceRange of product.priceRanges) {
        const [minSize, maxSize] = priceRange.sizeRange.split('-').map(s => parseInt(s.trim()));
        if (size >= minSize && size <= maxSize) {
          return priceRange.price;
        }
      }
    }

    return product.price; // Fallback la prețul principal
  }

  /**
   * Actualizează totalurile coșului
   */
  private updateCartTotals(cart: Cart): void {
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    this.cartSubject.next(cart);
  }

  /**
   * Salvează coșul în localStorage
   */
  private saveCartToStorage(cart: Cart): void {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Eroare la salvarea coșului:', error);
    }
  }

  /**
   * Încarcă coșul din localStorage
   */
  private loadCartFromStorage(): void {
    try {
      const cartData = localStorage.getItem('cart');
      if (cartData) {
        const cart = JSON.parse(cartData);
        this.cartSubject.next(cart);
      }
    } catch (error) {
      console.error('Eroare la încărcarea coșului:', error);
    }
  }

  /**
   * Verifică dacă un produs cu o mărime specifică este în coș
   */
  isInCart(productId: number, size: number): boolean {
    const cart = this.cartSubject.value;
    return cart.items.some(item => item.product.id === productId && item.size === size);
  }

  /**
   * Obține cantitatea unui produs din coș
   */
  getQuantityInCart(productId: number, size: number): number {
    const cart = this.cartSubject.value;
    const item = cart.items.find(item => item.product.id === productId && item.size === size);
    return item ? item.quantity : 0;
  }
}
