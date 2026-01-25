# Railway PostgreSQL - Быстрый старт

Краткое руководство для начала работы с Railway PostgreSQL.

## 🚀 Шаг 1: Создайте БД на Railway

1. Откройте [Railway.app](https://railway.app) и войдите через GitHub
2. Создайте новый проект: **New Project** → **Provision PostgreSQL**
3. Скопируйте `DATABASE_URL` из раздела **Variables**

## 🔐 Шаг 2: Настройте секреты

### GitHub (для автоматических миграций)

```bash
# В вашем репозитории на GitHub:
Settings → Secrets and variables → Actions → New repository secret

Name: RAILWAY_DATABASE_URL
Secret: <вставьте DATABASE_URL из Railway>
```

### Локально (для ручных операций)

```bash
# Добавьте в ~/.zshrc или ~/.bashrc
export RAILWAY_DATABASE_URL="postgresql://postgres:...@region.railway.app:5432/railway?sslmode=require"

# Или создайте .env.production.local
echo 'RAILWAY_DATABASE_URL="postgresql://..."' > .env.production.local
```

## 📦 Шаг 3: Запустите миграции

### Автоматически (рекомендуется)

Просто сделайте push в ветку `main`:

```bash
git push origin main
```

GitHub Action автоматически:
- ✅ Проверит подключение
- ✅ Создаст бэкап
- ✅ Запустит миграции
- ✅ Сохранит бэкап как артефакт

### Вручную

```bash
# Установите переменную
export DATABASE_URL="$RAILWAY_DATABASE_URL"

# Запустите миграции
yarn db:migrate:production
```

## 💾 Шаг 4: Мигрируйте данные (опционально)

Если у вас есть данные в локальной БД:

```bash
# 1. Экспортируйте локальные данные
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/neurohub"
yarn db:export

# 2. Импортируйте в Railway
export RAILWAY_DATABASE_URL="postgresql://..."
yarn db:import ./backups/neurohub_export_20260125_120000.sql
```

## ✅ Шаг 5: Проверьте результат

```bash
# Подключитесь к Railway БД
psql "$RAILWAY_DATABASE_URL"

# Проверьте таблицы
\dt

# Проверьте миграции
SELECT * FROM knex_migrations ORDER BY id DESC LIMIT 5;

# Выход
\q
```

## 🔄 Регулярные задачи

### Создание бэкапа

```bash
export RAILWAY_DATABASE_URL="postgresql://..."
yarn db:backup:railway
```

### Проверка статуса миграций

```bash
export DATABASE_URL="$RAILWAY_DATABASE_URL"
yarn db:migrate:status
```

### Откат миграции

```bash
export DATABASE_URL="$RAILWAY_DATABASE_URL"
yarn db:migrate:rollback
```

## 📚 Дополнительные ресурсы

- [Полная документация](./RAILWAY-SETUP.md) - детальное руководство
- [Скрипты БД](../scripts/db/README.md) - описание всех скриптов
- [Railway Dashboard](https://railway.app) - управление БД

## 🆘 Проблемы?

### Connection refused

```bash
# Проверьте подключение
psql "$RAILWAY_DATABASE_URL" -c "SELECT 1"

# Проверьте переменную
echo $RAILWAY_DATABASE_URL
```

### Миграции не применяются

```bash
# Проверьте статус
DATABASE_URL="$RAILWAY_DATABASE_URL" yarn db:migrate:status

# Примените вручную
DATABASE_URL="$RAILWAY_DATABASE_URL" yarn db:migrate
```

### Нужна помощь?

См. раздел **Troubleshooting** в [полной документации](./RAILWAY-SETUP.md#troubleshooting)

---

**Готово! 🎉** Ваша Railway PostgreSQL база данных настроена и готова к использованию.
