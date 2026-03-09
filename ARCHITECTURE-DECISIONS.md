# Архитектурные решения NeuroHub MVP

Дата: 2026-01-18

## Контекст

При анализе MVP.md были выявлены несоответствия между функциональной спецификацией и текущей конфигурацией проекта. Данный документ фиксирует принятые архитектурные решения для MVP версии.

## Принятые решения

### 1. Архитектура: Монолит вместо микросервисов

**Решение:** Использовать монолитную архитектуру на базе Next.js для MVP.

**Обоснование:**
- Быстрая разработка и итерация на начальном этапе
- Упрощённое развёртывание и отладка
- Меньше операционных сложностей
- Feature-based структура кода позволит выделить микросервисы в будущем при необходимости

**Компромисс:** При масштабировании до 50K+ DAU может потребоваться рефакторинг в микросервисы.

### 2. API: RESTful вместо tRPC

**Решение:** Использовать RESTful API Routes с OpenAPI/Swagger документацией.

**Обоснование:**
- Стандартизированный подход, понятный широкой аудитории разработчиков
- Автоматическая документация через Swagger UI
- Возможность интеграции с внешними системами без TypeScript
- Соответствие требованиям MVP.md

**Технологии:**
- `next-swagger-doc` для генерации OpenAPI спецификации
- `swagger-ui-react` для интерактивной документации
- Zod для валидации схем

### 3. База данных: PostgreSQL без Elasticsearch и Redis

**Решение:** Использовать только PostgreSQL 16 для MVP.

**Обоснование:**
- PostgreSQL обеспечивает полнотекстовый поиск через GIN-индексы и tsvector
- Для MVP нагрузка не требует отдельного поискового движка
- Упрощение инфраструктуры и снижение операционных затрат
- Redis может быть добавлен позже для кэширования при необходимости

**Инструменты:**
- Knex.js для query building и миграций
- Connection pooling для оптимизации производительности

### 4. State Management: Effector

**Решение:** Использовать Effector 23+ вместо Redux/Vuex.

**Обоснование:**
- Reactive state manager с отличной TypeScript поддержкой
- Меньше boilerplate кода по сравнению с Redux
- Встроенная поддержка эффектов и событий
- Хорошо интегрируется с React Server Components

### 5. Аутентификация: Better Auth

**Решение:** Better Auth с cookie-based сессиями вместо чистых JWT.

**Обоснование:**
- Встроенная защита от CSRF и timing attacks
- Поддержка OAuth провайдеров (GitHub, Google) из коробки
- Session management с автоматической ротацией
- Более безопасный подход для веб-приложений по сравнению с JWT в localStorage

### 6. UI Framework: shadcn/ui + Tailwind CSS ~~(Material UI + Emotion)~~

> **Superseded (2026-03):** Мигрировали с Material UI 7.3+ + Emotion на shadcn/ui + Tailwind CSS 4. Причины: лучший контроль над стилями, отсутствие runtime CSS-in-JS, нативная совместимость с RSC, меньший bundle.

**Решение:** shadcn/ui (Radix UI primitives) + Tailwind CSS 4 для стилизации.

**Обоснование:**
- Полный контроль над кодом компонентов (copy-paste модель)
- Zero runtime — Tailwind генерирует статический CSS
- Нативная поддержка React Server Components
- Radix UI обеспечивает accessibility из коробки
- Меньший bundle size и лучшая производительность

### 7. Build Configuration: Без кастомного webpack config

**Решение:** Использовать дефолтную конфигурацию Next.js без кастомизации webpack.

**Обоснование:**
- Next.js 16+ активно мигрирует на Turbopack, кастомный webpack config создает конфликты
- SVGR loader и extensionAlias не используются в проекте (нет SVG файлов)
- Упрощение конфигурации и совместимость с будущими версиями Next.js
- Избегаем ошибок билда типа "This build is using Turbopack, with a webpack config and no turbopack config"

**Дата решения:** 2026-01-20

### 8. API Documentation: Scalar вместо Swagger UI

**Решение:** Использовать `@scalar/nextjs-api-reference` для API документации.

