# AI CIO UI Design System

Version: 0.1  
Document Status: Foundation Architecture  
Related Constitution: `/docs/00_PRODUCT_CONSTITUTION.md`

---

# 1. Purpose

This document defines the UI design direction for AI CIO.

It covers:

- visual style
- layout
- components
- dashboards
- tables
- cards
- charts
- mobile behavior
- loading, empty, and error states

Codex must read this document before implementing UI features.

---

# 2. UI Philosophy

AI CIO should feel like a calm investment command center.

The interface should be:

- clean
- serious
- fast
- readable
- mobile-friendly
- information-dense without feeling cluttered
- useful for quick scanning

Avoid:

- meme-like design
- flashy trading app energy
- excessive animations
- random colors
- unsupported buy/sell calls
- cluttered dashboards

---

# 3. Visual Tone

The UI should feel closer to:

```text
professional research dashboard
portfolio command center
calm institutional tool
```

Not:

```text
casino
social trading feed
crypto hype dashboard
```

---

# 4. Core Pages

Initial pages:

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

Future pages:

```text
/automation
/admin
/decision-journal
```

---

# 5. Dashboard Purpose

The dashboard should answer:

```text
What changed?
What needs my attention?
What is my portfolio doing?
What are my biggest risks?
Which watchlist items are interesting?
What reports should I read?
```

Suggested dashboard sections:

- Portfolio summary
- Active alerts
- Watchlist highlights
- Latest report
- Risk summary
- Theme exposure
- Market overview
- Upcoming earnings

---

# 6. Component Philosophy

Use reusable components.

Examples:

```text
MetricCard
PortfolioSummaryCard
PositionTable
WatchlistTable
AlertCard
ReportCard
ThemeCard
RiskSummaryCard
CompanyHeader
PriceChangeBadge
StatusBadge
EmptyState
ErrorState
LoadingSkeleton
```

Components should not own business logic.

Correct:

```text
PortfolioService prepares data
→ PortfolioSummaryCard displays it
```

Incorrect:

```text
PortfolioSummaryCard calculates cost basis and fetches prices
```

---

# 7. Layout Rules

Preferred layout:

- left navigation or top navigation depending on screen size
- main content area
- card-based sections
- consistent spacing
- clear page headings
- responsive grid

Dashboard cards should be easy to scan.

Tables should support overflow or responsive behavior on small screens.

---

# 8. Typography

Text should be readable and direct.

Use:

- clear headings
- short labels
- plain English
- concise summaries
- visible hierarchy

Avoid:

- long walls of text in cards
- unexplained abbreviations
- jargon without context

---

# 9. Color Rules

Use color intentionally.

Suggested color meaning:

```text
Green: positive movement or healthy status
Red: negative movement or risk
Yellow/amber: warning
Blue: informational
Gray: neutral or inactive
```

Do not rely on color alone. Include labels and icons where helpful.

---

# 10. Cards

Cards should have:

- title
- primary metric or message
- supporting detail
- timestamp or status where useful
- optional action

Example:

```text
Portfolio Value
$42,850
+1.8% today
Updated 4:05 PM
```

---

# 11. Tables

Important tables:

- Holdings table
- Transactions table
- Watchlist table
- Alerts table
- Reports table
- Theme company table

Tables should support:

- sorting where useful
- clear column names
- empty states
- loading states
- readable mobile fallback

---

# 12. Charts

Charts should be simple and explainable.

Initial charts:

- portfolio value over time
- allocation by holding
- sector exposure
- theme exposure
- price history

Avoid overly complex charts early.

Every chart should have a clear title and purpose.

---

# 13. Alert UI

Alerts should be calm and explainable.

Alert card should show:

- severity
- title
- explanation
- related ticker
- triggered time
- action buttons such as read, dismiss, archive

Avoid panic language.

---

# 14. Report UI

Reports should be skimmable.

Report page should show:

- title
- report type
- generated time
- summary
- sections
- related tickers/themes
- read/archive actions

Reports should support longer text better than dashboard cards.

---

# 15. AI Output UI

AI-generated text should be clearly labeled.

The UI should show:

- generated time
- agent role where useful
- data limitations if present
- suggested next action

Avoid making AI output look like guaranteed truth.

---

# 16. Loading States

Use loading skeletons for:

- dashboard cards
- tables
- reports
- company research pages

Avoid blank pages during loading.

---

# 17. Empty States

Every major page should have a useful empty state.

Examples:

Portfolio empty state:

```text
No holdings yet.
Add your first transaction to start tracking your portfolio.
```

Watchlist empty state:

```text
No watchlist items yet.
Add a company you want AI CIO to monitor.
```

---

# 18. Error States

Errors should be useful.

Bad:

```text
Something went wrong.
```

Better:

```text
Market data is temporarily unavailable. Showing the last cached price from 3:45 PM.
```

---

# 19. Mobile Behavior

The app should be usable on phone.

Mobile priorities:

- dashboard cards stack vertically
- tables have responsive layout
- navigation is easy
- buttons are tappable
- long reports are readable
- no horizontal overflow unless intentionally used for tables

---

# 20. Accessibility

The UI should use:

- semantic HTML
- readable contrast
- keyboard-friendly controls
- labels for form fields
- meaningful button text
- alt text where needed

---

# 21. UI Testing Checklist

Before accepting UI work:

```text
1. Page renders on desktop.
2. Page renders on mobile.
3. Loading state works.
4. Empty state works.
5. Error state works.
6. Data formatting is readable.
7. No business logic lives inside UI components.
8. No frontend calls external financial APIs directly.
9. Navigation works.
10. Regression check: dashboard, portfolio, watchlist still load.
```

---

# 22. Final Principle

The UI should help the user think clearly.

If a design increases panic, confusion, or impulsive behavior, redesign it.
