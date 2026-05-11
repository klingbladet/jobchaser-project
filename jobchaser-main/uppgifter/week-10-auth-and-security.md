# Vecka 10 – Autentisering, säkerhet och JWT

## User stories

- Som användare vill jag kunna skapa ett konto (signup) och logga in (signin).
- Som inloggad användare vill jag bara kunna se och manipulera mina egna jobb.
- Som utvecklare vill jag skydda känsliga routes i API:et med autentisering.

## Teknikfokus

- Autentisering med JWT
- Lösenordshantering (hashning)
- Middleware i Express
- Grundläggande säkerhetstänk (tokens, skyddade routes)

## Uppgift

1. Skapa auth-endpoints:
   - `POST /auth/signup` – skapa en ny användare:
     - Hasha lösenordet innan det sparas i databasen.
   - `POST /auth/signin` – logga in användare:
     - Verifiera lösenord.
     - Generera och returnera en JWT.
2. Skapa middleware för auth:
   - Läser `Authorization`-header med bearer token.
   - Verifierar JWT.
   - Lägger användarinfo på `req.user` om token är giltig.
3. Skydda relevanta routes:
   - T.ex. `POST/PUT/DELETE /jobs` får bara användas av inloggade användare.
     8 - Koppla skapade jobb till `req.user.id` automatiskt.
   - Filtrera `GET /jobs` så att användare endast ser sina egna jobb.
4. Koppla frontend-formulären från `/signup` och `/signin`:
   - Skicka data till backend-auth-endpoints.
   - Spara JWT i frontend (t.ex. `localStorage` eller `http-only cookie`).
   - Skicka token i `Authorization`-header vid skyddade anrop.

## Teori / reflektionsfrågor

- Hur fungerar Middleware och vad används den till?

  Middleware fungerar som en intelligent brygga mellan applikationens olika lager, främst mellan klienten (frontend) och serverns logik (backend). Dess uppgift är att bearbeta, kontrollera och vid behov transformera data som transporteras mellan parterna för att säkerställa att den är korrekt och applicerbar i den specifika miljön.

- Vad är skillnaden mellan autentisering och auktorisering?

  I stora drag är skillnaden att autentisering handlar om vem man är medan auktorisering handlar om vad man får göra. Därför sker auktoriseringen i stadiet efter autentiseringen och först då kollar vad användaren är tillåten att göra och inte. I en applikation fungerar dessa som oliga steg av vakter, alltså middlewares som först checkar vem användaren är och sedan vad användaren är tillåten att göra.

- Vad är en JWT och vilka för- och nackdelar finns?

  Det står för JSON Web Token och är en öppen standard för att säkert överföra data mellan två parter som JSON-objekt.

  Fördelar

  Det som är bra med JWT är att den är self-contained vilket betyder att en enskild token innehåller den informationen som behövs för en användare och inte behöver fråga databasen vid varje enskilt anrop. Eftersom JWT är Stateless behöver servern inte lagra "sessions" i sitt minne vilket gör det enkelt att skala upp applikationer till flera servrar. JWT fungerar även väldigt enkelt i mobilappar till skillnad från den traditionella "cookies".

  Nackdelar

  Eftersom en JWT är giltig tills den går ut, kan man inte enkelt "logga ut" en användare eller spärra en stulen token omedelbart. Det finns en säkerhetsrisk vid stöld då ifall någon kommer åt ens JWT kan de ha tillgång till kontot tills token går ut. Även fall man lägger till för mycket information i payloaden blir token stor och kan därmed öka mängden datatrafik onödigt mycket.

- Vilka risker finns kring hantering av tokens i frontend?

  Eftesom frontend-kod körs i användarens webbläsare är JWT-tokens per definition i en osäker miljö. En riks är XSS vilket innebär att en angripare lyckas injicera skadlig JavaScript-kod på ens webbsida. Ifall man lagrar sin JWT i localStorage eller sessionStorage kan angriparens skript enkelt läsa ut den med ett kommando. När de har ens token kan de sedan skicka den till sin egen server och ta över sessionen.

  Ifall man vill skydda sig från XSS och använder cookies istället öppnar man dock dörren för CSFR vilket står för Cross-Site Request Forgery. Detta betyder att en angripare lurar en användare att klicka på en länk till en elak webbsida. Eftersom webbläsaren automatiskt skickar med cookies vid anrop till backend kan den elaka webbsdan "låtsas" vara användaren och t.ex. göra ett bankuttag eller byta lösenord utan att användaren märker det.

  Eftersom en JWT-token är giltig ända tills den går ut medför risken att en angripare får tag på token genom ex. avlyssning och sedan använder den om och om igen tills utgångstiden passeras. De behöver inget lösenord eftersom själva token är bevset på att de är inloggade. Detta kallas Replay Attacks.

- Varför ska lösenord aldrig sparas i klartext?

  För att minmera skadan för användaren efter ett eventuellt oundviklgt dataintrång. Ifall en hackare lyckas bryta sig in i en databas och lösenord står i klartext har de omedelbart tillgång till alla användarkonton. Om de däremot är krypterade eller hashade ser hackaren bara en obekgriplig teckensträng. Vilket i sin tur skyddar alla konton.

## Extrauppgifter

- Implementera "refresh tokens" för att förnya utgångna access tokens.
- Lägg till lösenordsvalidering (minst 8 tecken, specialtecken, etc.).
- Implementera "glömt lösenord"-funktionalitet.
- Lägg till rate limiting på auth-endpoints för att förhindra brute force-attacker.
- Använd HttpOnly cookies istället för localStorage för säkrare tokenlagring.
