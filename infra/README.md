# Production infrastructure (reference copies)

These are versioned copies of the configs actually running on
`zerodolg.ru`, captured 2026-07-15 —
see `tmp/RECON_PROD_2026-07-14.md` (local, gitignored) for the full recon.

**These files are not wired into any build or deploy tooling.** There is
currently no deploy pipeline (BL-063) — copying code to the server is still
a manual step. This directory exists so the only copies of these configs
aren't a single production disk.

- `nginx/zerodolg.ru.conf` — the live nginx vhost (HTTP→HTTPS redirect,
  www→non-www redirect, TLS, security headers, `/api/` reverse proxy to
  `127.0.0.1:4321`).
- `pm2/ecosystem.config.cjs` — the PM2 process definition for the
  `zerodolg-backend` SSR process (`server/entry.mjs`), including memory
  limits, log rotation, and the weekly `cron_restart`.
- `server-maintenance.sh` — the weekly maintenance cron job (`0 3 * * 0`,
  disk/log cleanup, includes a `pm2 flush` that clears form-submission logs
  — see BL-064).

Before editing the live server to match a future version of these files,
diff against the server's actual current config first — this snapshot will
drift out of date the moment someone edits the server by hand again.

## reCAPTCHA build/runtime requirement (read before any future deploy)

`PUBLIC_RECAPTCHA_SITE_KEY` is baked into the client bundle at **build**
time (`import.meta.env`); `RECAPTCHA_SECRET` is read at **runtime**
(`process.env`) by the server process. These are two different points in
time, potentially two different machines (CI build box vs. the server PM2
runs on), and two different `.env` files.

**If the site is ever built without `PUBLIC_RECAPTCHA_SITE_KEY` set, then
deployed to a server that has `RECAPTCHA_SECRET` set, every single form
submission will fail reCAPTCHA verification (`422`) and be silently
dropped** — there is no fallback storage (BL-056, not yet built). The app
guards against shipping this unnoticed: `checkRecaptchaConfigConsistency()`
(`src/features/forms/lib/recaptcha.ts`) runs once when `src/pages/api/form.ts`
is loaded and logs a loud `RECAPTCHA CONFIG MISMATCH` error if the two
disagree. That module is loaded lazily by Astro's Node adapter on the first
matching request, not eagerly at process boot — so check the logs after the
first request to `/api/form`, not the server's startup logs (a deploy
smoke-test that hits `/api/form` will trigger it). This guard only detects
an **empty** build-time site key; if the build ever bakes in a non-empty
placeholder/dummy value for `PUBLIC_RECAPTCHA_SITE_KEY` while
`RECAPTCHA_SECRET` is set at runtime, the guard stays silent even though the
client's real reCAPTCHA calls will still fail.

Rule of thumb: whatever `.env` is present when `npm run build`/
`build:prod` runs must have the _same_ `PUBLIC_RECAPTCHA_SITE_KEY`/
`RECAPTCHA_SECRET` pairing (both set, or both unset) as the `.env` the
server process starts with.

## nginx CSP vs. `src/middleware.ts` CSP (two independent sources, not one)

`nginx/zerodolg.ru.conf`'s `server` block (443, `server_name zerodolg.ru`)
sets its own `Content-Security-Policy` header with `add_header ... always`
at server level, which applies to **every** location in that block —
static file serving (`location /`, the static-first path in
`try_files $uri $uri.html $uri/ @ssr;`) _and_ the two proxied locations
(`/api/`, `@ssr`) that forward to the Node process. Confirmed as of this
snapshot (2026-07-15): it already allows `https://www.google.com` and
`https://www.gstatic.com` in both `script-src` and `connect-src`, so
reCAPTCHA is not currently blocked on prod by nginx's CSP.

Two consequences worth knowing before touching either CSP source again:

1. For the majority of pages (static, prerendered HTML served directly by
   nginx), **the browser never sees `src/middleware.ts`'s CSP at all** —
   that middleware only runs for requests that actually reach the Node
   process. Don't assume editing `middleware.ts` changes what's enforced
   on static pages; it doesn't, under this nginx setup.
2. For the two proxied locations (`/api/`, `@ssr`), `add_header ... always`
   at nginx's server level still applies on top of whatever CSP the Node
   response sets — meaning those responses can carry _two_
   `Content-Security-Policy` headers. Browsers enforce the intersection
   (most restrictive per-directive) of multiple CSP headers, not either one
   alone. Today both sources already agree on the reCAPTCHA hosts, so this
   is a latent inconsistency, not an active bug — but it means the two CSP
   sources need to be reconciled (ideally: one source of truth) before
   either is edited again without checking the other. Not fixed in this
   arc — filed as BL-068.
