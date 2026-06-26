# AI CIO AI Architecture

Version: 0.1  
Document Status: Foundation Architecture  
Related Constitution: `/docs/00_PRODUCT_CONSTITUTION.md`

---

# 1. Purpose

This document defines how AI should be used inside AI CIO.

It covers:

- AI service boundaries
- Agent roles
- Prompt structure
- Guardrails
- Stored outputs
- Evaluation rules
- Failure handling

Codex must read this document before implementing AI features.

---

# 2. AI Philosophy

AI CIO should use AI to support investment thinking, not replace the user's judgment.

AI should:

- Summarize
- Compare
- Explain
- Prioritize
- Identify risks
- Suggest what to research next

AI should not:

- Place trades
- Guarantee returns
- Pretend uncertainty does not exist
- Generate unsupported buy/sell commands
- Invent data
- Hide missing context

---

# 3. AI Service Pattern

Correct pattern:

```text
Feature Service
→ AIAnalysisService
→ AIProvider interface
→ AI Provider Adapter
→ External model API
```

Incorrect pattern:

```text
React Component
→ OpenAI API directly
```

All AI calls should be centralized through an AI service.

---

# 4. Core AI Roles

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

---

# 5. CIO Agent

Purpose:

- Coordinate final investment summaries
- Balance bullish and bearish evidence
- Prioritize what the user should review
- Produce calm, decision-useful commentary

Inputs:

- Portfolio summary
- Watchlist highlights
- Alerts
- Risk summary
- News summary
- Relevant reports

Outputs:

- CIO summary
- Priority list
- Suggested next research actions
- Risk notes

The CIO Agent should not fetch raw data directly.

---

# 6. News Analyst

Purpose:

- Summarize relevant news
- Separate signal from noise
- Identify company, theme, and portfolio relevance

Inputs:

- News articles
- Related tickers
- Related themes
- Portfolio/watchlist ownership context

Outputs:

- News summary
- Impact level
- Companies affected
- Themes affected
- Bullish/bearish/neutral interpretation

---

# 7. Earnings Analyst

Purpose:

- Summarize earnings events
- Compare results to expectations
- Identify guidance changes
- Highlight margin, revenue, cash flow, and commentary

Inputs:

- Earnings data
- Company fundamentals
- Transcript text if available
- Analyst expectations if available

Outputs:

- Earnings summary
- Surprise assessment
- Guidance notes
- Thesis impact
- Follow-up questions

---

# 8. Valuation Analyst

Purpose:

- Review valuation setup
- Compare valuation with historical ranges and peers when available
- Flag expensive or potentially attractive setups

Inputs:

- Price
- Market cap
- Revenue
- earnings
- cash flow
- margins
- debt
- peer data if available

Outputs:

- Valuation summary
- Key ratios
- Bullish valuation view
- Bearish valuation view
- Data limitations

---

# 9. Risk Analyst

Purpose:

- Explain portfolio and company risk
- Flag concentration
- Identify downside scenarios

Inputs:

- Holdings
- Position size
- sector/theme exposure
- volatility
- news
- earnings
- fundamentals

Outputs:

- Risk summary
- Key risk drivers
- Severity
- What to monitor next

---

# 10. Theme Analyst

Purpose:

- Track long-term investment themes
- Monitor companies connected to themes
- Identify policy, spending, regulation, or industry changes

Inputs:

- Theme list
- Theme companies
- news
- market data
- macro data where available

Outputs:

- Theme update
- Companies affected
- Opportunity notes
- Risk notes
- Research priorities

---

# 11. Report Writer

Purpose:

- Turn analysis into readable reports and emails
- Maintain calm, skimmable structure
- Avoid hype

Inputs:

- Structured analysis outputs from other agents
- Portfolio/watchlist context
- Alert context
- User settings

Outputs:

- Morning brief
- Market close report
- Weekly review
- Company research note
- Theme update

---

# 12. Prompt Structure

Prompts should usually include:

```text
Role
Task
Context
Data
Rules
Output format
Uncertainty requirements
```

Prompts should ask the AI to distinguish between:

- Facts
- Inferences
- Missing data
- Risks
- Suggested next actions

---

# 13. Output Format

For investment analysis, prefer this structure:

```text
What happened
Why it matters
Bullish interpretation
Bearish interpretation
Data limitations
What to monitor next
Suggested user action
```

Suggested actions should be phrased as:

```text
Review
Monitor
Research further
Ignore for now
Compare against valuation
Wait for earnings
```

Avoid:

```text
Buy immediately
Sell immediately
Guaranteed upside
```

---

# 14. Stored AI Outputs

Useful AI outputs should be stored in `AIAnalysis` and/or `Report`.

Examples:

- Company analysis
- Earnings analysis
- News summary
- Valuation review
- Risk review
- Theme analysis
- CIO summary
- Report draft

Store:

- agent role
- model
- prompt version
- output text
- metadata
- related company/portfolio/report where applicable

---

# 15. AI Guardrails

AI must:

- Be evidence-based
- Mention uncertainty
- Avoid unsupported claims
- Avoid pretending to be a licensed financial advisor
- Avoid automatic trading language
- Be clear about missing data
- Include downside risk when giving opportunity analysis

---

# 16. Hallucination Prevention

AI should receive structured context from internal services.

Do not ask AI to invent financial data.

If data is missing, AI should say it is missing.

Examples of missing data:

- No latest price available
- No earnings data available
- No fundamentals available
- News source unavailable
- Provider rate limited

---

# 17. AI Failure Handling

If AI generation fails:

- Log the failure
- Mark report or analysis as failed/partial
- Do not crash dashboard
- Show fallback message
- Retry only if safe
- Avoid duplicate emails

---

# 18. Evaluation Checklist

Before accepting an AI feature, check:

```text
1. Does it use structured data?
2. Does it avoid unsupported investment commands?
3. Does it store useful outputs?
4. Does it handle missing data?
5. Does it mention uncertainty?
6. Does it include risk?
7. Does it keep AI provider calls centralized?
8. Does it avoid exposing secrets?
9. Does it have tests or manual test steps?
```

---

# 19. Final Principle

AI CIO should make the user calmer and more informed.

If AI output makes the user more impulsive, confused, or emotional, the feature needs to be redesigned.
