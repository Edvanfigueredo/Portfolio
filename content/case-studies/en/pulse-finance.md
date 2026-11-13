# Pulse Finance — case study (EN)

> **Status of this draft:** revision 2. Every technical statement was verified against the public repository `Edvanfigueredo/CarteiraDigitalPulse` (commit `4a73070`) on 2026-11-13: tests and build executed, coverage measured, import parsing exercised. Items marked `[C#]` need confirmation before publication.
> **URL:** `/projects/pulse-finance/` · **Status label:** MVP — v2.0 · **Links:** Repository · Live demo [C33]

---

## 1. Executive summary
Pulse Finance is a local-first personal finance web application that I built individually. It brings a user's own financial data into one consistent monthly view:
- **Import:** bank statements (OFX, CSV/Excel, PDF) and JSON backups. Possible duplicates are flagged for review before anything is saved.
- **Planning:** debts with installments, recurring payments, budgets and goals.
- **Projection:** a multi-month forecast and a what-if simulator.

All data stays in the browser. There is no server, no account and no API key. The codebase follows a layered architecture. 42 automated tests pass, and the CI workflow is configured to run them before each deployment.

**Status: MVP.** The core flows work and are tested. Known issues in import parsing, monetary precision and dependency security are listed openly in section 10. The app is not presented as production-ready.

## 2. Business context
Personal finance tools usually make a trade-off:
- **Spreadsheets** are private but manual.
- **Cloud apps** automate more but ask users to hand over banking data.

Pulse was built as an educational tool for people who want to organize income, spending and debt, and learn from their own numbers, without that trade-off. [C22: personal project or university extension project?]

## 3. Problem
- Bank statements arrive in incompatible formats, and re-importing the same period creates duplicates.
- Installment purchases and recurring bills are hard to see month by month. Users enter the same information in several places, and the numbers drift apart.
- Privacy: users may not want to upload statements to a third-party service.

## 4. My role and contributions
I designed and built Pulse individually: requirements, architecture, business rules, import and reconciliation logic, the test suite, documentation and the CI/CD pipeline. [C29: if AI-assisted development was used, the final text will say so and describe what I specified, reviewed and tested.]

## 5. Solution overview
**Implemented:**
- **Import:**
  - JSON (Pulse backup or transaction list);
  - Excel/CSV with automatic column detection and a manual-mapping fallback;
  - OFX;
  - PDF, on a best-effort basis for the common `date · description · amount` layout.

  A summary (count, income, expenses, period) is shown before confirming.
- **Duplicate flags:** each imported line is classified as *new*, *exact duplicate* (same date, amount and description) or *probable duplicate* (same amount within ±3 days).
- **Debts and installments:** schedules are generated automatically, with rounding absorbed by the last installment. Paying an installment records the real transaction, links it to the installment and updates the debt status, and the payment can be undone.
- **Recurring income and expenses,** including a "last business day of the month" rule (weekends only; public holidays are not handled).
- **Financial calendar:** combines real transactions, pending installments and projected recurring items. The dashboard reads its upcoming items from the same function, so both views use one source.
- **Forecast and what-if simulator:** multi-month projection, plus scenarios for extra monthly savings, cutting a category by a percentage, or paying off a debt.
- **Privacy mode:** masks monetary values on screen. **Alerts** for due items, budgets and goals. Export to CSV and JSON.

**Not implemented (by design or planned):** backend, sync between devices, authentication. See section 14.

## 6. Architecture
```
UI (views, components)
  → Services       business rules: transactions, import, calendar, forecast, simulator, alerts
    → Repositories   one per entity: transactions, accounts, debts, recurring items, goals…
      → Store          in-memory state + change notifications
        → db.js          the only module that talks to IndexedDB (localStorage fallback)
```
Persistence is isolated in one module on purpose. Moving to a REST backend means rewriting `db.js` and `store.js` only; repositories, services and UI stay untouched.
*(Diagram to be produced in Stage 2.5 as an accessible SVG.)*

