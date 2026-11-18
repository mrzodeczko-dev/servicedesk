# ServiceDesk

System obsługi zgłoszeń IT. Front w Angularze, backend w Spring Boot.

| Katalog            | Zawartość                         |
| ------------------ | --------------------------------- |
| `servicedesk-api/` | REST API: Java 25, Spring Boot 4.1 |
| `servicedesk-web/` | aplikacja SPA: Angular 22         |
| `.github/`         | CI w GitHub Actions, szablon PR   |

## Wymagania

- JDK 25
- Node.js w wersji z pliku `.node-version` (instalacja przez fnm: `fnm install`)
- Git

Maven i Angular CLI nie wymagają instalacji globalnej. Backend używa Maven Wrappera (`./mvnw`), a front lokalnej wersji CLI z `node_modules` (`npx ng`).

## Uruchomienie

Backend (port 8080):

```bash
cd servicedesk-api
./mvnw spring-boot:run
```

Front (port 4200):

```bash
cd servicedesk-web
npm ci
npx ng serve
```

## Testy

```bash
cd servicedesk-api && ./mvnw verify
cd servicedesk-web && npx ng test --watch=false
```

## Zasady pracy

- gałąź `main` jest chroniona, zmiany trafiają do niej tylko przez pull request,
- nazwy gałęzi: `feature/<opis>`, `fix/<opis>`, `chore/<opis>`,
- komunikaty commitów według Conventional Commits, na przykład `feat(web): add ticket list`,
- PR wymaga przejścia CI i review.
