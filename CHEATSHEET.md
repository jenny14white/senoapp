# 📋 Ściągawka - Seno App

## 🏃‍♂️ Ultra Szybki Start

### Lokalnie (2 minuty)
```bash
npm install && npm run dev
```
→ http://localhost:3000

### Firebase (5 minut)
```bash
npm install -g firebase-tools
firebase login
# Edytuj .firebaserc (zmień project ID)
npm run firebase:deploy
```

### StackBlitz (1 minuta)
```
https://stackblitz.com/github/USER/REPO
```

---

## 📦 Najczęściej Używane Komendy

| Komenda | Co robi |
|---------|---------|
| `npm run dev` | Start dev server (localhost:3000) |
| `npm run build` | Buduje do folderu dist/ |
| `npm run preview` | Podgląd buildu lokalnie |
| `npm run firebase:deploy` | Build + deploy na Firebase |
| `firebase serve` | Test Firebase lokalnie (port 5000) |

---

## 🔥 Firebase Workflow

```bash
# Raz (setup)
npm install -g firebase-tools
firebase login

# Za każdym razem (deploy)
npm run build
firebase deploy

# Lub jedno polecenie:
npm run firebase:deploy
```

---

## 📂 Struktura Plików (Najważniejsze)

```
seno-app/
├── src/
│   ├── app/
│   │   ├── screens/        # 🖥️ Ekrany (Dashboard, Work, etc.)
│   │   ├── components/     # 🧩 Komponenty
│   │   ├── contexts/       # 🔄 Context API (dane globalne)
│   │   ├── App.tsx         # 🎯 Główny komponent
│   │   └── routes.tsx      # 🛣️ Routing
│   └── main.tsx            # 🚀 Entry point
├── index.html              # 📄 HTML główny
├── firebase.json           # 🔥 Config Firebase
├── .firebaserc             # 🔥 Project ID (EDYTUJ!)
└── vite.config.ts          # ⚙️ Config Vite
```

---

## 🎯 Checklist Deploy

### StackBlitz
- [ ] Wypchnij na GitHub
- [ ] Otwórz stackblitz.com/github/USER/REPO
- [ ] Czekaj na install
- [ ] Testuj w preview

### Firebase
- [ ] Firebase CLI zainstalowany
- [ ] firebase login ✓
- [ ] Projekt utworzony w Firebase Console
- [ ] .firebaserc - zmieniony project ID
- [ ] npm run build ✓
- [ ] firebase deploy ✓

---

## 🐛 SOS - Szybkie Rozwiązania

| Problem | Rozwiązanie |
|---------|-------------|
| Białe tło | F12 → Console → sprawdź błędy |
| 404 przy refresh | firebase.json ma rewrites? ✓ |
| dist/ not found | `npm run build` najpierw |
| No project active | Edytuj `.firebaserc` |
| Module not found | `npm install` |
| Port zajęty | Zmień w vite.config.ts |

---

## 🔧 Quick Fixes

```bash
# Wszystko od nowa
rm -rf node_modules dist
npm install
npm run dev

# Firebase: zmień projekt
firebase use PROJECT_ID

# Cache clear
npm cache clean --force

# Kill port 3000
kill -9 $(lsof -t -i:3000)  # Mac/Linux
```

---

## 📱 PWA Install

**iOS:**
Safari → 📤 Udostępnij → ➕ Dodaj do ekranu

**Android:**
Chrome → ⋮ Menu → ➕ Dodaj do ekranu

---

## 🌐 URL Patterns

| Platform | URL Pattern |
|----------|-------------|
| StackBlitz | `stackblitz.com/github/USER/REPO` |
| Firebase | `PROJECT-ID.web.app` |
| Netlify | `PROJECT.netlify.app` |
| Vercel | `PROJECT.vercel.app` |

---

## 🎨 Edytowanie

### Zmień kolory
→ `/src/styles/theme.css`

### Dodaj ekran
1. Utwórz `/src/app/screens/NowyEkran.tsx`
2. Dodaj route w `/src/app/routes.tsx`
3. Dodaj w nawigacji jeśli potrzebne

### Dodaj komponent
→ `/src/app/components/NowyKomponent.tsx`

---

## 📊 Pliki Config

| Plik | Do czego |
|------|----------|
| `firebase.json` | Config Firebase Hosting |
| `.firebaserc` | ID projektu Firebase ⚠️ EDYTUJ |
| `netlify.toml` | Config Netlify |
| `vercel.json` | Config Vercel |
| `vite.config.ts` | Build settings |
| `package.json` | Zależności + scripts |

---

## 🔐 Zmienne Środowiskowe

```bash
# Utwórz .env
echo "VITE_API_KEY=xxx" > .env

# W kodzie:
import.meta.env.VITE_API_KEY
```

**WAŻNE:** Nazwa musi zaczynać się od `VITE_`

---

## 📚 Dokumentacja (Gdzie szukać?)

| Pytanie | Plik |
|---------|------|
| Jak zacząć? | `START-HERE.md` |
| StackBlitz → Firebase? | `INSTRUKCJA-KROK-PO-KROKU.md` |
| Szczegóły Firebase? | `STACKBLITZ-FIREBASE-GUIDE.md` |
| Inne hostingi? | `DEPLOYMENT.md` |
| Wszystkie komendy? | `COMMANDS.md` |
| Ta ściągawka | `CHEATSHEET.md` (tutaj!) |

---

## ⚡ Pro Tips

1. **Zawsze testuj lokalnie przed deploy**
   ```bash
   npm run dev
   ```

2. **Użyj firebase serve przed deploy**
   ```bash
   npm run build && firebase serve
   ```

3. **Git commit często**
   ```bash
   git add . && git commit -m "Update" && git push
   ```

4. **Sprawdź rozmiar buildu**
   ```bash
   npm run build
   # Vite pokaże rozmiary
   ```

5. **Czysty install czasem pomaga**
   ```bash
   rm -rf node_modules && npm install
   ```

---

## 🎯 Workflow Codzienny

### Praca lokalna:
```bash
npm run dev         # Start
# ... edytuj pliki ...
git add .
git commit -m "Opis zmian"
git push
```

### Deploy produkcyjny:
```bash
npm run build
firebase deploy
# LUB:
npm run firebase:deploy
```

---

## 📞 Przydatne Linki

| Co | Link |
|----|------|
| Firebase Console | console.firebase.google.com |
| StackBlitz | stackblitz.com |
| Netlify | netlify.com |
| Vite Docs | vitejs.dev |
| React Router | reactrouter.com |
| Tailwind CSS | tailwindcss.com |

---

## 🎉 Success Checklist

Po deploy sprawdź:
- [ ] Aplikacja się otwiera
- [ ] Login działa
- [ ] Routing działa (kliknij linki)
- [ ] Refresh strony działa (F5)
- [ ] localStorage działa (zarejestruj użytkownika)
- [ ] Responsywność (zmień rozmiar okna)
- [ ] PWA działa (spróbuj zainstalować)

---

## 💡 Skróty Klawiszowe (Dev)

| Skrót | Co robi |
|-------|---------|
| `Ctrl + C` | Stop dev server |
| `Ctrl + Shift + R` | Hard refresh (bez cache) |
| `F12` | DevTools |
| `Ctrl + Shift + I` | DevTools (alternative) |
| `Ctrl + Shift + C` | Inspect element |

---

**Zachowaj ten plik! To Twoja ściągawka! 💪**

Wydrukuj i przypnij obok komputera! 📌
