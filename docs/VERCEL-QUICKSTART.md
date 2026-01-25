# Vercel Deployment - Быстрый старт

Краткое руководство для быстрого деплоя NeuroHub на Vercel.

## 🚀 Шаг 1: Создайте проект на Vercel

1. Откройте [Vercel Dashboard](https://vercel.com/dashboard) и войдите через GitHub
2. Нажмите **Add New...** → **Project**
3. Выберите репозиторий `neuro-hub`
4. Vercel автоматически определит Next.js - нажмите **Deploy**

## 🔐 Шаг 2: Настройте Environment Variables

Перейдите в **Settings** → **Environment Variables** и добавьте:

### Обязательные переменные

```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
DATABASE_URL=<ваш_RAILWAY_DATABASE_URL>
BETTER_AUTH_SECRET=<ваш_BETTER_AUTH_SECRET>
BETTER_AUTH_URL=https://your-app.vercel.app
```

## ✅ Шаг 3: Задеплойте проект

1. После добавления переменных нажмите **Save**
2. Vercel автоматически запустит новый build
3. Дождитесь завершения (3-5 минут)
4. Откройте deployment URL

## 🔍 Шаг 4: Проверьте деплой

Проверьте что всё работает:

```bash
# Health check
curl https://your-app.vercel.app/api/health

# Ожидаемый ответ:
{
  "success": true,
  "data": {
    "status": "healthy",
    "database": "connected"
  }
}
```

## 🌐 Шаг 5: Настройте custom domain (опционально)

1. **Settings** → **Domains** → **Add**
2. Введите ваш домен: `neurohub.com`
3. Добавьте DNS записи у вашего DNS провайдера:

   ```yaml
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

4. Подождите 5-10 минут
5. Vercel автоматически выпустит SSL сертификат

### Обновите environment variables

После добавления домена:

```bash
NEXT_PUBLIC_APP_URL=https://neurohub.com
BETTER_AUTH_URL=https://neurohub.com
```

## 📊 Шаг 6: Включите мониторинг (опционально)

### Vercel Analytics
1. Откройте **Analytics** в Dashboard
2. Нажмите **Enable Analytics**

### Speed Insights
1. Откройте **Speed Insights**
2. Нажмите **Enable Speed Insights**

## 🔄 Автоматический деплой

Vercel автоматически настроил:

- ✅ **Production deploy** - при push в `main` ветку
- ✅ **Preview deploy** - для каждого Pull Request
- ✅ **GitHub integration** - комментарии в PR с preview URL

Просто делайте `git push` и Vercel задеплоит изменения!

## 🆘 Проблемы?

### Build Failed

```bash
# Проверьте локально
yarn build

# Проверьте логи в Vercel Dashboard
# Deployments → [your-deployment] → Build Logs
```

### Database Connection Error

Проверьте что `DATABASE_URL` правильный:
- Должен начинаться с `postgresql://`
- Должен совпадать с Railway DATABASE_URL
- Должен включать все параметры (host, port, database)

### Authentication не работает

Убедитесь что:
- `BETTER_AUTH_URL` и `NEXT_PUBLIC_APP_URL` совпадают
- `BETTER_AUTH_SECRET` установлен
- Используется HTTPS (Vercel автоматически включает)

### Нужна помощь?

См. [полную документацию](./VERCEL-SETUP.md) для детальных инструкций.

## 📚 Полезные ссылки

- [Vercel Dashboard](https://vercel.com/dashboard) - управление deployments
- [Railway Dashboard](https://railway.app) - управление БД
- [Полная документация](./VERCEL-SETUP.md) - детальное руководство

---

**Готово! 🎉** Ваше приложение задеплоено на Vercel.

**Next steps:**
1. Поделитесь URL с командой
2. Настройте custom domain
3. Включите Analytics и Speed Insights
4. Настройте алерты для критических ошибок
