# AI CIO Architecture Overview

Version: 0.1  
Document Status: Foundation Architecture  
Related Constitution: `/docs/00_PRODUCT_CONSTITUTION.md`

---

# 1. Purpose of This Document

This document explains the high-level architecture of the AI CIO project.

It defines how the main parts of the system connect:

- Frontend
- Backend services
- Database
- External data providers
- AI services
- Automation workflows
- Notifications
- Documentation
- Deployment

Every Codex session must read this document before making architecture-level or feature-level changes.

This document does not define every table, API endpoint, or UI component in detail. Those details belong in separate documents.

---

# 2. System Goal

AI CIO is a personal investment intelligence platform.

The system helps the user:

- Track portfolio holdings
- Monitor watchlists
- Follow investment themes
- Read AI-generated market summaries
- Receive alerts
- Review company research
- Track important news, earnings, and filings
- Understand portfolio risk
- Make better long-term investment decisions

The system should behave like a calm, evidence-based investment assistant.

It should not behave like a trading bot, gambling tool, or automatic financial advisor.

---

# 3. High-Level System Architecture

The system should be organized into four major layers:

```text
Interface Layer
↓
Application Service Layer
↓
Data / Intelligence Layer
↓
External Provider Layer
```

## 3.1 Interface Layer

The user-facing application.

Responsible for:

- Dashboard pages
- Portfolio pages
- Watchlist pages
- Research pages
- Theme pages
- Alert pages
- Report pages
- Settings pages

The Interface Layer should display data and collect user input.

It should not directly contain important business logic.

## 3.2 Application Service Layer

The internal backend logic of the app.

Responsible for:

- Portfolio calculations
- Watchlist logic
- Alert rules
- Report generation
- User settings
- Data normalization
- Calling provider adapters
- Calling AI services
- Reading and writing database data

Most business logic should live here.

## 3.3 Data / Intelligence Layer

The stored and processed information.

Responsible for:

- Portfolio holdings
- Transactions
- Watchlists
- Market data cache
- Company data
- News metadata
- AI analysis
- Reports
- Alerts
- Automation logs

## 3.4 External Provider Layer

Third-party services used by the app.

Examples:

- Market data APIs
- News APIs
- SEC filing sources
- AI model APIs
- Email providers
- N8N webhooks
- Hosting providers

The app should not depend directly on one provider.

External services must be wrapped in internal provider adapters.

---

# 4. Recommended Initial Tech Stack

The initial stack should prioritize simplicity, affordability, and maintainability.

## 4.1 Frontend

Recommended:

```text
Next.js
TypeScript
React
Tailwind CSS
```

Reason:

- Strong full-stack support
- Good for dashboards
- Good TypeScript support
- Easy deployment options
- Works well with server actions and API routes

## 4.2 Backend

Initial backend:

```text
Next.js Server Actions / API Routes
TypeScript services
```

Reason:

- Keeps the MVP simple
- Avoids needing a separate backend server too early
- Allows the app to grow into a separate backend later if needed

## 4.3 Database

Recommended:

```text
PostgreSQL
Prisma ORM
```

Reason:

- Reliable relational database
- Good for financial records
- Strong schema structure
- Works well with transactions, holdings, watchlists, alerts, and reports

## 4.4 Automation

Recommended:

```text
N8N
```

Reason:

- Affordable automation
- Good for scheduled workflows
- Works well with webhooks
- Can run self-hosted
- Useful for daily emails, market checks, and scheduled reports

## 4.5 AI

Recommended:

```text
Model-agnostic AI service wrapper
```

The app may start with OpenAI, but the code should not be hard-wired directly to one AI vendor.

Correct pattern:

```text
App
→ AI Service
→ AI Provider Adapter
→ External AI API
```

## 4.6 Hosting

Initial hosting can use one of these:

```text
Vercel
Railway
Render
Supabase
Hostinger VPS
Other affordable VPS
```

The exact hosting choice should be recorded in `/docs/14_DECISION_LOG.md`.

---

# 5. Core Architecture Diagram

