# Documents Registry — ZeroDolg

> Перечень основных документов проекта, версии и статус.
> Поддерживают Claude.ai (планировщик) и агент-исполнитель. Александр читает для контроля.
> Обновлён: 14.07.2026 (housekeeping-промт PROMPT_02 — размещение и факт-проверка методички)
> Прод: **zerodolg.ru** — live (Astro + Islands, с октября 2025).

## Реестр

| Документ | Путь / расположение | Версия | Кто ведёт | Статус | Обновлён |
|----------|---------------------|--------|-----------|--------|----------|
| PROJECT_KNOWLEDGE | `docs/PROJECT_KNOWLEDGE.md` | 1.1 | Claude.ai + Александр | Актуально (сверено с репо) | 14.07.2026 |
| Claude.ai Instructions | `docs/_planner/PROJECT_INSTRUCTIONS_CLAUDE_AI.md` (локально, **gitignored, не в публичном репо**) | 1.0 | Александр | Актуально | 14.07.2026 |
| ARCHITECTURE | `ARCHITECTURE.md` (repo root) | 1.1 | Claude.ai / Claude Code | Актуально (сверено с `package.json`/конфигами) | 14.07.2026 |
| CLAUDE.md | `CLAUDE.md` (repo root) | — | Claude Code | Актуально (единственный исполнитель) | 14.07.2026 |
| Claude Code Instructions | `docs/CLAUDE_CODE_INSTRUCTIONS.md` | 1.1 | Claude Code | Актуально (сверено с репо) | 14.07.2026 |
| CONTRIBUTING | `CONTRIBUTING.md` (repo root) | — | Claude Code | Актуально (заменяет устаревшую generic-версию) | 14.07.2026 |
| IMPLEMENTATION_PLAN | `docs/IMPLEMENTATION_PLAN.md` | 1.1 | Claude.ai | Актуально (потоки WS-0/1/2/3 + Backlog) | 14.07.2026 |
| DOCUMENTS_REGISTRY | `docs/DOCUMENTS_REGISTRY.md` (этот файл) | 1.1 | Claude.ai | Актуально | 14.07.2026 |
| HANDOFF | `docs/_planner/HANDOFF.md` (локально, **gitignored, не в публичном репо**) | — | Claude.ai | Per-session | 14.07.2026 |
| README (проекта) | repo root | — | rybkagreen | Требует обновления (env-раздел уже, чем `.env.example`; см. `ARCHITECTURE.md §3`) | — |
| Legacy docs archive | `docs.archive/` (локально, **gitignored, не в публичном репо**) | — | — | Deprecated, не поддерживается | 14.07.2026 |
| Аудит сайта (отчёт) | сессия/чат планировщика | — | Claude (Chrome-агент) | Актуально (14.07.2026) | 14.07.2026 |
| Дизайн-бриф (главная) | у планировщика/владельца, не в этом репозитории | 1.0 | Claude.ai | Актуально | 14.07.2026 |
| Смета | `Смета_ZeroDolg.xlsx`, у владельца, не в этом репозитории | — | Claude.ai | Актуально (разработка/техдолг/редизайн/корректировка/абонемент) | 14.07.2026 |
| ‹Договор + приложения› | у Александра | — | — | ‹заполнить› | — |

**Статусы:** Актуально · Требует обновления · Draft · Deprecated

## Правила версионирования

- **Major (X.0):** структурные изменения, новые разделы, смена методологии.
- **Minor (1.X):** дополнения, уточнения, новые записи (в т.ч. факт-проверка технических
  утверждений против репозитория, как в этом обновлении).
- Значимое изменение → поднять версию здесь + дату.
- HANDOFF не версионируется (перезаписывается) — фиксируется только дата.

## Кто с чем взаимодействует

- **Только Claude.ai + Александр (не в публичном репозитории):** `docs/_planner/` (Claude.ai
  Instructions, HANDOFF), промты, смета, дизайн-бриф.
- **Агент-исполнитель (в repo):** `CLAUDE.md`, `CONTRIBUTING.md`,
  `docs/CLAUDE_CODE_INSTRUCTIONS.md`.
- **Оба / shared (в repo):** `docs/IMPLEMENTATION_PLAN.md`, `ARCHITECTURE.md`,
  `docs/PROJECT_KNOWLEDGE.md`, README.

## Проверка актуальности

В начале сессии Claude.ai сверяет: стек/версии / git policy / locked decisions → пометить затронутое
«Требует обновления» → обновить (сразу, если критично, или в закрытие блока). Технические
утверждения (версии, наличие тест-раннера, CI-триггеры) сверять с фактическим репозиторием, не
только между собой — housekeeping-промт 14.07.2026 нашёл несколько случаев, где методичка и код
разошлись (см. `docs/IMPLEMENTATION_PLAN.md` → Backlog).
