# AI CIO

AI CIO is a personal investment intelligence platform for long-term portfolio monitoring, watchlists, research, alerts, reports, and future AI-assisted analysis.

This repository currently contains the initial Next.js foundation and the Prisma database foundation. It intentionally does not include authentication, portfolio features, market data, AI providers, N8N workflows, or email delivery yet.

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

3. Start a local PostgreSQL database.

   Native Postgres option:

   - Install PostgreSQL locally.
   - Start the PostgreSQL service.
   - Create a database named `ai_cio`.

   Docker option:

   ```bash
   docker run --name ai-cio-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ai_cio -p 5432:5432 -d postgres:16
   ```

4. Update `DATABASE_URL` in `.env.local` for your local PostgreSQL database:

   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_cio?schema=public"
   ```

5. Generate the Prisma client:

   ```bash
   pnpm prisma:generate
   ```

6. Apply the first local database migration:

   ```bash
   pnpm prisma:migrate:dev
   ```

7. Start the local app:

   ```bash
   pnpm dev
   ```

8. Open `http://localhost:3000`.

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

The first migration lives at `prisma/migrations/20260628000100_initial_foundation/migration.sql`.

## Database Troubleshooting

If `pnpm prisma:migrate:dev` fails with `P1001: Can't reach database server at localhost:5432`, PostgreSQL is not running or is not listening on port `5432`. Start your local PostgreSQL service, then retry the command.

If migration fails with an authentication error, the username or password in `.env.local` does not match your local PostgreSQL user.

If migration fails because the database does not exist, create the `ai_cio` database first or update `DATABASE_URL` to point at an existing local development database.

If you change `DATABASE_URL`, rerun:

```bash
pnpm prisma:validate
pnpm prisma:migrate:dev
```

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
- Keep `.env.local` uncommitted.
