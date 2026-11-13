// Static QA for the built site (_site/). No dependencies. Exit code 1 on any failure.
// Run: npm run check   (after npm run build)
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import site from "../src/_data/site.js";

const ROOT = "_site";
const PREFIX = site.pathPrefix; // e.g. "/Portfolio/"
const errors = [];
const fail = (file, msg) => errors.push(`${file}: ${msg}`);

const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const files = walk(ROOT);
const htmlFiles = files.filter((f) => f.endsWith(".html"));

// Resolve a site URL (absolute https://…/Portfolio/…, or /Portfolio/…) to a file in _site.
const toFile = (url) => {
  let path = url.split("#")[0].split("?")[0];
  if (path.startsWith(site.url)) path = PREFIX + path.slice(site.url.length);
  if (!path.startsWith(PREFIX)) return null;
  path = path.slice(PREFIX.length);
  const candidates = [path, join(path, "index.html")];
  return candidates.map((c) => join(ROOT, c)).find((c) => existsSync(c) && statSync(c).isFile()) || false;
};

// Forbidden content: unresolved confirmation markers, placeholders and known personal data patterns.
const FORBIDDEN = [
  [/\[C\d+[\]:]/, "unresolved [C#] confirmation marker"],
  [/lorem ipsum/i, "placeholder text"],
  [/\b(TODO|FIXME)\b/, "placeholder marker"],
  [/\(?\b\d{2}\)?\s?9\d{4}[-\s]?\d{4}\b|\b55\d{2}9\d{8}\b|wa\.me\//, "Brazilian mobile phone number"],
  [/\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/, "CPF-formatted number"],
  [/@gmail\.com/i, "personal Gmail address"],
  [/projeto_guibbor_admin/, "removed admin screenshot reference"],
];

for (const file of htmlFiles) {
  const rel = relative(ROOT, file);
  const html = readFileSync(file, "utf8");
  const is404 = rel === "404.html";

  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) fail(rel, `expected exactly one <h1>, found ${h1}`);
  if (!/<html lang="(en|pt-BR)">/.test(html)) fail(rel, "missing or unexpected <html lang>");
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
  if (!title || title.length > 70) fail(rel, `title missing or too long (${title.length})`);
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "";
  if (desc.length < 50 || desc.length > 165) fail(rel, `meta description length ${desc.length} (expected 50–165)`);

  if (!is404) {
    for (const rx of [/rel="canonical" href="([^"]+)"/, /hreflang="en" href="([^"]+)"/, /hreflang="pt-BR" href="([^"]+)"/, /hreflang="x-default" href="([^"]+)"/]) {
      const m = html.match(rx);
      if (!m) fail(rel, `missing ${rx.source.split(" ")[0]}`);
      else if (!toFile(m[1])) fail(rel, `alternate/canonical target does not exist: ${m[1]}`);
    }
    const canon = (html.match(/rel="canonical" href="([^"]+)"/) || [])[1];
    if (canon && toFile(canon) !== file) fail(rel, `canonical does not point to itself: ${canon}`);
    // Reciprocity: the other-language page must point back here.
    const other = (html.match(/<a class="lang-switch" href="([^"]+)"/) || [])[1];
    if (!other) fail(rel, "missing language switch");
    else {
      const otherFile = toFile(other);
      if (!otherFile) fail(rel, `language switch target missing: ${other}`);
      else {
        const back = (readFileSync(otherFile, "utf8").match(/<a class="lang-switch" href="([^"]+)"/) || [])[1];
        if (!back || toFile(back) !== file) fail(rel, "language switch is not reciprocal");
      }
    }
    if (!/property="og:image" content="([^"]+)"/.test(html)) fail(rel, "missing og:image");
    else if (!toFile(html.match(/property="og:image" content="([^"]+)"/)[1])) fail(rel, "og:image file missing");
  }

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { fail(rel, "invalid JSON-LD"); }
  }

  // Internal links and assets
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (url.startsWith(PREFIX) || url.startsWith(site.url)) {
      if (!toFile(url)) fail(rel, `broken internal link: ${url}`);
    } else if (url.startsWith("/") && !url.startsWith("//")) {
      fail(rel, `root-relative link without path prefix: ${url}`);
    }
  }
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const part of m[1].split(",")) {
      const url = part.trim().split(/\s+/)[0];
      if (!toFile(url)) fail(rel, `broken srcset entry: ${url}`);
    }
  }
  // Images: alt + dimensions
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    if (!/\salt="[^"]+"/.test(tag)) fail(rel, `image without descriptive alt: ${tag.slice(0, 80)}`);
    if (!/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag)) fail(rel, `image without width/height: ${tag.slice(0, 80)}`);
  }
  // External links opening a new tab must be isolated
  for (const m of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    if (!/rel="[^"]*noopener[^"]*"/.test(m[0])) fail(rel, `target=_blank without rel=noopener: ${m[0].slice(0, 80)}`);
  }
  for (const [rx, label] of FORBIDDEN) if (rx.test(html)) fail(rel, `forbidden content: ${label}`);
}

// Language parity: every page key exists in both languages.
for (const [key, page] of Object.entries(site.pages)) {
  for (const prefix of ["", "pt"]) {
    const f = join(ROOT, prefix, page.path, "index.html");
    if (!existsSync(f)) fail(f, `missing page for key "${key}"`);
  }
}
for (const required of ["sitemap.xml", "robots.txt", "404.html", "favicon.svg"]) {
  if (!existsSync(join(ROOT, required))) fail(required, "missing");
}

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):\n` + errors.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}
console.log(`✓ ${htmlFiles.length} HTML pages checked: structure, SEO metadata, hreflang reciprocity, links, images, content rules.`);
