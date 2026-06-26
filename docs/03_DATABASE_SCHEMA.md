# AI CIO Database Schema

Version: 0.1  
Document Status: Foundation Architecture  
Related Constitution: `/docs/00_PRODUCT_CONSTITUTION.md`  
Related Architecture Overview: `/docs/01_ARCHITECTURE_OVERVIEW.md`  
Related Domain Map: `/docs/02_DOMAIN_MAP.md`

---

# 1. Purpose of This Document

This document defines the initial database structure for the AI CIO project.

It explains:

- The major database entities
- What each table is responsible for
- How tables relate to each other
- Which domains own each table
- Which fields are expected in the MVP
- Which fields can be added later
- Important database rules Codex must follow before generating code

This document is not the final Prisma schema. It is the planning document that guides the real schema implementation.

Every Codex session that touches database models, Prisma migrations, server services, API contracts, or persisted data must read this document first.

---

# 2. Database Philosophy

AI CIO should use the database as a durable source of truth for user-created data and important system-generated data.

The database should support:

- Portfolio history
- Transaction history
- Watchlists
- Alerts
- Reports
- AI analysis records
- Market data caching
- Auditability
- Future expansion

The database should not be treated as a temporary scratchpad.

Important investment records should be durable, explainable, and recoverable.

---

# 3. Recommended Database Stack

Recommended initial database stack:

```text
PostgreSQL
Prisma ORM
```

Reason:

- PostgreSQL is reliable for structured financial data.
- Prisma gives type-safe access from TypeScript.
- Relational tables are a good fit for portfolios, transactions, alerts, reports, and user records.
- PostgreSQL can scale well enough for this personal AI CIO project.

---

# 4. Database Ownership Rules

Each table should have a clear domain owner.

Examples:

```text
Portfolio domain owns portfolio-related tables.
Watchlists domain owns watchlist-related tables.
Reports domain owns report-related tables.
AI Analysis domain owns AI analysis records.
Automation domain owns automation logs.
```

A domain may read another domain's data through a service, but should not freely mutate another domain's records.

Example:

Correct:

```text
ReportService
→ PortfolioService.getPortfolioSummary()
→ uses returned summary to create a report
```

Incorrect:

```text
ReportService
→ directly edits portfolio holdings
```

---

# 5. Source of Truth Rules

## 5.1 Transactions Are the Portfolio History Source of Truth

Transactions should be treated as the main source of truth for portfolio history.

The system may store holding snapshots for faster dashboard loading, but those snapshots should be derived from transactions and market data.

## 5.2 External Market Data Is Cached, Not Owned

Market data comes from external providers.

The database may cache market data, but the app should remember that external providers are the original source.

## 5.3 AI Outputs Should Be Stored When Useful

Generated reports, summaries, and AI analyses should usually be stored.

This allows the user to review past reasoning and see how investment views changed over time.

## 5.4 Alerts Should Be Durable

Alerts should be stored so the system knows:

- What triggered
- When it triggered
- Why it triggered
- Whether the user reviewed it
- Whether it was dismissed or archived

---

# 6. Naming Conventions

Use consistent naming.

## Table / Model Names

Prisma model names should use PascalCase:

```text
User
Portfolio
PortfolioHolding
Transaction
Watchlist
WatchlistItem
Company
Theme
Alert
Report
AIAnalysis
AutomationRun
```

## Field Names

Field names should use camelCase:

```text
createdAt
updatedAt
userId
portfolioId
tickerSymbol
targetPrice
```

## Enum Names

Enum names should use PascalCase:

```text
TransactionType
AlertSeverity
ReportType
AIAnalysisType
```

Enum values should use uppercase snake case:

```text
BUY
SELL
DIVIDEND
HIGH
MEDIUM
LOW
```

---

# 7. Common Fields

Most durable tables should include:

```text
id
createdAt
updatedAt
```

User-owned tables should usually include:

```text
userId
```

Tables connected to a portfolio should usually include:

```text
portfolioId
```

Soft-delete fields may be added later if needed:

```text
deletedAt
```

For MVP, avoid soft deletes unless the feature clearly needs them.

---

# 8. Core Entity Relationship Overview

High-level relationships:

```text
User
├── Portfolios
│   ├── Transactions
│   ├── PortfolioHoldings
│   └── PortfolioSnapshots
│
├── Watchlists
│   └── WatchlistItems
│
├── Alerts
├── Notifications
├── Reports
├── AIAnalyses
├── UserSettings
└── AutomationRuns

Company
├── MarketDataSnapshots
├── CompanyFundamentals
├── NewsArticles
├── Filings
├── EarningsEvents
├── ThemeCompanies
└── WatchlistItems

Theme
└── ThemeCompanies
```

---

# 9. MVP Database Scope

The MVP database should focus on the smallest useful system.

MVP tables should include:

```text
User
UserSettings
Portfolio
Transaction
PortfolioHolding
Watchlist
WatchlistItem
Company
Theme
ThemeCompany
MarketDataSnapshot
Alert
Notification
Report
AIAnalysis
AutomationRun
```

Optional MVP or early Version 2 tables:

```text
CompanyFundamental
NewsArticle
Filing
EarningsEvent
PortfolioSnapshot
ProviderRequestLog
DecisionJournalEntry
```

Do not overbuild the database before the app needs it.

---

# 10. User Table

## Domain Owner

Authentication

## Purpose

Represents the person using the app.

## Fields

```text
id                string / uuid / cuid
email             string unique
name              string nullable
image             string nullable
createdAt         datetime
updatedAt         datetime
```

## Relationships

```text
User has many Portfolios
User has one UserSettings
User has many Watchlists
User has many Alerts
User has many Notifications
User has many Reports
User has many AIAnalyses
User has many AutomationRuns
```

## Notes

If using an external auth provider such as NextAuth/Auth.js, Clerk, or Supabase Auth, the exact user schema may depend on that provider.

Any auth provider decision must be recorded in `/docs/14_DECISION_LOG.md`.

---

# 11. UserSettings Table

## Domain Owner

User Settings

## Purpose

Stores user preferences that customize alerts, reports, notifications, and app behavior.

## Fields

```text
id                        string
userId                    string unique
timezone                  string default "America/New_York"
defaultCurrency           string default "USD"
emailNotificationsEnabled boolean default true
morningBriefEnabled       boolean default true
marketCloseReportEnabled  boolean default false
weeklyReviewEnabled       boolean default true
riskTolerance             enum RiskTolerance nullable
createdAt                 datetime
updatedAt                 datetime
```

## Relationships

```text
UserSettings belongs to User
```

## MVP Notes

Start simple.

Do not add too many personalization options until the product has stable core features.

---

# 12. Portfolio Table

## Domain Owner

Portfolio

## Purpose

Represents a user investment portfolio.

## Fields

```text
id              string
userId          string
name            string
baseCurrency    string default "USD"
description     string nullable
isDefault       boolean default false
createdAt       datetime
updatedAt       datetime
```

## Relationships

```text
Portfolio belongs to User
Portfolio has many Transactions
Portfolio has many PortfolioHoldings
Portfolio has many PortfolioSnapshots
```

## Notes

A user can eventually have multiple portfolios, even if MVP only uses one default portfolio.

---

# 13. Transaction Table

## Domain Owner

Transactions

## Purpose

Stores investment activity.

Transactions are the source of truth for portfolio history.

## Fields

```text
id              string
userId          string
portfolioId     string
companyId       string nullable
tickerSymbol    string
type            enum TransactionType
tradeDate       datetime
quantity        decimal
price           decimal nullable
fees            decimal default 0
currency        string default "USD"
notes           string nullable
createdAt       datetime
updatedAt       datetime
```

## TransactionType Enum

```text
BUY
SELL
DIVIDEND
DEPOSIT
WITHDRAWAL
SPLIT
ADJUSTMENT
```

