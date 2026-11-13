# Portfolio transformation — working documents (branch `update-portfolio`)

This branch holds the **new site implementation** (`src/`, built with Eleventy into `_site/`) plus these planning and content drafts. The legacy production files (`index.html`, `assets/`, `css/`, `js/`) are **unchanged**, so merging this branch alone does not change the live site; the cut-over needs the Pages source switch described in the main README.

The copy actually rendered on the site is `src/_data/t.js` and `src/projects/`. The files in `content/` are the editorial reference they were derived from; items still awaiting confirmation (`[C#]`) are **not** rendered.

| Path | What it is | Status |
|---|---|---|
| `planning/information-architecture.md` | Site map, URL scheme (EN default, PT under `/pt/`), navigation, content model, domain flexibility | Draft for approval |
| `planning/seo-strategy.md` | Search themes, titles and descriptions (EN/PT), hreflang, structured data, sitemap | Draft for approval |
| `planning/case-study-standard.md` | 14-section case-study structure, evidence rules, evidence still needed for OrkestrIA and CloudCost Navigator | Draft for approval |
| `planning/roadmap.md` | Stages 2.3 → 2.7 and parallel tracks | Draft for approval |
| `content/en/site.md` | Complete English copy: all pages and the CV | Draft, contains `[C#]` markers |
| `content/pt-br/site.md` | Complete Brazilian Portuguese copy, adapted rather than translated | Draft, contains `[C#]` markers |
| `content/case-studies/{en,pt-br}/pulse-finance.md` | Flagship candidate (MVP), verified against the repository: tests executed, coverage measured, known issues listed | Draft rev. 2, contains `[C#]` markers |
| `content/case-studies/{en,pt-br}/financial-market-analysis.md` | Mini case study (rule-based score, Python only) | Draft rev. 2 |
| `content/case-studies/{en,pt-br}/healthcare-capstone.md` | Mini case study separating implemented, rule-based, AI (none), backend (none) and planned | **Blocked by C18** |

**Revision 2 (after the critical review):**
- EY role wording without an internal grade.
- "More than ten years" of operations experience, counting only worked periods.
- English B1.
- Pulse presented as an individual project with status MVP.
- Claims limited to what the repositories show.

**`[C#]` markers** point to items awaiting the owner's confirmation. The confirmation register and the GitHub audit report are kept **outside** this public repository on purpose: they contain security findings and personal details.

Nothing in `content/` is published until it moves into the Eleventy build (Stage 2.4) and the markers are resolved.
