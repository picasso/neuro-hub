# Railway PostgreSQL Setup Guide

Полное руководство по настройке Railway PostgreSQL для production окружения NeuroHub.

## Оглавление

- [Создание базы данных на Railway](#создание-базы-данных-на-railway)
- [Настройка переменных окружения](#настройка-переменных-окружения)
- [Запуск миграций](#запуск-миграций)
- [Миграция данных](#миграция-данных)
- [Автоматические миграции через GitHub Actions](#автоматические-миграции-через-github-actions)
- [Бэкапы и восстановление](#бэкапы-и-восстановление)
- [Мониторинг](#мониторинг)

## Создание базы данных на Railway

### 1. Создание проекта

1. Откройте [Railway.app](https://railway.app)
2. Войдите через GitHub аккаунт
3. Нажмите **New Project**
4. Выберите **Provision PostgreSQL**

### 2. Настройка PostgreSQL

После создания базы данных:

1. Откройте созданный PostgreSQL сервис
2. Перейдите в раздел **Variables**
3. Скопируйте значение переменной `DATABASE_URL`

Формат будет примерно таким:

```zsh
postgresql://postgres:password@region.railway.app:5432/railway
```

### 3. Настройка SSL (рекомендуется)

Railway автоматически настраивает SSL для PostgreSQL. Для подключения с SSL добавьте параметр:

```zsh
postgresql://postgres:password@region.railway.app:5432/railway?sslmode=require
```

## Настройка переменных окружения

### GitHub Actions (для CI/CD)

1. Откройте ваш репозиторий на GitHub
2. Перейдите в **Settings** → **Secrets and variables** → **Actions**
3. Нажмите **New repository secret**
4. Создайте секрет:
   - Name: `RAILWAY_DATABASE_URL`
   - Secret: (вставьте DATABASE_URL из Railway)

### Vercel (для деплоя приложения)

1. Откройте проект на [Vercel](https://vercel.com)
2. Перейдите в **Settings** → **Environment Variables**
3. Добавьте переменную:
   - Name: `DATABASE_URL`
   - Value: (вставьте DATABASE_URL из Railway)
   - Environment: Production

### Локально (для ручных операций)

Создайте `.env.production.local` или экспортируйте переменную:

```bash
export RAILWAY_DATABASE_URL="postgresql://postgres:password@region.railway.app:5432/railway?sslmode=require"
```

## Запуск миграций

### Автоматически через GitHub Actions

Миграции запускаются автоматически при push в `main` ветку.

Для ручного запуска:

1. Откройте репозиторий на GitHub
2. Перейдите в **Actions**
3. Выберите workflow **Deploy Production**
4. Нажмите **Run workflow**
5. При необходимости отметьте "Пропустить миграции"

### Вручную с локальной машины

```bash
# 1. Установите переменную окружения
export DATABASE_URL="<railway_database_url>"

# 2. Запустите безопасный скрипт миграции
yarn db:migrate:production
```

Скрипт выполнит:
- ✅ Проверку подключения
- ✅ Показ статуса миграций
- ✅ Создание бэкапа
- ✅ Запуск миграций
- ✅ Проверку результата

## Миграция данных

### Экспорт данных из локальной БД

```bash
# 1. Убедитесь, что DATABASE_URL указывает на локальную БД
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/neurohub"

# 2. Запустите экспорт
yarn db:export
```

Файл будет сохранен в `./backups/neurohub_export_YYYYMMDD_HHMMSS.sql`

### Импорт данных в Railway

```bash
# 1. Установите переменную для Railway
export RAILWAY_DATABASE_URL="<railway_database_url>"

# 2. Запустите импорт
yarn db:import ./backups/neurohub_export_20260125_120000.sql
```

⚠️ **ВНИМАНИЕ**: Импорт перезапишет существующие данные!

Скрипт:
- Создаст бэкап Railway БД перед импортом
- Запросит подтверждение
- Выполнит импорт данных

### Выборочная миграция таблиц

Для экспорта только определенных таблиц:

```bash
# Экспорт только таблицы users
pg_dump "$DATABASE_URL" -t users -t user_profiles > ./backups/users_only.sql

# Импорт в Railway
psql "$RAILWAY_DATABASE_URL" < ./backups/users_only.sql
```

## Автоматические миграции через GitHub Actions

### Настройка workflow

Workflow `.github/workflows/deploy-production.yml` уже настроен.

**Что делает workflow:**

1. ✅ Проверяет подключение к Railway БД
2. ✅ Показывает текущий статус миграций
3. ✅ Создает бэкап перед миграциями
4. ✅ Запускает миграции
5. ✅ Проверяет результат
6. ✅ Сохраняет бэкап как артефакт (30 дней)

### Триггеры workflow

- Автоматически: при `git push` в ветку `main`
- Вручную: через GitHub Actions UI

### Пропуск миграций

Если нужно задеплоить без миграций:

1. Запустите workflow вручную
2. Отметьте опцию **"Пропустить миграции базы данных"**

### Откат при ошибке

Если миграция провалилась:

1. Скачайте бэкап из артефактов GitHub Actions
2. Восстановите базу данных:

```bash
psql "$RAILWAY_DATABASE_URL" < backup_YYYYMMDD_HHMMSS.sql
```

## Бэкапы и восстановление

### Создание бэкапа Railway БД

```bash
# 1. Установите переменную
export RAILWAY_DATABASE_URL="<railway_database_url>"

# 2. Создайте бэкап
yarn db:backup:railway
```

Бэкапы сохраняются в `./backups/railway/`

### Автоматические бэкапы в Railway

Railway предоставляет автоматические бэкапы:

1. Откройте PostgreSQL сервис в Railway
2. Перейдите в раздел **Backups**
3. Настройте:
   - Частоту бэкапов
   - Период хранения
   - Регионы для хранения

### Восстановление из бэкапа

```bash
# Из локального файла
psql "$RAILWAY_DATABASE_URL" < ./backups/railway/backup_20260125_120000.sql

# Из Railway Dashboard
# 1. Откройте PostgreSQL сервис
# 2. Перейдите в Backups
# 3. Выберите бэкап
# 4. Нажмите Restore
```

## Мониторинг

### Health Check эндпоинт

Приложение имеет health check эндпоинт:

```bash
curl https://your-app.vercel.app/api/health
```

Ответ:

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-01-25T12:00:00.000Z",
    "database": "connected"
  }
}
```

### Мониторинг в Railway

Railway Dashboard показывает:
- CPU и Memory usage
- Количество активных подключений
- Размер базы данных
- Логи запросов (если включено)

### Логи подключений

Для включения логов PostgreSQL в Railway:

1. Откройте PostgreSQL сервис
2. Перейдите в **Settings**
3. Добавьте переменную:
   - Name: `POSTGRES_LOG_STATEMENT`
   - Value: `all` (или `ddl` для только DDL команд)

### Алерты

Настройте алерты через:
- Railway Webhooks
- Vercel Integration
- Сторонние сервисы (UptimeRobot, Pingdom)

## Troubleshooting

### Ошибка подключения

```bash
# Проверьте подключение
psql "$RAILWAY_DATABASE_URL" -c "SELECT 1"

# Проверьте SSL
psql "$RAILWAY_DATABASE_URL?sslmode=require" -c "SELECT 1"
```

### Миграции не применяются

```bash
# Проверьте статус
DATABASE_URL="$RAILWAY_DATABASE_URL" yarn db:migrate:status

# Откатите последнюю миграцию
DATABASE_URL="$RAILWAY_DATABASE_URL" yarn db:migrate:rollback

# Примените заново
DATABASE_URL="$RAILWAY_DATABASE_URL" yarn db:migrate
```

### База данных заполнена

```bash
# Проверьте размер БД в Railway Dashboard

# Очистите старые данные
psql "$RAILWAY_DATABASE_URL" -c "VACUUM FULL"

# Увеличьте лимит в Railway (если необходимо)
```

### Медленные запросы

```bash
# Включите логирование медленных запросов
# В Railway добавьте переменную:
# POSTGRES_LOG_MIN_DURATION_STATEMENT=1000  # логировать запросы > 1 секунды

# Проверьте активные запросы
psql "$RAILWAY_DATABASE_URL" -c "SELECT * FROM pg_stat_activity"
```

## Best Practices

### Безопасность

- ✅ Используйте SSL подключения (`?sslmode=require`)
- ✅ Храните `DATABASE_URL` в секретах (GitHub, Vercel)
- ✅ Не коммитьте `.env` файлы с production данными
- ✅ Используйте сильные пароли
- ✅ Ограничьте доступ к Railway проекту

### Миграции

- ✅ Всегда создавайте бэкап перед миграциями
- ✅ Тестируйте миграции локально перед production
- ✅ Пишите обратные миграции (`down` функции)
- ✅ Делайте миграции идемпотентными
- ✅ Избегайте блокирующих операций на больших таблицах

### Бэкапы

- ✅ Регулярные автоматические бэкапы в Railway
- ✅ Храните локальные копии критичных бэкапов
- ✅ Проверяйте возможность восстановления
- ✅ Бэкапы перед каждой миграцией

### Мониторинг

- ✅ Настройте алерты на ошибки подключения
- ✅ Отслеживайте размер базы данных
- ✅ Мониторьте количество активных соединений
- ✅ Проверяйте health check регулярно

## Полезные команды

```bash
# Подключение к Railway БД
psql "$RAILWAY_DATABASE_URL"

# Список таблиц
psql "$RAILWAY_DATABASE_URL" -c "\dt"

# Размер базы данных
psql "$RAILWAY_DATABASE_URL" -c "SELECT pg_size_pretty(pg_database_size('railway'))"

# Активные подключения
psql "$RAILWAY_DATABASE_URL" -c "SELECT count(*) FROM pg_stat_activity"

# Последние миграции
psql "$RAILWAY_DATABASE_URL" -c "SELECT * FROM knex_migrations ORDER BY id DESC LIMIT 5"
```

## Дополнительные ресурсы

- [Railway PostgreSQL Docs](https://docs.railway.app/databases/postgresql)
- [Knex.js Migrations](https://knexjs.org/guide/migrations.html)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
