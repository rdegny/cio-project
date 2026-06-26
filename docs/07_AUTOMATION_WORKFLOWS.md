# AI CIO Automation Workflows

Version: 0.1  
Document Status: Foundation Architecture  
Related Constitution: `/docs/00_PRODUCT_CONSTITUTION.md`

---

# 1. Purpose

This document defines scheduled and event-driven workflows for AI CIO.

It covers:

- N8N workflows
- application jobs
- webhook endpoints
- automation logging
- failure behavior
- notification rules

Codex must read this document before implementing automations, jobs, or webhooks.

---

# 2. Automation Philosophy

Automation should reduce manual work while keeping the user in control.

Good automation:

- Collects data
- Checks conditions
- Creates reports
- Sends useful alerts
- Logs what happened

Bad automation:

- Automatically buys or sells
- Sends noisy alerts
- Hides assumptions
- Fails silently
- Duplicates reports

---

# 3. Automation Architecture

Possible flow:

```text
N8N schedule
→ App webhook
→ Automation service
→ Domain services
→ Report / Alert / Notification
→ AutomationRun log
```

Application jobs can also run without N8N where appropriate.

---

# 4. Automation Logging

Every workflow should create or update an AutomationRun record.

Track:

- workflowName
- workflowType
- status
- startedAt
- finishedAt
- durationMs
- triggerSource
- errorMessage
- metadata

Automations should never fail silently.

---

# 5. Webhook Security

N8N webhook calls should use a secret.

Example header:

```text
x-ai-cio-webhook-secret
```

Webhook endpoints should reject invalid or missing secrets.

Do not expose internal stack traces in webhook responses.

---

# 6. Morning Brief

Purpose:

Prepare the user before market open.

Trigger:

```text
Weekdays before market open
```

Inputs:

- Portfolio holdings
- Watchlist items
- Latest market data
- Overnight news
- upcoming earnings
- active alerts
- risk summary

Output:

- Morning Brief report
- Optional email notification
- AutomationRun record

Sections:

```text
Top priorities
Portfolio overnight changes
Watchlist opportunities
Important news
Upcoming earnings/events
Risks to watch
Suggested research actions
```

Failure behavior:

- If market data fails, use cached data and mark report partial.
- If AI fails, create a non-AI fallback summary if possible.
- If email fails, keep report stored and log notification failure.

---

# 7. Market Close Report

Purpose:

Summarize the trading day.

Trigger:

```text
Weekdays after market close
```

Inputs:

- Portfolio daily movement
- Watchlist movement
- market index movement
- major news
- alerts triggered during the day

Output:

- Market Close report
- Optional email notification
- AutomationRun record

Sections:

```text
What moved
Why it may have moved
Portfolio impact
Watchlist impact
New alerts
Tomorrow's focus
```

---

# 8. Weekly CIO Review

Purpose:

Higher-level portfolio reflection.

Trigger:

```text
Once per week
```

Inputs:

- Portfolio performance
- largest winners/losers
- risk summary
- theme exposure
- watchlist changes
- reports from the week
- alerts from the week

Output:

- Weekly CIO Review report
- Optional email notification

Sections:

```text
Portfolio summary
Risk review
Theme review
Watchlist review
Decision journal reminders
Next week priorities
```

---

# 9. Watchlist Price Check

Purpose:

Detect when monitored stocks reach target levels or move significantly.

Trigger:

```text
Scheduled during market hours or after market close
```

Inputs:

- Watchlist items
- latest quotes
- target buy/sell prices
- priority levels

Output:

- Alert records
- Optional notification

Alert types:

```text
PRICE_TARGET
PRICE_MOVE
WATCHLIST
```

Rules:

- Avoid duplicate alerts.
- Include explanation.
- Do not say "buy now."
- Use "review" or "research" language.

---

# 10. Portfolio Risk Check

Purpose:

Flag portfolio risks.

Trigger:

```text
Daily or weekly
```

Inputs:

- Holdings
- market data
- sector/theme exposure
- fundamentals where available
- news where available

Output:

- Risk alerts
- Risk review report if useful

Checks:

```text
Largest position concentration
Sector concentration
Theme concentration
Large daily drawdown
High volatility
Debt risk if data available
Valuation risk if data available
```

---

# 11. Earnings Check

Purpose:

Track upcoming and reported earnings.

Trigger:

```text
Daily
```

Inputs:

- Portfolio companies
- Watchlist companies
- earnings calendar
- reported results where available

Output:

- Earnings alerts
- Earnings summary reports
- AutomationRun log

Rules:

- Prioritize owned and high-priority watchlist companies.
- If transcript analysis is unavailable, summarize available data only.

---

# 12. News Check

Purpose:

Find important news for portfolio, watchlist, and themes.

Trigger:

```text
Several times daily or daily during MVP
```

Inputs:

- portfolio tickers
- watchlist tickers
- themes
- news provider data

Output:

- News alerts
- Report sections
- AI news summaries where useful

Rules:

- Deduplicate articles.
- Avoid alerting every minor article.
- Prioritize material company or theme news.

---

# 13. Report Delivery Workflow

Purpose:

Send completed reports to user.

Flow:

```text
ReportService creates report
→ NotificationService creates notification
→ EmailProvider sends email
→ Notification status updated
```

Rules:

- Store report before sending email.
- If email fails, report remains available in app.
- Avoid duplicate sends.

---

# 14. Manual Trigger Workflows

Some workflows should support manual triggering from the app.

Examples:

- Generate morning brief now
- Rerun watchlist check
- Generate company analysis
- Refresh market data
- Send test email

Manual triggers should still create AutomationRun records when appropriate.

---

# 15. N8N Integration Timing

Do not add N8N too early.

Recommended order:

```text
1. Build stable app services
2. Build webhook endpoints
3. Add AutomationRun logging
4. Connect N8N workflows
5. Add email delivery
6. Add failure alerts
```

---

# 16. Automation Testing Checklist

Before accepting an automation:

```text
1. Trigger works.
2. Webhook secret is checked.
3. AutomationRun is created.
4. Required services are called.
5. Partial failures are handled.
6. Duplicate alerts/emails are avoided.
7. Report is stored.
8. Notification status is tracked.
9. Manual test steps are documented.
```

---

# 17. Final Principle

Automation should make AI CIO feel like it is watching the market for the user, but the user should always remain in control.
