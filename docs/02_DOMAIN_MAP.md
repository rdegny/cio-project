# AI CIO Domain Map

Version: 0.1  
Document Status: Foundation Architecture  
Related Constitution: `/docs/00_PRODUCT_CONSTITUTION.md`  
Related Architecture Overview: `/docs/01_ARCHITECTURE_OVERVIEW.md`

---

# 1. Purpose of This Document

This document defines the main business and technical domains of the AI CIO project.

A domain is a major area of responsibility inside the system.

This document explains:

- What each domain owns
- What each domain must not own
- Which other domains it depends on
- Which files or folders may eventually belong to each domain
- How Codex should reason about feature boundaries before writing code

Every Codex session should read this document before making feature-level changes.

---

# 2. Domain Philosophy

AI CIO should be built around clear domain boundaries.

The purpose of domain boundaries is to prevent the app from becoming a tangled project where every file depends on every other file.

A good domain has:

- A clear purpose
- Clear data ownership
- Clear service ownership
- Clear inputs and outputs
- Clear rules about what it should not do

Bad architecture usually happens when one domain starts doing the work of another domain.

Example of bad architecture:

```text
Dashboard component
→ fetches market data
→ calculates portfolio return
→ checks alerts
→ sends email
→ calls AI
```

Example of good architecture:

```text
Dashboard Page
→ DashboardService
→ PortfolioService
→ MarketDataService
→ AlertService
→ ReportService
```

The UI should ask services for useful data. It should not personally own business logic.

---

# 3. Dependency Direction Rule

Most dependencies should flow in this direction:

```text
UI / Pages
↓
Application Services
↓
Database / Provider Adapters
↓
External APIs
```

The system should avoid reverse dependencies.

For example:

- A provider adapter should not depend on a React component.
- A database model should not depend on a UI page.
- A notification provider should not decide alert logic.
- An AI prompt should not directly own portfolio calculations.

---

# 4. Cross-Domain Communication Rule

Domains should communicate through services, not through direct access to each other's internal details.

Correct:

```text
AlertService
→ WatchlistService.getItemsToCheck()
→ MarketDataService.getLatestPrices()
→ NotificationService.sendNotification()
```

Incorrect:

```text
AlertService
→ directly queries watchlist tables
→ directly calls external market API
→ directly sends email through vendor SDK
```

This keeps each domain replaceable and easier to test.

---

# 5. Domain List

Initial AI CIO domains:

```text
Authentication
User Settings
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
Dashboard / UI
Logging and Observability
Administration
```

Some domains will be simple in the MVP and become more advanced later.

---

# 6. Authentication Domain

## Purpose

The Authentication domain controls user identity and access to the application.

## Owns

- User login
- User logout
- Session management
- Account identity
- Protected routes
- Authentication provider integration
- Basic user access control

## Must Not Own

- Portfolio calculations
- Market data
- Watchlist logic
- AI analysis
- Email report generation
- Investment recommendations

## Depends On

- Database
- Authentication provider
- Environment variables

## May Be Used By

- Dashboard
- Portfolio
- Watchlists
- Reports
- Settings
- Alerts
- Any protected page or service

## Possible Files

```text
/lib/services/auth-service.ts
/lib/auth
/app/login
/app/logout
/middleware.ts
```

## MVP Notes

Authentication should remain simple in the early version.

Do not add complex roles, organizations, billing, or multi-tenant SaaS logic unless intentionally approved.

---

# 7. User Settings Domain

## Purpose

The User Settings domain stores preferences that customize how AI CIO behaves for the user.

## Owns

- User preferences
- Email preferences
- Alert preferences
- Report frequency
- Default portfolio
- Default currency
- Time zone
- Risk tolerance setting
- Theme preferences
- AI tone preferences

## Must Not Own

- Alert triggering logic
- Report generation logic
- Portfolio calculations
- Notification delivery implementation

## Depends On

- Authentication
- Database

## May Be Used By

- Alerts
- Notifications
- Reports
- AI Analysis
- Dashboard
- Automation

## Possible Files

```text
/lib/services/user-settings-service.ts
/app/settings
/components/settings
```

## MVP Notes

Start with only the settings required for MVP.

