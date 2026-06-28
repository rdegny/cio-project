# AI CIO Security Model

Version: 0.1  
Document Status: Foundation Architecture  
Related Constitution: `/docs/00_PRODUCT_CONSTITUTION.md`

---

# 1. Purpose

This document defines security rules for AI CIO.

Codex must read this before implementing authentication, database access, webhooks, provider integrations, secrets, or deployment.

---

# 2. Security Philosophy

Even if AI CIO begins as a personal project, it should be built with serious security habits.

The app may contain:

- portfolio data
- transaction history
- watchlists
- reports
- AI analyses
- alert history
- API keys
- email settings

This data should be protected from accidental exposure.

---

# 3. Non-Negotiable Rules

```text
No secrets in Git.
No API keys in frontend code.
No unauthenticated access to private portfolio data.
No real brokerage credentials in Version 1.
No automatic trade execution in early versions.
No raw stack traces exposed to users.
No webhook endpoints without secret validation.
```

---

# 4. Authentication

Most app pages should require authentication.

Protected pages:

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

Public pages may include:

```text
/login
```

The initial auth foundation uses Auth.js / NextAuth with local credentials stored in environment variables, as recorded in `/docs/14_DECISION_LOG.md`.

Future production provider options may still include:

```text
OAuth through Auth.js / NextAuth
Clerk
Supabase Auth
```

---

# 5. Authorization

All user-owned records must be scoped by `userId`.

Examples:

- portfolios
- transactions
- watchlists
- alerts
- notifications
- reports
- AI analyses
- settings

A user should never be able to access records belonging to another user.

---

# 6. Secrets

Real secrets belong in:

```text
.env
```

Never commit:

```text
.env
.env.local
.env.production
API keys
database URLs
tokens
passwords
webhook secrets
```

The repo may include:

```text
.env.example
```

with placeholder values only.

---

# 7. Environment Variables

Expected future environment variables:

```text
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
AUTH_LOCAL_EMAIL
AUTH_LOCAL_PASSWORD
OPENAI_API_KEY
MARKET_DATA_API_KEY
NEWS_API_KEY
FILING_API_KEY
EMAIL_PROVIDER_API_KEY
EMAIL_FROM_ADDRESS
N8N_WEBHOOK_SECRET
N8N_BASE_URL
```

---

# 8. Frontend Security

Frontend code must not contain:

- API keys
- database URLs
- provider secrets
- webhook secrets
- private server-only logic

Frontend should call internal routes or server actions.

---

# 9. Provider Security

Provider adapters should:

- read secrets from environment variables
- never log full API keys
- handle errors safely
- avoid returning raw provider errors to users
- apply timeout and failure handling

---

# 10. Webhook Security

N8N and external automation webhooks must validate a secret.

Suggested header:

```text
x-ai-cio-webhook-secret
```

Webhook routes should reject invalid requests.

They should log failures without exposing secrets.

---

# 11. Database Security

Database access rules:

- Use authenticated user context.
- Filter user-owned data by `userId`.
- Avoid raw SQL unless needed.
- Validate inputs before database writes.
- Do not store secrets in ordinary database tables.
- Back up important data.

---

# 12. Input Validation

Validate:

- ticker symbols
- decimal values
- dates
- enum values
- user-owned IDs
- report generation inputs
- webhook payloads
- pagination inputs

Invalid input should produce clear validation errors.

---

# 13. Logging Security

Logs should not include:

- API keys
- full database URLs
- auth tokens
- passwords
- sensitive headers
- private raw financial data unless necessary

Logs may include:

- workflow status
- provider name
- duration
- error category
- userId where appropriate
- record IDs where appropriate

---

# 14. Email Security

Email sending should:

- use provider API keys from environment variables
- avoid sending secrets
- avoid exposing private data to wrong recipients
- store delivery status
- avoid duplicate sends

---

# 15. Brokerage Integration

Version 1 should not store brokerage login credentials or execute trades.

Future brokerage read-only integration may be considered later.

Any brokerage connection requires a separate security review.

---

# 16. GitHub Security

During early development:

- Keep repo private.
- Do not commit secrets.
- Use `.gitignore`.
- Review Codex diffs before merging.
- Avoid committing downloaded financial statements that contain sensitive personal data.

---

# 17. Deployment Security

Deployment should use:

- environment variables
- HTTPS
- secure database connection
- limited production access
- backups
- rollback plan

Production secrets should be managed through the hosting provider's secret storage.

---

# 18. Security Testing Checklist

Before accepting security-sensitive work:

```text
1. Are all routes properly authenticated?
2. Is user-owned data scoped by userId?
3. Are secrets kept server-side?
4. Are webhooks protected?
5. Are inputs validated?
6. Are errors safe?
7. Are logs safe?
8. Are environment variables documented?
9. Is .env ignored by Git?
10. Are docs updated?
```

---

# 19. Final Principle

Security should be built in from the start.

It is much easier to protect the system early than to retrofit security after personal financial data, API keys, and automation workflows already exist.