## Relationships

```text
Transaction belongs to User
Transaction belongs to Portfolio
Transaction optionally belongs to Company
```

## Rules

- Transactions should not be silently overwritten.
- Edits should be deliberate.
- Negative quantities should be avoided unless explicitly part of a documented adjustment rule.
- Fees should be included when calculating cost basis.
- Dividends may use quantity as nullable or 0 depending on implementation.

## MVP Notes

Start with:

```text
BUY
SELL
DIVIDEND
ADJUSTMENT
```

Deposits, withdrawals, splits, and tax-lot support can become more detailed later.

---

# 14. PortfolioHolding Table

## Domain Owner

Portfolio

## Purpose

Stores current or derived portfolio position summaries.

## Fields

```text
id                  string
userId              string
portfolioId         string
companyId           string nullable
tickerSymbol        string
quantity            decimal
averageCost         decimal nullable
costBasis           decimal nullable
lastPrice           decimal nullable
marketValue         decimal nullable
unrealizedGainLoss  decimal nullable
unrealizedGainPct   decimal nullable
currency            string default "USD"
lastPriceUpdatedAt  datetime nullable
createdAt           datetime
updatedAt           datetime
```

## Relationships

```text
PortfolioHolding belongs to User
PortfolioHolding belongs to Portfolio
PortfolioHolding optionally belongs to Company
```

## Important Decision

PortfolioHolding can be either:

1. Calculated live from transactions and market data, or
2. Stored as a derived snapshot for faster dashboard performance.

Initial recommendation:

```text
Store PortfolioHolding as a derived current-position table for dashboard speed, but maintain Transaction as the true historical record.
```

This decision should be recorded in `/docs/14_DECISION_LOG.md`.

---

# 15. PortfolioSnapshot Table

## Domain Owner

Portfolio

## Purpose

Stores portfolio value over time for performance charts and historical review.

## Fields

```text
id                  string
userId              string
portfolioId         string
snapshotDate        datetime
totalMarketValue    decimal
totalCostBasis      decimal nullable
totalGainLoss       decimal nullable
totalGainLossPct    decimal nullable
cashValue           decimal nullable
currency            string default "USD"
createdAt           datetime
```

## Relationships

```text
PortfolioSnapshot belongs to User
PortfolioSnapshot belongs to Portfolio
```

## MVP Notes

This table can be deferred until dashboard history charts are needed.

---

# 16. Watchlist Table

## Domain Owner

Watchlists

## Purpose

Represents a named group of companies the user wants to monitor.

## Fields

```text
id              string
userId          string
name            string
description     string nullable
isDefault       boolean default false
createdAt       datetime
updatedAt       datetime
```

## Relationships

```text
Watchlist belongs to User
Watchlist has many WatchlistItems
```

## MVP Notes

A default watchlist can be created for each user.

---

# 17. WatchlistItem Table

## Domain Owner

Watchlists

## Purpose

Represents one monitored company or ticker inside a watchlist.

## Fields

```text
id                  string
userId              string
watchlistId         string
companyId           string nullable
tickerSymbol        string
targetBuyPrice      decimal nullable
targetSellPrice     decimal nullable
priority            enum WatchlistPriority default MEDIUM
status              enum WatchlistItemStatus default ACTIVE
notes               string nullable
addedAt             datetime
createdAt           datetime
updatedAt           datetime
```

## WatchlistPriority Enum

```text
LOW
MEDIUM
HIGH
CRITICAL
```

## WatchlistItemStatus Enum

```text
ACTIVE
PAUSED
ARCHIVED
RESEARCHING
```

## Relationships

```text
WatchlistItem belongs to User
WatchlistItem belongs to Watchlist
WatchlistItem optionally belongs to Company
```

## MVP Notes

Start with:

- Ticker
- Target buy price
- Priority
- Notes

---

# 18. Company Table

## Domain Owner

Company Fundamentals / Market Data

