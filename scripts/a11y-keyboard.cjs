// Keyboard (Tab and Shift+Tab, focus visibility, focus not obscured) and screen-reader structure.
// Usage: node scripts/a11y-keyboard.cjs [chromium|firefox|webkit] [baseUrl]
const pw = require("playwright");
const BASE = process.argv[3] || "http://localhost:8090/Portfolio/";
const PAGES = ["", "projects/pulse-finance/", "pt/expertise/", "pt/contact/"];
const browserName = process.argv[2] || "chromium";
// macOS-style Safari only tabs to links with Alt+Tab; Playwright WebKit honours the same setting.
const TAB = browserName === "webkit" ? "Alt+Tab" : "Tab";

(async () => {
  const browser = await pw[browserName].launch();
  const problems = [];
  const report = [];
  for (const width of [390, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 800 } });
    for (const path of PAGES) {
      await page.goto(BASE + path, { waitUntil: "networkidle" });
      const expected = await page.$$eval("a[href], button, [tabindex='0']", (els) => els.filter((e) => {
        const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
        return (r.width > 0 && r.height > 0 && cs.visibility !== "hidden") || e.classList.contains("skip-link");
      }).length);
      const seen = [];
      for (let i = 0; i < expected + 3; i++) {
        await page.keyboard.press(TAB);
        const info = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el || el === document.body) return null;
          const cs = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          const header = document.querySelector(".site-header").getBoundingClientRect();
          const inHeader = !!el.closest(".site-header");
          return {
            id: (el.getAttribute("aria-label") || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 28) || el.tagName,
            visibleFocus: (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) >= 2) || cs.boxShadow !== "none",
            // Obscured = the topmost element at the focused element's centre is something else (e.g. the sticky header).
            obscured: (() => { const x = r.left + r.width / 2, y = r.top + Math.min(r.height / 2, 10); if (y < 0 || y > innerHeight) return false; const hit = document.elementFromPoint(x, y); return !!hit && !el.contains(hit) && !hit.contains(el); })(),
            inViewport: r.bottom > 0 && r.top < innerHeight,
            skip: el.classList.contains("skip-link"),
          };
        });
        if (!info) break;
        if (seen.length && info.id === seen[0].id && seen.length > 2) break; // wrapped around
        seen.push(info);
        if (!info.visibleFocus) problems.push(`${width}px ${path || "/"}: no visible focus on "${info.id}"`);
        if (info.obscured) problems.push(`${width}px ${path || "/"}: focus obscured by sticky header on "${info.id}"`);
        if (!info.inViewport && !info.skip) problems.push(`${width}px ${path || "/"}: focused element off-screen "${info.id}"`);
      }
      if (!seen.length || !seen[0].skip) problems.push(`${width}px ${path || "/"}: first focus is not the skip link`);
      // Backward pass: Shift+Tab scrolls items to the TOP of the viewport, where the sticky header sits.
      await page.evaluate(() => { document.activeElement.blur(); window.scrollTo(0, document.body.scrollHeight); });
      await page.keyboard.press(TAB); // land somewhere near the end
      for (let i = 0; i < seen.length + 2; i++) {
        await page.keyboard.press(browserName === "webkit" ? "Alt+Shift+Tab" : "Shift+Tab");
        const back = await page.evaluate(() => {
          const el = document.activeElement; if (!el || el === document.body) return null;
          const r = el.getBoundingClientRect(); const x = r.left + r.width / 2, y = r.top + Math.min(r.height / 2, 10);
          if (y < 0 || y > innerHeight) return { id: el.textContent.trim().slice(0, 28), obscured: false };
          const hit = document.elementFromPoint(x, y);
          return { id: (el.textContent || el.tagName).trim().replace(/\s+/g, " ").slice(0, 28), obscured: !!hit && !el.contains(hit) && !hit.contains(el) };
        });
        if (!back) break;
        if (back.obscured) problems.push(`${width}px ${path || "/"}: (Shift+Tab) focus obscured by sticky header on "${back.id}"`);
      }
      report.push(`${width}px ${path || "/"}: ${seen.length} focus stops`);
    }
    await page.close();
  }

  // Screen-reader view (accessibility tree) of two representative pages
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  for (const path of ["", "projects/pulse-finance/"]) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    const snap = await page.locator("body").ariaSnapshot();
    const landmarks = ["banner", "navigation", "main", "contentinfo"].filter((l) => new RegExp(`^\\s*- ${l}`, "m").test(snap));
    const headings = [...snap.matchAll(/- heading "([^"]+)" \[level=(\d)\]/g)].map((m) => `h${m[2]} ${m[1].slice(0, 32)}`);
    const unnamed = [...snap.matchAll(/- (link|button)(?: "")?:?\s*$/gm)].length;
    report.push(`SR ${path || "/"}: landmarks [${landmarks.join(", ")}]; headings: ${headings.slice(0, 8).join(" | ")}${headings.length > 8 ? " …" : ""}`);
    if (landmarks.length < 4) problems.push(`${path || "/"}: missing landmarks (${landmarks.join(", ")})`);
    if (unnamed) problems.push(`${path || "/"}: ${unnamed} link/button without accessible name`);
    let prev = 0;
    for (const h of headings) { const lvl = +h[1]; if (prev && lvl > prev + 1) problems.push(`${path || "/"}: heading level jumps to ${h}`); prev = lvl; }
  }
  await browser.close();
  console.log(`[${browserName}] ` + report.join("\n[" + browserName + "] "));
  if (problems.length) { console.log(`✗ ${problems.length} problem(s):\n  - ` + [...new Set(problems)].join("\n  - ")); process.exitCode = 1; }
  else console.log(`✓ [${browserName}] keyboard: visible focus everywhere, nothing obscured by the sticky header; screen-reader structure OK`);
})();
