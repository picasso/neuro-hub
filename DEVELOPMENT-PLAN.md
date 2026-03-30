# Детальный план разработки NeuroHub MVP

Этот документ содержит пошаговый план разработки платформы NeuroHub согласно функциональной спецификации из MVP.md и архитектурным решениям из ARCHITECTURE-DECISIONS.md.

---

## ЭТАП 0: Инфраструктура и базовая настройка

### 0.1 DevOps и окружение
- [x] Настроить Docker Compose для локальной разработки (PostgreSQL 16, Node 24)
- [x] Создать структуру feature-based модулей в `/app`
- [x] Настроить ESLint 9+ с TypeScript правилами
- [x] Настроить Prettier 3+ для форматирования
- [x] Настроить pre-commit hooks (Husky)
- [x] Создать базовые GitHub Actions workflows для CI/CD
- [x] Настроить Railway для PostgreSQL в production

### 0.2 База данных
- [x] Настроить Knex.js с TypeScript конфигурацией
- [x] Создать базовую миграционную структуру
- [x] Создать seed файлы для тестовых данных
- [x] Настроить connection pooling
- [x] Настроить GIN-индексы для полнотекстового поиска

### 0.3 Базовая архитектура
- [x] Настроить структуру API Routes `/app/api/*`
- [x] Интегрировать `next-swagger-doc` и `@scalar/nextjs-api-reference`
- [x] Создать базовые Zod схемы для валидации
- [x] Настроить middleware для логирования и rate-limiting
- [x] Создать базовую систему обработки ошибок
- [x] Настроить CORS и CSP заголовки

### 0.4 Development Infrastructure
- [x] Debug logger система с conditional logging
- [x] Development Playground для демонстрации компонентов
- [x] Markdown утилита
- [x] Unit тесты для утилит (Jest)

---

## ЭТАП 1: Аутентификация и пользователи

### 1.1 Better Auth интеграция
- [x] Установить и настроить Better Auth 1+
- [x] Настроить cookie-based сессии
- [x] Реализовать регистрацию с email/паролем
- [x] Реализовать вход в систему
- [x] Настроить OAuth провайдеры (GitHub, Google)
- [x] Реализовать восстановление пароля
- [x] Создать middleware для защиты приватных роутов (через proxy.ts)

### 1.2 База данных пользователей
- [x] Миграция таблицы `users` (создана через Better Auth CLI)
- [x] Миграция таблицы `user_profiles` (уже существует)
- [x] Миграция таблицы `sessions` (создана через Better Auth CLI)
- [x] Миграция таблицы `account` для OAuth и credentials (создана через Better Auth CLI)

### 1.3 Верификация email
- [x] Миграция таблицы `verification` (создана через Better Auth CLI)
- [x] API endpoint для отправки верификационного письма (Better Auth)
- [x] API endpoint для подтверждения токена (Better Auth)
- [x] Email шаблон для верификации (React Email)
- [x] Интеграция email сервиса (Resend)

### 1.4 API endpoints для аутентификации
- [x] `POST /api/auth/sign-up/email` - регистрация (Better Auth)
- [x] `POST /api/auth/sign-in/email` - вход (Better Auth)
- [x] `POST /api/auth/sign-out` - выход (Better Auth)
- [x] `POST /api/auth/forget-password` - восстановление пароля (Better Auth)
- [x] `POST /api/auth/reset-password` - сброс пароля (Better Auth)
- [x] `GET /api/auth/get-session` - получение текущей сессии (Better Auth)
- [x] `GET /api/auth/verify-email` - верификация email (Better Auth)

---

## ЭТАП 2: Главная страница и онбординг

### 2.1 Лендинг
- [x] Создать layout для публичных страниц
- [x] Реализовать hero-секцию с CTA кнопками
- [x] Создать раздел с преимуществами платформы
- [x] Реализовать блок кейсов (карточки проектов)
- [x] Создать FAQ с аккордеоном
- [x] Реализовать footer с контактами и соцсетями
- [x] Добавить мобильную адаптацию
- [x] SEO мета-теги и Open Graph

### 2.2 Deploy on Vercel
- [x] Настроить Vercel проект для деплоя (документация готова)

### 2.3 Процесс регистрации (wizard)
- [x] Экран выбора роли (фрилансер/заказчик)
- [x] Экран базовой информации (email, пароль)
- [x] Экран заполнения профиля фрилансера (имя, специализация, навыки)
- [x] Экран заполнения профиля заказчика (имя, компания)
- [x] Экран подтверждения email
- [ ] Экран персональных рекомендаций
- [x] Навигация между шагами wizard
- [x] Прогресс-бар регистрации
- [x] Валидация на каждом шаге
- [x] Обработка ошибок и отображение алертов