**Обоснование:**
- Нативная поддержка Next.js 16 и React 19 без хаков
- Современный UI с built-in dark mode
- Производительность: ~500ms загрузка vs ~1.5s у Swagger UI
- Меньший bundle size: ~200KB vs ~400KB
- Full-text search по endpoints
- Request history и persistent authentication
- Multiple code examples (cURL, JS, Python, C#)
- Полная поддержка OpenAPI 3.1
- Рекомендован Microsoft для .NET 9 проектов

**Проблемы Swagger UI (устранены миграцией):**
- React Class Components несовместимы с Next.js Server Components
- Требовал `'use client'` directive и `dynamic import` с `ssr: false`
- Предупреждения `UNSAFE_componentWillReceiveProps` в React 19
- Устаревший UI и медленная загрузка
- Ограниченная поддержка OpenAPI 3.1

**Дата решения:** 2026-01-22

### 9. Query Builder: Kysely для запросов, Knex для миграций

**Решение:** Разделить ответственность между Kysely и Knex.js с единым connection pool.

**Обоснование:**
- Kysely обеспечивает полную type-safety для всех SQL запросов в runtime
- Автоматическая генерация TypeScript типов из схемы БД (`kysely-codegen`)
- Better Auth использует Kysely внутри, но требует pg.Pool на входе
- Knex.js остается только для миграций БД (проверенный, стабильный инструмент)
- Единый shared connection pool для всего приложения (эффективное использование ресурсов)

**Архитектура:**

```zsh
Shared pg.Pool (src/lib/db/pool.ts)
    ├── Better Auth → создает внутренний Kysely
    ├── Kysely (src/lib/db/kysely.ts) → для запросов приложения
    └── Knex (только для миграций)
```

**Реализация:**
- `pool` - единый pg.Pool для всех подключений к БД
- `kysely` - используется для всех SELECT/INSERT/UPDATE/DELETE в коде приложения
- `knex` - используется только для `yarn db:migrate` команд
- Better Auth получает `pool` и создает свой внутренний Kysely
- TypeScript типы генерируются через `yarn db:generate-types`

**Преимущества:**
- Один connection pool = эффективное использование соединений
- Better Auth и приложение не конкурируют за подключения
- Type-safety сохраняется для всех запросов

**Компромисс:** Необходимо поддерживать два инструмента, но это минимальная цена за type-safety и совместимость с Better Auth.

**Дата решения:** 2026-01-22

### 10. API Документация: Комбинированный подход для Better Auth

**Решение:** Документировать только основные Better Auth endpoints вручную в Swagger/Scalar.

**Проблема:**
Better Auth использует catch-all route `/api/auth/[...all]` который обрабатывает все endpoints через одну функцию. Невозможно добавить JSDoc для каждого endpoint'а отдельно.

**Обоснование:**
- Better Auth имеет собственную документацию для всех endpoints
- Полное дублирование всех endpoints (20+) создаст большой overhead
- Пользователи чаще всего используют базовые auth операции
- Остальные endpoints (OAuth callbacks, password reset) используются реже

**Реализация:**
Документируем вручную в `src/lib/swagger/config.ts` только 4 основных endpoint'а:
- `POST /api/auth/sign-up/email` - регистрация пользователя
- `POST /api/auth/sign-in/email` - вход в систему
- `POST /api/auth/sign-out` - выход из системы
- `GET /api/auth/get-session` - получение текущей сессии

**Для остальных Better Auth endpoints:**
Пользователи могут обратиться к официальной документации [Better Auth](https://www.better-auth.com/docs)

**Дата решения:** 2026-01-22

### 11. Email Сервис: Resend + React Email

**Решение:** Использовать Resend для отправки email и React Email для создания шаблонов.

**Проблема:**
Необходимо отправлять транзакционные письма (верификация email, сброс пароля) с красивым и responsive дизайном.

**Обоснование:**
- **Resend:**
  - Официально рекомендован в документации Better Auth
  - Простое API, нативная интеграция с Next.js
  - Щедрый free tier (3000 писем/месяц)
  - Отличная документация и TypeScript типы
- **React Email:**
  - Создание email шаблонов как React компонентов
  - Автоматическая генерация HTML для всех email клиентов
  - Компоненты оптимизированы для Gmail, Outlook, Apple Mail
  - Поддержка Tailwind CSS для стилей

**Реализация:**
1. **Email клиент** (`src/lib/email/index.ts`):
   - Инициализация Resend с API ключом
   - Централизованная конфигурация (from, replyTo)
2. **Email шаблоны** (`src/lib/email/templates/`):
   - `verification-email.tsx` - верификация email
   - Будущие шаблоны: password reset, notifications
3. **Интеграция с Better Auth** (`src/lib/auth/config.ts`):
   - `emailVerification.sendVerificationEmail` - отправка при регистрации
   - `emailAndPassword.sendResetPassword` - восстановление пароля
   - `requireEmailVerification: true` - принудительная верификация

**Конфигурация:**

```env
RESEND_API_KEY=re_xxx
EMAIL_FROM=NeuroHub <onboarding@neurohub.dev>
EMAIL_REPLY_TO=support@neurohub.dev
```

**Дата решения:** 2026-01-22

### 12. ~~Material UI Link + Next.js Link: Глобальная интеграция через Theme~~

> **Superseded (2026-03):** После миграции на shadcn/ui + Tailwind CSS данный ADR утратил актуальность. Навигационные ссылки реализуются через `<Link>` из `next/link` напрямую, стилизованный через Tailwind или компонент `ui/link.tsx`.

**Дата решения:** 2026-01-24

### 13. Railway PostgreSQL: SSL с отключением проверки сертификатов

**Решение:** Отключить проверку SSL сертификатов для Railway PostgreSQL подключений.

**Проблема:**
Railway использует самоподписанные SSL сертификаты, что вызывает ошибку:

```zsh
Error: self-signed certificate in certificate chain
code: 'SELF_SIGNED_CERT_IN_CHAIN'
```

**Рассмотренные варианты:**
1. `sslmode=verify-full` - полная проверка сертификатов ❌ (не работает с Railway)
2. `sslmode=require` - текущая версия pg трактует как `verify-full` ❌
3. `uselibpqcompat=true&sslmode=require` - флаг совместимости (сложно)
4. **Отключить проверку в коде через `ssl: { rejectUnauthorized: false }`** ✅ (выбрано)

**Обоснование выбранного решения:**
- SSL соединение остается активным (трафик зашифрован)
- Автоматическое определение Railway по домену `railway.app` в URL
- Не требует изменения connection string
- Работает как для pg.Pool, так и для Knex миграций
- Безопасно для Railway, так как это managed database сервис

**Безопасность:**
- ✅ Соединение остается зашифрованным через SSL/TLS
- ✅ Подходит для managed services (Railway, Heroku, Render)
- ⚠️  Не проверяет подлинность сертификата (приемлемо для managed DB)
- ✅ Защита от MITM на уровне Railway infrastructure

**Альтернатива для production:**
При необходимости строгой проверки сертификатов (self-hosted PostgreSQL):

```typescript
ssl: {
  rejectUnauthorized: true,
  ca: fs.readFileSync('/path/to/ca-cert.pem').toString(),
}
```

**Дата решения:** 2026-01-25

### 14. Better Auth Hooks: использование ctx.context.returned вместо newSession

**Решение:** Использовать `ctx.context.returned` для получения данных пользователя в `after` hook при sign-up.

**Проблема:**
При включенной email верификации (`emailVerification: { sendOnSignUp: true }`) Better Auth не создает сессию сразу при регистрации. Пользователь должен сначала подтвердить email, и только потом создается сессия.

**Тестирование показало:**

```zsh
newSession: false  ← не доступен при sendOnSignUp: true
returned: true     ← содержит данные созданного пользователя
```

**Обоснование:**
- `ctx.context.newSession` доступен только когда сессия создается сразу (без email verification)
- `ctx.context.returned` содержит результат выполнения endpoint (данные пользователя, token)
- При email verification сессия создается позже через отдельный endpoint после подтверждения
- Для создания связанных записей (user_profiles) нужен только user.id, а не полная сессия

**Реализация:**

```typescript
hooks: {
  after: createAuthMiddleware(async (ctx) => {
    if (ctx.path === '/sign-up/email' && ctx.context.returned) {
      const returned = ctx.context.returned as BetterAuthSignUpReturned
      const userId = returned.user.id
      // Создаем user_profile используя userId
    }
  }),
}
```

**Важно:** Документация Better Auth рекомендует использовать `newSession`, но это работает только при `sendOnSignUp: false`. При включенной email verification приходится использовать `ctx.context.returned` (ну это предположение, не из документации!).

**Дата решения:** 2026-01-28

### 15. Database Schema: Nanoid вместо UUID

**Решение:** Использовать TEXT колонки с Nanoid для всех ID вместо UUID.

**Проблема:**
Better Auth по умолчанию генерирует Nanoid для ID пользователей, но наши миграции создавали таблицы с UUID колонками и `gen_random_uuid()` defaults.

**Причины перехода на Nanoid:**
- Better Auth использует Nanoid при `generateId: true` (рекомендованный подход)
- Nanoid короче UUID (21 символ vs 36), URL-friendly
- Лучшая производительность генерации (~60% быстрее UUID v4)
- Collision resistance сопоставим с UUID (1% вероятность за миллион лет при 1000 ID/час)

**Реализация:**
1. Удалены все UUID-based миграции
2. Better Auth CLI создал core таблицы (`users`, `sessions`, `accounts`, `verifications`) с TEXT ID
3. Созданы новые миграции для кастомных таблиц (`user_profiles`, `skills`, `user_skills`) с TEXT ID
4. В Better Auth config установлен `generateId: true`
5. В hook для создания профиля используется `nanoid()` для генерации profile.id

**Конфигурация Better Auth:**

```typescript
advanced: {
  generateId: true,  // Better Auth генерирует Nanoid для всех ID
}

user: {
  modelName: 'users',  // Plural table names
}

session: {
  modelName: 'sessions',
}
```

**Важные настройки:**
- `modelName` конфигурация необходима так как Better Auth по умолчанию использует singular names (`user`, `session`), а PostgreSQL best practices рекомендуют plural (`users`, `sessions`)
- Все foreign key constraints обновлены для работы с TEXT вместо UUID
- Seeds обновлены для генерации Nanoid в тестовых данных

**Дата решения:** 2026-01-28

### 16. Database Schema (Update): Mixed IDs вместо “Nanoid для всех”

**Решение:** Уточняем решение из пункта 15.  
Оставляем **TEXT/Nanoid** только там, где это диктует Better Auth (core auth tables), но вводим **UUID** для доменных сущностей продукта.

- **Auth/Core (Better Auth):** `users.id` и core таблицы Better Auth (`sessions`, `accounts`, `verifications`) остаются **TEXT (opaque string IDs)**.
- **Domain (наши сущности):** новые доменные таблицы используют **UUID primary key** (например: `freelancer_profiles.id`, `portfolio_items.id`, `projects.id`, `orders.id`, `reviews.id`).
- Все связи доменных сущностей на пользователя делаем через `user_id: TEXT` (FK → `users.id`).

**Почему меняем подход (почему “Nanoid для всех” больше не подходит):**
- Better Auth действительно проще оставить на TEXT IDs (он генерирует ID до БД, и это уже работает у нас).
- Но для доменных сущностей UUID дают стандартность и совместимость:
  - стабильные публичные URL доменных ресурсов (не завязываемся на auth-id в URL)
  - проще внешние интеграции/экспорт/аналитика
  - единый формат идентификаторов для ресурсов продукта (портфолио/профиль/проекты/и т.д.)

**Роутинг/публичные идентификаторы:**
- Публичные страницы доменных ресурсов используют **domain UUID**:
  - `/freelancers/[profileId]`, где `profileId = freelancer_profiles.id (UUID)`

**Связи доменных сущностей (важно):**
- `portfolio_items` привязываем к профилю фрилансера через `portfolio_items.freelancer_profile_id (UUID FK → freelancer_profiles.id)`.
- Ownership проверяем через `freelancer_profiles.user_id (TEXT FK → users.id)`, а не через `portfolio_items.user_id`.

**Правило миграций (чтобы не было дрейфа схемы):**
- Применённые миграции считаем **immutable**: не редактируем “задним числом”.
- Любые изменения схемы делаем **новой** миграцией.

**Owned-by-user таблицы:**
- `user_profiles` считаем **owned-by-user (1:1)**:
  - идентификатор ресурса — `user_id`
  - `user_profiles.id` не используем как публичный идентификатор (в API/URL)
  - API профиля пользователя остаётся `GET/PUT /api/user/profile` (по сессии)

**Миграции/технический план перехода:**
1. **Мигрировать `skills.id` → UUID**, потому что `skills` — доменная сущность/справочник:
    - создать новый UUID для каждой строки `skills`
    - обновить ссылки `user_skills.skill_id` по маппингу старый id → новый UUID
    - обновить seed `001_skills.ts`, чтобы больше не генерировал `nanoid()`
2. Обновить Zod валидации и swagger примеры под mixed IDs:
    - `userId` (auth) — string (TEXT), **не UUID**
    - `skillId/profileId/itemId/...` (domain) — UUID
3. Обновить Kysely types (`yarn db:generate-types`) после миграций.

**Компромисс:**
- В системе будут два типа ID (auth string vs domain UUID). Это требует дисциплины в API/валидациях и явных соглашений.

**Дата решения:** 2026-02-11

### 17. CLI Utilities: Centralized Approach

**Решение:** Создать централизованную библиотеку CLI утилит в `scripts/utils/cli-utils.ts`.

**Обоснование:**
- Единообразный UX во всех database utility скриптах
- Централизованная стилизация (цвета, символы, форматирование)
- Отсутствие прямых вызовов console.log и chalk в скриптах
- Упрощение поддержки и изменения визуального стиля

**Документация:** `.cursor/rules/db-scripts/RULE.md`

**Компромисс:** Требует импорта утилит, но это компенсируется единообразием и читаемостью.

**Дата решения:** 2026-01-30

### 18. Development Playground

**Решение:** Создать `/playground` роут для демонстрации UI компонентов.

**Обоснование:**
- Быстрое тестирование компонентов в изоляции
- Демонстрация различных состояний и вариантов
- Документация через примеры использования
- Доступен только в development mode
- Автоматически отключен в production через middleware

**Структура:**

```zsh
src/app/playground/
  ├── page.tsx          - главная страница с табами
  ├── demo-alerts.tsx   - демо Alert system
  ├── demo-buttons.tsx  - демо Button component
  └── demo-icons.tsx    - демо Icon component
```

**Безопасность:**
- Middleware проверяет `process.env.NODE_ENV !== 'production'`
- В production возвращает 404
- Не индексируется поисковыми системами

**Дата решения:** 2026-02-06

## Технологический стек MVP

### Frontend
- Next.js 16+ (App Router) + React 19
- TypeScript 5.9+ (strict mode)
- shadcn/ui (Radix UI) + Tailwind CSS 4
- Effector 23+ для state management

### Backend
- Node.js 24 LTS
- Next.js API Routes (RESTful)
- PostgreSQL 16 + Kysely 0.28+ (queries) + Knex.js 3+ (migrations)
- Better Auth 1+ (с pg.Pool adapter)

### DevOps
- Docker Compose для локальной разработки
- Vercel для хостинга (frontend + API)
- Railway для PostgreSQL
- Cloudflare CDN для статики
- GitHub Actions для CI/CD

## Миграционный путь

При необходимости масштабирования в будущем:

1. **Микросервисы**: Feature-based структура позволяет выделить модули в отдельные сервисы
2. **Кэширование**: Добавить Redis для session storage и rate limiting
3. **Поиск**: Интегрировать Elasticsearch для advanced search capabilities
4. **Очереди**: Добавить BullMQ для фоновых задач (email, notifications)

## Выполненные задачи

1. ✅ Создана базовая структура API endpoints
2. ✅ Настроена Scalar документация (вместо Swagger)
3. ✅ Реализованы базовые миграции БД
4. ✅ Настроен Better Auth с полной интеграцией
5. ✅ Интегрирован Kysely для type-safe запросов
6. ✅ Автоматизация Railway PostgreSQL (GitHub Actions + скрипты миграции)

## Следующие шаги

1. ✅ Верификация email завершена (Этап 1.3)
2. ✅ UI компоненты для регистрации/входа реализованы
3. ✅ Профили пользователей созданы
4. ✅ Система навыков реализована
5. Реализовать профиль фрилансера (Этап 3)
6. Создать систему проектов (Этап 4)
