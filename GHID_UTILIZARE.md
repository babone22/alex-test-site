# Ghid de Utilizare - Import Date Excel

## 🎯 Obiectiv
Acest ghid te ajută să încarci produsele din fișierul Excel `stock.xlsx` în aplicația Angular.

## 📁 Structura Fișierului Excel

Aplicația poate citi fișiere Excel cu următoarele coloane (numele coloanelor pot varia):

### Coloane Principale:
- **Nume produs**: `nume`, `denumire`, `titlu`, `name`, `product_name`
- **Preț**: `pret`, `preț`, `price`, `preț_ron`, `pret_ron`
- **Preț original**: `pret_original`, `preț_original`, `original_price`, `pret_vechi`
- **Categorie**: `categorie`, `category`, `tip`
- **Brand**: `brand`, `marca`, `producator`, `manufacturer`
- **Stoc**: `stoc`, `stock`, `cantitate`, `quantity`

### Coloane Opționale:
- **Descriere**: `descriere`, `description`, `desc`
- **Imagine**: `imagine`, `image`, `poza`, `foto`
- **Imagini multiple**: `imagini`, `images`, `galerie`
- **Subcategorie**: `subcategorie`, `subcategory`, `sub_tip`
- **SKU**: `sku`, `cod`, `cod_produs`, `id_produs`
- **Disponibilitate**: `disponibil`, `available`, `in_stock`
- **Rating**: `rating`, `scor`, `evaluare`
- **Recenzii**: `recenzii`, `reviews`, `review_count`
- **Caracteristici**: `caracteristici`, `features`, `specs`
- **Specificații**: `specificatii`, `specifications`, `tech_specs`
- **Taguri**: `taguri`, `tags`, `keywords`

## 🚀 Cum să Rulezi Aplicația

1. **Asigură-te că fișierul Excel este în locația corectă:**
   ```
   /Users/alex/product-site/src/assets/stock.xlsx
   ```

2. **Rulează aplicația:**
   ```bash
   cd /Users/alex/product-site
   npm start
   ```

3. **Deschide browserul la:**
   ```
   http://localhost:4200
   ```

## 🔍 Verificarea Importului

### Pagina de Debug
Accesează `http://localhost:4200/debug` pentru a vedea:
- Câte produse au fost încărcate
- Câte categorii au fost create
- Primele 5 produse cu detaliile lor
- Lista categoriilor

### Consola Browserului
Deschide Developer Tools (F12) și verifică consola pentru:
- Mesaje de succes: "Datele au fost încărcate din Excel"
- Erori de import
- Detalii despre produsele procesate

## 📊 Formatul Datelor

### Exemplu de Structură Excel:
```
| Nume Produs | Preț | Categorie | Brand | Stoc | Descriere |
|-------------|------|-----------|-------|------|------------|
| Laptop ASUS | 4500 | Electronice| ASUS  | 10   | Laptop gaming|
| iPhone 15   | 4200 | Telefoane | Apple | 5    | Smartphone |
```

### Specificații JSON:
Pentru coloana "Specificații", poți folosi format JSON:
```json
{"Procesor": "Intel i7", "Memorie": "16GB", "Stocare": "1TB SSD"}
```

### Imagini Multiple:
Pentru mai multe imagini, separă URL-urile cu virgulă:
```
https://image1.jpg, https://image2.jpg, https://image3.jpg
```

### Caracteristici:
Pentru caracteristici, separă cu virgulă:
```
Intel i7, RTX 4060, 16GB RAM, SSD 1TB
```

## ⚠️ Probleme Comune și Soluții

### 1. Nu se încarcă produsele
**Cauze posibile:**
- Fișierul Excel nu este în `src/assets/`
- Prima linie nu conține header-uri
- Nu există coloana cu numele produsului

**Soluții:**
- Verifică locația fișierului
- Asigură-te că prima linie conține numele coloanelor
- Folosește una din coloanele acceptate pentru nume

### 2. Prețurile nu se afișează corect
**Cauze posibile:**
- Prețurile conțin caractere speciale
- Formatul nu este numeric

**Soluții:**
- Folosește doar numere și puncte pentru zecimale
- Evită simbolurile de monedă în coloana preț

### 3. Imaginile nu se afișează
**Cauze posibile:**
- URL-urile nu sunt valide
- Imaginile nu sunt accesibile

**Soluții:**
- Folosește URL-uri complete (cu http/https)
- Testează URL-urile în browser
- Aplicația va folosi imagini default dacă URL-ul nu este valid

## 🎨 Personalizare

### Modificarea Stilurilor
Editează `src/styles.scss` pentru a schimba aspectul general.

### Modificarea Componentelor
- `src/app/pages/product-list/` - Lista de produse
- `src/app/pages/product-detail/` - Detalii produs
- `src/app/services/product.service.ts` - Logica de date

### Adăugarea de Funcționalități
- Coș de cumpărături
- Filtrare avansată
- Căutare cu autocomplete
- Paginare

## 📞 Suport

Dacă întâmpini probleme:
1. Verifică pagina de debug (`/debug`)
2. Deschide consola browserului pentru erori
3. Verifică că fișierul Excel are structura corectă
4. Asigură-te că aplicația rulează pe `http://localhost:4200`

## 🔄 Actualizarea Datelor

Pentru a actualiza produsele:
1. Modifică fișierul `stock.xlsx`
2. Salvează fișierul
3. Reîncarcă pagina în browser
4. Datele se vor actualiza automat

---

**Succes cu importul datelor! 🎉**