## Purpose

Stores normalized company or security reference data.

## Fields

```text
id              string
tickerSymbol    string
name            string
exchange        string nullable
currency        string default "USD"
sector          string nullable
industry        string nullable
country         string nullable
website         string nullable
description     string nullable
cik             string nullable
isin            string nullable
figi            string nullable
createdAt       datetime
updatedAt       datetime
```

## Relationships

```text
Company has many Transactions
Company has many PortfolioHoldings
Company has many WatchlistItems
Company has many MarketDataSnapshots
Company has many CompanyFundamentals
Company has many NewsArticles through NewsArticleCompany
Company has many Filings
Company has many EarningsEvents
Company has many ThemeCompanies
```

## Rules

The app should avoid creating duplicate Company records for the same ticker and exchange.

A ticker alone may not always be globally unique, so the long-term uniqueness rule may use:

```text
tickerSymbol + exchange
```

## MVP Notes

Use tickerSymbol as the main practical identifier early, but design so better identifiers can be added later.

---

# 19. Theme Table

## Domain Owner

Themes

## Purpose

Stores long-term investment themes.

## Fields

```text
id              string
userId          string nullable
name            string
slug            string unique
description     string nullable
thesis          string nullable
riskNotes       string nullable
priority        enum ThemePriority default MEDIUM
createdAt       datetime
updatedAt       datetime
```

## ThemePriority Enum

```text
LOW
MEDIUM
HIGH
CORE
```

## Relationships

```text
Theme has many ThemeCompanies
Theme may belong to User if user-created
```

## Notes

Some themes may be global system themes.

Some themes may be user-created.

Examples:

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

---

# 20. ThemeCompany Table

## Domain Owner

Themes

## Purpose

Join table between Theme and Company.

## Fields

```text
id              string
themeId         string
companyId       string
userId          string nullable
conviction      enum ThemeConviction nullable
notes           string nullable
createdAt       datetime
updatedAt       datetime
```

## ThemeConviction Enum

```text
LOW
MEDIUM
HIGH
CORE
```

## Relationships

```text
ThemeCompany belongs to Theme
ThemeCompany belongs to Company
ThemeCompany optionally belongs to User
```

## Rules

Avoid duplicate theme-company links for the same user/theme/company combination.

---

# 21. MarketDataSnapshot Table

## Domain Owner

Market Data

## Purpose

Caches market data from external providers.

## Fields

```text
id              string
companyId       string nullable
tickerSymbol    string
price           decimal
open            decimal nullable
high            decimal nullable
low             decimal nullable
close           decimal nullable
previousClose   decimal nullable
volume          bigint nullable
marketCap       decimal nullable
currency        string default "USD"
provider        string
asOf            datetime
createdAt       datetime
```

## Relationships

```text
MarketDataSnapshot optionally belongs to Company
```

## Rules

Market data should be cached to reduce provider cost and rate limit issues.

Provider-specific raw data should not leak into UI components.

## MVP Notes

Start with current/latest price snapshots.

Historical candle storage can come later.

---

# 22. CompanyFundamental Table

## Domain Owner

Company Fundamentals

## Purpose

Stores financial statement and valuation data.

## Fields

```text
id                  string
companyId           string
tickerSymbol        string
fiscalYear          int nullable
fiscalQuarter       int nullable
period              string nullable
revenue             decimal nullable
grossProfit         decimal nullable
operatingIncome     decimal nullable
netIncome           decimal nullable
eps                 decimal nullable
freeCashFlow        decimal nullable
cashAndEquivalents  decimal nullable
totalDebt           decimal nullable
grossMargin         decimal nullable
operatingMargin     decimal nullable
netMargin           decimal nullable
peRatio             decimal nullable
priceToSales        decimal nullable
priceToBook         decimal nullable
provider            string
asOf                datetime
createdAt           datetime
updatedAt           datetime
```

## Relationships

```text
CompanyFundamental belongs to Company
```

## MVP Notes

