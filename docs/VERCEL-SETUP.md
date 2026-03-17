# Vercel Deployment Setup Guide

Полное руководство по настройке Vercel для production деплоя NeuroGig.

## Оглавление

- [Создание проекта на Vercel](#создание-проекта-на-vercel)
- [Настройка переменных окружения](#настройка-переменных-окружения)
- [Настройка деплоя](#настройка-деплоя)
- [Подключение custom domain](#подключение-custom-domain)
- [Мониторинг и аналитика](#мониторинг-и-аналитика)
- [Troubleshooting](#troubleshooting)

## Создание проекта на Vercel

### 1. Подготовка репозитория

Убедитесь, что ваш код находится в GitHub репозитории и Railway PostgreSQL настроен.

**Предварительные требования:**
- ✅ GitHub репозиторий с кодом
- ✅ Railway PostgreSQL база данных настроена
- ✅ `DATABASE_URL` из Railway скопирован

### 2. Создание Vercel проекта

1. Откройте [Vercel Dashboard](https://vercel.com/dashboard)
2. Войдите через GitHub аккаунт
3. Нажмите **Add New...** → **Project**
4. Выберите ваш GitHub репозиторий `neuro-hub`
5. Vercel автоматически определит Next.js

### 3. Конфигурация проекта

Vercel автоматически заполнит настройки:

```zsh
Framework Preset: Next.js
Root Directory: ./
Build Command: yarn build
Output Directory: .next
Install Command: yarn install --immutable
Development Command: yarn dev
```

**Важно:** Не включайте override для `Install Command`, если в этом нет необходимости. Проект использует Yarn 4 через committed release file в `.yarn/releases`, поэтому Vercel должен запускать стандартный `yarn install` без `ENABLE_EXPERIMENTAL_COREPACK`.

## Настройка переменных окружения

### 1. Обязательные переменные

В **Settings** → **Environment Variables** добавьте:

#### Production Environment

```bash
# Application
NODE_ENV=production
PORT=3000

# Public URL (замените на ваш домен)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Database (из Railway)
DATABASE_URL=postgresql://postgres:password@region.railway.app:5432/railway

# Authentication
BETTER_AUTH_SECRET=<generate-secure-random-string>
BETTER_AUTH_URL=https://your-app.vercel.app
```

#### Как сгенерировать BETTER_AUTH_SECRET

```bash
# Опция 1: OpenSSL
openssl rand -base64 32

# Опция 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Опция 3: Online генератор
# https://generate-secret.vercel.app/32
```

### 2. Опциональные переменные

#### Email (если используете email verification)

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=NeuroGig <noreply@your-domain.com>
EMAIL_REPLY_TO=support@your-domain.com
```

#### OAuth провайдеры (если используете)

```bash
# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### File Upload (если используете)

```bash
# Vercel Blob (portfolio uploads)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

#### Monitoring (опционально)

```bash
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
AXIOM_TOKEN=your_axiom_token
AXIOM_DATASET=production
```

### 3. Применение переменных

1. Добавьте каждую переменную через UI
2. Выберите окружение: **Production**
3. Нажмите **Save**

После добавления всех переменных, Vercel автоматически пересоберет проект.

## Настройка деплоя

### 1. Автоматический деплой

Vercel автоматически настроит:

- ✅ **Production deployments** - при push в `main` ветку
- ✅ **Preview deployments** - для каждого Pull Request
- ✅ **Git интеграция** - автоматический деплой при коммитах

### 2. Build Settings

В **Settings** → **General** проверьте:

```zsh
Node.js Version: 24.x (автоматически из package.json engines)
```

Vercel использует версию из `package.json`:

```json
"engines": {
  "node": ">=24.0.0"
}
```

#### Yarn 4 на Vercel

Для этого проекта рабочая схема такая:

- Yarn 4 зафиксирован в `package.json`
- локальный release binary закоммичен в `.yarn/releases/`
- `.yarnrc.yml` использует `yarnPath`

Это позволяет Vercel запускать Yarn 4 без `ENABLE_EXPERIMENTAL_COREPACK`. Не включайте этот флаг для данного репозитория: на Vercel он приводил к падению install с ошибкой `Dynamic require of "util" is not supported`.

### 3. Первый деплой

После настройки переменных:

1. Нажмите **Deploy** в Vercel UI
2. Дождитесь завершения build (3-5 минут)
3. Проверьте deployment URL

**Что происходит при деплое:**
1. Vercel клонирует репозиторий
2. Устанавливает зависимости (`yarn install`)
3. Собирает проект (`yarn build`)
4. Оптимизирует и деплоит

### 4. Проверка деплоя

После успешного деплоя проверьте:

```bash
# Health check
curl https://your-app.vercel.app/api/health

# Ожидаемый ответ:
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-01-25T12:00:00.000Z",
    "database": "connected"
  }
}
```

## Подключение custom domain

### 1. Добавление домена

1. Откройте **Settings** → **Domains**
2. Нажмите **Add**
3. Введите ваш домен: `neurogig.ru`
4. Нажмите **Add**

### 2. Настройка DNS

Vercel покажет DNS записи для добавления:

#### Для root domain (neurogig.ru)

```zsh
Type: A
Name: @
Value: 76.76.21.21
```

#### Для www subdomain

```zsh
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### Для API subdomain (опционально)

```zsh
Type: CNAME
Name: api
Value: cname.vercel-dns.com
```

### 3. Проверка домена

1. Добавьте DNS записи у вашего DNS провайдера
2. Подождите 5-10 минут для propagation
3. Vercel автоматически проверит и выпустит SSL сертификат
4. ✅ Домен готов с HTTPS

### 4. Обновление переменных окружения

После добавления домена обновите:

```bash
NEXT_PUBLIC_APP_URL=https://neurogig.ru
BETTER_AUTH_URL=https://neurogig.ru
```

Vercel автоматически пересоберет проект.

## Мониторинг и аналитика

### 1. Vercel Analytics

Включите встроенную аналитику:

1. Откройте **Analytics** в Vercel Dashboard
2. Нажмите **Enable Analytics**
3. Analytics автоматически начнет собирать данные

**Что отслеживается:**
- Page views
- Unique visitors
- Top pages
- Referrers
- Devices/Browsers
- Geographic data

### 2. Vercel Speed Insights

Включите мониторинг производительности:

1. Откройте **Speed Insights**
2. Нажмите **Enable Speed Insights**
3. Установите порог для алертов

**Метрики:**
- Real User Monitoring (RUM)
- Core Web Vitals
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)

### 3. Логи

Просмотр логов:

1. Откройте конкретный deployment
2. Перейдите в **Functions** или **Build Logs**
3. Используйте фильтры для поиска ошибок

### 4. Error Monitoring (опционально)

Для production рекомендуется использовать Sentry:

```bash
# Установите Sentry SDK (уже есть в зависимостях)
yarn add @sentry/nextjs

# Настройте в next.config.mjs
# См. документацию Sentry для Next.js
```

## GitHub Integration

### 1. Автоматические комментарии в PR

Vercel автоматически добавляет комментарии в Pull Requests:

- ✅ Preview deployment URL
- ✅ Build статус
- ✅ Lighthouse scores
- ✅ Deployment logs

### 2. Status Checks

Vercel добавляет GitHub status checks:

- `Vercel Deployment` - статус production деплоя
- `Vercel Preview` - статус preview деплоя

### 3. Branch Protection

Рекомендуется настроить в GitHub:

1. **Settings** → **Branches** → **Branch protection rules**
2. Выберите `main` ветку
3. Включите:
   - ✅ Require status checks to pass before merging
   - ✅ Require deployments to succeed before merging

## Environment-specific Configuration

### Production Environment

```bash
# Оптимизации только для production
NODE_ENV=production

# Disable telemetry (опционально для production)
NEXT_TELEMETRY_DISABLED=1
```

### Preview Environment

Preview deployments автоматически используют:
- Те же environment variables что и production
- Отдельный URL: `your-app-git-branch-name.vercel.app`

Можно настроить отдельные переменные для Preview:

1. **Settings** → **Environment Variables**
2. Выберите окружение: **Preview**
3. Добавьте переменные

## Troubleshooting

### Build Failed

#### Ошибка: "Module not found"

```bash
# Проверьте зависимости
yarn install --immutable

# Убедитесь что все импорты корректны
yarn type-check

# Проверьте build локально
yarn build
```

#### Ошибка: `Dynamic require of "util" is not supported`

Это известный сбой Vercel при попытке запускать Yarn 4 через `ENABLE_EXPERIMENTAL_COREPACK` в ESM-проекте.

Что делать для этого репозитория:

1. Убедиться, что `ENABLE_EXPERIMENTAL_COREPACK` удалён из Vercel Environment Variables
2. Не использовать override для `Install Command`
3. Оставить committed Yarn release file в `.yarn/releases/`
4. Проверить, что `.yarnrc.yml` содержит `yarnPath`

После этого Vercel должен использовать Yarn 4 через локальный release binary из репозитория, а не через Corepack runtime.

#### Ошибка: "Out of memory"

Vercel Pro plan имеет больше памяти для build.

**Workaround для Hobby plan:**

В `next.config.mjs`:

```javascript
experimental: {
  workerThreads: false,
  cpus: 1
}
```

### Database Connection Failed

#### Проверьте DATABASE_URL

```bash
# В Vercel Environment Variables
DATABASE_URL должен совпадать с Railway

# Проверьте формат:
postgresql://user:password@host:port/database
```

#### Railway SSL Certificate

Убедитесь что Railway SSL настроен корректно (уже настроено в `pool.ts`).

### Authentication Issues

#### BETTER_AUTH_URL не совпадает

```bash
# Должен совпадать с NEXT_PUBLIC_APP_URL
BETTER_AUTH_URL=https://your-app.vercel.app
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

#### Cookies не сохраняются

Проверьте что используется HTTPS (Vercel автоматически включает).

### Performance Issues

#### Медленный build

```bash
# Проверьте размер зависимостей
yarn why <package-name>

# Оптимизируйте imports
# Вместо: import { Button } from '@mui/material'
# Используйте: import Button from '@mui/material/Button'
```

#### Медленные API responses

```bash
# Проверьте database queries
# Используйте indexes
# Оптимизируйте N+1 queries
```

### Preview Deployment не работает

#### Branch не деплоится

1. Проверьте **Settings** → **Git**
2. Убедитесь что включено: **Preview Deployments**
3. Проверьте что ветка не в ignored branches

### Custom Domain не работает

#### DNS не propagated

```bash
# Проверьте DNS записи
dig your-domain.com
nslookup your-domain.com

# Подождите до 24 часов для full propagation
```

#### SSL Certificate не выпускается

1. Убедитесь что DNS записи правильные
2. Проверьте что домен не имеет CAA записей блокирующих Let's Encrypt
3. Свяжитесь с Vercel support если проблема сохраняется

## Best Practices

### Security

- ✅ Используйте environment variables для секретов
- ✅ Никогда не коммитьте `.env` файлы
- ✅ Регулярно ротируйте `BETTER_AUTH_SECRET`
- ✅ Включите Vercel Firewall (Pro plan)
- ✅ Настройте CORS правильно

### Performance

- ✅ Используйте Vercel Analytics для мониторинга
- ✅ Оптимизируйте images с Next.js Image component
- ✅ Включите ISR для статических страниц
- ✅ Используйте Edge Runtime где возможно
- ✅ Мониторьте Core Web Vitals

### Monitoring

- ✅ Включите Vercel Speed Insights
- ✅ Настройте Sentry для error tracking
- ✅ Регулярно проверяйте deployment logs
- ✅ Настройте алерты для критических ошибок
- ✅ Мониторьте database performance в Railway

### Cost Optimization

- ✅ Используйте ISR вместо SSR где возможно
- ✅ Оптимизируйте bundle size
- ✅ Кэшируйте API responses
- ✅ Используйте Edge Functions для простой логики
- ✅ Мониторьте usage в Vercel Dashboard

## Полезные команды

```bash
# Локальная проверка production build
NODE_ENV=production yarn build
NODE_ENV=production yarn start

# Проверка environment variables
vercel env pull .env.vercel.local

# Deploy из CLI (требует vercel CLI)
vercel
vercel --prod

# Просмотр логов
vercel logs <deployment-url>

# Список deployments
vercel ls
```

## Дополнительные ресурсы

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Railway Integration](https://railway.app/docs/integrations/vercel)

## Поддержка

При возникновении проблем:

1. Проверьте раздел [Troubleshooting](#troubleshooting)
2. Просмотрите deployment logs в Vercel
3. Проверьте Railway database connection
4. Обратитесь к [Vercel Support](https://vercel.com/support)

---

**Готово! 🚀** Ваше приложение задеплоено на Vercel и готово к использованию.
