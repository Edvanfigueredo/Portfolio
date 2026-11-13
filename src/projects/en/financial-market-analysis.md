---
lang: en
pageKey: fma
permalink: /projects/financial-market-analysis/index.html
layout: layouts/case-study.njk
navKey: projects
eyebrow: Case study · Market data · Python
lead: A Python tool for quick equity research on US and Brazilian (B3) stocks, with a transparent rule-based score and the reasoning behind every point.
role: Built individually (learning project)
---

## What it does

- **Lookup** by company name or ticker, with an automatic fallback to the `.SA` suffix for B3 listings.
- **Market data** from Yahoo Finance: current price and daily change, market capitalization, 52-week range, P/E and dividend yield.
- **Rule-based score (0–100)** across five fixed factors — P/E ratio, position within the 52-week range, dividend yield, revenue growth and profit margin — mapped to *Buy / Neutral / Avoid* bands. Each factor's contribution is listed, so the user sees why, not just what.
- **Two interfaces:** a color-coded terminal dashboard (score and session query history) and a lightweight Streamlit web app (price, key metrics, 3-month chart and company summary).

## Implementation status

| Item | Status |
|---|---|
| Terminal tool with the five-factor score | Implemented |
| Streamlit web app | Implemented partially — it does not include the score yet |
| Automated tests | Not implemented |
| AI or machine-learning model | Not used — the score is a fixed-threshold heuristic |
| C++ component | None — the project is written entirely in Python |

## Honest scope

The score is a **simple heuristic for learning purposes**. It is not a validated investment model and not financial advice; the repository includes that disclaimer.

## Next steps

Remove the committed virtual environment, move the README to Markdown, bring the score into the Streamlit app, add caching around data requests and unit tests for the scoring function.
