# SEO and discoverability strategy

## Audience and intent
The site is read by recruiters, hiring managers and consulting professionals in the US, UK, Ireland, Germany, the Netherlands and Brazil, who typically search:
- the **name** (after seeing a CV or a LinkedIn profile): this must always rank first;
- **role and skill combinations**: the themes below.

Priority: be the clear, correct result for name searches, and be relevant (not keyword-stuffed) for role themes.

## Theme → page mapping
| Search theme | Primary page | Supporting pages |
|---|---|---|
| Edvan Figuerêdo / Edvan Figueredo (+ EY, AI, data) | Home | About, Journey |
| Technology consulting, AI & data, financial services | Home | Expertise, Journey |
| Software engineering, Java, Spring Boot, Python backend | Expertise | Pulse Finance, Journey |
| Generative AI, AI agents, RAG | Expertise | Credentials |
| Financial services technology, personal finance software | Pulse Finance | Financial Market Analysis |
| Cloud and data, Azure (AZ-900, DP-900, PL-900) | Credentials | Expertise |

Each theme appears where it is **true and evidenced**, in natural sentences. No hidden text, keyword lists or repeated phrases.

## On-page rules
- Exactly one `<h1>` per page and a logical heading order.
- Unique `<title>` (≤ 60 characters) and meta description (≤ 155 characters) per page and language. Drafts are below.
- Descriptive link text ("Read the Pulse Finance case study", never "click here").
- Image alt text describes content and purpose. Decorative images use an empty `alt`.
- Case studies use the project name in the title, the `<h1>`, the slug and the first paragraph.

## Titles and descriptions (EN / PT)
| Page | EN title — description | PT title — description |
|---|---|---|
| Home | Edvan Figuerêdo — Technology Consulting, AI & Data — Consultant in technology consulting for financial services (AI & Data), with a software engineering foundation and more than ten years in healthcare operations. | Edvan Figuerêdo — Consultoria em Tecnologia, IA & Dados — Consultor em consultoria de tecnologia para serviços financeiros (AI & Data), com base em engenharia de software e mais de dez anos em operações de saúde. |
| About | About Edvan Figuerêdo — From hospitals and oncology pharmacy to technology consulting at EY: the path, principles and direction behind my work. | Sobre Edvan Figuerêdo — De hospitais e farmácia oncológica à consultoria em tecnologia na EY: a trajetória, os princípios e a direção do meu trabalho. |
| Expertise | Expertise — AI, Data & Software Engineering — Consulting, data, backend, frontend, cloud and AI, each labeled by evidence: professional practice, project or in development. | Atuação — IA, Dados e Engenharia de Software — Consultoria, dados, backend, frontend, cloud e IA, cada área com o nível de evidência: prática profissional, projeto ou em desenvolvimento. |
| Projects | Projects & Case Studies — Edvan Figuerêdo — Case studies with architecture, technical decisions, test evidence and an honest status for each project. | Projetos e Estudos de Caso — Edvan Figuerêdo — Estudos de caso com arquitetura, decisões técnicas, evidências de teste e status real de cada projeto. |
| Pulse Finance | Pulse Finance — Local-First Personal Finance App (MVP) — Individually built: statement import, duplicate flags, debts and forecasts, 42 automated tests, known issues listed openly. | Pulse Finance — Finanças Pessoais Local-First (MVP) — Projeto individual: importação de extratos, sinalização de duplicidades, dívidas e projeções, 42 testes, problemas conhecidos declarados. |
| Journey | Professional Journey — Edvan Figuerêdo — From healthcare operations (since 2013) and pharmaceutical retail to technology consulting at EY. | Trajetória Profissional — Edvan Figuerêdo — Das operações em saúde (desde 2013) e do varejo farmacêutico à consultoria em tecnologia na EY. |
| Credentials | Certifications & Credentials — Edvan Figuerêdo — Microsoft Azure, Azure Data and Power Platform certifications, and university courses in AI, MLOps and digital strategy. | Certificações e Credenciais — Edvan Figuerêdo — Certificações Microsoft Azure, Azure Data e Power Platform, e cursos universitários em IA, MLOps e estratégia digital. |
| Contact | Contact — Edvan Figuerêdo — Get in touch about technology consulting, AI and data roles. Email, LinkedIn, GitHub and CV. | Contato — Edvan Figuerêdo — Fale comigo sobre oportunidades em consultoria de tecnologia, IA e dados. E-mail, LinkedIn, GitHub e currículo. |

## Technical SEO
- **Canonical:** absolute, self-referencing, built from `site.url`.
- **hreflang:** each page lists `en`, `pt-BR` and `x-default` (→ EN), generated from `translationKey`, reciprocal and self-referencing. Plain `en` (not `en-US`) is used deliberately, to serve the US and Europe with one version.
- **`<html lang>`:** `en` or `pt-BR` per page.
- **Sitemap:** `sitemap.xml` with `xhtml:link` alternates for both languages, unpublished pages excluded. Submitted to Google Search Console and Bing Webmaster Tools.
- **robots.txt:** only effective at a domain root. On the `github.io/Portfolio/` sub-path it is ignored, so we rely on the sitemap submission. With a custom domain, `robots.txt` references the sitemap.
- **Structured data (JSON-LD):**
  - `Person` (name, alternateName, jobTitle "Consultant" [C2: exact public wording], worksFor: "EY", alumniOf, knowsAbout, hasCredential, sameAs: LinkedIn and GitHub). No internal grade ("staff"), address, phone or birth date.
  - `WebSite` with `inLanguage`; `BreadcrumbList` on case studies.
  - `SoftwareSourceCode` on case studies with a public repository (`codeRepository`, `programmingLanguage`).
  - `Article` for future Insights.
- **Social previews:** Open Graph and Twitter cards per page. 1200×630 preview images per page and per language: static, generated once, no text smaller than 40 px.
- **Performance as SEO:** static HTML, self-hosted subset fonts, responsive AVIF/WebP images with explicit dimensions, minimal JS. Target: Lighthouse ≥ 90 in all categories on mobile.
- **404 page:** bilingual, with links back to Home and Projects.

## Off-page alignment
- LinkedIn and GitHub profiles link to the site, and the site links back (`sameAs`).
- GitHub profile README rewritten bilingually [C32], with pinned repositories matching the site's case studies.
- Consistent name spelling everywhere [C1].
