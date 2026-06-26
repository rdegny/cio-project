# AI CIO Product Constitution

Version: 0.1  
Project Name: AI CIO  
Owner: Personal investment research and portfolio intelligence system  
Primary User: Individual long-term investor  
Status: Architecture foundation document

---

## 1. Purpose of This Document

This document is the highest-level source of truth for the AI CIO project.

Every Codex session must read this document before generating, editing, or refactoring code.

This document defines:

- What the product is
- What the product is not
- The architectural principles
- The investment philosophy
- The development rules
- The AI behavior rules
- The documentation requirements
- The architecture documents Codex must review before coding

No feature should be built in a way that violates this constitution.

---

## 2. Product Mission

AI CIO is a personal investment intelligence platform designed to help an individual investor monitor markets, manage watchlists, evaluate companies, track portfolio risk, analyze investment themes, and receive actionable research summaries.

The goal is to give the user a lightweight version of an institutional investment workflow without requiring institutional-level money, staff, or infrastructure.

AI CIO should act like a disciplined investment assistant, not a gambling tool.

It should help the user answer questions like:

- What changed in the market today?
- Which companies in my portfolio need attention?
- Which stocks on my watchlist are approaching attractive prices?
- What major risks are building in my portfolio?
- What themes are gaining strength?
- What news, earnings, filings, or macro events matter?
- What should I research further before buying or selling?
- What should I ignore because it is noise?

---

## 3. Product Identity

AI CIO is not just a stock dashboard.

It is a modular investment operating system with four main layers:

1. Data Layer  
   Collects prices, financial statements, news, filings, earnings data, macro data, and user portfolio data.

2. Intelligence Layer  
   Uses rules, calculations, models, and AI analysis to convert raw data into useful insights.

3. Automation Layer  
   Runs scheduled workflows such as morning briefs, market close reports, earnings alerts, valuation updates, and watchlist checks.

4. Interface Layer  
   Gives the user a clear dashboard, research tools, watchlists, alerts, and reports.

The system should feel like a personal Chief Investment Officer that watches the market, organizes information, and helps the user think clearly.

---

## 4. Core Product Principles

### 4.1 Clarity Over Complexity

The product should simplify investing, not overwhelm the user.

If a screen, report, or alert cannot explain why it matters, it should not exist.

### 4.2 Evidence Before Opinion

Every AI-generated investment insight should be backed by evidence.

Acceptable evidence includes:

- Price movement
- Valuation metrics
- Revenue growth
- Margin changes
- Balance sheet strength
- Earnings results
- SEC filings
- News events
- Analyst estimate changes
- Insider transactions
- Sector trends
- Macro data
- Portfolio exposure

The AI should not give unsupported opinions.

### 4.3 Human Makes Final Decisions

AI CIO must not place trades automatically.

The system may suggest, warn, rank, summarize, and analyze, but the user must make the final buy, sell, hold, or ignore decision.

### 4.4 Long-Term Investing First

The system is designed primarily for long-term investing, not day trading.

Short-term price movement can be monitored, but the core focus should be:

- Business quality
- Valuation
- Competitive advantage
- Risk
- Earnings power
- Long-term themes
- Portfolio construction

### 4.5 Modular Architecture

Every major domain should be isolated enough that it can be changed without breaking the whole system.

Examples:

- Market data providers should be swappable.
- AI models should be swappable.
- Email delivery should be swappable.
- Database tables should have clear ownership.
- UI pages should not directly call third-party APIs.

### 4.6 Documentation Is Part of the Product

No feature is complete unless documentation is updated.

The project should remain understandable six months later, even if the user forgets how it was built.

---

## 5. What AI CIO Is Not

AI CIO is not:

- A brokerage platform
- A high-frequency trading system
- A crypto trading bot
- A meme stock scanner
- A gambling tool
- A fully automated trading robot
- A replacement for the user's judgment
- A financial advisor
- A tool that guarantees returns

Version 1 should not include:

- Automatic trade execution
- Options trading
- Margin trading
- Crypto trading
- Social media sentiment trading
- Complex tax optimization
- Broker account write access
- Paid institutional data dependencies unless explicitly approved

---

## 6. Target User

The primary user is an individual investor who wants an affordable AI-powered investment research system.

The user may have:

- A growing portfolio
- A large watchlist
- Multiple investment themes
- Limited time to manually monitor every company
- Interest in long-term wealth building
- Interest in sectors such as European defense, nuclear energy, AI infrastructure, energy, cybersecurity, industrials, and other strategic themes

The system should assume the user is intelligent and ambitious but does not have time to manually track hundreds of stocks every day.

---

## 7. Investment Philosophy

AI CIO should be built around disciplined investing.

The system should favor:

- Durable businesses
- Strong balance sheets
- Long-term earnings growth
- Reasonable valuation
- High-quality management
- Strategic industry positioning
- Secular growth themes
- Risk-adjusted opportunity
- Clear downside analysis

The system should be skeptical of:

- Hype-driven price movement
- Unsupported narratives
- Companies with weak financials
- Excessive debt
- Dilution risk
- Unclear business models
- Overconcentrated portfolio exposure
- Emotional buy/sell decisions

The AI should help the user become calmer, more informed, and more consistent.

---

## 8. Main Product Domains

The system should be organized around domains, not random features.

Each domain should have clear ownership, inputs, outputs, and boundaries.

### 8.1 Authentication

Responsible for user login, session management, access control, and user identity.

Should not be responsible for portfolio calculations, market data, or AI analysis.

### 8.2 Portfolio

Responsible for holdings, positions, cost basis, allocation, gains/losses, portfolio value, sector exposure, and theme exposure.

Should not directly fetch raw market data from third-party APIs. It should use the Market Data domain.

### 8.3 Transactions

Responsible for buys, sells, dividends, deposits, withdrawals, splits, and manual adjustments.

Transactions are the source of truth for position history.

### 8.4 Watchlists

Responsible for stocks the user is monitoring, target buy prices, alert thresholds, user notes, priority levels, and watchlist categories.

### 8.5 Market Data

Responsible for prices, historical candles, volume, market cap, company metadata, sector, and industry classification.

The app should not hard-code itself to one provider.

Use a provider adapter pattern:

```text
Application
→ Market Data Service
→ Provider Adapter
→ External API
```

### 8.6 Company Fundamentals

Responsible for revenue, earnings, margins, cash flow, debt, balance sheet metrics, valuation ratios, and historical financials.

### 8.7 News

Responsible for company news, sector news, macro news, theme news, source tracking, article metadata, and relevance scoring.

### 8.8 SEC Filings / Regulatory Filings

Responsible for 10-K, 10-Q, 8-K, insider trading filings, major ownership changes, and filing summaries.

### 8.9 Earnings

Responsible for earnings dates, reported results, guidance, transcript summaries, estimate comparisons, and post-earnings AI analysis.

### 8.10 Themes

Responsible for investment themes, theme companies, theme watchlists, theme news, theme risk, and theme ranking.

Example themes:

- European defense
- Nuclear energy
- AI infrastructure
- Cybersecurity
- Energy security
- Industrial reshoring
- Aerospace and defense
- Grid modernization

### 8.11 Risk

Responsible for position concentration, sector concentration, theme concentration, volatility, drawdown, correlation, debt risk, valuation risk, news risk, and earnings risk.

### 8.12 Alerts

Responsible for price alerts, valuation alerts, news alerts, earnings alerts, risk alerts, portfolio alerts, and watchlist alerts.

Alerts should be explainable.

Bad alert:

```text
Buy OKLO
```

Good alert:

```text
OKLO is down 8.4% this week and is now within 5% of your target research price. Recent news does not show a clear business deterioration. Review before taking action.
```

### 8.13 Notifications

Responsible for email, in-app notifications, and future SMS or push notifications.

Notification delivery should be separate from alert logic.

### 8.14 AI Analysis

Responsible for summaries, research notes, company analysis, earnings analysis, news analysis, portfolio analysis, risk explanations, investment thesis generation, and counterargument generation.

AI analysis must be stored when useful so the system can track how views evolve over time.

### 8.15 Automation

Responsible for scheduled workflows, morning brief, market close report, weekly review, earnings monitoring, watchlist monitoring, and portfolio risk checks.

Automation should be observable, logged, and recoverable.

### 8.16 Dashboard / UI

Responsible for user-facing pages, charts, tables, cards, forms, reports, navigation, and visual hierarchy.

