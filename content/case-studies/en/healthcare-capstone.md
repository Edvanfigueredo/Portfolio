# Healthcare Capstone (BMI and Nutrition) — mini case study (EN)

> **Publication blocked until [C18] is answered.** The public repository `Edvanfigueredo/IMC_BMI_health` is a front-end application with rule-based logic. The architecture described in earlier planning (Node/Express, React, Azure SQL, Azure Pipelines, AI-generated plans) is **not** in that repository. This draft describes only what the public code shows.
> **URL:** `/projects/healthcare-capstone/` · **Status:** Academic Project · **Links:** Repository · Live demo

## Summary
A web application built as part of my Systems Analysis and Development degree [C18]. It calculates Body Mass Index, compares the result with country-level statistics, and generates a 7-day, 6-meals-a-day sample meal plan adapted to the user's BMI category, country and dietary profile.

## What it does
- BMI calculation and classification.
- Comparison with a reference table for nine countries [C18: source of the country statistics].
- Rule-based meal plans built from country-specific food lists. They support vegetarian, lactose-intolerant and type 1 / type 2 diabetic profiles, and combinations of them.
- Printable output.

## Stack
HTML · Tailwind CSS · JavaScript (no framework) · GitHub Pages

## Honest scope
- Plans come from **deterministic rules and templates**, not from a language model.
- **Educational project. It does not replace medical or nutritional advice**, and it is not a clinically validated tool. The disclaimer stays prominent, especially for diabetic profiles.

## What's next
Cite the data sources, add unit tests for the BMI and plan rules, clean up the unused `package.json` template, and, if [C18] confirms it, publish the full layered version with its architecture.
