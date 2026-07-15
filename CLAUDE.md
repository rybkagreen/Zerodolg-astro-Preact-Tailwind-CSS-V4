# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

ZeroDolg is a corporate website (zerodolg.ru) for a Russian legal company
specializing in personal bankruptcy services. It's an **Astro v5 site rendered
through the `@astrojs/node` adapter** (most pages prerendered, the form/health
routes on-demand) with Preact islands for interactivity, organized loosely
around Feature-Sliced Design (FSD). Claude Code is the sole executor for this
project (git, builds, deploys) — a prior multi-tool setup (Qwen Code, Warp, a
generic multi-agent config) was removed; see "Legacy docs" below.

**Before you plan anything, know these three facts** (established 16.07.2026 by
reconnaissance of the live server; full detail in `docs/PROJECT_KNOWLEDGE.md`):

1. **Production is frozen at 08.11.2025 and was not built from this
   repository.** It runs a newer SSR build whose source no longer exists — the
   dev tree was lost with the owner's laptop. The repo is _behind_ production,
   not ahead of it. Work in this repo has therefore been about absorbing what
   prod already does, not shipping new things over it.
2. **There is no deploy pipeline.** None. The chain that used to publish the
   site lived on that same lost laptop; only its local half survives in
   `scripts/deploy/`. You cannot ship anything today (BL-063).
3. **Leads are not reaching the CRM.** The Bitrix24 webhook returns 401, and a
   failed submission is not stored anywhere — no queue, no file, no retry. Every
   enquiry is currently lost. Treat anything on the lead path accordingly.

## Commands

### Development

- `npm run dev` — start dev server on port 4321
- `npm run build` — validate env vars, `astro build`, then fix output URLs
  (postbuild)
- `npm run build:prod` — clean + type-check, then build with
  `astro.config.prod.mjs`
- `npm run build:production` — full production build via
  `scripts/build/build-production.js`
- `npm run preview` — preview the built `dist/`
- `npm run clean` — remove `dist/` and `.astro/`

### Code Quality

- `npm run lint` / `npm run lint:fix` — ESLint (flat config, `eslint.config.js`)
- `npm run type-check` — `tsc --noEmit`
- `npm run format` / `npm run format:check` — Prettier (incl. `.astro` files)

Run `type-check`, `lint`, and `build` to verify a change — that's the closest
thing this repo has to a test suite (see below).

### There is no automated test suite

Despite what `README.md` claims, **`package.json` defines no `test` script and
Vitest is not a dependency** (README's «Vitest 3.2.4» row is fabricated — README
lists five `npm run test*` scripts, none of which exist). Puppeteer is installed
only for the manual MCP tooling (`npm run mcp:server`, `npm run mcp:demo`,
`tools/mcp-puppeteer-server.js`), not for an e2e test runner. If you add tests,
you'll need to set up the runner from scratch (add the dependency, write the
config, add the script) — don't assume one exists. Cost estimate and the traps
are in `docs/IMPLEMENTATION_PLAN.md` (BL-032).

### There is no CI, and that is deliberate

**GitHub Actions are unusable on this project — they don't work in Russia**
(billing/access). The real CI has always been the **local gate**, invoked by the
deploy script. `.github/workflows/ci.yml` was deleted on 16.07.2026: it was a
dead artifact that triggered on `main`/`develop` while the default branch is
`master`, ran a `npm run test` script that doesn't exist, and pinned actions to
mutable tags. Do not re-add a workflow, and don't treat a green GitHub check as
meaningful — there are none. The gate is:

```
npm run type-check && npm run lint && npm run build && npm run build:prod
```

(`npm run test` is **not** part of it — see above.)

### Environment / Deploy / Maintenance

- `npm run env:validate` / `npm run env:setup` — env var validation/setup
  (`scripts/dev/`)
- `npm run deploy`, `deploy:checklist`, `deploy:verify`, `deploy:backup`,
  `deploy:rollback` — deployment scripts (`scripts/deploy/`)
- `npm run maintenance:audit`, `maintenance:optimize-images`,
  `maintenance:lighthouse` — (`scripts/maintenance/`)
- `npm run staging:up/down/restart/logs/clean` — Docker Compose staging via
  PowerShell scripts; **Windows-only**, not runnable from this WSL/Linux shell
- `npm run tools:semgrep`, `tools:trufflehog` — SAST / secret scanning
  (`tools/`)

## Architecture

### Actual `src/` structure (verified against the tree, not the FSD diagrams

in `README.md`/`docs/architecture.md`, which are aspirational and drifted)

