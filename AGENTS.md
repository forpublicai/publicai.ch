## Public AI Switzerland — Agent & Developer Context

This document gives agents and developers a fast mental model of the site so you can safely extend it without surprises.

### Purpose & audience

- **What this site is**: A static marketing and membership site for **Public AI Switzerland**, a customer-owned cooperative that distributes Swiss-made AI (especially Apertus) to Swiss residents and companies.

- **Primary goals**:
  - Explain the cooperative model and how it continues the Swiss tradition of cooperatives.
  - Drive **Founding Member** sign‑ups.
  - Point visitors to the **chat UI**, **API platform**, and related open‑source repos.
- **Primary audiences**: Swiss residents, companies, institutions, and developers deciding whether to use or support the cooperative.


### Maintenance
- **When you change the structure, update this file**:
  - New pages, major layout changes, or navigation patterns should be briefly described here.
  - If you replace the presentations system or membership flow, summarise the new flow for future agents.
- **Mirror for other agents**:
 - `claude.md` is a symbolic link to this file so other agents can find the same context at a conventional name.

### Current site structure (Next.js app router)

- **Framework**: Next.js 14 app router (`app/` directory), TypeScript.
- **Layout**: `app/layout.tsx` wraps all pages with `Navbar`, `Footer`, and a small `ChatWidget` link.
- **Home page**: `app/page.tsx` – single‑page marketing flow:
  - Hero with cooperative positioning and Founding Member CTA.
  - Intro section describing Public AI Switzerland.
  - Founding Member CTA with benefits and membership box.
  - Timeline of Swiss cooperatives leading to Public AI Switzerland.
  - Comparison vs ChatGPT/OpenAI.
  - Achievements, product modes (chat + API), distribution CTA, FAQ.
- **Additional routes**:
  - `app/about/page.tsx` – more detailed narrative about the cooperative.
  - `app/presentations/page.tsx` – lists presentations from markdown in `public/presentations` (see `manifest.json` and `.md` files there).
  - `app/privacy/page.tsx` and `app/terms/page.tsx` – legal content.
  - `app/internal/page.tsx` – internal/ops notes (not linked from main nav).

### Membership & presentations flow (current)

- **Membership**: All primary CTAs link out to OpenCollective for **Founding Member** sign‑up (see `OPEN_COLLECTIVE_CHECKOUT_URL` in `components/Navbar.tsx` and CTAs on the home page).
- **Presentations**: The presentations page reads metadata from `public/presentations/manifest.json` and renders markdown files from `public/presentations/*.md`. When adding talks, update the manifest and add the corresponding markdown file.
