# AI CIO Decision Log

Version: 0.2  
Document Status: Living Architecture Record  
Related Constitution: `/docs/00_PRODUCT_CONSTITUTION.md`  
Related Architecture Overview: `/docs/01_ARCHITECTURE_OVERVIEW.md`  
Related Domain Map: `/docs/02_DOMAIN_MAP.md`  
Related Database Schema: `/docs/03_DATABASE_SCHEMA.md`

---

# 1. Purpose

This document records major architecture, product, data, hosting, provider, and workflow decisions for the AI CIO project.

Codex must update this file when making or implementing major decisions.

This file should be treated as a living record. If a decision changes later, do not silently delete the old decision. Mark it as replaced and add a new decision explaining what changed and why.

---

# 2. Decision Template

Use this template for future decisions:

```text
# Decision [number]: [Title]

Date:
Status: Proposed / Accepted / Rejected / Replaced

Decision:

Context:

Options considered:

Chosen option:

Reason:

Consequences:

Follow-up needed:
```

---

# 3. Decision Status Definitions

```text
Proposed:
A likely direction, but not locked yet.

Accepted:
The current official decision.

Rejected:
A considered option that will not be used.

Replaced:
An older decision that has been replaced by a newer decision.
```

---

# 4. Decision 001: Use Product Constitution as Highest-Level Source of Truth

Date: 2026-06-26  
Status: Accepted

Decision:

AI CIO will use `/docs/00_PRODUCT_CONSTITUTION.md` as the highest-level project document.

Context:

The project will be built over many Codex sessions. It needs stable rules, boundaries, and product principles so implementation does not drift over time.

Options considered:

- No central document
- Separate feature docs only
- One Product Constitution with supporting architecture docs

Chosen option:

Use one Product Constitution plus supporting architecture documents.

Reason:

This reduces context loss and keeps Codex work consistent across many prompts, branches, and review loops.

Consequences:

Every Codex session should read the Product Constitution before coding.

Follow-up needed:

Keep the constitution updated as major product rules evolve.

---

# 5. Decision 002: Use Modular Domain-Based Architecture

Date: 2026-06-26  
Status: Accepted

Decision:

AI CIO will be organized around domains such as Portfolio, Transactions, Watchlists, Market Data, AI Analysis, Reports, Alerts, Notifications, Risk, Themes, and Automation.

Context:

The project will become complex if features are built randomly or only around pages. Domain boundaries will help prevent the app from becoming a tangled codebase.

Options considered:

- Page-based architecture only
- Domain-based architecture
- Single service layer with no domain separation

Chosen option:

Domain-based architecture.

Reason:

This creates cleaner ownership, safer service boundaries, easier testing, and easier long-term maintenance.

Consequences:

Codex must identify affected domains before making code changes.

Follow-up needed:

Refine `/docs/02_DOMAIN_MAP.md` as implementation begins and domain boundaries become more concrete.

---

# 6. Decision 003: Use PostgreSQL and Prisma

Date: 2026-06-26  
Status: Accepted

Decision:

Use PostgreSQL as the database and Prisma as the ORM.

Context:

The app needs structured, durable, relational financial data for portfolios, transactions, holdings, watchlists, alerts, reports, AI analysis records, and automation logs.

Options considered:

- PostgreSQL + Prisma
- Supabase-only client model
- MongoDB
- SQLite
- Raw SQL

Chosen option:

PostgreSQL + Prisma.

Reason:

PostgreSQL is a strong fit for relational investment records. Prisma gives type-safe database access from TypeScript and works well with a Next.js application.

Consequences:

The project will need schema planning, migrations, and database hosting.

Follow-up needed:

Finalize the database hosting provider.

---

# 7. Decision 004: Use Provider Adapters

Date: 2026-06-26  
Status: Accepted

Decision:

External APIs must be wrapped in provider adapters.

Context:

Market data, news, AI, filings, email, and other providers may change over time because of cost, reliability, rate limits, or better alternatives.

Options considered:

- Direct calls from features
- Central provider adapters

Chosen option:

Central provider adapters.

Reason:

Provider adapters prevent vendor lock-in, keep UI and business logic clean, and make providers easier to replace later.

