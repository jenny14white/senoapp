# 🎯 Pierwsze Uruchomienie - Tutorial

## 👋 Witaj w Seno!

To jest przewodnik dla **kompletnych początkujących**. Przeprowadzi Cię krok po kroku przez pierwsze uruchomienie aplikacji.

---

## ✅ Przed rozpoczęciem

Upewnij się że masz zainstalowane:

### 1. Node.js (wymagane)

**Sprawdź czy masz:**
```bash
node --version
```

Jeśli widzisz: `v18.x.x` lub wyżej → ✅ OK!

**Jeśli nie masz:**
1. Wejdź na: https://nodejs.org
2. Pobierz wersję LTS (Long Term Support)
3. Zainstaluj
4. Uruchom terminal ponownie
5. Sprawdź ponownie: `node --version`

### 2. Terminal/Command Line

**Windows:** 
- Command Prompt (cmd)
- PowerShell
- Git Bash (polecam!)

**Mac:** 
- Terminal (aplikacja)
- iTerm2

**Linux:** 
- Terminal (Ctrl+Alt+T)

---

## 🚀 Krok 1: Otwórz projekt w terminalu

### Windows:
1. Otwórz folder z projektem w Eksploratorze
2. Kliknij prawym w pustym miejscu
3. "Otwórz w terminalu" lub "Git Bash here"

### Mac/Linux:
1. Otwórz Terminal
2. Użyj `cd` aby przejść do folderu:
   ```bash
   cd ~/ścieżka/do/seno-app
   ```

**Sprawdź czy jesteś we właściwym folderze:**
```bash
ls
# Powinieneś zobaczyć: package.json, src, public, index.html, etc.
```

---

## 📦 Krok 2: Zainstaluj zależności

To musi być zrobione **tylko raz** (lub po każdym git pull jeśli coś się zmieniło).

```bash
npm install
```

**Co się dzieje:**
- npm pobiera wszystkie biblioteki (React, Vite, etc.)
- Tworzy folder `node_modules/`
- Może zająć 1-3 minuty
- Zobaczysz progres bar

**Jeśli są błędy:**
- Sprawdź czy masz Node.js 18+
- Spróbuj ponownie
- Spróbuj: `npm cache clean --force` i `npm install` ponownie

---

## 🎨 Krok 3: Uruchom aplikację lokalnie

```bash
npm run dev
```

**Co się dzieje:**
- Vite uruchamia dev server
- Aplikacja kompiluje się (pierwsze uruchomienie może zająć ~10 sekund)
- Server startuje na http://localhost:3000

**Zobaczysz coś takiego:**
```
VITE v6.3.5  ready in 423 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

---

## 🌐 Krok 4: Otwórz aplikację

### Automatycznie:
Jeśli masz `open: true` w `vite.config.ts`, przeglądarka otworzy się automatycznie.

### Ręcznie:
1. Otwórz przeglądarkę (Chrome, Firefox, Safari, Edge)
2. Wpisz: `http://localhost:3000`
3. Enter

**Powinieneś zobaczyć:**
- Ekran logowania Seno
- Piękne gradienty
- Formularz logowania/rejestracji

---

## 🎉 Krok 5: Przetestuj aplikację

### Zarejestruj się:
1. Kliknij "Zarejestruj się" / "Register"
2. Podaj:
   - Email: `test@test.pl`
   - Imię: `Jan`
   - Hasło: `haslo123`
3. Kliknij "Zarejestruj"

### Zaloguj się:
- Email: `test@test.pl`
- Hasło: `haslo123`
- Kliknij "Zaloguj"

### Eksploruj:
- ✅ Dashboard - przegląd finansów
- ✅ Wydatki - dodaj wydatek
- ✅ Praca - kalendarz pracy
- ✅ Cele - cele finansowe
- ✅ Profil - ustawienia

---

## 🔄 Krok 6: Testowanie zmian (Hot Reload)

Dev server ma **Hot Module Replacement** (HMR):

