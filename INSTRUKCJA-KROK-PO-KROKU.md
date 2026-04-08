# ✅ Instrukcja Krok po Kroku: StackBlitz → Firebase

## 🎯 Cel
Import aplikacji Seno do StackBlitz i wdrożenie na Firebase Hosting

---

## 📦 CZĘŚĆ 1: Import do StackBlitz

### Wybierz metodę:

#### ✨ METODA 1: GitHub (Najlepsza dla długoterminowego użytku)

**Krok 1.1: Wypchnij na GitHub**
```bash
# W folderze z projektem:
git init
git add .
git commit -m "Seno App - Initial commit"
git branch -M main

# Utwórz repo na GitHub, potem:
git remote add origin https://github.com/TWOJ-NICK/seno-app.git
git push -u origin main
```

**Krok 1.2: Otwórz w StackBlitz**
- Wejdź na: `https://stackblitz.com/github/TWOJ-NICK/seno-app`
- LUB: [stackblitz.com](https://stackblitz.com) → "Import from GitHub" → wklej URL repo

**Krok 1.3: Czekaj**
- StackBlitz automatycznie:
  - ✅ Sklonuje repo
  - ✅ Zainstaluje npm packages
  - ✅ Uruchomi dev server

---

#### ⚡ METODA 2: Bezpośrednie kopiowanie (Szybka)

**Krok 2.1: Otwórz template**
- Wejdź na: [vite.new/react-ts](https://vite.new/react-ts)
- Czekaj aż projekt się załaduje

**Krok 2.2: Zastąp pliki**
W StackBlitz edytorze:

1. **Usuń niepotrzebne:**
   - `src/App.tsx` (zastąpimy)
   - `src/App.css` (nie potrzebujemy)

2. **Zastąp `package.json`:**
   - Otwórz swój lokalny `package.json`
   - Zaznacz całą zawartość
   - W StackBlitz otwórz `package.json` i wklej

3. **Zastąp `vite.config.ts`:**
   - Skopiuj zawartość z lokalnego projektu
   - Wklej do StackBlitz

4. **Zastąp `index.html`:**
   - Skopiuj zawartość z lokalnego projektu
   - Wklej do StackBlitz (zastąp istniejący)

5. **Kopiuj foldery:**
   - Usuń folder `src/` w StackBlitz
   - Utwórz nowy folder `src/`
   - Kopiuj wszystkie pliki z lokalnego `src/` do StackBlitz `src/`
   - Utwórz folder `public/`
   - Kopiuj wszystkie pliki z lokalnego `public/` do StackBlitz `public/`

**Krok 2.3: Zainstaluj zależności**
W StackBlitz Terminal (dolny panel):
```bash
npm install
```

---

#### 📁 METODA 3: Upload ZIP (Jeśli StackBlitz wspiera)

**Krok 3.1: Przygotuj ZIP**
```bash
# Usuń node_modules
rm -rf node_modules dist

# Spakuj projekt
zip -r seno-app.zip . -x "*.git*" -x "*node_modules*" -x "*dist*" -x "*.DS_Store"
```

**Krok 3.2: Upload**
- StackBlitz → "New Project" → "Upload" (jeśli dostępne)
- Przeciągnij `seno-app.zip`

---

### ✅ Weryfikacja StackBlitz

Po zaimportowaniu sprawdź:

- [ ] Terminal pokazuje `> vite` (serwer działa)
- [ ] Preview pokazuje aplikację (prawa strona)
- [ ] Możesz przejść do `/login`
- [ ] Możesz się zarejestrować
- [ ] localStorage działa (F12 → Application → Local Storage)
- [ ] Brak błędów w Console (F12 → Console)

**Jeśli coś nie działa:**
1. Sprawdź Terminal - szukaj błędów instalacji
2. Sprawdź Console (F12) - szukaj błędów JS
3. Uruchom ponownie: Terminal → `npm run dev`

---

## 🔥 CZĘŚĆ 2: Wdrożenie na Firebase

### Przygotowanie Firebase

**Krok 1: Zainstaluj Firebase CLI**
```bash
# Na swoim komputerze (nie w StackBlitz):
npm install -g firebase-tools
```

**Krok 2: Zaloguj się**
```bash
firebase login
```
- Otworzy się przeglądarka
- Zaloguj się swoim Google Account
- Zezwól na dostęp

**Krok 3: Utwórz projekt Firebase**
1. Wejdź na: [console.firebase.google.com](https://console.firebase.google.com)
2. Kliknij **"Dodaj projekt"** / **"Add project"**
3. Nazwa projektu: `seno-app` (lub dowolna)
4. ID projektu: zapamiętaj! (np. `seno-app-12345`)
5. Google Analytics: **Wyłącz** (lub włącz jeśli chcesz)
6. Kliknij **"Utwórz projekt"**

---

### Konfiguracja Lokalna

**Krok 4: Pobierz kod ze StackBlitz**

**Opcja A: Jeśli używasz GitHub**
```bash
git clone https://github.com/TWOJ-NICK/seno-app.git
cd seno-app
```

**Opcja B: Download ze StackBlitz**
1. StackBlitz → Menu (≡) → "Download Project"
2. Rozpakuj ZIP
3. Otwórz terminal w tym folderze

**Krok 5: Zainstaluj zależności**
```bash
npm install
```

**Krok 6: Edytuj `.firebaserc`**
Otwórz plik `.firebaserc` i zamień `seno-app` na swoje ID projektu:
```json
{
  "projects": {
    "default": "seno-app-12345"
  }
}
```

**WAŻNE:** Pliki `firebase.json` i `.firebaserc` są już gotowe! Nie musisz uruchamiać `firebase init`.

---

### Deploy na Firebase

**Krok 7: Zbuduj aplikację**
```bash
npm run build
```

Powinno się pojawić:
```
✓ built in XXXms
✓ dist/index.html
✓ dist/assets/...
```

**Krok 8: Wdróż**
```bash
firebase deploy
```

Pierwszy raz może zapytać o autoryzację - potwierdź.

**Krok 9: Gotowe! 🎉**
Firebase wyświetli:
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/seno-app-12345
Hosting URL: https://seno-app-12345.web.app
```

**Krok 10: Otwórz aplikację**
Skopiuj "Hosting URL" i otwórz w przeglądarce!

---

## 🔄 Workflow: Aktualizacje

### Jeśli edytujesz w StackBlitz:

**Metoda 1: GitHub Sync**
```bash
# StackBlitz → Commit zmiany (używając Git w StackBlitz)
# Lokalnie:
git pull
npm run build
firebase deploy
```

**Metoda 2: Download → Upload**
1. StackBlitz → Download Project
2. Rozpakuj
3. Skopiuj zmienione pliki do lokalnego projektu
4. Terminal:
   ```bash
   npm run build
   firebase deploy
   ```

### Jeśli edytujesz lokalnie:

```bash
# Edytuj pliki
npm run dev          # Testuj lokalnie

# Gdy gotowe:
npm run build
firebase deploy

# Opcjonalnie wypchnij na GitHub:
git add .
git commit -m "Aktualizacja"
git push
```

---

## 🚀 Szybkie Komendy

```bash
# Lokalne testowanie
npm run dev                    # Dev server (localhost:3000)

# Budowanie
npm run build                  # Buduje do folderu dist/

# Podgląd produkcyjny
npm run preview                # Preview buildu lokalnie

# Firebase
firebase serve                 # Testuj Firebase lokalnie (port 5000)
npm run firebase:serve         # To samo (npm script)

firebase deploy                # Wdróż na Firebase
npm run firebase:deploy        # Build + deploy (npm script)

firebase deploy --only hosting # Deploy tylko hostingu
```

---

## ✅ Checklist Kompletny

### StackBlitz
- [ ] Projekt zaimportowany do StackBlitz
- [ ] `npm install` zakończony pomyślnie
- [ ] Dev server działa (`> vite` w Terminal)
- [ ] Preview pokazuje aplikację
- [ ] Login/Register działa
- [ ] Nawigacja działa
- [ ] localStorage działa (sprawdź DevTools)
- [ ] Brak błędów w Console

### Firebase
- [ ] Firebase CLI zainstalowany globalnie
- [ ] Zalogowany (`firebase login`)
- [ ] Projekt utworzony w Firebase Console
- [ ] ID projektu zapamiętany
- [ ] `.firebaserc` - zaktualizowany z project ID
- [ ] Kod pobrany ze StackBlitz (lub z GitHub)
- [ ] `npm install` - zakończony
- [ ] `npm run build` - sukces, folder `dist/` istnieje
- [ ] `firebase deploy` - sukces
- [ ] Aplikacja dostępna pod URL Firebase
- [ ] Odświeżenie strony działa (routing)
- [ ] Wszystkie funkcje działają

### Opcjonalnie
- [ ] Domena własna podłączona (Firebase Console → Hosting → Add custom domain)
- [ ] GitHub repo utworzone
- [ ] GitHub Actions dla auto-deploy (opcjonalnie)
- [ ] PWA ikony dodane (public/icon-*.png)
- [ ] Firebase Analytics włączone (opcjonalnie)

---

## 🐛 Najczęstsze Problemy

### StackBlitz

**Problem:** "Cannot find module 'react'"
```bash
# Solution (Terminal w StackBlitz):
npm install react react-dom
```

**Problem:** Dev server nie startuje
```bash
# Solution:
npm install
npm run dev
```

**Problem:** Preview pokazuje biały ekran
```
Solution: 
1. Sprawdź Console (F12) - szukaj błędów
2. Sprawdź Terminal - szukaj błędów budowania
3. Upewnij się że wszystkie pliki zostały skopiowane
```

### Firebase

**Problem:** "Error: No project active"
```bash
# Solution:
firebase use seno-app-12345

# LUB edytuj .firebaserc i ustaw correct project ID
```

**Problem:** "dist folder not found"
```bash
# Solution:
npm run build
# Sprawdź czy folder dist/ istnieje
# Potem:
firebase deploy
```

**Problem:** 404 po odświeżeniu strony
```
Solution: firebase.json już ma rewrites, ale sprawdź:
{
  "hosting": {
    "rewrites": [
      {"source": "**", "destination": "/index.html"}
    ]
  }
}
```

**Problem:** Firebase deploy działa ale aplikacja nie działa
```bash
# Solution:
1. Sprawdź Console (F12) na Firebase URL
2. Szukaj błędów ładowania plików
3. Sprawdź czy base path w vite.config.ts = '/'
4. Wyczyść cache przeglądarki (Ctrl+Shift+R)
```

---

## 📞 Pomoc

### Dokumentacja
- StackBlitz: [developer.stackblitz.com](https://developer.stackblitz.com/)
- Firebase Hosting: [firebase.google.com/docs/hosting](https://firebase.google.com/docs/hosting)
- Vite: [vitejs.dev](https://vitejs.dev/)

### Logi
```bash
# Firebase logs
firebase functions:log

# Zobacz co jest w dist
ls -la dist/

# Test Firebase lokalnie
firebase serve --only hosting
```

---

## 🎉 Sukces!

Jeśli wszystko działa:
- ✅ Aplikacja Seno działa w StackBlitz
- ✅ Możesz edytować kod online
- ✅ Aplikacja jest dostępna globalnie na Firebase
- ✅ URL można udostępnić znajomym
- ✅ Aplikacja działa jako PWA (możesz zainstalować na telefonie)

---

**Gratulacje! Twoja aplikacja Seno jest live! 🚀💰**

Hosting URL: `https://twoj-project-id.web.app`

Możesz teraz:
- Edytować w StackBlitz i pobierać zmiany
- Deploy komendą `firebase deploy`
- Instalować jako aplikację mobilną
- Udostępniać znajomym

---

**Miłego korzystania! 💪**
