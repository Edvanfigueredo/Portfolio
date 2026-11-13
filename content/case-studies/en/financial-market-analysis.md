# Financial Market Analysis — mini case study (EN)

> Verified against the public repository `Edvanfigueredo/stock-exchange-analysis` on 2026-11-13. The cleanup items in "What's next" should ideally be done before publication [C19][C35].
> **URL:** `/projects/financial-market-analysis/` · **Status:** Completed — learning project · **Links:** Repository · Streamlit app [C19]

## Summary
A Python tool for quick equity research on US and Brazilian (B3) stocks. It looks a company up by name or ticker, pulls market and fundamental data from Yahoo Finance, and produces a transparent 0–100 heuristic score with the reasoning behind every point.

## What it does
- **Lookup:** by company name or ticker, with an automatic fallback to the `.SA` suffix for B3 listings.
- **Market data:** current price and daily change, market capitalization, 52-week range, P/E and dividend yield.
- **Heuristic score** across five rule-based factors:
  - P/E ratio;
  - position within the 52-week range;
  - dividend yield;
  - revenue growth;
  - profit margin.

  The factors are mapped to *Buy / Neutral / Avoid* bands. Each factor's contribution is listed, so the user sees why, not just what.
- **Two interfaces:** a color-coded terminal dashboard with a session query history, and a lightweight Streamlit web app (price, key metrics, 3-month chart, company summary).

## Stack
Python · yfinance · pandas · Streamlit · colorama · Dev Container configuration

## Honest scope
- The score is a **simple, rule-based heuristic for learning purposes**. It is not a validated investment model and not financial advice; the repository includes that disclaimer.
- The Streamlit app shows market data but does not yet include the score.
- No automated tests yet.

## What's next (improvement plan)
- Remove the committed virtual environment, and move the README to Markdown (`README.md`).
- Describe the score as a "rule-based heuristic" rather than a "proprietary engine".
- Bring the score into the Streamlit app, add caching around data requests, and add unit tests for the scoring function.