```
src/
├── app/                 # Shell: Layout.astro + global styles (main.css, tailwind.css, globals.css, animations.css, backgrounds.css)
├── components/          # Static Astro components: forms/, blog/, sections/
├── content/             # Astro content collections (schema in content/config.ts): blog/ (md), reviews/ (json), team/ (json)
├── core/                # Small: constants/ and team-members.ts only — not a general "core logic" layer
├── entities/            # Domain entities: team/, review/, own config.ts (content-collection-adjacent, overlaps with content/)
├── features/            # Business features: analytics/, calculator/, forms/, modals/
├── islands/             # Interactive Preact components ONLY: forms/, layout/, interactive/, shared/, sections/, utils/, features/calculator/
├── pages/               # Astro routes, incl. pages/api/ and pages/blog/
├── shared/              # ui/ (Button, Card, SEO, Breadcrumb, OptimizedImage), lib/, utils/, hooks/, config/, data/, seo/, analytics/, types/
├── styles/              # design-tokens.ts + CSS (theme.css, critical.css, components.css, sections.css, interactive-components.css) — separate from src/app/*.css
├── types/               # global.d.ts
├── widgets/             # header/, footer/, faq/, reviews/
└── middleware.ts        # security headers + caching (see below)
```

Notable gaps vs. what other docs claim: there is no top-level `src/layouts/`
(layouts live in `src/app/layouts/`), and `core/` is not a general
application-logic layer. `src/content/` and `src/entities/` overlap in purpose
(content collections vs. entity models) — check both before adding new content
types.

### TypeScript / Vite path aliases

Verified against `tsconfig.json` and the `vite.resolve.alias` block in
`astro.config.mjs` (these two must be kept in sync manually):

- `@/*` → `src/*`
- `@app/*` → `src/app/*`
- `@entities/*` → `src/entities/*`
- `@features/*` → `src/features/*`
- `@widgets/*` → `src/widgets/*`
- `@shared/*` → `src/shared/*` (tsconfig also declares narrower `@shared/ui/*`,
  `@shared/lib/*`, `@shared/config/*`, `@shared/types/*`, `@shared/hooks/*`,
  `@shared/api/*` — `@shared/api` has no matching directory yet)
- `@pages/*` → `src/pages/*`

There is **no** `@core/*`, `@styles/*`, `@types/*`, or `@utils/*` alias — those
appear in older docs but aren't wired up anywhere. Use `@/core/...`,
`@/styles/...`, `@/types/...`, `@shared/utils/...` instead.

### Key architectural principles

- **Islands Architecture**: only `src/islands/**` contains hydrated Preact
  components; everything under `components/`, `widgets/`, `pages/` is static
  Astro output unless it explicitly imports an island.
- **Not a static site — SSR with a Node adapter.** `astro.config.mjs` (and
  `astro.config.prod.mjs`) set `output: 'static'` **plus**
  `adapter: node({ mode: 'standalone' })`, and individual routes opt out of
  prerendering with `export const prerender = false` — currently
  `src/pages/api/form.ts:7` and `src/pages/health.ts:3`. So most pages are
  prerendered, but **the build emits `dist/server/entry.mjs` and needs a running
  Node process**; it is not deployable as flat files. Production runs exactly
  this under PM2. An older claim that this repo is `output: 'static'` with "no
  SSR" was wrong — don't restore it, and don't drop `@astrojs/node` from
  `package.json`/`package-lock.json` (doing so silently turns the build static
  again, and it only surfaces at deploy).
- **Progressive enhancement / mobile-first / WCAG 2.2** are stated goals —
  verify manually, there's no automated a11y or visual-regression check.
  Mobile-first is real, not aspirational: 621 responsive prefixes across 39 of
  85 `.astro`/`.tsx` files (`privacy`/`terms` are the exception, with none).

### Security headers & caching — read this before touching CSP

`src/middleware.ts` sets Content-Security-Policy, X-Frame-Options,
X-Content-Type-Options, Referrer-Policy, Permissions-Policy and Cache-Control,
with a dev-only branch adding `unsafe-eval` under `import.meta.env.DEV`.

**But it does not set them "on every response", and in production it governs no
HTML at all.** This is counter-intuitive and was documented wrongly before:

- Under `output: 'static'`, middleware runs for prerendered routes **at build
  time**. Only the HTML body is written to disk, so the `Response` headers it
  produced are discarded and no browser ever sees them.