### 2.4 База данных для онбординга
- [x] Миграция таблицы `skills` (id, name, category)
- [x] Миграция таблицы `user_skills` (user_id, skill_id, proficiency_level)
- [x] Seed данных для предустановленных навыков (GPT-4, Midjourney и т.д.)

### 2.5 Система уведомлений и алертов
- [x] Интеграция Sonner для toast-уведомлений
- [x] Кастомный severity 'progress' с темизацией
- [x] Overlay для модальных алертов
- [x] Документация с примерами использования

---

## ЭТАП 3: Профиль фрилансера

### 3.1 База данных профиля
- [x] Миграция таблицы `freelancer_profiles` (id UUID, user_id TEXT, hourly_rate, availability, bio/experience)
- [x] Миграция таблицы `portfolio_items` (id UUID, freelancer_profile_id UUID, title, description, media_url, category, tools_used)
- [ ] Миграция таблицы `huggingface_spaces` (id, user_id, space_url, title, description)
- [ ] Миграция таблицы `reviews` (id, project_id, client_id, freelancer_id, rating, comment)

### 3.2 API endpoints профиля фрилансера
- [x] `GET /api/freelancers/:profileId` - получение публичного профиля фрилансера (domain UUID)
- [x] `PUT /api/freelancers/:profileId` - обновление профиля (owner-only, ownership через freelancer_profiles.user_id)
- [x] `GET /api/freelancers/me` - получение/создание профиля текущего фрилансера (authed)
- [x] `GET /api/freelancers/:profileId/portfolio` - получение портфолио
- [x] `POST /api/freelancers/:profileId/portfolio` - добавление работы в портфолио
- [x] `DELETE /api/freelancers/:profileId/portfolio/:itemId` - удаление из портфолио
- [x] `POST /api/blob/portfolio-upload` - direct-upload token exchange для Vercel Blob (owner-only)
- [ ] `GET /api/freelancers/:profileId/reviews` - получение отзывов
- [ ] `GET /api/freelancers/:profileId/stats` - статистика фрилансера
- [ ] `POST /api/freelancers/:profileId/huggingface` - добавление HF Space
- [ ] `DELETE /api/freelancers/:profileId/huggingface/:spaceId` - удаление HF Space

### 3.3 UI профиля фрилансера
- [x] Страница профиля с основной информацией (публичная)
- [x] Секция навыков с тегами и уровнями владения
- [x] Галерея портфолио (изображения, видео, аудио, PDF)
- [x] Модальное окно детального просмотра работы из портфолио
- [x] Секция отзывов (UI заглушка)
- [x] Секция статистики (UI заглушка)
- [x] Dashboard `/dashboard` с guard-redirect на `/login?next=/dashboard`
- [x] Форма редактирования профиля фрилансера
- [x] Форма добавления/удаления работ в портфолио (с загрузкой медиа в Vercel Blob)
- [ ] Встраивание Hugging Face Spaces через iframe

### 3.4 Система рейтинга
- [ ] Расчёт среднего рейтинга
- [ ] Распределение оценок по звёздам
- [ ] Возможность ответа на отзыв

---

## ЭТАП 4: Проекты и поиск для фрилансера

### 4.1 База данных проектов
- [x] Миграция таблицы `projects` (id, client_id, title, description, category, budget_type, budget_min, budget_max, deadline, status, created_at)
- [x] Миграция таблицы `project_skills` (project_id, skill_id)
- [x] Миграция таблицы `project_attachments` (id, project_id, filename, file_url)
- [x] Миграция таблицы `applications` (id, project_id, freelancer_id, cover_letter, proposed_price, proposed_deadline, status, created_at)

### 4.2 API endpoints проектов
- [x] `GET /api/projects` - лента проектов с фильтрами
- [x] `GET /api/projects/:id` - детальная информация о проекте
- [x] `POST /api/projects` - создание проекта (заказчик)
- [x] `PUT /api/projects/:id` - обновление проекта
- [x] `DELETE /api/projects/:id` - удаление проекта
- [x] `POST /api/projects/:id/applications` - подача заявки (фрилансер)
- [x] `GET /api/applications` - список заявок фрилансера
- [x] `DELETE /api/applications/:id` - отзыв заявки

### 4.3 UI поиска проектов
- [x] Страница ленты проектов
- [x] Карточка проекта в ленте
- [x] Фильтры (категория, бюджет, срок, уровень)
- [x] Сортировка (дата, релевантность, бюджет)
- [ ] Бесконечный скролл с пагинацией
- [x] Детальная страница проекта
- [x] Форма подачи заявки
- [x] Страница истории заявок (Мои заявки)
- [ ] Шаблоны заявок (сохранение/загрузка)

