# 🔧 Wszystkie Komendy - Seno App

## 📦 Podstawowe

### Instalacja
```bash
npm install
```

### Development (Lokalne)
```bash
npm run dev
# Otwiera: http://localhost:3000
```

### Budowanie
```bash
npm run build
# Tworzy: dist/ folder
```

### Podgląd Buildu
```bash
npm run preview
# Otwiera: http://localhost:4173
```

---

## 🔥 Firebase

### Instalacja Firebase CLI (raz)
```bash
npm install -g firebase-tools
```

### Logowanie
```bash
firebase login
```

### Wylogowanie
```bash
firebase logout
```

### Lista projektów
```bash
firebase projects:list
```

### Wybór projektu
```bash
firebase use seno-app
# lub ID twojego projektu
```

### Deploy (pełny)
```bash
npm run firebase:deploy
# LUB:
npm run build && firebase deploy
```

### Deploy tylko hosting
```bash
firebase deploy --only hosting
```

### Lokalne testowanie Firebase
```bash
npm run firebase:serve
# LUB:
firebase serve
# Otwiera: http://localhost:5000
```

### Podgląd zmian (przed deploy)
```bash
firebase hosting:channel:deploy preview
```

### Logi Firebase
```bash
firebase functions:log
```

---

## 📁 Git (GitHub)

### Inicjalizacja
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USER/REPO.git
git push -u origin main
```

### Codzienne użycie
```bash
# Status
git status

# Dodaj zmiany
git add .

# Commit
git commit -m "Opis zmian"

# Push
git push

# Pull (pobierz zmiany)
git pull
```

---

## 🌐 StackBlitz

### Otwórz projekt z GitHub
```
https://stackblitz.com/github/USER/REPO
```

### Otwórz gałąź
```
https://stackblitz.com/github/USER/REPO/tree/BRANCH
```

### Nowy projekt Vite + React
```
https://vite.new/react-ts
```

---

## 🧹 Czyszczenie

### Usuń node_modules
```bash
rm -rf node_modules
```

### Usuń dist
```bash
rm -rf dist
```

### Usuń cache
```bash
rm -rf .cache
rm -rf .parcel-cache
```

### Pełne czyszczenie + reinstall
```bash
rm -rf node_modules dist .cache
npm install
```

---

## 📊 Analiza

### Rozmiar bundles
```bash
npm run build
# Vite automatycznie pokazuje rozmiary
```

### Szczegółowa analiza (wymaga pluginu)
```bash
npm install --save-dev rollup-plugin-visualizer
# Dodaj do vite.config.ts
```

---

## 🔍 Debugging

### Check wersji Node
```bash
node --version
# Powinno być: v18.x lub wyżej
```

### Check wersji npm
```bash
npm --version
```

### Lista zainstalowanych packages
```bash
npm list --depth=0
```

### Sprawdź outdated packages
```bash
npm outdated
```

### Aktualizuj packages (ostrożnie!)
```bash
npm update
```

---

## 🚀 Deploy - Różne platformy

### Netlify
```bash
# Instalacja CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### Vercel
```bash
# Instalacja CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### GitHub Pages
```bash
# Instalacja gh-pages
npm install --save-dev gh-pages

# Dodaj do package.json scripts:
# "deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

---

## 🔧 Narzędzia

### Sprawdź porty w użyciu
```bash
# macOS/Linux
lsof -i :3000
lsof -i :5000

# Windows
netstat -ano | findstr :3000
```

### Kill proces na porcie
```bash
# macOS/Linux
kill -9 $(lsof -t -i:3000)

# Windows
taskkill /PID <PID> /F
```

### Otwórz w domyślnej przeglądarce
```bash
# macOS
open http://localhost:3000

# Linux
xdg-open http://localhost:3000

# Windows
start http://localhost:3000
```

---

## 📦 Package Management

### Install pojedynczy package
```bash
npm install package-name
```

### Install dev dependency
```bash
npm install --save-dev package-name
```

### Uninstall package
```bash
npm uninstall package-name
```

### Update package
```bash
npm update package-name
```

### Check package version
```bash
npm view package-name version
```

---

## 🎨 Customizacja

### Zmień port dev server
```bash
# W vite.config.ts zmień:
server: { port: 3001 }
```

### Zmień port preview
```bash
# W vite.config.ts zmień:
preview: { port: 4174 }
```

---

## 🐛 Troubleshooting

### Reset wszystkiego
```bash
rm -rf node_modules package-lock.json dist
npm install
npm run dev
```

### Cache clear (npm)
```bash
npm cache clean --force
```

### Reinstall z czystym cache
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Fix permissions (Linux/macOS)
```bash
sudo chown -R $USER:$USER .
```

---

## 📱 PWA

### Test PWA lokalnie (wymaga HTTPS)
```bash
# Użyj ngrok lub podobnego
npx serve dist -s
```

### Generuj ikony PWA
```bash
# Użyj online tools:
# https://realfavicongenerator.net
# https://favicon.io
```

---

## 🔐 Env Variables

### Utwórz .env
```bash
echo "VITE_API_KEY=your_key" > .env
```

### Load z .env
```typescript
// W kodzie:
const apiKey = import.meta.env.VITE_API_KEY;
```

---

## ⚡ Skróty i Aliasy

Dodaj do `~/.bashrc` lub `~/.zshrc`:

```bash
# Seno App shortcuts
alias seno-dev="cd ~/path/to/seno && npm run dev"
alias seno-build="cd ~/path/to/seno && npm run build"
alias seno-deploy="cd ~/path/to/seno && npm run firebase:deploy"
alias seno-open="cd ~/path/to/seno && code ."
```

Potem:
```bash
source ~/.bashrc  # lub ~/.zshrc
seno-dev  # Szybkie uruchomienie!
```

---

## 📊 Stats

### Liczba linii kodu
```bash
find src -name "*.tsx" -o -name "*.ts" | xargs wc -l
```

### Liczba plików
```bash
find src -type f | wc -l
```

### Rozmiar projektu
```bash
du -sh .
du -sh node_modules
du -sh dist
```

---

## 🎉 Quick Reference

### Najczęściej używane:
```bash
npm run dev              # Start dev
npm run build            # Build
npm run firebase:deploy  # Deploy
git add . && git commit -m "Update" && git push  # Git push
```

---

**Zapisz ten plik! Będzie Ci potrzebny! 📌**
