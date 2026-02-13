# Audit playbook (reminder)

Этот документ — **шпаргалка для повторяемого аудита изменений** в репозитории `neuro-hub`.
Цель: быстро находить и исправлять типовые нарушения правил и логические несостыковки
(Effector / UI / API / Swagger / DB).

Если нужно максимально кратко — ориентируйся на правила:

- `.cursor/rules/code-style/RULE.md`
- `.cursor/rules/develop/RULE.md`
- `.cursor/rules/effector/RULE.md`

---

## 1) Старт аудита (быстрый прогон)

- **Статус изменений**: `git status`, `git diff`
- **Базовые проверки**:
  - `yarn -s type-check`
  - `yarn -s lint`
  - `yarn -s test`

Если упали из‑за версии Node в sandbox:
- убедись, что проектная версия соответствует `.nvmrc`
- в крайнем случае запускай команды через `fnm exec --using .nvmrc -- <cmd>`

---

## 2) Effector audit (model.ts / stores)

### 2.1 `sample({ ... })` — обязательно комментарий сверху

- **Что искать**: `sample({` без поясняющего комментария непосредственно над блоком.
- **Как править**: добавить короткий комментарий “что делает этот sample” (в 1 строку).

Примеры формулировок (хорошо):
- `// reset store when gate closes`
- `// trigger effect on submit`
- `// show progress alert when save starts`

### 2.2 `domain.createEffect(...)` — обязательно `name`

- **Что искать**: эффекты без `name` (анонимные units плохо логируются).
- **Как править**: использовать форму:

```ts
export const loadXFx = domain.createEffect<Input, Output, Error>({
  handler: async (params) => { ... },
  name: 'loadXFx',
})
```

### 2.3 `Gate` usage

- **Что проверить**:
  - Gate либо без payload, либо payload используется осознанно (и тестом/документацией это подтверждено).
  - Gate не должен “магически” подтягивать контекст — лучше явно передавать через события/`useEffect`.
- **Как править**:
  - если нужен `userId/profileId` — сделай событие `submitXxx(payload)` и вызывай его из компонента в `useEffect`.

### 2.4 Обновление форм: избегаем “зоопарка” событий

- **Что искать**: десятки событий вида `fieldChanged`.
- **Как править**: одно событие вида:

```ts
export const formUpdated = domain.createEvent<Partial<Form>>('formUpdated')
$form.on(formUpdated, (store, update) =>
  isEmpty(update) ? store : produce(store, (draft) => { ...set(draft, key, value) })
)
```

### 2.5 Alerts: `createAlertFx.props` — только для `sample -> fn`

- **Правило**:
  - `createAlertFx.props(...)` используется как “type-safe builder” **внутри** `sample({ fn })`
  - **не** оборачивать прямые вызовы `createAlertFx(...)` через `.props`
- **Как править**:
  - в `sample -> fn`: `fn: () => createAlertFx.props({...}), target: createAlertFx`
  - в handler эффекта: `createAlertFx({...})` или `createAlert(...)`

---

## 3) UI audit (React components)

### 3.1 Layout: `Stack` вместо `Box display:flex`

- **Что искать**: `Box sx={{ display: 'flex', ... }}` используемый для layout.
- **Как править**:
  - `row + gap + alignItems` → `Stack direction="row" spacing={...} alignItems="..."`
  - `column + gap` → `Stack spacing={...}`

### 3.2 React typing

- избегать `FC` (если это прописано в правилах проекта)
- не делать лишние `useMemo` там, где вычисление тривиальное

---

## 4) API audit (Next route handlers)

### 4.1 Ошибки: единый `errorResponse`

- **Что проверить**:
  - `catch` возвращает `errorResponse(error)` (а не “всегда 400”)
  - `throw new Error(...)` в handler’ах не должен превращать ожидаемые 400/403 в 500
- **Как править**:
  - если ошибка “клиентская”: кидать `ValidationError`/`ForbiddenError`/`UnauthorizedError`/`NotFoundError`
  - если ошибка “неожиданная”: пусть `errorResponse` вернёт 500

### 4.2 Swagger должен совпадать с реальностью

- **Что проверить**:
  - если парсим Zod’ом params/body/query → в swagger есть `400 Validation error`
  - если `requireAuth/requireRole` → в swagger есть `401/403`
  - если ресурс может отсутствовать → `404` описан корректно
  - если “нет ресурса” возвращаем `200 data: null` → swagger **не** должен обещать `404`

### 4.3 Валидация query/params

- **Что искать**: использование `context.params`/`searchParams` без Zod схемы.
- **Как править**:
  - params: `freelancerProfileIdParamSchema.parse(await context.params)`
  - query: `schema.parse(Object.fromEntries(searchParams.entries()))`

---

## 5) DB / IDs / migrations audit

### 5.1 ID strategy consistency

Сверяйся с ADR (`ARCHITECTURE-DECISIONS.md`) и текущей схемой:
- **Auth IDs** (Better Auth `users.id`) — opaque string (TEXT)
- **Domain IDs** (например `freelancer_profiles.id`, `skills.id`, `portfolio_items.id`) — UUID

Проверки:
- DTO/Swagger/валидации должны принимать/возвращать именно тот формат ID, который реально в БД.
- не допускать смешивания `user_id`/`profile_id` ownership логики:
  - ownership обычно проверяем через `freelancer_profiles.user_id`
  - связи доменных сущностей — через domain UUID (например `portfolio_items.freelancer_profile_id`)

### 5.2 Миграции должны быть “fresh-db friendly”

- **Что проверить**:
  - новая база (прогон миграций с нуля) создаёт **каноничную схему**, а не “потом поправим миграцией N+1”.
- **Как править**:
  - если нашёл ошибку в ранней миграции — исправь раннюю миграцию (чтобы fresh DB была корректной)
  - оставь защитную миграцию, если она нужна для уже развернутых БД

### 5.3 Seeds

- seed IDs должны быть **детерминированными** (если это принято для проекта)
- seed должен соответствовать текущим типам колонок (UUID vs TEXT)

---

## 6) Финальная проверка “готово”

- `yarn -s type-check && yarn -s lint && yarn -s test` — зелёные
- `git diff` — нет “случайных” правок форматирования и массовых рефакторингов без причины
- Swagger описывает реальные статусы/shape ответа
- Нет “тихих 500” из‑за `throw new Error(...)` там, где ожидается 400/403/404
