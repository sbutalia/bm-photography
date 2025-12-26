# Repository Guidelines

## Project Structure & Module Organization
- Root HTML pages: `index.html`, `about.html`, `service-fam.html`, `contact.html`, `butaliamoments.html`, and client-specific pages like `beckFamFun2024.html`.
- Static assets live in `assets/` with `css/`, `js/`, `fonts/`, and `images/` subfolders.
- Portfolio image sets are organized by year in `butaliamoments/` (for example, `butaliamoments/2024/z_family/`).
- `modak-template-org/` contains the original template files (reference only).

## Build, Test, and Development Commands
- No build step; edit HTML/CSS/JS directly.
- Run a local server for testing:
  - `python -m http.server 8000`
  - `npx serve`
- Gemini tagging script (optional):
  - Create `butaliamoments/.env` with `GEMINI_API_KEY=...` and `GEMINI_MODEL=...`.
  - Run: `node butaliamoments/geminiTagger/gemini-tag-images.js --plan assets/images/butaliamoments/2025/moments-2025-plan.json`

## Coding Style & Naming Conventions
- HTML/CSS/JS use 2-space indentation and consistent, readable formatting.
- Keep class names aligned with existing template patterns (for example, `dtr-portfolio-item`).
- Use lowercase, hyphenated file names for new pages or assets (for example, `family-portraits.html`).
- Cache-busting query strings (for example, `style.css?v=20250101`) should be incremented when updating CSS/JS.

## Testing Guidelines
- No automated test framework in this repo.
- Validate pages manually in a browser (desktop + mobile).
- If you change navigation or portfolio grids, verify anchors, image loading, and layout breakpoints.

## Commit & Pull Request Guidelines
- Commits in history are short and lowercase (for example, `cleanup`, `fix img`). Follow that pattern.
- PRs should include:
  - A concise summary of page/section changes.
  - Before/after screenshots for visible UI updates.
  - Notes about any cache-busting updates.

## Deployment & Configuration Tips
- Deployed via GitHub Pages with custom domain `photography.butaliamedia.com` (see `CNAME`).
- Keep contact links and Google Forms URLs consistent across pages.
