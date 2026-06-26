# AI CIO Testing Strategy

Version: 0.1  
Document Status: Foundation Architecture  
Related Constitution: `/docs/00_PRODUCT_CONSTITUTION.md`

---

# 1. Purpose

This document defines how AI CIO features should be tested.

Codex must read this before implementing or modifying tests.

---

# 2. Testing Philosophy

Testing should protect the user from broken investment calculations, broken alerts, failed reports, and regressions.

The goal is not to test everything perfectly from day one.

The goal is to create a habit:

```text
small feature
clear tests
manual verification
documented edge cases
```

---

# 3. Test Levels

AI CIO should use:

```text
Unit tests
Integration tests
Manual tests
Regression checks
```

---

# 4. Unit Tests

Unit tests should cover isolated logic.

Good unit test targets:

- portfolio calculations
- transaction validation
- allocation percentages
- gain/loss calculations
- alert threshold checks
- risk scoring helpers
- data normalization
- date/time helpers
- formatting helpers

Example:

```text
Given a BUY transaction of 10 shares at $20
When latest price is $25
Then market value is $250
And unrealized gain is $50
```

---

# 5. Integration Tests

Integration tests should cover services working together.

Good integration targets:

- transaction creates updated holding
- watchlist item triggers alert when target reached
- report generation stores report
- notification created after report
- market data provider response normalizes correctly
- automation creates AutomationRun

---

# 6. Manual Tests

Manual testing is required for UI and workflow confidence.

Every feature should include manual steps.

Manual checklist template:

```text
Feature:
Date:
Tested by:

Core behavior:
- [ ]
- [ ]

Edge cases:
- [ ]
- [ ]

Mobile behavior:
- [ ]

Regression checks:
- [ ] Dashboard still loads
- [ ] Portfolio still loads
- [ ] Watchlist still loads
- [ ] Alerts still load

Known issues:

Result:
Pass / Fail / Needs follow-up
```

---

# 7. Regression Testing

When shared files change, check unrelated areas.

Examples:

If market data service changes, check:

- dashboard
- portfolio
- watchlist
- alerts

If database schema changes, check:

- migrations
- seed data
- affected services
- affected pages

---

# 8. Financial Calculation Testing

Financial calculations require extra care.

Test:

- buys
- sells
- partial sells
- dividends
- fees
- zero quantity
- missing price
- different currencies where supported
- rounding
- decimal precision

Do not rely on casual visual inspection only.

---

# 9. AI Feature Testing

AI features should be tested for behavior, not just output text.

Check:

- AI receives structured data
- missing data is handled
- output includes uncertainty
- output avoids unsupported buy/sell commands
- output is stored
- failures are logged
- UI labels AI content clearly

---

# 10. Automation Testing

Automation tests should verify:

- trigger works
- webhook secret validation works
- AutomationRun created
- report created
- alert created where expected
- notification created
- failure state recorded
- duplicate emails avoided

---

# 11. Provider Testing

Provider adapter tests should verify:

- response normalization
- timeout handling
- rate limit handling
- missing fields
- invalid ticker
- cached fallback behavior
- safe error return

---

# 12. UI Testing

UI tests/manual checks should verify:

- desktop layout
- mobile layout
- loading states
- empty states
- error states
- tables render correctly
- forms validate
- no direct frontend external API calls

---

# 13. Suggested Tooling

Initial options:

```text
Vitest
React Testing Library
Playwright later for end-to-end tests
Prisma test database later
```

Codex should not add testing libraries without documenting the decision.

---

# 14. Definition of Done Testing Requirement

A feature is not done until:

```text
Tests are added where practical.
Manual testing steps are provided.
Known limitations are documented.
Regression risks are listed.
```

---

# 15. Codex Testing Checklist

After code changes, Codex should provide:

```text
1. Tests added or updated
2. Commands to run
3. Manual testing steps
4. Edge cases tested
5. Known gaps
6. Regression areas to check
```

---

# 16. Final Principle

Testing protects trust.

If the user cannot trust calculations, alerts, or reports, the AI CIO loses its purpose.
