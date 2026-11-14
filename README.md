# Portfolio — Edvan Figuerêdo Araujo

Professional portfolio: **Technology Consulting · AI & Data · Software Engineering**.
Bilingual (English by default, Brazilian Portuguese under `/pt/`), static, accessible and fast.

Live site: https://edvanfigueredo.github.io/Portfolio/ (PT: https://edvanfigueredo.github.io/Portfolio/pt/).
The site is built from `src/` into `_site/` and published by GitHub Actions. The legacy hand-written site that used to
live at the repository root was removed in November 2026; it remains in the Git history.

## Stack

- **[Eleventy](https://www.11ty.dev/) 3** — used at **build time only**. Visitors receive plain HTML, one CSS file and about 1 KB of JavaScript.
- **No runtime framework, no tracking, no cookies, no third-party requests.** Fonts are self-hosted (IBM Plex Sans, Source Serif 4, IBM Plex Mono — SIL Open Font License, see `src/assets/fonts/LICENSE-*`).
- Node.js 20 or later.

## Review the site locally

```bash
npm ci
npm start                 # http://localhost:8080/Portfolio/ — live reload while editing
```

`npm start` serves the site under the same `/Portfolio/` path as GitHub Pages; open the address it prints.

Visual review gallery (real screenshots of every page — EN/PT, light/dark, desktop/mobile):

```bash
npm run gallery           # needs Playwright with Chromium; writes review/gallery/index.html
```

Open `review/gallery/index.html` in a browser and filter by language, theme, device or page. The folder is git-ignored.
Content that still needs the owner's confirmation is listed in [`planning/pending-confirmations.md`](planning/pending-confirmations.md).

## Commands

```bash
npm ci            # install the build dependency
npm run build     # generate the site in _site/
npm start         # local development server with live reload
npm run check     # static QA of _site/ (structure, SEO, links, images, content rules)
npm test          # build + check
```

## Structure

```
src/
├── _data/
│   ├── site.js          # URL, path prefix, contact links, page keys — the only deployment-specific values
│   └── t.js             # all site copy, English and Portuguese
├── _includes/
│   ├── layouts/         # base.njk (SEO metadata, header, footer), case-study.njk
│   └── partials/        # header, footer, project card
├── pages/               # one template per page, generated for both languages
├── projects/{en,pt}/    # case studies in Markdown
├── assets/              # css/main.css (design system), js/site.js, fonts, images
└── static/              # files copied as-is (favicon)
scripts/
├── check-site.mjs       # dependency-free QA used by CI
├── qa-browser.cjs       # local browser QA (responsiveness, menu, language switch), any engine
├── a11y-*.cjs           # local accessibility audits: axe, contrast, keyboard/screen-reader structure
├── make-gallery.cjs     # review gallery of real screenshots (npm run gallery)
└── make-og.py           # regenerates the social preview images (Pillow)
planning/                # QA report, pending confirmations, LinkedIn media, IA and SEO notes (not published)
```

## Content rules

- Every statement is backed by LinkedIn, a public repository, or a credential. Nothing is inferred.
- Projects state their real status (MVP, completed, learning project) and list known issues; planned features never appear as implemented.
- Only projects with audited code or a confirmed scope are shown. CloudCost Navigator is not shown until its code is available. The Saúde IA capstone is described from its public repository; Guibbor BJJ only within the consulting scope confirmed by the owner.
- No phone number, street address, birth date or government identifiers anywhere.
- EY is mentioned in text only (no logo or brand colors) and no client or internal project is described.

## Quality (latest run, 2026-11-13)

Full results, browsers and commands: [`planning/qa-report.md`](planning/qa-report.md).

- **Accessibility (WCAG 2.2 AA):** axe-core reports 0 violations in Chromium, Firefox and WebKit, in light and dark themes. Contrast of all 2,424 text elements is at least 6.05:1. Keyboard navigation (Tab and Shift+Tab, focus visible and never hidden under the sticky header) and screen-reader structure pass in all three engines.
- **Cross-browser:** 18 pages × 4 widths (360–1440 px) in Chromium, Firefox 155 and WebKit 26.6, without horizontal overflow or errors. Mobile menu, language switch and no-JavaScript navigation verified.
- **Lighthouse (mobile):** Performance 99–100, Accessibility 100, Best Practices 100, SEO 100 (Home and Contact re-checked after the final visual round).
- **Links:** GitHub, LinkedIn and email buttons point to the existing URLs in `src/_data/site.js`; external links open in a new tab with `rel="noopener noreferrer"` and an accessible "opens in a new tab" hint.
- **Build:** `npm test` passes; `npm audit` reports 0 vulnerabilities.
- **Not covered:** real screen readers (NVDA/JAWS/VoiceOver), Safari on macOS/iOS hardware, and the LinkedIn link, which is unreachable from the test environment.

Optional local QA scripts (need Playwright, and `axe-core` for the axe audit — not project dependencies):

```bash
node scripts/qa-browser.cjs http://localhost:8090/Portfolio/ [chromium|firefox|webkit]
node scripts/a11y-axe-run.cjs [chromium|firefox|webkit] http://localhost:8090/Portfolio/
node scripts/a11y-contrast-all.cjs [chromium|firefox|webkit] http://localhost:8090/Portfolio/
node scripts/a11y-keyboard.cjs [chromium|firefox|webkit] http://localhost:8090/Portfolio/
```

## Deployment

`.github/workflows/deploy.yml` builds, checks and publishes `_site/` to GitHub Pages. It runs manually
(Actions → "Deploy to GitHub Pages" → Run workflow) and stops unless **Settings → Pages → Source** is
"GitHub Actions". The CI workflow reports that setting on every push.
To use a custom domain later, change `url` and `pathPrefix` in `src/_data/site.js` and add a `CNAME` file to `src/static/`.

## Contact

- LinkedIn: https://www.linkedin.com/in/edvan-figuer%C3%AAdo-araujo-7b8332272
- GitHub: https://github.com/Edvanfigueredo