```text
                         User
                          │
                          ▼
                  Next.js Frontend
                          │
                          ▼
              Internal App Services
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
 Portfolio Service   Market Service     AI Service
        │                 │                 │
        ▼                 ▼                 ▼
 PostgreSQL DB     Provider Adapters   AI Provider
        │                 │                 │
        ▼                 ▼                 ▼
 Reports / Logs    Market Data APIs    AI Model API
        │
        ▼
 Notification Service
        │
        ▼
 Email / In-App Alerts
```

---

# 6. Core Runtime Components

The application should eventually contain these major runtime components.

## 6.1 Web Application

Purpose:

- Main user interface
- Dashboard
- Portfolio
- Watchlists
- Research
- Themes
- Reports
- Alerts
- Settings

Location:

```text
/app
/components
```

## 6.2 Internal Services

Purpose:

- Own business logic
- Keep UI clean
- Prevent repeated code
- Create stable boundaries

Location:

```text
/lib/services
```

Example services:

```text
PortfolioService
TransactionService
WatchlistService
MarketDataService
CompanyFundamentalsService
NewsService
FilingsService
EarningsService
ThemeService
RiskService
AlertService
NotificationService
ReportService
AIAnalysisService
AutomationLogService
```

## 6.3 Provider Adapters

Purpose:

- Wrap external APIs
- Prevent vendor lock-in
- Normalize provider responses
- Handle provider-specific errors

Location:

```text
/lib/providers
```

Example adapters:

```text
MarketDataProvider
NewsProvider
FilingProvider
AIProvider
EmailProvider
MacroDataProvider
```

## 6.4 Database Layer

Purpose:

- Store durable app data
- Own schema and relationships
- Support historical tracking

Location:

```text
/prisma
/lib/db
```

## 6.5 Automation Layer

Purpose:

- Run scheduled workflows
- Trigger reports
- Trigger alerts
- Coordinate N8N workflows with app services

Possible locations:

```text
/server/jobs
/server/api/webhooks
```

External automation:

```text
N8N
```

---

# 7. Recommended Folder Structure

Initial recommended structure:

```text
/app
  /dashboard
  /portfolio
  /watchlist
  /research
  /themes
  /alerts
  /reports
  /settings

/components
  /ui
  /charts
  /dashboard
  /portfolio
  /watchlist
  /research
  /themes
  /alerts
  /reports

/lib
  /services
  /providers
  /ai
  /db
  /utils
  /validators
  /types

/server
  /actions
  /api
  /jobs
  /webhooks

/prisma

/docs

/tests
  /unit
  /integration
```

This structure may evolve, but any major folder change must be documented in `/docs/14_DECISION_LOG.md`.

---

# 8. Main Application Domains

The system is organized around domains.

Each domain owns a specific part of the product.

Initial domains:

```text
Authentication
Portfolio
Transactions
Watchlists
Market Data
Company Fundamentals
News
Filings
Earnings
Themes
Risk
Alerts
Notifications
AI Analysis
Automation
Reports
Settings
Dashboard
```

The full responsibilities of each domain belong in:

```text
/docs/02_DOMAIN_MAP.md
```

---

# 9. Service Boundary Rules

Business logic should live in services, not UI components.

## Correct Pattern

```text
Page / Component
→ Internal Service
→ Database or Provider Adapter
```

Example:

```text
Portfolio Page
→ PortfolioService
→ Database
→ MarketDataService
→ MarketDataProvider
```

## Incorrect Pattern

```text
Portfolio Page
→ Raw database queries
→ External market data API
→ Portfolio calculations inside React component
```

UI components should focus on:

- Rendering
- User interaction
- Loading states
- Empty states
- Error states

Services should focus on:

- Business rules
- Calculations
- Data access
- Provider communication
- Validation
- Transforming data into usable shapes

---

# 10. Provider Adapter Rules

External APIs must be wrapped.

The app should never directly depend on vendor-specific API responses in UI components or business logic.

## Correct Pattern

```text
MarketDataService
→ MarketDataProvider interface
→ PolygonProvider / TwelveDataProvider / AlphaVantageProvider
```

## Incorrect Pattern

