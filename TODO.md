# Планы на будущее

## Перейти с Jest на Vitest

| Критерий          | Vitest                                                                                 | Jest                                                                                 |
| ----------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Год появления     | 2022                                                                                   | 2014                                                                                 |
| Автор             | команда Vite (VoidZero)                                                                | Meta (Facebook)                                                                      |
| Скорость          | ⚡ Очень быстрый                                                                        | 🐢 Медленнее                                                                         |
| ESM support       | ✅ native                                                                               | ⚠️ ограниченный / сложный                                                            |
| TypeScript        | ✅ из коробки                                                                           | ⚠️ через babel / ts-jest                                                             |
| Vite support      | ✅ идеально                                                                             | ❌ официально не поддерживается ([jestjs.io](https://jestjs.io/docs/getting-started)) |
| API совместимость | ✅ Jest-compatible                                                                      | —                                                                                    |
| Watch mode        | ⚡ мгновенный (через Vite graph) ([vitest.dev](https://vitest.dev/guide/features.html)) | обычный                                                                              |
| DOM environments  | happy-dom, jsdom                                                                       | jsdom                                                                                |
| Mocking           | vi.fn() (аналог jest.fn())                                                             | jest.fn()                                                                            |
| Coverage          | v8 или istanbul ([vitest.dev](https://vitest.dev/guide/features.html))                 | istanbul                                                                             |
| Ecosystem         | пока меньше                                                                            | огромный                                                                             |
| UI для тестов     | встроенный                                                                             | сторонние                                                                            |

### Когда использовать Vitest

Используй Vitest если:
- используешь Vite
- используешь ESM
- используешь TypeScript
- нужен быстрый watch mode
- новый проект
- 👉 лучший выбор для modern frontend
- React, Vue, Svelte, Node ESM

## Сделать анализ Playwright vs Chrome DevTools

- Playwright: latest (e2e testing)

## Добавить в стэк TanStack Query: v5

|                  | TanStack Query              | Kysely                           |
| ---------------- | --------------------------- | -------------------------------- |
| Тип              | Server state manager        | SQL query builder                |
| Где используется | Frontend (React, Vue, etc.) | Backend (Node.js, Bun, Deno)     |
| Работает с       | API responses               | SQL databases                    |
| Основная задача  | Fetch, cache, sync data     | Build and execute SQL queries    |
| Уровень          | Client / API layer          | Database layer                   |
| Альтернатива     | SWR, Apollo Client          | Knex, Drizzle, Prisma (частично) |

### Что такое TanStack Query

TanStack Query — библиотека для:
- fetching данных из API
- caching
- sync server state
- background refetch
- mutations

Она делает это автоматически через hooks.

```ts
const { data, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: () => fetch('/api/users').then(res => res.json())
})
```

Architecture:

React component
     ↓
TanStack Query
     ↓
HTTP API
     ↓
Backend

## Может убрать `htmlparser2`

**Bundlephobia** (htmlparser2@8.0.2):
Minified: ~39 KB
Gzipped: ~11 KB
В расчёт включены зависимости, которые подтягивает пакет (domhandler, domutils, dom-serializer). Мы используем только parseDocument и типы/хелперы из domhandler, но дерево-шейкинг в реальной сборке может убрать не всё.
Итог по сборке: ориентировочно +10–12 KB gzip в клиентском бандле для кода, где используется simpleMarkdown (например, text-styled, алерты).

Варианты дальше:
1. Оставить как есть — один парсер на SSR и клиенте, гидрация совпадает, цена — ~11 KB gzip.
2. Убрать htmlparser2 и вернуть ветку с document на клиенте + на сервере рендерить что-то стабильное (например, тот же HTML через dangerouslySetInnerHTML в одном контейнере или упрощённый вывод без парсинга), чтобы сервер и клиент давали один и тот же HTML и гидрация не падала.
3. Облегчённый парсер — рассмотреть что-то вроде htmlparser2-20kb (форк под браузер, <20 KB) и заменить им текущий htmlparser2, если он подходит по API.

## При желании заменить forwardRef (shadcn/v4)

`forwardRef` в обёртках `src/ui/`

В обёртках над shadcn используется `forwardRef`:
- src/ui/avatar.tsx
- src/ui/badge.tsx
- src/ui/icon-button.tsx
- src/ui/button.tsx
- src/ui/text-styled.tsx
- src/ui/alert.tsx
- src/ui/icon.tsx

В React 19 `ref` передаётся обычным пропом, `forwardRef` по-прежнему работает, но считается устаревшим. Для перехода на shadcn/v4 ничего менять не обязательно; при желании позже можно заменить на функции с пропом `ref`.

## Цвета в globals.css - миграция на OKLCH

В :root цвета заданы в `hex` (#1dbf73, #7c3aed и т.д.). В shadcn/v4 в доке рекомендуют `OKLCH` для точности, но `hex` поддерживается. Текущий вариант корректен, миграция на `OKLCH` — по желанию.

## Узнать побольше про

- TanStack Query: v5
- React Hook Form: v7
