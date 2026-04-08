Работаем в репозитории `neuro-hub`.

Перед началом обязательно прочитай и учти:
- `@.cursor/plans/mvp-chat.md`

## Feature
Нужно реализовать MVP простого и надёжного чата `1-на-1`.

## Stack and constraints
- Next.js 16 App Router
- Better Auth
- Zod 4
- Kysely + Postgres
- Effector
- Tailwind 4
- UI только через `@/ui` wrappers
- thin route files
- бизнес-логика не в `page.tsx`
- соблюдать project rules по barrel imports, `use client`, alerts, proxy, security

## Decisions already made
- Realtime должен быть без polling
- Используем `Ably` как realtime transport
- `Ably` не считается запрещённым SaaS в этой задаче, потому что запрещены chat-SDK/platform вроде Stream
- `Postgres` — source of truth
- Сообщение проходит путь: `client -> API -> DB write -> server publish to Ably`
- Клиент не должен быть primary source of truth
- Клиентский direct publish в realtime не является базовой моделью MVP
- Пользователи берутся из существующей auth-схемы
- Отдельную chat-таблицу `users` не создавать
- `contextType` хранить как string union
- Текущий контекст: `project`
- Уникальность диалога: одна пара пользователей в рамках контекста
- Для той же пары пользователей в другом контексте может быть другой диалог
- Чат может начать только заказчик с фрилансером, который подал заявку на проект
- Если заявка отозвана, чат создать/открыть нельзя
- Если проект закрыт, чат создать нельзя
- Максимальная длина сообщения: `4000`
- Soft-delete сообщений в MVP не нужен
- Доступ к диалогу и его realtime-каналу есть только у участников
- `miskibin/chat-components` считать reference-only по умолчанию, не основным UI dependency
- Архивный `next14-chat-app` можно использовать только как reference по архитектурным идеям, не как шаблон структуры или кода

## Architectural direction
- `Route Handlers` для chat API и Ably token issuance
- Better Auth session validation на сервере
- Kysely query/use-case layer
- Ably token с narrow capabilities
- Server-side publish в Ably после успешной записи в БД
- Effector для conversations, active thread, unread, optimistic flow, realtime lifecycle
- UI через `src/features/chat/*` + `@/ui`

## Important business rules
- Диалог создаётся или переиспользуется в контексте `project`
- Участники: `customer` и `freelancer`
- Нужна серверная проверка eligibility:
  - текущий пользователь действительно заказчик проекта
  - целевой пользователь действительно фрилансер с заявкой на этот проект
  - заявка не отозвана
  - проект не закрыт
- Все membership/eligibility checks должны быть серверными

## What not to do
- Не использовать polling/refetch как основной realtime механизм
- Не добавлять отдельный Socket.IO server в MVP без явной причины
- Не копировать буквально код/структуру из reference repo
- Не импортировать из `@/ui/shadcn/*`
- Не создавать sub-barrels в feature folders
- Не хранить chat business state в основном в component-local state
- Не обходить Better Auth checks
- Не расширять scope до групповых чатов, attachments, typing, presence, soft-delete

## Expected output
Сначала коротко перечисли:
1. что именно ты собираешься сделать
2. какие файлы/области затронешь
3. какие решения считаешь зафиксированными

Только после этого переходи к реализации/проектированию в рамках своей роли.
