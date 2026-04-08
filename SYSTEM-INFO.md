# System Informacyjny - SENO Finance App

## 📚 Tutoriale dla Nowych Użytkowników

### ✅ System Tutoriali DZIAŁA!

Aplikacja posiada pełny system interaktywnych tutoriali dla nowych użytkowników:

**Lokalizacja:** `/src/app/contexts/TutorialContext.tsx`

**Dostępne Tutoriale:**
1. **Dashboard** - Wprowadzenie do głównego ekranu (bilans, wykres wydatków, szybkie akcje)
2. **Expenses** - Jak dodawać i zarządzać wydatkami
3. **Work** - Jak korzystać z kalendarza pracy i obliczać zarobki
4. **Goals** - Jak tworzyć i śledzić cele finansowe

**Jak to działa:**
- Tutoriale uruchamiają się automatycznie przy pierwszej wizycie na danym ekranie
- Stan completion zapisywany w localStorage per user: `tutorials-${user.id}`
- Użytkownik może pominąć tutorial przyciskiem "Pomiń"
- Po zakończeniu tutorial nie pokazuje się ponownie
- Overlay z tooltipami prowadzi użytkownika krok po kroku

**Przykład użycia w komponencie:**
```tsx
const { startTutorial, isTutorialCompleted } = useTutorial();

useEffect(() => {
  if (!isTutorialCompleted('dashboard')) {
    const timer = setTimeout(() => {
      startTutorial('dashboard');
    }, 500);
    return () => clearTimeout(timer);
  }
}, []);
```

---

## 🔗 System Parowania Użytkowników (Partner Connection)

### Obecna Implementacja (localStorage)

**1. Generowanie Kodu Użytkownika:**
- Każdy użytkownik dostaje unikalny 8-znakowy kod przy rejestracji
- Format: `ABC12345` (3 litery + 5 cyfr)
- Kod generowany w `AppContext.tsx`: `generateUserCode()`
- Zapisywany w `userData.userCode`

**2. Proces Parowania:**
```
Użytkownik A                    Użytkownik B
   |                                |
   | 1. Ma kod: ABC12345            |
   |                                |
   | 2. Udostępnia kod              |
   |    Użytkownikowi B             |
   |                                |
   |                           3. Wpisuje ABC12345
   |                              w modal
   |                                |
   |                           4. Zapisuje w
   |                              userData.partnerCode
   |                                |
   | 5. Widzi przełącznik           | 5. Widzi przełącznik
   |    "Moje" / "Partnera"         |    "Moje" / "Partnera"
```

**3. Dane w localStorage:**
```json
{
  "userData": {
    "userCode": "ABC12345",
    "partnerCode": "XYZ67890"  // Po połączeniu
  },
  "appData": {
    "own": { /* własne finanse */ },
    "partner": { /* finanse partnera */ }
  }
}
```

---

## 🔥 Integracja z Firebase - Plan Architektury

### Struktura Bazy Danych Firestore

```
/users/{userId}
  - email: string
  - name: string
  - userCode: string (unikalny)
  - partnerUserId: string | null
  - createdAt: timestamp
  - avatar: object

/finances/{userId}
  - expenses: array
  - incomes: array
  - goals: array
  - bills: array
  - workDays: array
  - settings: object

/families/{familyId}
  - createdBy: userId
  - createdAt: timestamp
  - members: array [
      {
        userId: string,
        addedAt: timestamp,
        permissions: {
          viewExpenses: boolean,
          viewIncome: boolean,
          viewGoals: boolean,
          viewBills: boolean,
          fullAccess: boolean
        }
      }
    ]
  - sharedData: object (opcjonalnie - wspólne finanse)
```

### Logika Parowania z Firebase

**1. Połączenie Partnera przez Kod:**
```javascript
// Funkcja w Firebase Cloud Function lub Client
async function connectPartner(myUserId, partnerCode) {
  // 1. Znajdź partnera po kodzie
  const partnerSnapshot = await db.collection('users')
    .where('userCode', '==', partnerCode)
    .limit(1)
    .get();
  
  if (partnerSnapshot.empty) {
    throw new Error('Nie znaleziono użytkownika z tym kodem');
  }
  
  const partnerDoc = partnerSnapshot.docs[0];
  const partnerId = partnerDoc.id;
  
  // 2. Utwórz familyId (sortowane userId dla spójności)
  const familyId = [myUserId, partnerId].sort().join('_');
  
  // 3. Aktualizuj obydwu użytkowników
  const batch = db.batch();
  
  batch.update(db.collection('users').doc(myUserId), {
    partnerUserId: partnerId,
    familyId: familyId
  });
  
  batch.update(db.collection('users').doc(partnerId), {
    partnerUserId: myUserId,
    familyId: familyId
  });
  
  // 4. Utwórz dokument rodziny jeśli nie istnieje
  const familyRef = db.collection('families').doc(familyId);
  batch.set(familyRef, {
    createdBy: myUserId,
    createdAt: FieldValue.serverTimestamp(),
    members: [
      {
        userId: myUserId,
        addedAt: FieldValue.serverTimestamp(),
        permissions: { fullAccess: true }
      },
      {
        userId: partnerId,
        addedAt: FieldValue.serverTimestamp(),
        permissions: { fullAccess: true }
      }
    ]
  }, { merge: true });
  
  await batch.commit();
  return familyId;
}
```

