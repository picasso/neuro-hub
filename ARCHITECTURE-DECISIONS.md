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

### 8. API Documentation: Миграция с Swagger UI на Scalar

**Текущее решение:** `swagger-ui-react` 5.31.0 с workarounds для Next.js 16.

**Рекомендация:** Мигрировать на Scalar после решения React 19 compatibility issue.

**Проблемы Swagger UI:**
- React Class Components несовместимы с Next.js Server Components
- Требует `'use client'` directive и `dynamic import` с `ssr: false`
- Предупреждения `UNSAFE_componentWillReceiveProps` в React 19
- Устаревший UI и медленная загрузка (~1.5s vs ~500ms у Scalar)
- Большой bundle size (~400KB vs ~200KB у Scalar)
- Ограниченная поддержка OpenAPI 3.1

**Преимущества Scalar:**
- Нативная поддержка Next.js App Router без хаков
- Современный UI с built-in dark mode
- Full-text search по endpoints
- Request history и persistent authentication
- Multiple code examples (cURL, JS, Python, C#)
- Рекомендован Microsoft для .NET 9 проектов

**Блокер:** Issue #4216 - TypeError с React 19 (`ReactCurrentDispatcher`).

**План миграции:**
1. Отслеживать статус [scalar/scalar#4216](https://github.com/scalar/scalar/issues/4216)
2. После закрытия issue установить `@scalar/nextjs-api-reference`
3. Заменить `/api/swagger/page.tsx` на `/api/reference/route.ts`
4. Удалить `swagger-ui-react` и связанные workarounds
5. Обновить ссылки в документации

**Дата решения:** 2026-01-22

## Технологический стек MVP

### Frontend
- Next.js 16+ (App Router) + React 19
- TypeScript 5.9+ (strict mode)
- Material UI 7.3+ + Emotion 11+
- Effector 23+ для state management

### Backend
- Node.js 24 LTS
- Next.js API Routes (RESTful)
- PostgreSQL 16 + Knex.js 3+
- Better Auth 1+

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

## Следующие шаги

1. Создать базовую структуру API endpoints
2. Настроить Swagger документацию
3. Реализовать базовые миграции БД
4. Настроить Better Auth
