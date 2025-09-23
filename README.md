# Product Site - Angular Application

Un site modern pentru afișarea și gestionarea produselor, construit cu Angular 18.

## Caracteristici

- 🎨 **Design modern și responsive** - Interfață frumoasă care funcționează pe toate dispozitivele
- 🔍 **Căutare și filtrare** - Caută produse după nume, brand, categorie
- 📱 **Mobile-first** - Optimizat pentru dispozitive mobile
- ⚡ **Performanță înaltă** - Lazy loading și optimizări Angular
- 🛒 **Gata pentru e-commerce** - Structură pregătită pentru funcționalități de shopping

## Structura aplicației

```
src/
├── app/
│   ├── models/           # Modele TypeScript pentru produse
│   ├── services/         # Servicii pentru gestionarea datelor
│   ├── pages/            # Pagini principale
│   │   ├── product-list/     # Lista de produse
│   │   └── product-detail/   # Detalii produs
│   ├── app.component.ts  # Componenta principală
│   └── app.routes.ts     # Configurarea rutelor
├── styles.scss          # Stiluri globale
└── index.html           # Template HTML principal
```

## Cum să rulezi aplicația

1. **Instalează dependențele:**
   ```bash
   npm install
   ```

2. **Rulează serverul de dezvoltare:**
   ```bash
   npm start
   ```

3. **Deschide browserul la:**
   ```
   http://localhost:4200
   ```

## Cum să încarci datele din tabelul tău

Pentru a încărca produsele din tabelul tău, modifică metoda `initializeSampleData()` din `src/app/services/product.service.ts`:

```typescript
private initializeSampleData(): void {
  // Înlocuiește cu datele din tabelul tău
  const yourProducts: Product[] = [
    {
      id: 1,
      name: 'Numele produsului',
      description: 'Descrierea produsului',
      price: 100,
      image: 'url-catre-imagine',
      category: 'Categoria',
      brand: 'Brandul',
      stock: 10,
      isAvailable: true,
      // ... alte proprietăți
    }
    // ... mai multe produse
  ];
  
  this.productsSubject.next(yourProducts);
}
```

## Structura produsului

Fiecare produs poate avea următoarele proprietăți:

- `id` - ID unic
- `name` - Numele produsului
- `description` - Descrierea
- `price` - Prețul curent
- `originalPrice` - Prețul original (pentru reduceri)
- `image` - Imaginea principală
- `images` - Array cu imagini suplimentare
- `category` - Categoria
- `subcategory` - Subcategoria
- `brand` - Brandul
- `sku` - Codul produsului
- `stock` - Cantitatea în stoc
- `isAvailable` - Disponibilitatea
- `rating` - Rating-ul (1-5)
- `reviewCount` - Numărul de recenzii
- `features` - Array cu caracteristici
- `specifications` - Specificații tehnice
- `tags` - Tag-uri pentru căutare

## Funcționalități disponibile

- ✅ Listarea produselor cu filtrare
- ✅ Căutare în timp real
- ✅ Sortare după preț, nume, rating
- ✅ Pagina de detalii produs
- ✅ Afișarea produselor similare
- ✅ Design responsive
- ✅ Navigare cu breadcrumbs

## Tehnologii folosite

- **Angular 18** - Framework principal
- **TypeScript** - Limbaj de programare
- **SCSS** - Preprocesor CSS
- **RxJS** - Programare reactivă
- **Angular Router** - Navigare între pagini

## Dezvoltare viitoare

Pentru a transforma acest site într-un e-commerce complet, poți adăuga:

- 🛒 Coș de cumpărături
- 👤 Autentificare utilizatori
- 💳 Procesare plăți
- 📧 Notificări email
- 📊 Dashboard admin
- 🔄 Sincronizare cu API extern

## Suport

Dacă ai întrebări sau ai nevoie de ajutor pentru a integra datele din tabelul tău, nu ezita să întrebi!
