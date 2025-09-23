import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order, Cart, CustomerInfo, OrderStatus } from '../models/product.model';
import { EmailService } from './email.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  constructor(private emailService: EmailService) {
    this.loadOrdersFromStorage();
  }

  /**
   * Creează o comandă nouă
   */
  createOrder(cart: Cart, customerInfo: CustomerInfo, notes?: string): Order {
    const orderId = this.generateOrderId();
    const orderNumber = this.generateOrderNumber();
    
    const order: Order = {
      id: orderId,
      orderNumber: orderNumber,
      customerInfo: customerInfo,
      items: [...cart.items], // Copie a produselor din coș
      subtotal: cart.total,
      shipping: 0, // Transport gratuit
      total: cart.total,
      status: 'pending',
      notes: notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Adaugă comanda la lista de comenzi
    const currentOrders = this.ordersSubject.value;
    const updatedOrders = [...currentOrders, order];
    this.ordersSubject.next(updatedOrders);
    
    // Salvează în localStorage
    this.saveOrdersToStorage(updatedOrders);
    
    return order;
  }

  /**
   * Obține toate comenzile
   */
  getOrders(): Observable<Order[]> {
    return this.orders$;
  }

  /**
   * Obține o comandă după ID
   */
  getOrderById(orderId: string): Order | undefined {
    const orders = this.ordersSubject.value;
    return orders.find(order => order.id === orderId);
  }

  /**
   * Obține o comandă după numărul de comandă
   */
  getOrderByNumber(orderNumber: string): Order | undefined {
    const orders = this.ordersSubject.value;
    return orders.find(order => order.orderNumber === orderNumber);
  }

  /**
   * Actualizează statusul unei comenzi
   */
  updateOrderStatus(orderId: string, status: OrderStatus): boolean {
    const orders = this.ordersSubject.value;
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      return false;
    }

    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date();
    
    this.ordersSubject.next([...orders]);
    this.saveOrdersToStorage(orders);
    
    return true;
  }

  /**
   * Obține statistici despre comenzi
   */
  getOrderStats(): { totalOrders: number; totalRevenue: number; pendingOrders: number } {
    const orders = this.ordersSubject.value;
    
    return {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
      pendingOrders: orders.filter(order => order.status === 'pending').length
    };
  }

  /**
   * Generează un ID unic pentru comandă
   */
  private generateOrderId(): string {
    return 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Generează un număr de comandă formatat
   */
  private generateOrderNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const timestamp = now.getTime().toString().slice(-6);
    
    return `ORD-${year}${month}${day}-${timestamp}`;
  }

  /**
   * Salvează comenzile în localStorage
   */
  private saveOrdersToStorage(orders: Order[]): void {
    try {
      localStorage.setItem('orders', JSON.stringify(orders));
    } catch (error) {
      console.error('Eroare la salvarea comenzilor:', error);
    }
  }

  /**
   * Încarcă comenzile din localStorage
   */
  private loadOrdersFromStorage(): void {
    try {
      const ordersData = localStorage.getItem('orders');
      if (ordersData) {
        const orders = JSON.parse(ordersData);
        // Convertim string-urile de date în obiecte Date
        orders.forEach((order: any) => {
          order.createdAt = new Date(order.createdAt);
          order.updatedAt = new Date(order.updatedAt);
        });
        this.ordersSubject.next(orders);
      }
    } catch (error) {
      console.error('Eroare la încărcarea comenzilor:', error);
    }
  }

  /**
   * Trimite email de confirmare către client
   */
  async sendOrderConfirmationEmail(order: Order): Promise<boolean> {
    try {
      return await this.emailService.sendOrderConfirmationEmail(order);
    } catch (error) {
      console.error('Eroare la trimiterea email-ului de confirmare:', error);
      return false;
    }
  }

  /**
   * Trimite notificare către administrator pentru comandă nouă
   */
  async notifyAdminNewOrder(order: Order): Promise<boolean> {
    try {
      return await this.emailService.sendAdminNotificationEmail(order);
    } catch (error) {
      console.error('Eroare la trimiterea notificării administrator:', error);
      return false;
    }
  }
}
