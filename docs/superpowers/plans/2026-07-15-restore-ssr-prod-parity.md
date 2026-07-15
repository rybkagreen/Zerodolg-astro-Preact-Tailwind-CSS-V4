# Restore SSR + Prod Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make this repository able to build the SSR site that's actually
running in production (Astro `output: 'static'` + `@astrojs/node` adapter +
per-route `prerender = false` opt-out), and reimplement — cleanly, from a fresh
read of the behavior, not copy-pasted — the prod-only `/api/form` logic
(reCAPTCHA v3, testing mode, `/health`), while removing the hardcoded Bitrix
webhook token and fixing production error logging. This work is **local only** —
no deploy, no server connection, nothing pushed to prod.

**Architecture:** Keep `output: 'static'`; add the `@astrojs/node` adapter in
`standalone` mode (this is what produces the `dist/client/` +
`dist/server/entry.mjs` split seen on prod, confirmed against
`tmp/prod-snapshot/`); opt individual routes (`/api/form`, `/health`) out of
prerendering via `export const prerender = false`. All secret/config reads for
values that must be rotatable without a rebuild (`BITRIX24_WEBHOOK_URL`,
`RECAPTCHA_SECRET`, `TESTING`, `STAGING`, `RECAPTCHA_THRESHOLD`) switch from
`import.meta.env` to `process.env` — this is a deliberate fix, not scope creep:
`tmp/RECON_PROD_2026-07-14.md` proved Vite inlines `import.meta.env.X` as a
build-time constant, which is exactly why editing `.env` on the running prod
server today has no effect on the webhook URL. `process.env` is read live by the
Node adapter at request time. `PUBLIC_*` vars keep using `import.meta.env`
(that's the correct, intended behavior for client-exposed values).

**Tech Stack:** Astro 5.13, `@astrojs/node` (adapter), Preact islands, Zod (env
validation), TypeScript strict mode, no test runner (see Global Constraints).

## Global Constraints

- **No test runner exists in this repo** (CLAUDE.md is explicit about this) and
  this arc does not add one — that's out of scope. Every task substitutes
  `npm run type-check`, `npm run lint`, and a targeted manual/runtime check
  (`curl`, `node dist/server/entry.mjs`) for the "write failing test" step this
  skill normally expects.
- **Never deploy, never connect to the prod server.** All verification is local
  (`dist/`, `node dist/server/entry.mjs` on localhost).
- **Never copy code from `tmp/prod-snapshot/` verbatim.** Reimplement from the
  behavior described in `tmp/SPEC_api_form.md`.
- **Do not touch `src/shared/ui/BitrixCallback.astro`** (`define:vars` webhook
  exposure) — that's BL-054, a separate, narrower task, explicitly out of scope
  here.
- **Do not change the reCAPTCHA threshold** (`0.3`) — make it configurable via
  `RECAPTCHA_THRESHOLD` env var, but the value itself is BL-062, an owner
  decision.
- **Do not add fallback lead storage** (BL-056) — next task, not this one.
- **No real secrets in tracked files.** `BITRIX24_WEBHOOK_URL` and
  `RECAPTCHA_SECRET` come only from `process.env`, never a literal fallback.
  Final grep proof required (Task 13).
- **PROTECTED paths** (per CLAUDE.md): `src/middleware.ts` (CSP) and the live
  lead-form path (`src/pages/api/form.ts` and its new helper modules) each need
  their own commit with an explicit diff callout in the final report.
- **Commit message format:** Husky enforces `type(scope): description`, `type` ∈
  `feat|fix|docs|style|refactor|test|chore|perf|ci|build`. Every task ends with
  one commit on branch `feat/restore-ssr`.
- Dependency versions: pin `@astrojs/node` to `^9.4.4` (matches prod exactly,
  per `tmp/SPEC_api_form.md` §9).

---

### Task 1: Pin Node 20 and remove the dead optimized Astro config

**Files:**

- Create: `.nvmrc`
- Modify: `package.json` (`engines.node`)
- Delete: `astro.config.optimized.mjs`
- Modify: `eslint.config.js` (remove now-dangling ignore entries for the deleted
  file)

**Interfaces:** None — this task has no runtime code, just tooling/version
alignment.

- [ ] **Step 1: Confirm the optimized config is truly unreferenced**

Run:
`grep -rln "astro.config.optimized" . --include="*.json" --include="*.js" --include="*.mjs" --include="*.md" 2>/dev/null | grep -v node_modules | grep -v docs.archive`

Expected: only `eslint.config.js` (its ignore pattern), confirming no npm script
or doc points at it.

- [ ] **Step 2: Create `.nvmrc`**

```
20.20.2
```

- [ ] **Step 3: Update `package.json` engines**

In `package.json`, change:

```json
  "engines": {
    "node": ">=18.17.1"
  }
```

to:

```json
  "engines": {
    "node": ">=20.20.2"
  }
```

- [ ] **Step 4: Delete the dead config**

```bash
git rm astro.config.optimized.mjs
```

- [ ] **Step 5: Remove its ignore entries from `eslint.config.js`**

Remove the line `'astro.config.optimized.mjs',` from the `ignores` array (leave
the `'**/*.optimized.*'` glob entry — that still matches other orphaned
`.optimized.*` files like `FormEnhancedFinal.optimized.tsx`, which are out of
scope for this arc).

- [ ] **Step 6: Verify**

Run: `npm run lint && npm run type-check` Expected: both pass with no new
errors.

- [ ] **Step 7: Commit**

```bash
git checkout -b feat/restore-ssr
git add .nvmrc package.json eslint.config.js
git rm astro.config.optimized.mjs 2>/dev/null || true
git add -A astro.config.optimized.mjs
git commit -m "chore: pin Node 20 to match production and drop dead optimized Astro config"
```

---

### Task 2: Add the `@astrojs/node` adapter and reproduce prod's build output shape

**Files:**

- Modify: `package.json` (add `@astrojs/node` dependency)
- Modify: `astro.config.mjs`
- Modify: `astro.config.prod.mjs`
- Modify: `scripts/build/post-build-fix-urls.js`

**Interfaces:**

- Produces: `dist/client/` (static output + assets) and `dist/server/entry.mjs`
  (SSR entry) once at least one route sets `export const prerender = false` —
  Task 6 and Task 9 are what actually trigger server output; this task alone
  won't change `dist/` shape yet (no route opts out until later tasks), which is
  expected and fine.

- [ ] **Step 1: Install the adapter**

```bash
npm install @astrojs/node@^9.4.4
```

Expected: `package.json` dependencies gain `"@astrojs/node": "^9.4.4"`,
`package-lock.json` updates.

- [ ] **Step 2: Add the adapter to `astro.config.mjs`**

Add the import near the other integration imports:

```js
import node from '@astrojs/node';
```

Add the adapter to the config object, right after `output: 'static',`:

```js
  output: 'static',
  adapter: node({ mode: 'standalone' }),
```

- [ ] **Step 3: Add the adapter to `astro.config.prod.mjs`, and fix its missing
      path-alias block**

Add the same two edits as Step 2 — `import node from '@astrojs/node';` import
line, and `adapter: node({ mode: 'standalone' }),` immediately after this file's
existing `output: 'static', // Static site generation mode` line.

Confirmed by direct read (2026-07-15): this file's `vite` block has **no**
`resolve.alias` entry at all — unlike `astro.config.mjs:57-67`. This was
previously flagged as a pre-existing, out-of-scope gap, but this arc adds
`@shared/*`/`@features/*` imports to `src/pages/api/form.ts` and
`src/pages/health.ts` (Tasks 3–8), so `npm run build:prod` would now fail to
resolve those imports if left unfixed — in scope per this arc's own build-parity
requirement. Add the identical alias block into `astro.config.prod.mjs`'s `vite`
object (alongside its existing `build`/`css` keys, matching the base config's
structure):

```js
    resolve: {
      alias: {
        '@': '/src',
        '@app': '/src/app',
        '@entities': '/src/entities',
        '@features': '/src/features',
        '@widgets': '/src/widgets',
        '@shared': '/src/shared',
        '@pages': '/src/pages',
      },
    },
```

- [ ] **Step 4: Make the postbuild script target `dist/client` when present**

In `scripts/build/post-build-fix-urls.js`, replace:

```js
// Path to dist directory
const distPath = path.resolve(__dirname, '../../dist');
```

with:

```js
// Path to dist directory — with the node adapter installed, Astro splits
// static output into dist/client/ (and SSR entry into dist/server/); fall
// back to a flat dist/ for any config that stays fully static.
const distRoot = path.resolve(__dirname, '../../dist');
const distClientPath = path.join(distRoot, 'client');
const distPath = fs.existsSync(distClientPath) ? distClientPath : distRoot;
```

- [ ] **Step 5: Verify the build produces the expected shape**

Run: `npm run build` Expected: succeeds; `ls dist/` shows `client/` and
`server/` directories; `ls dist/server/entry.mjs` exists (this only happens once
Task 6/9 mark routes `prerender = false` — if this step is run before those
tasks, `dist/server/` may be absent or minimal; that's expected at this point in
the plan. Confirm no errors either way).

Run: `npm run type-check` Expected: passes.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json astro.config.mjs astro.config.prod.mjs scripts/build/post-build-fix-urls.js
git commit -m "feat(build): add node adapter and SSR config to reproduce prod"
```

---

### Task 3: Add reCAPTCHA + testing-mode environment configuration

**Files:**

- Modify: `src/env.d.ts`
- Modify: `src/shared/config/env.ts`
- Create: `src/shared/config/testing-mode.ts`
- Modify: `.env.example`

**Interfaces:**

- Produces: `isTestingEnv(): boolean` from `src/shared/config/testing-mode.ts` —
  used by Task 4 (`recaptcha.ts`) and Task 6/7 (`form.ts`).
- Produces: `RECAPTCHA_SECRET`, `PUBLIC_RECAPTCHA_SITE_KEY` now documented as
  read via `process.env`/`import.meta.env` respectively (no schema change needed
  for `validateEnv()` — both stay optional/unvalidated there since
  `verifyRecaptcha` already treats a missing key pair as "skip verification",
  matching prod).

- [ ] **Step 1: Extend `src/env.d.ts`**

Add the new keys to the existing interface:

```ts
interface ImportMetaEnv {
  readonly PUBLIC_YM_ID: string;
  readonly PUBLIC_GA_ID: string;
  readonly BITRIX24_WEBHOOK_URL: string;
  readonly DEBUG: string;
  readonly PUBLIC_RECAPTCHA_SITE_KEY: string;
  // Add other environment variables as needed
}
```

(`RECAPTCHA_SECRET`, `TESTING`, `STAGING`, `RECAPTCHA_THRESHOLD`, and
`BITRIX24_WEBHOOK_URL`'s _runtime_ read are intentionally **not** added here —
they're read via `process.env`, which is typed globally by `@types/node`'s
`NodeJS.ProcessEnv`, not `ImportMetaEnv`. Only `PUBLIC_RECAPTCHA_SITE_KEY` is
client-exposed and read via `import.meta.env`.)

- [ ] **Step 2: Create `src/shared/config/testing-mode.ts`**

```ts
import { logger } from '../lib/logger';

/**
 * Testing mode bypasses the live Bitrix24 call and reCAPTCHA verification.
 * It must never be silently active in production — every check logs at
 * WARN (the level prod's logger floor always lets through).
 */
export function isTestingEnv(): boolean {
  const enabled =
    process.env['NODE_ENV'] === 'test' ||
    process.env['TESTING'] === 'true' ||
    process.env['STAGING'] === 'true';

  if (enabled) {
    logger.warn(
      'TESTING MODE ACTIVE — Bitrix24 webhook calls and reCAPTCHA verification are bypassed'
    );
  }

  return enabled;
}
```

- [ ] **Step 3: Update `.env.example`**

Replace the existing reCAPTCHA block:

```
# Recaptcha v3 - PUBLIC_RECAPTCHA_SITE_KEY/RECAPTCHA_SECRET are present in production
# but no confirmed src/ usage yet (see BL-004 in docs/IMPLEMENTATION_PLAN.md)
PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_SECRET=your-recaptcha-secret-key
```

with:

```
# Recaptcha v3 - verified server-side in src/pages/api/form.ts via
# src/features/forms/lib/recaptcha.ts. Both vars must be set together to
# turn verification on; if either is unset, verification is skipped
# (matches prod behavior). Score threshold below matches prod's value —
# do not change without an explicit owner decision (BL-062).
PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_SECRET=your-recaptcha-secret-key
RECAPTCHA_THRESHOLD=0.3

# Testing mode - bypasses the live Bitrix24 webhook call and reCAPTCHA
# verification in src/pages/api/form.ts. Off by default. Any one of these
# being "true" (or NODE_ENV=test) turns it on; every check logs a loud
# WARN so it can never be silently active. Do not set in production.
TESTING=false
STAGING=false
```

- [ ] **Step 4: Verify**

Run: `npm run type-check` Expected: passes (no code references the new env vars
yet, so this is just confirming no syntax errors).

- [ ] **Step 5: Commit**

```bash
git add src/env.d.ts src/shared/config/testing-mode.ts .env.example
git commit -m "feat(config): add recaptcha and testing-mode environment support"
```

---

### Task 4: Add server-side reCAPTCHA v3 verification

**Files:**

- Create: `src/features/forms/lib/recaptcha.ts`

**Interfaces:**

- Consumes: `isTestingEnv()` from `src/shared/config/testing-mode.ts` (Task 3);
  `logger` from `@shared/lib/logger`.
- Produces:
  `verifyRecaptcha(token: string, remoteip?: string): Promise<boolean>` — used
  by Task 6/7 (`form.ts`); `checkRecaptchaConfigConsistency(): void` — called
  once at module load in `form.ts` (Task 5) to catch a real deploy-time footgun
  (see Step 1 note below).

- [ ] **Step 1: Write `src/features/forms/lib/recaptcha.ts`**

Note on `checkRecaptchaConfigConsistency` below: `PUBLIC_RECAPTCHA_SITE_KEY` is
read by the **client** bundle via `import.meta.env` (Task 9), which Vite bakes
in as a build-time constant — so the token-issuing capability the browser gets
is frozen at whatever `npm run build`/`build:prod` was run with.
`RECAPTCHA_SECRET` (and, server-side, `PUBLIC_RECAPTCHA_SITE_KEY` again) are
read via `process.env` at request time (this task's whole point — see the plan's
Architecture section). Those two facts combined create a silent-failure mode
this arc must not ship: if the site is **built** with no
`PUBLIC_RECAPTCHA_SITE_KEY` set, but the server is later **started** with
`RECAPTCHA_SECRET` set, `verifyRecaptcha` fails closed on every real submission
(empty token → treated as a failed check → `422`, Task 6) — every lead is
silently lost, forever, since BL-056 (fallback storage) isn't in scope here.
This must be impossible to ship unnoticed: the module captures the build-time
key and compares it against the runtime secret the moment the server process
starts, and logs a loud, unmissable `logger.error` if they disagree.

```ts
import { logger } from '@shared/lib/logger';
import { isTestingEnv } from '@shared/config/testing-mode';

const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';
const DEFAULT_THRESHOLD = 0.3;

interface RecaptchaVerifyResponse {
  success: boolean;
  score?: number;
  action?: string;
  hostname?: string;
  'error-codes'?: string[];
}

/**
 * Verifies a reCAPTCHA v3 token server-side. Skips verification (returns
 * true) if testing mode is on, or either the site key or secret is unset
 * — same shape as prod. Fails closed (returns false) on a missing token
 * or any network/parse error.
 */
export async function verifyRecaptcha(
  token: string,
  remoteip?: string
): Promise<boolean> {
  const secret = process.env['RECAPTCHA_SECRET'];
  const siteKey = process.env['PUBLIC_RECAPTCHA_SITE_KEY'];

  if (isTestingEnv() || !secret || !siteKey) {
    return true;
  }

  if (!token) {
    logger.warn('reCAPTCHA verification skipped: no token provided');
    return false;
  }

  const threshold = Number(
    process.env['RECAPTCHA_THRESHOLD'] ?? DEFAULT_THRESHOLD
  );

  try {
    const params = new URLSearchParams({ secret, response: token });
    if (remoteip) {
      params.set('remoteip', remoteip);
    }

    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = (await response.json()) as RecaptchaVerifyResponse;

    logger.info('reCAPTCHA verification result', {
      success: data.success,
      score: data.score,
      action: data.action,
    });

    const passed =
      data.success && (data.score === undefined || data.score >= threshold);

    if (!passed) {
      logger.warn('reCAPTCHA verification failed', { score: data.score });
    }

    return passed;
  } catch (error) {
    logger.error(
      'reCAPTCHA verification error',
      undefined,
      error instanceof Error ? error : new Error(String(error))
    );
    return false;
  }
}

// Captured at module load, which — under Vite's static replacement of
// `import.meta.env.X` — freezes this to whatever PUBLIC_RECAPTCHA_SITE_KEY
// was set to when `npm run build`/`build:prod` ran, NOT the current
// process's environment. This is intentional: it's the client bundle's
// actual baked-in capability, used below to catch a build/runtime mismatch.
const BUILD_TIME_SITE_KEY = import.meta.env['PUBLIC_RECAPTCHA_SITE_KEY'];

/**
 * Guards against a real deploy footgun: if RECAPTCHA_SECRET is set at
 * runtime (server-side verification is ON) but the client bundle was built
 * without PUBLIC_RECAPTCHA_SITE_KEY, browsers can never obtain a token —
 * verifyRecaptcha then fails closed on every submission (422), silently
 * dropping every lead until the site is rebuilt with the key set. Call
 * once at server startup (module load), not per-request — this is a
 * deploy-config problem, not a request-time one.
 */
export function checkRecaptchaConfigConsistency(): void {
  const secretConfiguredAtRuntime = Boolean(process.env['RECAPTCHA_SECRET']);
  const siteKeyBakedAtBuildTime = Boolean(BUILD_TIME_SITE_KEY);

  if (secretConfiguredAtRuntime && !siteKeyBakedAtBuildTime) {
    logger.error(
      'RECAPTCHA CONFIG MISMATCH: RECAPTCHA_SECRET is set at runtime but ' +
        'PUBLIC_RECAPTCHA_SITE_KEY was empty at BUILD time. The client bundle ' +
        'cannot obtain a reCAPTCHA token, so every /api/form submission will ' +
        'be rejected with 422 until the site is rebuilt with ' +
        'PUBLIC_RECAPTCHA_SITE_KEY set. See infra/README.md.'
    );
  }
}
```

Note: the prod bundle also prints a raw, un-gated `console.log` with full
verification details (score/action/hostname/remoteip) on every call, duplicating
the `logger.info` line — deliberately **not** reproduced here (per
`tmp/SPEC_api_form.md` ambiguity #2, it's PII in plaintext console output with
no log-level gate; the `logger.info` call above carries the same information
through the level-filtered path). Call this out as a decision, not an oversight,
in the final report.

- [ ] **Step 2: Verify**

Run: `npm run type-check && npm run lint` Expected: both pass. (`fetch` is a
global in Node 20 — no import needed.)

- [ ] **Step 3: Commit**

```bash
git add src/features/forms/lib/recaptcha.ts
git commit -m "feat(api): add server-side recaptcha v3 verification"
```

---

### Task 5: Remove the hardcoded Bitrix webhook fallback (BL-055)

**Files:**

- Modify: `src/pages/api/form.ts`

**Interfaces:**

- Consumes: `checkRecaptchaConfigConsistency()` from
  `src/features/forms/lib/recaptcha.ts` (Task 4) — called once at module load
  (see Step 1).
- Produces: `POST /api/form` now returns `503` when `BITRIX24_WEBHOOK_URL` is
  unset (instead of silently using a hardcoded lead-capture token), and
  short-circuits to `200` on an all-empty-fields probe request.

- [ ] **Step 1: Remove the hardcoded fallback and switch to `process.env`**

Replace:

```ts
// Конфигурация Bitrix24 из переменных окружения
const BITRIX24_WEBHOOK_URL =
  import.meta.env['BITRIX24_WEBHOOK_URL'] ||
  'https://zerodolg.bitrix24.ru/rest/1/***REDACTED***/';
```

with:

```ts
import { logger } from '@shared/lib/logger';
import { isTestingEnv } from '@shared/config/testing-mode';
import { checkRecaptchaConfigConsistency } from '@features/forms/lib/recaptcha';

export const prerender = false;

// Runs once, at module load (Node caches the module after first import) —
// this is a startup-time deploy-config check, not a per-request one. See
// checkRecaptchaConfigConsistency's doc comment (src/features/forms/lib/recaptcha.ts)
// for what it catches.
checkRecaptchaConfigConsistency();
```

(The `logger`/`isTestingEnv`/`prerender` additions here set up what Steps 2–3
and Task 6–7 need — `prerender = false` is what actually makes this route
SSR-rendered instead of prerendered. `checkRecaptchaConfigConsistency` is called
here, at the top of the file, rather than inside `POST`, specifically so it
fires once at server startup instead of on every request.)

- [ ] **Step 2: Add the unconfigured-webhook 503 and the empty-probe 200, inside
      `POST`**

Replace the start of the `POST` handler body (everything from `try {` through
the existing required-field check) with:

```ts
export const POST: APIRoute = async ({ request }) => {
  const webhookUrl = process.env['BITRIX24_WEBHOOK_URL'];
  const testingEnv = isTestingEnv();

  if (!webhookUrl && !testingEnv) {
    logger.error('BITRIX24_WEBHOOK_URL is not configured');
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Сервис временно недоступен. Пожалуйста, позвоните нам.',
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Получаем данные формы (поддержка JSON и FormData)
    const contentType = request.headers.get('content-type') || '';
    let data: Record<string, unknown>;

    if (contentType.includes('application/json')) {
      data = await request.json();
    } else {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    }

    // Извлекаем поля
    const name = (data['name'] as string) || '';
    const phone = (data['phone'] as string) || '';
    const email = (data['email'] as string) || '';
    const message = (data['message'] as string) || '';
    const formType = (data['formType'] as string) || 'callback';
    const recaptchaToken = (data['recaptchaToken'] as string) || '';

    // Health-probe: all fields empty means monitoring, not a real submission
    if (!name && !phone && !email && !message) {
      return new Response(
        JSON.stringify({ success: true, message: 'Form endpoint is available', test: true }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Валидация
    if (!name || !phone) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Имя и телефон обязательны',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
```

Leave everything from the `// Определяем заголовок в зависимости от типа формы`
comment onward unchanged for this step — Task 6 modifies the Bitrix-call section
next, and Task 7 modifies the logging.

Also update the reference to `BITRIX24_WEBHOOK_URL` further down in the file
(the `fetch` call) from `import.meta.env['BITRIX24_WEBHOOK_URL']`-derived usage
to the new `webhookUrl` variable — at this point in the file it already reads
`` `${BITRIX24_WEBHOOK_URL}crm.lead.add` ``; change that to
`` `${webhookUrl}crm.lead.add` ``.

- [ ] **Step 3: Verify no hardcoded token remains**

Run: `grep -n "bitrix24.ru/rest" src/pages/api/form.ts` Expected: no output
(zero matches).

Run: `npm run type-check` Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add src/pages/api/form.ts
git commit -m "fix(api): remove hardcoded webhook fallback"
```

---

### Task 6: Port reCAPTCHA verification and testing-mode mock into `/api/form`

**Files:**

- Modify: `src/pages/api/form.ts`

**Interfaces:**

- Consumes: `verifyRecaptcha` (Task 4), `isTestingEnv` (already imported in Task
  5).
- Produces: `POST /api/form` now returns `422` on a failed reCAPTCHA check, and
  skips the live Bitrix call entirely (using a `mock_lead_*` result) when
  testing mode is on.

- [ ] **Step 1: Add the reCAPTCHA check and testing-mode Bitrix bypass**

Extend the `@features/forms/lib/recaptcha` import added in Task 5 to also bring
in `verifyRecaptcha`:

```ts
import {
  checkRecaptchaConfigConsistency,
  verifyRecaptcha,
} from '@features/forms/lib/recaptcha';
```

Between the required-field validation (added in Task 5) and the existing
`// Определяем заголовок в зависимости от типа формы` block, insert:

```ts
const recaptchaConfigured = Boolean(
  process.env['PUBLIC_RECAPTCHA_SITE_KEY'] && process.env['RECAPTCHA_SECRET']
);

if (!testingEnv && recaptchaConfigured) {
  const passed = await verifyRecaptcha(recaptchaToken, clientAddress);
  if (!passed) {
    return new Response(
      JSON.stringify({
        success: false,
        error:
          'Обнаружена подозрительная активность. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.',
      }),
      { status: 422, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
```

Add `clientAddress` to the destructured `POST` handler params (currently
`async ({ request })`) — change to `async ({ request, clientAddress })`.

Then replace the Bitrix-call block (from `// Отправляем в Bitrix24` through the
`const bitrixResult = await bitrixResponse.json();` line) with:

```ts
// Bitrix returns a numeric lead ID; the mock path below uses a string.
// Typed narrowly (not `unknown`) so the existing `.toString()` call in
// the success-response block further down the file keeps compiling.
let bitrixResult: { result?: string | number };

if (testingEnv) {
  bitrixResult = { result: `mock_lead_${Date.now()}` };
  logger.warn('TESTING MODE: skipping Bitrix24 webhook call', { formType });
} else {
  const bitrixData = {
    fields: {
      TITLE: `${title} - ${name}`,
      NAME: name,
      PHONE: [{ VALUE: phone, VALUE_TYPE: 'WORK' }],
      EMAIL: email ? [{ VALUE: email, VALUE_TYPE: 'WORK' }] : undefined,
      COMMENTS: message || `Форма: ${formType}`,
      SOURCE_ID: 'WEB',
      OPENED: 'Y',
      ASSIGNED_BY_ID: 1,
      UF_CRM_1234567890: formType, // Кастомное поле для типа формы
    },
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);
  let bitrixResponse: Response;

  try {
    bitrixResponse = await fetch(`${webhookUrl}crm.lead.add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bitrixData),
      signal: controller.signal,
    });
  } catch (fetchError) {
    if (fetchError instanceof Error && fetchError.name === 'AbortError') {
      throw new Error('Bitrix24 request timeout');
    }
    throw fetchError;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!bitrixResponse.ok) {
    throw new Error(`Bitrix24 error: ${bitrixResponse.status}`);
  }

  bitrixResult = await bitrixResponse.json();
}
```

(This removes the old duplicate `bitrixData` construction that was previously
right after the title lookup — keep only the one now inside the `else` branch.
The `title`/`titles` lookup above it stays unchanged.)

- [ ] **Step 2: Wire `recaptchaToken` through — already destructured in Task 5,
      no further change needed here.**

- [ ] **Step 3: Verify**

Run: `npm run type-check && npm run lint` Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add src/pages/api/form.ts
git commit -m "feat(api): port recaptcha verification and testing mode from prod bundle"
```

---

### Task 7: Log errors and success events unconditionally in production (BL-057)

**Files:**

- Modify: `src/pages/api/form.ts`

**Interfaces:** None new — this only changes logging behavior on the existing
success/error paths.

- [ ] **Step 1: Remove the two `DEV`-only logging guards**

Replace:

```ts
// Логируем для отладки (только в режиме разработки)
if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.log('Lead created:', bitrixResult);
}
```

with:

```ts
logger.info('Lead created', { leadId: bitrixResult.result, formType });
```

Replace the catch block:

```ts
  } catch (error) {
    // Логируем ошибку (только в режиме разработки)
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('Form submission error:', error);
    }

    return new Response(
```

with:

```ts
  } catch (error) {
    logger.error(
      'Form submission error',
      undefined,
      error instanceof Error ? error : new Error(String(error))
    );

    return new Response(
```

Note: no `context` object is passed here (second arg `undefined`) because the
throw can happen during body parsing, before `formType` is extracted — there's
no field guaranteed to be in scope at this point in execution. This matches the
prod behavior of logging the error unconditionally; the error object itself
carries the failure detail.

- [ ] **Step 2: Verify the fix actually reaches production-level output**

Run: `npm run type-check && npm run lint` Expected: both pass, and no remaining
`// eslint-disable-next-line no-console` comments in this file (confirm:
`grep -n "console\." src/pages/api/form.ts` should now show zero matches — the
`GET` handler was already console-free).

- [ ] **Step 3: Commit**

```bash
git add src/pages/api/form.ts
git commit -m "fix(api): log errors and lead-creation events unconditionally in production"
```

---

### Task 8: Add the `/health` route and a `HEAD` handler on `/api/form`

**Files:**

- Create: `src/pages/health.ts`
- Modify: `src/pages/api/form.ts` (add `HEAD`)

**Interfaces:**

- Produces: `GET /health` →
  `200 { status: "ok", timestamp, service: "zerodolg-astro" }`.

- [ ] **Step 1: Create `src/pages/health.ts`**

```ts
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = () => {
  return new Response(
    JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'zerodolg-astro',
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
```

- [ ] **Step 2: Add a `HEAD` handler to `src/pages/api/form.ts`**

After the existing `GET` handler at the bottom of the file, add:

```ts
export const HEAD: APIRoute = () => new Response(null, { status: 200 });
```

- [ ] **Step 3: Verify with a real build + runtime check**

Run: `npm run build` Expected: succeeds, `dist/server/entry.mjs` exists,
`dist/server/pages/health.astro.mjs` exists.

Run (in one terminal):

```bash
NODE_ENV=production HOST=127.0.0.1 PORT=4321 BITRIX24_WEBHOOK_URL=https://example.invalid/rest/1/placeholder/ node dist/server/entry.mjs &
sleep 1
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:4321/health
kill %1
```

Expected: `200`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/health.ts src/pages/api/form.ts
git commit -m "feat(api): add health check route"
```

---

### Task 9: Capture a reCAPTCHA token client-side on submit

**Files:**

- Create: `src/features/forms/lib/recaptcha-client.ts`
- Modify: `src/islands/forms/FormEnhancedFinal.tsx`

**Interfaces:**

- Consumes: none.
- Produces: `getRecaptchaToken(action: string): Promise<string>` — resolves to
  `''` if `PUBLIC_RECAPTCHA_SITE_KEY` is unset or the script fails to load.

Correction to an earlier draft of this task: an empty token does **not** always
"fail open." `verifyRecaptcha` (Task 4) only skips verification when
`PUBLIC_RECAPTCHA_SITE_KEY`/`RECAPTCHA_SECRET` are _both_ unset, or testing mode
is on — that is the actual open path, and it's independent of whether the client
sent a token. If both keys **are** configured (the real-deploy case this arc is
building toward) and the client sends `''` — e.g. because the reCAPTCHA script
failed to load, or, per the mismatch scenario documented in Task
4/`infra/README.md`, the site was built without the site key while the server
has the secret — `verifyRecaptcha` treats the empty token as a failed check and
`form.ts` (Task 6) returns `422`. That is a **fail-closed** outcome: the
submission is rejected and the lead is lost, since fallback storage (BL-056)
isn't built yet. This function resolving to `''` instead of throwing only means
the _client_ doesn't crash on a load failure — it does not mean the _submission_
survives. Don't repeat "fails open" language for this path in the final report;
describe it accurately as above.

Note: `FormEnhancedFinal.tsx` (rendered via
`src/components/forms/BaseForm.astro`, used by `CallbackModal`,
`LeadMagnetsModals`, `CTAForm`, `HeroForm`, and the two landing pages) is the
only actually-used submission path to `/api/form` — confirmed by grep:
`src/islands/forms/form-logic.tsx` and `FormEnhancedFinal.optimized.tsx` have
zero importers anywhere in `src/`. This task only touches the live path.
`src/shared/ui/BitrixCallback.astro` is excluded per Global Constraints
(BL-054).

- [ ] **Step 1: Create `src/features/forms/lib/recaptcha-client.ts`**

```ts
declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
    };
  }
}

