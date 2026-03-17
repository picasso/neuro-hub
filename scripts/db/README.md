# Database Scripts

Набор скриптов для управления Railway PostgreSQL базой данных.

## Доступные скрипты

### 📤 export-data.sh

Экспорт данных из локальной PostgreSQL базы данных.

**Использование:**

```bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5433/neurogig"
yarn db:export
```

**Что делает:**
- Создает полный дамп базы данных (структура + данные)
- Сохраняет в `./backups/neurogig_export_YYYYMMDD_HHMMSS.sql`
- Использует `pg_dump` с флагами `--no-owner --no-acl`

**Требования:**
- PostgreSQL client tools (`pg_dump`)
- Переменная окружения `DATABASE_URL`

---

### 📥 import-data.sh

Импорт данных в Railway PostgreSQL базу данных.

**Использование:**

```bash
export RAILWAY_DATABASE_URL="postgresql://..."
yarn db:import ./backups/neurogig_export_20260125_120000.sql
```

**Что делает:**
- Создает бэкап Railway БД перед импортом
- Запрашивает подтверждение пользователя
- Импортирует данные из SQL файла
- Сохраняет бэкап в `./backups/railway/`

**Требования:**
- PostgreSQL client tools (`psql`, `pg_dump`)
- Переменная окружения `RAILWAY_DATABASE_URL`
- SQL файл для импорта

⚠️ **ВНИМАНИЕ:** Импорт перезапишет существующие данные!

---

### 🚀 migrate-production.sh

Безопасный запуск миграций в production окружении.

**Использование:**

```bash
export DATABASE_URL="<railway_database_url>"
yarn db:migrate:production
```

**Что делает:**
1. Проверяет подключение к базе данных
2. Показывает текущий статус миграций
3. Создает бэкап перед миграциями
4. Запускает Better Auth миграции
5. Запускает миграции через Knex
6. Проверяет результат

**Требования:**
- PostgreSQL client tools (`pg_dump`)
- Переменная окружения `DATABASE_URL`
- Доступ к Railway базе данных

---

### 💾 backup-railway.sh

Создание бэкапа Railway PostgreSQL базы данных.

**Использование:**

```bash
export RAILWAY_DATABASE_URL="postgresql://..."
yarn db:backup:railway
```

**Что делает:**
- Создает полный дамп Railway БД
- Сохраняет в `./backups/railway/railway_backup_YYYYMMDD_HHMMSS.sql`
- Показывает список всех бэкапов

**Требования:**
- PostgreSQL client tools (`pg_dump`)
- Переменная окружения `RAILWAY_DATABASE_URL`

---

## Установка зависимостей

### macOS

```bash
brew install postgresql
```

### Ubuntu/Debian

```bash
sudo apt-get update
sudo apt-get install postgresql-client
```

### Windows
Скачайте PostgreSQL с [официального сайта](https://www.postgresql.org/download/windows/)

---

## Workflow примеры

### Миграция локальной БД в Railway

```bash
# 1. Экспортируйте локальные данные
export DATABASE_URL="postgresql://postgres:postgres@localhost:5433/neurogig"
yarn db:export

# 2. Импортируйте в Railway
export RAILWAY_DATABASE_URL="<railway_url>"
yarn db:import ./backups/neurogig_export_20260125_120000.sql
```

### Регулярные бэкапы Railway

```bash
# Создайте cron job для автоматических бэкапов
# crontab -e

# Ежедневный бэкап в 3:00 AM
0 3 * * * cd /path/to/neuro-hub && RAILWAY_DATABASE_URL="<url>" yarn db:backup:railway
```

### Откат миграции

```bash
# 1. Восстановите из бэкапа
export DATABASE_URL="<railway_url>"
psql "$DATABASE_URL" < ./backups/railway/backup_before_migration.sql

# 2. Или используйте Knex rollback
yarn db:migrate:rollback
```

---

## Переменные окружения

| Переменная             | Описание                     | Где использовать                          |
| ---------------------- | ---------------------------- | ----------------------------------------- |
| `DATABASE_URL`         | URL локальной или Railway БД | `export-data.sh`, `migrate-production.sh` |
| `RAILWAY_DATABASE_URL` | URL Railway БД               | `import-data.sh`, `backup-railway.sh`     |

---

## Безопасность

- ✅ Никогда не коммитьте файлы с бэкапами
- ✅ Не храните `DATABASE_URL` в коде
- ✅ Используйте SSL для production (`?sslmode=require`)
- ✅ Ограничьте доступ к папке `./backups/`

---

## Troubleshooting

### pg_dump: command not found

Установите PostgreSQL client tools (см. раздел "Установка зависимостей")

### Connection refused

Проверьте:
- Правильность `DATABASE_URL`
- Доступность сервера (Railway может требовать время на запуск)
- Настройки файрволла

### Permission denied

Убедитесь, что скрипты исполняемые:

```bash
chmod +x scripts/db/*.sh
```

---

Для детальной инструкции по настройке Railway см. [docs/RAILWAY-SETUP.md](../../docs/RAILWAY-SETUP.md)