```text
Dashboard component
→ fetch("https://provider-api.com/prices")
```

Provider adapters should:

- Handle authentication
- Normalize responses
- Handle rate limits
- Handle provider errors
- Return internal data formats
- Hide vendor-specific details from the rest of the app

---

# 11. Database Architecture

The database should be the durable source of truth for user-created and system-created records.

Examples of data stored in the database:

- Users
- Portfolios
- Holdings
- Transactions
- Watchlists
- Watchlist items
- Companies
- Themes
- Alerts
- Notifications
- Reports
- AI analyses
- Automation logs
- Cached market data
- Cached news metadata

The detailed database schema belongs in:

```text
/docs/03_DATABASE_SCHEMA.md
```

The database should support:

- Historical tracking
- Auditability
- Explainable reports
- Reproducible calculations
- Future expansion

Important rule:

Transactions should be the source of truth for portfolio history.

Holdings may be calculated from transactions or stored as snapshots, but the architecture decision must be documented.

---

# 12. Data Flow Architecture

Every important data flow should be traceable.

## 12.1 Market Price Data Flow

```text
External Market API
→ MarketDataProvider
→ MarketDataService
→ Database Cache
→ PortfolioService / WatchlistService / AlertService
→ Dashboard / Reports / Notifications
```

## 12.2 Watchlist Alert Flow

```text
Scheduled Job or N8N Trigger
→ WatchlistService
→ MarketDataService
→ AlertService
→ NotificationService
→ Email / In-App Alert
```

## 12.3 AI Report Flow

```text
Scheduled Trigger
→ Data Collection Services
→ AIAnalysisService
→ ReportService
→ Database
→ NotificationService
→ Email / Dashboard Report
```

## 12.4 News Analysis Flow

```text
News Provider
→ NewsService
→ Relevance Scoring
→ AIAnalysisService
→ Stored Summary
→ Dashboard / Email / Alert
```

---

# 13. AI Architecture Overview

The AI system should be modular.

The app should not use one giant AI prompt for everything.

AI should be separated into roles.

Initial AI roles:

```text
CIO Agent
News Analyst
Earnings Analyst
Valuation Analyst
Risk Analyst
Theme Analyst
Report Writer
```

The detailed AI design belongs in:

```text
/docs/06_AI_ARCHITECTURE.md
```

## 13.1 AI Service Pattern

Correct pattern:

```text
Application Service
→ AIAnalysisService
→ AI Provider Adapter
→ External AI Model
```

AI outputs should be stored when useful.

Examples:

- Morning brief
- Market close summary
- Company analysis
- Earnings summary
- Risk review
- Theme update
- Watchlist opportunity note

## 13.2 AI Guardrails

AI output must:

- Use evidence
- Mention uncertainty
- Avoid unsupported buy/sell commands
- Include bullish and bearish interpretation where appropriate
- Explain why something matters
- Help the user decide what to research next

AI output must not:

- Guarantee returns
- Pretend to be a licensed financial advisor
- Automatically execute trades
- Make unsupported price targets
- Hide missing data

---

# 14. Automation Architecture Overview

Automation should reduce manual work while keeping the user in control.

Automation may be handled through:

```text
N8N
Application scheduled jobs
Webhook endpoints
Background workers
```

Detailed automation workflows belong in:

```text
/docs/07_AUTOMATION_WORKFLOWS.md
```

## 14.1 Initial Automation Workflows

MVP automations may include:

```text
Morning Brief
Market Close Report
Watchlist Price Check
Portfolio Risk Check
Earnings Calendar Check
Major News Alert
Weekly CIO Review
```

## 14.2 Automation Requirements

Every automation must define:

- Trigger
- Input data
- Services called
- Output produced
- Failure behavior
- Logging behavior
- Notification rules

Automations must be observable.

A failed workflow should be logged and should not silently disappear.

---

# 15. Notification Architecture

Notifications should be separate from alert logic.

## Correct Pattern

```text
AlertService
→ creates alert
→ NotificationService
→ sends email or in-app notification
```

## Incorrect Pattern

```text
AlertService
→ directly sends email using provider-specific code
```

Notification types may include:

```text
Email
In-app notification
Future SMS
Future push notification
```

Email delivery should use an internal email provider adapter.

---

# 16. Report Architecture

Reports should be durable.

A generated report should usually be stored in the database so the user can review it later.

Report types may include:

```text
Morning Brief
Market Close Report
Weekly CIO Review
Company Research Note
Earnings Summary
Theme Update
Risk Review
Watchlist Opportunity Review
```

A report should include:

- Title
- Type
- Generated time
- Source data references where possible
- AI-generated summary where applicable
- Key insights
- Risks
- Suggested next action
- Status such as unread, reviewed, archived

---

# 17. UI Architecture Overview

The UI should be clean, serious, and useful.

Core pages:

```text
/dashboard
/portfolio
/watchlist
/research
/themes
/alerts
/reports
/settings
```

The full UI design system belongs in:

```text
/docs/08_UI_DESIGN_SYSTEM.md
```

## 17.1 Dashboard Purpose

The dashboard should answer:

- What changed?
- What needs my attention?
- What is my portfolio doing?
- What are my biggest risks?
- Which watchlist items are interesting?
- What reports should I read?

## 17.2 UI Component Pattern

Use reusable components.

Examples:

```text
PortfolioSummaryCard
PositionTable
WatchlistTable
AlertCard
ReportCard
ThemeExposureCard
RiskSummaryCard
CompanyHeader
MetricCard
```

Components should avoid owning business logic.

---

# 18. Security Architecture Overview

Security must be designed from the beginning.

Detailed security rules belong in:

```text
/docs/09_SECURITY_MODEL.md
```

Minimum security rules:

- No hard-coded secrets
- No API keys in frontend code
- Use environment variables
- Use authentication before showing user data
- Validate user input
- Avoid storing brokerage credentials in Version 1
- Log errors without leaking secrets
- Keep GitHub repo private during early development

Secrets should be stored in:

```text
.env
```

A safe example file may be stored as:

```text
.env.example
```

The real `.env` file must never be committed.

---

# 19. Error Handling Architecture

The system should expect failures.

Common failures:

- Market data API is down
- Rate limit reached
- News provider returns incomplete data
- AI provider fails
- Database connection fails
- Email delivery fails
- N8N workflow fails
- User enters invalid data

Expected behavior:

- Do not crash the entire app
- Show useful error messages
- Log the failure
- Use cached data where reasonable
- Retry when appropriate
- Mark reports or alerts as incomplete if data was missing

---

# 20. Performance Architecture

The system should avoid unnecessary expensive work.

Performance principles:

- Cache market data when real-time data is unnecessary
- Store generated reports
- Run expensive AI analysis in background workflows
- Avoid AI calls on every page load
- Avoid repeated provider calls for the same data
- Use pagination for large tables
- Use indexes for frequently queried data
- Keep dashboard loading fast

Target goals for early versions:

```text
Dashboard initial load: under 2 seconds when using cached data
Portfolio calculations: under 500ms for normal personal portfolio size
AI report generation: background task, not blocking UI
Watchlist checks: scheduled batch process
```

---

# 21. Deployment Architecture

Initial deployment should be simple and affordable.

Possible deployment options:

```text
Option A:
Next.js app on Vercel
PostgreSQL on Supabase or Railway
N8N on Hostinger VPS

Option B:
Full stack on VPS
PostgreSQL on same VPS or managed database
N8N on same VPS

Option C:
Next.js app on Railway
PostgreSQL on Railway
N8N on Hostinger VPS
```

The selected deployment architecture must be recorded in:

```text
/docs/11_DEPLOYMENT_AND_HOSTING.md
/docs/14_DECISION_LOG.md
```

Do not overcomplicate deployment during MVP.

---

# 22. Environment Variables

Expected future environment variables may include:

```text
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL

OPENAI_API_KEY

MARKET_DATA_API_KEY
NEWS_API_KEY
FILING_API_KEY

EMAIL_PROVIDER_API_KEY
EMAIL_FROM_ADDRESS

N8N_WEBHOOK_SECRET
N8N_BASE_URL
```

This list will evolve.