Consequences:

The project will require slightly more upfront structure, but future provider swaps will be safer.

Follow-up needed:

Create provider interfaces during implementation.

---

# 8. Decision 005: No Automatic Trade Execution in Early Versions

Date: 2026-06-26  
Status: Accepted

Decision:

AI CIO will not execute trades automatically in MVP or early versions.

Context:

The app is designed for research, monitoring, alerts, and decision support. It should help the user think clearly but should not control brokerage activity.

Options considered:

- Read-only decision support
- Broker integration with read access
- Full trade execution

Chosen option:

Read-only decision support.

Reason:

This is safer, simpler, and aligned with the Product Constitution. The user should remain responsible for all buy, sell, hold, or ignore decisions.

Consequences:

The app may generate analysis, alerts, reports, and suggested research actions, but it must not automatically buy or sell securities.

Follow-up needed:

Any future broker integration requires a separate security review and architecture decision.

---

# 9. Decision 006: Use Next.js + TypeScript as the Initial App Stack

Date: 2026-06-26  
Status: Accepted

Decision:

Use Next.js with TypeScript as the initial full-stack application framework.

Context:

AI CIO needs a dashboard, protected pages, server-side logic, API routes, webhook endpoints, and a structure that can grow without needing a separate backend immediately.

Options considered:

- Next.js + TypeScript
- React frontend with separate Node/Express backend
- Python backend with separate frontend
- No-code dashboard tools
- Mobile-first app

Chosen option:

Next.js + TypeScript.

Reason:

Next.js supports frontend pages, backend API routes, server actions, and strong deployment options. TypeScript improves safety for financial data, API contracts, services, and provider adapters.

Consequences:

The initial application will be built as a TypeScript Next.js project.

Follow-up needed:

Codex should create the app foundation in a small batch and avoid adding unrelated features during initial setup.

---

# 10. Decision 007: Use Tailwind CSS for Initial Styling

Date: 2026-06-26  
Status: Accepted

Decision:

Use Tailwind CSS as the initial styling system.

Context:

AI CIO needs a clean, professional, responsive dashboard UI. The project should avoid spending too much time building a custom design system before the MVP exists.

Options considered:

- Tailwind CSS
- Plain CSS modules
- Styled-components
- Material UI
- Chakra UI
- Shadcn/ui immediately

Chosen option:

Tailwind CSS.

Reason:

Tailwind works well with Next.js, is fast to build with, supports responsive layouts, and can later support a component system.

Consequences:

Initial UI components should use Tailwind classes and follow `/docs/08_UI_DESIGN_SYSTEM.md`.

Follow-up needed:

A component library such as shadcn/ui may be considered later, but should not be added silently.

---

# 11. Decision 008: Use Auth.js / NextAuth as the Initial Authentication Plan

Date: 2026-06-26  
Status: Accepted

Decision:

Use Auth.js / NextAuth as the initial authentication plan unless implementation testing reveals a strong reason to switch.

Context:

AI CIO needs protected user data, but the MVP does not need complex SaaS billing, organizations, or enterprise permissions.

Options considered:

- Auth.js / NextAuth
- Clerk
- Supabase Auth
- Custom authentication
- No authentication during MVP

Chosen option:

Auth.js / NextAuth.

Reason:

It fits the Next.js stack, avoids unnecessary paid dependencies early, and should be enough for a personal MVP.

Consequences:

Authentication implementation should remain simple at first. Advanced roles, organizations, billing, and multi-tenant logic should be deferred.

Follow-up needed:

Confirm exact provider strategy during implementation. If Auth.js causes friction, record a new decision before switching.

---

# 12. Decision 009: Use OpenAI Through an Internal AI Provider Adapter

Date: 2026-06-26  
Status: Accepted

Decision:

Use OpenAI as the initial AI provider, but only through an internal AI provider adapter.

Context:

AI CIO needs AI-generated summaries, reports, analysis, and agent-style reasoning. However, the code should not be tightly coupled to one AI provider.

Options considered:

- OpenAI direct calls throughout app
- OpenAI through internal adapter
- Anthropic through internal adapter
- OpenRouter through internal adapter
- Local models

