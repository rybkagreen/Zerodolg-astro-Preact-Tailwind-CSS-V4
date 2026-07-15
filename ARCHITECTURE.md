# ARCHITECTURE — ZeroDolg (zerodolg.ru)

> Консолидированные решения и правила разработки. Living-документ. Версия: 1.1 ·
> 14.07.2026 · Адаптировано из методологии Shaliko под фактический стек
> ZeroDolg. Технические разделы (§1, §3, §9, §10) сверены напрямую с
> `package.json`/конфигами этой сессией — см. пометки «(проверено)». Подробное
> описание слоёв/алиасов/конвенций — `CLAUDE.md` (repo root), этот файл не
> дублирует его построчно.

## 0. TL;DR

- Корпоративный сайт юрфирмы по банкротству физлиц + лид-формы (→ Bitrix24) +
  блог + калькулятор.
- **Стек:** **Astro 5** (static + Islands Architecture) · **Preact** ·
  **TypeScript 5.9** · **Tailwind CSS 3.4** · архитектура **Feature-Sliced
  Design (FSD)**. БД нет — контент из Markdown (блог) и TS/JSON-данных
  (команда/отзывы); заказы-лиды уходят в CRM.
- **Интеграции:** Bitrix24 (вебхук), Google Analytics 4, Яндекс.Метрика,
  reCAPTCHA (site-key задокументирован в `.env.example`, но фактического
  использования в `src/` этой сессией не найдено — см. §6).
- **Состояние:** **в production с октября 2025.**
- **Git:** GitHub (публичный репозиторий, MIT), дефолт `master`; GitHub Actions
  есть в `.github/workflows/ci.yml`, но триггерится на `main`/`develop`, не на
  фактический `master` — см. §10.
- **Хостинг:** ‹VDS/хостинг — уточнить у владельца›.

## 1. Стек — зафиксированные версии (проверено против `package.json`, 14.07.2026)

| Пакет         | Версия  | Примечание                                                                        |
| ------------- | ------- | --------------------------------------------------------------------------------- |
| `astro`       | 5.13.7  | статический генератор + Islands, `output: 'static'`                               |
| `preact`      | 10.27.1 | интерактивные острова (`jsxImportSource: 'preact'`)                               |
| `typescript`  | 5.9.2   | strict + `noUncheckedIndexedAccess` и др.; 0 TS-ошибок — держать                  |
| `tailwindcss` | 3.4.17  | **это v3**, не v4 — classic `tailwind.config.js` + PostCSS, не CSS-first `@theme` |
| `eslint`      | 9.36.0  | flat config (`eslint.config.js`), плагины Astro + TS                              |
| `prettier`    | 3.6.2   | форматтер, включая `.astro`                                                       |
| `husky`       | 9.1.7   | git-hooks (pre-commit, commit-msg)                                                |
| `puppeteer`   | 24.23.0 | **только для `tools/mcp-puppeteer-server.js` (MCP-демо)** — не E2E-раннер         |

- **Тестов нет.** `package.json` не содержит скрипта `test`, Vitest/Testing
  Library не входят в зависимости — несмотря на то, что `README.md`, `AGENT.md`,
  `.github/workflows/ci.yml` и часть исторических документов утверждают
  обратное. Ближайший эквивалент тест-сьюта — `type-check && lint && build`.
  Подробно — `CLAUDE.md` → «There is no automated test suite».
- **Node:** `>=18.17.1` (рекомендуется последняя LTS). **npm** `>=9`. **Git**
  `>=2.34` (для Husky).
- **Линт:** `npm run lint` (ESLint) · автофикс `npm run lint:fix`. Формат:
  `npm run format`.

## 2. Принципы разработки

- **Не хардкодим — ничего.** Тексты/параметры/цены/URL/ключи — в контенте /
  конфигах / env. Репозиторий **публичный** → секреты только в env; `.env` не
  коммитим (есть `.env.example`).
- Тонкие компоненты; логика — в нужных слоях FSD (`features/`, `shared/lib/`).
  SoC / SOLID.
- **Границы FSD — жёсткое правило:** слой использует только нижележащие;
  features не знают друг о друге; shared независим. Полная таблица слоёв —
  `CLAUDE.md` (repo root).
- Тест-инфраструктуры сейчас нет (см. §1) — до появления реального раннера «не
  ломаем тест-инфраструктуру» не применимо буквально; при добавлении тестов
  заводить с нуля осознанно, не по шаблону из устаревших доков.
- **Security-чувствительное** (PII-формы, вебхук Bitrix24, GA4-хэши, ключи
  reCAPTCHA) — узкими отдельными промтами, не внутри больших арок.

## 3. Централизованные параметры и контент

- Параметры сайта — через env, валидируются `scripts/dev/validate-env.js`
  (`npm run env:validate`). **Обязательные:** `BITRIX24_WEBHOOK_URL`,
  `PUBLIC_SITE_URL`, `PUBLIC_SITE_PHONE`, `PUBLIC_SITE_EMAIL`. **Опциональные
  (валидируются, если заданы):** `PUBLIC_GA_ID`, `PUBLIC_YM_ID`,
  `PUBLIC_ASTRO_TOOLBAR`, `NODE_ENV`.