Examples:

- Email on/off
- Morning brief on/off
- Market close report on/off
- Default currency
- Time zone

---

# 8. Portfolio Domain

## Purpose

The Portfolio domain represents the user's investment holdings and portfolio-level view.

## Owns

- Portfolios
- Holdings
- Position summaries
- Allocation
- Cost basis summaries
- Unrealized gains/losses
- Realized gains/losses
- Portfolio value
- Portfolio performance summaries
- Sector exposure
- Theme exposure

## Must Not Own

- Raw transaction entry forms
- External market data fetching
- AI-generated portfolio commentary
- Email delivery
- Provider-specific API calls
- News fetching

## Depends On

- Transactions
- Market Data
- Company Fundamentals
- Themes
- Risk
- Database

## May Be Used By

- Dashboard
- Reports
- Alerts
- AI Analysis
- Risk
- Automation

## Possible Files

```text
/lib/services/portfolio-service.ts
/lib/services/portfolio-calculation-service.ts
/app/portfolio
/components/portfolio
/tests/unit/portfolio
```

## Key Rule

Transactions should be treated as the source of truth for portfolio history.

The Portfolio domain may calculate holdings from transactions or use stored snapshots, but that architecture decision must be documented.

## MVP Notes

MVP portfolio features should include:

- Add holding manually
- Add transaction manually
- View current holdings
- View total value
- View gain/loss
- View allocation by position

---

# 9. Transactions Domain

## Purpose

The Transactions domain records the user's investment activity.

## Owns

- Buy transactions
- Sell transactions
- Dividend transactions
- Deposits
- Withdrawals
- Stock splits
- Manual adjustments
- Transaction validation
- Transaction history

## Must Not Own

- Live price fetching
- Portfolio-level dashboard UI
- AI recommendations
- Alerts
- Email notifications

## Depends On

- Portfolio
- Company / Security reference data
- Database

## May Be Used By

- Portfolio
- Reports
- Risk
- AI Analysis
- Dashboard

## Possible Files

```text
/lib/services/transaction-service.ts
/app/portfolio/transactions
/components/portfolio/transaction-form.tsx
/tests/unit/transactions
```

## Key Rule

Transaction records should be durable, auditable, and not silently overwritten.

Edits or deletions should be handled carefully.

## MVP Notes

Start with:

- Buy
- Sell
- Dividend
- Manual adjustment

Avoid complex tax lots until a later version.

---

# 10. Watchlists Domain

## Purpose

The Watchlists domain tracks companies the user wants to monitor but may not own.

## Owns

- Watchlists
- Watchlist items
- Target prices
- Priority levels
- User notes
- Watchlist categories
- Research status
- Watchlist item tags

## Must Not Own

- Market data provider calls
- Alert delivery
- AI analysis generation
- Portfolio holdings
- News fetching

## Depends On

- Market Data
- Company Fundamentals
- Themes
- Alerts
- Database

## May Be Used By

- Dashboard
- Alerts
- Reports
- AI Analysis
- Automation

## Possible Files

```text
/lib/services/watchlist-service.ts
/app/watchlist
/components/watchlist
/tests/unit/watchlist
```

## MVP Notes

MVP watchlist features should include:

- Create watchlist
- Add ticker
- Add target price
- Add priority
- Add notes
- View current price from Market Data domain

---

# 11. Market Data Domain

## Purpose

The Market Data domain provides price and market information in a normalized internal format.

## Owns

- Current prices
- Historical prices
- Daily open/high/low/close
- Volume
- Market cap where available
- Exchange
- Currency
- Basic ticker metadata
- Market data cache
- Provider response normalization

## Must Not Own

- Portfolio calculations
- Watchlist target logic
- AI recommendations
- Report writing
- UI rendering
- Notification delivery

## Depends On

- External market data providers
- Provider adapters
- Database cache
- Environment variables

## May Be Used By

- Portfolio
- Watchlists
- Alerts
- Dashboard
- Reports
- Risk
- AI Analysis
- Automation

## Possible Files

```text
/lib/services/market-data-service.ts
/lib/providers/market-data
/lib/types/market-data.ts
/tests/unit/market-data
```

