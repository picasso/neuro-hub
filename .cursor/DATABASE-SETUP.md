# Database Setup Guide

## Overview

Проект использует PostgreSQL 16 с Knex.js в качестве query builder для работы с базой данных.

## Quick Start

### 1. Запуск PostgreSQL через Docker

```bash
# Запустить PostgreSQL контейнер
docker compose up -d postgres

# Проверить статус
docker compose ps

# Посмотреть логи
docker compose logs postgres
```

### 2. Создание .env файла

Скопируйте `env.example` в `.env` и настройте переменные:

```bash
cp env.example .env
```

Убедитесь, что `DATABASE_URL` настроен правильно:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/neurohub
```

### 3. Запуск миграций

```bash
# Применить все миграции
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

#### users
Основная таблица пользователей:
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `password_hash` (String, nullable для OAuth)
- `role` (Enum: 'freelancer' | 'client')
- `email_verified` (Boolean)
- `created_at`, `updated_at` (Timestamps)

Индексы: `email`, `role`

#### user_profiles
Профили пользователей:
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key -> users.id, Unique)
- `name` (String)
- `avatar_url` (String)
- `bio` (Text)
- `company_name` (String, для клиентов)
- `company_role` (String, для клиентов)
- `created_at`, `updated_at` (Timestamps)

#### sessions
Сессии для Better Auth:
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key -> users.id)
- `token` (String, Unique)
- `expires_at` (Timestamp)
- `created_at` (Timestamp)

Индексы: `user_id`, `token`, `expires_at`

#### skills
Предустановленные навыки для фрилансеров:
- `id` (UUID, Primary Key)
- `name` (String, Unique)
- `category` (Enum: text_generation, image_generation, video_generation, audio_generation, programming, consulting)
- `created_at` (Timestamp)

#### user_skills
Связь пользователей с навыками:
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key -> users.id)
- `skill_id` (UUID, Foreign Key -> skills.id)
- `proficiency_level` (Enum: beginner, intermediate, advanced, expert)
- `created_at` (Timestamp)

Unique constraint: (`user_id`, `skill_id`)

## Test Data

После запуска `yarn db:seed` в базе будут созданы:

### Тестовые пользователи

**Фрилансер:**
- Email: `freelancer@test.com`
- Password: `password` (хеш уже в БД)
- Навыки: GPT-4 (expert), Midjourney (advanced), LangChain (intermediate)

**Клиент:**
- Email: `client@test.com`
- Password: `password` (хеш уже в БД)
- Компания: Tech Startup Inc

### Предустановленные навыки

- **Text Generation:** GPT-4, Claude 3.5, Gemini Pro, и др.
- **Image Generation:** Midjourney, Stable Diffusion, DALL-E 3, и др.
- **Video Generation:** Runway, Pika Labs, Synthesia
- **Audio Generation:** ElevenLabs, Murf AI, Suno AI
- **Programming:** LangChain, OpenAI API, Hugging Face
- **Consulting:** Prompt Engineering, AI Strategy

## Connection Pooling

Knex.js настроен с connection pooling:

```typescript
pool: {
  min: 2,  // минимум 2 соединения
  max: 10  // максимум 10 соединений
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
# Проверить, что PostgreSQL слушает на порту 5432
docker compose ps

# Проверить переменную DATABASE_URL
echo $DATABASE_URL

# Проверить подключение напрямую
docker compose exec postgres psql -U postgres -d neurohub -c "SELECT 1"
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

Для production на Railway:

1. Создать PostgreSQL database в Railway
2. Скопировать `DATABASE_URL` из Railway
3. Добавить в переменные окружения Vercel
4. Миграции запускаются автоматически при деплое (TODO: добавить в CI/CD)

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
