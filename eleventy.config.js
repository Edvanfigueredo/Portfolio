// Eleventy is used at build time only: the output in _site/ is plain HTML, CSS and a few KB of JS.
import site from "./src/_data/site.js";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "assets/fonts" });
  eleventyConfig.addPassthroughCopy({ "src/assets/img": "assets/img" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });
  eleventyConfig.addPassthroughCopy({ "src/assets/css": "assets/css" });
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });

  // Absolute URL (canonical, hreflang, Open Graph, sitemap) from a site-relative path.
  eleventyConfig.addFilter("absUrl", (path) => new URL(path.replace(/^\//, ""), site.url.replace(/\/?$/, "/")).href);

  // Translate a page key into the URL of the same page in another language.
  eleventyConfig.addFilter("langUrl", (key, lang) => {
    const page = site.pages[key];
    if (!page) throw new Error(`Unknown page key: ${key}`);
    return (lang === "pt" ? "/pt" : "") + page.path;
  });

  eleventyConfig.addFilter("year", () => new Date().getFullYear());

  // Wide tables and code blocks scroll horizontally on small screens. Wrap them in a labelled,
  // focusable region so keyboard users can scroll them too (WCAG 2.1.1, axe scrollable-region-focusable).
  eleventyConfig.addTransform("scroll-regions", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html")) return content;
    const pt = (this.page.url || "").startsWith("/pt/");
    const tableLabel = pt ? "Tabela (role para ver mais)" : "Table (scroll to see more)";
    const codeLabel = pt ? "Diagrama em texto" : "Text diagram";
    return content
      .replace(/<table>/g, `<div class="scroll-region" role="region" aria-label="${tableLabel}" tabindex="0"><table>`)
      .replace(/<\/table>/g, "</table></div>")
      .replace(/<pre>/g, `<pre class="scroll-region" role="region" aria-label="${codeLabel}" tabindex="0">`);
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    pathPrefix: site.pathPrefix,
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
