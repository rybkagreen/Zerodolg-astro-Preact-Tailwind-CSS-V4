# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

ZeroDolg is a corporate website (zerodolg.ru) for a Russian legal company
specializing in personal bankruptcy services. It's an Astro v5 static site
with Preact islands for interactivity, organized loosely around
Feature-Sliced Design (FSD). Claude Code is the sole executor for this
project (git, builds, deploys) — a prior multi-tool setup (Qwen Code, Warp,
a generic multi-agent config) was removed; see "Legacy docs" below.

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

Despite what `README.md` and `.github/workflows/ci.yml` claim,
**`package.json` defines no `test` script, and Vitest/Testing Library are not
dependencies.** The CI workflow's `npm run test` step will fail as configured.
Puppeteer is installed only for the manual MCP tooling
(`npm run mcp:server`, `npm run mcp:demo`, `tools/mcp-puppeteer-server.js`),
not for an e2e test runner. If you add tests, you'll need to set up the
runner from scratch (add the dependency, write the config, add the script) —
don't assume one exists.

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
application-logic layer. `src/content/` and `src/entities/` overlap in
purpose (content collections vs. entity models) — check both before adding
new content types.

### TypeScript / Vite path aliases

Verified against `tsconfig.json` and the `vite.resolve.alias` block in
`astro.config.mjs` (these two must be kept in sync manually):

- `@/*` → `src/*`
- `@app/*` → `src/app/*`
- `@entities/*` → `src/entities/*`
- `@features/*` → `src/features/*`
- `@widgets/*` → `src/widgets/*`
- `@shared/*` → `src/shared/*` (tsconfig also declares narrower
  `@shared/ui/*`, `@shared/lib/*`, `@shared/config/*`, `@shared/types/*`,
  `@shared/hooks/*`, `@shared/api/*` — `@shared/api` has no matching
  directory yet)
- `@pages/*` → `src/pages/*`

There is **no** `@core/*`, `@styles/*`, `@types/*`, or `@utils/*` alias —
those appear in older docs but aren't wired up anywhere. Use `@/core/...`,
`@/styles/...`, `@/types/...`, `@shared/utils/...` instead.

### Key architectural principles

- **Islands Architecture**: only `src/islands/**` contains hydrated Preact
  components; everything under `components/`, `widgets/`, `pages/` is static
  Astro output unless it explicitly imports an island.
- **Static generation**: `output: 'static'` in `astro.config.mjs`; no SSR.
- **Progressive enhancement / mobile-first / WCAG 2.2** are stated goals —
  verify manually, there's no automated a11y or visual-regression check.

### Security headers & caching

`src/middleware.ts` sets Content-Security-Policy, X-Frame-Options,
X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and
Cache-Control on every response. The CSP has a dev-only branch that adds
`unsafe-eval` when `import.meta.env.DEV` — check this file (not just the CSP
meta tags, if any) when adding a new third-party script domain (analytics,
maps, etc.), since the allowlist is hardcoded here.

### MCP integration

`astro-mcp` is registered as an Astro integration in `astro.config.mjs`.
Standalone MCP/Puppeteer tooling lives in `tools/mcp-puppeteer-server.js`
and `tools/demo-mcp-puppeteer.js`, run via `npm run mcp:server` /
`npm run mcp:demo`.

## Styling: Tailwind CSS is v3, not v4

Despite `README.md` and other docs describing "Tailwind CSS v4",
**`package.json` pins `tailwindcss: ^3.4.17`**, and both `tailwind.config.js`
and `postcss.config.cjs` are explicitly headed "Tailwind CSS v3" — this is a
classic `tailwind.config.js` + PostCSS setup (`postcss-import`,
`postcss-nesting`, `postcss-preset-env`, `autoprefixer`, `cssnano` in prod),
not v4's CSS-first `@theme`/Vite-plugin config. Write v3 config/utility
syntax here, not v4 syntax. The design-token color system uses OKLCH.

## Code Conventions

### TypeScript

- Strict mode plus extra checks: `noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature`,
  `noUnusedLocals`/`noUnusedParameters`. Expect `tsc --noEmit` to be strict
  about unused/optional/index-access code.
- JSX is Preact (`jsxImportSource: 'preact'`).

### ESLint / console usage

- Flat config (`eslint.config.js`). `no-console` is `warn` in `src/**` and
  `off` in scripts/config/tooling files.
