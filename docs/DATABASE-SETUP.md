# Database Setup Guide

## Overview

Проект использует PostgreSQL 16.

- **Knex** — только для миграций и seed’ов
- **Kysely** — для всех runtime-запросов в приложении (type-safe SQL)

## Quick Start

### 1. Создание .env файла

Скопируйте `env.example` в `.env` и настройте переменные:

```bash
cp env.example .env
```

Убедитесь, что `DATABASE_URL` настроен правильно:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/neurogig
```

### 2. Запуск PostgreSQL через Docker

```bash
# Запустить PostgreSQL контейнер
docker compose up -d postgres

# Проверить статус
docker compose ps

# Посмотреть логи
docker compose logs postgres
```

### 3. Запуск миграций

```bash
# 1) Создать core таблицы Better Auth (users/sessions/accounts/verifications)
yarn db:auth:migrate

# 2) Применить доменные миграции (Knex)
yarn db:migrate

# Проверить статус миграций
yarn db:migrate:status

# Откатить последнюю миграцию
yarn db:migrate:rollback
```

### 4. Заполнение тестовыми данными

```bash
# Запустить все seed файлы
yarn db:seed
```

## Database Scripts

В `package.json` доступны следующие скрипты:

### Миграции

- `yarn db:migrate` - Применить все новые миграции
- `yarn db:migrate:make <name>` - Создать новую миграцию
- `yarn db:migrate:rollback` - Откатить последнюю миграцию
- `yarn db:migrate:status` - Показать статус миграций

### Seeds

- `yarn db:seed` - Запустить все seed файлы
- `yarn db:seed:make <name>` - Создать новый seed файл

## Database Schema

### Текущие таблицы (после миграций)

Ниже — “каноническая” схема в терминах последнего ADR: **auth IDs = TEXT**, **domain IDs = UUID**.
Подробности и мотивация: см. `ARCHITECTURE-DECISIONS.md` (mixed IDs).

#### Better Auth (core tables)

Core таблицы Better Auth используют **opaque string IDs (TEXT)** и могут иметь camelCase колонки.

#### users (Better Auth)

- `id` (TEXT, Primary Key, opaque auth id)
- `email` (TEXT)
- `name` (TEXT)
- `role` (TEXT: `freelancer | client`)
- `emailVerified` (Boolean)
- `image` (TEXT, nullable)
- `createdAt`, `updatedAt` (Timestamps)

#### user_profiles (owned-by-user, 1:1)

- `user_id` (TEXT, FK → `users.id`, UNIQUE)
- `id` (TEXT) — для новых записей **равен** `user_id` (см. ADR)
- `name`, `avatar_url`, `bio`, `company_name`, `company_role`
- `created_at`, `updated_at`

#### skills (domain catalog)

- `id` (UUID, Primary Key)
- `legacy_id` (TEXT, nullable) — сохранён для отладки/rollback после миграции id → UUID
- `name` (unique), `category`, `created_at`

#### user_skills (user ↔ skills)

- `id` (TEXT, Primary Key)
- `user_id` (TEXT, FK → `users.id`)
- `skill_id` (UUID, FK → `skills.id`)
- `legacy_skill_id` (TEXT, nullable) — сохранён после миграции
- `proficiency_level`, `created_at`

Unique constraint: (`user_id`, `skill_id`)

#### freelancer_profiles (domain)

- `id` (UUID, Primary Key)
- `user_id` (TEXT, FK → `users.id`, UNIQUE)
- `specialization`, `hourly_rate`, `availability`, `experience`
- `created_at`, `updated_at`

#### portfolio_items (domain)

- `id` (UUID, Primary Key)
- `freelancer_profile_id` (UUID, FK → `freelancer_profiles.id`)
- `media_url`, `media_type`, `title`, `description`, `category`, `tools_used`
- `created_at`, `updated_at`

## Seed Data

После запуска `yarn db:seed` в базе будут **предустановленные навыки** (`skills`).
Пользователи/профили не сидируются намеренно — они создаются через Better Auth и onboarding.

## Connection Pooling

Пул подключений настроен через `pg.Pool` (см. `src/lib/db/pool.ts`):

```typescript
{
  max: 20,
  min: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
}
```

## Полнотекстовый поиск

PostgreSQL настроен для полнотекстового поиска:
- Используются GIN-индексы
- Поддержка русского и английского языков
- Индексация через `tsvector`

## Troubleshooting

### PostgreSQL не запускается

```bash
# Проверить, запущен ли Docker
docker ps

# Проверить логи контейнера
docker compose logs postgres

# Пересоздать контейнер
docker compose down
docker compose up -d postgres
```

### Ошибка подключения к БД

```bash
# Проверить, что PostgreSQL слушает на порту 5433 (docker-compose пробрасывает 5433 -> 5432)
docker compose ps

# Проверить переменную DATABASE_URL
echo $DATABASE_URL

# Проверить подключение напрямую
docker compose exec postgres psql -U postgres -d neurogig -c "SELECT 1"
```

### Ошибка миграций

```bash
# Проверить статус миграций
yarn db:migrate:status

# Откатить последнюю миграцию и применить снова
yarn db:migrate:rollback
yarn db:migrate
```

### Сбросить базу данных полностью

```bash
# Остановить и удалить контейнер с данными
docker compose down -v

# Запустить заново
docker compose up -d postgres

# Применить миграции и seeds
yarn db:migrate
yarn db:seed
```

## Production Considerations

### Railway Setup

✅ **Настроена автоматизация для Railway PostgreSQL!**

Для полной инструкции см. [docs/RAILWAY-SETUP.md](../docs/RAILWAY-SETUP.md)

**Быстрый старт:**

1. Создайте PostgreSQL database в Railway
2. Скопируйте `DATABASE_URL` из Railway
3. Добавьте `RAILWAY_DATABASE_URL` в GitHub Secrets
4. Добавьте `DATABASE_URL` в переменные окружения Vercel
5. Миграции запустятся автоматически при push в `main`

**Доступные команды:**

```bash
# Миграция данных из локальной БД в Railway
yarn db:export                    # Экспорт локальных данных
yarn db:import <файл.sql>         # Импорт в Railway

# Управление миграциями в production
yarn db:migrate:production        # Безопасный запуск миграций в Railway

# Бэкапы Railway БД
yarn db:backup:railway            # Создать бэкап Railway БД
```

**Автоматические миграции:**
- ✅ GitHub Action настроен (`.github/workflows/deploy-production.yml`)
- ✅ Запускается автоматически при push в main
- ✅ Создает бэкап перед миграциями
- ✅ Возможность ручного запуска через GitHub UI

### Security

- ❌ **НЕ** коммитьте `.env` файл
- ✅ Используйте сильные пароли в production
- ✅ Включите SSL для production БД
- ✅ Регулярно делайте бэкапы

## Next Steps

После настройки базы данных:

1. Настроить Better Auth интеграцию
2. Создать API endpoints для работы с пользователями
3. Добавить миграции для проектов и заказов
4. Настроить полнотекстовый поиск для проектов
