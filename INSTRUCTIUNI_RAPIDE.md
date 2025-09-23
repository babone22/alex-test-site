# 🚀 Instrucțiuni Rapide - Site Produse Angular

## Pornirea Aplicației

```bash
cd /Users/alex/product-site
npm start
```

Aplicația va fi disponibilă la: **http://localhost:4200**

## 📊 Verificarea Importului Excel

1. **Pagina de Debug**: http://localhost:4200/debug
   - Vezi câte produse au fost încărcate
   - Verifică primele 5 produse
   - Lista categoriilor

2. **Lista Produselor**: http://localhost:4200/products
   - Toate produsele din Excel
   - Căutare și filtrare
   - Sortare după preț/nume/rating

3. **Detalii Produs**: http://localhost:4200/product/[ID]
   - Informații complete despre produs
   - Galerie imagini
   - Specificații tehnice

## 📁 Fișierul Excel

**Locație**: `src/assets/stock.xlsx`

**Coloane acceptate**:
- `nume` / `denumire` / `titlu` - Numele produsului
- `pret` / `preț` / `price` - Prețul
- `categorie` / `category` - Categoria
- `brand` / `marca` - Brandul
- `stoc` / `stock` - Cantitatea în stoc
- `descriere` / `description` - Descrierea
- `imagine` / `image` - URL imagine

## 🔧 Probleme Comune

### Nu se încarcă produsele
- Verifică că `stock.xlsx` este în `src/assets/`
- Prima linie trebuie să conțină header-urile
- Trebuie să existe coloana cu numele produsului

### Eroare de compilare
```bash
npm run build
```

### Reset aplicație
```bash
npm install
npm start
```

## 📱 Funcționalități

- ✅ **Design responsive** - funcționează pe toate dispozitivele
- ✅ **Căutare în timp real** - caută după nume, brand, categorie
- ✅ **Filtrare** - după preț, brand, disponibilitate
- ✅ **Sortare** - după preț, nume, rating
- ✅ **Galerie imagini** - pentru produse cu mai multe imagini
- ✅ **Specificații tehnice** - afișate în format structurat
- ✅ **Produse similare** - pe pagina de detalii

## 🎨 Personalizare

- **Stiluri**: Editează `src/styles.scss`
- **Componente**: Modifică fișierele din `src/app/pages/`
- **Servicii**: Adaptează `src/app/services/product.service.ts`

---

**Aplicația este gata de utilizare! 🎉**