This table can be added after basic portfolio, watchlist, and market data features are stable.

---

# 23. NewsArticle Table

## Domain Owner

News

## Purpose

Stores metadata for news articles.

## Fields

```text
id              string
title           string
source          string
url             string unique
publishedAt     datetime
summary         string nullable
provider        string nullable
relevanceScore  decimal nullable
createdAt       datetime
updatedAt       datetime
```

## Relationships

```text
NewsArticle may relate to many Companies through NewsArticleCompany
NewsArticle may relate to many Themes through NewsArticleTheme
```

## MVP Notes

Full news ingestion can be deferred until the core dashboard works.

---

# 24. NewsArticleCompany Table

## Domain Owner

News

## Purpose

Join table between news articles and companies.

## Fields

```text
id              string
newsArticleId   string
companyId       string
tickerSymbol    string
relevanceScore  decimal nullable
createdAt       datetime
```

## Relationships

```text
NewsArticleCompany belongs to NewsArticle
NewsArticleCompany belongs to Company
```

---

# 25. NewsArticleTheme Table

## Domain Owner

News / Themes

## Purpose

Join table between news articles and investment themes.

## Fields

```text
id              string
newsArticleId   string
themeId         string
relevanceScore  decimal nullable
createdAt       datetime
```

## Relationships

```text
NewsArticleTheme belongs to NewsArticle
NewsArticleTheme belongs to Theme
```

---

# 26. Filing Table

## Domain Owner

Filings

## Purpose

Stores regulatory filing metadata.

## Fields

```text
id              string
companyId       string
tickerSymbol    string
filingType      string
filingDate      datetime
accessionNumber string nullable
url             string
provider        string default "SEC"
summaryStatus   enum SummaryStatus default NOT_SUMMARIZED
createdAt       datetime
updatedAt       datetime
```

## SummaryStatus Enum

```text
NOT_SUMMARIZED
QUEUED
SUMMARIZED
FAILED
```

## Relationships

```text
Filing belongs to Company
Filing may have many AIAnalyses
```

## MVP Notes

Can be deferred until research engine phase.

---

# 27. EarningsEvent Table

## Domain Owner

Earnings

## Purpose

Stores earnings calendar and reported earnings data.

## Fields

```text
id                  string
companyId           string
tickerSymbol        string
earningsDate        datetime
fiscalYear          int nullable
fiscalQuarter       int nullable
reportedRevenue     decimal nullable
estimatedRevenue    decimal nullable
reportedEps         decimal nullable
estimatedEps        decimal nullable
callTranscriptUrl   string nullable
status              enum EarningsEventStatus default SCHEDULED
provider            string nullable
createdAt           datetime
updatedAt           datetime
```

## EarningsEventStatus Enum

```text
SCHEDULED
REPORTED
SUMMARIZED
FAILED
```

## Relationships

```text
EarningsEvent belongs to Company
EarningsEvent may have many AIAnalyses
```

## MVP Notes

Can start with earnings date only.

Transcript support can come later.

---

# 28. Alert Table

## Domain Owner

Alerts

## Purpose

Stores alert records when something deserves user attention.

## Fields

```text
id              string
userId          string
portfolioId     string nullable
companyId       string nullable
tickerSymbol    string nullable
type            enum AlertType
severity        enum AlertSeverity
status          enum AlertStatus default NEW
title           string
message         string
triggeredAt     datetime
source          string nullable
metadata        json nullable
createdAt       datetime
updatedAt       datetime
```

## AlertType Enum

```text
PRICE_TARGET
PRICE_MOVE
PORTFOLIO_RISK
EARNINGS
NEWS
FILING
VALUATION
WATCHLIST
SYSTEM
```

## AlertSeverity Enum

```text
LOW
MEDIUM
HIGH
CRITICAL
```

## AlertStatus Enum

```text
NEW
READ
DISMISSED
ARCHIVED
```

## Relationships