## Key Rule

No UI component should directly call a market data provider.

Correct:

```text
Component
→ MarketDataService
→ MarketDataProvider
→ External API
```

Incorrect:

```text
Component
→ External API
```

## MVP Notes

Start with one provider, but design through an adapter so it can be replaced later.

---

# 12. Company Fundamentals Domain

## Purpose

The Company Fundamentals domain stores and normalizes business and financial statement data.

## Owns

- Revenue
- Gross profit
- Operating income
- Net income
- EPS
- Free cash flow
- Cash
- Debt
- Margins
- Valuation ratios
- Historical financials
- Company profile
- Sector
- Industry

## Must Not Own

- Live price provider logic
- News summaries
- AI-generated conclusions
- Portfolio calculations
- Alerts

## Depends On

- External fundamentals provider
- Market Data
- Database

## May Be Used By

- Research
- AI Analysis
- Risk
- Reports
- Themes
- Dashboard

## Possible Files

```text
/lib/services/company-fundamentals-service.ts
/lib/providers/fundamentals
/app/research
/components/research
```

## MVP Notes

This domain may be light in the first version.

Start with company profile, sector, industry, and basic valuation metrics if available.

---

# 13. News Domain

## Purpose

The News domain collects and organizes news related to companies, sectors, themes, and the broader market.

## Owns

- News article metadata
- Article title
- Source
- URL
- Published time
- Related tickers
- Related themes
- Relevance score
- Duplicate detection
- News cache

## Must Not Own

- AI conclusions
- Portfolio calculations
- Alert delivery
- Email formatting

## Depends On

- External news providers
- Market Data
- Themes
- Company reference data
- Database

## May Be Used By

- AI Analysis
- Reports
- Alerts
- Dashboard
- Automation
- Themes

## Possible Files

```text
/lib/services/news-service.ts
/lib/providers/news
/lib/services/news-relevance-service.ts
/app/research/news
```

## MVP Notes

Initial implementation can use simple news ingestion and manual relevance rules.

Advanced AI relevance scoring can come later.

---

# 14. Filings Domain

## Purpose

The Filings domain tracks company regulatory filings and important disclosure documents.

## Owns

- Filing metadata
- Filing type
- Filing date
- Company CIK or equivalent identifier
- Filing URL
- Filing status
- Filing summary references

## Must Not Own

- AI filing summaries directly
- Portfolio calculations
- Alert delivery
- UI formatting logic

## Depends On

- SEC or equivalent filing sources
- Company reference data
- Database
- AI Analysis for summaries

## May Be Used By

- AI Analysis
- Reports
- Alerts
- Research
- Automation

## Possible Files

```text
/lib/services/filings-service.ts
/lib/providers/filings
/app/research/filings
```

## MVP Notes

This can be deferred until after core portfolio and watchlist features.

---

# 15. Earnings Domain

## Purpose

The Earnings domain tracks earnings dates, reported results, guidance, and related analysis.

## Owns

- Earnings calendar
- Earnings dates
- Reported EPS
- Reported revenue
- Guidance data where available
- Transcript metadata
- Estimate comparison fields
- Earnings event status

## Must Not Own

- AI earnings interpretation
- Portfolio action recommendations
- Email delivery
- Raw market data provider logic

## Depends On

- Earnings data provider
- Company Fundamentals
- News
- AI Analysis
- Database

## May Be Used By

- AI Analysis
- Reports
- Alerts
- Dashboard
- Automation
- Risk

## Possible Files

```text
/lib/services/earnings-service.ts
/lib/providers/earnings
/app/research/earnings
```

## MVP Notes

Start with earnings date tracking if provider data is available.

Transcript analysis can come later.

---

# 16. Themes Domain

## Purpose

The Themes domain organizes companies by long-term investment themes.

## Owns

- Theme records
- Theme descriptions
- Companies linked to themes
- Theme tags
- Theme priority
- Theme thesis notes
- Theme risks
- Theme watchlists
- Theme exposure calculations

## Must Not Own

- Portfolio holdings directly
- Market data provider logic
- AI report generation
- Alert delivery

## Depends On

- Portfolio
- Watchlists
- Market Data
- News
- Company Fundamentals
- Database

