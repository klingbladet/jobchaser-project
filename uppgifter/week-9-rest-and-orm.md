# Vecka 9 – REST API och Drizzle ORM

## User stories

- Som klient (frontend) vill jag kunna hämta en lista av jobb från ett REST API, så att jag kan visa tillgängliga jobbansökningar i användargränssnittet.
- Som klient vill jag kunna skapa, uppdatera och ta bort jobb via API:et, så att användare kan hantera sina jobbansökningar.
- Som klient vill jag kunna hantera användare (`users`) som är kopplade till jobb, så att varje jobbansökning kan spåras till rätt användare.

## Teknikfokus

- **REST-arkitektur** – Standard för att designa API:er
- **CRUD-endpoints i Express** – Implementera Create, Read, Update, Delete
- **Drizzle ORM** – Typesäker databashantering för TypeScript
- **Felhantering i API** – Returnera korrekta statuskoder och felmeddelanden

## Uppgift

### 1. Sätt upp Drizzle ORM i projektet

- Installera Drizzle med `npm install drizzle-orm pg` och `npm install -D drizzle-kit @types/pg`.
- Skapa en `db`-mapp med:
  - `schema.ts` – definiera dina tabeller (users, jobs) med Drizzle-syntax.
  - `index.ts` – exportera databasanslutningen.
- Konfigurera `drizzle.config.ts` för migrationer.
- Kör `npx drizzle-kit generate` för att generera migrationer.
- Kör `npx drizzle-kit migrate` för att applicera dem på databasen.

### 2. Implementera REST-endpoints för jobs

- Skapa en `routes/jobs.ts`-fil för att organisera dina routes.
- Implementera alla CRUD-endpoints:
  - `GET /jobs` – Hämta alla jobb från databasen.
  - `GET /jobs/:id` – Hämta ett specifikt jobb baserat på ID.
  - `POST /jobs` – Skapa ett nytt jobb (validera inkommande data).
  - `PUT /jobs/:id` – Uppdatera alla fält på ett jobb.
  - `PATCH /jobs/:id` – Uppdatera enskilda fält på ett jobb.
  - `DELETE /jobs/:id` – Ta bort ett jobb.
- Använd Drizzle ORM för alla databasoperationer.

### 3. Implementera endpoints för users

- Skapa en `routes/users.ts`-fil.
- Implementera grundläggande endpoints:
  - `GET /users` – Hämta alla användare.
  - `GET /users/:id` – Hämta en specifik användare med tillhörande jobb (via relation).
  - `POST /users` – Skapa en ny användare.
  - `DELETE /users/:id` – Ta bort en användare.
- Använd Drizzles relationer för att hämta kopplade jobb.

### 4. Lägg till felhantering

- Returnera korrekta HTTP-statuskoder:
  - `200 OK` – Lyckad hämtning.
  - `201 Created` – Resurs skapad.
  - `400 Bad Request` – Ogiltig indata.
  - `404 Not Found` – Resursen finns inte.
  - `500 Internal Server Error` – Serverfel.
- Skapa tydliga felmeddelanden i JSON-format, t.ex. `{ "error": "Job not found" }`.
- Hantera edge cases (t.ex. försök att ta bort en användare som inte finns).

### 5. Testa alla endpoints

- Använd Thunder Client eller Postman.
- Testa varje endpoint med olika scenarion:
  - Lyckade anrop
  - Felaktiga ID:n (bör returnera 404).
  - Ogiltig indata (bör returnera 400).
- Spara gärna en request-collection i repot för enkel delning.

## Teori och reflektionsfrågor

### REST-arkitektur

- Vad står REST för (Representational State Transfer) och vilka principer är viktiga?

  REST står för representational state Transfer och är standarden för hur vi bygger webb-API:er. Det är inte ett protokoll utan snarare en arkitekturstil, en samling spelregler för hur klienter och servrar ska kommunicera med varandra på ett effektivt och skalbart sätt.
  - **Stateless** – Varje request innehåller all nödvändig information.
  - **Uniform interface** – Konsekvent användning av HTTP-metoder och URL-struktur.
  - **Resource-based** – URL:er representerar resurser (t.ex. `/jobs`, `/users`).