- A specific, small allowlist of files are expected to use `console`
  (loggers, analytics, error boundaries) — see
  `.eslintrc-console-exceptions.md` for the current list. New `console`
  calls in app code should generally go through `src/shared/lib/logger.ts`
  instead, or carry an explained `eslint-disable` comment matching that
  file's convention.

### Commits

Enforced by a Husky `commit-msg` hook (`.husky/commit-msg`), not a JS
commitlint package — it regex-matches
`type(scope): description` with
`type` ∈ `feat|fix|docs|style|refactor|test|chore|perf|ci|build`. Commits
not matching this are rejected locally.

### Formatting

Prettier (`.prettierrc`): single quotes, semicolons, 100 print width,
`prettier-plugin-astro`. `*.md` files default to `proseWrap: always` at 80
cols, **except** files matching `SEO_*.md`, `*REPORT*.md`, `*README*.md`,
which preserve prose wrap as-is.

## Environment Variables

See `.env.example` for the current full list (Bitrix24 webhook, GA/Yandex
Metrika IDs, site URL/phone/email, CMS placeholders, reCAPTCHA, maps).
`npm run build` runs `scripts/dev/validate-env.js` first and will fail the
build if required vars are missing/malformed — run `npm run env:validate`
standalone to debug that before chasing build errors.

## Documentation drift warning

The repo root has 50+ historical `*_REPORT.md`, `*_SUMMARY.md`,
`*_COMPLETE*.md` files (SEO audits, fix reports, migration logs, staging
guides) — these are archived in `docs.archive/` (see "Legacy docs" below),
not deleted, but they were point-in-time work logs, not living specs, and
several of their claims (Tailwind version, path aliases, test commands, FSD
folder diagram) were already inaccurate before archiving. Prefer verifying
against actual config/source over trusting historical documents'
current-state claims — that includes this repo's own methodology docs
(`docs/PROJECT_KNOWLEDGE.md`, `docs/IMPLEMENTATION_PLAN.md`, etc.), which
have needed similar corrections in the past (see their "проверено" notes).

## Legacy docs

Historical documentation (old `docs/` tree, superseded reports/guides) lives
in `docs.archive/` — it is **gitignored and not tracked** in this repository,
kept only as a local reference copy. It is not maintained; don't treat it as
current. Actual current documentation is: this file, `ARCHITECTURE.md`,
`CONTRIBUTING.md` (repo root), and `docs/` (`PROJECT_KNOWLEDGE.md`,
`CLAUDE_CODE_INSTRUCTIONS.md`, `IMPLEMENTATION_PLAN.md`,
`DOCUMENTS_REGISTRY.md`).

`AGENT.md`, `QWEN.md`, `WARP.md`, and `.qwen/` (Qwen Code config, a Warp
Agent Mode rules file, and a generic multi-agent setup) were **deleted
outright**, not archived — Claude Code is now the sole executor for this
project, so there was nothing in them worth keeping as reference. See
`docs/IMPLEMENTATION_PLAN.md`'s decision log (D5) for context.

## Working conventions

Adapted from the owner's cross-project executor methodology (see
`docs/CLAUDE_CODE_INSTRUCTIONS.md`, `docs/PROJECT_KNOWLEDGE.md` for the full
version). The parts that materially change day-to-day behavior in this repo:

- **4 hard constraints:** do it right the first time (no do-overs); keep FSD
  boundaries and SOLID/SoC clean, no patches on patches; never hardcode
  text/prices/keys — content/config/env only, and this repo is **public** so
  secrets are env-only, never committed; prefer doing the visibly-better thing
  over quick-and-dirty, and log deferred work instead of skipping it silently.
- **Git:** `master` is production and default. Feature work goes through a
  PR. Never `--no-verify`, force-push, rebase, or squash on a pushed branch —
  history is preserved. `.env*` (except `.env.example`), `tmp/`,
  `docs.archive/`, `docs/_planner/`, and agent memory never reach `master`.
- **PROTECTED paths** — changes here need their own commit, a diff called out
  explicitly in the change summary, and (once a real test runner exists)
  coverage: `src/middleware.ts` (CSP/security headers), `src/features/forms/`
  and any `bitrix-*` lib code (live lead forms + Bitrix24 webhook),
  `src/features/analytics/` (GA4/Yandex Metrika).
- **Reporting convention:** end-of-task summaries state what changed, which
  files, and pass/fail for `type-check`/`lint`/`build` (there is no `test`
  script — see above); call out surprises (spec assumptions that turned out
  false) explicitly rather than silently working around them.