- Only two routes are on-demand (`prerender = false`): `src/pages/api/form.ts`
  and `src/pages/health.ts`. Neither returns HTML, and CSP is inert on a JSON
  endpoint. So **the middleware's CSP currently protects nothing in prod**.
- The CSP that actually reaches browsers is nginx's, in
  `infra/nginx/zerodolg.ru.conf` (a versioned copy of the live config). It is a
  **different, materially weaker policy** — most notably it ships
  `'unsafe-eval'` unconditionally in production, which the middleware
  deliberately gates behind dev-only. Details and the full comparison are in
  `ARCHITECTURE.md §7`.

**Practical rule:** adding a third-party script domain means editing **both**
allowlists — `src/middleware.ts` _and_ `infra/nginx/zerodolg.ru.conf` — and the
nginx one is the one that takes effect on the live site. Reconciling the two is
BL-069; don't quietly paper over it in a feature commit.

### MCP integration

`astro-mcp` is registered as an Astro integration in `astro.config.mjs`.
Standalone MCP/Puppeteer tooling lives in `tools/mcp-puppeteer-server.js` and
`tools/demo-mcp-puppeteer.js`, run via `npm run mcp:server` /
`npm run mcp:demo`.

## Styling: Tailwind CSS is v3, not v4

**`package.json` pins `tailwindcss: ^3.4.17`**, and both `tailwind.config.js`
and `postcss.config.cjs` are explicitly headed "Tailwind CSS v3" — this is a
classic `tailwind.config.js` + PostCSS setup (`postcss-import`,
`postcss-nesting`, `postcss-preset-env`, `autoprefixer`, `cssnano` in prod), not
v4's CSS-first `@theme`/Vite-plugin config. Write v3 config/utility syntax here,
not v4 syntax.

Only the **repository name** says "V4" (`Zerodolg-astro-Preact-Tailwind-CSS-V4`)
— that's a naming fossil, not a version claim. An earlier version of this file
said README described "Tailwind CSS v4"; that was itself wrong — README
correctly states 3.4.17 throughout. Verified 16.07.2026.

### The token system is broken, not just "OKLCH"

`src/styles/theme.css` defines 36 OKLCH `--color-*` variables and is **imported
by nothing** — `globals.css` doesn't list it. Consumers without a fallback
silently lose the property; consumers with one render the fallback. Marketing
coverage by design tokens is ~3.6% (≈67 token uses against ≈1795 default
Tailwind palette occurrences), and 26 references point at Tailwind tokens that
don't exist, so those classes never generate. Treat "just change the token" as
false: see BL-019/BL-020/BL-021 and the P3.0 stage in
`docs/IMPLEMENTATION_PLAN.md`. (Counts are ±10% — a recount gave 559/1935; they
are estimates, not measurements.)

## Code Conventions

### TypeScript

- Strict mode plus extra checks: `noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature`,
  `noUnusedLocals`/`noUnusedParameters`. Expect `tsc --noEmit` to be strict
  about unused/optional/index-access code.
- JSX is Preact (`jsxImportSource: 'preact'`).

### ESLint / console usage

- Flat config (`eslint.config.js`). `no-console` is `warn` in `src/**` and `off`
  in scripts/config/tooling files.
- A specific, small allowlist of files are expected to use `console` (loggers,
  analytics, error boundaries) — see `.eslintrc-console-exceptions.md` for the
  current list. New `console` calls in app code should generally go through
  `src/shared/lib/logger.ts` instead, or carry an explained `eslint-disable`
  comment matching that file's convention.

### Commits

Enforced by a Husky `commit-msg` hook (`.husky/commit-msg`), not a JS commitlint
package — it regex-matches `type(scope): description` with `type` ∈
`feat|fix|docs|style|refactor|test|chore|perf|ci|build`. Commits not matching
this are rejected locally.

### Formatting

Prettier (`.prettierrc`): single quotes, semicolons, 100 print width,
`prettier-plugin-astro`. `*.md` files default to `proseWrap: always` at 80 cols,
**except** files matching `SEO_*.md`, `*REPORT*.md`, `*README*.md`, which
preserve prose wrap as-is.

## Environment Variables

See `.env.example` for the current full list (Bitrix24 webhook, GA/Yandex
Metrika IDs, site URL/phone/email, CMS placeholders, reCAPTCHA, maps).
`npm run build` runs `scripts/dev/validate-env.js` first and will fail the build
if required vars are missing/malformed — run `npm run env:validate` standalone
to debug that before chasing build errors.

## Documentation drift warning

