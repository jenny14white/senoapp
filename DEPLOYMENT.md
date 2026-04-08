# 🚀 Instrukcja Wdrożenia Aplikacji Seno

## 📋 Wymagania

- Node.js (wersja 18 lub nowsza)
- npm lub pnpm

## 🛠️ Budowanie Aplikacji

### Krok 1: Instalacja zależności

```bash
npm install
# lub
pnpm install
```

### Krok 2: Zbudowanie aplikacji produkcyjnej

```bash
npm run build
# lub
pnpm build
```

Po zakończeniu budowania, wszystkie pliki gotowe do wdrożenia znajdą się w folderze `dist/`.

## 🌐 Opcje Wdrożenia

### Opcja 1: Hosting Statyczny (Netlify)

1. Zaloguj się do [Netlify](https://www.netlify.com)
2. Kliknij "Add new site" → "Deploy manually"
3. Przeciągnij folder `dist/` na stronę Netlify
4. Gotowe! Twoja aplikacja jest live

**Automatyczne wdrożenie z GitHub:**
1. Połącz repozytorium z Netlify
2. Ustaw build command: `npm run build`
3. Ustaw publish directory: `dist`
4. Deploy!

### Opcja 2: Vercel

1. Zaloguj się do [Vercel](https://vercel.com)
2. Importuj projekt z GitHub lub przeciągnij folder
3. Vercel automatycznie wykryje konfigurację Vite
4. Kliknij "Deploy"

### Opcja 3: GitHub Pages

1. W `vite.config.ts` dodaj:
```typescript
export default defineConfig({
  base: '/nazwa-repo/',
  // ... reszta konfiguracji
})
```

2. Zbuduj aplikację: `npm run build`

3. Zainstaluj `gh-pages`:
```bash
npm install --save-dev gh-pages
```

4. Dodaj do `package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

5. Wdróż:
```bash
npm run deploy
```

### Opcja 4: Własny Serwer (Apache/Nginx)

1. Zbuduj aplikację: `npm run build`

2. Skopiuj zawartość folderu `dist/` na serwer

3. **Konfiguracja Apache** (`.htaccess`):
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

4. **Konfiguracja Nginx**:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### Opcja 5: Firebase Hosting

1. Zainstaluj Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Zaloguj się:
```bash
firebase login
```

3. Zainicjuj projekt:
```bash
firebase init hosting
```
- Wybierz `dist` jako public directory
- Wybierz "Yes" dla SPA
- Nie nadpisuj index.html

4. Wdróż:
```bash
npm run build
firebase deploy
```

### Opcja 6: Cloudflare Pages

1. Zaloguj się do [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Przejdź do "Pages" → "Create a project"
3. Połącz repozytorium GitHub
4. Ustaw:
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Kliknij "Save and Deploy"

## 📱 Konfiguracja PWA (Progressive Web App)

Aplikacja jest już skonfigurowana jako PWA. Aby w pełni z tego korzystać:

1. **Wygeneruj ikony** (zalecane rozmiary):
   - 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512 px
   
2. Umieść ikony w folderze `public/` jako:
   - `icon-72x72.png`
   - `icon-96x96.png`
   - `icon-128x128.png`
   - itd.

3. Dodaj również:
   - `apple-touch-icon.png` (180x180)
   - `favicon-32x32.png`
   - `favicon-16x16.png`

## 🔧 Zmienne Środowiskowe

Jeśli w przyszłości dodasz Firebase lub inne API:

1. Stwórz plik `.env`:
```env
VITE_API_KEY=your_api_key
VITE_AUTH_DOMAIN=your_auth_domain
```

2. Użyj w kodzie:
```typescript
const apiKey = import.meta.env.VITE_API_KEY;
```

## ⚡ Optymalizacja

Aplikacja jest już zoptymalizowana, ale możesz dodatkowo:

1. **Kompresja GZIP** - większość hostingów robi to automatycznie
2. **CDN** - Cloudflare, Fastly
3. **Lazy loading** - już zaimplementowane dla obrazów
4. **Code splitting** - React Router już to robi automatycznie

## 🐛 Rozwiązywanie Problemów

### Biały ekran po wdrożeniu
- Sprawdź `base` w `vite.config.ts`
- Upewnij się, że ścieżki są względne
- Sprawdź console w przeglądarce

### 404 przy odświeżeniu strony
- Skonfiguruj przekierowania na serwerze (patrz sekcja "Własny Serwer")
- Dla SPA wszystkie ścieżki powinny zwracać `index.html`

### Problemy z routing
- Upewnij się, że używasz `BrowserRouter`
- Sprawdź konfigurację przekierowań serwera

## 📞 Wsparcie

Jeśli masz problemy z wdrożeniem:
1. Sprawdź logi budowania
2. Sprawdź console przeglądarki (F12)
3. Upewnij się, że wszystkie zależności są zainstalowane

## ✅ Checklist przed wdrożeniem

- [ ] Zbudowana aplikacja (`npm run build`)
- [ ] Przetestowana lokalnie (`npm run preview`)
- [ ] Dodane ikony PWA
- [ ] Skonfigurowane przekierowania serwera
- [ ] Ustawione zmienne środowiskowe (jeśli używane)
- [ ] Sprawdzone wszystkie ścieżki

---

**Gotowe!** Twoja aplikacja Seno jest teraz dostępna online! 🎉