## May Be Used By

- Dashboard
- Reports
- AI Analysis
- Risk
- Alerts
- Automation

## Possible Files

```text
/lib/services/theme-service.ts
/app/themes
/components/themes
/tests/unit/themes
```

## Example Themes

```text
European defense
Nuclear energy
AI infrastructure
Grid modernization
Cybersecurity
Energy security
Industrial reshoring
Aerospace and defense
```

## MVP Notes

MVP should allow manual theme creation and manual company tagging.

Advanced theme scoring can come later.

---

# 17. Risk Domain

## Purpose

The Risk domain identifies and explains risks in the user's portfolio and watchlists.

## Owns

- Position concentration risk
- Sector concentration risk
- Theme concentration risk
- Volatility risk
- Drawdown risk
- Valuation risk
- Debt risk
- Earnings risk
- News risk
- Correlation risk where practical
- Risk summary output

## Must Not Own

- Raw portfolio data entry
- Market data provider calls directly
- Notification delivery
- AI report formatting
- Trade execution

## Depends On

- Portfolio
- Market Data
- Company Fundamentals
- News
- Earnings
- Themes
- AI Analysis

## May Be Used By

- Dashboard
- Reports
- Alerts
- Automation
- AI Analysis

## Possible Files

```text
/lib/services/risk-service.ts
/lib/services/risk-scoring-service.ts
/components/risk
/tests/unit/risk
```

## MVP Notes

Start with simple explainable risk checks:

- Largest position
- Sector concentration
- Theme concentration
- Large daily price move
- High debt warning if data available

Avoid overly complex risk models early.

---

# 18. Alerts Domain

## Purpose

The Alerts domain decides when something deserves the user's attention.

## Owns

- Alert rules
- Alert conditions
- Alert records
- Alert severity
- Alert status
- Alert deduplication
- Alert explanation
- Alert history

## Must Not Own

- Email provider implementation
- In-app notification delivery implementation
- Raw market data fetching
- AI provider calls unless routed through AI Analysis
- UI rendering

## Depends On

- Watchlists
- Portfolio
- Market Data
- News
- Earnings
- Risk
- User Settings
- Database

## May Be Used By

- Notifications
- Dashboard
- Reports
- Automation

## Possible Files

```text
/lib/services/alert-service.ts
/lib/services/alert-rule-service.ts
/app/alerts
/components/alerts
/tests/unit/alerts
```

## Key Rule

Alerts should be explainable.

Bad alert:

```text
Buy this stock.
```

Good alert:

```text
This stock is now within 5% of your target price and no major negative news has been detected in the last 24 hours. Review before taking action.
```

## MVP Notes

Start with:

- Price above threshold
- Price below threshold
- Large daily move
- Watchlist target reached

---

# 19. Notifications Domain

## Purpose

The Notifications domain delivers messages to the user.

## Owns

- Email delivery
- In-app notifications
- Notification preferences
- Notification status
- Notification history
- Provider delivery result tracking

## Must Not Own

- Alert logic
- Portfolio calculations
- AI analysis logic
- Market data fetching
- Report generation logic

## Depends On

- Alerts
- Reports
- User Settings
- Email provider adapter
- Database

## May Be Used By

- Alerts
- Reports
- Automation
- AI Analysis

## Possible Files

```text
/lib/services/notification-service.ts
/lib/providers/email
/app/notifications
```

## Key Rule

AlertService decides what matters.

NotificationService decides how to deliver it.

## MVP Notes

Start with email and in-app records.

SMS and push notifications should be deferred.

---

# 20. AI Analysis Domain

## Purpose

The AI Analysis domain turns structured information into useful investment commentary.

## Owns

- AI agent orchestration
- Prompt templates
- AI request formatting
- AI output parsing
- AI summary storage
- AI analysis records
- AI guardrails
- AI evaluation notes

## Must Not Own

- Raw portfolio calculations
- Raw market data fetching
- Direct database schema ownership for unrelated domains
- Notification delivery
- External provider-specific logic outside AI provider adapter

## Depends On

- AI provider adapter
- Portfolio
- Watchlists
- Market Data
- Company Fundamentals
- News
- Filings
- Earnings
- Risk
- Themes
- Reports

