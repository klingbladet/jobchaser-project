# Vecka 11 – Global state-hantering med useReducer och Zustand

## User stories

- Som användare vill jag kunna filtrera jobb efter flera villkor (t.ex. kategori, ort, fritext), så att jag snabbt hittar relevanta jobbansökningar.
- Som användare vill jag att mina filterinställningar och inloggningsstatus ska gälla oavsett vilken sida jag är på, så att jag slipper ställa in samma saker flera gånger.
- Som användare vill jag bli omdirigerad till inloggningssidan om jag försöker nå en skyddad sida utan att vara inloggad.
- Som utvecklare vill jag strukturera komplex state-hantering på ett tydligt och underhållbart sätt.

## Teknikfokus

- **useReducer** – Hantera komplex state-logik med actions och reducer
- **Zustand** – Lättviktigt bibliotek för globalt state
- **Auth-state** – Hantera inloggningsstatus i hela applikationen
- **Jämförelse med Context API** – Förstå skillnader och användningsområden

## Uppgift

### 1. Hantera auth-state i frontend

- Skapa en auth-store med Zustand för att hålla koll på inloggningsstatus:
  - `user` – Den inloggade användarens information.
  - `token` – JWT-token för autentiserade API-anrop.
  - `isAuthenticated` – Boolean för att enkelt kolla inloggningsstatus.
- Skapa actions i storen:
  - `login(user, token)` – Spara användare och token vid inloggning.
  - `logout()` – Rensa användare och token vid utloggning.
- Persistera token i `localStorage` så att användaren förblir inloggad vid sidomladdning.
- Visa/dölj UI-element baserat på om användaren är inloggad (t.ex. visa "Logga ut" istället för "Logga in").

### 2. Skydda routes i frontend

- Skapa en `ProtectedRoute`-komponent som:
  - Kontrollerar om användaren är inloggad via auth-storen.
  - Redirectar till `/signin` om användaren inte är inloggad.
  - Renderar barn-komponenten om användaren är inloggad.
- Använd `ProtectedRoute` för sidor som kräver inloggning (t.ex. skapa jobb, mina jobb).

### 3. Implementera avancerad filtrering med useReducer

- Skapa en reducer för filter-state med actions:
  - `SET_TEXT_FILTER` – Uppdatera fritextsökning.
  - `SET_LOCATION` – Filtrera på ort.
  - `SET_CATEGORY` – Filtrera på kategori.
  - `SET_EMPLOYMENT_TYPE` – Filtrera på anställningsform.
  - `CLEAR_FILTERS` – Återställ alla filter.
- Skapa en `FilterPanel`-komponent med inputfält för varje filter.
- Applicera filtren på jobblistan och visa filtrerade resultat.

### 4. Skapa en Zustand-store för filtreringsinställningar

- Flytta filter-state till en Zustand-store för global åtkomst.
- Konsumera storen i olika komponenter:
  - `FilterPanel` – Uppdaterar filter.
  - `JobList` – Läser filter och visar filtrerade jobb.
  - `Header` – Visar antal aktiva filter (valfritt).

### 5. Behåll Theme Context

- Låt tidigare Theme Context (dark/light mode) ligga kvar.
- Detta visar skillnaden mellan Context API och Zustand i samma app.

## Teori och reflektionsfrågor

### Lokal vs global state

- När räcker lokal state (komponent-nivå) i React?
- Vilka problem uppstår när man behöver dela state mellan många komponenter?
- Vad är "prop drilling" och varför är det problematiskt?

  Lokal state på komponentnivå är fullt tillräckligt så länge informationen är isolerad, som till exempel om en specifk modal är öppen eller vad en användare ett skriver i ett formulär. Problemen uppstår dock så fort flera komponenter i olika delar av applikationen behöver tillgång till samma data, då det kräver att man synkroniserar tillståndet manuellt. Detta leder ofta till prop drilling, vilket är ett fenomen där man skickar data som props genom flera lager av komponenter som egentligen inte behöver informationen själva, bara för att nå en mottagare djupt ner i strukturen. Detta skapar en svåröverskådlig kodbas som är känslig för förändringar. Detta eftersom ett enda litet ändrat fält kan kräva uppdateringar i hela komponentträdet.

### useReducer

- Vad är skillnaden mellan `useState` och `useReducer`?
- När är `useReducer` ett bättre val än `useState`?
- Vad är en "action" och en "reducer" i React-sammanhang?
- Hur relaterar useReducer till Redux-mönstret?

  Medan useState är det naturliga valet för enkla världen, är useReducer ett betydligt starkare verktyg när logiken bakom en uppdatering blir komplex eller när flera relaterade värden ska ändras samtidigt. I detta mönster skickar man en action. till en reducer, vilket är en ren funktion som beräknar nästa state baserat på den tidigare informationen och instruktonen. Detta är i praktiken en förenklad version av Redux-arkitekturen inbyggd direkt i React, vilket ger en förutsägbar datastruktur där logiken separeras från själva renderingen.

### Context API vs Zustand

- Vilka fördelar och nackdelar har Context API?
- Vilka fördelar har ett dedikerat state management-bibliotek som Zustand?
- När är det motiverat att införa globalt state i ett projekt?

  Valet mellan Context API och ett bibliotek som Zustand handlar ofta om prestanda och användarvänlighet. Context API är utmärkt för data som sällan ändras, såsom färgteman eller språkinställningar, men dess största nackdel är att alla komponenter som konsumerar ett Context renderas om vid varje ändring. Zustand löser detta genom att låta komponenter selktivt prenumerera på exakt den data de behöver, vilket minskar onödiga omrenderingar. Att införa globalt state är motiverat när applikationen växer till en punkt där databehöver vara tillgänglig överallt utan att man behöver hantera komplexa kedjor av props.

### Auth-state i frontend

- Varför är det viktigt att hantera auth-state globalt?
- Hur säkerställer man att skyddade routes verkligen är skyddade?
- Vad händer om en token går ut medan användaren är aktiv i appen?

  Hanteringen av autentisering är nästan alltid ett fall för globalt state eftersom användarens identitet påverkar i princip hela applikationens beteende. För att skydda specifika rutter använder man ofta en logik som kontrollerar auth-status innan en komponent renderas. Om användaren saknar behörighet nekas åtkomst omedelbart, om en token skulle löpa ut under pågående användning hanteras detta oftast via ett "interceptor-lager" i API-anropen som fångar upp obehöriga svar genom 401 och tvingar fram en utloggning eller en automatisk förnyelse av sessionen för att bibehålla säkerheten.

## Extrauppgifter

- Lägg till "favoritjobb" eller "sparade jobb" i Zustand-storen.
- Implementera automatisk utloggning när JWT-token går ut.
- Lägg till en "loading"-state för asynkrona operationer.
- Använd Zustand middleware för att logga state-ändringar (devtools).
