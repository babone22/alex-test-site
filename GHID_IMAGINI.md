# 📸 Ghid pentru Imagini în Excel

## Problema cu Imaginile Atașate

Excel-ul tău conține imagini atașate direct în celule, dar biblioteca `xlsx` nu poate extrage aceste imagini. Aceasta este o limitare tehnică.

## Soluții Disponibile

### 1. **Soluția Actuală - Placeholder**
Aplicația detectează automat când imaginile sunt atașate în Excel și afișează un placeholder frumos cu textul "Imagine din Excel".

### 2. **Soluția Recomandată - URL-uri Externe**

Pentru a afișa imaginile reale, ai următoarele opțiuni:

#### Opțiunea A: URL-uri Online
- Încarcă imaginile pe un serviciu online (Google Drive, Dropbox, etc.)
- Înlocuiește imaginile atașate cu URL-urile complete
- Exemplu: `https://drive.google.com/file/d/123456789/view`

#### Opțiunea B: Imagini Locale
1. Extrage imaginile din Excel manual
2. Salvează-le în folderul `src/assets/images/`
3. Înlocuiește imaginile atașate cu numele fișierelor
4. Exemplu: `produs1.jpg`

#### Opțiunea C: Serviciu de Imagini
- Folosește un serviciu ca Cloudinary, AWS S3, etc.
- Obține URL-uri directe pentru imagini

## Cum să Modifici Excel-ul

### Pasul 1: Extrage Imaginile
1. Deschide Excel-ul
2. Click dreapta pe imaginea atașată
3. Selectează "Salvează ca imagine..."
4. Salvează cu un nume descriptiv (ex: `produs_8850011.jpg`)

### Pasul 2: Încarcă Imaginile
- **Pentru URL-uri online**: Încarcă pe Google Drive/Dropbox și obține link-ul de partajare
- **Pentru imagini locale**: Copiază în `src/assets/images/`

### Pasul 3: Actualizează Excel-ul
1. Înlocuiește imaginea atașată cu URL-ul sau numele fișierului
2. Salvează Excel-ul
3. Reîncarcă pagina în aplicație

## Exemplu de Structură Excel

| Foto | Codice prodotto | Descrizione | ... |
|------|----------------|-------------|-----|
| https://drive.google.com/file/d/123/view | 8850011 | SI.VERNICE NERO | ... |
| produs_8850011.jpg | 8850012 | ALT PRODUS | ... |

## Verificarea Rezultatului

1. Accesează pagina de test: `http://localhost:4200/test`
2. Click pe "Testează Import Excel"
3. Verifică că imaginile se afișează corect
4. Dacă vezi placeholder-uri, înseamnă că imaginile sunt încă atașate

## Suport Tehnic

Dacă ai probleme:
1. Verifică consola browserului pentru erori
2. Asigură-te că URL-urile sunt accesibile
3. Testează URL-urile direct în browser

---

**Nota**: Placeholder-urile sunt o soluție temporară elegantă care indică că produsul are o imagine atașată în Excel, dar aceasta nu poate fi extrasă automat.
