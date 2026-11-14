---
lang: en
pageKey: capstone
permalink: /projects/health-bmi-capstone/index.html
layout: layouts/case-study.njk
navKey: projects
eyebrow: "Case study · Capstone (TCC) · Health"
lead: "My individual capstone for the Systems Analysis and Development degree at Faculdade São Francisco de Assis. A web app that calculates BMI, compares it with national data and suggests educational 7-day meal plans."
role: "Individual academic project developed as a capstone project, approved with a final grade of 9.5. All the code and commits in the public repository are mine."
---

## Summary

The app turns weight, height, country and dietary preference into three things: a BMI with its classification, a comparison with that country's averages, and a 7-day meal plan with six meals a day.

**About the name:** the app is called "Saúde IA" (Health AI), and the academic proposal explored AI for dietary guidance. The version in the repository generates plans with **fixed rules**. It does not use a language model or an external API. This page describes the code as it is.

**Status: functional prototype.** It runs in the browser, with no backend. It is educational and is not a substitute for medical or nutritional advice. No clinical validation was done.

<figure>
  <picture>
    <img src="{{ '/assets/img/capstone-bmi-1280.webp' | url }}" srcset="{{ '/assets/img/capstone-bmi-800.webp' | url }} 800w, {{ '/assets/img/capstone-bmi-1280.webp' | url }} 1280w" sizes="(min-width: 64rem) 44rem, 100vw" width="1280" height="800" loading="lazy" alt="Saúde IA form with weight 72 kg, height 175 cm, Brazil and vegetarian preference, and the result: BMI 23.5, normal weight, compared with Brazil's national average BMI and obesity rate.">
  </picture>
  <figcaption>Input form and result, with example values. Captured locally from the public repository. Interface in Portuguese.</figcaption>
</figure>

## Academic result

Developed as part of my degree in Systems Analysis and Development (ADS) at Faculdade São Francisco de Assis. The capstone was **approved with a final grade of 9.5**.

## Problem

- BMI calculators usually return a number without context or a next step.
- General meal suggestions ignore local food habits and common restrictions such as lactose intolerance and diabetes.

## What is implemented

- **BMI calculation and classification** in six bands, from underweight to obesity class III.
- **Country comparison** for nine countries (Brazil, United States, Mexico, Argentina, France, Japan, Germany, Ireland, Italy): national average BMI, obesity rate and ranking. The values are stored in the code. Reference source for the BMI data: World Health Organization (WHO), 2025.
- **7-day meal plans** with six meals a day. The goal follows the BMI band: healthy weight gain, maintenance or moderate weight loss.
- **Eight dietary profiles:** meat-eater, vegetarian, lactose intolerant, type 1 or type 2 diabetes, and combinations. Diabetes profiles swap in lower-sugar options; lactose-free profiles use plant-based drinks.
- **Food lists per country,** built from foods that are common in each country.
- **Print or save as PDF** through the browser, and a responsive layout. User input is escaped before it is displayed.

<figure>
  <picture>
    <img src="{{ '/assets/img/capstone-plan-1280.webp' | url }}" srcset="{{ '/assets/img/capstone-plan-800.webp' | url }} 800w, {{ '/assets/img/capstone-plan-1280.webp' | url }} 1280w" sizes="(min-width: 64rem) 44rem, 100vw" width="1280" height="800" loading="lazy" alt="Generated 7-day plan focused on maintenance for a vegetarian profile in Brazil, with breakfast, snacks, lunch, dinner and supper for each day.">
  </picture>
  <figcaption>Part of a generated 7-day plan (example values).</figcaption>
</figure>

## Not implemented

On the roadmap in the repository, not built: a Power BI dashboard, user login, result history, an external nutrition API and offline mode (PWA).

## Technical notes and limitations

| Item | Situation |
|---|---|
| Stack | HTML, vanilla JavaScript (one script of about 570 lines), Tailwind CSS from its CDN, hosted on GitHub Pages |
| Plan generation | Rule-based: plan templates by goal, plus food lists by country and profile, with random picks |
| Tests | No automated tests |
| Repository | `package.json` and `src` are leftovers from an unused React template |
| Data | Reference source: World Health Organization (WHO), 2025 |

## Next steps

Document the data sources, add tests for the BMI and plan rules, and remove the unused template files.
