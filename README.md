# AI CIO

AI CIO is a personal investment intelligence platform for long-term portfolio monitoring, watchlists, research, alerts, reports, and future AI-assisted analysis.

This repository currently contains the initial Next.js foundation, Prisma database foundation, and local Auth.js / NextAuth foundation. It intentionally does not include portfolio features, market data, AI providers, N8N workflows, or email delivery yet.

## Stack

- Next.js
- TypeScript
- React
- Tailwind CSS
- Prisma
- PostgreSQL
- Auth.js / NextAuth

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

5. Add local auth values to `.env.local`:

   ```env
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="replace-with-generated-local-secret"
   AUTH_LOCAL_EMAIL="you@example.com"
   AUTH_LOCAL_PASSWORD="replace-with-local-login-password"
   ```

   Generate a local secret with:

   ```bash
   openssl rand -base64 32
   ```

6. Generate the Prisma client:

   ```bash
   pnpm prisma:generate
   ```

7. Apply the first local database migration:

   ```bash
   pnpm prisma:migrate:dev
   ```

8. Start the local app:

   ```bash
   pnpm dev
   ```

9. Open `http://localhost:3000`.

## Useful Commands

```bash
pnpm dev
pnpm prisma:generate
pnpm prisma:validate
pnpm prisma:migrate:dev
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

## Database Foundation

Prisma is configured for PostgreSQL in `prisma/schema.prisma`.

The current schema foundation includes:

- `User`
- `UserSettings`
- `Portfolio`
- `Company`
- `Transaction`
- `PortfolioHolding`

Transactions are the source of truth for portfolio history. `PortfolioHolding` is derived current state and can be recomputed from transaction history.

Portfolio calculation tests can be run with:

```bash
pnpm test
```

## Authentication Foundation

Main app routes are protected by NextAuth middleware:

- `/dashboard`
- `/portfolio`
- `/watchlist`
- `/research`
- `/themes`
- `/alerts`
- `/reports`
- `/settings`

The initial local auth flow uses a simple credentials provider backed by `AUTH_LOCAL_EMAIL` and `AUTH_LOCAL_PASSWORD` in `.env.local`. On successful sign-in, the app creates or reuses the matching `User` record and ensures a `UserSettings` record exists.

This is an MVP local-development auth foundation. Do not commit real auth secrets.

## Database Troubleshooting

If `pnpm prisma:migrate:dev` fails with `P1001: Can't reach database server at localhost:5432`, PostgreSQL is not running or is not listening on port `5432`. Start your local PostgreSQL service, then retry the command.

If migration fails with an authentication error, the username or password in `.env.local` does not match your local PostgreSQL user.

If migration fails because the database does not exist, create the `ai_cio` database first or update `DATABASE_URL` to point at an existing local development database.

If you change `DATABASE_URL`, rerun:

```bash
pnpm prisma:validate
pnpm prisma:migrate:dev
```

## Auth Troubleshooting

If sign-in fails, confirm `AUTH_LOCAL_EMAIL` and `AUTH_LOCAL_PASSWORD` exist in `.env.local` and match the values entered on `/login`.

If NextAuth reports a missing secret, set `NEXTAUTH_SECRET` in `.env.local` and restart `pnpm dev`.

If protected routes keep redirecting to `/login`, confirm cookies are enabled and `NEXTAUTH_URL` matches the local URL you are using.

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
