# Database setup (local)

Этот документ — **только настройка окружения**: Docker, переменные, миграции, сиды, бэкап/восстановление **локальной** БД. Описание схемы, доменов, SQL-примеров и инвариантов — в **[`docs/db/`](./db/)** (см. ниже). Про интеграцию с Railway — **[`docs/RAILWAY-SETUP.md`](./RAILWAY-SETUP.md)**.

## Документация по БД (куда смотреть)

| Ресурс | Содержание |
|--------|------------|
| [`docs/db/DATABASE.md`](./db/DATABASE.md) | Доменная модель, таблицы, инварианты, ссылки на примеры SQL |
| [`docs/db/schema.dbml`](./db/schema.dbml) | Черновик физической схемы (dbdiagram / обзор) |
| [`docs/db/queries/`](./db/queries/) | Канонические read-only SQL-запросы |
| [`ARCHITECTURE-DECISIONS.md`](../ARCHITECTURE-DECISIONS.md) | ADR, в т.ч. смешанные id (auth TEXT / domain UUID) |

Пул соединений, таймауты — в коде: `src/lib/db/pool.ts`. Сгенерированные Kysely-типы: `src/types/database.ts` (после `yarn db:generate-types`).

## Требования

- **PostgreSQL** — в Docker используется образ `postgres:16-alpine` (см. `docker-compose.yml`).
- Клиентские утилиты **`pg_dump` / `psql`** — для экспорта/импорта и для команд [`db:backup`](#локальный-снимок-один-файл) / [`db:restore`](#локальный-снимок-один-файл).  
  Пример (macOS): (в `PATH` должны быть `pg_dump` и `psql`)

  ```bash
  brew install postgresql@16
  ```

## Быстрый старт

### 1. Переменные окружения

```bash
cp env.example .env
```

Минимум для локальной БД в Docker (порт по умолчанию в `env.example` может отличаться — согласуйте с `docker-compose.yml`):

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/neurogig
```

### 2. Запуск PostgreSQL (Docker)

```bash
docker compose up -d postgres
docker compose ps
docker compose logs postgres
```

### 3. Миграции

```bash
# 1) Core-таблицы Better Auth (users, sessions, accounts, verifications)
yarn db:auth:migrate

# 2) Доменные миграции (Knex)
yarn db:migrate

yarn db:migrate:status
# при необходимости: yarn db:migrate:rollback
```

### 4. Сиды (справочники)

```bash
yarn db:seed
```

В Knex-сидах — в частности **skills** и **languages** (см. `src/lib/db/seeds/`). Пользователи в обычном сиде не создаются: регистрация и онбординг через приложение.  
Опционально — синтетические мок-пользователи: [`MOCK-USERS.md`](../MOCK-USERS.md) и `yarn db:seed:mock-users` (после `db:seed`).

### 5. Проверка подключения

```bash
yarn db:test
```

## Команды из `package.json` (обзор)

| Команда | Назначение |
|---------|------------|
| `yarn db:auth:migrate` | Миграции схемы Better Auth |
| `yarn db:migrate` / `db:migrate:status` / `db:migrate:rollback` | Доменные миграции Knex |
| `yarn db:seed` / `yarn db:seed:status` | Сиды Knex |
| `yarn db:seed:mock-users` | Upsert мок-пользователей (см. `MOCK-USERS.md`) |
| `yarn db:backup` | [Локальный снимок (один файл)](#локальный-снимок-один-файл) |
| `yarn db:restore` | [Восстановление из того же файла](#локальный-снимок-один-файл) |
| `yarn db:export` | Экспорт в **отдельный** timestamped `.sql` (см. `scripts/db/export-data.sh`; удобно для переноса) |
| `yarn db:import` | Импорт в **Railway** (нужен `RAILWAY_DATABASE_URL`) |
| `yarn db:backup:production` | Бэкап БД на Railway |
| `yarn db:migrate:production` | Миграции в production (обёртка) |
| `yarn db:check` | Быстрая проверка таблиц/данных |
| `yarn db:delete-users` | Удаление пользователей (каскад; осторожно) |

Полный список смотрите в `package.json` (префикс `db:`).

## Локальный снимок (один файл)

Фиксированный путь (перетирается при каждом бэкапе):

- **`backups/local-latest.sql`** (каталог `backups/` в gitignore, кроме `.gitkeep`)

| Команда | Действие |
|---------|----------|
| `yarn db:backup` | `pg_dump` в `backups/local-latest.sql` (флаги с `--clean` для последующего полного restore) |
| `yarn db:restore` | Восстановить **только** из `backups/local-latest.sql` в БД из `DATABASE_URL` (интерактивное подтверждение `YES`) |
| `yarn db:restore --force` | То же, без вопроса (для CI/скриптов) |

Перед бэкапом/восстановлением задайте `DATABASE_URL` (например `export $(grep -v '^#' .env | xargs)` или через оболочку).  
**Восстановление перезаписывает объекты в целевой БД** в соответствии с дампом; для production не используйте эти команды — только локальная разработка (или отдельный инстанс с осознанным риском).

## Перенос данных local → Railway

См. [`docs/RAILWAY-SETUP.md`](./RAILWAY-SETUP.md). Типично: `yarn db:export` (timestamped файл) → `yarn db:import <файл.sql>` с `RAILWAY_DATABASE_URL`.

## Устранение неполадок

### PostgreSQL в Docker не поднимается

```bash
docker ps
docker compose logs postgres
docker compose down
docker compose up -d postgres
```

### Не удаётся подключиться

- Проверьте порт в `DATABASE_URL` и в `docker compose` (часто `5433:5432`).
- Прямая проверка:  
  `docker compose exec postgres psql -U postgres -d neurogig -c "SELECT 1"`

### Ошибки миграций

```bash
yarn db:migrate:status
yarn db:migrate:rollback
yarn db:migrate
```

### Полный сброс данных локального контейнера

```bash
docker compose down -v
docker compose up -d postgres
yarn db:auth:migrate
yarn db:migrate
yarn db:seed
```

## Безопасность

- Не коммитьте `.env` и не публикуйте `DATABASE_URL` с паролями.
- Для production включайте SSL к БД и полагайтесь на бэкапы провайдера (например Railway) в дополнение к ручным `pg_dump` при необходимости.
