# Vecka 8 – Introduktion till backend: Node.js, Express och SQL

## User stories

- Som utvecklare vill jag skapa ett backend-API för JobChaser som lagrar användare och jobbansökningar i en SQL-databas, så att data kan sparas permanent och hanteras via ett strukturerat gränssnitt.
- Som utvecklare vill jag kunna ansluta till en PostgreSQL-databas och skriva SQL-frågor direkt i min kod, så att jag får full kontroll över databasoperationerna.

## Teknikfokus

- Node.j
- Express.js
- SQL som frågespråk (SELECT, INSERT, etc.)
- SQL-databaser med fokus på PostgreSQL i Node.js-projekt
- Enklare databasmodellering

## Uppgift

### 1. Skapa ett nytt backend-projekt

- Skapa en ny mapp för ditt backend-projekt (t.ex. `jobchaser-api` eller `server`).
- Installera Express med `npm install express`.
- Skapa en `index.ts`-fil som startpunkt för din server.

### 2. Designa databasmodellen för JobChaser

- Skapa minst två tabeller: `users` och `jobs`.
- Definiera en **one-to-many-relation**: en användare kan ha flera jobbansökningar.
- Planera vilka kolumner varje tabell behöver (t.ex. `id`, `name`, `email` för users).
- Skissa gärna ett enkelt ER-diagram för att visualisera relationerna.

### 3. Sätt upp en PostgreSQL-databas

- Installera PostgreSQL lokalt
- Skapa en ny databas för projektet.
- Notera anslutningsuppgifterna (host, port, användarnamn, lösenord, databasnamn).

### 4. Anslut till databasen och skriv SQL i koden

- Installera PostgreSQL-klienten med `npm install pg`.
- Skapa en databasanslutning i din kod med hjälp av `pg`-paketet.
- Skapa tabellerna med `CREATE TABLE`-satser.
- Testa grundläggande CRUD-operationer:
  - **C**reate: `INSERT INTO`
  - **R**ead: `SELECT`
  - **U**pdate: `UPDATE`
  - **D**elete: `DELETE`

### 5. Skapa en Express-server med health-check

- Konfigurera en Express-server som lyssnar på en port (t.ex. 3000).
- Skapa en health-check-route (`GET /health`) som returnerar `{ status: "ok" }`.
- Verifiera att servern startar korrekt genom att besöka `http://localhost:3000/health`.

### 6. Implementera CRUD-routes för users och jobs

- Skapa routes för alla CRUD-operationer:
  - `GET /users` – Hämta alla användare
  - `GET /users/:id` – Hämta en specifik användare
  - `POST /users` – Skapa en ny användare
  - `PUT /users/:id` – Uppdatera en användare
  - `DELETE /users/:id` – Ta bort en användare
- Implementera motsvarande routes för `jobs`.
- Koppla varje route till rätt SQL-fråga mot databasen.

### 7. Testa alla routes med Thunder Client eller Postman

- Installera Thunder Client som ett tillägg i VS Code, eller använd Postman.
- Testa varje endpoint och verifiera att rätt data returneras
- Kontrollera att HTTP-statuskoderna är korrekta (t.ex. 200 för OK, 201 för skapad, 404 för ej hittad).

## Teori och reflektionsfrågor

### Node.js och Express

- Vad är Node.js och hur skiljer det sig från att köra JavaScript i webbläsaren?

  Node är en runtime som gör det möjlgt att köra JavScript på server eller en dator. Istället för att vara begränsad till webbsidan. Det möjliggör att kunna använda JavaScript för andra sidor av programmering som t.ex. backend.

- Vad är en **route** i backend-sammanhang och hur fungerar den?

  I backend betyder route endpoint och är en specifik adress eller "stig" på en server som väntar på instruktioner. OM routing i frontend handlar om vad användaren ser, handlar routing i backend om vilken logik eller data som ska köras. Man kan se det som en dörr till en specifik funktion.

- Vilka problem löser Express.js och varför används det istället för att bygga allt från grunden?

  Express.js är ett ramverk gjort för att göra processen att skapa en server i Node.js snabbare, säkrare och mer strukturerad. Express.js löser hantering av routing, middleware och parsing av data för att underlätta en annars väldigt pillig process att skapa en fungerande backend.