```text
Alert belongs to User
Alert optionally belongs to Portfolio
Alert optionally belongs to Company
Alert may have many Notifications
```

## Rules

Alerts must be explainable.

An alert should store enough context for the user to understand why it triggered.

---

# 29. Notification Table

## Domain Owner

Notifications

## Purpose

Stores delivery attempts and in-app notification records.

## Fields

```text
id              string
userId          string
alertId         string nullable
reportId        string nullable
type            enum NotificationType
channel         enum NotificationChannel
status          enum NotificationStatus
title           string
body            string
sentAt          datetime nullable
readAt          datetime nullable
provider        string nullable
providerMessageId string nullable
errorMessage    string nullable
createdAt       datetime
updatedAt       datetime
```

## NotificationType Enum

```text
ALERT
REPORT
SYSTEM
```

## NotificationChannel Enum

```text
EMAIL
IN_APP
SMS
PUSH
```

## NotificationStatus Enum

```text
PENDING
SENT
FAILED
READ
DISMISSED
```

## Relationships

```text
Notification belongs to User
Notification optionally belongs to Alert
Notification optionally belongs to Report
```

## MVP Notes

Use EMAIL and IN_APP only at first.

SMS and push should be deferred.

---

# 30. Report Table

## Domain Owner

Reports

## Purpose

Stores durable reports and summaries.

## Fields

```text
id              string
userId          string
portfolioId     string nullable
type            enum ReportType
status          enum ReportStatus default GENERATED
title           string
summary         string nullable
body            string
metadata        json nullable
generatedAt     datetime
readAt          datetime nullable
archivedAt      datetime nullable
createdAt       datetime
updatedAt       datetime
```

## ReportType Enum

```text
MORNING_BRIEF
MARKET_CLOSE
WEEKLY_CIO_REVIEW
COMPANY_RESEARCH
EARNINGS_SUMMARY
THEME_UPDATE
RISK_REVIEW
WATCHLIST_REVIEW
SYSTEM
```

## ReportStatus Enum

```text
DRAFT
GENERATED
SENT
FAILED
ARCHIVED
```

## Relationships

```text
Report belongs to User
Report optionally belongs to Portfolio
Report may have many Notifications
Report may have many AIAnalyses
```

## Rules

Reports should be stored after generation so the user can review them later.

---

# 31. AIAnalysis Table

## Domain Owner

AI Analysis

## Purpose

Stores AI-generated analysis records.

## Fields

```text
id              string
userId          string nullable
portfolioId     string nullable
companyId       string nullable
reportId        string nullable
type            enum AIAnalysisType
agentRole       enum AIAgentRole
model           string nullable
promptVersion   string nullable
inputSummary    string nullable
outputText      string
confidence      enum AIConfidence nullable
metadata        json nullable
createdAt       datetime
updatedAt       datetime
```

## AIAnalysisType Enum

```text
COMPANY_ANALYSIS
NEWS_SUMMARY
EARNINGS_ANALYSIS
VALUATION_ANALYSIS
RISK_ANALYSIS
THEME_ANALYSIS
PORTFOLIO_REVIEW
REPORT_DRAFT
CIO_SUMMARY
```

## AIAgentRole Enum

```text
CIO_AGENT
NEWS_ANALYST
EARNINGS_ANALYST
VALUATION_ANALYST
RISK_ANALYST
THEME_ANALYST
REPORT_WRITER
```

## AIConfidence Enum

```text
LOW
MEDIUM
HIGH
```

## Relationships

```text
AIAnalysis optionally belongs to User
AIAnalysis optionally belongs to Portfolio
AIAnalysis optionally belongs to Company
AIAnalysis optionally belongs to Report
```

## Rules

AI outputs should not be treated as guaranteed truth.

They are analysis records and should include context where possible.

---

# 32. AutomationRun Table

## Domain Owner

Automation

## Purpose

Stores scheduled job and workflow run history.

## Fields

