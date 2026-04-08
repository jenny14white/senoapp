# 🚀 Szybki Start - Wdrożenie Seno

## ⚡ Najszybsza metoda (Netlify/Vercel)

### Netlify Drop (bez kodu):
1. Zbuduj aplikację:
   ```bash
   npm install
   npm run build
   ```
2. Wejdź na [app.netlify.com/drop](https://app.netlify.com/drop)
3. Przeciągnij folder `dist/` na stronę
4. **Gotowe!** ✅

### Vercel:
1. Wejdź na [vercel.com](https://vercel.com)
2. Kliknij "New Project"
3. Importuj repozytorium GitHub lub przeciągnij folder
4. **Gotowe!** ✅

## 📦 Pliki gotowe do wdrożenia

Po uruchomieniu `npm run build` otrzymasz:

```
dist/
├── index.html          # Główny plik HTML
├── assets/             # Skompilowane JS, CSS, obrazy
├── manifest.json       # PWA manifest
├── sw.js              # Service Worker
└── .htaccess          # Konfiguracja dla Apache
```

## 🌐 Hosting

### Statyczny hosting (zalecany):
- **Netlify** - [netlify.com](https://netlify.com) ⭐ Najprostszy
- **Vercel** - [vercel.com](https://vercel.com) ⭐ Super szybki
- **Cloudflare Pages** - [pages.cloudflare.com](https://pages.cloudflare.com)
- **GitHub Pages** - Darmowy
- **Firebase Hosting** - Dla projektów Firebase

### Własny serwer:
- Skopiuj zawartość `dist/` na serwer
- Użyj `.htaccess` (Apache) lub `nginx.conf.example` (Nginx)
- **Ważne**: Skonfiguruj przekierowania dla SPA!

## 🔧 Komendy

```bash
# Instalacja
npm install

# Deweloperskie (lokalne)
npm run dev

# Budowanie produkcyjne
npm run build

# Podgląd zbudowanej wersji
npm run preview
```

## 📱 PWA - Instalacja jako aplikacja

Po wdrożeniu użytkownicy mogą "zainstalować" Seno na telefonie:
- iOS: Safari → Udostępnij → Dodaj do ekranu głównego
- Android: Chrome → Menu → Dodaj do ekranu głównego

## ⚙️ Konfiguracja dla SPA

**Dlaczego to ważne?**
React Router wymaga, żeby serwer zwracał `index.html` dla wszystkich ścieżek.

### Apache (.htaccess) - już gotowy w `public/`
### Nginx - użyj `nginx.conf.example`
### Netlify - dodaj `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Vercel - dodaj `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## 🎨 Ikony PWA (opcjonalnie)

Wygeneruj ikony i umieść w `public/`:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png
- apple-touch-icon.png (180x180)
- favicon-32x32.png
- favicon-16x16.png

**Narzędzia do generowania ikon:**
- [realfavicongenerator.net](https://realfavicongenerator.net)
- [favicon.io](https://favicon.io)

## 🐛 Rozwiązywanie problemów

### Biały ekran?
- Sprawdź console (F12)
- Sprawdź czy wszystkie pliki się załadowały
- Dla subdirectory ustaw `base` w `vite.config.ts`

### 404 przy odświeżeniu?
- Skonfiguruj przekierowania serwera (patrz sekcja wyżej)

### Wolno się ładuje?
- Użyj CDN (Cloudflare)
- Włącz kompresję GZIP
- Włącz cache w przeglądarce

## 📞 Potrzebujesz więcej?

Szczegółowe instrukcje znajdziesz w pliku `DEPLOYMENT.md`

---

**Miłego wdrażania! 🎉**
