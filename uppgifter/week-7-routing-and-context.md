# Vecka 7 – Routing och Context

## User stories

- Som användare vill jag kunna besöka sidan `/jobs` där jag ser listan av jobb.
- Som användare vill jag kunna besöka `/signup` där det finns ett formulär för att registrera konto.
- Som användare vill jag kunna besöka `/signin` där det finns ett formulär för inloggning.
- Som användare vill jag kunna växla mellan dark mode och light mode, och se valet slå igenom på alla sidor.

## Teknikfokus

- Routing med React Router (kodbaserad routing)
- Intro till filbaserad routing (konceptuellt/TanStack Router)
- Context API
- Globalt tema (dark/light)
- React Hook Form

## Uppgift

1. Installera och konfigurera React Router ELLER Tanstack Router i frontend-projektet.
2. Skapa följande routes:
   - `/jobs` – visar jobblistan från tidigare veckor.
   - `/signup` – visar ett registreringsformulär (ingen riktig backend-koppling ännu).
   - `/signin` – visar ett login-formulär.
3. Skapa en `Header`/`Nav`-komponent:
   - Länkar till `/jobs`, `/signup`, `/signin`.
   - Visas på alla sidor.
4. Använd React Hook Form för att hantera registrerings- och login-formuläret
5. Skapa ett Theme Context:
   - Global state för `theme` (`"light"`/`"dark"`).
   - En knapp i headern/nav som växlar tema.
   - Tillämpa tema på hela appen (val av metod beroende hur du använder CSS)

## Teori / reflektionsfrågor

- Vad menas med routing i en webapp?

  Routing innebär att koppla ihop flera navigeringar med specifika innehåll eller funktioner. Utan routing skulle webben bara bestå av enstaka, oberoende filer utan något smart sätt att röra sig emellan dem. Det finns två typer av routing, server-side och client-side. Server-side är mer traditionellt och innebär att när man klickar en länk så skickar webbläsaren en förfrågan till en server medan client-side är ett mer modernt sätt som använder ett ramverk, t.ex. React för att köra single-page application och istället byter innehåll på samma sida genom att ladda om den.

- Vad är fördelar / nackdelar med kodbaserad routing vs. filbaserad?

  Kodbaserad routing: Fördelarna ligger i att man får mer kontroll och flexibilitet då man kan organisera filer precis hur man vill. Nackdelarna är att det blir mer kod att underhålla samt större risk för felskrivning då du har mer kod att hålla koll på.

  Filbaserad routing: Fördelarna ligger i att det är mer intuitivt och snabbstartat. Routingen sker mer automatiskt i med att man skapar filerna. Det blir även mer överskådligt och sajtens struktur är lättare att följa. Nackdelarna ligger i att der är låst till filsystemets regler och därför inte är lika flexibelt. Stora projekt kan få extremt djupa och svårnavigerade mappstrukturer. Det blir även svårare att styra avancerad routing-logik direkt i filnamnen.

- Vad är fördelarna med att använda React Hook Form?

  Det höjer prestandan då det blir färre omrenderingar tll skillnad från vanliga React-formulär där man binder varje input till en useState vlket leder till att hela komponenten renderas om varje gång man skriver en enda bokstav. Det blir mindre kod eftersom man slipper skriva manuella onChange-funktioner och value-kopplingar för varje fält. Det blir även enklare validering då man kan lägga till regler som "måste fyllas". Sist men inte minst är det lättviktigt vilket gör att det gåller applikationen snabb.

- Vad är syftet med Context API?

  Syftet med Context API är att erbjuda ett sätt att dela data mellan komponenter utan att manuellt behöva skicka ner "props" genom varje nivå i komponentträdet.

- Vilket problem med props löser Context?

  Problemet med "Prop Drilling", det vill säga när man tvingas skicka data (props) genom massor av komponenter som egentligen inte behöver informationen, för att kunna nå en komponent längre ner i trädet. Context API skpar en genväg som gör data tillgänglig för alla komponenter som behöver den oavsett var de befinner sig.

## Extrauppgifter

1. Implentera formulärvalidering med biblioteket Zod
2. Implementera både filbaserad routing och kodbaserad och utvärdera produktivitet och andra fördelar / nackdelar
3. Nested Routes – Skapa /jobs/:id för att visa detaljer om ett specifikt jobb
4. Använd Framer Motion eller CSS transitions för att animera sidbyten
5. Skapa ett User Context som håller koll på "inloggad" användare (simulera med localStorage)
6. Skapa en route /profile som bara är tillgänglig om användaren är "inloggad" (simulera med Context/localStorage)
7. History Navigation – Lägg till "Tillbaka"-knapp som använder browser history API
8. Skapa ett Context för toast-meddelanden (t.ex. "Jobb tillagt!" när man lägger till ett jobb)

## Bra att veta: Authentisering kommer att göras i vecka 10 med JWT.
