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

## Узнать побольше про

- TanStack Query: v5
- React Hook Form: v7
