// Browser QA (local): node scripts/qa-browser.cjs [baseUrl]
// Requires Playwright with Chromium available on the machine (not a project dependency).
// Serve _site under the path prefix first, e.g. a folder containing a "Portfolio" symlink to _site.
const { chromium } = require("playwright");

const BASE = process.argv[2] || "http://localhost:8090/Portfolio/";
const PATHS = ["", "about/", "expertise/", "projects/", "projects/pulse-finance/", "projects/financial-market-analysis/", "journey/", "credentials/", "contact/"];
const PAGES = [...PATHS, ...PATHS.map((p) => "pt/" + p)];
const WIDTHS = [360, 768, 1024, 1440];

(async () => {
  const browser = await chromium.launch();
  const problems = [];
  let checks = 0;

  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    for (const path of PAGES) {
      const errs = [];
      const onErr = (e) => errs.push(e.message || String(e));
      const onConsole = (m) => m.type() === "error" && errs.push(m.text());
      const onResp = (r) => r.status() >= 400 && errs.push(`${r.status()} ${r.url()}`);
      page.on("pageerror", onErr); page.on("console", onConsole); page.on("response", onResp);
      await page.goto(BASE + path, { waitUntil: "networkidle" });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (overflow > 0) problems.push(`${width}px ${path || "/"}: horizontal overflow ${overflow}px`);
      // Visible interactive targets must be at least 44px tall (WCAG 2.2 target size, with margin)
      const small = await page.$$eval("a, button", (els) => els.filter((el) => {
        const r = el.getBoundingClientRect();
        const inline = el.closest("p, li, td, dd, figcaption") && !el.closest(".nav-list, .footer-links, .card-foot, .actions, .contact-list");
        return r.width > 0 && r.height > 0 && r.height < 24 && !inline && !el.classList.contains("skip-link");
      }).map((el) => el.textContent.trim().slice(0, 30)));
      if (small.length) problems.push(`${width}px ${path || "/"}: small targets ${JSON.stringify(small)}`);
      if (errs.length) problems.push(`${width}px ${path || "/"}: ${JSON.stringify(errs)}`);
      page.off("pageerror", onErr); page.off("console", onConsole); page.off("response", onResp);
      checks++;
    }
    await page.close();
  }

  // Interaction checks
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE, { waitUntil: "networkidle" });
  // 1. Skip link is the first focusable element and moves focus to <main>
  await page.keyboard.press("Tab");
  const first = await page.evaluate(() => document.activeElement.className);
  if (first !== "skip-link") problems.push(`first Tab focuses "${first}", expected skip-link`);
  await page.keyboard.press("Enter");
  const focused = await page.evaluate(() => document.activeElement.id);
  if (focused !== "main") problems.push(`skip link moved focus to "${focused}", expected main`);
  // 2. Mobile menu: hidden, opens with keyboard, closes with Escape and returns focus
  const navVisible = () => page.isVisible("#site-nav .nav-list");
  if (await navVisible()) problems.push("mobile nav visible before opening");
  await page.focus(".nav-toggle"); await page.keyboard.press("Enter");
  if (!(await navVisible())) problems.push("mobile nav did not open with keyboard");
  if ((await page.getAttribute(".nav-toggle", "aria-expanded")) !== "true") problems.push("aria-expanded not true when open");
  await page.keyboard.press("Escape");
  if (await navVisible()) problems.push("mobile nav did not close with Escape");
  if (!(await page.evaluate(() => document.activeElement.classList.contains("nav-toggle")))) problems.push("focus not returned to toggle after Escape");
  // 3. Language switch keeps the same page
  await page.goto(BASE + "projects/pulse-finance/", { waitUntil: "networkidle" });
  await page.click(".nav-toggle");
  await page.click(".lang-switch");
  await page.waitForLoadState("networkidle");
  if (!page.url().endsWith("/pt/projects/pulse-finance/")) problems.push(`language switch went to ${page.url()}`);
  const htmlLang = await page.getAttribute("html", "lang");
  if (htmlLang !== "pt-BR") problems.push(`html lang after switch is ${htmlLang}`);
  // 4. Without JavaScript the navigation stays usable
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const nojs = await ctx.newPage();
  await nojs.goto(BASE, { waitUntil: "load" });
  if (!(await nojs.isVisible("#site-nav .nav-list"))) problems.push("navigation hidden when JavaScript is disabled");
  await browser.close();

  if (problems.length) {
    console.error(`✗ ${problems.length} problem(s):\n` + problems.map((p) => "  - " + p).join("\n"));
    process.exit(1);
  }
  console.log(`✓ ${checks} page renders (${PAGES.length} pages × ${WIDTHS.length} widths): no overflow, no errors, targets OK; skip link, mobile menu, language switch and no-JS navigation OK.`);
})();
