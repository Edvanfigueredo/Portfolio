// Contrast of every text element (light + dark).
// Usage: node scripts/a11y-contrast-all.cjs [chromium|firefox|webkit] [baseUrl]
const pw = require("playwright");
const BASE = process.argv[3] || "http://localhost:8090/Portfolio/";
const PATHS = ["", "about/", "expertise/", "projects/", "projects/pulse-finance/", "projects/financial-market-analysis/", "journey/", "credentials/", "contact/"];
const PAGES = [...PATHS, ...PATHS.map((p) => "pt/" + p), "404.html"];

(async () => {
  const browser = await pw[process.argv[2] || "chromium"].launch();
  const fails = new Map();
  let checked = 0, minRatio = { v: 99 };
  for (const scheme of ["light", "dark"]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, colorScheme: scheme });
    for (const path of PAGES) {
      await page.goto(BASE + path, { waitUntil: "networkidle" });
      const res = await page.evaluate(() => {
        const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const [r, g, b, a = 1] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r, g, b, a }; };
        const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
        const blend = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
        const bgOf = (el) => {
          const layers = [];
          for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c.a > 0) { layers.push(c); if (c.a === 1) break; } }
          let bg = { r: 255, g: 255, b: 255, a: 1 };
          for (const l of layers.reverse()) bg = blend(l, bg);
          return bg;
        };
        const out = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const seen = new Set();
        while (walker.nextNode()) {
          const t = walker.currentNode; const el = t.parentElement;
          if (!t.textContent.trim() || seen.has(el)) continue; seen.add(el);
          const cs = getComputedStyle(el);
          if (cs.visibility === "hidden" || cs.display === "none" || el.closest(".visually-hidden, .skip-link, [aria-hidden=true]")) continue;
          const fg0 = parse(cs.color); if (!fg0) continue;
          const bg = bgOf(el); const fg = blend(fg0, bg);
          const L1 = lum(fg), L2 = lum(bg); const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
          const size = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight) >= 700;
          const large = size >= 24 || (bold && size >= 18.66);
          out.push({ ratio: Math.round(ratio * 100) / 100, need: large ? 3 : 4.5, sel: el.tagName.toLowerCase() + (el.className ? "." + String(el.className).split(" ")[0] : ""), text: t.textContent.trim().slice(0, 30) });
        }
        return out;
      });
      for (const r of res) {
        checked++;
        if (r.ratio < minRatio.v) minRatio = { v: r.ratio, where: `${scheme} ${path || "/"} ${r.sel}` };
        if (r.ratio < r.need) fails.set(`${scheme} ${r.sel} ${r.ratio}:1 (need ${r.need})`, `${path || "/"} "${r.text}"`);
      }
    }
    await page.close();
  }
  await browser.close();
  if (fails.size) { console.log(`✗ ${fails.size} contrast failures:`); for (const [k, v] of fails) console.log("  -", k, "→", v); }
  else console.log(`✓ contrast: ${checked} text elements checked (light + dark), all meet WCAG AA. Lowest ratio ${minRatio.v}:1 at ${minRatio.where}`);
})();