```text
id              string
userId          string nullable
workflowName    string
workflowType    enum WorkflowType
status          enum AutomationStatus
startedAt       datetime
finishedAt      datetime nullable
durationMs      int nullable
triggerSource   string nullable
errorMessage    string nullable
metadata        json nullable
createdAt       datetime
updatedAt       datetime
```

## WorkflowType Enum

```text
MORNING_BRIEF
MARKET_CLOSE_REPORT
WEEKLY_REVIEW
WATCHLIST_CHECK
PORTFOLIO_RISK_CHECK
EARNINGS_CHECK
NEWS_CHECK
SYSTEM
```

## AutomationStatus Enum

```text
QUEUED
RUNNING
SUCCESS
FAILED
PARTIAL_SUCCESS
CANCELLED
```

## Relationships

```text
AutomationRun optionally belongs to User
```

## Rules

Automations should never fail silently.

Every scheduled workflow should create or update an AutomationRun record.

---

# 33. ProviderRequestLog Table

## Domain Owner

Logging and Observability

## Purpose

Tracks calls to external providers for debugging, cost control, and reliability monitoring.

## Fields

```text
id              string
provider        string
service         string
endpoint        string nullable
status          enum ProviderRequestStatus
durationMs      int nullable
rateLimited     boolean default false
errorMessage    string nullable
metadata        json nullable
createdAt       datetime
```

## ProviderRequestStatus Enum

```text
SUCCESS
FAILED
RATE_LIMITED
TIMEOUT
CACHED
```

## MVP Notes

This can be added after first provider integrations exist.

---

# 34. DecisionJournalEntry Table

## Domain Owner

Reports / Portfolio / AI Analysis

## Purpose

Stores user investment decisions and reasoning.

## Fields

```text
id              string
userId          string
portfolioId     string nullable
companyId       string nullable
tickerSymbol    string nullable
decisionType    enum DecisionType
title           string
reasoning       string
relatedReportId string nullable
createdAt       datetime
updatedAt       datetime
```

## DecisionType Enum

```text
BUY
SELL
HOLD
WATCH
IGNORE
RESEARCH_MORE
```

## MVP Notes

This is valuable but can be deferred until the core dashboard is stable.

---

# 35. Indexing Guidelines

Indexes should be added for commonly queried fields.

Recommended indexes:

```text
User.email

Portfolio.userId

Transaction.userId
Transaction.portfolioId
Transaction.tickerSymbol
Transaction.tradeDate

PortfolioHolding.userId
PortfolioHolding.portfolioId
PortfolioHolding.tickerSymbol

Watchlist.userId

WatchlistItem.userId
WatchlistItem.watchlistId
WatchlistItem.tickerSymbol

Company.tickerSymbol
Company.tickerSymbol + Company.exchange

Theme.slug

MarketDataSnapshot.tickerSymbol
MarketDataSnapshot.companyId
MarketDataSnapshot.asOf

Alert.userId
Alert.status
Alert.triggeredAt
Alert.tickerSymbol

Notification.userId
Notification.status
Notification.createdAt

Report.userId
Report.type
Report.generatedAt

AIAnalysis.userId
AIAnalysis.companyId
AIAnalysis.type
AIAnalysis.createdAt

AutomationRun.workflowName
AutomationRun.status
AutomationRun.startedAt
```

Do not add excessive indexes before performance requires them.

---

# 36. Decimal and Money Rules

Financial values should avoid floating point precision problems.

Use Decimal-compatible database types through Prisma.

Money-like fields include:

```text
price
fees
costBasis
marketValue
targetBuyPrice
targetSellPrice
totalMarketValue
totalCostBasis
revenue
netIncome
freeCashFlow
```

Rules:

- Do not use JavaScript floating point numbers for important money calculations without careful conversion.
- Use Decimal support where possible.
- Store currency explicitly.
- Avoid assuming everything is USD forever.

---

# 37. JSON Metadata Rules

Some tables include `metadata` fields.

Metadata is useful for flexible provider details, but it should not replace proper schema design.

