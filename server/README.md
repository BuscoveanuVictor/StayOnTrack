# StayOnTrack API – MVC

## Setup
1. `cp .env.example .env.development`
2. `npm run dev`

## Endpoints (compatibile)
- GET /auth/test
- GET /auth/google
- GET /auth/google/callback
- GET /auth/google/logout
- GET /auth/check
- GET /auth/password-status

- GET /rules
- POST /rules
- POST /rules/update
- POST /rules/validate-password

- GET /block-list.json
- POST /block-list/update
- POST /block-list/add-domain

- GET /allow-list.json
- POST /allow-list/update
- POST /allow-list/add-domain

- GET /task-list.json
- POST /task-list/update

## Structura MVC
- **Models**: Schema-uri Mongoose
- **Controllers**: Logica de business
- **Routes**: Definirea rutelor
- **Middlewares**: Autentificare si validare
- **Repositories**: Acces la baza de date
- **Utils**: Utilitare (hash parola, etc.)
