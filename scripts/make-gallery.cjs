// Visual review gallery from the REAL build: full-page screenshots of every page,
// EN + PT, light + dark, desktop (1440 px) + mobile (390 px), plus an index.html with filters.
// Usage:  npm run build && node scripts/make-gallery.cjs [chromium|firefox|webkit]
// Output: review/gallery/ (git-ignored). Requires Playwright with the chosen browser.
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const playwright = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const SITE = path.join(ROOT, "_site");
const OUT = path.join(ROOT, "review", "gallery");
const PREFIX = "/Portfolio/";
const BROWSER = process.argv[2] || "chromium";
const PAGES = [
  ["home", "Home / Início", ""], ["about", "About / Sobre", "about/"], ["expertise", "Expertise / Atuação", "expertise/"],
  ["projects", "Projects / Projetos", "projects/"], ["pulse", "Pulse Finance (case study)", "projects/pulse-finance/"],
  ["fma", "Financial Market Analysis (case study)", "projects/financial-market-analysis/"],
  ["journey", "Journey / Trajetória", "journey/"], ["credentials", "Credentials / Credenciais", "credentials/"], ["contact", "Contact / Contato", "contact/"],
];
const DEVICES = [["desktop", { width: 1440, height: 900 }, 1], ["mobile", { width: 390, height: 844 }, 2]];
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".woff2": "font/woff2", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".xml": "application/xml", ".txt": "text/plain" };

if (!fs.existsSync(path.join(SITE, "index.html"))) { console.error("Build first: npm run build"); process.exit(1); }

// Minimal static server that serves _site/ under the GitHub Pages path prefix.
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (!p.startsWith(PREFIX)) { res.writeHead(404); return res.end(); }
  p = path.join(SITE, p.slice(PREFIX.length));
  if (!p.startsWith(SITE)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, "index.html");
  if (!fs.existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
});

(async () => {
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const base = `http://127.0.0.1:${server.address().port}${PREFIX}`;
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await playwright[BROWSER].launch();
  const shots = [];
  const problems = [];
  for (const [device, viewport, scale] of DEVICES) {
    for (const scheme of ["light", "dark"]) {
      const context = await browser.newContext({ viewport, deviceScaleFactor: scale, colorScheme: scheme, reducedMotion: "reduce" });
      const page = await context.newPage();
      page.on("pageerror", (e) => problems.push(e.message));
      page.on("response", (r) => r.status() >= 400 && problems.push(`${r.status()} ${r.url()}`));
      for (const lang of ["en", "pt"]) {
        for (const [key, label, rel] of PAGES) {
          const url = base + (lang === "pt" ? "pt/" : "") + rel;
          await page.goto(url, { waitUntil: "networkidle" });
          await page.evaluate(() => document.fonts.ready);
          await page.evaluate(async () => { // trigger lazy images, then return to top
            for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
            window.scrollTo(0, 0);
          });
          await page.waitForLoadState("networkidle");
          const file = `${key}-${lang}-${scheme}-${device}.jpg`;
          await page.screenshot({ path: path.join(OUT, file), fullPage: true, type: "jpeg", quality: 85 });
          shots.push({ file, key, label, lang, scheme, device, url: url.replace(base, PREFIX) });
          process.stdout.write(".");
        }
      }
      await context.close();
    }
  }
  await browser.close();
  server.close();

  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  const generated = new Date().toISOString().replace("T", " ").slice(0, 16) + " UTC";
  const cards = shots.map((s) => `
    <figure class="shot" data-lang="${s.lang}" data-scheme="${s.scheme}" data-device="${s.device}" data-page="${s.key}">
      <a href="${s.file}" target="_blank" rel="noopener"><img src="${s.file}" alt="${esc(s.label)} — ${s.lang.toUpperCase()}, ${s.scheme} theme, ${s.device}" loading="lazy"></a>
      <figcaption><strong>${esc(s.label)}</strong><span>${s.lang.toUpperCase()} · ${s.scheme === "light" ? "Light" : "Dark"} · ${s.device === "desktop" ? "Desktop 1440 px" : "Mobile 390 px"}</span><code>${esc(s.url)}</code></figcaption>
    </figure>`).join("");
  const select = (name, label, opts) => `<label>${label}<select data-filter="${name}"><option value="">All</option>${opts.map(([v, t]) => `<option value="${v}">${t}</option>`).join("")}</select></label>`;
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Portfolio review gallery</title>
<style>
  :root { --bg:#f4f4f1; --ink:#14213d; --muted:#566074; --card:#fff; --line:#dcdfe3; --accent:#0b5563; }
  @media (prefers-color-scheme: dark) { :root { --bg:#0f1726; --ink:#e8ecf2; --muted:#a3adbd; --card:#152034; --line:#27344b; --accent:#6cc3cf; } }
  * { box-sizing: border-box; } body { margin:0; font:15px/1.5 system-ui, sans-serif; background:var(--bg); color:var(--ink); }
  header { position:sticky; top:0; z-index:2; background:var(--bg); border-bottom:1px solid var(--line); padding:12px 16px; display:flex; flex-wrap:wrap; gap:12px 20px; align-items:center; }
  h1 { font-size:18px; margin:0 12px 0 0; } .meta { color:var(--muted); font-size:13px; width:100%; margin:0; }
  label { display:flex; gap:6px; align-items:center; font-size:14px; } select { font:inherit; padding:4px 6px; }
  main { padding:16px; display:grid; gap:16px; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr)); }
  .shot { margin:0; background:var(--card); border:1px solid var(--line); border-radius:6px; overflow:hidden; display:flex; flex-direction:column; }
  .shot[data-device="desktop"] { grid-column: span 2; } @media (max-width: 600px) { .shot[data-device="desktop"] { grid-column: auto; } }
  .shot a { display:block; max-height:520px; overflow:hidden; border-bottom:1px solid var(--line); } .shot img { width:100%; display:block; }
  figcaption { padding:8px 10px; display:grid; gap:2px; font-size:13px; } figcaption span { color:var(--muted); } code { font-size:12px; color:var(--accent); }
  .shot[hidden] { display:none; }
</style></head>
<body>
<header>
  <h1>Portfolio — review gallery</h1>
  ${select("lang", "Language", [["en", "English"], ["pt", "Português"]])}
  ${select("scheme", "Theme", [["light", "Light"], ["dark", "Dark"]])}
  ${select("device", "Device", [["desktop", "Desktop"], ["mobile", "Mobile"]])}
  ${select("page", "Page", PAGES.map(([k, l]) => [k, l]))}
  <p class="meta">${shots.length} full-page screenshots of the real build (branch update-portfolio), captured with ${BROWSER} on ${generated}. Click a thumbnail to open it at full size.</p>
</header>
<main>${cards}</main>
<script>
  const filters = [...document.querySelectorAll("[data-filter]")];
  const apply = () => document.querySelectorAll(".shot").forEach((el) => { el.hidden = filters.some((f) => f.value && el.dataset[f.dataset.filter] !== f.value); });
  filters.forEach((f) => f.addEventListener("change", apply));
</script>
</body></html>`;
  fs.writeFileSync(path.join(OUT, "index.html"), html);
  console.log(`\n${shots.length} screenshots + index.html written to ${path.relative(ROOT, OUT)}/`);
  if (problems.length) { console.error("Problems while capturing:\n  " + [...new Set(problems)].join("\n  ")); process.exitCode = 1; }
})();
