# CONTRIBUTING — ZeroDolg

Development conventions, followed by humans and agents alike. Full
architecture/rules — `ARCHITECTURE.md` and `CLAUDE.md` (repo root).
> Project is **in production** (zerodolg.ru). Repository is **public** (MIT).

## Getting started

- **Node.js** >=18.17.1 (latest LTS recommended), **npm** >=9, **Git** >=2.34.
- `npm install`, then `npm run dev` (→ http://localhost:4321).

## Git flow

- Branches: `feature/[desc]`, `fix/[desc]`, `chore/[desc]`. Default/production
  branch is `master`.
- Feature branches land on `master` via **Pull Request**. Preserve history.
- Never on a pushed branch: `--no-verify`, force-push, rebase, squash.
- Never committed to `master`: `.env*` (except `.env.example`), `tmp/`,
  `docs.archive/`, `docs/_planner/`, agent memory. Public repo → no secrets in
  history, ever.

## Commit messages

- **Conventional Commits**, enforced locally by the Husky `commit-msg` hook
  (`.husky/commit-msg`), not a JS commitlint package. Regex:
  `^(feat|fix|docs|style|refactor|test|chore|perf|ci|build)(\(.+\))?: .{1,50}`.
- English, imperative mood. Add Russian context in the body where it helps.
- Atomic, meaningful commits. PROTECTED files (see `CLAUDE.md` → "Working
  conventions") get their own commit.

Examples: `feat(forms): add debounce to phone input`,
`fix(analytics): guard against missing PUBLIC_YM_ID`.

## Code style

- **TypeScript 5.9** strict mode (`npm run type-check` — keep it at 0
  errors). **ESLint 9** flat config (`eslint.config.js`): `npm run lint` /
  `lint:fix`. **Prettier**: `npm run format` (see `.prettierrc` for the
  markdown-wrap exceptions).
- Styles — **Tailwind CSS 3.4** (classic `tailwind.config.js` + PostCSS, not
  v4's CSS-first config, despite what some older docs say) + design tokens.
  Tailwind is the foundation here, not something to migrate away from.
- **FSD:** put new code in the right layer — see `CLAUDE.md` → "Actual `src/`
  structure" and "TypeScript / Vite path aliases" for the verified layer map
  and import aliases (that file is the source of truth for the project tree,
  not the diagram further down in this document). Features don't know about
  each other; `shared` is independent. Interactive code lives in islands
  (`src/islands/`).
- Don't hardcode — copy/data goes in Markdown/content collections, params/
  URLs/keys in config or env. Secrets are env-only.
- SOLID, separation of concerns. No patches on top of patches.

## Project structure (top level)

```
zerodolg-astro/
├── docs/                    # current documentation (this + ARCHITECTURE.md/CLAUDE.md)
├── public/                  # static assets served as-is
├── scripts/                 # build / deploy / dev / maintenance scripts
├── src/                     # source — see CLAUDE.md for the verified FSD layer breakdown
├── tools/                   # standalone tooling (MCP/Puppeteer demo, SAST wrappers)
└── package.json
```

## Testing

- **There is currently no automated test runner in this repository** —
  `package.json` has no `test` script and no Vitest/Testing Library
  dependency, regardless of what `README.md`/`AGENT.md`/CI config claim. The
  closest thing to a test suite today is `npm run type-check && npm run lint
  && npm run build`. If you add a real test runner, set it up from scratch
  (dependency, config, script) — see `CLAUDE.md` for details.
- Husky's pre-commit hook runs its checks on every commit; before a
  merge/deploy, run the full local gate: `npm run type-check && npm run lint
  && npm run build`.

## Security

- **CSP + security headers** (`src/middleware.ts`), SRI for external
  resources — don't weaken these. SAST: `npm run tools:semgrep`.
- Secret leakage: `npm run tools:trufflehog` — **this repo script gives an
  unreliable/false result when the underlying TruffleHog CLI isn't available
  via `npx`** (tracked as backlog item BL-001 in
  `docs/IMPLEMENTATION_PLAN.md`; don't trust a clean run from it without
  cross-checking with a real TruffleHog invocation, e.g. the official Docker
  image — this repository is public).
- If you find a security vulnerability, don't open a public Issue — contact
  the repository owner directly.
- Accessibility (WCAG 2.2) — don't regress it; forms/tabs/accordions need
  correct ARIA.

## Documents

- A meaningful change to a tracked doc → bump its version in
  `docs/DOCUMENTS_REGISTRY.md` plus the date.
- Long intermediate/working notes → `tmp/` (gitignored), clean up before
  wrapping a task.

## What not to do

- Break FSD boundaries. Touch load-bearing test infrastructure once one
  exists.
- Hardcode text/prices/URLs/keys.
- Add fake urgency triggers or keyword-stuffed copy to pages.
- Move off Tailwind. Force a deploy without `npm run deploy:checklist`. Put
  secrets in the public repository.
