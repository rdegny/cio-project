# AI CIO

AI CIO is a personal investment intelligence platform for long-term portfolio monitoring, watchlists, research, alerts, reports, and future AI-assisted analysis.

This repository currently contains the initial Next.js foundation and the Batch 2 Prisma database foundation. It intentionally does not include authentication, portfolio features, market data, AI providers, N8N workflows, or email delivery yet.

## Stack

- Next.js
- TypeScript
- React
- Tailwind CSS
- Prisma
- PostgreSQL

## Local Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy the example environment file:

   ```bash
   cp .env.example .env.local
   ```

3. Update `DATABASE_URL` in `.env.local` for your local PostgreSQL database.

4. Generate the Prisma client:

   ```bash
   pnpm prisma:generate
   ```

5. Start the local app:

   ```bash
   pnpm dev
   ```

6. Open `http://localhost:3000`.

## Useful Commands

```bash
pnpm dev
pnpm prisma:generate
pnpm prisma:validate
pnpm prisma:migrate:dev
pnpm typecheck
pnpm lint
pnpm build
```

## Database Foundation

Prisma is configured for PostgreSQL in `prisma/schema.prisma`.

The first schema batch includes only:

- `User`
- `UserSettings`
- `Portfolio`
- `Company`

Transactions remain the planned source of truth for portfolio history, but the `Transaction` model is intentionally deferred to a later batch.

## Current Routes

- `/dashboard`
- `/portfolio`
- `/watchlist`
- `/research`
- `/themes`
- `/alerts`
- `/reports`
- `/settings`

## Notes

- Keep real secrets out of Git.
- Use `.env.example` for safe placeholder values only.
- Preserve the `/docs` folder as the architecture source of truth.
- Do not run `pnpm prisma:migrate:dev` until `DATABASE_URL` points at a real local development database.
