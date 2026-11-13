# Portfolio transformation — working documents (branch `update-portfolio`)

This branch holds **planning and content drafts only**. The production website files (`index.html`, `assets/`, `css/`, `js/`) are **unchanged** from `main`, so merging this branch does not change the live site.

| Path | What it is | Status |
|---|---|---|
| `planning/information-architecture.md` | Site map, URL scheme (EN default, PT under `/pt/`), navigation, content model, domain flexibility | Draft for approval |
| `planning/seo-strategy.md` | Search themes, titles and descriptions (EN/PT), hreflang, structured data, sitemap | Draft for approval |
| `planning/case-study-standard.md` | 14-section case-study structure, evidence rules, evidence still needed for OrkestrIA and CloudCost Navigator | Draft for approval |
| `planning/roadmap.md` | Stages 2.3 → 2.7 and parallel tracks | Draft for approval |
| `content/en/site.md` | Complete English copy: all pages and the CV | Draft, contains `[C#]` markers |
| `content/pt-br/site.md` | Complete Brazilian Portuguese copy, adapted rather than translated | Draft, contains `[C#]` markers |
| `content/case-studies/{en,pt-br}/pulse-finance.md` | Flagship case study, verified against the repository and its executed tests | Draft, contains `[C#]` markers |
| `content/case-studies/{en,pt-br}/financial-market-analysis.md` | Mini case study | Draft |
| `content/case-studies/{en,pt-br}/healthcare-capstone.md` | Mini case study | **Blocked by C18** |

**`[C#]` markers** point to items awaiting the owner's confirmation. The confirmation register and the GitHub audit report are kept **outside** this public repository on purpose: they contain security findings and personal details.

Nothing in `content/` is published until it moves into the Eleventy build (Stage 2.4) and the markers are resolved.
