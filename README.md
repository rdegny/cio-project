# AI CIO

AI CIO is a personal investment intelligence platform for long-term portfolio monitoring, watchlists, research, alerts, reports, and future AI-assisted analysis.

This repository currently contains the Batch 1 Next.js foundation only. It intentionally does not include Prisma, database schema, authentication, market data, AI providers, N8N workflows, or email delivery yet.

## Stack

- Next.js
- TypeScript
- React
- Tailwind CSS

## Local Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy the example environment file:

   ```bash
   cp .env.example .env.local
   ```

3. Start the local app:

   ```bash
   pnpm dev
   ```

4. Open `http://localhost:3000`.

## Useful Commands

```bash
pnpm dev
pnpm typecheck
pnpm lint
pnpm build
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
