# 💰 Seno - Aplikacja Finansowa

Nowoczesna mobilna aplikacja fintech do zarządzania finansami osobistymi i współdzielonymi z partnerem.

---

## 🚀 ZACZNIJ TUTAJ

**→ [START-HERE.md](./START-HERE.md) ← KLIKNIJ!**

Nie wiesz od czego zacząć? Ten plik poprowadzi Cię krok po kroku!

---

## ✨ Funkcjonalności

- 📊 **Dashboard** - Przegląd finansów w czasie rzeczywistym
- 💸 **Wydatki** - Śledzenie i kategoryzacja wydatków
- 💼 **Praca** - Kalendarz pracy z automatycznym liczeniem zarobków
- 🎯 **Cele** - Zarządzanie celami finansowymi
- 👥 **Rodzina** - Połączenie z partnerem przez unikalne kody
- 📝 **Notatki** - Notatki finansowe
- 📈 **Prognozy** - Przewidywania finansowe
- 🧾 **Rachunki** - Zarządzanie rachunkami

## 🎨 Design

- Glass morphism
- Gradienty
- Tryb jasny/ciemny
- 4 motywy kolorystyczne
- Responsywny design

## 🚀 Szybki Start

### Lokalnie

```bash
# Instalacja
npm install

# Uruchomienie (dev)
npm run dev

# Budowanie
npm run build

# Podgląd produkcji
npm run preview
```

### StackBlitz

1. Otwórz w StackBlitz: `https://stackblitz.com/github/twoj-nick/seno-app`
2. Czekaj na instalację zależności
3. Aplikacja uruchomi się automatycznie!

### Firebase Hosting

```bash
# 1. Zainstaluj Firebase CLI
npm install -g firebase-tools

# 2. Zaloguj się
firebase login

# 3. Edytuj .firebaserc (ustaw swój project ID)

# 4. Wdróż
npm run firebase:deploy
```

## 📦 Technologie

- **React 18.3** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router 7** - Routing
- **Tailwind CSS v4** - Styling
- **Radix UI** - Komponenty UI
- **Recharts** - Wykresy
- **Lucide React** - Ikony
- **localStorage** - Przechowywanie danych

## 📁 Struktura

```
seno-app/
├── src/
│   ├── app/
│   │   ├── components/     # Komponenty React
│   │   ├── contexts/       # Context API
│   │   ├── screens/        # Ekrany aplikacji
│   │   ├── App.tsx         # Główny komponent
│   │   └── routes.tsx      # Konfiguracja routingu
│   ├── styles/             # Style CSS
│   └── main.tsx            # Entry point
├── public/                 # Pliki statyczne
├── index.html              # Główny HTML
└── vite.config.ts          # Konfiguracja Vite
```

## 🔧 Skrypty NPM

```bash
npm run dev              # Start dev server
npm run build            # Build produkcyjny
npm run preview          # Podgląd buildu
npm run firebase:deploy  # Build + deploy na Firebase
npm run firebase:serve   # Testowanie Firebase lokalnie
```

## 📚 Dokumentacja

- **[STACKBLITZ-FIREBASE-GUIDE.md](./STACKBLITZ-FIREBASE-GUIDE.md)** - Pełny przewodnik StackBlitz → Firebase
- **[QUICK-START.md](./QUICK-START.md)** - Szybki start
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Szczegóły wdrożenia

## 🌐 Wdrożenie

Aplikacja jest gotowa do wdrożenia na:

- ✅ **StackBlitz** - Edycja online
- ✅ **Firebase Hosting** - Hosting produkcyjny
- ✅ **Netlify** - Automatyczny deploy
- ✅ **Vercel** - Instant deploy
- ✅ **Cloudflare Pages** - Edge hosting
- ✅ **GitHub Pages** - Darmowy hosting
- ✅ **Własny serwer** - Apache/Nginx

## 📱 PWA (Progressive Web App)

Aplikacja może być zainstalowana jako aplikacja mobilna:

- iOS: Safari → Udostępnij → Dodaj do ekranu głównego
- Android: Chrome → Menu → Dodaj do ekranu głównego

## 💾 Dane

- Wszystkie dane przechowywane w **localStorage**
- Brak backendu - prywatność gwarantowana
- Gotowe do przyszłej integracji z Firebase
- System połączenia partnerów przez unikalne kody

## 🔐 Bezpieczeństwo

- Pełny system autoryzacji
- Dane tylko w przeglądarce użytkownika
- HTTPS wymagane dla PWA
- Security headers skonfigurowane

## 🎯 Roadmap

- [ ] Integracja z Firebase (opcjonalna)
- [ ] Synchronizacja między urządzeniami
- [ ] Export danych (CSV/PDF)
- [ ] Zaawansowana analityka
- [ ] Powiadomienia push
- [ ] Tryb offline

## 📄 Licencja

Private - Projekt prywatny

## 🙏 Podziękowania

Zbudowane z wykorzystaniem:
- React
- Vite
- Tailwind CSS
- Radix UI
- i wielu innych wspaniałych bibliotek!

---

**Miłego zarządzania finansami! 💰**