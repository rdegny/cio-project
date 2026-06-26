# AI CIO Deployment and Hosting

Version: 0.1  
Document Status: Foundation Architecture  
Related Constitution: `/docs/00_PRODUCT_CONSTITUTION.md`

---

# 1. Purpose

This document defines deployment and hosting options for AI CIO.

It covers:

- app hosting
- database hosting
- N8N hosting
- environment variables
- logs
- backups
- rollback
- deployment decisions

---

# 2. Deployment Philosophy

AI CIO should start simple and affordable.

The deployment should support:

- reliable dashboard access
- secure environment variables
- PostgreSQL database
- scheduled or webhook-based automation
- email sending
- logs
- backups

Avoid overcomplicated infrastructure before MVP.

---

# 3. Possible Hosting Setups

## Option A: Vercel + Supabase + Hostinger N8N

```text
Next.js app: Vercel
PostgreSQL: Supabase
N8N: Hostinger VPS
```

Pros:

- simple Next.js deployment
- managed database
- affordable automation
- easy to scale early

Cons:

- multiple services to manage
- serverless limitations for long-running jobs

---

## Option B: Railway Full Stack + Hostinger N8N

```text
Next.js app: Railway
PostgreSQL: Railway
N8N: Hostinger VPS
```

Pros:

- app and database close together
- easy environment variables
- good for full-stack projects

Cons:

- cost can grow
- less specialized than Vercel for Next.js

---

## Option C: Full VPS

```text
Next.js app: VPS
PostgreSQL: VPS or managed database
N8N: same VPS or separate VPS
```

Pros:

- maximum control
- potentially low monthly cost
- good learning experience

Cons:

- more server maintenance
- more security responsibility
- backups and updates are on you

---

# 4. Initial Recommendation

Start with the simplest reliable setup.

Suggested early choice:

```text
Next.js app: Vercel or Railway
PostgreSQL: Supabase, Neon, or Railway
N8N: Hostinger VPS
```

Final decision should be recorded in:

```text
/docs/14_DECISION_LOG.md
```

---

# 5. Environment Variables

Expected variables:

```text
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
OPENAI_API_KEY
MARKET_DATA_API_KEY
NEWS_API_KEY
EMAIL_PROVIDER_API_KEY
EMAIL_FROM_ADDRESS
N8N_WEBHOOK_SECRET
N8N_BASE_URL
```

Real values must be stored in hosting provider secret settings, not Git.

---

# 6. GitHub Workflow

Recommended branch flow:

```text
main = stable
feature branches = Codex work
pull request = review
merge after testing
```

For early solo development, direct commits may be acceptable, but Codex changes should still be reviewed carefully.

---

# 7. Build Process

Expected future commands may include:

```text
npm install
npm run lint
npm run test
npm run build
npx prisma migrate deploy
```

Codex should update this document when actual commands are finalized.

---

# 8. Database Migrations

Production migrations should be deliberate.

Rules:

- Avoid destructive migrations without approval.
- Back up important data before major schema changes.
- Test migrations locally first where practical.
- Document major schema decisions.

---

# 9. N8N Deployment

N8N may be self-hosted on Hostinger VPS.

N8N should call AI CIO through secure webhook endpoints.

N8N should not store unnecessary secrets if the app can own them.

Webhook secrets should be rotated if exposed.

---

# 10. Logs

The app should log:

- provider failures
- automation runs
- report generation
- notification delivery
- AI failures
- database errors

Production logs should not expose secrets.

---

# 11. Backups

Backup priorities:

- database
- environment variable documentation
- N8N workflows
- important docs
- GitHub repo

Database backups should be automated once real portfolio data is stored.

---

# 12. Rollback

Rollback plan should include:

- Git revert
- redeploy previous version
- database migration caution
- backup restore process

Avoid irreversible migrations early.

---

# 13. Deployment Checklist

Before production deployment:

```text
1. Repo private or intentionally public.
2. .env ignored.
3. Environment variables set.
4. Build passes.
5. Database migration succeeds.
6. Authentication works.
7. Protected pages are protected.
8. Webhook secrets are set.
9. Test email works.
10. Logs are visible.
```

---

# 14. Final Principle

The best early deployment is the one that is secure, understandable, affordable, and easy to recover.
