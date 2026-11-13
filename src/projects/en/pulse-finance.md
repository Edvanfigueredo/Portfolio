---
lang: en
pageKey: pulse
permalink: /projects/pulse-finance/index.html
layout: layouts/case-study.njk
navKey: projects
eyebrow: Case study · Personal finance · Local-first web app
lead: A local-first personal finance web app that I built individually. Statement import, duplicate flags, debts, recurring payments and forecasts in one consistent monthly view.
role: Designed and built individually
---

## Summary

Pulse Finance brings a user's own financial data into one monthly view:

- **Import:** bank statements (OFX, CSV/Excel, PDF) and JSON backups. Possible duplicates are flagged for review before anything is saved.
- **Planning:** debts with installments, recurring payments, budgets and goals.
- **Projection:** a multi-month forecast and a what-if simulator.

All data stays in the browser: no server, no account, no API key. **Status: MVP.** The core flows work and are tested; the known issues are listed in the "Known issues" section and the app is not presented as production-ready.

<figure>
  <picture>
    <img src="{{ '/assets/img/pulse-dashboard-1280.webp' | url }}" srcset="{{ '/assets/img/pulse-dashboard-800.webp' | url }} 800w, {{ '/assets/img/pulse-dashboard-1280.webp' | url }} 1280w" sizes="(min-width: 64rem) 44rem, 100vw" width="1280" height="800" loading="lazy" alt="Pulse Finance dashboard in demo mode: net worth, account balance, monthly income and expenses, the Pulse Score with its five factors, and charts.">
  </picture>
  <figcaption>Dashboard with the app's built-in demonstration dataset (fictitious data). Interface in Portuguese.</figcaption>
</figure>

## Problem

- Bank statements arrive in incompatible formats, and re-importing the same period creates duplicates.
- Installment purchases and recurring bills are hard to see month by month; the same information is entered in several places and the numbers drift apart.
- Many people do not want to upload bank statements to a third-party service.

## What is implemented

- **Import:** JSON (backup or transaction list); Excel/CSV with automatic column detection and a manual-mapping fallback; OFX; PDF on a best-effort basis for the common `date · description · amount` layout. A summary (count, income, expenses, period) is shown before confirming.
- **Duplicate flags:** each imported line is classified as *new*, *exact duplicate* (same date, amount and description) or *probable duplicate* (same amount within ±3 days).
- **Debts and installments:** schedules are generated automatically, with rounding absorbed by the last installment. Paying an installment records the transaction, links it and updates the debt status; the payment can be undone.
- **Recurring income and expenses,** including a "last business day of the month" rule (weekends only; public holidays are not handled).
- **Financial calendar:** real transactions, pending installments and projected recurring items; the dashboard reads its upcoming items from the same function.
- **Forecast and what-if simulator:** multi-month projection plus scenarios for extra monthly savings, cutting a category, or paying off a debt.
- **Privacy mode** that masks values on screen, **alerts** for due items, budgets and goals, and export to CSV and JSON.

**Not implemented** (by design or planned): backend, multi-device sync, authentication.

<figure>
  <picture>
    <img src="{{ '/assets/img/pulse-calendario-1280.webp' | url }}" srcset="{{ '/assets/img/pulse-calendario-800.webp' | url }} 800w, {{ '/assets/img/pulse-calendario-1280.webp' | url }} 1280w" sizes="(min-width: 64rem) 44rem, 100vw" width="1280" height="800" loading="lazy" alt="Pulse Finance financial calendar in demo mode, combining real transactions, pending installments and projected recurring items for the month.">
  </picture>
  <figcaption>Financial calendar (demonstration data).</figcaption>
</figure>

## Architecture

```
UI (views, components)
  → Services       business rules: transactions, import, calendar, forecast, simulator, alerts
    → Repositories   one per entity: transactions, accounts, debts, recurring items, goals
      → Store          in-memory state + change notifications
        → db.js          the only module that talks to IndexedDB (localStorage fallback)
```

Persistence is isolated in one module on purpose: moving to a REST backend means rewriting `db.js` and `store.js` only.

## Key technical decisions

| Decision | Alternative considered | Why |
|---|---|---|
| Local-first, no backend | Cloud backend with accounts | Privacy by design and zero infrastructure; the cost is no sync and no real authentication, both documented. |
| One persistence module behind repositories | Calling IndexedDB from services | Keeps the storage choice reversible. |
| Central HTML escaping (`escapeHtml` / `esc`) | A UI framework with automatic escaping | Views render with template literals, so user data passes through one escaping function to prevent XSS. |
| Duplicate review before saving | Import directly, clean up later | The user decides with full information before data is written. |
| Limitations stated in the product | Claiming universal PDF parsing or "AI" | PDF import is labeled best effort; the in-app assistant is rule-based, not a language model. |

## Known issues (open)

1. **OFX amounts with a comma decimal separator** (e.g. `-123,45`) are read without the cents; OFX entries without a date receive the current date without a warning.
2. **Import and reconciliation are not yet covered by automated tests** (line coverage: reconciliation 6%, import service 13%, parsers 4–19%).
3. **Monetary values use floating-point numbers;** they should be stored as integer cents.
4. **Paying an installment performs two separate writes;** it should be one atomic operation.
5. **Dependencies:** the spreadsheet library (SheetJS 0.18.5 from npm) has published high-severity advisories; development tools (Vite, Vitest) need major-version updates.

## Evidence

- **42 automated tests in 7 files, all passing** on a clean install (verified 2026-11-13): onboarding, transaction CRUD, debts and installment maths, demo isolation, forecast, score, what-if simulator, privacy mode, alerts, goals, net worth, and a smoke test that navigates every screen.
- **Measured line coverage:** 47% overall; 96–100% for debts, forecast, simulator, business-day rules and privacy mode.
- **CI/CD:** the GitHub Actions workflow is configured to run `npm ci → npm test → npm run build` and to deploy only if the tests pass.
- **No usage metrics exist,** so none are claimed.

## Next steps

Fix the known issues above, add an English interface and README, and — optionally — a backend API with authentication and sync, for which the layering is already prepared.