Chosen option:

OpenAI through an internal AI provider adapter.

Reason:

OpenAI is a strong initial provider, but the adapter pattern keeps the app model-agnostic and makes future provider changes easier.

Consequences:

No UI component or feature service should call OpenAI directly. AI calls should route through `AIAnalysisService` and an `AIProvider` adapter.

Follow-up needed:

Create AI provider interface and prompt versioning when AI features begin.

---

# 13. Decision 010: Delay N8N Until Core App Services Exist

Date: 2026-06-26  
Status: Accepted

Decision:

Do not implement N8N workflows immediately. Build the core app services first, then connect N8N later through secure webhook endpoints.

Context:

N8N is useful for scheduled workflows such as morning briefs, market close reports, watchlist checks, and weekly reviews. However, N8N needs stable app endpoints and services to call.

Options considered:

- Start with N8N first
- Build N8N and app together
- Build app services first, then add N8N

Chosen option:

Build app services first, then add N8N.

Reason:

This reduces complexity and prevents workflows from being built on unstable service contracts.

Consequences:

Early MVP work should focus on the Next.js app, database, auth, portfolio, watchlist, and service boundaries. Automation comes later.

Follow-up needed:

When adding N8N, follow `/docs/07_AUTOMATION_WORKFLOWS.md` and secure webhooks with `N8N_WEBHOOK_SECRET`.

---

# 14. Decision 011: Defer Production Hosting Until Local MVP Works

Date: 2026-06-26  
Status: Accepted

Decision:

Do not finalize production hosting before the local MVP foundation is working.

Context:

The project has multiple possible hosting paths, including Vercel, Railway, Supabase, Neon, Render, Hostinger VPS, or a hybrid setup.

Options considered:

- Choose hosting before app setup
- Build local MVP first, then choose hosting
- Host everything on one VPS immediately

Chosen option:

Build local MVP first, then choose hosting.

Reason:

The app architecture should be validated locally before committing to deployment infrastructure. This avoids paying for services too early or choosing a platform before the app’s needs are clear.

Consequences:

Hosting remains open for now. The app should still be built in a deployable way.

Follow-up needed:

Revisit hosting after the app foundation, database setup, and authentication are working locally.

---

# 15. Decision 012: Use GitHub as the Source-Control System

Date: 2026-06-26  
Status: Accepted

Decision:

Use GitHub as the source-control system for AI CIO.

Context:

The project will involve many Codex changes, documentation updates, architecture revisions, and code review loops.

Options considered:

- Local files only
- GitHub private repo
- Other Git provider

Chosen option:

GitHub private repository.

Reason:

GitHub provides version history, rollback, branches, pull requests, and a clean workflow for reviewing Codex changes.

Consequences:

All project files and documentation should be committed to GitHub. Secrets must never be committed.

Follow-up needed:

Use `.gitignore` and keep `.env` files out of the repo.

---

# 16. Decision 013: Use Small Codex Batches and Review Loops

Date: 2026-06-26  
Status: Accepted

Decision:

Codex work will be done in small implementation batches, followed by review loops.

Context:

Large AI-generated code prompts increase the risk of broken features, hidden architecture changes, and hard-to-review diffs.

Options considered:

- Large all-in-one prompts
- Small controlled batches
- Manual coding only

Chosen option:

Small controlled Codex batches with ChatGPT review.

Reason:

Small batches make changes easier to understand, test, document, and roll back.

Consequences:

Codex should not build large feature sets in a single prompt. Each batch should have clear scope, affected files, expected behavior, testing steps, and documentation updates.

Follow-up needed:

Follow `/docs/15_CODEX_WORKFLOW.md` for every Codex session.

---

# 17. Decision 014: Use Transactions as the Source of Truth for Portfolio History

Date: 2026-06-26  
Status: Accepted

Decision:

Transactions will be the source of truth for portfolio history.

Context:

Portfolio holdings, gains/losses, and allocation need to be traceable back to user-entered activity.

Options considered:

- Store only current holdings
- Store transactions only and calculate everything live
- Use transactions as source of truth and store derived current holdings

Chosen option:

Use transactions as source of truth and store derived current holdings when useful.

Reason:

Transactions preserve history and auditability. Derived holdings can improve dashboard performance without replacing the transaction record.

Consequences:

PortfolioHolding may exist as a derived current-state table, but Transaction remains the historical source of truth.

Follow-up needed:

When implementing Prisma models, ensure this decision is reflected in schema design and service logic.

---

# 18. Decision 015: Start With Manual Portfolio and Watchlist Data Entry

Date: 2026-06-26  
Status: Accepted

Decision:

Start with manual entry for portfolio transactions and watchlist items.

Context:

Brokerage integrations are complex and create security concerns. The MVP should prove the core workflow before connecting to brokers.

Options considered:

- Manual entry
- CSV import
- Brokerage read-only connection
- Brokerage trading connection

Chosen option:

Manual entry first.

Reason:

Manual entry is simple, safe, and enough to validate the dashboard, reports, alerts, and AI workflow.

Consequences:

The MVP will require the user to enter transactions and watchlist items manually.

Follow-up needed:

CSV import and read-only brokerage integration can be considered later.

---

# 19. Open Decisions

The following decisions still need to be made:

```text
Database hosting provider
Production app hosting provider
Initial market data provider
Initial email provider
Initial news provider
Initial fundamentals provider
Initial N8N hosting setup
Whether to add shadcn/ui later
Whether to support CSV import in Version 2
Market data cache timing
Portfolio snapshot frequency
```

---

# 20. Deferred Decisions

These decisions are intentionally deferred:

```text
Brokerage integration
Automatic trade execution
Options support
Crypto support
SMS/push notifications
Advanced tax reporting
Multi-user SaaS billing
Paid institutional data providers
Native mobile app
```

---

# 21. Decision 016: Use Prisma CUIDs for Initial Database IDs

Date: 2026-06-27  
Status: Accepted

Decision:

Use Prisma `cuid()` string IDs for the initial database models.

Context:

The first Prisma schema batch needs consistent primary keys for `User`, `UserSettings`, `Portfolio`, and `Company`. The database schema document left the ID strategy open between cuid, uuid, and database-generated uuid.

Options considered:

- Prisma `cuid()` string IDs
- Prisma `uuid()` string IDs
- Database-generated UUIDs

Chosen option:

Use Prisma `cuid()` string IDs.

Reason:

This keeps IDs application-generated, simple to use in Prisma, and consistent with the documentation's string ID recommendation. It also avoids introducing database extensions during the first schema foundation batch.

Consequences:

Initial models use `String @id @default(cuid())`. A future change to UUIDs would require an explicit migration plan.

Follow-up needed:

Keep future Prisma models consistent with this ID strategy unless a later decision replaces it.

---

# 22. Decision 017: Use Local Credentials for Initial Auth Foundation

Date: 2026-06-28
Status: Accepted

Decision:

Use Auth.js / NextAuth with a simple local credentials provider for the initial authentication foundation.

Context:

AI CIO needs protected routes and a stable `userId` before user-owned portfolio data is implemented. The project has accepted Auth.js / NextAuth as the initial authentication plan, but exact provider configuration was still open. This batch should not add external OAuth provider integrations or real provider secrets.

Options considered:

- Auth.js / NextAuth with local credentials
- Auth.js / NextAuth with OAuth provider
- Prisma adapter with full Auth.js account/session tables
- Custom authentication

Chosen option:

Auth.js / NextAuth with local credentials stored in environment variables for local development.

Reason:

This keeps the authentication foundation small, avoids real OAuth secrets, avoids extra provider integrations, and still creates a durable `User` record for future `userId` scoping.

Consequences:

Protected app routes require sign-in. Successful local sign-in creates or reuses a `User` record and ensures a `UserSettings` record exists. This is not a final production auth provider strategy.

Follow-up needed:

Before production deployment, replace or harden the provider strategy and record any replacement decision.

---

# 23. Final Principle

If a decision affects architecture, cost, security, database schema, provider choice, user control, or Codex workflow, record it here.

The goal is not to make every decision immediately. The goal is to make important decisions explicit so the project remains understandable as it grows.