The repo root has 50+ historical `*_REPORT.md`, `*_SUMMARY.md`, `*_COMPLETE*.md`
files (SEO audits, fix reports, migration logs, staging guides) — these are
archived in `docs.archive/` (see "Legacy docs" below), not deleted, but they
were point-in-time work logs, not living specs, and several of their claims
(Tailwind version, path aliases, test commands, FSD folder diagram) were already
inaccurate before archiving. Prefer verifying against actual config/source over
trusting historical documents' current-state claims — that includes this repo's
own methodology docs (`docs/PROJECT_KNOWLEDGE.md`,
`docs/IMPLEMENTATION_PLAN.md`, etc.), which have needed similar corrections in
the past (see their "проверено" notes).

## Legacy docs

Historical documentation (old `docs/` tree, superseded reports/guides) lives in
`docs.archive/` — it is **gitignored and not tracked** in this repository, kept
only as a local reference copy. It is not maintained; don't treat it as current.
Actual current documentation is: this file, `ARCHITECTURE.md`, `CONTRIBUTING.md`
(repo root), and `docs/` (`PROJECT_KNOWLEDGE.md`, `CLAUDE_CODE_INSTRUCTIONS.md`,
`IMPLEMENTATION_PLAN.md`, `DOCUMENTS_REGISTRY.md`).

`AGENT.md`, `QWEN.md`, `WARP.md`, and `.qwen/` (Qwen Code config, a Warp Agent
Mode rules file, and a generic multi-agent setup) were **deleted outright**, not
archived — Claude Code is now the sole executor for this project, so there was
nothing in them worth keeping as reference. See `docs/IMPLEMENTATION_PLAN.md`'s
decision log (D5) for context.

## Working conventions

Adapted from the owner's cross-project executor methodology (see
`docs/CLAUDE_CODE_INSTRUCTIONS.md`, `docs/PROJECT_KNOWLEDGE.md` for the full
version). The parts that materially change day-to-day behavior in this repo:

- **4 hard constraints:** do it right the first time (no do-overs); keep FSD
  boundaries and SOLID/SoC clean, no patches on patches; never hardcode
  text/prices/keys — content/config/env only, and this repo is **public** so
  secrets are env-only, never committed; prefer doing the visibly-better thing
  over quick-and-dirty, and log deferred work instead of skipping it silently.
- **Git:** `master` is production and default. Feature work goes through a PR.
  Never `--no-verify`, force-push, rebase, or squash on a pushed branch —
  history is preserved. `.env*` (except `.env.example`), `tmp/`,
  `docs.archive/`, `docs/_planner/`, and agent memory never reach `master`.
- **PROTECTED paths** — changes here need their own commit, a diff called out
  explicitly in the change summary, and (once a real test runner exists)
  coverage. **Rebuilt 16.07.2026 against the actual import graph (BL-024)** —
  the previous list guarded a dead file and left the live lead path unguarded,
  so any earlier estimate of "work inside the protected perimeter" was drawn on
  a wrong map.

  **Live lead path** (a bug here loses a real client's enquiry — a lead is worth
  tens of thousands of roubles to this firm, and there is currently _no_
  fallback store, so a failure means the data is simply gone):
  - `src/pages/api/form.ts` — the SSR endpoint every form posts to
  - `src/features/forms/lib/recaptcha.ts`, `.../recaptcha-client.ts` — server
    verification + client token capture
  - `src/islands/forms/FormEnhancedFinal.tsx` — the base all 14 form instances
    render through
  - `src/components/forms/**` — the form components themselves
  - `src/shared/ui/BitrixCallback.astro` — currently leaks the webhook into
    client HTML via `define:vars` (BL-054); do not touch casually
  - any `bitrix-*` lib code

  **Security / headers:**
  - `src/middleware.ts` — CSP and security headers
  - `infra/nginx/zerodolg.ru.conf` — the CSP that actually reaches browsers

  **Live analytics:**
  - `src/shared/lib/analytics-manager.ts` — the real GA4/Metrika manager
  - `src/app/layouts/Layout.astro` — inline counter snippets (~`:158`, `:195`)

  **Deliberately NOT protected:** `src/features/analytics/` (409 lines, **zero
  importers** — verified dead; it was the only analytics path the old list
  named). Don't re-add it to this list; delete it instead (BL-022/BL-024).

- **Reporting convention:** end-of-task summaries state what changed, which
  files, and pass/fail for `type-check`/`lint`/`build` (there is no `test`
  script — see above); call out surprises (spec assumptions that turned out
  false) explicitly rather than silently working around them.