The UI should consume internal APIs or server-side services. It should not directly own business logic.

---

## 9. Proposed Technical Architecture

The default architecture should be:

```text
Frontend: Next.js + TypeScript
Styling: Tailwind CSS or equivalent component-friendly styling system
Backend: Next.js server actions / API routes initially
Database: PostgreSQL
ORM: Prisma or equivalent type-safe database layer
Automation: N8N for workflow automation, application-level scheduled jobs where appropriate
AI: OpenAI API or model-agnostic AI service wrapper
Hosting: Affordable VPS, Vercel, Supabase, Railway, or similar depending on cost and complexity
Email: Provider-agnostic email service wrapper
Charts: Reusable chart components
Version Control: Git + GitHub
```

These are defaults, not permanent decisions.

Any future stack change must be documented in the architecture decision log.

---

## 10. System Architecture Rule

The frontend must not directly depend on external market APIs, news APIs, AI APIs, or email APIs.

Correct pattern:

```text
UI
→ Internal service
→ Provider adapter
→ External API
```

Incorrect pattern:

```text
UI
→ Polygon API
```

This protects the system from vendor changes, API pricing changes, and future migrations.

---

## 11. Data Flow Principles

Every important piece of data should have a known path.

Example:

```text
External Market API
→ Market Data Adapter
→ Market Data Service
→ Database Cache
→ Portfolio Service
→ Risk Service
→ Dashboard
→ Email Brief
```

Every data flow should answer:

- Where does the data come from?
- How often is it updated?
- Where is it stored?
- Is it cached?
- What service owns it?
- What features depend on it?
- What happens if it fails?

---

## 12. AI Architecture

AI CIO should use specialized AI roles instead of one giant prompt.

The system may include these AI roles:

### 12.1 CIO Agent

Coordinates investment analysis, produces final summaries, balances bullish and bearish evidence, and helps prioritize what the user should review.

The CIO Agent should not fetch raw data directly. It should receive structured context from other services.

### 12.2 News Analyst

Summarizes relevant news, separates signal from noise, and identifies company-specific and theme-specific developments.

### 12.3 Earnings Analyst

Summarizes earnings results, compares results to expectations, identifies changes in guidance, and highlights margin, revenue, cash flow, and management commentary.

### 12.4 Valuation Analyst

Reviews valuation metrics, compares valuation to historical ranges and peers, and flags expensive or potentially attractive setups.

### 12.5 Risk Analyst

Reviews portfolio risk, flags concentration, explains downside scenarios, and identifies risk clusters.

### 12.6 Theme Analyst

Tracks investment themes, monitors companies connected to those themes, and identifies policy, spending, regulation, or industry changes.

### 12.7 Report Writer

Turns analysis into readable emails, dashboard summaries, and weekly reports.

---

## 13. AI Behavior Rules

AI output must be clear, evidence-based, balanced, traceable, cautious with uncertainty, written in plain English, and useful for decision-making.

AI output must not:

- Guarantee returns
- Tell the user to blindly buy or sell
- Pretend uncertain data is certain
- Hide assumptions
- Ignore risk
- Generate unsupported price targets
- Confuse short-term noise with long-term thesis changes

When giving investment analysis, AI should usually include:

- What happened
- Why it matters
- Bullish interpretation
- Bearish interpretation
- What to monitor next
- Suggested user action such as research, monitor, review, or ignore

The system should prefer phrasing like:

```text
Review this position
```

instead of:

```text
Buy this stock immediately
```

---

## 14. Automation Philosophy

Automation should reduce manual work without reducing user control.

Good automations:

- Morning portfolio brief
- Market close recap
- Watchlist price alert
- Earnings report summary
- Weekly portfolio risk review
- Theme development alert
- Major news alert
- Valuation threshold alert

Bad automations:

- Automatic buying
- Automatic selling
- High-frequency trading
- Unexplained recommendations
- Alerts with no context
- Duplicate spam alerts

Every automation must have:

- Trigger
- Inputs
- Output
- Failure behavior
- Logging
- Notification rules
- Documentation

---

## 15. Email Philosophy

Emails should be useful, not noisy.

The user may receive multiple emails per day, but each email must justify its existence.

Email types may include:

### Morning Brief

Purpose:

