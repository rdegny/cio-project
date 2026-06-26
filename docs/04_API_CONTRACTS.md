# AI CIO API Contracts

Version: 0.1  
Document Status: Foundation Architecture  
Related Constitution: `/docs/00_PRODUCT_CONSTITUTION.md`

---

# 1. Purpose

This document defines the expected internal API contracts for AI CIO.

It guides Codex when creating server actions, API routes, webhook endpoints, and service responses.

The goal is to keep frontend, backend services, N8N workflows, and AI/report generation consistent.

---

# 2. API Philosophy

AI CIO should prefer clear internal contracts over ad hoc data passing.

The UI should not talk directly to external providers.

Correct pattern:

```text
Frontend / Server Action
→ Internal Service
→ Provider Adapter
→ External API
```

API responses should be predictable, typed, and safe for the UI.

---

# 3. API Style

Initial recommendation:

```text
Next.js Server Actions for app-owned UI mutations
Next.js API routes for webhooks and external integrations
Typed service functions for internal app logic
```

Future versions may introduce a separate backend, but the service contracts should remain similar.

---

# 4. Standard Response Shape

Internal API routes should usually return:

```ts
type ApiResponse<T> = {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
};
```

Do not expose secrets, provider tokens, raw stack traces, or sensitive internal details in API responses.

---

# 5. Error Codes

Suggested error code examples:

```text
UNAUTHORIZED
FORBIDDEN
VALIDATION_ERROR
NOT_FOUND
CONFLICT
RATE_LIMITED
PROVIDER_ERROR
AI_PROVIDER_ERROR
DATABASE_ERROR
UNKNOWN_ERROR
```

---

# 6. Authentication Requirements

Most routes require an authenticated user.

Public routes should be intentionally documented.

Protected resources must be scoped by `userId`.

A user should not be able to access another user's portfolio, watchlist, report, alert, AI analysis, or notification.

---

# 7. Portfolio Contracts

## Get Portfolio Summary

Purpose:

Return portfolio-level summary for dashboard and portfolio page.

Possible route:

```text
GET /api/portfolio/:portfolioId/summary
```

Response data:

```ts
type PortfolioSummary = {
  portfolioId: string;
  name: string;
  totalMarketValue: string;
  totalCostBasis?: string;
  totalGainLoss?: string;
  totalGainLossPct?: string;
  currency: string;
  holdingsCount: number;
  updatedAt: string;
};
```

## Create Transaction

Possible route or server action:

```text
POST /api/portfolio/:portfolioId/transactions
```

Request:

```ts
type CreateTransactionInput = {
  tickerSymbol: string;
  type: "BUY" | "SELL" | "DIVIDEND" | "ADJUSTMENT";
  tradeDate: string;
  quantity: string;
  price?: string;
  fees?: string;
  currency?: string;
  notes?: string;
};
```

Response:

```ts
type CreateTransactionResult = {
  transactionId: string;
  portfolioId: string;
};
```

Rules:

- Validate ticker, type, date, quantity, and money fields.
- Recalculate derived holdings after transaction changes.
- Do not silently overwrite transaction history.

---

# 8. Watchlist Contracts

## List Watchlists

```text
GET /api/watchlists
```

Response:

```ts
type WatchlistSummary = {
  id: string;
  name: string;
  description?: string;
  itemCount: number;
  isDefault: boolean;
};
```

## Add Watchlist Item

```text
POST /api/watchlists/:watchlistId/items
```

Request:

```ts
type AddWatchlistItemInput = {
  tickerSymbol: string;
  targetBuyPrice?: string;
  targetSellPrice?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  notes?: string;
};
```

Rules:

- Do not duplicate the same ticker in the same watchlist unless deliberately supported.
- Market data should be retrieved through MarketDataService, not from the UI.

---

# 9. Market Data Contracts

## Get Latest Quote

```text
GET /api/market/quote/:tickerSymbol
```

Response:

```ts
type LatestQuote = {
  tickerSymbol: string;
  price: string;
  previousClose?: string;
  change?: string;
  changePct?: string;
  currency: string;
  asOf: string;
  provider?: string;
  cached: boolean;
};
```

Rules:

