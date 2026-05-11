# Vecka 5 – React-grunder

## User stories

- Som användare vill jag kunna se en lista av jobb.
- Som användare vill jag se tydlig information om varje jobb (titel, företag, ort, typ av tjänst etc.).

## Teknikfokus

- Intro till React
- JSX
- Komponenter
- Props
- Listor

## Uppgift

1. Skapa ett nytt React-projekt (Typescript) för JobChaser med Vite.
2. Lägg till en statisk lista med jobb. Använd arrayen med objektdata i `data.ts`. SVG-ikoner finns under `/assets`
3. Skapa komponenter:
   - `JobList` som tar emot en lista av jobb via props och renderar dem.
   - `JobItem` som visar information om ett jobb.
4. Rendera listan av jobb i UI:
   - Använd `map` för att skapa en lista med `JobItem`-komponenter.
   - Använd semantiska HTML-element. För styling använder antingen global CSS (vanlig), CSS moduler eller Tailwind CSS
5. Implementera konditionell rendering:
   - Om listan är tom ska texten "Inga jobb" visas.

## Teori / reflektionsfrågor

Besvara kortfattat i denna fil eller i en separat `theory-week-5.md`:

- Hur och varför uppstod React?

  React Skapades av mjukvaruingenjören Jordan Walke hos Facebook. Det lanserades för första gången 2013 i syfte att hjälpa
  Facebook hantera deras nyhetsflöde och chattsystem, då det under dåtidens system började bli väldigt krångligt. React introducerade
  the Virtual DOM, vilket gör att bara de delar av siudan som faktiskt ändras ritas in istället för att hela DOM:en ska uppdateras varje gång något ändras. Detta gjorde arbetsflödet snabbare och mindre buggbenäget.

- Vad är JSX?

  JSX står för JavaScript XML och är ett syntaktiskt tillägg som gör att man kan skriva HTML liknande kod direkt i ens JavaScript-filer. Detta gör koden mer läsbar och visar tydligt hur gränssnittet ser ut. Webbläsare förstår inte JSX direkt, så verktyg som Babel omvandlar det till vanlig JavaScript bakom kulisserna.

- Vad är en komponent i React?

  Det är uppsättning av en eller flera funktioner som är fördelad på sin egna plats så att man enkelt kan hämta hela komponenten istället för de olika specifika funktionerna. Detta skapar mer struktur i projekt där man enkelt kan se och arbeta vidare på specifika komponenter.

- Vad är props och hur används de?

  Props står för properties och är data som skickas från en föräldrakomponent till en barnkomponent. De fungerar som argument till en funktion och är immutable, vilket betyder att en komponent aldrig får ändra om de props som de tar emot.

- Vad menas med "one-way data flow" i React?

  I React flödar data bara åt ett håll: från förälder till barn. Detta gör det enkelt att felsöka eftersom man alltid vet var datan kommer ifrån. Om något är fel i en barnkomponent, vet man att felet antingen ligger i komponenten själv eller i de props den fått uppigrån.

- Vad är ett komponentträd? Rita ett och hur datan går genom komponenterna.

  Ett komponentträd är den hierarktiska struktur av din applikation. Överst finns App.tsx som sedan innehåller barn, vilka i sin tur kan ha egna barn.

- Hur kan man använda konditionell rendering i React?

  Det betyder att man visar olika saker baserat på ett tillstånd (state). Det görs oftast med vanlig JavaScript form av ternary operators och Logical &&.

- Vad menas med en återanvändbar komponent?

  Det är en komponent som är skriven så generellt att den kan användas på flera ställen med olika data. T.ex. så är en Button-komponent där du kan skicka fin färg och text som props. Istället för att skapa RedButton och BlueButton skapar man en CustomButton som kan anpassa sig.

- Vad är React Fragment (</>)?

  I React måste en komponent alltid returnera ett enda rotelement. Om man vill returnera två <div>-taggar bredvid varandra utan att omsluta dem med en extra (onödig) <div> i DOM:en, kan man använda Fragments: <>.