- Prepare user before market open
- Show overnight news
- Highlight portfolio risks
- Highlight watchlist movement
- Show important earnings or macro events

### Market Close Report

Purpose:

- Summarize what happened during the day
- Explain major portfolio moves
- Identify what needs attention tomorrow

### Urgent Alert

Purpose:

- Notify user when something important happens
- Examples: large price move, earnings surprise, major filing, major news event, target price reached

### Weekly CIO Review

Purpose:

- Higher-level portfolio reflection
- Risk review
- Theme review
- Watchlist review
- Possible action list

Emails should be structured, skimmable, and calm.

---

## 16. UI Philosophy

The interface should feel like a clean investment command center.

Design goals:

- Calm
- Serious
- Fast
- Information-dense but not cluttered
- Professional
- Mobile-friendly
- Easy to scan

Avoid:

- Meme-like UI
- Excessive animations
- Overly colorful dashboards
- Confusing charts
- Unexplained AI recommendations
- Too many alerts on one page

Core screens:

- Dashboard
- Portfolio
- Watchlists
- Company Research
- Themes
- Alerts
- Reports
- Settings
- Automation Logs

---

## 17. Security Principles

Even if this begins as a personal project, it must be built with serious security habits.

Required principles:

- Never expose API keys in frontend code
- Store secrets in environment variables or secure secret storage
- Do not commit secrets to Git
- Use authentication before showing portfolio data
- Validate all user input
- Log errors without leaking secrets
- Back up important data
- Use least-privilege permissions
- Avoid storing brokerage login credentials in Version 1

The system should not connect to brokerage accounts with trade permissions until the product is mature and security has been reviewed.

---

## 18. Cost Principles

This product should be affordable to operate.

The architecture should prefer:

- Free or low-cost APIs when acceptable
- Caching to reduce API calls
- Scheduled batch updates instead of constant polling
- Provider abstraction to avoid vendor lock-in
- N8N or similar low-cost automation
- Self-hosting where practical
- Incremental upgrades only when needed

The product should not depend on expensive institutional data sources in Version 1.

---

## 19. Error Handling Principles

Failures are expected.

The system should handle:

- API rate limits
- API downtime
- Missing data
- Delayed prices
- AI model errors
- Email delivery failure
- Database connection issues
- Automation job failures
- Invalid user input

A failed data source should not crash the whole app.

The system should show graceful fallback messages and log the issue.

---

## 20. Performance Principles

The app should feel fast.

Target goals:

- Dashboard loads quickly
- Cached data should be used when real-time data is unnecessary
- Heavy AI analysis should run in background jobs
- Reports should be stored after generation
- Expensive calculations should not rerun unnecessarily
- UI should not block while waiting for long AI responses

---

## 21. Testing Philosophy

Every important feature should be tested at three levels.

### 21.1 Unit Tests

Test individual functions.

Examples:

- Portfolio return calculation
- Allocation percentage
- Alert threshold logic
- Risk scoring helper
- Data normalization

### 21.2 Integration Tests

Test services working together.

Examples:

- Market data service saves prices correctly
- Alert service reads watchlist thresholds
- Email service sends generated report
- AI service stores analysis result

### 21.3 Manual Tests

Test user behavior.

Examples:

- Add a holding
- Add a stock to watchlist
- Trigger alert
- View dashboard on phone
- Generate morning brief
- Search company
- Open company research page

No feature should be considered finished until manual testing notes are documented.

---

## 22. Documentation Requirements

Documentation is mandatory.

Every feature must update relevant documentation.

The project should maintain these documents:

```text
/docs/00_PRODUCT_CONSTITUTION.md
/docs/01_ARCHITECTURE_OVERVIEW.md
/docs/02_DOMAIN_MAP.md
/docs/03_DATABASE_SCHEMA.md
/docs/04_API_CONTRACTS.md
/docs/05_DATA_PROVIDERS.md
/docs/06_AI_ARCHITECTURE.md
/docs/07_AUTOMATION_WORKFLOWS.md
/docs/08_UI_DESIGN_SYSTEM.md
/docs/09_SECURITY_MODEL.md
/docs/10_TESTING_STRATEGY.md
/docs/11_DEPLOYMENT_AND_HOSTING.md
/docs/12_COST_MODEL.md
/docs/13_FEATURE_ROADMAP.md
/docs/14_DECISION_LOG.md
/docs/15_CODEX_WORKFLOW.md
```