1. Otwórz plik w edytorze (np. VS Code)
2. Edytuj coś, np. w `/src/app/screens/Dashboard.tsx`
3. Zapisz plik (Ctrl+S / Cmd+S)
4. **Aplikacja automatycznie się zaktualizuje!** (bez odświeżania!)

**To oznacza:**
- Edytujesz → Widzisz zmiany od razu
- Nie musisz restartować servera
- Nie musisz odświeżać przeglądarki

---

## 🛑 Krok 7: Zatrzymywanie servera

Gdy skończysz pracę:

1. Wróć do terminala
2. Naciśnij: **Ctrl + C** (Windows/Linux) lub **Cmd + C** (Mac)
3. Potwierdź jeśli pyta (Y)

Server się zatrzyma, aplikacja przestanie działać.

**Następnym razem:**
```bash
npm run dev
```
i jesteś z powrotem! 🚀

---

## 📱 Krok 8: Testowanie na telefonie (opcjonalnie)

Jeśli chcesz zobaczyć jak wygląda na telefonie:

1. **Sprawdź IP komputera:**
   ```bash
   # Windows
   ipconfig
   # Mac/Linux
   ifconfig
   ```
   Szukaj IP typu: `192.168.x.x`

2. **Uruchom z --host:**
   ```bash
   npm run dev -- --host
   ```

3. **Na telefonie:**
   - Podłącz do tej samej sieci Wi-Fi
   - Otwórz przeglądarkę
   - Wpisz: `http://192.168.x.x:3000`

---

## 🏗️ Krok 9: Budowanie wersji produkcyjnej (opcjonalnie)

Gdy wszystko działa i chcesz stworzyć wersję do wdrożenia:

```bash
npm run build
```

**Co się dzieje:**
- Vite kompiluje aplikację
- Optymalizuje kod (minifikacja, tree-shaking)
- Tworzy folder `dist/`
- Pliki gotowe do wgrania na serwer

**Zobacz wyniki:**
```bash
npm run preview
```
- Otwiera: http://localhost:4173
- To podgląd produkcyjnej wersji

---

## 📂 Struktura Folderu (co to jest?)

```
seno-app/
├── node_modules/     # 📦 Biblioteki (NIE EDYTUJ!)
├── public/           # 📁 Pliki statyczne (ikony, manifest)
├── src/              # 💻 KOD APLIKACJI (EDYTUJ TUTAJ!)
│   ├── app/
│   │   ├── screens/     # Ekrany (Dashboard, Work, etc.)
│   │   ├── components/  # Komponenty (przyciski, modale, etc.)
│   │   ├── contexts/    # Globalne dane (AuthContext, etc.)
│   │   ├── App.tsx      # Główny komponent
│   │   └── routes.tsx   # Routing
│   ├── styles/       # Style CSS
│   └── main.tsx      # Punkt wejścia
├── index.html        # HTML główny
├── package.json      # Zależności i skrypty
├── vite.config.ts    # Konfiguracja Vite
└── README.md         # Dokumentacja
```

---

## 🔧 Narzędzia przydatne do pracy

### Edytor kodu (wybierz jeden):
- **VS Code** (polecam!) - https://code.visualstudio.com
- WebStorm
- Sublime Text

### Rozszerzenia VS Code (opcjonalne):
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- Auto Rename Tag

### DevTools w przeglądarce:
- **F12** lub **Ctrl+Shift+I** (Cmd+Opt+I na Mac)
- Console - błędy JavaScript
- Elements - HTML/CSS
- Application → Local Storage - dane aplikacji

---

## 🐛 Najczęstsze Problemy (Początkujący)

### "npm: command not found"
**Przyczyna:** Node.js nie zainstalowany  
**Rozwiązanie:** Zainstaluj Node.js (krok 1)

### "Cannot find module 'vite'"
**Przyczyna:** Nie zainstalowałeś zależności  
**Rozwiązanie:** `npm install`

