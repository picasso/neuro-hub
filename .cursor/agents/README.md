# Agents Guide

Краткая памятка по агентам в `@.cursor/agents`.

## Основные роли

### `code-reviewer`

Широкий readonly-reviewer для:

- security
- performance
- maintainability
- project frontend conventions

Использовать, когда нужно проверить изменения и получить findings по важности.

Примеры:

- `Запусти code-reviewer и проверь @src/features/auth/login-modal.tsx`
- `Пусть code-reviewer проверит, нет ли нарушений Effector и @/ui wrappers`

### `frontend-advocate`

Узкий агент для review + refactor под конвенции проекта.

Он особенно полезен, когда нужно:

- заменить ручную форму на `TextField` и другие компоненты из `@/ui`
- заменить `space-y-*` / `space-x-*` на `gap-*` или `Stack`
- вынести бизнес-логику из `useEffect` и локального state в Effector
- привести импорты к `@/ui`, `@/features`, `@/features/server`

Примеры:

- `Запусти frontend-advocate для @src/features/auth/login-modal.tsx и замени ручные поля на TextField`
- `Проверь @src/features/playground на legacy Tailwind patterns и исправь их`
- `Приведи компонент к правилам develop.mdc: Effector вместо useEffect, Stack/gap вместо space-y`

### `fullstack-dev`

Агент для полноценной реализации фичи от данных и API до UI.

Он полезен, когда нужно:

- реализовать feature end-to-end
- добавить route handlers, Zod validation, DB access и UI в одном заходе
- собрать новую функциональность по project rules, а не только почистить конвенции

Примеры:

- `Запусти fullstack-dev и реализуй новый flow онбординга с App Router API и UI`
- `Пусть fullstack-dev добавит CRUD с Kysely, Zod и feature components`

### `system-analyst`

Readonly-агент для обсуждения задач по проекту до начала реализации.

Он особенно полезен, когда нужно:

- уточнить требования, ограничения и границы задачи
- разложить большую задачу на этапы и зависимости
- сравнить 2-3 подхода и понять trade-offs
- подготовить качественные task briefs для других агентов
- понять, кого запускать следующим: `fullstack-dev`, `frontend-advocate`, `api-gateway`, `test-engineer`, `code-reviewer`

Примеры:

- `Запусти system-analyst для новой фичи онбординга и предложи варианты реализации под наш стек`
- `Пусть system-analyst декомпозирует задачу на этапы и подготовит briefs для fullstack-dev и test-engineer`
- `Запусти system-analyst и сравни подходы: Server Actions vs API routes для этого flow`

### `test-engineer`

Агент для тест-плана и тестового покрытия под риски проекта.

Он полезен, когда нужно:

- добавить или пересобрать тесты для Better Auth, Effector и UI wrappers
- проверить риски после миграции на `TS`, `TextField`, `Stack`
- получить coverage plan по новым фичам или спорным refactor-изменениям

Примеры:

- `Запусти test-engineer для @src/features/auth и составь план регрессионных тестов`
- `Пусть test-engineer добавит тесты после миграции login modal на TS wrappers`

### `cursor-expert`

Readonly-агент для вопросов по Cursor IDE, prompt-стратегии и workflow внутри этого репозитория.

Он полезен, когда нужно:

- понять, как лучше формулировать задачи агентам
- подобрать правильный режим работы: plan, review, refactor
- улучшить workflow с `@file`, `@folder`, `frontend-advocate`, `code-reviewer`

### `api-gateway`

Агент для проектирования public/internal API под App Router, Better Auth, Zod и rate limiting.

Он полезен, когда нужно:

- спроектировать `src/app/api/**/route.ts`
- продумать public API с versioning и rate limiting
- описать auth/authorization/error handling для API слоя

### `mcp-builder`

Агент для проектирования MCP servers, tools и resources под текущие project MCP conventions.

Он полезен, когда нужно:

- добавить MCP server для внешнего сервиса
- спроектировать tool/resource contracts
- оформить descriptors, integration notes и usage examples

## Когда запускать вместе

Запускай обоих, если нужна двойная проверка:

- `code-reviewer` ищет риски, регрессии и архитектурные проблемы
- `frontend-advocate` сразу нормализует код под принятые паттерны

Пример:

- `Запусти параллельно code-reviewer и frontend-advocate для @src/features/auth`

Ещё полезные связки:

- `system-analyst` -> сначала уточняет задачу, варианты и план, затем передаёт реализацию в `fullstack-dev`
- `system-analyst` -> сначала декомпозирует API/UI/данные, затем подготавливает briefs для `api-gateway`, `fullstack-dev`, `test-engineer`
- `system-analyst` + `code-reviewer` -> сначала дизайн решения, затем проверка рисков выбранного подхода

## Как ставить задачу хорошо

Лучший формат запроса:

- укажи `@file` или `@folder`
- скажи, нужен review, refactor или и то и другое
- перечисли целевые правила
- если задача большая или неоднозначная, сначала запусти `system-analyst`

Пример:

- `Запусти frontend-advocate для @src/features/auth/login-modal.tsx. Нужен refactor: TextField вместо Label+Input, gap/Stack вместо space-y, без изменения поведения.`
- `Запусти fullstack-dev для @src/app/api/profile и @src/features/profile. Нужна новая feature с Zod, Better Auth и @/ui wrappers.`
- `Запусти test-engineer для @src/features/auth/login-modal.tsx и оцени регрессионные риски после wrapper-миграции.`
- `Запусти system-analyst для @src/features/auth и @src/app/api/auth. Нужно обсудить новый auth flow, варианты и task briefs для следующих агентов.`

## Prompt-подходы для `system-analyst`

### 1. Архитектура фичи

- `Запусти system-analyst для задачи: нужно спроектировать [feature]. Контекст: [что хочет пользователь / бизнес]. Ограничения: Next.js 16, App Router, Effector, Better Auth, Zod, Kysely, @/ui. Хочу варианты решения, trade-offs, рекомендуемый подход, план работ и task briefs для fullstack-dev и test-engineer.`

### 2. Декомпозиция большой задачи

- `Запусти system-analyst и декомпозируй задачу: [описание]. Нужно разбить на этапы, зависимости и риски. Отдельно скажи, что можно делать параллельно, что критично сделать сначала и каких агентов запускать на каждом этапе.`

### 3. Подготовка постановки для другого агента

- `Запусти system-analyst для подготовки task brief. Цель: [что нужно получить]. Целевой агент: fullstack-dev / frontend-advocate / api-gateway. Файлы или зоны: @src/... Нужно сформулировать короткий, но точный prompt с учётом project rules.`

### 4. Сравнение двух подходов

- `Запусти system-analyst. Нужно сравнить 2 подхода для [задача]: 1. [вариант A] 2. [вариант B]. Оцени по сложности внедрения, соответствию текущей архитектуре, рискам регрессий, удобству поддержки и что лучше для neuro-hub.`

### 5. Анализ перед refactor

- `Запусти system-analyst для refactor-задачи: [описание]. Посмотри на @src/... и предложи границы refactor, что не стоит трогать, возможные побочные эффекты и task briefs для frontend-advocate и code-reviewer.`

### 6. Проработка API + UI вместе

- `Запусти system-analyst для новой фичи: [название]. Нужно продумать модель данных, API / server actions, UI flow, валидацию, auth / permissions и тестовый контур. В конце дай task briefs отдельно для api-gateway, fullstack-dev, test-engineer.`

### 7. Быстрый discovery по идее

- `Запусти system-analyst. Идея: [сырая идея]. Помоги превратить её в реализуемую задачу для этого репозитория. Хочу получить уточнённую формулировку, assumptions, non-goals, recommended scope для первой итерации и кого запускать дальше.`

### “Золотой” универсальный prompt

- `Запусти system-analyst для задачи: [описание]. Контекст: [бизнес-цель / user flow / проблема]. Зона изменений: @file или @folder. Ограничения: [что нельзя ломать / что важно сохранить]. Нужны: 1) уточнение требований и assumptions, 2) 1-3 реалистичных варианта решения под стек проекта, 3) recommendation с аргументацией, 4) пошаговый план работ, 5) риски и зависимости, 6) ready-to-use task briefs для следующих агентов. Учитывай Next.js App Router, Effector, Better Auth, Zod, Kysely, Tailwind 4, @/ui wrappers и project rules.`

## Базовые правила для frontend задач

- сначала переиспользовать существующие компоненты из `@/ui`
- не импортировать `@/ui/shadcn/*` в app/features коде
- использовать Effector для бизнес-логики
- использовать `gap-*` или `Stack` для layout-паттернов вместо legacy spacing utilities
- Tailwind 4-конвенции смотреть в `@.cursor/rules/tailwind4.mdc`
- не изобретать новый wrapper, если подходящий уже есть
- писать репорты на русском языке, оставляя английский для кода, путей, API и устоявшихся technical terms

## Жёсткое правило для `Stack`

В `src/app` и `src/features` типовые контейнеры на `div` с `flex` нужно заменять на `Stack`.

Если layout совпадает с дефолтами `Stack`, нужно использовать краткую форму без лишних пропсов.

Дефолты `Stack`:

- `direction="row"`
- `gap={2}`
- `align="center"`
- `justify="flex-start"`

Хорошо:

- `<Stack>...</Stack>`
- `<Stack vertical gap={5}>...</Stack>`

Плохо:

- `<div className="flex items-center gap-2">...</div>`
- `<Stack direction="row" gap={2}>...</Stack>`
