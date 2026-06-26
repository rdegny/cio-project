# AI CIO Cost Model

Version: 0.1  
Document Status: Foundation Architecture  
Related Constitution: `/docs/00_PRODUCT_CONSTITUTION.md`

---

# 1. Purpose

This document tracks expected AI CIO operating costs.

It helps prevent the project from becoming expensive before it becomes useful.

---

# 2. Cost Philosophy

AI CIO should be affordable for an individual investor.

Prefer:

- free tiers where reasonable
- caching
- batch updates
- scheduled workflows
- provider abstraction
- self-hosting where practical
- paid upgrades only when they clearly improve the product

Avoid:

- expensive institutional data too early
- unnecessary AI calls
- polling APIs constantly
- paying for unused services

---

# 3. Cost Categories

Main cost categories:

```text
App hosting
Database hosting
N8N hosting
AI API usage
Market data API
News API
Email provider
Domain name
Monitoring/logging
Backups
```

---

# 4. Expected MVP Monthly Cost Range

Rough target:

```text
$0 to $30 per month for early MVP
```

Possible early setup:

```text
GitHub private repo: $0
Vercel/Railway app hosting: $0-$10+
Supabase/Neon/Railway Postgres: $0-$10+
Hostinger VPS for N8N: around low monthly VPS cost
AI API: usage-based
Market data: free/low tier
Email: free/low tier
```

This file should be updated with actual provider costs once decisions are made.

---

# 5. AI Cost Control

AI calls should be controlled.

Use AI for:

- reports
- summaries
- major alerts
- research notes
- weekly reviews

Avoid AI for:

- every page load
- every price tick
- duplicate analysis
- data that simple code can calculate

Store AI outputs so they can be reused.

---

# 6. Market Data Cost Control

Reduce market data cost by:

- caching latest prices
- batching tickers
- avoiding unnecessary intraday polling
- checking high-priority watchlists more often than low-priority lists
- using delayed data where acceptable
- using provider abstraction

---

# 7. News Cost Control

Reduce news cost by:

- checking relevant tickers/themes only
- deduplicating articles
- storing article metadata
- summarizing only important news
- using RSS/free sources where practical

---

# 8. Email Cost Control

Reduce email cost and noise by:

- sending useful reports only
- avoiding duplicate emails
- grouping alerts when possible
- using in-app notifications for low-priority items

---

# 9. Upgrade Triggers

Upgrade services only when:

```text
Free tier is blocking useful functionality.
Rate limits create unreliable reports.
Data quality is too poor.
Manual time savings justify the cost.
The app is stable enough to benefit from better infrastructure.
```

---

# 10. Cost Tracking Table

Use this table as decisions are made:

| Service | Provider | Monthly Cost | Free Tier | Purpose | Upgrade Trigger |
|---|---|---:|---|---|---|
| App hosting | TBD | TBD | TBD | Host Next.js app | TBD |
| Database | TBD | TBD | TBD | PostgreSQL | TBD |
| N8N | TBD | TBD | TBD | Automation | TBD |
| AI | TBD | Usage-based | TBD | AI analysis | TBD |
| Market data | TBD | TBD | TBD | Prices/company data | TBD |
| News | TBD | TBD | TBD | News ingestion | TBD |
| Email | TBD | TBD | TBD | Email reports | TBD |

---

# 11. Final Principle

The project should earn complexity and cost slowly.

Do not pay for advanced infrastructure before the core workflow is useful.
