# MOCK-PROJECTS

Синтетические проекты и заявки для **local** / **QA**: фиксированные UUID, **upsert**-сид. Тексты преимущественно **RU**; `client_id` — только `mock_cl_01`…`mock_cl_05` из [MOCK-USERS.md](MOCK-USERS.md). Вложения: **относительные** пути `/mock-projects/...` (файлы в `public/mock-projects/`); имена файлов на диске — префикс `**attachment-`**.

## Сид в БД

1. `yarn db:migrate`
2. `yarn db:seed` (справочники `skills` / `languages`)
3. `yarn db:seed:mock-users` — **обязателен** (клиенты и фрилансеры с `user_skills`)
4. `yarn db:seed:mock-projects` — читает YAML ниже, upsert `projects`, `project_skills`, `project_attachments`, `applications`.


| Variable                        | Назначение                                                          |
| ------------------------------- | ------------------------------------------------------------------- |
| `DATABASE_URL`                  | Подключение к Postgres.                                             |
| `MOCK_SEED_CONFIRM` / `--force` | Как в mock-users: подтверждение, если `DATABASE_URL` не localhost.  |
| `NEXT_PUBLIC_APP_URL`           | Не обязателен; вложения в данных заданы относительными public-path. |


**10** проектов (по 2 на клиента), **15** вложений на **8** проектах, **15** уникальных файлов в `public/mock-projects/`. Каждая заявка от фрилансера согласована с **пересечением** `user_skills` и `project_skills` (см. `src/lib/dev/mock-projects-seed.ts`). Немедиа-вложения (PDF/DOCX/MP4/M4A) генерируются скриптом `yarn mock-projects:binaries` (см. [scripts/dev/generate-mock-project-binaries.ts](scripts/dev/generate-mock-project-binaries.ts)).

