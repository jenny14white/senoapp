# 🚀 Przewodnik: StackBlitz → Firebase

## 📦 Krok 1: Import do StackBlitz

### Metoda A: Import z GitHub (Zalecane)

1. **Wypchnij kod na GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Seno App"
   git branch -M main
   git remote add origin https://github.com/twoj-nick/seno-app.git
   git push -u origin main
   ```

2. **Otwórz w StackBlitz**
   - Wejdź na: `https://stackblitz.com/github/twoj-nick/seno-app`
   - LUB: Wejdź na [stackblitz.com](https://stackblitz.com) → "Import from GitHub"

### Metoda B: Import bezpośredni (Szybkie)

1. **Przygotuj projekt**
   ```bash
   # Upewnij się że masz wszystkie zależności
   npm install
   ```

2. **Otwórz StackBlitz**
   - Wejdź na [vite.new/react-ts](https://vite.new/react-ts)
   - Czekaj aż projekt się załaduje

3. **Przenieś pliki**
   - Skopiuj zawartość katalogów:
     - `/src` → do projektu StackBlitz
     - `/public` → do projektu StackBlitz
     - Konfiguracje: `package.json`, `vite.config.ts`, `index.html`, itd.

### Metoda C: Zip Upload

1. **Spakuj projekt**
   ```bash
   # Usuń node_modules jeśli istnieje
   rm -rf node_modules
   
   # Spakuj cały projekt
   zip -r seno-app.zip . -x "*.git*" -x "*node_modules*" -x "*dist*"
   ```

2. **Upload do StackBlitz**
   - StackBlitz > "New Project" > "Upload"
   - Przeciągnij plik `seno-app.zip`

---

## ✅ Weryfikacja w StackBlitz

Po zaimportowaniu sprawdź:

1. **Czy projekt się buduje**
   - StackBlitz automatycznie uruchomi `npm install`
   - Sprawdź Terminal czy nie ma błędów

2. **Czy aplikacja działa**
   - Sprawdź Preview (prawa strona)
   - Przetestuj nawigację
   - Sprawdź localStorage (DevTools → Application → Local Storage)

3. **Jeśli są problemy**
   - Sprawdź czy wszystkie pliki zostały skopiowane
   - Sprawdź czy `package.json` jest kompletny
   - Sprawdź Console (F12) w Preview

---

## 🔥 Krok 2: Wdrożenie na Firebase Hosting

### Przygotowanie

1. **Zainstaluj Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Zaloguj się do Firebase**
   ```bash
   firebase login
   ```

3. **Utwórz projekt Firebase**
   - Wejdź na [console.firebase.google.com](https://console.firebase.google.com)
   - Kliknij "Dodaj projekt" / "Add project"
   - Nazwa: `seno-app` (lub inna)
   - Wyłącz Google Analytics (opcjonalnie)

### Konfiguracja Firebase

1. **Inicjalizacja projektu**
   ```bash
   firebase init hosting
   ```

2. **Odpowiedzi na pytania:**
   ```
   ? Select a default Firebase project: [wybierz swój projekt]
   ? What do you want to use as your public directory? dist
   ? Configure as a single-page app (rewrite all urls to /index.html)? Yes
   ? Set up automatic builds and deploys with GitHub? No
   ? File dist/index.html already exists. Overwrite? No
   ```

**WAŻNE:** Pliki `firebase.json` i `.firebaserc` są już przygotowane, więc możesz pominąć `firebase init` i po prostu:

1. **Edytuj `.firebaserc`**
   ```json
   {
     "projects": {
       "default": "twoj-project-id"
     }
   }
   ```
   Zamień `twoj-project-id` na ID z Firebase Console.

### Budowanie i Deploy

1. **Zbuduj aplikację**
   ```bash
   npm run build
   ```

2. **Przetestuj lokalnie (opcjonalnie)**
   ```bash
   firebase serve
   ```
   Otwórz: `http://localhost:5000`

3. **Wdróż na Firebase**
   ```bash
   firebase deploy
   ```

4. **Gotowe!** 🎉
   Firebase wyświetli URL Twojej aplikacji:
   ```
   ✔  Deploy complete!
   
   Project Console: https://console.firebase.google.com/project/seno-app
   Hosting URL: https://seno-app.web.app
   ```

---

## 🔄 Workflow: StackBlitz → Firebase

### Opcja 1: Ręczny workflow

1. **Pracuj w StackBlitz** - edytuj kod, testuj zmiany
2. **Pobierz kod** - StackBlitz → Menu → Download Project
3. **Rozpakuj i wdróż**
   ```bash
   unzip project.zip -d seno-app
   cd seno-app
   npm install
   npm run build
   firebase deploy
   ```

### Opcja 2: GitHub workflow (Zalecane)

1. **StackBlitz** → Połącz z GitHub
2. **Commit zmiany** w StackBlitz
3. **Lokalnie (na komputerze)**
   ```bash
   git pull
   npm install
   npm run build
   firebase deploy
   ```

### Opcja 3: Firebase Hosting + GitHub Actions (Automatyczne)

1. **Podczas firebase init wybierz:**
   ```
   ? Set up automatic builds and deploys with GitHub? Yes
   ```

2. **Firebase automatycznie:**
   - Utworzy workflow w `.github/workflows/`
   - Przy każdym push na main → automatyczny deploy
   - Preview URLs dla Pull Requests

---

## ⚙️ Szybkie Komendy

```bash
# Deweloperskie (lokalne)
npm run dev

# Budowanie
npm run build

# Podgląd zbudowanej wersji
npm run preview

# Firebase - testowanie lokalne
npm run firebase:serve

# Firebase - deploy (build + deploy)
npm run firebase:deploy
```

---

## 📝 Struktura Projektu (Gotowa!)

```
seno-app/
├── public/               # Pliki statyczne
│   ├── manifest.json    # PWA manifest
│   ├── sw.js            # Service Worker
│   └── .htaccess        # Apache config (backup)
├── src/
│   ├── app/
│   │   ├── components/  # Komponenty React
│   │   ├── contexts/    # Context API
│   │   ├── screens/     # Ekrany/Strony
│   │   ├── App.tsx      # Główny komponent
│   │   └── routes.tsx   # React Router
│   ├── styles/          # Style CSS
│   └── main.tsx         # Entry point
├── index.html           # Główny HTML
├── package.json         # Zależności + skrypty
├── vite.config.ts       # Vite config
├── firebase.json        # ✅ Firebase config
├── .firebaserc          # ✅ Firebase project
└── .stackblitzrc        # ✅ StackBlitz config
```

---

## 🐛 Rozwiązywanie problemów

### StackBlitz nie uruchamia projektu

**Problem:** Błąd instalacji zależności
```
Solution:
1. Sprawdź czy package.json jest kompletny
2. Usuń package-lock.json i pnpm-lock.yaml
3. W StackBlitz: Terminal → npm install
```

**Problem:** Cannot find module 'vite'
```
Solution:
W StackBlitz Terminal:
npm install vite @vitejs/plugin-react -D
```

### Firebase Deploy - błędy

**Problem:** "No project active"
```bash
# Ustaw projekt
firebase use twoj-project-id

# LUB edytuj .firebaserc
```

**Problem:** "dist folder not found"
```bash
# Zbuduj aplikację przed deploy
npm run build
```

**Problem:** 404 przy odświeżeniu strony
```
Solution: Sprawdź firebase.json - już skonfigurowane!
Powinno być:
"rewrites": [{"source": "**", "destination": "/index.html"}]
```

### Aplikacja działa w dev ale nie w production

**Problem:** Białe tło / nie ładuje się
```
Solution:
1. Sprawdź Console (F12) → szukaj błędów
2. Sprawdź ścieżki w index.html (powinny być względne)
3. Sprawdź vite.config.ts - base path
```

---

## 🎨 Customizacja Firebase URL

### Domena własna

1. **Firebase Console** → Hosting → "Add custom domain"
2. Podążaj za instrukcjami (dodaj rekordy DNS)
3. Firebase automatycznie skonfiguruje SSL

### Zmiana domyślnego URL

Domyślnie: `https://seno-app.web.app`

Możesz mieć również: `https://seno-app.firebaseapp.com`

---

## 📊 Monitoring (Firebase Analytics)

Jeśli chcesz tracking użytkowników:

1. **Firebase Console** → Analytics → Enable
2. W projekcie dodaj kod:
   ```typescript
   // src/lib/firebase-analytics.ts
   import { getAnalytics } from "firebase/analytics";
   import { initializeApp } from "firebase/app";

   const firebaseConfig = {
     // Twoja konfiguracja
   };

   const app = initializeApp(firebaseConfig);
   const analytics = getAnalytics(app);
   ```

---

## ✅ Checklist Wdrożenia

### StackBlitz:
- [ ] Projekt zaimportowany
- [ ] `npm install` zakończone pomyślnie
- [ ] Aplikacja działa w Preview
- [ ] Nawigacja działa
- [ ] localStorage działa

### Firebase:
- [ ] Firebase CLI zainstalowane
- [ ] Zalogowany (`firebase login`)
- [ ] Projekt utworzony w Firebase Console
- [ ] `.firebaserc` - zaktualizowany project ID
- [ ] `npm run build` - sukces
- [ ] `firebase deploy` - sukces
- [ ] Aplikacja dostępna pod URL Firebase
- [ ] Routing działa (odświeżenie strony)

---

## 🎉 Gotowe!

Teraz możesz:
- ✅ Edytować kod w StackBlitz
- ✅ Testować zmiany live
- ✅ Wdrażać na Firebase jedną komendą
- ✅ Mieć aplikację dostępną globalnie
- ✅ Zainstalować jako PWA na telefonie

---

## 📞 Przydatne Linki

- **StackBlitz Docs:** https://developer.stackblitz.com/
- **Firebase Hosting Docs:** https://firebase.google.com/docs/hosting
- **Firebase Console:** https://console.firebase.google.com
- **Vite Docs:** https://vitejs.dev/

---

**Powodzenia z wdrożeniem Seno! 🚀**
