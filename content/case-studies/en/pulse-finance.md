# Pulse Finance — case study (EN)

> **Status of this draft:** every technical statement was verified against the public repository `Edvanfigueredo/CarteiraDigitalPulse` on 2026-11-13. The tests were executed, not just read. Items marked `[C#]` need confirmation before publication.
> **URL:** `/projects/pulse-finance/` · **Status label:** Completed — v2.0 · **Links:** Repository · Live demo [C33]

---

## 1. Executive summary
Pulse Finance is a local-first personal finance web application. Users bring their own bank data:
- Statements import in five formats (JSON, Excel, CSV, OFX and PDF).
- A reconciliation step flags duplicates before anything is saved.
- The app connects debts, recurring payments, budgets and goals into one consistent monthly view, with a forecast and a what-if simulator.

All data stays in the browser. There is no server, no account and no API key. The codebase follows a layered architecture, and 42 automated tests run in CI before every deployment.

## 2. Business context
Personal finance tools usually make a trade-off:
- **Spreadsheets** are private but manual.
- **Cloud apps** automate more but ask users to hand over banking data.

Pulse was built as an educational tool for people who want to organize income, spending and debt, and learn from their own numbers, without that trade-off. [C22: personal project or university extension project?]

## 3. Problem
- Bank statements arrive in incompatible formats, and re-importing the same period creates duplicates.
- Instalment purchases and recurring bills are hard to see month by month. Users enter the same information in several places, and the numbers drift apart.
- Privacy: users may not want to upload statements to a third-party service.

## 4. My role and contributions
[C34][C29] *Draft, to be confirmed:* I designed and built the application end to end: requirements, architecture, business rules, the import and reconciliation logic, the test suite, documentation and the CI/CD pipeline. *(If AI-assisted development was used, the final text will say so and describe what I specified, reviewed and tested.)*

## 5. Solution overview
- **Statement import** in JSON (full backup or transaction list), Excel/CSV with automatic column detection and a manual-mapping fallback, OFX, and PDF (best effort for the common `date · description · amount` layout). A summary (count, income, expenses, period) and a duplicate check are shown before confirming.
- **Reconciliation:** each imported line is classified as *new*, *exact duplicate* (same date, amount and description) or *probable duplicate* (same amount within ±3 days).
- **Debts and installments:** schedules are generated automatically, with rounding absorbed by the last installment. Paying an installment creates the real transaction, links it to the installment, updates the debt status, and can be undone.
- **Recurring income and expenses**, including a "last business day of the month" rule.
- **Financial calendar:** merges real transactions, pending installments and projected recurring items without double counting. The dashboard reads from the same source, so the two views can't disagree.
- **Forecast and what-if simulator:** multi-month projection, plus scenarios for extra monthly savings, cutting a category by a percentage, or paying off a debt.
- **Privacy mode:** masks monetary values on screen. **Alerts** for due items, budgets and goals. Export to CSV and JSON.

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
| Central HTML escaping (`escapeHtml` / `esc` template tag) | A UI framework with automatic escaping | Views render with template literals and `innerHTML`, so all user data passes through one escaping function to prevent XSS. |
| Reconciliation before commit, with exact vs probable duplicates | Importing directly and deduplicating later | Users decide with full information. Wrong data is never written silently. |
| Honest limitations in the product | Claiming universal PDF parsing or "AI" | PDF import is labeled best effort. The in-app assistant is explicitly rule-based, not a language model. |

## 9. Engineering challenges
- **Heterogeneous statements:** auto-detecting spreadsheet columns, with a manual-mapping fallback when detection fails.
- **One source of truth:** the calendar, dashboard and reports must show identical numbers across real, pending and projected items.
- **Installment arithmetic:** splitting totals into installments without losing cents.
- **Demo isolation:** a demonstration dataset that never contaminates the user's real data. This is covered by tests.

## 10. Security and reliability
- No bank passwords, card security codes, credentials or tokens are ever stored. Data stays in the browser's IndexedDB on the user's device.
- XSS mitigation through centralized escaping.
- There is **no authentication**: anyone with access to the browser can see the data. This is documented.
- **Known improvement items** (from my own review; listed here so the status stays honest):
  - Upgrade SheetJS to the maintained 0.20.x line. The npm 0.18.5 release has a published high-severity advisory, and the app parses user-uploaded spreadsheets. [C35]
  - Store amounts as integer cents instead of floating-point numbers.
  - Make installment payment a single atomic IndexedDB transaction.
  - Stop publishing source maps in production.

## 11. Results and evidence
- **42 automated tests in 7 files, all passing.** Executed on a clean install on 2026-11-13: onboarding, empty first-run state, transaction CRUD, installment maths, demo isolation, forecast, score, privacy mode, alerts, goals and net worth, and a smoke test that navigates every screen with sparse and full datasets.
- **CI/CD:** GitHub Actions runs `npm ci → npm test → npm run build` and deploys to GitHub Pages only if the tests pass.
- **No usage metrics exist**, so none are claimed.

## 12. Current status
**Completed — v2.0.** Feature-complete for its local-first scope. A backend, sync and authentication are deliberately out of scope. Live demo: [C33].

## 13. Lessons learned
[Draft for your review. It must reflect your real experience.]
- Writing down the limitations made the scope decisions easier to defend than adding features would have been.
- Tests that navigate every screen caught integration breakages that unit tests alone would miss.

## 14. Future improvements
- The security and reliability items listed in section 10.
- An optional backend API with authentication and multi-device sync. The layering is already prepared for it.
- Drag-and-drop column mapping, and line-by-line category editing during reconciliation.
- An English interface and README, plus screenshots in the repository.