## May Be Used By

- Reports
- Dashboard
- Alerts
- Automation
- Research

## Possible Files

```text
/lib/services/ai-analysis-service.ts
/lib/ai/agents
/lib/ai/prompts
/lib/providers/ai
/tests/unit/ai
```

## AI Roles

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

## Key Rule

AI should receive structured context from services.

AI should not directly fetch random data from external sources unless that behavior is explicitly designed and documented.

---

# 21. Automation Domain

## Purpose

The Automation domain runs scheduled and event-driven workflows.

## Owns

- Scheduled jobs
- Webhook endpoints
- N8N workflow coordination
- Job status
- Job logs
- Retry behavior
- Workflow failure handling

## Must Not Own

- Portfolio calculations directly
- Alert rules directly
- Email provider implementation
- AI prompt content directly
- UI rendering

## Depends On

- Portfolio
- Watchlists
- Market Data
- News
- Earnings
- Risk
- Alerts
- Reports
- Notifications
- AI Analysis
- Logging

## May Be Used By

- N8N
- Reports
- Alerts
- Notifications
- Dashboard

## Possible Files

```text
/server/jobs
/server/webhooks
/lib/services/automation-log-service.ts
/docs/07_AUTOMATION_WORKFLOWS.md
```

## MVP Notes

Start with manually triggered jobs or simple scheduled workflows.

N8N can be added when the app has stable service endpoints.

---

# 22. Reports Domain

## Purpose

The Reports domain creates durable summaries that the user can read later.

## Owns

- Report records
- Report type
- Report status
- Report title
- Report body
- Report metadata
- Report source references
- Report read/archive status

## Must Not Own

- Raw AI provider calls directly
- Email delivery implementation
- Market data provider calls directly
- Portfolio calculations directly

## Depends On

- AI Analysis
- Portfolio
- Watchlists
- Market Data
- News
- Earnings
- Risk
- Themes
- Notifications
- Database

## May Be Used By

- Dashboard
- Notifications
- Automation
- AI Analysis
- User Interface

## Possible Files

```text
/lib/services/report-service.ts
/app/reports
/components/reports
/tests/unit/reports
```

## Report Types

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

## MVP Notes

Start with a simple report record and one generated report type.

Do not overbuild report templates too early.

---

# 23. Dashboard / UI Domain

## Purpose

The Dashboard / UI domain presents information to the user in a clear and useful way.

## Owns

- Pages
- Layouts
- Cards
- Tables
- Charts
- Forms
- Loading states
- Empty states
- Error states
- Navigation
- Responsive behavior

## Must Not Own

- Portfolio calculations
- External API calls
- Alert rules
- AI prompt logic
- Email delivery
- Database business logic

## Depends On

- Portfolio
- Watchlists
- Alerts
- Reports
- Risk
- Themes
- Market Data
- User Settings

## Possible Files

```text
/app
/components
/components/ui
/components/dashboard
/components/portfolio
/components/watchlist
/components/reports
```

## Key Rule

UI components should be dumb when possible.

They should receive ready-to-display data from services or server actions.

## MVP Notes

Start with a simple command-center dashboard:

- Portfolio value
- Top holdings
- Watchlist highlights
- Active alerts
- Latest report
- Theme exposure preview

---

# 24. Logging and Observability Domain

## Purpose

The Logging and Observability domain helps diagnose what happened inside the system.

## Owns

- Application logs
- Automation logs
- Provider error logs
- AI request status logs
- Notification delivery logs
- Job run status
- Failure records

## Must Not Own

- Business logic decisions
- UI rendering
- Provider-specific business behavior
- Alert rules

## Depends On

- Database
- Application runtime
- Automation
- Provider adapters

## May Be Used By

- Automation
- Alerts
- Notifications
- AI Analysis
- Market Data
- Reports
- Admin tools

## Possible Files

```text
/lib/services/logging-service.ts
/lib/services/automation-log-service.ts
/app/settings/logs
```

## MVP Notes

Use simple structured logs at first.

Advanced observability tools can come later.

---

# 25. Administration Domain

## Purpose