Each document has a specific purpose.

---

## 23. Architecture Document Responsibilities

### 23.1 00_PRODUCT_CONSTITUTION.md

Defines the mission, rules, boundaries, and principles of the entire project.

Codex must read this first.

### 23.2 01_ARCHITECTURE_OVERVIEW.md

Explains the high-level system architecture.

Should include app structure, frontend/backend relationship, data flow, service boundaries, external dependencies, and deployment overview.

### 23.3 02_DOMAIN_MAP.md

Defines each business domain.

Should include domain responsibilities, ownership, exclusions, and cross-domain dependencies.

### 23.4 03_DATABASE_SCHEMA.md

Defines database tables and relationships.

Should include tables, fields, types, relationships, indexes, ownership, and migration notes.

### 23.5 04_API_CONTRACTS.md

Defines internal API contracts.

Should include endpoint names, request format, response format, error behavior, and authentication requirements.

### 23.6 05_DATA_PROVIDERS.md

Defines external data sources.

Should include market data providers, news providers, financial statement providers, SEC filing sources, macro data sources, rate limits, cost, and fallback providers.

### 23.7 06_AI_ARCHITECTURE.md

Defines the AI agents and prompts.

Should include agent roles, inputs, outputs, prompt templates, guardrails, model selection, stored AI outputs, and evaluation rules.

### 23.8 07_AUTOMATION_WORKFLOWS.md

Defines scheduled and event-based workflows.

Should include morning brief, market close report, weekly review, earnings alerts, price alerts, watchlist alerts, failure behavior, and logs.

### 23.9 08_UI_DESIGN_SYSTEM.md

Defines UI rules.

Should include layout principles, colors, typography, components, charts, cards, tables, mobile behavior, loading states, empty states, and error states.

### 23.10 09_SECURITY_MODEL.md

Defines security rules.

Should include authentication, authorization, secret handling, API key rules, user data protection, and backup rules.

### 23.11 10_TESTING_STRATEGY.md

Defines how features are tested.

Should include unit testing, integration testing, manual testing, regression testing, and test checklist format.

### 23.12 11_DEPLOYMENT_AND_HOSTING.md

Defines how the app is deployed.

Should include hosting provider, environment variables, build process, database hosting, N8N hosting, logs, backups, and rollback process.

### 23.13 12_COST_MODEL.md

Tracks estimated operating costs.

Should include hosting costs, AI costs, API costs, email costs, database costs, and upgrade triggers.

### 23.14 13_FEATURE_ROADMAP.md

Defines planned versions.

Should include MVP, Version 1, Version 2, Version 3, future ideas, and deferred features.

### 23.15 14_DECISION_LOG.md

Tracks architectural decisions.

Each decision should include date, decision, reason, alternatives considered, and consequences.

### 23.16 15_CODEX_WORKFLOW.md

Defines how Codex should work.

Should include required read order, prompt batching rules, code diff rules, testing rules, documentation update rules, and review loop process.

---

## 24. Required Codex Read Order

Before writing code, Codex must read:

```text
1. /docs/00_PRODUCT_CONSTITUTION.md
2. /docs/01_ARCHITECTURE_OVERVIEW.md
3. /docs/02_DOMAIN_MAP.md
4. /docs/03_DATABASE_SCHEMA.md
5. /docs/15_CODEX_WORKFLOW.md
```

Then Codex must read any feature-specific documents.

Examples:

For an AI feature:

```text
/docs/06_AI_ARCHITECTURE.md
/docs/07_AUTOMATION_WORKFLOWS.md
```

For a dashboard feature:

```text
/docs/08_UI_DESIGN_SYSTEM.md
/docs/04_API_CONTRACTS.md
```

For a market data feature:

```text
/docs/05_DATA_PROVIDERS.md
/docs/03_DATABASE_SCHEMA.md
```

For a security feature:

```text
/docs/09_SECURITY_MODEL.md
```

---

## 25. Codex Operating Rules

### 25.1 Understand Before Coding

Before writing code, Codex should:

- Review the relevant files
- Review the relevant docs
- Summarize what it understands
- Identify affected domains
- Identify likely files to change
- Identify risks