let scriptLoadPromise: Promise<void> | null = null;

function loadRecaptchaScript(siteKey: string): Promise<void> {
  if (window.grecaptcha) {
    return Promise.resolve();
  }
  if (scriptLoadPromise) {
    return scriptLoadPromise;
  }

  scriptLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load reCAPTCHA script'));
    document.head.appendChild(script);
  });

  return scriptLoadPromise;
}

/**
 * Obtains a reCAPTCHA v3 token for the given action. Resolves to an empty
 * string (never rejects) if the site key isn't configured or the script
 * fails to load. Note: an empty token does NOT necessarily mean the
 * submission proceeds unchecked — if the server has both recaptcha keys
 * configured, an empty token is treated as a failed verification (422),
 * not a skip. This function only guarantees the client itself doesn't
 * hang or throw; see src/features/forms/lib/recaptcha.ts for the
 * server-side pass/fail logic.
 */
export async function getRecaptchaToken(action: string): Promise<string> {
  const siteKey = import.meta.env['PUBLIC_RECAPTCHA_SITE_KEY'];
  if (!siteKey || typeof window === 'undefined') {
    return '';
  }

  try {
    await loadRecaptchaScript(siteKey);

    // Capture into a local const so the closure below has a narrowed,
    // guaranteed-defined reference — avoids a hung Promise (never
    // resolved or rejected) if `window.grecaptcha` were ever unset here.
    const grecaptcha = window.grecaptcha;
    if (!grecaptcha) {
      return '';
    }

    return await new Promise<string>((resolve, reject) => {
      grecaptcha.ready(() => {
        grecaptcha.execute(siteKey, { action }).then(resolve).catch(reject);
      });
    });
  } catch {
    return '';
  }
}
```

- [ ] **Step 2: Wire it into `FormEnhancedFinal.tsx`**

Add the import near the top of the file (alongside the other feature imports):

```ts
import { getRecaptchaToken } from '@features/forms/lib/recaptcha-client';
```

In the `handleSubmit`/submission function, right before
`const submissionData = {`, add:

```ts
const recaptchaToken = await getRecaptchaToken(config.formType);
```

Then add `recaptchaToken,` as a field inside the `submissionData` object literal
(alongside `formType`, `formId`, etc.):

```ts
        const submissionData = {
          ...formData,
          formType: config.formType,
          formId: config.formId,
          recaptchaToken,
          timestamp: new Date().toISOString(),
          metadata: {
```

- [ ] **Step 3: Verify**

Run: `npm run type-check && npm run lint` Expected: both pass.

Run: `npm run build` Expected: succeeds (no `PUBLIC_RECAPTCHA_SITE_KEY` set in
the build env is fine — `getRecaptchaToken` degrades to `''` at runtime, not
build time).

- [ ] **Step 4: Commit**

```bash
git add src/features/forms/lib/recaptcha-client.ts src/islands/forms/FormEnhancedFinal.tsx
git commit -m "feat(forms): capture recaptcha token on submit"
```

---

### Task 10: Allow reCAPTCHA script/connect sources in CSP (PROTECTED)

**Files:**

- Modify: `src/middleware.ts`

**Interfaces:** None — header value change only.

Scope check against the prod nginx config, done before writing this task
(`tmp/prod-snapshot/etc-nginx/zerodolg.ru:82`, versioned verbatim in Task 11 as
`infra/nginx/zerodolg.ru.conf`): nginx's own `Content-Security-Policy` header,
set at server level with `add_header ... always`, **already includes**
`https://www.google.com` and `https://www.gstatic.com` in both `script-src` and
`connect-src`. So on prod today, reCAPTCHA is not actually blocked by CSP — the
earlier assumption that nginx was missing these hosts doesn't hold; verified by
direct read, not guessed.

This task is still correct to do, but for a narrower reason than "unblock
reCAPTCHA on prod": `src/middleware.ts`'s CSP is what a **local dev server**
(`npm run dev`) and any **SSR-rendered response** (this arc's `/api/form`,
`/health`) actually send — those never go through nginx. Skipping this task
would mean reCAPTCHA's script tag is dev-server-blocked even though prod (via
nginx) already allows it, which is exactly the kind of drift this arc exists to
close.

**Be honest about what this task does _not_ do:** for the majority of pages on
prod — static, prerendered HTML served directly by nginx via
`try_files $uri $uri.html $uri/ @ssr;` — the browser never executes
`src/middleware.ts` at all (it only runs for requests that reach the Node
process), so this edit has **no effect** on what's enforced there. nginx's own
CSP (already permissive enough, per above) is the one actually in force for
those pages. See `infra/README.md` (Task 11) for the full nginx-vs-middleware
CSP writeup, including a second finding: nginx's `add_header ... always` also
applies to the two proxied locations (`/api/`, `@ssr`), so those SSR responses
can end up carrying _two_ `Content-Security-Policy` headers (nginx's + this
middleware's) — browsers intersect multiple CSP headers rather than using just
one. Both sources happen to agree on the reCAPTCHA hosts today, so this isn't an
active bug, but it's a latent inconsistency between two independent CSP sources
that should eventually be reconciled — filed as **BL-068**, out of scope for
this arc.

- [ ] **Step 1: Add `https://www.google.com` and `https://www.gstatic.com` to
      `script-src`, and `https://www.google.com` to `connect-src`**

In the CSP template string, change:

```
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://mc.yandex.ru https://yandex.ru https://*.yandex.ru;
```

(both the `isDev` and non-dev branches of `scriptSrc`) to:

```
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://mc.yandex.ru https://yandex.ru https://*.yandex.ru https://www.google.com https://www.gstatic.com;
```

(keep the `'unsafe-eval'` dev-only addition exactly as-is in the `isDev` branch
— only appending the two new hosts to both branches).

And change `connect-src`:

```
connect-src 'self' ws://localhost:* wss://localhost:* https://www.google-analytics.com https://region1.google-analytics.com https://mc.yandex.ru https://yandex.ru https://*.yandex.ru wss://mc.yandex.ru https://zerodolg.bitrix24.ru;
```

to:

```
connect-src 'self' ws://localhost:* wss://localhost:* https://www.google-analytics.com https://region1.google-analytics.com https://mc.yandex.ru https://yandex.ru https://*.yandex.ru wss://mc.yandex.ru https://zerodolg.bitrix24.ru https://www.google.com;
```

(`frame-src` already includes `https://www.google.com` — no change needed
there.)

- [ ] **Step 2: Verify**

Run: `npm run type-check && npm run lint` Expected: both pass.

Run: `npm run dev` briefly, load the homepage in a browser (or
`curl -sI http://localhost:4321/`), confirm the `Content-Security-Policy`
response header contains `www.google.com` and `www.gstatic.com` in `script-src`.
Stop the dev server after checking.

- [ ] **Step 3: Commit**

```bash
git add src/middleware.ts
git commit -m "fix(security): allow recaptcha script and connect sources in CSP"
```

---

### Task 11: Version production infrastructure configs

**Files:**

- Create: `infra/nginx/zerodolg.ru.conf`
- Create: `infra/pm2/ecosystem.config.cjs`
- Create: `infra/server-maintenance.sh`
- Create: `infra/README.md`

**Interfaces:** None — these are reference copies, not wired into any
build/deploy tooling (no deploy pipeline exists yet — that's BL-063, separate).

- [ ] **Step 1: Copy the three files verbatim**

```bash
mkdir -p infra/nginx infra/pm2
cp tmp/prod-snapshot/etc-nginx/zerodolg.ru infra/nginx/zerodolg.ru.conf
cp tmp/prod-snapshot/var-www-zerodolg.ru/ecosystem.config.cjs infra/pm2/ecosystem.config.cjs
cp tmp/prod-snapshot/etc-nginx/server-maintenance.sh infra/server-maintenance.sh
chmod +x infra/server-maintenance.sh
```

- [ ] **Step 2: Confirm no secrets are in any of the three files**

Run:
`grep -in "webhook\|secret\|password\|token" infra/nginx/zerodolg.ru.conf infra/pm2/ecosystem.config.cjs infra/server-maintenance.sh`
Expected: no output (these files reference cert _paths_ and
`env_file: './.env'`, never literal secret values — confirmed during plan
research).

- [ ] **Step 3: Write `infra/README.md`**

```markdown
# Production infrastructure (reference copies)

These are versioned copies of the configs actually running on `zerodolg.ru`
(`root@‹PROD_IP — см. tmp/RECON_PROD_2026-07-14.md›`), captured 2026-07-15 — see
`tmp/RECON_PROD_2026-07-14.md` (local, gitignored) for the full recon.

**These files are not wired into any build or deploy tooling.** There is
currently no deploy pipeline (BL-063) — copying code to the server is still a
manual step. This directory exists so the only copies of these configs aren't a
single production disk.

- `nginx/zerodolg.ru.conf` — the live nginx vhost (HTTP→HTTPS redirect,
  www→non-www redirect, TLS, security headers, `/api/` reverse proxy to
  `127.0.0.1:4321`).
- `pm2/ecosystem.config.cjs` — the PM2 process definition for the
  `zerodolg-backend` SSR process (`server/entry.mjs`), including memory limits,
  log rotation, and the weekly `cron_restart`.
- `server-maintenance.sh` — the weekly maintenance cron job (`0 3 * * 0`,
  disk/log cleanup, includes a `pm2 flush` that clears form-submission logs —
  see BL-064).

Before editing the live server to match a future version of these files, diff
against the server's actual current config first — this snapshot will drift out
of date the moment someone edits the server by hand again.

## reCAPTCHA build/runtime requirement (read before any future deploy)

`PUBLIC_RECAPTCHA_SITE_KEY` is baked into the client bundle at **build** time
(`import.meta.env`); `RECAPTCHA_SECRET` is read at **runtime** (`process.env`)
by the server process. These are two different points in time, potentially two
different machines (CI build box vs. the server PM2 runs on), and two different
`.env` files.

**If the site is ever built without `PUBLIC_RECAPTCHA_SITE_KEY` set, then
deployed to a server that has `RECAPTCHA_SECRET` set, every single form
submission will fail reCAPTCHA verification (`422`) and be silently dropped** —
there is no fallback storage (BL-056, not yet built). The app guards against
shipping this unnoticed: `checkRecaptchaConfigConsistency()`
(`src/features/forms/lib/recaptcha.ts`) runs once at server startup and logs a
loud `RECAPTCHA CONFIG MISMATCH` error if the two disagree — check the server's
startup logs after any deploy that touches these two vars.

Rule of thumb: whatever `.env` is present when `npm run build`/ `build:prod`
runs must have the _same_ `PUBLIC_RECAPTCHA_SITE_KEY`/ `RECAPTCHA_SECRET`
pairing (both set, or both unset) as the `.env` the server process starts with.

## nginx CSP vs. `src/middleware.ts` CSP (two independent sources, not one)

`nginx/zerodolg.ru.conf`'s `server` block (443, `server_name zerodolg.ru`) sets
its own `Content-Security-Policy` header with `add_header ... always` at server
level, which applies to **every** location in that block — static file serving
(`location /`, the static-first path in `try_files $uri $uri.html $uri/ @ssr;`)
_and_ the two proxied locations (`/api/`, `@ssr`) that forward to the Node
process. Confirmed as of this snapshot (2026-07-15): it already allows
`https://www.google.com` and `https://www.gstatic.com` in both `script-src` and
`connect-src`, so reCAPTCHA is not currently blocked on prod by nginx's CSP.

Two consequences worth knowing before touching either CSP source again:

1. For the majority of pages (static, prerendered HTML served directly by
   nginx), **the browser never sees `src/middleware.ts`'s CSP at all** — that
   middleware only runs for requests that actually reach the Node process. Don't
   assume editing `middleware.ts` changes what's enforced on static pages; it
   doesn't, under this nginx setup.
2. For the two proxied locations (`/api/`, `@ssr`), `add_header ... always` at
   nginx's server level still applies on top of whatever CSP the Node response
   sets — meaning those responses can carry _two_ `Content-Security-Policy`
   headers. Browsers enforce the intersection (most restrictive per-directive)
   of multiple CSP headers, not either one alone. Today both sources already
   agree on the reCAPTCHA hosts, so this is a latent inconsistency, not an
   active bug — but it means the two CSP sources need to be reconciled (ideally:
   one source of truth) before either is edited again without checking the
   other. Not fixed in this arc — filed as BL-068.
```

- [ ] **Step 4: Verify**

Run: `git status` — confirm only the four new `infra/` files are staged, nothing
under `tmp/` is included.

- [ ] **Step 5: Commit**

```bash
git add infra/
git commit -m "chore(infra): version production nginx, pm2 and maintenance configs"
```

---

### Task 12: Full verification gate and report assembly

**Files:** None modified — this task only runs checks and assembles the report
content.

**Interfaces:** None.

- [ ] **Step 1: Run the full quality gate, including the production build**

```bash
npm run type-check && npm run lint && npm run build && npm run build:prod
```

Expected: all four green. Note `build:prod` internally runs
`npm run clean && npm run type-check` before building (`package.json:10`), so it
wipes `dist/` from the preceding `npm run build` — that's expected, not a bug.
`build:prod` must succeed: Task 2 Step 3 already added the missing
`resolve.alias` block to `astro.config.prod.mjs` specifically so this doesn't
fail on `@shared/*`/`@features/*` imports; if it still fails here on an alias or
other resolution error, that's a plan gap to fix now, in this arc, not defer —
the arc's own goal is "this repo can build the SSR variant," and `build:prod` is
one of the two documented ways to do that (CLAUDE.md). Record pass/fail for both
builds in the final report, then run `npm run build` once more after
`build:prod` completes, so Steps 2–6 below inspect the non-prod `dist/`, which
is what the rest of this task's runtime checks assume.

- [ ] **Step 2: Structural parity check against the prod snapshot**

```bash
echo "--- dist/ top level ---"
ls dist/
echo "--- dist/server/ entry ---"
ls dist/server/entry.mjs
echo "--- dist/client/ vs prod client/ (names only, depth 1) ---"
diff <(ls dist/client) <(ls tmp/prod-snapshot/var-www-zerodolg.ru/client) || true
```

Record the diff output and explain each difference in the report (expected:
different asset hashes, prod has extra dead `manifest_*.mjs`/dead routes from
old builds per the recon, our build has the current site's actual page set — not
a byte-for-byte match, and the plan never required one).

- [ ] **Step 3: Route parity check**

Confirm the following exist somewhere under `dist/` (as static HTML files) or
`dist/server/pages/` (as SSR route modules): home, the 2 service pages
(`bankrotstvo-s-sokhraneniyem-imushchestva`, `restrukturizaciya-dolgov`), blog
listing, blog post pages, `privacy`, `terms`, a sitemap page,
`api/form.astro.mjs`, `health.astro.mjs`.

```bash
find dist -iname "*.html" -path "*bankrotstvo*"
find dist -iname "*.html" -path "*restrukturizaciya*"
find dist/server/pages -iname "*form*"
find dist/server/pages -iname "*health*"
```

Expected: all found.

- [ ] **Step 4: Runtime check — `/health` and `POST /api/form` in testing mode**

```bash
NODE_ENV=production HOST=127.0.0.1 PORT=4321 \
  TESTING=true PUBLIC_SITE_URL=https://zerodolg.ru \
  node dist/server/entry.mjs &
SERVER_PID=$!
sleep 1

echo "--- /health ---"
curl -s http://127.0.0.1:4321/health

echo "--- POST /api/form (testing mode) ---"
curl -s -X POST http://127.0.0.1:4321/api/form \
  -H "Content-Type: application/json" \
  -d '{"name":"Тест","phone":"+79990000000","formType":"callback"}'

kill $SERVER_PID
```

Expected: `/health` returns `200` with `service: "zerodolg-astro"`;
`POST /api/form` returns `success: true` with a `leadId` starting `mock_lead_`
and an `analytics` block — **no request reaches the real (dead) Bitrix
webhook**, confirmed by testing mode being on.

- [ ] **Step 5: Confirm `process.env` is read live, not baked in (proves the
      `import.meta.env` → `process.env` fix actually works)**

```bash
NODE_ENV=production HOST=127.0.0.1 PORT=4321 \
  BITRIX24_WEBHOOK_URL=https://example.invalid/rest/1/first/ \
  node dist/server/entry.mjs &
SERVER_PID=$!
sleep 1
curl -s -X POST http://127.0.0.1:4321/api/form -H "Content-Type: application/json" -d '{}'
kill $SERVER_PID
wait $SERVER_PID 2>/dev/null

NODE_ENV=production HOST=127.0.0.1 PORT=4321 \
  node dist/server/entry.mjs &
SERVER_PID=$!
sleep 1
echo "--- expect 503 now that BITRIX24_WEBHOOK_URL is unset, same build ---"
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://127.0.0.1:4321/api/form -H "Content-Type: application/json" -d '{"name":"x","phone":"y"}'
kill $SERVER_PID
```

Expected: same `dist/` build behaves differently across the two runs purely
based on the env var passed at process start — the 503 confirms
`BITRIX24_WEBHOOK_URL` was **not** inlined at build time, unlike the current
prod bundle.

- [ ] **Step 6: Confirm the recaptcha build/runtime mismatch guard (Task 4)
      actually fires**

The build already in `dist/` at this point was built with no
`PUBLIC_RECAPTCHA_SITE_KEY` set (none was exported anywhere earlier in this
task), so it's already a valid case to test against — start the server with
`RECAPTCHA_SECRET` set and confirm the mismatch is logged loudly at startup:

```bash
NODE_ENV=production HOST=127.0.0.1 PORT=4321 \
  BITRIX24_WEBHOOK_URL=https://example.invalid/rest/1/placeholder/ \
  RECAPTCHA_SECRET=test-secret-value \
  node dist/server/entry.mjs > /tmp/health-guard-check.log 2>&1 &
SERVER_PID=$!
sleep 1
kill $SERVER_PID
grep -i "RECAPTCHA CONFIG MISMATCH" /tmp/health-guard-check.log
```

Expected: one match — confirms `checkRecaptchaConfigConsistency()` fires at
server startup when the runtime secret and build-time site key disagree, per
Task 4/5. (This is a deliberate negative-path test — it does not need
`PUBLIC_RECAPTCHA_SITE_KEY` set anywhere, since the point is to prove the
mismatch is caught, not to prove the happy path.)

- [ ] **Step 7: Grep proof — no real secrets in tracked files**

```bash
git grep -n "bitrix24.ru/rest/1/" -- ':!tmp' ':!docs.archive' ':!*.md'
git ls-files | xargs grep -l "\.env$" 2>/dev/null
git check-ignore -v .env
```

Expected: first command returns no matches (or only the placeholder in
`.env.example`, which uses `your-domain.bitrix24.ru` — confirm it's the
placeholder, not the real subdomain); `.env` confirmed ignored.

- [ ] **Step 8: Assemble and present the final report**

Write a summary covering (this is the "STOP — вернуть" deliverable list from the
arc's brief):

- Link/path to `tmp/SPEC_api_form.md`.
- Output/prerender mode chosen and why (`static` + adapter + per-route opt-out,
  matches prod's `client/`+`server/` split — confirmed in Task 2/8).
- Dependency drift found (Task-2-adjacent: only `@astrojs/node` was a real
  runtime gap; three `stylelint-*` packages flagged as an open question, not
  added).
- `build:prod` result (Step 1) and the `astro.config.prod.mjs` path-alias gap it
  would otherwise have hit, fixed in Task 2 Step 3.
- Structural diff results from Step 2.
- Runtime check results from Steps 4–5, especially the `process.env` live-read
  proof.
- The recaptcha build/runtime mismatch guard proof from Step 6, and a pointer to
  the `infra/README.md` deploy note it backs (Task 11) — this is a real footgun
  for whoever eventually deploys this: build without
  `PUBLIC_RECAPTCHA_SITE_KEY` + runtime with `RECAPTCHA_SECRET` set = every lead
  silently 422s.
- Grep proof from Step 7.
- What was versioned into `infra/`, including the CSP-duplication finding from
  Task 10 (nginx already sets its own CSP at server level, including on proxied
  SSR/API responses — `middleware.ts`'s CSP is not the only one in play; see
  Task 10 for detail).
- Branch name (`feat/restore-ssr`), and that a PR to `master` is the next step
  (not opened automatically — confirm with the user first, per this repo's git
  conventions).
- Surprises explicitly flagged: Bitrix field mapping had zero drift; `logger.ts`
  and `consent-manager.ts` were already at parity (no porting needed, contrary
  to the original assumption in PROMPT_06's context section); the real defect
  behind BL-057 was two stray `DEV`-only guards, not the logger itself;
  `astro.config.prod.mjs` is missing the path-alias/postcss vite config that the
  base config has (pre-existing, not touched, flagged for a separate task); raw
  PII-bearing `console.log` calls from the prod bundle were deliberately not
  reproduced.

This step produces no commit — it's the plan's final report, delivered to the
user/reviewer directly.

---

## Post-plan (not part of this arc, explicitly out of scope)

- BL-054 (remove `BitrixCallback.astro`'s client-exposed webhook call)
- BL-053 (rotate the Bitrix token — blocked on BL-054, separately)
- BL-056 (fallback lead storage on Bitrix failure)
- BL-060 (nginx `deny` rule for `/server/*`)
- BL-063 (actual deploy pipeline)
- BL-068 (reconcile nginx's server-level CSP with `src/middleware.ts`'s CSP into
  one source of truth — currently two independent CSP headers can both apply to
  proxied `/api/`/SSR responses; they agree today but nothing keeps them in sync
  going forward — see Task 10 and `infra/README.md`)
- `astro.config.prod.mjs`'s missing explicit `css.postcss` vite config
  (pre-existing; low-risk because Vite auto-discovers `postcss.config.cjs` at
  the project root by default, unlike the alias gap that Task 2 now fixes —
  verify this assumption holds during Task 12's `build:prod` run, and only add
  the explicit `css: { postcss: './postcss.config.cjs' }` block if
  `build:prod`'s CSS output actually differs from `build`'s)