- **Полный список ключей, фактически присутствующих в проде** (сверено с боевым
  `.env`, 14.07.2026 — имена, без значений): `BITRIX24_WEBHOOK_URL`, `HOST`,
  `NODE_ENV`, `PORT`, `PUBLIC_ASTRO_TOOLBAR`, `PUBLIC_GA_ID`, `PUBLIC_GTM_ID`,
  `PUBLIC_RECAPTCHA_SITE_KEY`, `PUBLIC_SITE_EMAIL`, `PUBLIC_SITE_PHONE`,
  `PUBLIC_SITE_URL`, `PUBLIC_YM_ID`, `RECAPTCHA_SECRET`, `YANDEX_METRIKA_ID`,
  `YANDEX_SEARCH_API_KEY`, `YANDEX_VERIFICATION`. Из них в `src/`/скриптах этой
  сессией найдено использование только `PUBLIC_YM_ID` (Яндекс.Метрика — код
  читает именно этот ключ, не `YANDEX_METRIKA_ID`) и упомянутых выше 4
  обязательных + 4 опциональных. `HOST`, `PORT`, `PUBLIC_GTM_ID`,
  `YANDEX_METRIKA_ID`, `YANDEX_VERIFICATION`, `YANDEX_SEARCH_API_KEY`,
  `PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET` присутствуют в проде, но не
  читаются нигде в `src/`/`scripts/`/`astro.config.*` на момент проверки —
  вероятно задел на будущее (GTM, Яндекс.Вебмастер-верификация, Search API,
  reCAPTCHA) либо остатки другого окружения. Не удалять/не считать мёртвыми без
  подтверждения владельца — просто не документировать их как «используемые
  кодом». Актуальный шаблон — `.env.example` (плейсхолдеры).
- Контент блога — Markdown в `src/content/blog/`; команда/отзывы —
  `src/content/team/`, `src/content/reviews/` (content collections) и
  `src/core/team-members.ts`.

## 4. Дизайн-система

- **Токены — в Tailwind-конфиге** (цвета, типографика, отступы, радиусы,
  брейкпоинты) + `src/styles/theme.css`. В разметке — утилиты Tailwind/токены.
  Цветовая система — OKLCH.
- **Редизайн главной (D4, план владельца):** нейтральный офф-вайт, один
  акцент-тил `#0E5A56`, вторичный песочный дозированно, единая типо-шкала
  (H1–caption), ритм 8px. Источник значений — дизайн-бриф (артефакт
  планировщика, не трекается в этом репозитории). Убрать красный/оранжевый «фон
  бренда», если он будет найден в разметке — на момент этой сессии предметно не
  проверялось (вне скоупа housekeeping-промта).
- **Бренд-марка / фото** — заказчика (уникальные), IP-вопросов нет.

## 5. Feature-Sliced Design (слои)

Актуальная таблица слоёв, зависимости и алиасы (`@/*`, `@app/*`, `@entities/*`,
`@features/*`, `@widgets/*`, `@shared/*` + узкие
`@shared/ui|lib|config|types|hooks|api`, `@pages/*`) — см. `CLAUDE.md` §
«Architecture» → «TypeScript / Vite path aliases». Не дублируется здесь во
избежание рассинхронизации: два источника правды для одного факта хуже, чем
один.

## 6. Данные и интеграции

- **БД нет.** Блог — Markdown; команда/отзывы — content collections +
  `src/core/team-members.ts`.
- **Лид-формы → Bitrix24:** серверный вебхук (`BITRIX24_WEBHOOK_URL`), см.
  `src/pages/api/`, `src/features/forms/`.
- **Аналитика:** GA4 (`PUBLIC_GA_ID`) + Яндекс.Метрика (`PUBLIC_YM_ID`),
  consent-gated — `src/features/analytics/`, `src/shared/lib/analytics*.ts`.
- **reCAPTCHA:** `PUBLIC_RECAPTCHA_SITE_KEY`/`RECAPTCHA_SECRET` присутствуют в
  env и `.env.example`, но эта сессия не нашла реального подключения в `src/` —
  проверить перед тем, как полагаться на защиту от спама на формах (см. §3).
- **SEO:** Schema.org, `sitemap.xml`, `robots.txt`, мета/OG —
  `src/shared/ui/SEO/`.

## 7. Безопасность (SAST)

- **CSP + security-заголовки** — `src/middleware.ts` (не только meta-теги CSP,
  если такие есть).
