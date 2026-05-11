# Vecka 6 – State, datahämtning och formulär

## User stories

- Som användare ska jag kunna filtrera jobb i listan baserat på en sökterm
- Som användare vill jag kunna se när jobben laddas in.
- Som användare ska jag kunna lägga till ett jobb via ett formulär (lagras i local state).

## Teknikfokus

- `useState`
- `useEffect` för datahämtning
- Formulär
- Kontrollerade komponenter
- Enkel loading-state

## Uppgift

1. Lägg till ett sökfält ovanför jobblistan:
   - Använd `useState` för att lagra söktermen.
   - Filtrera jobblistan baserat på söktermen (t.ex. på jobbtitel eller företag).
2. Gör sökfältet till en kontrollerad komponent:
   - Värdet styrs av state, `onChange` uppdaterar state.
3. Flytta jobbdatan till en separat JSON-fil eller en utforska ett externt API som tillhandahåller jobannsonser.
4. Använd `useEffect` för att hämta jobben:
   - Visa en loader eller texten "Laddar jobb…" medan data hämtas.
   - Hantera ev. fel (t.ex. visa ett felmeddelande).

## Teori / reflektionsfrågor

- Vad är lokalt state i React? Vad är syftet med Hook:en `useState`?

  Lokalt state är data som en komponent "äger" och kommer igåg mellan renderingar. Till skillnad från vanliga variabler, triggar en uppdatering av state att React ritar om (renderar) komponenten så att användaren ser förändringen.

- Vad är skillnaden mellan state och props?

  Props är funktionsargument. De skickas till en komponent från en förälder och är "read-only" dvs immutable (komponenten får inte ändra sina egna props). State är däreot som lokala variabler inuti en funktion. Komponenten hanterar och ändrar detta själv (mutable). Kort sagt är props data utifrån medan state är data inifrån.

- Vad menas med en kontrollerad komponent?

  En kontrollerad komponent är ett element där React har full kontroll över värdet. Istället för att webbläsaren själv håller koll på vad användaren skriver, kopplar man input-fältets value till ett state och uppdaterar det via en onChange-handlare. React blir då den "enda sanningen".

- Vad är en callback handler i React-sammanhang?

  Eftersom flödet bara flödar nedåt (props), används callback handlers för att låta ett barn kommunicera med sin förälder. Föräldern skickar ner en funktion, en "callback" som en prop till barnet. När något händer i barnet (t.ex. ett klick), anropar barnet den funktionen, vilket gör att föräldern kan reagera (t.ex. uppdatera sitt state).

- Skissa och förklara komponentträdet och hur data går genom komponenterna.

  <!-- [ App (State: user) ]
                |
        -------------------
        |                 |
  [ Sidebar ]      [ MainContent ]
                          |
                  [ UserProfile (Props: user) ] -->

  Data (Props) rinner alltid nedåt från App till UserProfile. Om något händer i UserProfile skickas ett meddelande uppåt via en callback-funktion till App för att eventuellt ändra state.

- Vad menas med "lifting state up"?

  När tvp barnkomponenter behöver dela samma data, eller när de behöver synkronisera med varandra, flyttar man upp statet till deras närmsta gemensamma. Detta för att React har ett "one-wat data flow". Genom att ha statet i föräldern kan föräldern skicka ner datan till båda barnen via props.

- Vad är en side-effect (sidoeffekt) och vad är syftet med `useEffect`?

  Side-effect är allt som påverkar något utanför själva React-komponenen. Exempel på detta är att hämta data från ett API, att ändra dokumentets titel eller sätta upp en timer. useEffect däremot är en Hoomk som låter en köra kod vid specifika tillfällen i en komponents livscykel (t.ex. när den först visas på skärmen eller när ett visst state ändras). Den separerar logiken för "renderingen" från lokigen för "sidoeffekter"

- Vad är syftet med dependency-arrayen i `useEffect`?

  Dependency-arrayen är det andra argumentet i en "useEffect" och bestämmer när effekten ska köras igen. Ifall har en tom array där "[]", betyder det att effekten bara körs en gång. Med en variabel som t.ex. "[data]" körs den varje gång "data ändras". Ifall man inte har någon array körs effekten vid varje rendering, detta bör undvikas för att det gör att effekten tar upp kraft i applikationen.

## Extrauppgifter

1.  Skapa ett formulär för att lägga till ett nytt jobb:

- Kontrollerade inputs (titel, företag, ort, etc.).
- Vid submit: lägg till jobbet i jobblistan (local state).
- Töm formuläret efter lyckad submit.

2.  Skapa en s.k. debounce i sökrutan (fördröjning av användarens input) med biblioteket Lodash eller React `useDeferredValue` (React 19). Implementera funktionaliteten som en s.k. custom hook.
3.  Implementera autocomplete i sökrutan. Egen funktion utan extra bibliotek. Använd Hook:en `useRef`.
4.  Visa en animerad loader när jobben laddas in. Använd en fördröjning med `setTimeout` om det behövs för att den ska visas. Tips: Använd `Promise.all` som väntar på både fetch och en 1 sekunds timeout.
5.  Utforska andra alternativ för datahämtning istället för useEffect.

- React Query / TanStack Query
- SWR (Vercel)
- use() hook (React 19)
