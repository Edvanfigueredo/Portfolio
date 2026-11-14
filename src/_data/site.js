// Single place for deployment-dependent values. When a custom domain is adopted,
// change `url` and `pathPrefix` only (and add a CNAME file to src/static/).
const site = {
  url: "https://edvanfigueredo.github.io/Portfolio/",
  pathPrefix: "/Portfolio/",
  name: "Edvan Figuerêdo Araujo",
  alternateName: "Edvan Figueredo",
  // Public contact address kept by the owner's explicit decision.
  email: "edvanfaraujo@outlook.com",
  linkedin: "https://www.linkedin.com/in/edvan-figuer%C3%AAdo-araujo-7b8332272",
  github: "https://github.com/Edvanfigueredo",
  languages: ["en", "pt"],
  // Page keys shared by both languages: the language switch maps key -> path.
  pages: {
    home: { path: "/" },
    about: { path: "/about/" },
    expertise: { path: "/expertise/" },
    projects: { path: "/projects/" },
    pulse: { path: "/projects/pulse-finance/" },
    fma: { path: "/projects/financial-market-analysis/" },
    capstone: { path: "/projects/health-bmi-capstone/" },
    guibbor: { path: "/projects/guibbor-bjj/" },
    journey: { path: "/journey/" },
    credentials: { path: "/credentials/" },
    contact: { path: "/contact/" },
  },
  nav: ["home", "about", "expertise", "projects", "journey", "credentials", "contact"],
};

export default site;
