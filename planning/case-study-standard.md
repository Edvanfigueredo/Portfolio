# Case study standard

## Structure (flagship case studies)
1. Executive Summary
2. Business Context
3. Problem or Opportunity
4. My Role and Contributions
5. Solution Overview
6. Architecture (accessible SVG diagram + explanation)
7. Technology Stack
8. Key Technical Decisions (decision · alternative considered · reason)
9. Engineering Challenges
10. Security and Reliability Considerations
11. Results and Evidence
12. Current Project Status
13. Lessons Learned
14. Future Improvements

**Mini case studies** (supporting projects) use: Summary · What it does · Stack · Honest scope · What's next.

## Evidence rules
- Every technical statement must be traceable to code, tests, configuration, a deployment or a document.
- Results contain **only** measured facts: test counts, executed builds, CI configuration, measured performance. No invented KPIs, savings, user counts or business outcomes. If nothing was measured, say so.
- Status labels: **In Production · Completed · MVP · In Testing · In Development · Academic Project · Research**. "In Production" requires real users or a live business process.
- Planned features appear only under *Future Improvements*, never in *Solution Overview*.
- Screenshots: real captures from a desktop browser, at 2× density, with no personal or client data visible, and alt text written.
- AI assistance in development is described honestly in *My Role and Contributions*.
- Academic and health-related projects carry an explicit "educational, not clinically validated" note.

## Evidence required before OrkestrIA and CloudCost Navigator can be published
| Needed | OrkestrIA | CloudCost Navigator |
|---|---|---|
| Repository access (public, or private with authorization) | ✔ | ✔ |
| Which components are implemented vs planned (code-level) | Conductor and each specialist agent; agent communication; RAG; MCP | Each cloud provider integration (real API vs sample data); cost features |
| Tests and how to run them | ✔ | ✔ |
| Deployment evidence, and whether it can be linked safely | — | VPS URL, HTTPS, no default credentials, no exposed admin |
| Model and API usage, with no keys or endpoints exposed | Azure OpenAI configuration approach | — |
| Your role, dates, collaborators | ✔ | ✔ |
| Screenshots or recordings | ✔ | ✔ |
