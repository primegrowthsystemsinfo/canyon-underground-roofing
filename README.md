# Canyon Underground — website

One-page marketing site for Canyon Underground (Las Vegas, NV). Static site; the quote form posts from the browser to FormSubmit, which emails the owner address set in `src/site.config.ts` (`ownerEmail`).

- Build: `npm ci --legacy-peer-deps && npx vite build` (output: `dist/client`)
- GitHub Pages deploys automatically from `main` via `.github/workflows/pages.yml`.
- First form submission: FormSubmit emails the owner an "Activate Form" link that must be clicked once.