### SQL och databaser

- Vad är SQL och vad står förkortningen för?

  SQL står för Structured Query Language och är standardspråket som används för att kommunicera med och hantera relationella databaser. Ifall databasen är själva lagringsplatsen för informationen, är SQL språket man använder för att prata med den.

- Vilka är de vanligaste SQL-databaserna (PostgreSQL, MySQL, SQLite, SQL Server) och vad skiljer dem åt?

  PostgreSQL, MySQL, SQLite, SQL Server är de vanligasta alternativen för skapa databaser. Även alla dessa talar språket SQL är de byggda för olika syften. Databser som MySQL och PostgreSQL är bägge open source och skiner i att skapa stora och skalbara projekt, men kan bägge framstå som lite komplexa för mer enkla projekt. SQLite är ett alternativ för mindre komplexa projekt och är därmed snabbare att starta upp. Sedan är Microsoft SQL Server Microsofts kommersiella alternatv. Det är en kraftfull motor som är djupt integrerad i Microsofts ekosystem (som .NET och Azure).

- Förstå följande databasbegrepp:
  - **Tabell** – en strukturerad samling av relaterade data
  - **Rad (record)** – en enskild post i tabellen
  - **Kolumn (field)** – en specifik egenskap/attribut
  - **Primärnyckel (primary key)** – unikt identifierande värde för varje rad
  - **Främmande nyckel (foreign key)** – referens till en primärnyckel i en annan tabell
  - **Relation** – koppling mellan tabeller

### Databasmodellering

- Vad är ett ER-diagram (Entity-Relationship) och varför är det användbart?

  Det är en visuell ritning över hur data hänger ihop i en databas. Det fungerar som en arkitekts ritning innan man börjar bygga ett hus och visar vilka entiteter som ska finnas och hur de pratar med varandra.

- Förklara de tre typerna av relationer och hur de används för att skapa kopplingar mellan tabeller:
  - **One-to-one** – en post relaterar till exakt en annan post
  - **One-to-many** – en post kan relatera till flera andra poster
  - **Many-to-many** – flera poster kan relatera till flera andra poster

### API-testning och HTTP

- Vad är syftet med verktyg som Thunder Client och Postman?

  Syftet är att vara en testmiljö för API:er. De låter en kommunicera direkt med en backend-server utan att man behöver skriva någon frontend-kod eller bygga ett användargränssnitt först.

- Vilka är de vanligaste HTTP-metoderna (GET, POST, PUT, DELETE) och när används de?
- Lär dig de viktigaste HTTP-statuskoderna:
  - **200** – Lyckade förfrågningar (200 OK, 201 Created, 204 No Content)
  - **400** – Klientfel (400 Bad Request, 401 Unauthorized, 404 Not Found)
  - **500** – Serverfel (500 Internal Server Error)

### SQL vs NoSQL

- Vad är skillnaden mellan en SQL-databas
  (relationsdatabas) och en NoSQL-databas (t.ex. MongoDB)?

  Den största skillnaden ligger i hur de är strukturerade. En SQL-databas är skriven i form av tabeller mer rader och kolumner. Medan en NoSQL-databas (None Structured Query Language) är strukturerad med Word-filer eller JSON-objekt. NoSQL är dynamiskt och mer flexibelt men kan anses att vara svårare att skala upp till skillnad från SQL-tabeller.

- I vilka situationer passar respektive databastyp bäst?

  SQL är bäst i större och mer komplexa projekt när dataintegritet är då det är striktare för att säkerställa att data ska vara korrekt och konsekvänt. När relationerna är komplexa och behöver koppla ihop data från många olika ställen är SQL det bättre då det är mer strukturerat och överskådligt. Exempel på användning: Ekonomsystem, lagersaldon och bokningssystem.

  NoSQL är bäst när flexibilitet krävs. Ifall man bygger en prototyp eller tjänst där datastrukturen ändras ofta och olika objekt kan ha olika fält. Eller ifall man behöver hantera enorma volymer ostrukturerad data. När snabbutveckling är ett måste och behöver kunna sprida ut databasen över många servrar för att hantera extremt hög trafik. Exempel på användning: Chatt-appar, analys av Big Data och innehållshantering.