### 4.4 Умные уведомления
- [ ] Миграция таблицы `notification_preferences` (user_id, email_daily, email_instant, push_enabled)
- [ ] Миграция таблицы `notifications` (id, user_id, type, content, read_at, created_at)
- [ ] API endpoint `POST /api/notifications/preferences` - настройка уведомлений
- [ ] API endpoint `GET /api/notifications` - получение уведомлений
- [ ] API endpoint `PUT /api/notifications/:id/read` - отметка прочитанным
- [ ] Алгоритм подборки релевантных проектов
- [ ] Email digest для уведомлений
- [ ] Push уведомления в браузере
- [ ] Бейдж с количеством непрочитанных

---

## ЭТАП 5: Личный кабинет заказчика

### 5.1 База данных заказчика
- [ ] Миграция таблицы `client_profiles` (user_id, company_name, company_role, typical_tasks)
- [ ] Миграция таблицы `project_templates` (id, client_id, template_name, template_data)
- [ ] Миграция таблицы `invitations` (id, project_id, freelancer_id, message, status, created_at)
- [ ] Миграция таблицы `favorite_freelancers` (client_id, freelancer_id, created_at)

### 5.2 API endpoints заказчика
- [ ] `GET /api/clients/:id` - профиль заказчика
- [ ] `PUT /api/clients/:id` - обновление профиля
- [ ] `GET /api/freelancers` - каталог фрилансеров с фильтрами
- [ ] `POST /api/invitations` - приглашение фрилансера
- [ ] `GET /api/projects/:id/applications` - просмотр откликов на проект
- [ ] `PUT /api/applications/:id/status` - принятие/отклонение заявки
- [ ] `POST /api/favorite-freelancers` - добавление в избранное
- [ ] `GET /api/favorite-freelancers` - список избранных
- [ ] `POST /api/project-templates` - сохранение шаблона проекта
- [ ] `GET /api/project-templates` - список шаблонов

### 5.3 UI создания проекта
- [ ] Wizard создания проекта (многошаговая форма)
- [ ] Шаг 1: Название и категория
- [ ] Шаг 2: Описание и требования (с markdown)
- [ ] Шаг 3: Бюджет (фиксированный/почасовой)
- [ ] Шаг 4: Срок исполнения
- [ ] Шаг 5: Прикрепление файлов ТЗ
- [ ] Превью проекта перед публикацией
- [ ] Сохранение как шаблона
- [ ] Загрузка из шаблона

### 5.4 UI поиска исполнителей
- [ ] Страница каталога фрилансеров
- [ ] Карточка фрилансера в каталоге
- [ ] Фильтры (категория, навыки, рейтинг, цена, доступность)
- [ ] Сортировка (рейтинг, цена, кол-во проектов)
- [ ] Детальная страница профиля фрилансера (view only)
- [ ] Кнопка приглашения в проект
- [ ] Список избранных фрилансеров

### 5.5 UI управления проектами
- [ ] Страница списка проектов заказчика
- [ ] Страница откликов на конкретный проект
- [ ] Сортировка откликов (релевантность, цена, рейтинг, дата)
- [ ] Карточка отклика с информацией о фрилансере
- [ ] Кнопки принятия/отклонения заявки
- [ ] Интерфейс приёма работы
- [ ] Форма оставления отзыва и рейтинга

---

## ЭТАП 6: Управление заказами (Kanban)

### 6.1 База данных заказов
- [ ] Миграция таблицы `orders` (id, project_id, freelancer_id, client_id, status, price, started_at, completed_at)
- [ ] Миграция таблицы `order_messages` (id, order_id, sender_id, message, attachments, created_at)
- [ ] Миграция таблицы `order_deliverables` (id, order_id, files, description, submitted_at)
- [ ] Миграция таблицы `order_revisions` (id, order_id, revision_number, feedback, created_at)
- [ ] Миграция таблицы `time_tracking` (id, order_id, started_at, stopped_at, duration_seconds)

### 6.2 API endpoints заказов
- [ ] `GET /api/orders` - список заказов с фильтром по статусу
- [ ] `GET /api/orders/:id` - детальная информация о заказе
- [ ] `PUT /api/orders/:id/status` - обновление статуса заказа
- [ ] `POST /api/orders/:id/messages` - отправка сообщения в чате
- [ ] `GET /api/orders/:id/messages` - получение сообщений
- [ ] `POST /api/orders/:id/deliverables` - сдача работы
- [ ] `POST /api/orders/:id/revisions` - запрос правок
- [ ] `POST /api/orders/:id/complete` - завершение заказа
- [ ] `POST /api/orders/:id/time-tracking` - трекинг времени (старт/стоп)
- [ ] `GET /api/orders/:id/time-tracking` - получение записей времени

