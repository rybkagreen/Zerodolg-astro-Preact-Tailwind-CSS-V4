# Claude Code — рабочие инструкции (executor)

Ты — исполнитель проекта ZeroDolg (сайт юрфирмы по банкротству, **zerodolg.ru, в проде**). Работаешь
локально, деплой на ‹VDS/хостинг›. Делаешь git, сборку, деплой. Получаешь декларативные промты от
планировщика (Claude.ai) — цель + DoD + acceptance-контракт, без пошагового рецепта. Путь скоупишь сам.
> Claude Code — единственный исполнитель проекта (подтверждено владельцем 14.07.2026, D5); Qwen Code/
> Warp/generic multi-agent тулинг удалён из репозитория — hook/Fable-специфика ниже не адаптируется
> под другой runtime, его больше нет.
> ⚠️ Технические факты в этом файле сверены с фактическим репозиторием 14.07.2026 (housekeeping-сессия) —
> см. пометки «(проверено)». Расхождения с исходной методичкой Shaliko зафиксированы явно, не молча.

## 4 принципа (поверх всего)

1. Правильно сразу — не переделывать.
2. Архитектурно чисто (SOLID, SoC), без патчей поверх патчей; **не нарушать границы FSD-слоёв**.
3. Не хардкодим — тексты/параметры/цены/ключи в config / content / env. Репо **публичный** →
   секреты только в env.
4. Видим лучше → делаем; quick-and-dirty reject, defer как BL.

## Стек / версии (проверено против `package.json`, источник истины — `ARCHITECTURE.md §1`)

Astro 5.13.7 (static + Islands) · Preact 10.27.1 · TypeScript 5.9.2 (strict) · Tailwind 3.4.17
(v3, не v4 — classic config + PostCSS) · FSD · ESLint 9.36 · Prettier 3.6.2 · Husky 9.1.7 ·
Node ≥ 18.17 (LTS). **Тестов нет** (проверено): `package.json` не содержит скрипта `test`,
Vitest/Testing Library не установлены. Puppeteer 24.23 стоит только ради
`tools/mcp-puppeteer-server.js` (MCP-демо), не как E2E-раннер. Линт — `npm run lint`.

## Как читать промт

Цель + DoD + acceptance-контракт, НЕ «сделай X→Y→Z». Шаги определяешь сам. Перед STOP доказываешь
выполнение контракта (machine-checkable).

## Шаг 0 — эмпирика (всегда)

Перед изменениями: mutation audit / blast radius. Больше радиус → важнее. Особое внимание — код,
задевающий формы, вебхук Bitrix24, аналитику, CSP, границы FSD-слоёв. Research пропустил callers →
final mutation audit обязателен. **Проверяй факты против репозитория, а не только против других
доков** — этот набор методичек сам по себе местами устарел относительно кода (см. пометки
«(проверено)» здесь и в `ARCHITECTURE.md`); расхождение план↔код фиксируется явно в отчёте, не
маскируется молчаливой правкой.

## Git discipline

- Дефолт `master` = production. Фичи → PR → `master`.
- Никогда (на опубликованных ветках): `--no-verify`, force-push, rebase, squash. Preserve history.
- В `master` не попадают: `.env*` (кроме `.env.example`), `tmp/`, `docs.archive/`, `docs/_planner/`,
  память агента (`.claude/settings.local.json` и подобное локальное состояние), `node_modules/`,
  артефакты сборки. Публичный репо — строго.
- Атомарные осмысленные коммиты, Conventional Commits (`.husky/commit-msg` regex:
  `^(feat|fix|docs|style|refactor|test|chore|perf|ci|build)(\(.+\))?: .{1,50}`). PROTECTED файлы —
  отдельный коммит + дифф в отчёте + покрытие тестами (когда раннер появится).

## Gate discipline

Production changes → gate-check между коммитами. Gate упал → STOP. Verify gates (проверено —
это фактически исполнимая цепочка): `npm run type-check` + `npm run lint` + `npm run build`.
**`npm run test`/`npm run test:e2e` не существуют в этом репозитории** — не включать их в gate,
пока раннер не добавлен осознанным отдельным промтом. `.github/workflows/ci.yml` существует, но
триггерится на `main`/`develop`, не на фактический `master`, и его шаг `npm run test` сломан —
известное расхождение, backlog, не чинится в рамках housekeeping-промта. Перед прод-деплоем —
`npm run deploy:checklist`.

## STOP discipline

STOP на: необратимом, ревью владельца, конце этапа/потока. STOP несёт machine-checkable Done и список
что вернуть. Hook: bound at 2 non-trivial acks (Claude Code/Fable; идентичные fires = 1 ack).

## Отчётность

Summary изменений (НЕ «ход мысли» — триггерит fallback): что сделано, какие файлы,
`type-check`/`lint`/`build` pass/fail (без `test` — см. Gate discipline), дифф к PROTECTED = 0, что
вернуть. Сюрпризы (план ≠ код) — фиксировать явно, включая случаи, когда сама методичка (этот набор
файлов) утверждала что-то, что не подтвердилось при проверке репозитория.

## tmp/ workflow

Длинные intermediate reports → `tmp/[step]_[topic].md` (`tmp/` gitignored). В отчёт — короткое
summary + path. Чистить `tmp/*.md` перед финальным отчётом.

## Process rules

- **FSD:** новый код — в правильный слой (`CLAUDE.md` → «Actual `src/` structure» — там же verified
  path-алиасы). Интерактив — острова (`src/islands/`), гидратация по требованию; статика —
  `shared/ui`/`widgets`.
- **PII/security** (лид-формы, вебхук Bitrix24 `BITRIX24_WEBHOOK_URL`, GA4/Яндекс.Метрика,
  ключи reCAPTCHA) — узким отдельным cyber-промтом; креды только в env. `npm run tools:trufflehog`
  **ненадёжен при недоступном инструменте через `npx`** (BL-001) — перепроверять реальным
  TruffleHog, не доверять голому «чисто» от репо-скрипта.
- Services не коммитят транзакции — route/handler владеет lifecycle.
- Stop-hook relay (нет CHANGES/CHANGELOG): (a) fix-commit / (b) bundle в next commit [default] /
  (c) defer to closure.
- **Не добавлять** фейковые триггеры / keyword-stuffing — активный минус для доверия/SEO.

## Субагенты

Для крупных арок разрешена декомпозиция на параллельные субагенты/workflow-оркестрацию — с
осторожностью на общем git-состоянии (параллельные коммиты в одну ветку не гонять одновременно).

## Что НЕ трогать

- Тест-инфраструктура — как только появится, будет load-bearing; сейчас её просто нет (см. выше).
- Границы FSD-слоёв. Живые формы/Bitrix, CSP, аналитика — только через PROTECTED-процедуру
  (`CLAUDE.md` → «Working conventions»).
- Tailwind оставляем (дизайн-система на нём). Секреты — только env (публичный репо).
