# Database Scripts

Актуальный справочник по `db:*` scripts проекта. Здесь собраны локальные команды разработки, миграции, сиды, диагностические утилиты и Railway-скрипты.

## Available Scripts

### Local Development

#### `yarn db:test`

Проверяет подключение к текущей базе данных.

```bash
yarn db:test
```

#### `yarn db:check`

Показывает диагностическую информацию по базе данных.

```bash
yarn db:check
```

#### `yarn db:generate-types`

Перегенерирует `src/types/database.ts` из текущей схемы базы.

```bash
yarn db:generate-types
```

### Migrations

#### `yarn db:auth:migrate`

Применяет миграции Better Auth.

```bash
yarn db:auth:migrate
```

#### `yarn db:migrate`

Применяет pending-миграции приложения и показывает понятный статус до и после запуска.

```bash
yarn db:migrate
```

#### `yarn db:migrate:status`

Показывает список pending и completed миграций приложения.

```bash
yarn db:migrate:status
```

#### `yarn db:migrate:rollback`

Откатывает последний batch миграций приложения и печатает статус до и после rollback.

```bash
yarn db:migrate:rollback
```

#### `yarn db:migrate:production`

Безопасный сценарий миграции production-окружения.

```bash
export DATABASE_URL="<railway_database_url>"
yarn db:migrate:production
```

Что делает:
1. Проверяет подключение к базе данных.
2. Показывает текущий статус миграций.
3. Создаёт бэкап перед миграциями.
4. Запускает Better Auth миграции.
5. Запускает миграции приложения.
6. Проверяет результат.

### Seeds

#### `yarn db:seed`

Запускает сиды Knex.

```bash
yarn db:seed
```

#### `yarn db:seed:make <name>`

Создаёт новый seed-файл через Knex CLI.

```bash
yarn db:seed:make demo-data
```

### Data Maintenance

#### `yarn db:delete-users --all`

Удаляет всех пользователей и связанные записи.

```bash
yarn db:delete-users --all
```

#### `yarn db:delete-users --email <email>`

Удаляет конкретного пользователя по email.

```bash
yarn db:delete-users --email test@test.com
```

#### `yarn db:reset-email-verification`

Сбрасывает email verification для выбранного пользователя или сценария, который поддерживает скрипт.

```bash
yarn db:reset-email-verification
```

#### `yarn db:drop-all`

Удаляет все таблицы из текущей базы. Деструктивная команда.

```bash
yarn db:drop-all
```

### Backup / Import / Railway

#### `yarn db:export`

Экспортирует локальную базу данных в SQL-дамп.

```bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5433/neurogig"
yarn db:export
```

Что делает:
- Создаёт полный дамп базы данных.
- Сохраняет файл в `./backups/neurogig_export_YYYYMMDD_HHMMSS.sql`.
- Использует `pg_dump` с флагами `--no-owner --no-acl`.

#### `yarn db:import <path-to-sql>`

Импортирует SQL-дамп в Railway PostgreSQL.

```bash
export RAILWAY_DATABASE_URL="postgresql://..."
yarn db:import ./backups/neurogig_export_20260125_120000.sql
```

Что делает:
- Создаёт бэкап Railway БД перед импортом.
- Запрашивает подтверждение пользователя.
- Импортирует данные из SQL-файла.
- Сохраняет бэкап в `./backups/railway/`.

#### `yarn db:backup:railway`

Создаёт бэкап Railway PostgreSQL базы данных.

```bash
export RAILWAY_DATABASE_URL="postgresql://..."
yarn db:backup:railway
```

#### `yarn db:reset-railway`

Сбрасывает Railway базу с подтверждением.

```bash
yarn db:reset-railway
```

#### `yarn db:reset-railway:force`

Сбрасывает Railway базу без интерактивного подтверждения.

```bash
yarn db:reset-railway:force
```

## Typical Workflows

### First Local Setup

```bash
docker compose up -d postgres
yarn db:test
yarn db:auth:migrate
yarn db:migrate
yarn db:migrate:status
```

### Apply New App Migration

```bash
yarn db:migrate
yarn db:migrate:status
```

### Roll Back Last Migration Batch

```bash
yarn db:migrate:rollback
yarn db:migrate:status
```

### Refresh Generated DB Types

```bash
yarn db:generate-types
```

### Export Local Data And Import To Railway

```bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5433/neurogig"
yarn db:export

export RAILWAY_DATABASE_URL="<railway_url>"
yarn db:import ./backups/neurogig_export_20260125_120000.sql
```

## Environment Variables

| Variable | Description | Used by |
| --- | --- | --- |
| `DATABASE_URL` | URL локальной или production базы | `db:migrate:production`, `db:export` |
| `RAILWAY_DATABASE_URL` | URL Railway базы | `db:import`, `db:backup:railway`, `db:reset-railway*` |

## Requirements

### PostgreSQL client tools

Для `db:export`, `db:import`, `db:backup:railway` и production migration script нужны утилиты PostgreSQL.

#### macOS

```bash
brew install postgresql
```

#### Ubuntu / Debian

```bash
sudo apt-get update
sudo apt-get install postgresql-client
```

#### Windows

Установите PostgreSQL client tools с [официального сайта](https://www.postgresql.org/download/windows/).

## Safety Notes

- Не коммитьте файлы с бэкапами.
- Не храните `DATABASE_URL` и `RAILWAY_DATABASE_URL` в коде.
- Используйте SSL для production-подключений.
- Проверяйте текущую базу перед запуском деструктивных команд вроде `db:drop-all` и `db:reset-railway`.

## Troubleshooting

### `pg_dump: command not found`

Установите PostgreSQL client tools.

### `Connection refused`

Проверьте:
- правильность `DATABASE_URL` или `RAILWAY_DATABASE_URL`
- доступность сервера базы данных
- запущен ли локальный Postgres контейнер

### `Permission denied`

Убедитесь, что shell-скрипты исполняемые:

```bash
chmod +x scripts/db/*.sh
```

Для детальной инструкции по Railway см. [docs/RAILWAY-SETUP.md](../../docs/RAILWAY-SETUP.md).
