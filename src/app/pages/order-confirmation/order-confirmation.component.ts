import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/product.model';
import { EmailPreviewComponent } from '../../components/email-preview/email-preview.component';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule, EmailPreviewComponent],
  template: `
    <div class="container">
      <div class="confirmation-content" *ngIf="order; else orderNotFound">
        <div class="success-header">
          <div class="success-icon">✅</div>
          <h1>Comanda a fost finalizată cu succes!</h1>
          <p class="success-message">
            Vă mulțumim pentru comandă! Veți primi un email de confirmare în curând.
          </p>
        </div>

        <div class="order-details">
          <div class="order-info-card">
            <h3>Detalii comandă</h3>
            
            <div class="info-row">
              <span class="label">Număr comandă:</span>
              <span class="value order-number">{{ order.orderNumber }}</span>
            </div>
            
            <div class="info-row">
              <span class="label">Data comenzii:</span>
              <span class="value">{{ order.createdAt | date:'dd.MM.yyyy HH:mm' }}</span>
            </div>
            
            <div class="info-row">
              <span class="label">Status:</span>
              <span class="value status-badge" [class]="'status-' + order.status">
                {{ getStatusText(order.status) }}
              </span>
            </div>
            
            <div class="info-row">
              <span class="label">Total:</span>
              <span class="value total-amount">{{ order.total | currency:'EUR':'symbol':'1.2-2' }}</span>
            </div>
          </div>

          <div class="customer-info-card">
            <h3>Informații client</h3>
            
            <div class="info-row">
              <span class="label">Companie:</span>
              <span class="value">{{ order.customerInfo.companyName }}</span>
            </div>
            
            <div class="info-row">
              <span class="label">CUI/CIF:</span>
              <span class="value">{{ order.customerInfo.vat }}</span>
            </div>
            
            <div class="info-row">
              <span class="label">Email:</span>
              <span class="value">{{ order.customerInfo.emailAddress }}</span>
            </div>
            
            <div class="info-row">
              <span class="label">Telefon:</span>
              <span class="value">{{ order.customerInfo.phoneNumber }}</span>
            </div>
          </div>

          <div class="delivery-info-card">
            <h3>Adresa de livrare</h3>
            <div class="address-text">{{ order.customerInfo.deliveryAddress }}</div>
          </div>
        </div>

        <div class="order-items">
          <h3>Produse comandate</h3>
          <div class="items-list">
            <div class="item-row" *ngFor="let item of order.items">
              <div class="item-details">
                <h4>{{ item.product.name }}</h4>
                <p>Mărimea: {{ item.size }} | Cantitate: {{ item.quantity }}</p>
              </div>
              <div class="item-price">
                {{ getItemTotal(item) | currency:'EUR':'symbol':'1.2-2' }}
              </div>
            </div>
          </div>
          
          <div class="order-summary">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>{{ order.subtotal | currency:'EUR':'symbol':'1.2-2' }}</span>
            </div>
            <div class="summary-row">
              <span>Transport:</span>
              <span>Gratuit</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-row total">
              <span>Total:</span>
              <span>{{ order.total | currency:'EUR':'symbol':'1.2-2' }}</span>
            </div>
          </div>
        </div>

        <div class="next-steps">
          <h3>Următorii pași</h3>
          <div class="steps-list">
            <div class="step">
              <span class="step-number">1</span>
              <span class="step-text">Veți primi un email de confirmare cu detaliile comenzii</span>
            </div>
            <div class="step">
              <span class="step-number">2</span>
              <span class="step-text">Echipa noastră va procesa comanda în 1-2 zile lucrătoare</span>
            </div>
            <div class="step">
              <span class="step-number">3</span>
              <span class="step-text">Veți fi contactați pentru confirmarea detaliilor de livrare</span>
            </div>
            <div class="step">
              <span class="step-number">4</span>
              <span class="step-text">Comanda va fi livrată la adresa specificată</span>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button class="btn btn-primary" routerLink="/products">
            Continuă cumpărăturile
          </button>
          <button class="btn btn-secondary" (click)="printOrder()">
            Printează comandă
          </button>
        </div>

        <!-- Preview Email pentru dezvoltare -->
        <div class="email-preview-section" *ngIf="showEmailPreview">
          <app-email-preview [order]="order"></app-email-preview>
        </div>
      </div>

      <ng-template #orderNotFound>
        <div class="error-content">
          <div class="error-icon">❌</div>
          <h2>Comanda nu a fost găsită</h2>
          <p>Nu am putut găsi comanda cu numărul specificat.</p>
          <button class="btn btn-primary" routerLink="/products">
            Înapoi la produse
          </button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .confirmation-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .success-header {
      text-align: center;
      margin-bottom: 3rem;
      padding: 2rem;
      background: linear-gradient(135deg, #10b981, #059669);
      border-radius: 12px;
      color: white;
    }

    .success-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .success-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .success-message {
      font-size: 1.2rem;
      opacity: 0.9;
    }

    .order-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .order-info-card,
    .customer-info-card,
    .delivery-info-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
    }

    .order-info-card h3,
    .customer-info-card h3,
    .delivery-info-card h3 {
      font-size: 1.2rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .label {
      font-weight: 600;
      color: #374151;
    }

    .value {
      color: #1f2937;
    }

    .order-number {
      font-weight: 700;
      color: #3b82f6;
      font-size: 1.1rem;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .status-pending {
      background: #fef3c7;
      color: #92400e;
    }

    .status-confirmed {
      background: #dbeafe;
      color: #1e40af;
    }

    .status-processing {
      background: #e0e7ff;
      color: #3730a3;
    }

    .status-shipped {
      background: #d1fae5;
      color: #065f46;
    }

    .status-delivered {
      background: #dcfce7;
      color: #166534;
    }

    .total-amount {
      font-weight: 700;
      font-size: 1.2rem;
      color: #059669;
    }

    .address-text {
      color: #4b5563;
      line-height: 1.6;
      white-space: pre-line;
    }

    .order-items {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
      margin-bottom: 2rem;
    }

    .order-items h3 {
      font-size: 1.2rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .item-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 1rem 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .item-row:last-child {
      border-bottom: none;
    }

    .item-details h4 {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.25rem 0;
    }

    .item-details p {
      font-size: 0.9rem;
      color: #6b7280;
      margin: 0;
    }

    .item-price {
      font-weight: 600;
      color: #1f2937;
    }

    .order-summary {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 2px solid #e5e7eb;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
    }

    .summary-row.total {
      font-size: 1.1rem;
      font-weight: 700;
      color: #1f2937;
    }

    .summary-divider {
      height: 1px;
      background: #e5e7eb;
      margin: 0.5rem 0;
    }

    .next-steps {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
      margin-bottom: 2rem;
    }

    .next-steps h3 {
      font-size: 1.2rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .steps-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .step {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .step-number {
      width: 32px;
      height: 32px;
      background: #3b82f6;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .step-text {
      color: #4b5563;
      line-height: 1.5;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 2rem;
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
      font-size: 1rem;
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

    .error-content {
      text-align: center;
      padding: 4rem 2rem;
      color: #6b7280;
    }

    .error-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .error-content h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #1f2937;
    }

    .error-content p {
      font-size: 1rem;
      margin-bottom: 2rem;
    }

    @media (max-width: 768px) {
      .order-details {
        grid-template-columns: 1fr;
      }

      .action-buttons {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }

      .success-header h1 {
        font-size: 2rem;
      }
    }

    .email-preview-section {
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 2px solid #e5e7eb;
    }
  `]
})
export class OrderConfirmationComponent implements OnInit {
  order: Order | undefined;
  showEmailPreview: boolean = false; // Setează la true pentru a afișa preview-ul email-ului

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const orderNumber = params['orderNumber'];
      if (orderNumber) {
        this.order = this.orderService.getOrderByNumber(orderNumber);
        if (!this.order) {
          console.error('Comanda nu a fost găsită:', orderNumber);
        }
      }
    });
  }

  getItemTotal(item: any): number {
    return item.price * item.quantity;
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'În așteptare',
      'confirmed': 'Confirmată',
      'processing': 'În procesare',
      'shipped': 'Expediată',
      'delivered': 'Livrată',
      'cancelled': 'Anulată'
    };
    return statusMap[status] || status;
  }

  printOrder(): void {
    window.print();
  }
}