### 25.2 Small Batches Only

Codex should not implement large features in one prompt.

Large work must be split into small batches.

Each batch should have:

- Clear purpose
- Specific files
- Expected behavior
- Testing instructions
- Documentation update requirement

### 25.3 Prefer Diffs

Codex should provide code diffs when possible.

Avoid rewriting entire files unless necessary.

### 25.4 Do Not Break Existing Features

Codex must consider unrelated parts of the app before editing shared files.

Any shared utility, service, schema, or component change must be treated carefully.

### 25.5 No Silent Architecture Changes

Codex must not silently introduce new libraries, database tables, external APIs, architectural patterns, or folder structures without explaining why and updating documentation.

### 25.6 Update Documentation

If behavior changes, documentation must be updated.

A feature is incomplete if docs are stale.

### 25.7 No Secret Exposure

Codex must never hard-code API keys, database URLs, email credentials, tokens, or passwords.

Use environment variables.

### 25.8 Ask When Truly Blocked

If requirements are unclear, Codex should state assumptions.

If the assumption is safe and reversible, proceed.

If the assumption affects architecture, data model, security, cost, or user control, ask before proceeding.

---

## 26. Definition of Done

A feature is done only when:

- Code is implemented
- Code is readable
- Existing behavior is not broken
- Types pass
- Lint passes
- Tests pass or testing limitations are documented
- Manual testing steps are provided
- Relevant docs are updated
- Edge cases are considered
- Failure behavior is handled
- No secrets are exposed
- The implementation follows this constitution

---

## 27. MVP Scope

The MVP should focus on a useful personal investment dashboard.

MVP should include:

- User authentication
- Portfolio holdings
- Manual transaction entry
- Watchlist
- Market price updates
- Basic dashboard
- Basic alerts
- Daily email summary
- Company notes
- Theme tagging
- Simple AI-generated summaries
- Documentation system

MVP should not include:

- Brokerage trading
- Automatic execution
- Options
- Crypto
- Complex backtesting
- Paid institutional data
- Multi-user admin tools
- Advanced tax reporting

---

## 28. Version Roadmap

### Version 0: Architecture Foundation

Deliverables:

- Product Constitution
- Architecture overview
- Domain map
- Database schema
- API contracts
- Codex workflow document

### Version 1: Core Dashboard

Deliverables:

- Authentication
- Portfolio tracking
- Watchlist
- Manual holdings
- Market data integration
- Dashboard UI
- Basic alerts

### Version 2: Research Engine

Deliverables:

- Company research pages
- News ingestion
- Earnings tracking
- SEC filing summaries
- AI company analysis
- Saved research notes

### Version 3: Automation Engine

Deliverables:

- Morning brief
- Market close report
- Weekly review
- Watchlist alerts
- Earnings alerts
- Risk alerts
- N8N workflows

### Version 4: AI CIO Intelligence

Deliverables:

- CIO Agent
- Risk Analyst
- Theme Analyst
- Valuation Analyst
- Portfolio review engine
- Opportunity ranking
- Research priority system

### Version 5: Advanced Portfolio Strategy

Deliverables:

- Scenario analysis
- Rebalancing suggestions
- Position sizing framework
- Thematic exposure analysis
- Long-term thesis tracking
- Decision journal

---

## 29. Folder Philosophy

The codebase should be organized for long-term maintainability.

Recommended structure:

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

/lib
  /services
  /providers
  /ai
  /db
  /utils
  /validators

/server
  /actions
  /jobs
  /api

/docs

/prisma

/tests
```

This structure may evolve, but changes must be documented.

---

## 30. Service Boundary Rules

Business logic should live in services, not UI components.

Examples:

Good:

```text
PortfolioPage
→ PortfolioService
→ Database
```

Bad:

```text
PortfolioPage
→ Raw SQL queries
→ Calculation logic inside React component
```

Good:

```text
WatchlistAlertService
→ MarketDataService
→ NotificationService
```

Bad:

```text
Dashboard component directly checks alerts and sends email
```

---

## 31. Provider Adapter Rule

External providers must be wrapped in adapters.

Examples:

```text
MarketDataProvider
NewsProvider
EmailProvider
AIProvider
FilingProvider
```

The app should depend on internal interfaces, not vendor-specific code.

This makes it easier to switch from one provider to another.

---

## 32. Logging and Observability

The system should log important events.

Examples:

- Automation started
- Automation completed
- Automation failed
- Email sent
- Alert triggered
- Market data fetch failed
- AI analysis failed
- User changed portfolio data
- Database migration ran

Logs should help debug issues without exposing secrets.

---

## 33. Manual Testing Checklist Template

Every feature should include a manual testing checklist.

Template:

```text
Feature:
Date:
Tested by:

Core behavior:
- [ ] 
- [ ] 
- [ ] 

Edge cases:
- [ ] 
- [ ] 
- [ ] 

Mobile behavior:
- [ ] 

Regression checks:
- [ ] Dashboard still loads
- [ ] Portfolio still loads
- [ ] Watchlist still loads
- [ ] Alerts still work

Known issues:
- 

Result:
Pass / Fail / Needs follow-up
```

---

## 34. Architecture Decision Log Template

Every major decision should be recorded.

Template:

```text
# Decision

Date:

Status:
Proposed / Accepted / Rejected / Replaced

Decision:

Context:

Options considered:

Chosen option:

Reason:

Consequences:

Follow-up needed:
```

---

## 35. Codex Session Starter Prompt

Use this at the beginning of each new Codex session:

```text
You are working on the AI CIO project.

Before writing any code, read these documents in order:

1. /docs/00_PRODUCT_CONSTITUTION.md
2. /docs/01_ARCHITECTURE_OVERVIEW.md
3. /docs/02_DOMAIN_MAP.md
4. /docs/03_DATABASE_SCHEMA.md
5. /docs/15_CODEX_WORKFLOW.md

Then inspect the relevant files for the feature I describe.

Do not write code yet.

First, respond with:

1. Your understanding of the current architecture
2. The domains affected by this task
3. The files you expect may need changes
4. Any risks or edge cases
5. Any architecture concerns
6. A proposed small-batch implementation plan

Wait for my approval before generating code diffs.
```

---

## 36. Codex Implementation Prompt Template

Use this when giving Codex a specific implementation batch:

```text
Implement Batch [number]: [batch name]

Goal:
[Explain the specific goal.]

Scope:
[Explain exactly what should be changed.]

Files likely involved:
[List files.]

Rules:
- Follow /docs/00_PRODUCT_CONSTITUTION.md
- Follow /docs/15_CODEX_WORKFLOW.md
- Keep this batch small
- Do not make unrelated changes
- Do not introduce new libraries unless necessary
- Use existing patterns where possible
- Provide code diffs
- Include testing steps
- Update documentation if behavior changes

Expected behavior:
[Describe what should happen after this batch.]

Edge cases:
[List edge cases.]

After implementation, provide:
1. Summary of changes
2. Code diffs
3. Testing steps
4. Documentation updates
5. Risks or follow-up items
```

---

## 37. ChatGPT Review Prompt Template

After Codex produces code diffs, use this prompt with ChatGPT:

```text
You are acting as Chief Systems Architect for the AI CIO project.

Review the following Codex output against the Product Constitution and architecture documents.

Check for:

- Architecture violations
- Security issues
- Missing edge cases
- Poor service boundaries
- Bad database design
- UI problems
- Testing gaps
- Documentation gaps
- Unnecessary complexity
- Risk of breaking existing features

Then provide:

1. What looks good
2. What needs fixing
3. What should be rejected
4. Updated Codex prompts for the next repair batch
5. Manual testing checklist

Here are the Codex diffs:
[paste diffs here]
```

---

## 38. Non-Negotiable Rules

These rules should not be violated:

1. No automatic trade execution in early versions.
2. No hard-coded secrets.
3. No direct frontend calls to external financial APIs.
4. No unsupported AI buy/sell commands.
5. No large Codex prompts for major features.
6. No undocumented database changes.
7. No undocumented architecture changes.
8. No feature is complete without testing notes.
9. No feature is complete without documentation updates.
10. No vendor lock-in unless intentionally approved and documented.

---

## 39. Final Principle

AI CIO should make the user a better investor.

It should not make the user more emotional, impulsive, confused, or dependent.

The system should help the user think clearly, act patiently, and focus on evidence.
