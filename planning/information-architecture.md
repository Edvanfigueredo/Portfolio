# Information architecture

## Principles
- **English is the default** at the site root. **Brazilian Portuguese** mirrors every page under `/pt/`.
- **Same slugs in both languages** (`/projects/pulse-finance/` ↔ `/pt/projects/pulse-finance/`). This keeps the language switch a simple prefix swap and avoids duplicated routing logic.
- **No automatic redirect** by IP or browser language. Search engines and shared links always get the page they asked for.
- **The language selector preserves the current page.** It links to the counterpart URL and remembers an explicit choice in `localStorage`, used only to pre-select the selector, never to redirect.
- Every page is static HTML produced by Eleventy at build time. Navigation, footer and metadata come from shared templates.

## Site map
| Page | EN URL | PT URL | Purpose | Primary content source |
|---|---|---|---|---|
| Home | `/` | `/pt/` | 30-second answer: who, what, evidence, contact | `content/*/site.md` § Home |
| About | `/about/` | `/pt/about/` | Narrative: operations → leadership → retraining → consulting | § About |
| Expertise | `/expertise/` | `/pt/expertise/` | Areas with evidence level (practice / project / developing) | § Expertise |
| Projects | `/projects/` | `/pt/projects/` | Index with status labels | § Projects |
| Case study | `/projects/<slug>/` | `/pt/projects/<slug>/` | 14-section case study (flagships) or mini case | `content/case-studies/*` |
| Journey | `/journey/` | `/pt/journey/` | Timeline: experience and education | § Journey |
| Credentials | `/credentials/` | `/pt/credentials/` | Tiered, curated credentials | § Credentials |
| Contact | `/contact/` | `/pt/contact/` | Email, LinkedIn, GitHub, CVs | § Contact |
| Insights | `/insights/` | `/pt/insights/` | Articles. **Not built or linked until the first approved article.** | — |
| 404 | `/404.html` | — | Bilingual not-found page | — |

**Case-study slugs:**
- `pulse-finance` — flagship, ready subject to confirmations
- `financial-market-analysis` — mini
- `healthcare-capstone` — mini, blocked
- `orkestria`, `cloudcost-navigator` — reserved, created only once evidence exists

## Navigation
Primary: Home · About · Expertise · Projects · Journey · Credentials · Contact · `EN | PT`
- Mobile: a disclosure menu (button with `aria-expanded`), with targets of at least 44 px.
- The current page is marked with `aria-current="page"`.
- Case studies show breadcrumbs: Projects → Project name.
- Footer: disclaimer, LinkedIn, GitHub, language switch, "No tracking" (if C7 holds).

## Home hierarchy (top to bottom)
1. Hero: name, role line, narrative, one paragraph, 2 calls to action, photo [C4]
2. Proof strip: 4 factual markers
3. What I work on: 4 pillars
4. Selected work: up to 3 project cards (status label, one line, link)
5. Journey in brief: 4-step horizontal timeline
6. Credentials: one line, linking to Credentials
7. Closing call to action

## Content model (for Eleventy in Stage 2.4)
- `src/_data/i18n/{en,pt}.json`: UI strings (navigation, buttons, labels, status names).
- `src/{en,pt}/*.njk`: page templates. EN output at the root, PT output under `/pt/`.
- `src/projects/{en,pt}/<slug>.md`: case studies with front matter (title, summary, status, stack, repo, demo, published flag).
- Every page's front matter: `title`, `description`, `translationKey`. Language alternates are generated from `translationKey`, never hand-written.
- `published: false` keeps any page (e.g. a blocked case study) out of the build, the navigation and the sitemap.

## Deployment flexibility (domain not yet decided)
- One setting, `site.url` (e.g. `https://edvanfigueredo.github.io/Portfolio` or a future custom domain), drives canonical URLs, hreflang, Open Graph URLs and the sitemap.
- Eleventy's `pathPrefix` handles the `/Portfolio/` sub-path. Switching to a custom domain changes only these two values plus a `CNAME` file.