### 6.3 UI Kanban доски
- [ ] Компонент Kanban доски с колонками (Входящие, В работе, На проверке, Завершённые)
- [ ] Карточка заказа в Kanban
- [ ] Drag & drop между колонками
- [ ] Детальная страница заказа
- [ ] Встроенный мессенджер с реальным временем
- [ ] Компонент отправки файлов в чате
- [ ] Push уведомления о новых сообщениях
- [ ] Трекер времени (старт/стоп/пауза)
- [ ] Форма сдачи работы
- [ ] Интерфейс просмотра результата работы
- [ ] Форма запроса правок
- [ ] Счётчик оставшихся бесплатных правок
- [ ] Прогресс-бар выполнения заказа

---

## ЭТАП 7: Интеграции и дополнительные функции

### 7.1 Hugging Face Spaces
- [ ] Валидация URL Hugging Face Space
- [ ] Парсинг информации о Space (название, описание)
- [ ] Компонент встраивания iframe с sandbox атрибутами
- [ ] Обработка ошибок загрузки Space
- [ ] Placeholder для загрузки Space

### 7.2 Загрузка и хранение файлов
- [x] Выбрать решение для хранения файлов (Cloudflare R2 vs Vercel Blob)
- [x] API endpoint `POST /api/upload` - загрузка файла
- [x] Валидация типов и размеров файлов
- [x] Оптимизация изображений (Next.js Image)
- [ ] Генерация превью для видео
- [ ] CDN интеграция для статики

### 7.3 Полнотекстовый поиск
- [ ] Создать GIN-индексы для PostgreSQL полнотекстового поиска
- [ ] Функция индексации проектов (tsvector)
- [ ] API endpoint `GET /api/search/projects` с полнотекстовым поиском
- [ ] API endpoint `GET /api/search/freelancers` с полнотекстовым поиском
- [ ] UI компонент поиска с автодополнением

### 7.4 Real-time обновления
- [ ] Выбрать подход для real-time (Server-Sent Events vs WebSockets)
- [ ] Реализовать real-time для мессенджера
- [ ] Реализовать real-time для уведомлений
- [ ] Реализовать real-time для статусов заказов

---

## ЭТАП 8: Аналитика и метрики

### 8.1 База данных аналитики
- [ ] Миграция таблицы `analytics_events` (id, user_id, event_type, event_data, created_at)
- [ ] Миграция таблицы `platform_metrics` (date, metric_name, metric_value)

### 8.2 Сбор метрик
- [ ] Трекинг регистраций (конверсия)
- [ ] Трекинг создания проектов
- [ ] Трекинг откликов
- [ ] Трекинг успешных заказов
- [ ] Расчёт DAU/WAU
- [ ] Расчёт времени до первого заказа
- [ ] Интеграция Google Analytics
- [ ] Дашборд метрик для администратора

---

## ЭТАП 9: Тестирование и QA

### 9.1 Unit тесты
- [ ] Тесты для API endpoints (Jest + Supertest)
- [ ] Тесты для бизнес-логики
- [ ] Тесты для валидационных схем Zod
- [ ] Тесты для утилитных функций

### 9.2 Integration тесты
- [ ] Тесты для аутентификации flow
- [ ] Тесты для создания и управления проектами
- [ ] Тесты для системы откликов
- [ ] Тесты для системы заказов

### 9.3 E2E тесты
- [ ] Настроить Playwright для E2E тестов
- [ ] Тесты для регистрации и верификации
- [ ] Тесты для создания проекта
- [ ] Тесты для подачи заявки
- [ ] Тесты для выполнения заказа

### 9.4 Линтинг и форматирование
- [ ] Запуск `npm run lint:ci` перед каждым коммитом
- [ ] Проверка TypeScript типов
- [ ] Prettier форматирование

---

## ЭТАП 10: Деплой и мониторинг

### 10.1 Production деплой
- [x] Настроить production окружение на Vercel (документация готова)
- [x] Настроить PostgreSQL на Railway (скрипты + CI/CD готовы)
- [x] Настроить environment variables (документация готова)
- [ ] Настроить custom domain (инструкции в VERCEL-SETUP.md)
- [ ] Настроить SSL сертификаты (автоматически через Vercel)
- [ ] Настроить Cloudflare CDN

### 10.2 Мониторинг
- [ ] Настроить логирование (Winston или Pino)
- [ ] Настроить мониторинг ошибок (Sentry)
- [ ] Настроить мониторинг производительности (Vercel Analytics)
- [ ] Настроить алерты для критических ошибок
- [x] Настроить backup БД на Railway (скрипты готовы)

### 10.3 Документация
- [x] Scalar API документация (/api/reference)
- [x] README с инструкциями по запуску и деплою
- [x] Документация по деплою (Vercel + Railway)
- [ ] Документация архитектуры
- [ ] Документация для контрибьюторов

---

## Связанные документы

- [MVP.md](./MVP.md) - Функциональная спецификация
- [ARCHITECTURE-DECISIONS.md](./ARCHITECTURE-DECISIONS.md) - Архитектурные решения