- Hur bör URL-strukturen se ut i ett RESTful API?

  Hur man utformar URL-strukturen eller de såkallade endpoints är avgörande för att ett API ska vara intuitvt, förutsägbart och lätt att underhålla. Inom REST pratar man ofta om att URL:en ska representera resurser, inte handlingar. Alltså t.ex. "/users" och inte "/getUsers".

### HTTP-metoder

- Vad är skillnaden mellan de olika HTTP-metoderna?
  - **GET** – Hämta data (idempotent, ingen sidoeffekt).
  - **POST** – Skapa ny resurs.
  - **PUT** – Ersätt hela resursen.
  - **PATCH** – Uppdatera delar av resursen.
  - **DELETE** – Ta bort resurs.
- Vad betyder "idempotent" och vilka metoder är idempotenta?

  Det är en egenskap hos en operation som innebär att den kan köras flera gånger med samma indata utan att slutresultatet ändras efter det första anropet. HTTP metoden POST är inte idempotent eftersom ju ifall jag gör en POST flera gånger förändras resultatet beroende på antal gånger. Patch kan vara idempotent men är oftast inte det. Ifall din PATCH innehåller instruktonen "lägg tll 10 på saldot" så kommer varje anrop att öka summan, vilket ändrar slutresultatet varje gång.

### ORM och Drizzle

- Vad är en ORM (Object-Relational Mapping) och varför används det?

  En ORM är en teknik so fungerar som en bro mellan den objektorienterade världen i din kod och den relationella världen i din databas (SQL-databaser som PostgreSQL). Den gör det möjlgt att interagera med en databas gemon att använda vanliga objekt i ett programmeringsspråk istället för att skrva råa SQL-frågor.

- Vilka fördelar ger Drizzle jämfört med att skriva rå SQL?
  - Typsäkerhet med TypeScript.
  - Enklare att underhålla och refaktorera.
  - Skydd mot SQL-injection.
  - Automatisk hantering av relationer.
- Vad är nackdelarna med att använda en ORM?

  Eftersom en ORM är en abstraktion kommer den till en kostnad. Eftersom den måste översätta kod till SQL, skicka frågan, ta emot resultatet och sedan kovertera tillbaka raderna till objekt gör detta att prestandan kan påverkas negativt då denna process belastar CPU och minne. Det finns en chans att ORM genererar ineffektiv SQL eftersom den inte är optimerad på samma sätt som en expertutvecklare hade gjort det för hand.

### Felhantering

- Varför är korrekt felhantering viktigt i ett API?

  Eftersom att bara ett "error" i en backend kan skapa en krasch i hela systemet betyder det att ju bättre och tydligare man gör sin felhantering, destå lättare kan man hitta felen ifall de dyker upp.

- Hur bör felmeddelanden struktureras för att vara användbara för klienten?

  För att ett API ska anses som proffesionelt räcker det inte bara med en status-kod (som 404 eller 500). Klenten behöver veta vad exakt som gick fel, varför det hände och ibland hur det kan fixas. Ett välstrukturerat felmeddelande bör skickas som ett JSON-objekt som innehåller.
  - HTTP-statuskod: T.ex. (400 eller 500)
  - Intern felkod: En unik sträng. T.ex. (INVALID_ID) som klientens kod kan reagera på.
  - Beskrivande text: En mänsklig förklaring av vad som gick fel
  - Detaljer/Trace-ID: Specifik info om t.ex. vilket fält som validerade fel, samt ett unikt ID för att kunna htta felet i serverns loggar.

- Vad är skillnaden mellan klientfel (4xx) och serverfel (5xx)?

  4xx (Klientfel): Felet beror på att klienten skickat en felaktig begäran. Det kan vara felaktiga inloggningsuppgifter, en URL som inte finns eller saknad behörighet. Klienten måste ändra sitt anrop för att det ska lyckas.

  5xx (Serverfel): Felet beror på servern. Klientens anrop kan vara helt korrekt, men serverns kod har kraschat, databasen är nere eller systemet är överbelastat. Det är backend-utvecklarens jobb att laga felet.

## Extrauppgifter

- Lägg till paginering på `GET /jobs` (t.ex. `?page=1&limit=10`).
- Implementera filtrering (t.ex. `GET /jobs?status=applied`).
- Lägg till validering av inkommande data med ett bibliotek som Zod.