Good use of metadata:

```text
Provider response identifiers
Extra alert context
Report source references
AI token usage
Workflow diagnostic details
```

Bad use of metadata:

```text
Storing core transaction data
Storing portfolio holdings
Storing fields that are frequently queried
Hiding important data because schema was not designed
```

If a metadata field becomes important and frequently used, convert it into a real column.

---

# 38. Data Retention Rules

For MVP, keep important records unless the user intentionally deletes them.

Important records:

```text
Transactions
Reports
Alerts
AI analyses
Automation runs
Notifications
```

Market data cache may be pruned later if it becomes too large.

Provider request logs may also be pruned later.

---

# 39. Security Rules

Database security rules:

- Never store API keys in normal app tables.
- Never store real `.env` secrets in the database unless using a secure secret manager.
- Never expose private portfolio data without authentication.
- Never log secrets in error messages.
- Avoid storing brokerage credentials in Version 1.
- Keep user financial data access scoped by `userId`.

---

# 40. MVP Prisma Model Planning

When Codex eventually creates the Prisma schema, it should start with a small but useful set.

Recommended first schema batch:

```text
User
UserSettings
Portfolio
Transaction
PortfolioHolding
Watchlist
WatchlistItem
Company
Theme
ThemeCompany
MarketDataSnapshot
Alert
Notification
Report
AIAnalysis
AutomationRun
```

Deferred models:

```text
PortfolioSnapshot
CompanyFundamental
NewsArticle
NewsArticleCompany
NewsArticleTheme
Filing
EarningsEvent
ProviderRequestLog
DecisionJournalEntry
```

This keeps the MVP schema strong but not too bloated.

---

# 41. Migration Rules

Codex must follow these rules when creating or changing migrations:

1. Read this document first.
2. Identify which domain owns the schema change.
3. Explain why the schema change is needed.
4. Avoid destructive migrations unless explicitly approved.
5. Do not rename or delete important fields without a migration plan.
6. Update this document if the schema meaning changes.
7. Update `/docs/04_API_CONTRACTS.md` if API inputs or outputs are affected.
8. Update `/docs/14_DECISION_LOG.md` for major schema decisions.

---

# 42. Open Database Decisions

These decisions are not final yet.

## 42.1 ID Strategy

Options:

```text
cuid
uuid
database-generated uuid
```

Initial recommendation:

```text
Use Prisma cuid or uuid consistently.
```

Status:

```text
Open
```

## 42.2 Portfolio Holding Storage

Options:

```text
Calculate holdings live from transactions
Store current holdings as derived snapshots
Use both
```

Initial recommendation:

```text
Use both: transactions as source of truth, PortfolioHolding as derived current state.
```

Status:

```text
Open
```

## 42.3 Auth Schema

Options:

```text
NextAuth/Auth.js schema
Clerk user mapping
Supabase Auth user mapping
Custom user table
```

Status:

```text
Open
```

## 42.4 Market Data History Depth

Options:

```text
Latest price only
Daily historical snapshots
Full OHLCV history
```

Initial recommendation:

```text
Start with latest price snapshots. Add historical OHLCV later.
```

Status:

```text
Open
```

---

# 43. Codex Database Checklist

Before Codex changes the database, it must answer:

```text
1. Which domain owns this table or field?
2. Is this user-owned data?
3. Does it need userId?
4. Does it need portfolioId?
5. Does it need timestamps?
6. Does it need indexes?
7. Is this a core field or metadata?
8. Could this create duplicate records?
9. Could this break existing data?
10. Does this require a migration?
11. Does this require updating API contracts?
12. Does this require updating docs?
```

---

# 44. Final Database Principle

The database should make AI CIO more trustworthy.

The user should be able to understand:

- What data was stored
- Where it came from
- When it was created
- Why an alert triggered
- What report was generated
- What AI analysis said at the time
- What changed later

A good database does not just power the app. It preserves the reasoning history behind the investment process.