Never commit real secrets.

Maintain:

```text
.env.example
```

for safe placeholder values.

---

# 23. MVP Architecture Scope

The MVP should be built around the smallest useful system.

MVP architecture should support:

- Authentication
- Manual portfolio tracking
- Manual transaction entry
- Watchlists
- Basic market data integration
- Basic dashboard
- Basic alerts
- Basic AI summaries
- Basic reports
- Documentation workflow

MVP architecture should avoid:

- Brokerage trade execution
- Complex options support
- Crypto trading
- Paid institutional data dependency
- Multi-user SaaS billing
- Advanced tax tracking
- Complex backtesting

---

# 24. Architecture Evolution Plan

The architecture should evolve in stages.

## Stage 1: Documentation Foundation

Create:

```text
00_PRODUCT_CONSTITUTION.md
01_ARCHITECTURE_OVERVIEW.md
02_DOMAIN_MAP.md
03_DATABASE_SCHEMA.md
04_API_CONTRACTS.md
15_CODEX_WORKFLOW.md
```

## Stage 2: App Foundation

Build:

```text
Next.js app
TypeScript setup
Basic layout
Database connection
Authentication
Base UI components
```

## Stage 3: Portfolio Core

Build:

```text
Portfolio CRUD
Transactions
Holdings
Portfolio calculations
Dashboard summary
```

## Stage 4: Watchlist Core

Build:

```text
Watchlists
Watchlist items
Target prices
Priority levels
Basic alert rules
```

## Stage 5: Market Data

Build:

```text
Market data provider adapter
Price cache
Company metadata
Dashboard market updates
```

## Stage 6: AI and Reports

Build:

```text
AI provider adapter
Report generation
Morning brief
Company summary
Risk summary
```

## Stage 7: Automation

Build:

```text
N8N workflows
Webhook endpoints
Scheduled reports
Email notifications
Automation logs
```

---

# 25. Open Architecture Decisions

These decisions are not final yet and should be resolved before implementation.

## 25.1 Hosting

Options:

- Vercel + Supabase + Hostinger N8N
- Railway full stack
- Hostinger VPS full stack
- Other VPS setup

Status:

```text
Open
```

## 25.2 Authentication Provider

Options:

- NextAuth/Auth.js
- Clerk
- Supabase Auth
- Custom auth

Status:

```text
Open
```

## 25.3 Initial Market Data Provider

Options:

- Alpha Vantage
- Twelve Data
- Financial Modeling Prep
- Polygon
- Yahoo Finance unofficial tools
- Other provider

Status:

```text
Open
```

## 25.4 Initial Email Provider

Options:

- Resend
- SendGrid
- Mailgun
- Gmail SMTP
- Other provider

Status:

```text
Open
```

## 25.5 Initial Database Hosting

Options:

- Supabase Postgres
- Railway Postgres
- Neon Postgres
- VPS-hosted Postgres

Status:

```text
Open
```

---

# 26. Codex Architecture Rules

When Codex works on this project, it must:

1. Read `/docs/00_PRODUCT_CONSTITUTION.md`.
2. Read this document.
3. Read `/docs/02_DOMAIN_MAP.md` once it exists.
4. Read `/docs/03_DATABASE_SCHEMA.md` once it exists.
5. Read `/docs/15_CODEX_WORKFLOW.md` once it exists.
6. Inspect existing files before suggesting changes.
7. Identify affected domains.
8. Avoid unrelated changes.
9. Avoid direct frontend access to external APIs.
10. Keep business logic out of UI components.
11. Use provider adapters for external services.
12. Update documentation when behavior changes.
13. Avoid large all-in-one implementations.
14. Provide testing steps after code changes.

---

# 27. Architecture Summary

AI CIO should be built as a modular personal investment intelligence system.

The most important architecture rules are:

- Keep UI separate from business logic.
- Keep business logic separate from external providers.
- Use provider adapters.
- Store important outputs.
- Make AI evidence-based.
- Keep automation observable.
- Protect secrets.
- Document decisions.
- Build in small batches.

The architecture should make the system easy to understand, easy to debug, and easy to expand.
