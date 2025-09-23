import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../../models/product.model';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-email-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="email-preview-container" *ngIf="order">
      <div class="preview-header">
        <h3>📧 Preview Email Comandă</h3>
        <p>Numărul comenzii: <strong>{{ order.orderNumber }}</strong></p>
        <div class="preview-actions">
          <button class="btn btn-primary" (click)="sendTestEmail()" [disabled]="isSending">
            {{ isSending ? 'Se trimite...' : 'Trimite Email Test' }}
          </button>
          <button class="btn btn-secondary" (click)="copyEmailContent()">
            Copiază HTML
          </button>
        </div>
      </div>
      
      <div class="email-preview">
        <div [innerHTML]="emailContent"></div>
      </div>
    </div>
  `,
  styles: [`
    .email-preview-container {
      max-width: 100%;
      margin: 20px 0;
    }

    .preview-header {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      border: 1px solid #e5e7eb;
    }

    .preview-header h3 {
      margin: 0 0 10px 0;
      color: #1f2937;
      font-size: 1.2rem;
    }

    .preview-header p {
      margin: 0 0 15px 0;
      color: #6b7280;
    }

    .preview-actions {
      display: flex;
      gap: 10px;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #2563eb;
    }

    .btn-secondary {
      background: #6b7280;
      color: white;
    }

    .btn-secondary:hover {
      background: #4b5563;
    }

    .email-preview {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
      background: white;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .email-preview ::ng-deep {
      /* Reset styles pentru preview */
      margin: 0;
      padding: 0;
    }

    .email-preview ::ng-deep body {
      margin: 0;
      padding: 0;
      background-color: #f8f9fa;
    }

    .email-preview ::ng-deep .email-container {
      margin: 0;
      padding: 0;
      box-shadow: none;
    }

    @media (max-width: 768px) {
      .preview-actions {
        flex-direction: column;
      }
      
      .btn {
        width: 100%;
      }
    }
  `]
})
export class EmailPreviewComponent {
  @Input() order: Order | undefined;
  emailContent: string = '';
  isSending: boolean = false;

  constructor(private emailService: EmailService) {}

  ngOnChanges(): void {
    if (this.order) {
      this.emailContent = this.emailService.generateOrderConfirmationEmail(this.order);
    }
  }

  async sendTestEmail(): Promise<void> {
    if (!this.order) return;
    
    this.isSending = true;
    try {
      const success = await this.emailService.sendOrderConfirmationEmail(this.order);
      if (success) {
        alert('✅ Email de test trimis cu succes! Verificați consola pentru detalii.');
      } else {
        alert('❌ Eroare la trimiterea email-ului de test.');
      }
    } catch (error) {
      console.error('Eroare la trimiterea email-ului:', error);
      alert('❌ Eroare la trimiterea email-ului de test.');
    } finally {
      this.isSending = false;
    }
  }

  copyEmailContent(): void {
    if (this.emailContent) {
      navigator.clipboard.writeText(this.emailContent).then(() => {
        alert('📋 Conținutul HTML a fost copiat în clipboard!');
      }).catch(() => {
        alert('❌ Nu s-a putut copia conținutul în clipboard.');
      });
    }
  }
}
