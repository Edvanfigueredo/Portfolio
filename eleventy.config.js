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

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    pathPrefix: site.pathPrefix,
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