```yaml
projects:
  - id: d0000000-0000-4000-8000-000000000001
    client_id: mock_cl_01
    title: "Концепт-арт для визуальной линии роботов (пилот, NDА)"
    description: "Нужны ключевые кадры и мудборд для внутреннего пилота робототехнической линии. Стиль — near-future, без нарушения существующего брендбука. Сроки жёсткие, важны итерации по обратной связи инженеров. Результат в виде high-res stills и краткого описания промпт-пайплайна для команды. Только иллюстративные материалы, без публичного релиза до согласования. Работы в Adobe / совместимых слоях приветствуются, формат handoff согласуем в kickoff-звонке."
    category: image_generation
    experience_level: middle
    budget_type: fixed
    budget_min: 2200
    budget_max: 9000
    deadline: "2024-10-20T10:00:00.000Z"
    status: draft
  - id: d0000000-0000-4000-8000-000000000002
    client_id: mock_cl_01
    title: "Корпоративный RAG-ассистент по регламентам и инцидентам"
    description: "Пилот: поисковый ассистент по внутренним SOP, журналу инцидентов и чертежам. Нужна схема RAG, границы доверия, логирование и политика отката на человека. Предпочтение стеку с открытой кастомизацией, деплой в сегментed окружение. Критерии: измеримая релевантность на наборе hold-out-вопросов и явные отказы, когда ссылки не найдены. Интеграция с существующим IDP обсуждается на втором этапе; первый — рабочий vertical slice. Документация handoff и передача runbook сопровождающему персоналу обязательны."
    category: programming
    experience_level: senior
    budget_type: fixed
    budget_min: 18000
    budget_max: 42000
    deadline: "2026-11-10T00:00:00.000Z"
    status: published
  - id: d0000000-0000-4000-8000-000000000003
    client_id: mock_cl_02
    title: "LLM-функции в B2B-мобильном приложении (MVP+1)"
    description: "Расширяем существующий B2B-клиент: встроенные подсказки, саммари длинных сессий, безопасные шаблоны с ревью. Нужен практичный план feature flags, fallback UX и тест-кейсы для store review. Соблюдение внутренних design tokens и iOS/Android-гайдов. Метрики: время до первой полезной рекомендации, уровень явных сбоев, отток. Работать тесно с product и compliance; поставка по спринтам с демо на dev-сборках. Code review и краткое API-задание для интеграции с существующим бэкендом — по согласованию."
    category: programming
    experience_level: middle
    budget_type: fixed
    budget_min: 14000
    budget_max: 28000
    deadline: "2026-06-30T12:00:00.000Z"
    status: published
  - id: d0000000-0000-4000-8000-000000000004
    client_id: mock_cl_02
    title: "Ролик 15 с для performance-кампании (соцсети)"
    description: "Нужен сжатый ролик 15–20 с для запуска в performance-каналах. Исходник — сценарий A/B, два героя, финальный packshot с логотипом. Форматы 9:16 и 1:1, без правок к музыке после сдачи. Цвет и темп — в референсах в приложении, цветокор в DaVinci/эквивалент. Титры и CTA в финальном pass. Срок согласований: две волны. Нужен прозрачный list правок в таблице и ссылка на проект в таймкоде. Субтитры (burn-in и SRT) в комплекте."
    category: video_generation
    experience_level: middle
    budget_type: hourly
    budget_min: 55
    budget_max: 110
    deadline: "2026-05-18T14:00:00.000Z"
    status: in_progress
  - id: d0000000-0000-4000-8000-000000000005
    client_id: mock_cl_03
    title: "Набор key visuals для весенней бренд-кампании"
    description: "Серия статичных креативов и героев для OOH и digital. Согласованная палитра, три концепции с мягким merge в финальные макеты. Поставка: PNG/TIFF master, варианты 3000px и 1080px, отдельные слои для DCO. Стилистика — тёплый light tech, фотореализм без client trademarks из референсов-конкурентов. Нужен короткий гайд по тону промптов и post для дальнейшей внутренней копии. Сопровождаем коммуникациями: два круга правок, финальный lock под медиа-план. Дедлайн привязан к booking слотов, перенос только по письменному соглашению."
    category: image_generation
    experience_level: lead
    budget_type: fixed
    budget_min: 25000
    budget_max: 60000
    deadline: "2026-12-20T00:00:00.000Z"
    status: published
  - id: d0000000-0000-4000-8000-000000000006
    client_id: mock_cl_03
    title: "Доработка фоторетуши для e-commerce (приостановлено)"
    description: "Кампания перенесена бренд-группой, рынок пересмотрел сроки. Краткое бриф-место: батч-обработка каталожных packshot с сохранением белого фона и калиброванных цветов. Глубина съёмки нестабильна — требуется согласованный LUT и QA на выбранных SKU. Проект не принимает заявок до re-open; бюджет и объём требуют re-scope. Статусы заявок при сиде не вводим — заказ отменён на уровне проекта. Этот бриф оставлен в QA как cancelled для фильтрации."
    category: image_generation
    experience_level: junior
    budget_type: fixed
    budget_min: 3000
    budget_max: 8000
    deadline: "2023-12-01T00:00:00.000Z"
    status: cancelled
  - id: d0000000-0000-4000-8000-000000000007
    client_id: mock_cl_04
    title: "RAG и политика цитирования в регулируемой среде"
    description: "Дизайн RAG-контурa для внутренних Q&A: классификация вопросов, цитаты с якорями, запреты на кросс-tenant, журнал просмотров. Сравнение с baseline keyword и измеряемыми regressive tests. Модель не размещается публично. Нужен чёткий threat model, список зависимостей и handoff runbook. Учесть песочницы, staging и path к prod по гейтам. Срок — под годовой аудит, но MVP раньше — см. дедлайн. Участие в security review плановое в окне, указанном в MSAs."
    category: programming
    experience_level: lead
    budget_type: fixed
    budget_min: 32000
    budget_max: 72000
    deadline: "2026-09-05T12:00:00.000Z"
    status: published
  - id: d0000000-0000-4000-8000-000000000008
    client_id: mock_cl_04
    title: "Интеграция ETL-коннекторов с LLM fallback и мониторингом"
    description: "Миграция пакетов: коннекторы к data lake, idempotent backfill, мониторинг латентности. LLM-шаги только в помеченных песочных пайплайнах; прод — без generative, кроме опционального авто-резюме ошибок. Набор e2e smoke и алерты в существующую очередь. Сопроводить playbooks: инцидент, rollback, freeze. Документация для дежурной смены и список контактов владельцев. Проект в статусе completed в мок-данных для сценариев истории и read-only витрин."
    category: programming
    experience_level: senior
    budget_type: fixed
    budget_min: 24000
    budget_max: 48000
    deadline: "2025-02-15T00:00:00.000Z"
    status: completed
  - id: d0000000-0000-4000-8000-000000000009
    client_id: mock_cl_05
    title: "Черновик: пилот in-store Q&A (без заявок в мок-данных)"
    description: "Ранний черновик для пилота у киоска: сценарии, FAQ, handoff в службу. Не публикуем до внутреннего security review. Бюджет — плейсхолдер. Не принимаем mock-заявки в сид-наборе; используем как тест `draft` без `applications` и без вложений. После re-open заменим статус и сроки. Текст достаточен для прохождения min длины описания в валидации. Язык интерфейса: JP/EN, контент-точка — store ops."
    category: text_generation
    experience_level: middle
    budget_type: fixed
    budget_min: 4000
    budget_max: 12000
    deadline: "2026-10-01T00:00:00.000Z"
    status: draft
  - id: d0000000-0000-4000-8000-00000000000a
    client_id: mock_cl_05
    title: "Спринт по настройке промпт-системы и playbooks"
    description: "Сжатый engagement: ревизия prompt library, playbooks handoff, метрики качества ответа и A/B-листы. Не замена стратегии, а настройка исполнения: шаблоны, сценарии сбоев, владельцы, cadence retrain. Сопроводить one-pager критериев приёмки и план внедрения на 4 недель. Согласований с L&D и ops — в процессе; этот пакет готов к отбору. Дедлайн — плановый freeze перед сезоном. Стоимость fixed, объём в периметре двух workshop и двух поставок."
    category: consulting
    experience_level: senior
    budget_type: fixed
    budget_min: 9500
    budget_max: 22000
    deadline: "2026-07-22T00:00:00.000Z"
    status: published

project_skills:
  - project_id: d0000000-0000-4000-8000-000000000001
    skill_id: 00000000-0000-4000-8000-000000000101
  - project_id: d0000000-0000-4000-8000-000000000001
    skill_id: 00000000-0000-4000-8000-000000000102
  - project_id: d0000000-0000-4000-8000-000000000001
    skill_id: 00000000-0000-4000-8000-000000000105
  - project_id: d0000000-0000-4000-8000-000000000002
    skill_id: 00000000-0000-4000-8000-000000000401
  - project_id: d0000000-0000-4000-8000-000000000002
    skill_id: 00000000-0000-4000-8000-000000000406
  - project_id: d0000000-0000-4000-8000-000000000002
    skill_id: 00000000-0000-4000-8000-000000000402
  - project_id: d0000000-0000-4000-8000-000000000002
    skill_id: 00000000-0000-4000-8000-000000000405
  - project_id: d0000000-0000-4000-8000-000000000003
    skill_id: 00000000-0000-4000-8000-000000000001
  - project_id: d0000000-0000-4000-8000-000000000003
    skill_id: 00000000-0000-4000-8000-000000000402
  - project_id: d0000000-0000-4000-8000-000000000003
    skill_id: 00000000-0000-4000-8000-000000000501
  - project_id: d0000000-0000-4000-8000-000000000004
    skill_id: 00000000-0000-4000-8000-000000000201
  - project_id: d0000000-0000-4000-8000-000000000004
    skill_id: 00000000-0000-4000-8000-000000000202
  - project_id: d0000000-0000-4000-8000-000000000004
    skill_id: 00000000-0000-4000-8000-000000000204
  - project_id: d0000000-0000-4000-8000-000000000005
    skill_id: 00000000-0000-4000-8000-000000000101
  - project_id: d0000000-0000-4000-8000-000000000005
    skill_id: 00000000-0000-4000-8000-000000000103
  - project_id: d0000000-0000-4000-8000-000000000005
    skill_id: 00000000-0000-4000-8000-000000000106
  - project_id: d0000000-0000-4000-8000-000000000006
    skill_id: 00000000-0000-4000-8000-000000000102
  - project_id: d0000000-0000-4000-8000-000000000006
    skill_id: 00000000-0000-4000-8000-000000000105
  - project_id: d0000000-0000-4000-8000-000000000007
    skill_id: 00000000-0000-4000-8000-000000000406
  - project_id: d0000000-0000-4000-8000-000000000007
    skill_id: 00000000-0000-4000-8000-000000000405
  - project_id: d0000000-0000-4000-8000-000000000007
    skill_id: 00000000-0000-4000-8000-000000000401
  - project_id: d0000000-0000-4000-8000-000000000007
    skill_id: 00000000-0000-4000-8000-000000000402
  - project_id: d0000000-0000-4000-8000-000000000008
    skill_id: 00000000-0000-4000-8000-000000000401
  - project_id: d0000000-0000-4000-8000-000000000008
    skill_id: 00000000-0000-4000-8000-000000000404
  - project_id: d0000000-0000-4000-8000-000000000008
    skill_id: 00000000-0000-4000-8000-000000000402
  - project_id: d0000000-0000-4000-8000-000000000009
    skill_id: 00000000-0000-4000-8000-000000000002
  - project_id: d0000000-0000-4000-8000-000000000009
    skill_id: 00000000-0000-4000-8000-000000000003
  - project_id: d0000000-0000-4000-8000-00000000000a
    skill_id: 00000000-0000-4000-8000-000000000501
  - project_id: d0000000-0000-4000-8000-00000000000a
    skill_id: 00000000-0000-4000-8000-000000000502
  - project_id: d0000000-0000-4000-8000-00000000000a
    skill_id: 00000000-0000-4000-8000-000000000503

project_attachments:
  - id: f0000000-0000-4000-8000-000000000001
    project_id: d0000000-0000-4000-8000-000000000002
    filename: attachment-brief-01.jpg
    file_url: /mock-projects/attachment-brief-01.jpg
    mime_type: image/jpeg
    file_size_bytes: 214798
  - id: f0000000-0000-4000-8000-000000000002
    project_id: d0000000-0000-4000-8000-000000000002
    filename: attachment-brief-02.jpg
    file_url: /mock-projects/attachment-brief-02.jpg
    mime_type: image/jpeg
    file_size_bytes: 205149
  - id: f0000000-0000-4000-8000-000000000003
    project_id: d0000000-0000-4000-8000-000000000003
    filename: attachment-spec-mobile-03.jpg
    file_url: /mock-projects/attachment-spec-mobile-03.jpg
    mime_type: image/jpeg
    file_size_bytes: 210106
  - id: f0000000-0000-4000-8000-000000000004
    project_id: d0000000-0000-4000-8000-000000000005
    filename: attachment-moodboard-04.jpg
    file_url: /mock-projects/attachment-moodboard-04.jpg
    mime_type: image/jpeg
    file_size_bytes: 271875
  - id: f0000000-0000-4000-8000-000000000005
    project_id: d0000000-0000-4000-8000-000000000005
    filename: attachment-spec-ooh-05.jpg
    file_url: /mock-projects/attachment-spec-ooh-05.jpg
    mime_type: image/jpeg
    file_size_bytes: 216660
  - id: f0000000-0000-4000-8000-000000000006
    project_id: d0000000-0000-4000-8000-000000000007
    filename: attachment-rag-citation-brief.jpg
    file_url: /mock-projects/attachment-rag-citation-brief.jpg
    mime_type: image/jpeg
    file_size_bytes: 170214
  - id: f0000000-0000-4000-8000-000000000007
    project_id: d0000000-0000-4000-8000-000000000008
    filename: attachment-etl-01.jpg
    file_url: /mock-projects/attachment-etl-01.jpg
    mime_type: image/jpeg
    file_size_bytes: 202521
  - id: f0000000-0000-4000-8000-000000000008
    project_id: d0000000-0000-4000-8000-000000000002
    filename: attachment-rag-nda-brief.pdf
    file_url: /mock-projects/attachment-rag-nda-brief.pdf
    mime_type: application/pdf
    file_size_bytes: 2275
  - id: f0000000-0000-4000-8000-000000000009
    project_id: d0000000-0000-4000-8000-000000000007
    filename: attachment-rag-threat-brief.pdf
    file_url: /mock-projects/attachment-rag-threat-brief.pdf
    mime_type: application/pdf
    file_size_bytes: 2168
  - id: f0000000-0000-4000-8000-000000000010
    project_id: d0000000-0000-4000-8000-000000000003
    filename: attachment-mobile-prd-excerpt.docx
    file_url: /mock-projects/attachment-mobile-prd-excerpt.docx
    mime_type: application/vnd.openxmlformats-officedocument.wordprocessingml.document
    file_size_bytes: 2643
  - id: f0000000-0000-4000-8000-000000000011
    project_id: d0000000-0000-4000-8000-000000000003
    filename: attachment-mobile-integration-checklist.docx
    file_url: /mock-projects/attachment-mobile-integration-checklist.docx
    mime_type: application/vnd.openxmlformats-officedocument.wordprocessingml.document
    file_size_bytes: 2362
  - id: f0000000-0000-4000-8000-000000000012
    project_id: d0000000-0000-4000-8000-00000000000a
    filename: attachment-prompt-playbook.docx
    file_url: /mock-projects/attachment-prompt-playbook.docx
    mime_type: application/vnd.openxmlformats-officedocument.wordprocessingml.document
    file_size_bytes: 2394
  - id: f0000000-0000-4000-8000-000000000013
    project_id: d0000000-0000-4000-8000-000000000004
    filename: attachment-video-perf-hero-a.mp4
    file_url: /mock-projects/attachment-video-perf-hero-a.mp4
    mime_type: video/mp4
    file_size_bytes: 3970
  - id: f0000000-0000-4000-8000-000000000014
    project_id: d0000000-0000-4000-8000-000000000004
    filename: attachment-video-perf-hero-b.mp4
    file_url: /mock-projects/attachment-video-perf-hero-b.mp4
    mime_type: video/mp4
    file_size_bytes: 3325
  - id: f0000000-0000-4000-8000-000000000015
    project_id: d0000000-0000-4000-8000-000000000009
    filename: attachment-store-faq-sample.m4a
    file_url: /mock-projects/attachment-store-faq-sample.m4a
    mime_type: audio/mp4
    file_size_bytes: 25655

applications:
  # d...002 RAG (5)
  - id: e0000000-0000-4000-8000-000000000001
    project_id: d0000000-0000-4000-8000-000000000002
    freelancer_id: mock_ai_fl_03
    cover_letter: "Беру пилот RAG для регламентов: handoff, guardrails, цитирование и явные «не знаю». Сделаю вертикальный slice, метрики на hold-out, runbook. Опыт LangChain, RAG и vector stores — в портфолио; готова к звонку на неделе. Соответствие вашим SOP-источникам — через согласованные коннекторы и песочницу, без публичных весов. Оценка — в рамках верхней границы бюджетного окна. Таймзона EU friendly."
    proposed_price: 36000
    proposed_deadline: "2026-10-20T00:00:00.000Z"
    status: submitted
  - id: e0000000-0000-4000-8000-000000000002
    project_id: d0000000-0000-4000-8000-000000000002
    freelancer_id: mock_ai_fl_10
    cover_letter: "RAG+регулирование: схема цитирования, red-team чек-лист и тонкая настройка без overclaim. Сверю политику токенов, audit trail и freeze-процедуры. Fine-tuning применяю селективно, базово — RAG+rerank. Готов встроиться в security review, документы — Confluence/Notion по соглашению. Срок — по вашему major milestone. Фиксирую цену 38k с явным scope, расширения — отдельно."
    proposed_price: 38000
    proposed_deadline: "2026-10-15T00:00:00.000Z"
    status: submitted
  - id: e0000000-0000-4000-8000-000000000003
    project_id: d0000000-0000-4000-8000-000000000002
    freelancer_id: mock_ai_fl_11
    cover_letter: "Предлагаю UX-логика оркестрации: LangGraph/OpenAI+Anthropic API, явные handoff, метрики latency. Для вашей регулируемой среды важен контроль версий и staging — включу. Работал(а) с B2B пайплайнами и multi-agent, но в этой фазе сфокусируюсь на RAG+policy. 34k, гибкий план волнами. Созвон — в любой день, кроме пятницы вечер EU."
    proposed_price: 34000
    proposed_deadline: "2026-10-25T00:00:00.000Z"
    status: shortlisted
  - id: e0000000-0000-4000-8000-000000000004
    project_id: d0000000-0000-4000-8000-000000000002
    freelancer_id: mock_ai_fl_02
    cover_letter: "Мобайл + API — моя зона. Реализую RAG-слой как BFF, фич-флаги, fallback UX, телеметрию. OpenAI API и best practices по ключам, без утечек. Готов(а) подключить ваш IDP, когда дадите spec. 35000, быстрее first demo за три спринта. Сопровожу A/B-листы с PM. Завершал(а) похожий B2B контур — ссылки в профиле."
    proposed_price: 35000
    proposed_deadline: "2026-10-18T00:00:00.000Z"
    status: accepted
  - id: e0000000-0000-4000-8000-000000000005
    project_id: d0000000-0000-4000-8000-000000000002
    freelancer_id: mock_ai_fl_14
    cover_letter: "Prompt systems + интеграция API: покрою RAG-ассистента с точки зрения playbooks, prompt eval и regression pack. 402 и GPT-стек в работе, готов(а) к code-level ревью с бэкендом. 32000, если ок по объёму без отдельного SRE. Timezone US/ET. Ответ в течение 24h."
    proposed_price: 32000
    proposed_deadline: "2026-10-30T00:00:00.000Z"
    status: rejected
  # d...003 mobile B2B (4)
  - id: e0000000-0000-4000-8000-000000000006
    project_id: d0000000-0000-4000-8000-000000000003
    freelancer_id: mock_ai_fl_02
    cover_letter: "B2B mobile LLM-фичи: онбординг, саммари, feature flags, метрики — делал(а) ранее, кейсы в портфолио. 26000, три спринта до первого store-ready slice. App Review — чек-лист готов. OpenAI API + SwiftUI-адаптер, Android — через общий spec. Созвон — в первый удобный день, Helsinki ±2h. Готов(а) к NDA day one."
    proposed_price: 26000
    proposed_deadline: "2026-07-15T00:00:00.000Z"
    status: accepted
  - id: e0000000-0000-4000-8000-000000000007
    project_id: d0000000-0000-4000-8000-000000000003
    freelancer_id: mock_ai_fl_07
    cover_letter: "Интеграция с LLM как часть data/API слоя: Claude+OpenAI, явные схемы ответа, idempotency, алерты. 24000, быстрее, если dev-ключи выданы. Работал(а) с B2B контуром, совместно с product. Готов(а) к review compliance. Timezone CA — overlap с EU утром. Тест-план в приложении."
    proposed_price: 24000
    proposed_deadline: "2026-07-20T00:00:00.000Z"
    status: submitted
  - id: e0000000-0000-4000-8000-000000000008
    project_id: d0000000-0000-4000-8000-000000000003
    freelancer_id: mock_ai_fl_11
    cover_letter: "Оркестрация+API-обвязка для мобильного клиента. LangGraph не обязателен, но open to. 23000, фокус на устойчивости и handoff. Готов(а) workshop на месте, если требуется. Сроки — вписываюсь в ваши спринты, без плавающей цены до lock scope. Рефатить legacy — вне first slice."
    proposed_price: 23000
    proposed_deadline: "2026-07-18T00:00:00.000Z"
    status: submitted
  - id: e0000000-0000-4000-8000-000000000009
    project_id: d0000000-0000-4000-8000-000000000003
    freelancer_id: mock_ai_fl_15
    cover_letter: "AI strategy+prompt stack для моб. продукта — могу, но в этом тендере откликнулся(ась) больше как strategy+training, чем iOS-имплемента. После внутренней приоритизации **отзываю** заявку, чтобы не задерживать вас. Спасибо за просмотр; с радостью в другом контуре. Удачи с mobile MVP."
    proposed_price: 21000
    proposed_deadline: null
    status: withdrawn
  # d...004 video (2)
  - id: e0000000-0000-4000-8000-00000000000a
    project_id: d0000000-0000-4000-8000-000000000004
    freelancer_id: mock_ai_fl_06
    cover_letter: "15–20 с performance: Runway+Resolve, CTA и packshot по рефу. 4200 (fixed) или экв. по вашим часам, готов(а) дать time estimate после storyboard. Два пакета форматов, сабтитры SRT+burn. Волны правок — в таблице, как просили. Timezone US Pacific. Ссылка на похожий ролик — в портфолио."
    proposed_price: 4200
    proposed_deadline: "2026-05-10T00:00:00.000Z"
    status: submitted
  - id: e0000000-0000-4000-8000-00000000000b
    project_id: d0000000-0000-4000-8000-000000000004
    freelancer_id: mock_ai_fl_13
    cover_letter: "Синк-аудио+видео+генератив: ElevenLabs/Suno+Resolve, 202-стэк. Ролик 15с и вертикали 9:16 — в практике. 3900, быстрее, если нарратив frozen. D-ID при необходимости для b-roll, без лишнего. Готов(а) к timecode-правкам, как в брифе. ASIA TZ."
    proposed_price: 3900
    proposed_deadline: "2026-05-12T00:00:00.000Z"
    status: shortlisted
  # d...005 campaign visuals (5)
  - id: e0000000-0000-4000-8000-00000000000c
    project_id: d0000000-0000-4000-8000-000000000005
    freelancer_id: mock_ai_fl_01
    cover_letter: "Key art и мудборд: Midjourney+SD+пост в PS, DCO-слои отдельно. 45000, два круга правок в смете. OOH+master 3000/1080 — в стандарте. Гайд по тону промптов — в комплекте. US Pacific, митинги EU утром. Нужны locked hex из брендбука, если есть, до старта."
    proposed_price: 45000
    proposed_deadline: "2026-11-30T00:00:00.000Z"
    status: submitted
  - id: e0000000-0000-4000-8000-00000000000d
    project_id: d0000000-0000-4000-8000-000000000005
    freelancer_id: mock_ai_fl_04
    cover_letter: "DALL·E+Firefly+retouch, фотореал без чужих ТМ. 52000 с расширенной пост-нормализацией цвета. 3 концепции, merge в 2 master — как в брифе. India IST, оверлап US/EU. Готов(а) к жёсткому QA по SKU, если поставите ref-стилль."
    proposed_price: 52000
    proposed_deadline: "2026-12-01T00:00:00.000Z"
    status: submitted
  - id: e0000000-0000-4000-8000-00000000000e
    project_id: d0000000-0000-4000-8000-000000000005
    freelancer_id: mock_ai_fl_05
    cover_letter: "Аватар-паки+key visuals, но этот бриф — OOH, беру в работу: MJ+SD, Leonardo, consistent seeds. 48000, DCO-варианты по таблице. PL/EU, англ+польский. Сроки держу по медиа-плану, правки в двух волнах, как указано. Нужен доступ к mood-refs, если paywalled — дам список."
    proposed_price: 48000
    proposed_deadline: "2026-11-28T00:00:00.000Z"
    status: shortlisted
  - id: e0000000-0000-4000-8000-00000000000f
    project_id: d0000000-0000-4000-8000-000000000005
    freelancer_id: mock_ai_fl_08
    cover_letter: "Кампейн-стиллз и копи-сопровождение: Midjourney+FF, бренд-безопасные палитры. 51000, включая лёгкий handoff copy deck. 501 consulting stack — на отдельном слогане, если откроете. Dubai TZ, встречи вечером EU. Выбираю, если важен единый визуальный тон везде."
    proposed_price: 51000
    proposed_deadline: "2026-12-15T00:00:00.000Z"
    status: accepted
  - id: e0000000-0000-4000-8000-000000000010
    project_id: d0000000-0000-4000-8000-000000000005
    freelancer_id: mock_ai_fl_09
    cover_letter: "Compositing+rebuilds+IDEogram/DALL·E, но для кампании OOH сойдёт. 40000, если сократим rounds до 1+final. US ET. Готов(а) к DCO, но с явным list размеров день 1. Если не взлетит — не обижусь, в конкуренции 5+."
    proposed_price: 40000
    proposed_deadline: "2026-11-25T00:00:00.000Z"
    status: rejected
  # d...007 RAG regulated (4)
  - id: e0000000-0000-4000-8000-000000000011
    project_id: d0000000-0000-4000-8000-000000000007
    freelancer_id: mock_ai_fl_03
    cover_letter: "RAG+агенты для support: ваша среда — RAG+policy+цитаты. 58000, включая runbook+инцидент-регресс. Регистрируем ссылки и запреты cross-tenant, как в ТЗ. EU, рабочие встречи в CET. Готова к staging-first."
    proposed_price: 58000
    proposed_deadline: "2026-10-01T00:00:00.000Z"
    status: accepted
  - id: e0000000-0000-4000-8000-000000000012
    project_id: d0000000-0000-4000-8000-000000000007
    freelancer_id: mock_ai_fl_10
    cover_letter: "RAG+Fine-tune+citations: 56000, двухфазный: baseline RAG, затем selective FT на одобренном корпусе. Аудит-ready лог. Singapore TZ. Готов(а) к песочнице, без public weights."
    proposed_price: 56000
    proposed_deadline: "2026-10-10T00:00:00.000Z"
    status: submitted
  - id: e0000000-0000-4000-8000-000000000013
    project_id: d0000000-0000-4000-8000-000000000007
    freelancer_id: mock_ai_fl_11
    cover_letter: "ETL+LLM hybrid не основной в этом RFP, но RAG+LangChain — да. 52000, без лишнего. Доки — markdown+mkdocs, если нет confluence. EU remote, overlap US утром. Готов(а) к code drop на втором спринте."
    proposed_price: 52000
    proposed_deadline: "2026-10-12T00:00:00.000Z"
    status: submitted
  - id: e0000000-0000-4000-8000-000000000014
    project_id: d0000000-0000-4000-8000-000000000007
    freelancer_id: mock_ai_fl_02
    cover_letter: "OpenAI+API+mobile bias, но RAG-политика — сделаю BFF+eval harness. 54000, если согласуем shared PM hours. 001/402 match — сделаю интеграции с idp позже, как в брифе. Helsinki."
    proposed_price: 54000
    proposed_deadline: "2026-10-05T00:00:00.000Z"
    status: shortlisted
  # d...008 ETL completed (3) — one accepted
  - id: e0000000-0000-4000-8000-000000000015
    project_id: d0000000-0000-4000-8000-000000000008
    freelancer_id: mock_ai_fl_11
    cover_letter: "LangChain+HF+OpenAI+Anthropic API+vector: для ETL-fallback+резюме инцидентов — вписываюсь. 36000, четыре вехи, SLO-алерты. Дока для дежурки. Remote EU. **Исторический accepted** в мок-наборе для сценария completed."
    proposed_price: 36000
    proposed_deadline: "2025-01-20T00:00:00.000Z"
    status: accepted
  - id: e0000000-0000-4000-8000-000000000016
    project_id: d0000000-0000-4000-8000-000000000008
    freelancer_id: mock_ai_fl_02
    cover_letter: "Коннекторы+OpenAI 402: 30000, если backfill <10TB. Mobile bias не мешает — BFF-trace only. 2-недельный hypercare. US/EU overlap. Готов(а) hand off, если win не мой (эталонный submitted)."
    proposed_price: 30000
    proposed_deadline: "2025-01-25T00:00:00.000Z"
    status: submitted
  - id: e0000000-0000-4000-8000-000000000017
    project_id: d0000000-0000-4000-8000-000000000008
    freelancer_id: mock_ai_fl_14
    cover_letter: "Prompt+API-обвязка и resilience pack: 28000. RAG/ETL-ядро — в паре с вашим data team. 50+ char cover для валидации. Отказ при выборе другого подрядчика — **rejected** для diversity таблиц."
    proposed_price: 28000
    proposed_deadline: "2025-01-22T00:00:00.000Z"
    status: rejected
  # d...00a consulting (2)
  - id: e0000000-0000-4000-8000-000000000018
    project_id: d0000000-0000-4000-8000-00000000000a
    freelancer_id: mock_ai_fl_15
    cover_letter: "AI strategy+prompt+training — полное покрытие 501/502/503. 18000 fixed за спринт+workshop+playbooks. 4-недельный план в приложении, метрики владельцев. **Accepted** в mock для retail ops. US/JP overlap вечером JP."
    proposed_price: 18000
    proposed_deadline: "2026-08-15T00:00:00.000Z"
    status: accepted
  - id: e0000000-0000-4000-8000-000000000019
    project_id: d0000000-0000-4000-8000-00000000000a
    freelancer_id: mock_ai_fl_14
    cover_letter: "Prompt systems + 501/402 overlap: 16500, если сузить к prompt-only без L&D-цикла. Готов(а) к 3-сессиям, документы в notion. Rejected/accepted в пользу full-stack strategists — **submitted** tier."
    proposed_price: 16500
    proposed_deadline: "2026-08-10T00:00:00.000Z"
    status: submitted
```