### Port 3000 już zajęty
**Przyczyna:** Inna aplikacja używa portu  
**Rozwiązanie:** 
- Zamknij inną aplikację
- LUB zmień port w `vite.config.ts`:
  ```typescript
  server: { port: 3001 }
  ```

### Aplikacja nie ładuje się / białe tło
**Przyczyna:** Błąd w kodzie  
**Rozwiązanie:** 
1. Otwórz Console (F12)
2. Szukaj błędów (czerwony tekst)
3. Sprawdź terminal - szukaj błędów kompilacji

### Zmiany nie widoczne
**Przyczyna:** Cache przeglądarki  
**Rozwiązanie:** Hard refresh - **Ctrl+Shift+R** (Cmd+Shift+R na Mac)

---

## ✅ Checklist Pierwszego Uruchomienia

- [ ] Node.js zainstalowany (v18+)
- [ ] Terminal otwarty w folderze projektu
- [ ] `npm install` wykonany pomyślnie
- [ ] `npm run dev` działa
- [ ] Aplikacja otwarta w przeglądarce (localhost:3000)
- [ ] Możesz się zarejestrować
- [ ] Możesz się zalogować
- [ ] Możesz nawigować między ekranami
- [ ] Hot reload działa (edytujesz → widzisz zmiany)
- [ ] Wiesz jak zatrzymać server (Ctrl+C)

---

## 🎓 Następne Kroki

Gdy już działa lokalnie:

1. **Eksploruj kod:**
   - Otwórz pliki w edytorze
   - Zobacz jak działa React
   - Poeksperymentuj z kodem

2. **Wdróż na hosting:**
   - [INSTRUKCJA-KROK-PO-KROKU.md](./INSTRUKCJA-KROK-PO-KROKU.md) - Firebase
   - [DEPLOYMENT.md](./DEPLOYMENT.md) - Inne opcje

3. **Naucz się więcej:**
   - React: https://react.dev
   - Vite: https://vitejs.dev
   - Tailwind CSS: https://tailwindcss.com

---

## 💡 Wskazówki dla Początkujących

### 1. Nie bój się błędów
- Każdy programista je robi
- Czytaj komunikaty błędów - one mówią co jest nie tak
- Google błąd jeśli nie rozumiesz

### 2. Używaj DevTools
- F12 w przeglądarce to Twój przyjaciel
- Console pokazuje błędy
- Elements pozwala podglądać HTML/CSS

### 3. Eksperymentuj
- Zmień kolor w CSS
- Zmień tekst na przycisku
- Dodaj console.log() żeby zobaczyć co się dzieje
- Cofnij jeśli coś popsułeś (Ctrl+Z)

### 4. Zapisuj często
- Ctrl+S / Cmd+S
- Git commit gdy coś działa
- Kopia zapasowa projektu

### 5. Czytaj dokumentację
- Nie musisz wszystkiego pamiętać
- Dokumentacja to normalne
- Używaj search (Ctrl+F)

---

## 🆘 Potrzebujesz pomocy?

### Problemy z uruchomieniem?
→ Przeczytaj sekcję "Najczęstsze Problemy" powyżej

### Problemy z kodem?
→ Sprawdź Console (F12) - pierwsza linia błędu

### Problemy z deploymentem?
→ [INSTRUKCJA-KROK-PO-KROKU.md](./INSTRUKCJA-KROK-PO-KROKU.md)

### Ogólne pytania?
→ [START-HERE.md](./START-HERE.md) - indeks wszystkich przewodników

---

## 🎉 Gratulacje!

Jeśli dotarłeś tutaj i aplikacja działa - **jesteś gotowy!** 🚀

Teraz możesz:
- ✅ Edytować kod
- ✅ Testować lokalnie
- ✅ Budować produkcyjną wersję
- ✅ Wdrażać na hosting

**Miłego kodowania! 💪**

---

_Ten przewodnik jest dla początkujących. Jeśli coś jest niejasne - to jest normalne! Czytaj powoli, krok po kroku._ 😊
