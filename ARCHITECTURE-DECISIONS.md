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

### 6. UI Framework: Material UI + Emotion

**Решение:** Material UI 7.3+ с Emotion для стилизации.

**Обоснование:**
- Готовые компоненты высокого качества
- Адаптивный дизайн из коробки
- Хорошая документация и community support
- Emotion обеспечивает гибкость стилизации

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

### 12. Material UI Link + Next.js Link: Глобальная интеграция через Theme

**Решение:** Настроить глобальную интеграцию MUI Link с Next.js Link через конфигурацию темы.

**Проблема:**
- Material UI Link предоставляет стилизацию и MUI API (variants, colors, underline props)
- Next.js Link обеспечивает client-side navigation и prefetching
- Необходимо объединить функциональность обоих без дублирования кода

**Рассмотренные варианты:**
1. **Глобальная настройка через theme** (выбран) - настроить один раз, работает везде
2. Per-component LinkComponent - явно указывать на каждом компоненте
3. Кастомный компонент-обертка - дополнительная абстракция

**Обоснование выбранного решения:**
- Настраивается один раз в `theme.ts`, работает для всех MUI компонентов
- Все MUI Link и Button с href автоматически используют Next.js роутинг
- Чистый код без оберток `<NextLink><MuiLink></MuiLink></NextLink>`
- Можно использовать `<Link href="/path">` напрямую с MUI стилями
- Решает проблемы с TypeScript типами и ref forwarding

**Использование:**

```tsx
// До: NextLink обертка
<NextLink href="/" passHref>
  <MuiLink>Home</MuiLink>
</NextLink>

// После: чистый MUI Link с Next.js роутингом
<Link href="/" underline="hover" color="inherit">
  Home
</Link>

// Или Button с href
<Button href="/" variant="contained">
  Go Home
</Button>
```

**Преимущества:**
- ✅ Автоматический client-side navigation для всех MUI Link/Button
- ✅ Полная поддержка MUI API (variants, colors, underline, sx props)
- ✅ TypeScript type-safety с правильным ref forwarding
- ✅ Убрана необходимость в `@ts-expect-error` комментариях
- ✅ Удалены inline стили для навигационных ссылок
- ✅ Совместимо с Next.js 13+ (где Link не требует дочернего `<a>`)

**Источник решения:**
[Stack Overflow: Using Material UI Link with Next.js Link](https://stackoverflow.com/a/74419666)

**Дата решения:** 2026-01-24

## Технологический стек MVP

### Frontend
- Next.js 16+ (App Router) + React 19
- TypeScript 5.9+ (strict mode)
- Material UI 7.3+ + Emotion 11+
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

1. Реализовать верификацию email (Этап 1.3)
2. Создать UI компоненты для регистрации/входа
3. Добавить профили пользователей
4. Реализовать систему навыков
