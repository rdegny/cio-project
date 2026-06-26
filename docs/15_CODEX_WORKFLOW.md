# AI CIO Codex Workflow

Version: 0.1  
Document Status: Operating Procedure  
Related Constitution: `/docs/00_PRODUCT_CONSTITUTION.md`

---

# 1. Purpose

This document defines how Codex should work on the AI CIO project.

It exists to keep implementation stable, reviewable, and consistent.

Every Codex session must read this document before generating code.

---

# 2. Required Read Order

Before writing code, Codex must read:

```text
1. /docs/00_PRODUCT_CONSTITUTION.md
2. /docs/01_ARCHITECTURE_OVERVIEW.md
3. /docs/02_DOMAIN_MAP.md
4. /docs/03_DATABASE_SCHEMA.md
5. /docs/15_CODEX_WORKFLOW.md
```

Then Codex must read relevant feature-specific documents.

Examples:

AI feature:

```text
/docs/06_AI_ARCHITECTURE.md
/docs/07_AUTOMATION_WORKFLOWS.md
```

UI feature:

```text
/docs/08_UI_DESIGN_SYSTEM.md
/docs/04_API_CONTRACTS.md
```

Market data feature:

```text
/docs/05_DATA_PROVIDERS.md
```

Security feature:

```text
/docs/09_SECURITY_MODEL.md
```

---

# 3. Session Starter Prompt

Use this at the start of a Codex session:

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

# 4. Implementation Batch Prompt

Use this for each coding batch:

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

# 5. Small Batch Rule

Codex should not implement large features in one prompt.

Large feature example:

```text
Build portfolio dashboard, auth, database, market data, alerts, and AI reports.
```

Better:

```text
Batch 1: Create app shell
Batch 2: Add database setup
Batch 3: Add portfolio models
Batch 4: Add transaction service
Batch 5: Add portfolio page
Batch 6: Add tests
Batch 7: Update docs
```

---

# 6. Understand Before Coding

Before changing code, Codex should:

- read docs
- inspect relevant files
- summarize understanding
- list affected domains
- identify likely files
- identify risks
- propose a small plan

Do not skip this step.

---

# 7. Code Diff Preference

Codex should provide code diffs where possible.

Avoid rewriting entire files unless necessary.

If a full rewrite is necessary, explain why.

---

# 8. Architecture Change Rule

Codex must not silently introduce:

- new libraries
- new database tables
- new external APIs
- new folder structures
- new architectural patterns
- new hosting assumptions

Any significant change requires explanation and documentation updates.

---

# 9. Security Rule

Codex must never hard-code:

- API keys
- database URLs
- auth secrets
- email credentials
- webhook secrets
- passwords

Use environment variables and update `.env.example`.

---

# 10. Documentation Rule

If behavior changes, documentation must be updated.

Relevant docs may include:

```text
00_PRODUCT_CONSTITUTION.md
01_ARCHITECTURE_OVERVIEW.md
02_DOMAIN_MAP.md
03_DATABASE_SCHEMA.md
04_API_CONTRACTS.md
05_DATA_PROVIDERS.md
06_AI_ARCHITECTURE.md
07_AUTOMATION_WORKFLOWS.md
08_UI_DESIGN_SYSTEM.md
09_SECURITY_MODEL.md
10_TESTING_STRATEGY.md
11_DEPLOYMENT_AND_HOSTING.md
12_COST_MODEL.md
13_FEATURE_ROADMAP.md
14_DECISION_LOG.md
15_CODEX_WORKFLOW.md
```

---

# 11. Testing Rule

After implementation, Codex should provide:

- automated test commands
- manual testing steps
- regression checks
- known limitations

A feature is not complete without testing notes.

---

# 12. ChatGPT Review Prompt

After Codex produces diffs, paste them into ChatGPT with:

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

# 13. Definition of Done

A feature is done only when:

```text
Code is implemented.
Code is readable.
Existing behavior is not broken.
Types pass.
Lint passes.
Tests pass or limitations are documented.
Manual testing steps are provided.
Relevant docs are updated.
Edge cases are considered.
Failure behavior is handled.
No secrets are exposed.
Implementation follows the Product Constitution.
```

---

# 14. Branch Workflow

Recommended:

```text
main = stable
feature branch = Codex work
pull request = review
merge after testing
```

Early solo workflow may be simpler, but still review diffs before accepting.

---

# 15. Final Principle

Codex should act like a careful senior engineer, not a rushed code generator.

Small batches, clear review loops, and updated docs are the core workflow.
