import { Injectable } from '@angular/core';
import { Order, CartItem } from '../models/product.model';
import emailjs from '@emailjs/browser';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  // Configurare EmailJS din environment
  private readonly EMAILJS_SERVICE_ID = environment.emailjs.serviceId;
  private readonly EMAILJS_TEMPLATE_ID = environment.emailjs.templateId;
  private readonly EMAILJS_PUBLIC_KEY = environment.emailjs.publicKey;
  private readonly EMAILJS_ADMIN_TEMPLATE_ID = environment.emailjs.adminTemplateId;
  
  // Email-uri pentru trimitere din environment
  private readonly ADMIN_EMAIL = environment.emails.admin;
  private readonly FROM_EMAIL = environment.emails.from;

  constructor() {
    // Inițializează EmailJS doar dacă este configurat
    if (this.isEmailJSConfigured()) {
      emailjs.init(this.EMAILJS_PUBLIC_KEY);
      console.log('✅ EmailJS inițializat cu configurația din environment');
    } else {
      console.log('⚠️ EmailJS nu este configurat - se va folosi modul simulare');
    }
  }

  /**
   * Generează conținutul email-ului de confirmare comandă
   */
  generateOrderConfirmationEmail(order: Order): string {
    const orderDate = new Date(order.createdAt).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmare Comandă - ${order.orderNumber}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .email-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #3b82f6, #1e40af);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
        }
        .content {
            padding: 30px;
        }
        .order-info {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #3b82f6;
        }
        .order-number {
            font-size: 24px;
            font-weight: 700;
            color: #3b82f6;
            margin-bottom: 10px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            padding: 5px 0;
            border-bottom: 1px solid #e5e7eb;
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
        .items-section {
            margin: 30px 0;
        }
        .items-section h3 {
            color: #1f2937;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .item-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid #f3f4f6;
        }
        .item-row:last-child {
            border-bottom: none;
        }
        .item-details h4 {
            margin: 0 0 5px 0;
            color: #1f2937;
            font-size: 16px;
        }
        .item-specs {
            color: #6b7280;
            font-size: 14px;
        }
        .item-price {
            font-weight: 600;
            color: #1f2937;
            font-size: 16px;
        }
        .summary {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .summary-row {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
        }
        .summary-row.total {
            font-size: 18px;
            font-weight: 700;
            color: #1f2937;
            border-top: 2px solid #e5e7eb;
            padding-top: 10px;
            margin-top: 15px;
        }
        .customer-info {
            background: #f0f9ff;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #0ea5e9;
        }
        .customer-info h3 {
            color: #0c4a6e;
            margin-top: 0;
        }
        .next-steps {
            background: #f0fdf4;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #22c55e;
        }
        .next-steps h3 {
            color: #166534;
            margin-top: 0;
        }
        .step {
            margin: 10px 0;
            padding-left: 20px;
            position: relative;
        }
        .step::before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #22c55e;
            font-weight: bold;
        }
        .footer {
            background: #1f2937;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .footer p {
            margin: 5px 0;
        }
        .contact-info {
            margin-top: 15px;
            font-size: 14px;
            opacity: 0.8;
        }
        @media (max-width: 600px) {
            .info-row, .summary-row {
                flex-direction: column;
                gap: 5px;
            }
            .item-row {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>✅ Comanda Confirmată!</h1>
            <p>Vă mulțumim pentru încrederea acordată!</p>
        </div>
        
        <div class="content">
            <div class="order-info">
                <div class="order-number">${order.orderNumber}</div>
                <div class="info-row">
                    <span class="label">Data comenzii:</span>
                    <span class="value">${orderDate}</span>
                </div>
                <div class="info-row">
                    <span class="label">Status:</span>
                    <span class="value">În procesare</span>
                </div>
                <div class="info-row">
                    <span class="label">Total comandă:</span>
                    <span class="value">${this.formatCurrency(order.total)}</span>
                </div>
            </div>

            <div class="items-section">
                <h3>📦 Produse comandate</h3>
                ${this.generateItemsHTML(order.items)}
            </div>

            <div class="summary">
                <h3>💰 Rezumat comandă</h3>
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>${this.formatCurrency(order.subtotal)}</span>
                </div>
                <div class="summary-row">
                    <span>Transport:</span>
                    <span>Gratuit</span>
                </div>
                <div class="summary-row total">
                    <span>Total:</span>
                    <span>${this.formatCurrency(order.total)}</span>
                </div>
            </div>

            <div class="customer-info">
                <h3>🏢 Informații client</h3>
                <div class="info-row">
                    <span class="label">Companie:</span>
                    <span class="value">${order.customerInfo.companyName}</span>
                </div>
                <div class="info-row">
                    <span class="label">CUI/CIF:</span>
                    <span class="value">${order.customerInfo.vat}</span>
                </div>
                <div class="info-row">
                    <span class="label">Email:</span>
                    <span class="value">${order.customerInfo.emailAddress}</span>
                </div>
                <div class="info-row">
                    <span class="label">Telefon:</span>
                    <span class="value">${order.customerInfo.phoneNumber}</span>
                </div>
            </div>

            <div class="customer-info">
                <h3>🚚 Adresa de livrare</h3>
                <div style="white-space: pre-line; color: #1f2937; line-height: 1.6;">
${order.customerInfo.deliveryAddress}
                </div>
            </div>

            ${order.notes ? `
            <div class="customer-info">
                <h3>📝 Observații</h3>
                <div style="white-space: pre-line; color: #1f2937; line-height: 1.6;">
${order.notes}
                </div>
            </div>
            ` : ''}

            <div class="next-steps">
                <h3>🔄 Următorii pași</h3>
                <div class="step">Echipa noastră va procesa comanda în 1-2 zile lucrătoare</div>
                <div class="step">Veți fi contactați pentru confirmarea detaliilor de livrare</div>
                <div class="step">Comanda va fi livrată la adresa specificată</div>
                <div class="step">Veți primi un email de confirmare când comanda este expediată</div>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <p style="color: #6b7280; font-size: 14px;">
                    Pentru întrebări sau modificări la comandă, vă rugăm să ne contactați folosind numărul de comandă: <strong>${order.orderNumber}</strong>
                </p>
            </div>
        </div>

        <div class="footer">
            <p><strong>ProductSite</strong></p>
            <p>Vă mulțumim pentru alegerea făcută!</p>
            <div class="contact-info">
                <p>Pentru suport: support@productsite.com</p>
                <p>Telefon: +40 123 456 789</p>
            </div>
        </div>
    </div>
</body>
</html>
    `.trim();
  }

  /**
   * Generează HTML-ul pentru lista de produse
   */
  private generateItemsHTML(items: CartItem[]): string {
    return items.map(item => `
      <div class="item-row">
        <div class="item-details">
          <h4>${item.product.name}</h4>
          <div class="item-specs">
            Mărimea: ${item.size} | Cantitate: ${item.quantity}
          </div>
        </div>
        <div class="item-price">
          ${this.formatCurrency(item.price * item.quantity)}
        </div>
      </div>
    `).join('');
  }

  /**
   * Formatează suma ca monedă
   */
  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  /**
   * Trimite email de confirmare către client
   * Suportă atât simularea cât și trimiterea reală prin EmailJS
   */
  async sendOrderConfirmationEmail(order: Order, useRealEmail: boolean = false): Promise<boolean> {
    try {
      const emailContent = this.generateOrderConfirmationEmail(order);
      
      console.log('📧 ===== EMAIL DE CONFIRMARE COMANDĂ =====');
      console.log(`📬 Către: ${order.customerInfo.emailAddress}`);
      console.log(`📋 Subiect: Confirmare Comandă - ${order.orderNumber}`);
      
      if (useRealEmail && this.isEmailJSConfigured()) {
        // Trimitere reală prin EmailJS
        const templateParams = {
          to_email: order.customerInfo.emailAddress,
          from_name: 'ProductSite',
          from_email: this.FROM_EMAIL,
          subject: `Confirmare Comandă - ${order.orderNumber}`,
          order_number: order.orderNumber,
          customer_name: order.customerInfo.companyName,
          order_total: this.formatCurrency(order.total),
          html_content: emailContent,
          order_date: new Date(order.createdAt).toLocaleDateString('ro-RO'),
          delivery_address: order.customerInfo.deliveryAddress,
          phone_number: order.customerInfo.phoneNumber
        };

        const result = await emailjs.send(
          this.EMAILJS_SERVICE_ID,
          this.EMAILJS_TEMPLATE_ID,
          templateParams
        );
        
        console.log('✅ Email trimis cu succes prin EmailJS!', result);
        console.log('📧 ===========================================');
        return true;
      } else {
        // Simulare trimitere email
        console.log('📄 Conținut HTML generat și pregătit pentru trimitere');
        console.log('⚠️ Modul simulare activat - email-ul nu se trimite efectiv');
        
        // Simulare delay pentru trimitere
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('✅ Email simulat cu succes!');
        console.log('📧 ===========================================');
        return true;
      }
    } catch (error) {
      console.error('❌ Eroare la trimiterea email-ului:', error);
      return false;
    }
  }

  /**
   * Generează email pentru administrator cu noua comandă
   */
  generateAdminNotificationEmail(order: Order): string {
    return `
<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comandă Nouă - ${order.orderNumber}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .email-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .content {
            padding: 30px;
        }
        .alert-box {
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #ef4444;
        }
        .order-summary {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            padding: 5px 0;
            border-bottom: 1px solid #e5e7eb;
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
        .total-amount {
            font-size: 20px;
            font-weight: 700;
            color: #059669;
        }
        .action-button {
            display: inline-block;
            background: #3b82f6;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>🔔 Comandă Nouă!</h1>
            <p>O comandă nouă necesită atenția dumneavoastră</p>
        </div>
        
        <div class="content">
            <div class="alert-box">
                <h3>⚠️ Acțiune necesară</h3>
                <p>O comandă nouă a fost plasată și necesită procesare. Vă rugăm să verificați detaliile și să confirmați comanda.</p>
            </div>

            <div class="order-summary">
                <h3>📋 Rezumat comandă</h3>
                <div class="info-row">
                    <span class="label">Număr comandă:</span>
                    <span class="value">${order.orderNumber}</span>
                </div>
                <div class="info-row">
                    <span class="label">Client:</span>
                    <span class="value">${order.customerInfo.companyName}</span>
                </div>
                <div class="info-row">
                    <span class="label">Email:</span>
                    <span class="value">${order.customerInfo.emailAddress}</span>
                </div>
                <div class="info-row">
                    <span class="label">Telefon:</span>
                    <span class="value">${order.customerInfo.phoneNumber}</span>
                </div>
                <div class="info-row">
                    <span class="label">Total:</span>
                    <span class="value total-amount">${this.formatCurrency(order.total)}</span>
                </div>
                <div class="info-row">
                    <span class="label">Produse:</span>
                    <span class="value">${order.items.length} produse</span>
                </div>
            </div>

            <div style="text-align: center;">
                <a href="#" class="action-button">Vezi comanda completă</a>
            </div>

            <p style="color: #6b7280; font-size: 14px; text-align: center;">
                Acest email a fost generat automat de sistemul de comenzi.
            </p>
        </div>
    </div>
</body>
</html>
    `.trim();
  }

  /**
   * Trimite email de notificare către administrator
   * Suportă atât simularea cât și trimiterea reală prin EmailJS
   */
  async sendAdminNotificationEmail(order: Order, useRealEmail: boolean = false): Promise<boolean> {
    try {
      const emailContent = this.generateAdminNotificationEmail(order);
      
      console.log('🔔 ===== EMAIL NOTIFICARE ADMIN =====');
      console.log(`📬 Către: ${this.ADMIN_EMAIL}`);
      console.log(`📋 Subiect: Comandă Nouă - ${order.orderNumber}`);
      
      if (useRealEmail && this.isEmailJSConfigured()) {
        // Trimitere reală prin EmailJS
        const templateParams = {
          to_email: this.ADMIN_EMAIL,
          from_name: 'ProductSite System',
          from_email: this.FROM_EMAIL,
          subject: `Comandă Nouă - ${order.orderNumber}`,
          order_number: order.orderNumber,
          customer_name: order.customerInfo.companyName,
          customer_email: order.customerInfo.emailAddress,
          customer_phone: order.customerInfo.phoneNumber,
          order_total: this.formatCurrency(order.total),
          html_content: emailContent,
          order_date: new Date(order.createdAt).toLocaleDateString('ro-RO'),
          items_count: order.items.length
        };

        const result = await emailjs.send(
          this.EMAILJS_SERVICE_ID,
          this.EMAILJS_ADMIN_TEMPLATE_ID,
          templateParams
        );
        
        console.log('✅ Email administrator trimis cu succes prin EmailJS!', result);
        console.log('🔔 ======================================');
        return true;
      } else {
        // Simulare trimitere email
        console.log('📄 Conținut HTML generat pentru administrator');
        console.log('⚠️ Modul simulare activat - email-ul nu se trimite efectiv');
        
        // Simulare delay pentru trimitere
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('✅ Email administrator simulat cu succes!');
        console.log('🔔 ======================================');
        return true;
      }
    } catch (error) {
      console.error('❌ Eroare la trimiterea email-ului administrator:', error);
      return false;
    }
  }

  /**
   * Verifică dacă EmailJS este configurat corect
   */
  private isEmailJSConfigured(): boolean {
    return this.EMAILJS_SERVICE_ID !== 'your_service_id' && 
           this.EMAILJS_TEMPLATE_ID !== 'your_template_id' && 
           this.EMAILJS_PUBLIC_KEY !== 'your_public_key' &&
           this.EMAILJS_SERVICE_ID !== 'your_prod_service_id' &&
           this.EMAILJS_TEMPLATE_ID !== 'your_prod_template_id' &&
           this.EMAILJS_PUBLIC_KEY !== 'your_prod_public_key';
  }

  /**
   * Configurează EmailJS cu credențialele tale
   */
  configureEmailJS(serviceId: string, templateId: string, publicKey: string): void {
    // În producție, aceste valori ar trebui să vină din environment variables
    (this as any).EMAILJS_SERVICE_ID = serviceId;
    (this as any).EMAILJS_TEMPLATE_ID = templateId;
    (this as any).EMAILJS_PUBLIC_KEY = publicKey;
    
    emailjs.init(publicKey);
    console.log('✅ EmailJS configurat cu succes!');
  }
}
