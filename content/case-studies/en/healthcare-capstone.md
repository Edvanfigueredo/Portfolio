# Healthcare Capstone (BMI and Nutrition) — mini case study (EN)

> **Revision 2 · publication blocked until [C18] is answered.** This draft describes only what the public repository `Edvanfigueredo/IMC_BMI_health` contains, as verified on 2026-11-13. Earlier planning materials and the GitHub profile README mention Java, AI, Power BI, a Node/Express backend, React, Azure SQL and Azure Pipelines. **None of these exist in the repository**, so none of them are claimed here.
> **URL:** `/projects/healthcare-capstone/` · **Status:** Academic Project · **Links:** Repository · Live demo

## Summary
A single-page web application built as part of my Systems Analysis and Development degree [C18]. It calculates Body Mass Index, compares the result with country-level reference figures, and generates a 7-day sample meal plan (6 meals a day) adapted to the user's BMI category, country and dietary profile.

## What exists — and what does not
| Category | In the repository |
|---|---|
| **Implemented** | BMI calculation and classification · comparison with a fixed reference table for nine countries [C18: source of the figures] · printable output (browser print) |
| **Deterministic rules and templates** | Meal plans assembled from country-specific food lists and fixed templates, adjusted for vegetarian, lactose-intolerant and type 1 / type 2 diabetic profiles and their combinations |
| **Real AI** | **None.** No language model, no AI API, no network calls. |
| **Backend** | **None.** The app runs entirely in the browser. |
| **Integrations** | **None** beyond Tailwind CSS (CDN) and GitHub Pages hosting. No Azure, Java, Power BI or database. |
| **Planned (not built)** | Items listed in the repository roadmap: Power BI dashboard, user login, result history, external nutrition API, offline mode (PWA) |

## Stack
HTML · Tailwind CSS · JavaScript (no framework) · GitHub Pages

## Honest scope
- **Educational project. It does not replace medical or nutritional advice**, and it is not a clinically validated tool. The disclaimer stays prominent, especially for diabetic profiles.

## What's next
Cite the data sources, add unit tests for the BMI and plan rules, remove the unused `package.json` template, and correct the GitHub profile README so it matches the code.