## Файлы-вложения (диск)

- [public/mock-projects/attachment-brief-01.jpg](public/mock-projects/attachment-brief-01.jpg)  
- [public/mock-projects/attachment-brief-02.jpg](public/mock-projects/attachment-brief-02.jpg)  
- [public/mock-projects/attachment-spec-mobile-03.jpg](public/mock-projects/attachment-spec-mobile-03.jpg)  
- [public/mock-projects/attachment-spec-ooh-05.jpg](public/mock-projects/attachment-spec-ooh-05.jpg)  
- [public/mock-projects/attachment-moodboard-04.jpg](public/mock-projects/attachment-moodboard-04.jpg)  
- [public/mock-projects/attachment-rag-citation-brief.jpg](public/mock-projects/attachment-rag-citation-brief.jpg)  
- [public/mock-projects/attachment-etl-01.jpg](public/mock-projects/attachment-etl-01.jpg)  
- [public/mock-projects/attachment-rag-nda-brief.pdf](public/mock-projects/attachment-rag-nda-brief.pdf)  
- [public/mock-projects/attachment-rag-threat-brief.pdf](public/mock-projects/attachment-rag-threat-brief.pdf)  
- [public/mock-projects/attachment-mobile-prd-excerpt.docx](public/mock-projects/attachment-mobile-prd-excerpt.docx)  
- [public/mock-projects/attachment-mobile-integration-checklist.docx](public/mock-projects/attachment-mobile-integration-checklist.docx)  
- [public/mock-projects/attachment-prompt-playbook.docx](public/mock-projects/attachment-prompt-playbook.docx)  
- [public/mock-projects/attachment-video-perf-hero-a.mp4](public/mock-projects/attachment-video-perf-hero-a.mp4)  
- [public/mock-projects/attachment-video-perf-hero-b.mp4](public/mock-projects/attachment-video-perf-hero-b.mp4)  
- [public/mock-projects/attachment-store-faq-sample.m4a](public/mock-projects/attachment-store-faq-sample.m4a)

Пути в БД: `/mock-projects/...` (как public URL).