- The route should call MarketDataService.
- MarketDataService should call a provider adapter.
- Cache data when appropriate.

---

# 10. Company Research Contracts

## Get Company Overview

```text
GET /api/research/company/:tickerSymbol
```

Response:

```ts
type CompanyOverview = {
  companyId?: string;
  tickerSymbol: string;
  name?: string;
  exchange?: string;
  sector?: string;
  industry?: string;
  country?: string;
  description?: string;
  latestQuote?: LatestQuote;
};
```

---

# 11. Theme Contracts

## List Themes

```text
GET /api/themes
```

Response:

```ts
type ThemeSummary = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CORE";
  companyCount: number;
};
```

## Link Company to Theme

```text
POST /api/themes/:themeId/companies
```

Request:

```ts
type LinkCompanyToThemeInput = {
  tickerSymbol: string;
  conviction?: "LOW" | "MEDIUM" | "HIGH" | "CORE";
  notes?: string;
};
```

---

# 12. Alert Contracts

## List Alerts

```text
GET /api/alerts
```

Query options:

```text
status
severity
tickerSymbol
limit
```

Response:

```ts
type AlertSummary = {
  id: string;
  type: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "NEW" | "READ" | "DISMISSED" | "ARCHIVED";
  title: string;
  message: string;
  tickerSymbol?: string;
  triggeredAt: string;
};
```

## Update Alert Status

```text
PATCH /api/alerts/:alertId
```

Request:

```ts
type UpdateAlertInput = {
  status: "READ" | "DISMISSED" | "ARCHIVED";
};
```

---

# 13. Report Contracts

## List Reports

```text
GET /api/reports
```

Response:

```ts
type ReportSummary = {
  id: string;
  type: string;
  status: string;
  title: string;
  summary?: string;
  generatedAt: string;
  readAt?: string;
};
```

## Get Report

```text
GET /api/reports/:reportId
```

Response:

```ts
type ReportDetail = {
  id: string;
  type: string;
  status: string;
  title: string;
  summary?: string;
  body: string;
  metadata?: unknown;
  generatedAt: string;
};
```

---

# 14. AI Analysis Contracts

AI endpoints should usually be internal and protected.

## Generate Company Analysis

```text
POST /api/ai/company-analysis
```

Request:

```ts
type GenerateCompanyAnalysisInput = {
  tickerSymbol: string;
  analysisType?: "GENERAL" | "VALUATION" | "RISK" | "EARNINGS";
};
```

Response:

```ts
type GenerateCompanyAnalysisResult = {
  aiAnalysisId: string;
  outputText: string;
  agentRole: string;
  createdAt: string;
};
```

Rules:

- AI should receive structured service data.
- Do not let AI fetch unsupported random data directly.
- Store useful AI outputs.

---

# 15. Automation / N8N Webhook Contracts

Webhook routes should require a secret or signature.

## Trigger Morning Brief

```text
POST /api/webhooks/n8n/morning-brief
```

Headers:

```text
x-ai-cio-webhook-secret
```

Request:

```ts
type MorningBriefWebhookInput = {
  userId?: string;
  portfolioId?: string;
  dryRun?: boolean;
};
```

Response:

```ts
type MorningBriefWebhookResult = {
  automationRunId: string;
  reportId?: string;
  status: "QUEUED" | "SUCCESS" | "FAILED" | "PARTIAL_SUCCESS";
};
```

Rules:

- Log every automation run.
- Do not fail silently.
- Validate webhook secrets.
- Avoid exposing internal errors to N8N responses.

---

# 16. Validation Rules

Codex should use shared validators for:

- ticker symbols
- decimal strings
- dates
- enum values
- pagination
- user-owned IDs
- webhook secrets

Recommended future location:

```text
/lib/validators
```

---

# 17. Pagination

List endpoints should support pagination where needed.

Suggested query fields:

```text
limit
cursor
```

Response:

```ts
type PaginatedResponse<T> = {
  items: T[];
  nextCursor?: string;
};
```

---

# 18. API Contract Update Rule

If Codex changes any endpoint, request shape, response shape, or error behavior, it must update this file.

---

# 19. Final Principle

API contracts should make the system predictable.

The frontend, services, automations, and AI workflows should all know what shape of data to expect.
