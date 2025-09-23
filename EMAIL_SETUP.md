# 📧 Configurare EmailJS pentru trimiterea email-urilor

## 🎯 Ce face sistemul de email:

### **Email-uri trimise automat:**
1. **Email de confirmare către client** - cu toate detaliile comenzii
2. **Email de notificare către administrator** - pentru comenzi noi

### **De unde vin email-urile:**
- **De la:** `noreply@productsite.com` (configurabil)
- **Către client:** Email-ul completat în formularul de checkout
- **Către admin:** `il.alexandru@yahoo.com` (configurat)

## 🚀 Cum să configurezi EmailJS:

### **Pasul 1: Creează cont EmailJS**
1. Mergi la [https://www.emailjs.com/](https://www.emailjs.com/)
2. Creează un cont gratuit
3. Verifică email-ul

### **Pasul 2: Configurează serviciul de email**
1. În dashboard-ul EmailJS, mergi la **"Email Services"**
2. Adaugă un serviciu nou (Gmail, Outlook, etc.)
3. Notează **Service ID**-ul

### **Pasul 3: Creează template-urile**
1. Mergi la **"Email Templates"**
2. Creează template pentru **client**:
   - Nume: `order_confirmation`
   - Subiect: `Confirmare Comandă - {{order_number}}`
   - Conținut: Folosește variabilele disponibile
3. Creează template pentru **admin**:
   - Nume: `admin_notification`
   - Subiect: `Comandă Nouă - {{order_number}}`
   - Conținut: Informații esențiale despre comandă

### **Pasul 4: Obține credențialele**
1. Mergi la **"Account"** → **"General"**
2. Notează **Public Key**-ul

### **Pasul 5: Configurează aplicația**
Editează fișierul `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  
  emailjs: {
    serviceId: 'service_xxxxxxx', // Service ID-ul tău
    templateId: 'template_xxxxxxx', // Template ID pentru client
    publicKey: 'xxxxxxxxxxxxxxxx', // Public Key-ul tău
    adminTemplateId: 'template_yyyyyyy' // Template ID pentru admin
  },
  
  emails: {
    admin: 'il.alexandru@yahoo.com', // Email-ul tău de admin
    from: 'noreply@productsite.com' // Email-ul de la care se trimit
  }
};
```

## 📋 Variabilele disponibile în template-uri:

### **Pentru email client:**
- `{{order_number}}` - Numărul comenzii
- `{{customer_name}}` - Numele companiei
- `{{order_total}}` - Totalul comenzii
- `{{order_date}}` - Data comenzii
- `{{delivery_address}}` - Adresa de livrare
- `{{phone_number}}` - Numărul de telefon
- `{{html_content}}` - Conținutul HTML complet

### **Pentru email admin:**
- `{{order_number}}` - Numărul comenzii
- `{{customer_name}}` - Numele companiei
- `{{customer_email}}` - Email-ul clientului
- `{{customer_phone}}` - Telefonul clientului
- `{{order_total}}` - Totalul comenzii
- `{{order_date}}` - Data comenzii
- `{{items_count}}` - Numărul de produse
- `{{html_content}}` - Conținutul HTML complet

## 🔧 Testarea configurației:

### **Modul simulare (implicit):**
- Email-urile sunt generate dar nu se trimit
- Vezi conținutul în consolă
- Perfect pentru dezvoltare

### **Modul real:**
- Email-urile se trimit efectiv prin EmailJS
- Activează prin configurarea credențialelor

## 📊 Limitele EmailJS gratuit:

- **200 email-uri/lună** în planul gratuit
- **Suport pentru Gmail, Outlook, Yahoo**
- **Template-uri personalizabile**
- **API simplu de integrare**

## 🚨 Securitate:

- **Public Key** este safe să fie în frontend
- **Service ID** și **Template ID** sunt publice
- **Nu pune** credențialele de email în cod
- **Folosește** environment variables pentru producție

## 🎯 Exemplu de template EmailJS:

### **Template pentru client:**
```
Subiect: Confirmare Comandă - {{order_number}}

Salut {{customer_name}},

Comanda ta cu numărul {{order_number}} a fost confirmată!

Total: {{order_total}}
Data: {{order_date}}

Adresa de livrare:
{{delivery_address}}

Pentru întrebări, contactează-ne la telefon: {{phone_number}}

Mulțumim pentru alegerea făcută!
Echipa ProductSite
```

### **Template pentru admin:**
```
Subiect: Comandă Nouă - {{order_number}}

Comandă nouă necesită atenția ta!

Client: {{customer_name}}
Email: {{customer_email}}
Telefon: {{customer_phone}}
Total: {{order_total}}
Produse: {{items_count}}

Verifică comanda în sistemul de administrare.
```

## ✅ Verificare finală:

1. **Configurează** credențialele în `environment.ts`
2. **Testează** o comandă în aplicație
3. **Verifică** consola pentru mesaje de confirmare
4. **Verifică** inbox-ul pentru email-uri primite

---

**💡 Tip:** Începe cu modul simulare pentru a testa conținutul, apoi activează trimiterea reală când ești mulțumit de rezultat!