**2. Pobieranie Danych Partnera:**
```javascript
// Real-time listener na finanse partnera
const unsubscribe = db.collection('finances')
  .doc(partnerUserId)
  .onSnapshot((doc) => {
    if (doc.exists) {
      setPartnerData(doc.data());
    }
  });
```

**3. System Rodziny (Family Members):**
```javascript
// Dodawanie członka rodziny
async function addFamilyMember(familyId, memberCode, permissions) {
  // 1. Znajdź użytkownika po kodzie
  const memberSnapshot = await db.collection('users')
    .where('userCode', '==', memberCode)
    .limit(1)
    .get();
  
  if (memberSnapshot.empty) {
    throw new Error('Nie znaleziono użytkownika');
  }
  
  const memberId = memberSnapshot.docs[0].id;
  
  // 2. Dodaj do rodziny
  await db.collection('families').doc(familyId).update({
    members: FieldValue.arrayUnion({
      userId: memberId,
      addedAt: FieldValue.serverTimestamp(),
      permissions: permissions
    })
  });
  
  // 3. Aktualizuj użytkownika
  await db.collection('users').doc(memberId).update({
    familyId: familyId
  });
}
```

### Security Rules Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users - tylko własny profil
    match /users/{userId} {
      allow read: if request.auth.uid == userId 
                  || isPartner(userId)
                  || isFamilyMember(userId);
      allow write: if request.auth.uid == userId;
    }
    
    // Finances - własne + partnera + rodziny
    match /finances/{userId} {
      allow read: if request.auth.uid == userId 
                  || isPartner(userId)
                  || canViewFinances(userId);
      allow write: if request.auth.uid == userId
                   || hasFullAccess(userId);
    }
    
    // Families - tylko członkowie
    match /families/{familyId} {
      allow read: if isFamilyMember(familyId);
      allow write: if isFamilyMember(familyId);
    }
    
    // Helper functions
    function isPartner(userId) {
      let user = get(/databases/$(database)/documents/users/$(request.auth.uid));
      return user.data.partnerUserId == userId;
    }
    
    function isFamilyMember(targetUserId) {
      let targetUser = get(/databases/$(database)/documents/users/$(targetUserId));
      let myUser = get(/databases/$(database)/documents/users/$(request.auth.uid));
      return targetUser.data.familyId == myUser.data.familyId;
    }
    
    function canViewFinances(targetUserId) {
      let myUser = get(/databases/$(database)/documents/users/$(request.auth.uid));
      let family = get(/databases/$(database)/documents/families/$(myUser.data.familyId));
      let myMember = family.data.members.find(m => m.userId == request.auth.uid);
      return myMember.permissions.viewExpenses == true 
             || myMember.permissions.fullAccess == true;
    }
    
    function hasFullAccess(targetUserId) {
      let myUser = get(/databases/$(database)/documents/users/$(request.auth.uid));
      let family = get(/databases/$(database)/documents/families/$(myUser.data.familyId));
      let myMember = family.data.members.find(m => m.userId == request.auth.uid);
      return myMember.permissions.fullAccess == true;
    }
  }
}
```

---

## 🎯 Kluczowe Punkty dla Firebase

### 1. **familyId jest kluczem**
- Wspólne ID dla partnera: `userId1_userId2` (sortowane alfabetycznie)
- Pozwala na łatwe odnalezienie wspólnych danych
- Rozszerzalne na więcej członków rodziny

### 2. **Permissions System**
- Zapisane w dokumencie `families/{familyId}`
- Każdy członek ma własny zestaw uprawnień
- `fullAccess: true` = pełne prawa do wszystkiego
- Indywidualne flagi: `viewExpenses`, `viewIncome`, `viewGoals`, `viewBills`

### 3. **Kod do Dołączania**
- Unikalny kod użytkownika to klucz do dodawania
- Nie używamy emaili (prywatność)
- Kod jest czytelny i łatwy do udostępnienia

### 4. **Real-time Updates**
- Firestore listeners dla live sync
- Partner widzi zmiany od razu
- Członkowie rodziny widzą wspólne finanse w czasie rzeczywistym

---

## 📋 Checklist Migracji na Firebase

- [ ] Skonfiguruj Firebase projekt
- [ ] Dodaj Firebase SDK do aplikacji
- [ ] Utwórz Cloud Functions dla parowania
- [ ] Skonfiguruj Security Rules
- [ ] Zaimplementuj Firebase Auth (już gotowe w `AuthContext.tsx`)
- [ ] Migruj `AppContext` do Firestore
- [ ] Dodaj real-time listeners
- [ ] Zaimplementuj system permissions
- [ ] Przetestuj parowanie i rodzinę
- [ ] Dodaj error handling i retry logic

---

## 🔐 Bezpieczeństwo

1. **Unique User Codes:** Każdy użytkownik ma unikalny kod
2. **Firestore Rules:** Dostęp tylko do własnych danych + partnera + rodziny
3. **Permission System:** Granularna kontrola dostępu
4. **Email Verification:** Opcjonalne (już w AuthContext)
5. **Password Reset:** Już zaimplementowane (Firebase ready)

---

**Autor:** SENO Finance Team
**Data:** 2026-04-03
**Wersja:** 1.0
