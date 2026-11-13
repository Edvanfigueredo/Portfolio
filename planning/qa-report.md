# QA report — accessibility, cross-browser, SEO and build

**Date:** 2026-11-13 · **Branch:** `update-portfolio` · **Scope:** the Eleventy site in `src/` (build output `_site/`).
Everything below was executed against a local build served under `/Portfolio/`, the same path prefix as GitHub Pages. Nothing was deployed.

## Browsers

| Engine | Version | How |
|---|---|---|
| Chromium | Playwright 1.63 build | Pre-installed |
| Firefox (Gecko) | 155.0 | Playwright build |
| WebKit (Safari engine) | 26.6 | Playwright build on Linux; not a macOS/iOS Safari install |

## Accessibility (WCAG 2.2 AA)

| Check | Chromium | Firefox | WebKit |
|---|---|---|---|
| axe-core 4.14 — WCAG 2.0/2.1/2.2 A+AA + best practices, 19 pages × 2 widths × light/dark | 0 violations | 0 violations | 0 violations |
| Text contrast of every text element (2,264 elements, light + dark) | all ≥ 4.5:1 (lowest 6.05:1) | same | same |
| Keyboard: Tab and Shift+Tab through all interactive elements, focus visible, focus not hidden under the sticky header (2.4.11), skip link first | pass | pass | pass (Alt+Tab, Safari behaviour) |
| Screen-reader structure (accessibility tree): banner, navigation, main and contentinfo landmarks; heading levels without jumps; no unnamed links or buttons | pass | pass | pass |

Non-text contrast (1.4.11): the focus ring is 4.8:1 (light) and 9.9:1 (dark) against the page; it is drawn 2 px outside each element, so it always sits on the page background. Accent and primary button: ≥ 8:1.

**Fixed during this audit**
- `heading-order` on Projects (EN/PT): added a section heading between the page `h1` and the project cards.
- `scrollable-region-focusable` (serious) in case studies: wide tables and the text diagram now sit in labelled, keyboard-focusable scroll regions.

**Not tested:** a real screen reader (NVDA, JAWS, VoiceOver). The accessibility tree that screen readers use was inspected programmatically.

## Cross-browser rendering and behaviour

| Check (18 pages × 360/768/1024/1440 px) | Chromium | Firefox | WebKit |
|---|---|---|---|
| No horizontal overflow, no console errors, no HTTP ≥ 400 | pass | pass | pass |
| Mobile menu (keyboard, Escape, focus return), language switch keeps the page, navigation without JavaScript | pass | pass | pass |
| Self-hosted fonts load (Plex Sans 400/500/600, Source Serif 4 600, Plex Mono 400) | pass | pass | pass |

**Fixed:** the expertise table used different automatic column widths in WebKit. Explicit column widths now produce identical layouts (218/239/326/305 px at 1280 px) in all three engines.

## Performance and SEO (Lighthouse 12, mobile profile)

| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS | Weight |
|---|---|---|---|---|---|---|---|
| Home (EN) | 99 | 100 | 100 | 100 | 1.8 s | 0 | 151 KiB |
| Expertise (PT) | 100 | 100 | 100 | 100 | 1.7 s | 0 | 116 KiB |
| Pulse Finance case study | 99 | 100 | 100 | 100 | 1.8 s | 0.001 | 178 KiB |

The remaining Lighthouse hints (cache TTL, text compression) come from the local test server; GitHub Pages serves compressed, cached assets.

`npm run check` (CI) validates on every build:
- one `h1`, title and description lengths, `lang`;
- self-referencing canonical; reciprocal `en` / `pt-BR` / `x-default` hreflang;
- Open Graph image; internal links and `srcset`; image `alt` and dimensions; `rel="noopener"`;
- valid JSON-LD;
- absence of unresolved confirmation markers, placeholders and personal data patterns.

External links:
- **GitHub:** the profile and both repositories exist.
- **LinkedIn:** **not verified**, because the host is not reachable from the test environment.

## Dependencies, scripts and CI

- `@11ty/eleventy` 3.1.2 → **3.1.8** (patch). The build output is byte-identical; `npm audit` reports 0 vulnerabilities. It is the only dependency.
- Unused font face removed (Source Serif 4 regular, never rendered).
- **CI** (`.github/workflows/ci.yml`): `npm ci`, build and check on every push, with a 10-minute timeout and superseded runs cancelled.
- **Deploy** (`.github/workflows/deploy.yml`): unchanged in behaviour. It runs only manually and needs the Pages source switched to "GitHub Actions".
- **GitHub Pages safety:** `_config.yml` keeps Jekyll from processing the new site. Verified with Jekyll 3.10: the published output equals the legacy site.

## How to reproduce

```bash
npm ci && npm test
```
```bash
node scripts/qa-browser.cjs http://localhost:8090/Portfolio/ firefox
```
```bash
node scripts/a11y-axe-run.cjs webkit http://localhost:8090/Portfolio/
```

Browser scripts need Playwright with the chosen browser, and `axe-core` for the axe audit. Neither is a project dependency.
