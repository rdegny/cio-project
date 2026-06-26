# AI CIO Decision Log

Version: 0.1  
Document Status: Living Architecture Record  
Related Constitution: `/docs/00_PRODUCT_CONSTITUTION.md`

---

# 1. Purpose

This document records major architecture, product, data, hosting, and provider decisions.

Codex must update this file when making or implementing major decisions.

---

# 2. Decision Template

Use this template:

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

# 3. Decision 001: Use Product Constitution as Highest-Level Source of Truth

Date: TBD  
Status: Accepted

Decision:

AI CIO will use `/docs/00_PRODUCT_CONSTITUTION.md` as the highest-level project document.

Context:

The project will be built over many Codex sessions. It needs stable rules and boundaries.

Options considered:

- No central document
- Separate feature docs only
- One Product Constitution with supporting architecture docs

Chosen option:

Use one Product Constitution plus supporting architecture docs.

Reason:

This reduces context loss and keeps Codex work consistent.

Consequences:

Every Codex session should read the Product Constitution before coding.

Follow-up needed:

Keep the constitution updated as major product rules evolve.

---

# 4. Decision 002: Use Modular Domain-Based Architecture

Date: TBD  
Status: Proposed

Decision:

AI CIO should be organized around domains such as Portfolio, Watchlists, Market Data, AI Analysis, Reports, Alerts, and Automation.

Context:

The project will become complex if features are built randomly.

Options considered:

- Page-based architecture only
- Domain-based architecture
- Single service layer with no domain separation

Chosen option:

Domain-based architecture.

Reason:

Cleaner boundaries and easier maintenance.

Consequences:

Codex must identify affected domains before code changes.

Follow-up needed:

Refine `/docs/02_DOMAIN_MAP.md` as implementation begins.

---

# 5. Decision 003: Use PostgreSQL and Prisma

Date: TBD  
Status: Proposed

Decision:

Use PostgreSQL as the database and Prisma as the ORM.

Context:

The app needs structured, durable, relational financial data.

Options considered:

- PostgreSQL + Prisma
- Supabase-only client model
- MongoDB
- SQLite
- Raw SQL

Chosen option:

PostgreSQL + Prisma.

Reason:

Strong fit for relational records, transactions, reports, alerts, and TypeScript.

Consequences:

Requires schema planning and migrations.

Follow-up needed:

Finalize database hosting provider.

---

# 6. Decision 004: Use Provider Adapters

Date: TBD  
Status: Accepted

Decision:

External APIs must be wrapped in provider adapters.

Context:

Market data, news, AI, email, and filing providers may change.

Options considered:

- Direct calls from features
- Central provider adapters

Chosen option:

Central provider adapters.

Reason:

Prevents vendor lock-in and keeps UI/business logic clean.

Consequences:

More upfront structure, easier replacement later.

Follow-up needed:

Create provider interfaces during implementation.

---

# 7. Decision 005: No Automatic Trade Execution in Early Versions

Date: TBD  
Status: Accepted

Decision:

AI CIO will not execute trades automatically in MVP or early versions.

Context:

The app is for research and decision support.

Options considered:

- Read-only decision support
- Broker integration with read access
- Full trade execution

Chosen option:

Read-only decision support.

Reason:

Safer, simpler, and aligned with the product constitution.

Consequences:

The user remains responsible for all investment decisions.

Follow-up needed:

Future broker integrations require separate security review.

---

# 8. Open Decisions

The following decisions still need to be made:

```text
Hosting provider
Database hosting provider
Authentication provider
Initial market data provider
Initial AI provider
Initial email provider
Initial N8N deployment setup
ID strategy for database models
Portfolio holding calculation/storage strategy
```

---

# 9. Final Principle

If a decision affects architecture, cost, security, database schema, provider choice, or user control, record it here.
