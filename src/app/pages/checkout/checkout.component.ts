import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Cart, CartItem, CustomerInfo } from '../../models/product.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Finalizează comanda</h1>
        <p class="page-description">Completează datele pentru finalizarea comenzii</p>
      </div>

      <div class="checkout-content" *ngIf="cart.items.length > 0; else emptyCart">
        <div class="checkout-form">
          <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()">
            <div class="form-section">
              <h3>Informații companie</h3>
              
              <div class="form-group">
                <label for="companyName">Nume companie *</label>
                <input 
                  type="text" 
                  id="companyName"
                  formControlName="companyName"
                  class="form-input"
                  placeholder="Introduceți numele companiei"
                >
                <div class="error-message" *ngIf="checkoutForm.get('companyName')?.invalid && checkoutForm.get('companyName')?.touched">
                  Numele companiei este obligatoriu
                </div>
              </div>

              <div class="form-group">
                <label for="companyAddress">Adresa companiei *</label>
                <textarea 
                  id="companyAddress"
                  formControlName="companyAddress"
                  class="form-textarea"
                  placeholder="Introduceți adresa completă a companiei"
                  rows="3"
                ></textarea>
                <div class="error-message" *ngIf="checkoutForm.get('companyAddress')?.invalid && checkoutForm.get('companyAddress')?.touched">
                  Adresa companiei este obligatorie
                </div>
              </div>

              <div class="form-group">
                <label for="vat">CUI/CIF *</label>
                <input 
                  type="text" 
                  id="vat"
                  formControlName="vat"
                  class="form-input"
                  placeholder="Introduceți CUI/CIF-ul companiei"
                >
                <div class="error-message" *ngIf="checkoutForm.get('vat')?.invalid && checkoutForm.get('vat')?.touched">
                  CUI/CIF-ul este obligatoriu
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3>Informații livrare</h3>
              
              <div class="form-group">
                <label for="deliveryAddress">Adresa de livrare *</label>
                <textarea 
                  id="deliveryAddress"
                  formControlName="deliveryAddress"
                  class="form-textarea"
                  placeholder="Introduceți adresa de livrare"
                  rows="3"
                ></textarea>
                <div class="error-message" *ngIf="checkoutForm.get('deliveryAddress')?.invalid && checkoutForm.get('deliveryAddress')?.touched">
                  Adresa de livrare este obligatorie
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3>Informații contact</h3>
              
              <div class="form-group">
                <label for="phoneNumber">Număr de telefon *</label>
                <input 
                  type="tel" 
                  id="phoneNumber"
                  formControlName="phoneNumber"
                  class="form-input"
                  placeholder="Introduceți numărul de telefon"
                >
                <div class="error-message" *ngIf="checkoutForm.get('phoneNumber')?.invalid && checkoutForm.get('phoneNumber')?.touched">
                  Numărul de telefon este obligatoriu
                </div>
              </div>

              <div class="form-group">
                <label for="emailAddress">Adresa de email *</label>
                <input 
                  type="email" 
                  id="emailAddress"
                  formControlName="emailAddress"
                  class="form-input"
                  placeholder="Introduceți adresa de email"
                >
                <div class="error-message" *ngIf="checkoutForm.get('emailAddress')?.invalid && checkoutForm.get('emailAddress')?.touched">
                  <span *ngIf="checkoutForm.get('emailAddress')?.errors?.['required']">Adresa de email este obligatorie</span>
                  <span *ngIf="checkoutForm.get('emailAddress')?.errors?.['email']">Introduceți o adresă de email validă</span>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3>Observații</h3>
              
              <div class="form-group">
                <label for="notes">Observații (opțional)</label>
                <textarea 
                  id="notes"
                  formControlName="notes"
                  class="form-textarea"
                  placeholder="Observații suplimentare pentru comandă"
                  rows="3"
                ></textarea>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" routerLink="/cart">
                Înapoi la coș
              </button>
              <button 
                type="submit" 
                class="btn btn-primary"
                [disabled]="checkoutForm.invalid || isSubmitting"
              >
                <span *ngIf="!isSubmitting">Finalizează comanda</span>
                <span *ngIf="isSubmitting">Se procesează...</span>
              </button>
            </div>
          </form>
        </div>

        <div class="order-summary">
          <div class="summary-card">
            <h3>Rezumat comandă</h3>
            
            <div class="order-items">
              <div class="order-item" *ngFor="let item of cart.items">
                <div class="item-info">
                  <h4>{{ item.product.name }}</h4>
                  <p>Mărimea: {{ item.size }}</p>
                  <p>Cantitate: {{ item.quantity }}</p>
                </div>
                <div class="item-price">
                  {{ getItemTotal(item) | currency:'EUR':'symbol':'1.2-2' }}
                </div>
              </div>
            </div>
            
            <div class="summary-divider"></div>
            
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>{{ cart.total | currency:'EUR':'symbol':'1.2-2' }}</span>
            </div>
            
            <div class="summary-row">
              <span>Transport:</span>
              <span>Gratuit</span>
            </div>
            
            <div class="summary-divider"></div>
            
            <div class="summary-row total">
              <span>Total:</span>
              <span>{{ cart.total | currency:'EUR':'symbol':'1.2-2' }}</span>
            </div>
          </div>
        </div>
      </div>

      <ng-template #emptyCart>
        <div class="empty-cart">
          <div class="empty-cart-icon">🛒</div>
          <h3>Coșul este gol</h3>
          <p>Nu aveți produse în coș pentru a finaliza comanda.</p>
          <button class="btn btn-primary" routerLink="/products">
            Vezi produse
          </button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .page-header {
      text-align: center;
      margin-bottom: 3rem;
    }
    
    .page-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 1rem;
    }
    
    .page-description {
      font-size: 1.1rem;
      color: #6b7280;
      max-width: 600px;
      margin: 0 auto;
    }

    .checkout-content {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .checkout-form {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
    }

    .form-section {
      margin-bottom: 2rem;
    }

    .form-section h3 {
      font-size: 1.2rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .form-input,
    .form-textarea {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
      box-sizing: border-box;
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #3b82f6;
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
    }

    .error-message {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e5e7eb;
    }

    .order-summary {
      position: sticky;
      top: 2rem;
      height: fit-content;
    }

    .summary-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
    }

    .summary-card h3 {
      font-size: 1.2rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .order-items {
      margin-bottom: 1rem;
    }

    .order-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 0.75rem 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .item-info h4 {
      font-size: 0.95rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.25rem 0;
    }

    .item-info p {
      font-size: 0.85rem;
      color: #6b7280;
      margin: 0;
    }

    .item-price {
      font-size: 0.95rem;
      font-weight: 600;
      color: #1f2937;
    }

    .summary-divider {
      height: 1px;
      background: #e5e7eb;
      margin: 1rem 0;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      font-size: 0.95rem;
    }

    .summary-row.total {
      font-size: 1.1rem;
      font-weight: 700;
      color: #1f2937;
    }

    .empty-cart {
      text-align: center;
      padding: 4rem 2rem;
      color: #6b7280;
    }

    .empty-cart-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-cart h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #1f2937;
    }

    .empty-cart p {
      font-size: 1rem;
      margin-bottom: 2rem;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
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

    .btn-primary:hover:not(:disabled) {
      background: #2563eb;
      transform: translateY(-1px);
    }

    .btn-primary:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      transform: none;
    }

    .btn-secondary {
      background: #6b7280;
      color: white;
    }

    .btn-secondary:hover {
      background: #4b5563;
      transform: translateY(-1px);
    }

    @media (max-width: 1024px) {
      .checkout-content {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .order-summary {
        position: static;
      }
    }

    @media (max-width: 768px) {
      .checkout-form {
        padding: 1.5rem;
      }

      .form-actions {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }

      .page-header h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  cart: Cart = { items: [], total: 0, itemCount: 0 };
  checkoutForm: FormGroup;
  isSubmitting: boolean = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      companyName: ['', Validators.required],
      companyAddress: ['', Validators.required],
      vat: ['', Validators.required],
      deliveryAddress: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      
      // Dacă coșul este gol, redirecționează la pagina de produse
      if (cart.items.length === 0) {
        this.router.navigate(['/products']);
      }
    });
  }

  getItemTotal(item: CartItem): number {
    return item.price * item.quantity;
  }

  async onSubmit(): Promise<void> {
    if (this.checkoutForm.valid) {
      this.isSubmitting = true;
      
      try {
        // Simulează procesarea comenzii cu un delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Creează informațiile clientului
        const customerInfo: CustomerInfo = {
          companyName: this.checkoutForm.value.companyName,
          companyAddress: this.checkoutForm.value.companyAddress,
          vat: this.checkoutForm.value.vat,
          deliveryAddress: this.checkoutForm.value.deliveryAddress,
          phoneNumber: this.checkoutForm.value.phoneNumber,
          emailAddress: this.checkoutForm.value.emailAddress
        };

        // Creează comanda
        const order = this.orderService.createOrder(
          this.cart, 
          customerInfo, 
          this.checkoutForm.value.notes
        );

        // Trimite email de confirmare către client
        const emailSent = await this.orderService.sendOrderConfirmationEmail(order);
        if (emailSent) {
          console.log('✅ Email de confirmare trimis cu succes către client');
        } else {
          console.warn('⚠️ Email de confirmare nu a putut fi trimis');
        }
        
        // Notifică administratorul
        const adminNotified = await this.orderService.notifyAdminNewOrder(order);
        if (adminNotified) {
          console.log('✅ Administrator notificat cu succes');
        } else {
          console.warn('⚠️ Administratorul nu a putut fi notificat');
        }

        // Golește coșul
        this.cartService.clearCart();
        
        // Navighează la pagina de confirmare cu numărul comenzii
        this.router.navigate(['/order-confirmation', order.orderNumber]);
        
      } catch (error) {
        console.error('Eroare la crearea comenzii:', error);
        alert('A apărut o eroare la finalizarea comenzii. Vă rugăm să încercați din nou.');
      } finally {
        this.isSubmitting = false;
      }
    } else {
      // Marchează toate câmpurile ca fiind touched pentru a afișa erorile
      Object.keys(this.checkoutForm.controls).forEach(key => {
        this.checkoutForm.get(key)?.markAsTouched();
      });
    }
  }
}