The Administration domain provides internal control and visibility for the system owner.

## Owns

- System status view
- Provider status
- Job status
- API usage summary
- Cost visibility
- Manual rerun controls
- Debug tools

## Must Not Own

- Core portfolio logic
- Alert rules
- AI prompt logic
- User-facing investment recommendations

## Depends On

- Logging
- Automation
- Data Providers
- AI Analysis
- Notifications
- User Settings

## Possible Files

```text
/app/settings/admin
/app/settings/system
/components/admin
```

## MVP Notes

This can be minimal or deferred.

Early version may only need logs and environment setup notes.

---

# 26. Domain Ownership Summary

| Domain | Owns | Must Not Own |
|---|---|---|
| Authentication | Login, sessions, protected routes | Portfolio logic, AI analysis |
| User Settings | Preferences, report settings, alert preferences | Alert triggering, report generation |
| Portfolio | Holdings, allocation, performance summaries | Raw provider calls, email delivery |
| Transactions | Buys, sells, dividends, adjustments | Portfolio dashboard UI, market provider calls |
| Watchlists | Watchlist items, target prices, notes | Alert delivery, market provider calls |
| Market Data | Prices, historical data, ticker metadata | Portfolio decisions, AI opinions |
| Company Fundamentals | Financial statements, ratios, company profile | Alerts, UI rendering |
| News | Article metadata, relevance, source tracking | AI conclusions, notifications |
| Filings | Filing metadata, filing references | AI summaries directly, alerts directly |
| Earnings | Earnings calendar, reported results | AI interpretation, email delivery |
| Themes | Theme records, company-theme links | Provider calls, report generation |
| Risk | Risk checks, risk summaries | Trade execution, notification delivery |
| Alerts | Alert rules, alert records, severity | Email provider implementation |
| Notifications | Email/in-app delivery, delivery status | Alert logic |
| AI Analysis | Prompting, AI output, agent behavior | Raw data ownership, notifications |
| Automation | Scheduled jobs, webhooks, workflow logs | Domain business rules |
| Reports | Durable reports, report metadata | Raw provider calls |
| Dashboard / UI | Pages, components, charts, forms | Business logic |
| Logging | Job logs, error logs, status records | Business decisions |
| Administration | System status, debug controls | Core investment logic |

---

# 27. Codex Domain Review Checklist

Before Codex changes code, it should answer:

```text
1. Which domain is the main owner of this feature?
2. Which supporting domains are involved?
3. Does this change cross domain boundaries?
4. Is any UI component receiving business logic that should live in a service?
5. Is any service directly calling an external API without a provider adapter?
6. Is any provider-specific response leaking into the UI?
7. Does this require database schema changes?
8. Does this require documentation updates?
9. Does this create new security or cost concerns?
10. What tests are needed?
```

---

# 28. Example Feature Mapping

## Feature: Add a Stock to Watchlist

Primary domain:

```text
Watchlists
```

Supporting domains:

```text
Market Data
Themes
Alerts
User Settings
```

Should not involve:

```text
Portfolio transactions
Email provider implementation
AI report generation
```

---

## Feature: Generate Morning Brief

Primary domain:

```text
Reports
```

Supporting domains:

```text
Automation
Portfolio
Watchlists
Market Data
News
Risk
AI Analysis
Notifications
```

Should not involve:

```text
UI-only business logic
Direct external API calls from report components
Automatic trade execution
```

---

## Feature: Price Alert Email

Primary domain:

```text
Alerts
```

Supporting domains:

```text
Watchlists
Market Data
Notifications
User Settings
Automation
```

Should not involve:

```text
AI Analysis unless explicitly needed
Portfolio transaction changes
Direct email provider calls from AlertService
```

---

## Feature: Company Research Page

Primary domain:

```text
Dashboard / UI
```

Supporting domains:

```text
Company Fundamentals
Market Data
News
Filings
Earnings
AI Analysis
Reports
Themes
```

Should not involve:

```text
Portfolio transaction editing
Notification delivery
Automation job logic
```

---

# 29. Final Rule

When in doubt, keep the domain boundary cleaner than feels necessary.

It is easier to combine simple services later than to untangle mixed responsibilities after the app grows.
