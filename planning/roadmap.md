# Development roadmap

Each stage ends at an approval gate. Nothing is merged into `main` or deployed without explicit approval.

| Stage | Deliverable | Depends on | Gate |
|---|---|---|---|
| **2.2 (this stage)** | GitHub audit, positioning, bilingual content, case studies, information architecture, SEO strategy | — | Your review of content and confirmations |
| **2.3 Design system** | Color and type tokens, spacing and grid, navigation, buttons, project card, case-study components, timeline, credential component, status labels; **homepage design direction** presented before the rest | Approved content structure | Approval of the homepage direction |
| **2.4 Build** | Eleventy scaffold (build-time only); EN and PT pages built one at a time (Home → About → Expertise → Journey → Credentials → Contact → Projects index); a test pass after each page | 2.3; answers to C1–C9, C14, C15 | Per page |
| **2.5 Case studies** | Pulse Finance (flagship), Financial Market Analysis and Healthcare capstone (mini), OrkestrIA and CloudCost Navigator (only with evidence); architecture diagrams; real screenshots | C16–C22, C29, C33–C35 | Per case study |
| **2.6 QA** | Widths 360–1440 px; keyboard and screen-reader checks; WCAG 2.2 AA; Lighthouse ≥ 90 ×4; links; console; hreflang validation; GitHub Pages compatibility; final report | 2.4–2.5 | Report review |
| **2.7 Deployment preparation** | GitHub Actions build workflow; instructions; domain configuration (if bought); CV PDFs in EN and PT | Domain decision; your authorization | **Explicit approval to merge and deploy** |

## Dependencies on the repository history cleanup
- The cleanup is planned and rehearsed, but **not authorized yet**. It rewrites every branch (`main`, `update-portfolio`, `claude/busy-knuth-ceqkl6`), so all commit SHAs change.
- **No pull request may be opened before the cleanup**, because pull-request refs cannot be rewritten by the owner.
- Any branch created from `main` before the cleanup inherits the history and widens its scope. Keep the number of branches minimal.

## Parallel tracks (outside this repository; each requires your authorization)
1. **Repository improvements** that raise the evidence level before launch:
   - Pulse: SheetJS upgrade, integer cents, atomic installment payment, English README, screenshots.
   - Financial Market Analysis: cleanup.
   - Banking exercise: endpoints and tests.
2. **GitHub profile:** bilingual README rewrite; pin the case-study repositories; unpin or archive games and exercises.
3. **LinkedIn alignment:** headline, About, Projects and Awards sections matching the site.
4. **Domain:** availability and price check, then purchase by you if approved; DNS and GitHub Pages custom domain configured in Stage 2.7.