- **Semgrep** (`npm run tools:semgrep`) — SAST. **Репо-скрипт
  (`tools/semgrep-scan.js`) не запускается** — `npx semgrep` резолвится в чужой
  npm-пакет-сквоттер (`semgrep@0.0.1`, без исполняемого файла), не в реальный
  semgrep (BL-002, тот же класс бага, что у TruffleHog ниже). Реальный скан
  (Python venv + PyPI `semgrep`, 14.07.2026, 280 community-правил/399 файлов)
  нашёл 4 находки уровня ERROR (Dockerfile без non-root `USER`,
  `shell:true`/`execSync` с переменной строкой в
  `scripts/deploy/deploy-complete.js` и `scripts/dev/setup-optimization.js`) +
  53 WARNING + 26 INFO — детали и приоритет в `docs/IMPLEMENTATION_PLAN.md`
  (BL-008/BL-009); не исправлено в этом housekeeping-промте, требует отдельного
  security-прохода.
- **TruffleHog** (`npm run tools:trufflehog`) — проверка утечки секретов;
  **репо-скрипт `tools/trufflehog-scan.js` даёт ложноположительный/недостоверный
  результат, когда сам инструмент недоступен через `npx`** — известный баг
  (BL-001), не доверять его выводу без перепроверки реальным TruffleHog.
  Реальный скан (Docker `trufflesecurity/trufflehog:latest`, все ветки/126
  коммитов, 14.07.2026) — **0 verified/unverified находок**, репозиторий чист на
  момент проверки. Критично: репо публичный, перепроверять реальным сканом
  периодически, не полагаться на репо-скрипт до фикса BL-001.
- Доступность: WCAG 2.2, ARIA, keyboard-навигация — не автоматизировано,
  проверять вручную.

## 8. Правила наименования

- Preact-компоненты: `PascalCase.tsx`. Astro: `PascalCase.astro`.
- Хуки: `useXxx.ts` (`src/shared/hooks/`). Утилиты: `camelCase.ts`.
- Контент блога: Markdown. Ветки: `master` (default/prod), фичи —
  `feature/<kebab>`, фиксы — `fix/<kebab>`, хозработы — `chore/<kebab>`.

## 9. Структура проекта

Фактическое дерево `src/` (проверено против репозитория, не против README/старых
доков) и примечания по расхождениям — `CLAUDE.md` § «Architecture» → «Actual
`src/` structure». Верхний уровень репозитория:

```
zerodolg-astro/
├─ .github/workflows/     # CI/CD (GitHub Actions) — см. §10 про ветки
├─ .husky/                # git hooks (pre-commit, commit-msg)
├─ docs/                  # актуальная документация (этот набор файлов)
├─ docs.archive/          # архив старой/неактуальной документации (gitignored, не в репо)
├─ public/                # статика, отдаваемая as-is
├─ scripts/               # build / deploy / dev / maintenance
├─ src/                   # см. CLAUDE.md для полного разбора по FSD-слоям
├─ tools/                 # автономные инструменты (MCP/Puppeteer, SAST-обвязки)
└─ tmp/                   # scratch-файлы агента (gitignored, не в репо)
```

## 10. Git и деплой

- **GitHub** (публичный, MIT). Дефолт `master`. Фичи → PR → `master`.
- **CI:** `.github/workflows/ci.yml` существует, но триггерится на push/PR к
  `main`/`develop` — **не к фактическому дефолтному `master`** — вероятно,
  никогда не запускается на реальных PR в этот репозиторий. Отдельно, его шаг
  `npm run test` завершится ошибкой, т.к. такого скрипта нет (см. §1). Оба факта
  — известные расхождения, зафиксированы как backlog, чинить в отдельном узком
  промте (правки CI вне скоупа этого housekeeping-прохода).
- **Локальный «real CI»** (обязателен перед STOP/мержем):
  `npm run type-check && npm run lint && npm run build`. `npm run test` в эту
  цепочку не входит, пока раннер не появится в репозитории.
- В `master` не попадают: `.env*` (кроме `.env.example`), `tmp/`,
  `docs.archive/`, `docs/_planner/`, память агента. Репо **публичный** → тем
  строже.
- История: без force-push / rebase / squash на опубликованных ветках.
- **Деплой:** механизм уточнить у владельца; сборка `npm run build:prod`;
  чек-лист `npm run deploy:checklist`; верификация `npm run deploy:verify`;
  бэкап/откат `deploy:backup` / `deploy:rollback`.

## 11. Решено / открыто / следующий шаг

- ✅ Стек/FSD/интеграции — зафиксированы (прод), версии сверены с `package.json`
  14.07.2026.
- ✅ Housekeeping-репозитория (документация, `.gitignore`, env-доки, Claude Code
  конфиг) — этот проход.
- ✅ **Исполнитель:** Claude Code (единственный) — подтверждено владельцем
  14.07.2026 (D5, см. `docs/PROJECT_KNOWLEDGE.md`); Qwen/Warp/generic
  multi-agent тулинг удалён из репозитория.
- ⏳ Деплой-механизм; биллинг Actions; доступы к прод-серверу; согласование
  редизайна заказчиком.
- ⏳ CI workflow (`main`/`develop` vs `master`, `npm run test` шаг) — backlog,
  узкий промт.
- ⏳ `reCAPTCHA`/`PUBLIC_GTM_ID`/`YANDEX_VERIFICATION`/`YANDEX_SEARCH_API_KEY` —
  подтвердить, используются ли фактически или это задел на будущее (см. §3, §6).
