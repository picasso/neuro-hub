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

## Исследовать переход на Yarn PnP

- После стабилизации Yarn 4 на Vercel провести отдельный этап исследования и оценить возможный переход с `nodeLinker: node-modules` на PnP
- Проверить совместимость Next.js, Vercel, Husky hooks, DB-скриптов, локального DX и IDE/tooling
- Если риски окажутся приемлемыми, подготовить отдельный план миграции без смешивания с текущей Yarn 4 стабилизацией

## Изучить и перейти на better-auth 1.5.*

- Изучить changelog и [blog 1.5](https://better-auth.com/blog/1-5): новый CLI (`npx auth` вместо `@better-auth/cli`), OAuth 2.1, i18n, изменения в миграциях
- Обновить зависимости, скрипты (`db:auth:migrate`, CI, deploy) и конфиг под 1.5
- Прогнать сценарии входа, 2FA, OAuth и миграции БД

## Изучить и перейти на ESLint 10

- Изучить [Migrate to ESLint 10.0.0](https://eslint.org/docs/latest/use/migrate-to-10.0.0): отказ от eslintrc, новый поиск конфига, Node ≥20.19
- Обновить конфиг (flat config), правила и пресеты (eslint-config-next и др.)
- Прогнать `yarn lint` и исправить возможные новые предупреждения

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

## Доработать collapsed sidebar submenu

Проблема:
- В account sidebar есть группы с вложенными пунктами без собственного `href` у родителя, например `Аккаунт` -> `Профиль`, `Портфолио`.
- В обычном wide-state это работает через `Collapsible`.
- В `collapsible="icon"` остается только иконка родителя, но по ней нельзя перейти, потому что у родителя нет ссылки.

Общая идея:
- Не пытаться использовать один и тот же `Collapsible` для обоих режимов.
- Для wide-state оставить текущий паттерн: `Collapsible` + `SidebarMenuSub`.
- Для collapsed icon-state переключать такие пункты на `DropdownMenu`/popover от иконки родителя.
- Это соответствует ожидаемому UX в shadcn sidebar: в узком режиме вложенность обычно раскрывается не inline, а через dropdown.

Варианты реализации:
1. Простой fallback: дать родителю `href` на landing page (`/account` или `/account/profile`).
2. Правильный UX: в collapsed state рендерить `DropdownMenu` со списком дочерних ссылок.
3. Ограничение по продукту: не разрешать icon-collapse для sidebar с группами без `href`.

Предпочтительный вариант:
- Вариант 2, потому что он сохраняет текущий дизайн, не требует фиктивного `href` и лучше работает в compact layout.

План доработок:
1. Обновить `src/ui/sidebar.tsx`, чтобы пункт с `items` умел рендериться по-разному в зависимости от состояния sidebar.
2. Получать `state` и `isMobile` через `useSidebar()`.
3. В `expanded` состоянии оставлять текущий `Collapsible`.
4. В `collapsed` desktop-состоянии рендерить `DropdownMenuTrigger` на `SidebarMenuButton` и выводить дочерние ссылки через `DropdownMenuContent`.
5. Для mobile оставить текущее поведение или проверить, нужен ли там отдельный сценарий.
6. Проверить active-state, keyboard navigation, hover/focus стили и позиционирование dropdown относительно узкого sidebar.

Что проверить после реализации:
- Клик по иконке родителя в collapsed state открывает дочерние ссылки.
- В wide-state вложенные пункты по-прежнему раскрываются inline.
- Не ломаются tooltip и collapse animation.
- Работают active/current route стили для дочерних пунктов.

## Сделать width-aware breadcrumb с `BreadcrumbEllipsis`

Проблема:
- Текущий паттерн с `BreadcrumbEllipsis` в shadcn - это в основном статичный demo, а не реальное auto-collapse по доступной ширине.
- Breakpoint-only подход (`sm/md/lg`) не учитывает фактическую ширину контейнера: breadcrumb может не влезать из-за sidebar, header actions или узкого layout даже на desktop.
- Для длинных путей нужен UX, где часть middle items автоматически схлопывается, а не просто обрезается весь путь целиком.

Общая идея:
- Построить обёртку над breadcrumb с `ResizeObserver`, которая следит за шириной контейнера.
- При нехватке места оставлять видимыми `root`, текущую страницу и по возможности ближайшего родителя.
- Средние элементы пути переносить под `BreadcrumbEllipsis` + `DropdownMenu`.
- Последний breadcrumb не убирать в dropdown, а при необходимости отдельно `truncate`, чтобы сохранялся текущий контекст.

Почему `ResizeObserver`, а не только breakpoints:
- Он реагирует на реальную ширину контейнера, а не только на размер окна.
- Это важно для layout-сценариев, где ширина меняется без `window.resize`: collapse sidebar, toolbar actions, split layout.
- Похожий паттерн используют mature libraries: React Spectrum и Cloudscape.

Референсы:
- shadcn/ui breadcrumb docs: https://ui.shadcn.com/docs/components/breadcrumb
- shadcn issue про "responsive" example: https://github.com/shadcn-ui/ui/issues/6331
- React Spectrum Breadcrumbs: https://react-spectrum.adobe.com/react-spectrum/Breadcrumbs.html
- Cloudscape Breadcrumb group: https://cloudscape.design/components/breadcrumb-group/?tabId=usage
- MUI discussion about width-aware collapse: https://github.com/mui/material-ui/issues/16614

Варианты реализации:
1. Простой: breakpoint-driven collapse без измерения DOM.
2. Гибридный: breakpoints + `truncate` current item + ручной collapse middle items.
3. Правильный UX: `ResizeObserver` + измерение ширины crumbs + автоматический overflow в `BreadcrumbEllipsis`.

Предпочтительный вариант:
- Вариант 3, потому что он учитывает реальную ширину контейнера и лучше работает в сложных header/sidebar layout.

План доработок:
1. Добавить отдельную обёртку, например `ResponsiveBreadcrumb`, поверх `src/ui/breadcrumb.tsx`.
2. Принять массив items с `label`, `href`, `current`.
3. Через `ResizeObserver` отслеживать ширину контейнера.
4. Через refs или measuring pass вычислять, какие элементы помещаются.
5. Оставлять `root` и tail-path видимыми, middle items складывать в dropdown.
6. Для последнего item включить `truncate` как fallback.
7. Проверить keyboard navigation, aria-labels и поведение dropdown на mobile.

Что проверить после реализации:
- Breadcrumb не переносится на вторую строку.
- При уменьшении ширины middle items схлопываются в `BreadcrumbEllipsis`.
- Текущая страница остаётся видимой и при необходимости корректно truncate-ится.
- Dropdown показывает скрытые ancestor items в правильном порядке.
- Изменение ширины sidebar/header корректно триггерит пересчёт без ручного resize окна.

## Продумать loading-state для cover image в login modal

- После отказа от `placeholder="blur"` в `src/features/auth/login-modal.tsx` решить, что показывать во время загрузки изображения.
- Варианты: gradient/skeleton overlay, нейтральный poster frame, shimmer placeholder.
- Проверить UX при медленной сети и при смене случайной картинки на повторном открытии модалки.

## Добавить картинки на страницу /login

- После логина если оказывается что емейл не подтвержден - мы переходим на страницу /login.
- Это страница сейчас совершенно пустая. Логи происходит через модальное окно
- нужно заполнить страницу каким-то полезным контентом... картинками? текстом?
