# Financial Market Analysis — mini case study (EN)

> Revision 2. Verified against the public repository `Edvanfigueredo/stock-exchange-analysis` on 2026-11-13. The cleanup items in "What's next" should be done before publication [C19][C35].
> **URL:** `/projects/financial-market-analysis/` · **Status:** Completed (learning project) · **Links:** Repository · Streamlit app [C19]

## Summary
A Python tool for quick equity research on US and Brazilian (B3) stocks. It looks a company up by name or ticker, pulls market and fundamental data from Yahoo Finance, and produces a transparent 0–100 score with the reasoning behind every point.

## What it does
- **Lookup:** by company name or ticker, with an automatic fallback to the `.SA` suffix for B3 listings.
- **Market data:** current price and daily change, market capitalization, 52-week range, P/E and dividend yield.
- **Rule-based score** across five fixed factors:
  - P/E ratio;
  - position within the 52-week range;
  - dividend yield;
  - revenue growth;
  - profit margin.

  The score is mapped to *Buy / Neutral / Avoid* bands. Each factor's contribution is listed, so the user sees why, not just what.
- **Two interfaces:**
  - a color-coded terminal dashboard (the score and a session query history);
  - a lightweight Streamlit web app (price, key metrics, 3-month chart, company summary; it does **not** include the score yet).

## Stack
Python · yfinance · pandas · Streamlit · colorama · Dev Container configuration

## Honest scope
- The score is a **simple heuristic with fixed thresholds**. It is **not an AI or machine-learning model**, not a validated investment model and not financial advice; the repository includes that disclaimer.
- The project is written entirely in Python. There is no C++ component.
- No automated tests yet.

## What's next (improvement plan)
- Remove the committed virtual environment, and move the README to Markdown (`README.md`).
- Describe the score as a "rule-based heuristic" rather than a "proprietary engine".
- Bring the score into the Streamlit app, add caching around data requests, and add unit tests for the scoring function.
