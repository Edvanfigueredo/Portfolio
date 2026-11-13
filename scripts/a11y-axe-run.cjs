// WCAG 2.2 AA audit with axe-core (light + dark, 390/1280 px).
// Usage: node scripts/a11y-axe-run.cjs [chromium|firefox|webkit] [baseUrl]
// Requires Playwright and axe-core available locally (e.g. `npm i --no-save axe-core`); not project dependencies.
const pw = require("playwright");
const axeSource = require("fs").readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const BASE = process.argv[3] || "http://localhost:8090/Portfolio/";
const PATHS = ["", "about/", "expertise/", "projects/", "projects/pulse-finance/", "projects/financial-market-analysis/", "projects/health-bmi-capstone/", "projects/guibbor-bjj/", "journey/", "credentials/", "contact/"];
const PAGES = [...PATHS, ...PATHS.map((p) => "pt/" + p), "404.html"];
const browserName = process.argv[2] || "chromium";

(async () => {
  const browser = await pw[browserName].launch();
  const summary = {};
  let total = 0;
  for (const scheme of ["light", "dark"]) {
    for (const width of [390, 1280]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: scheme });
      for (const path of PAGES) {
        await page.goto(BASE + path, { waitUntil: "networkidle" });
        await page.addScriptTag({ content: axeSource });
        const res = await page.evaluate(async () => await window.axe.run(document, {
          runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] },
          resultTypes: ["violations", "incomplete"],
        }));
        for (const v of res.violations) {
          const key = `${v.id} [${v.impact}] ${scheme}`;
          summary[key] = summary[key] || { help: v.help, where: new Set(), nodes: [] };
          summary[key].where.add(`${width}px ${path || "/"}`);
          for (const n of v.nodes.slice(0, 2)) if (summary[key].nodes.length < 4) summary[key].nodes.push(n.target.join(" ") + " :: " + (n.failureSummary || "").split("\n").slice(1, 2).join(""));
          total += v.nodes.length;
        }
        // Colour-contrast items axe could not decide (e.g. over images) are reported for manual review.
        for (const v of res.incomplete.filter((i) => i.id === "color-contrast")) {
          const key = `REVIEW color-contrast ${scheme}`;
          summary[key] = summary[key] || { help: "needs manual review", where: new Set(), nodes: [] };
          summary[key].where.add(`${width}px ${path || "/"}`);
          for (const n of v.nodes.slice(0, 1)) if (summary[key].nodes.length < 4) summary[key].nodes.push(n.target.join(" "));
        }
      }
      await page.close();
    }
  }
  await browser.close();
  const keys = Object.keys(summary);
  if (!keys.length) { console.log(`✓ axe (${browserName}): 0 violations across ${PAGES.length} pages × 2 widths × light/dark`); return; }
  for (const k of keys) {
    const s = summary[k];
    console.log(`- ${k}: ${s.help}\n    pages: ${[...s.where].slice(0, 6).join(", ")}${s.where.size > 6 ? ` (+${s.where.size - 6})` : ""}\n    e.g. ${s.nodes.join("\n         ")}`);
  }
  console.log(`total violating nodes: ${total}`);
})();