## 7. Technology stack
Vanilla JavaScript (ES modules) · Vite · IndexedDB · Chart.js · SheetJS (spreadsheets) · pdf.js (PDF text extraction) · Vitest + jsdom + fake-indexeddb (tests) · GitHub Actions → GitHub Pages

## 8. Key technical decisions
| Decision | Alternative considered | Why |
|---|---|---|
| Local-first, no backend | Cloud backend with accounts | Privacy by design and zero infrastructure. The cost: no multi-device sync and no real authentication, both documented as out of scope. |
| A single persistence module behind repositories | Calling IndexedDB from services | Keeps the storage choice reversible. A future API replaces one layer. |
| Central HTML escaping (`escapeHtml` / `esc` template tag) | A UI framework with automatic escaping | Views render with template literals and `innerHTML`, so user data passes through one escaping function to prevent XSS. |
| Duplicate review before saving | Importing directly and cleaning up later | Users decide with full information before data is written. |
| Honest limitations in the product | Claiming universal PDF parsing or "AI" | PDF import is labeled best effort. The in-app assistant is explicitly rule-based, not a language model. |

## 9. Engineering challenges
- **Heterogeneous statements:** auto-detecting spreadsheet columns, with a manual-mapping fallback when detection fails.
- **One source of truth:** the calendar and dashboard read real, pending and projected items from the same function.
- **Installment arithmetic:** splitting totals into installments without losing cents.
- **Demo isolation:** a demonstration dataset that never contaminates the user's real data. This is covered by tests.

## 10. Security, reliability and known issues
**In place:**
- No bank passwords, card security codes, credentials or tokens are stored. Data stays in the browser's IndexedDB on the user's device.
- XSS mitigation through centralized escaping.

**Limitations by design:** there is no authentication. Anyone with access to the browser can see the data, and this is documented.

**Known issues, open** (found in my own review; they are why the status is MVP):
1. **OFX amounts with a comma decimal separator** (e.g. `-123,45`) are read without the cents. Some Brazilian bank exports use this format. OFX entries without a date receive the current date without a warning.
2. **Import and reconciliation are not yet covered by automated tests.** Measured line coverage: reconciliation 6%, import service 13%, parsers 4–19%.
3. **Monetary values use floating-point numbers.** They should be stored as integer cents.
4. **Paying an installment performs two separate writes,** so an interruption between them could leave the payment recorded and the installment still pending. It should be one atomic operation.
5. **Dependencies:** the spreadsheet library (SheetJS 0.18.5 from npm) has published high-severity advisories, and the fix requires the maintained 0.20.x line from SheetJS's own distribution. Several development-only tools (Vite, Vitest) also need major-version updates. [C35]

## 11. Results and evidence
- **42 automated tests in 7 files, all passing,** executed on a clean install on 2026-11-13. They cover onboarding, the empty first-run state, transaction CRUD, debts and installment maths, demo isolation, forecast, score, the what-if simulator, privacy mode, alerts, goals and net worth, and a smoke test that navigates every screen with sparse and full datasets.
- **Measured coverage:** 47% of lines overall.
  - 96–100% for debts, forecast, simulator, business-day rules and privacy mode.
  - Low for import and reconciliation (see section 10).
- **CI/CD:** the GitHub Actions workflow is configured to run `npm ci → npm test → npm run build` and to deploy to GitHub Pages only if the tests pass.
- **No usage metrics exist,** so none are claimed.

## 12. Current status
**MVP — v2.0.** Working for its local-first scope, with the open issues listed in section 10. Not production-ready. A backend, sync and authentication are deliberately out of scope. Live demo: [C33].

## 13. Lessons learned
[Draft for your review. It must reflect your real experience.]
- Writing down the limitations made the scope decisions easier to defend than adding features would have been.
- Tests that navigate every screen caught integration breakages, but the areas without tests (import parsing) are exactly where the review found defects.

## 14. Future improvements
- Fix the known issues in section 10: comma decimals in OFX, tests for import and reconciliation, integer cents, an atomic installment payment, dependency updates.
- An optional backend API with authentication and multi-device sync. The layering is already prepared for it.
- Drag-and-drop column mapping, and line-by-line category editing during reconciliation.
- An English interface and README, plus screenshots in the repository.
