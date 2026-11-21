# GK Atlas

GK Atlas is a dark-first AI model discovery and intelligence platform built with Next.js, React, TypeScript, Tailwind CSS, PostgreSQL, and Prisma.

## Features

- Database-backed model discovery
- Search, company filtering, and sorting
- Dynamic model detail pages
- Side-by-side comparison for up to three models
- AI lab and inference provider directories
- Rankings and benchmark charts
- REST-style API routes
- Zod query validation
- Explicit demonstration-data disclosures

## Requirements

- Node.js 20 or later
- A PostgreSQL database, such as Neon

## Setup

```powershell
npm install
Copy-Item .env.example .env
```

Set `DATABASE_URL` and optional `DIRECT_URL` in `.env`, then run:

```powershell
npx prisma generate
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

For a first migration against a new database:

```powershell
npm run db:migrate
npm run db:seed
```

## Database

The Prisma schema contains companies, providers, models, model-provider relationships, pricing records, capabilities, benchmarks, and model benchmark scores. Monetary values use PostgreSQL `Decimal` fields.

Generated seed benchmark and pricing values are demonstration data. Provider availability marked without verification must not be interpreted as externally verified availability.

## API

- `GET /api/models`
- `GET /api/models/[id]`
- `GET /api/companies`
- `GET /api/companies/[id]`
- `GET /api/providers`
- `GET /api/providers/[id]`
- `GET /api/benchmarks`
- `GET /api/rankings`
- `GET /api/search?q=...`
- `GET /api/compare?ids=model-slug,other-slug`

API responses use `{ data, error }`. Validation and database failures return appropriate HTTP status codes.

## Validation

```powershell
npm run lint
npm run build
```

## Deployment

Deploy to Vercel and configure `DATABASE_URL`, `DIRECT_URL`, and `NEXT_PUBLIC_APP_URL`. Run migrations and seed only against the intended database.
