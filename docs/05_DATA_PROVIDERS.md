# AI CIO Data Providers

Version: 0.1  
Document Status: Foundation Architecture  
Related Constitution: `/docs/00_PRODUCT_CONSTITUTION.md`

---

# 1. Purpose

This document defines how AI CIO should use external data providers.

It covers:

- Market data
- Company fundamentals
- News
- SEC filings
- Earnings
- Macro data
- AI providers
- Email providers

Codex must read this document before adding any external provider integration.

---

# 2. Provider Philosophy

AI CIO should not be hard-wired to one external vendor.

Every provider should be wrapped in an adapter.

Correct pattern:

```text
Application Service
→ Provider Interface
→ Provider Adapter
→ External API
```

Incorrect pattern:

```text
React Component
→ External API
```

---

# 3. Provider Adapter Requirements

Every provider adapter should handle:

- Authentication
- Request formatting
- Response normalization
- Provider-specific errors
- Rate limits
- Timeouts
- Caching strategy
- Logging
- Safe failure behavior

Provider-specific response shapes should not leak into UI components.

---

# 4. Market Data Providers

Potential providers:

```text
Alpha Vantage
Twelve Data
Financial Modeling Prep
Polygon
IEX Cloud
Yahoo Finance unofficial libraries
Stooq
Marketstack
```

Initial priority:

- Low cost
- Acceptable reliability
- Enough data for portfolio/watchlist MVP
- Clear API documentation
- Reasonable rate limits

MVP needs:

- Latest price
- Previous close
- Basic ticker metadata
- Daily change
- Currency
- Exchange if available

Future needs:

- Historical OHLCV
- Intraday data
- Dividends
- Splits
- ETF holdings
- Analyst estimates

---

# 5. Company Fundamentals Providers

Potential providers:

```text
Financial Modeling Prep
Alpha Vantage
Polygon
SEC company facts
SimFin
Tikr or paid providers later
```

MVP needs:

- Company name
- Sector
- Industry
- Description
- Market cap if available
- Basic valuation metrics if affordable

Future needs:

- Income statement
- Balance sheet
- Cash flow
- Margins
- Debt
- EPS
- Free cash flow
- Historical valuation

---

# 6. News Providers

Potential providers:

```text
NewsAPI
GNews
Finnhub
Financial Modeling Prep news
Polygon news
Bing News Search
RSS feeds
```

MVP needs:

- Article title
- Source
- URL
- Published time
- Related ticker or keyword
- Summary if available

Future needs:

- Deduplication
- Relevance scoring
- Theme matching
- Portfolio impact scoring
- AI summaries

---

# 7. SEC / Filing Providers

Potential sources:

```text
SEC EDGAR
SEC companyfacts
sec-api.io
Financial Modeling Prep
Company investor relations pages
```

MVP status:

Can be deferred until Research Engine phase.

Future needs:

- 10-K
- 10-Q
- 8-K
- Form 4
- Filing metadata
- Filing summaries
- Material event detection

---

# 8. Earnings Providers

Potential providers:

```text
Financial Modeling Prep
Finnhub
Alpha Vantage
Polygon
Nasdaq earnings calendar
Company investor relations pages
```

MVP needs:

- Earnings date
- Company ticker
- Fiscal quarter if available

Future needs:

- EPS estimate
- Revenue estimate
- Reported EPS
- Reported revenue
- Guidance
- Call transcript
- AI transcript summary

---

# 9. Macro Data Providers

Potential providers:

```text
FRED
Treasury.gov
World Bank
OECD
ECB
IMF
Trading Economics
```

MVP status:

Can be deferred.

Future macro data:

- Interest rates
- Inflation
- GDP
- unemployment
- energy prices
- defense spending
- commodity prices
- currency rates

---

# 10. AI Providers

Potential AI providers:

```text
OpenAI
Anthropic
Google
OpenRouter
local models later
```

The app should use an AI provider adapter.

Correct pattern:

```text
AIAnalysisService
→ AIProvider interface
→ OpenAIProvider
```

Do not scatter direct AI API calls across the codebase.

---

# 11. Email Providers

Potential providers:

```text
Resend
SendGrid
Mailgun
Postmark
Gmail SMTP
Amazon SES
```

MVP recommendation:

Use a simple reliable provider with a free or low-cost tier.

EmailProvider should support:

- send email
- delivery status if available
- error logging
- from address configuration

---

# 12. Caching Rules

External data should be cached when appropriate.

Suggested early cache behavior:

```text
Latest quote: cache for minutes during market hours
Company profile: cache for days or weeks
News: cache by URL
Filings: durable metadata
Earnings calendar: cache daily
AI outputs: store generated result
```

Avoid calling external APIs on every page load when cached data is enough.

---

# 13. Rate Limit Rules

Provider adapters should handle rate limits gracefully.

Expected behavior:

- Return cached data if possible
- Log rate limit event
- Avoid crashing the app
- Avoid retry loops that make the problem worse
- Surface a useful fallback message

---

# 14. Provider Failure Rules

If a provider fails:

- Log the failure
- Return a safe error result
- Use cached data where possible
- Mark reports as partial if required data is missing
- Do not let one failed provider crash the whole dashboard

---

# 15. Provider Cost Tracking

The project should track provider cost over time.

Record:

- Provider name
- Free tier limit
- Monthly cost
- Usage limits
- Upgrade triggers
- Replacement options

Detailed monthly costs belong in:

```text
/docs/12_COST_MODEL.md
```

---

# 16. Initial Provider Decision Template

Use this when choosing a provider:

```text
Provider:
Domain:
Purpose:
Cost:
Free tier:
Rate limits:
Pros:
Cons:
Fallback:
Decision:
Date:
```

Major choices must be recorded in:

```text
/docs/14_DECISION_LOG.md
```

---

# 17. Final Principle

Providers are replaceable.

AI CIO's internal data structures, UI, and services should remain stable even if a provider changes pricing, fails, or gets replaced.
