# MOCK-USERS

Синтетические пользователи для **local** и **production** QA: фиксированные id, **upsert**-сид, один пароль на всех. Все вымышленные имена и файлы.

## Сид в БД

1. `yarn db:migrate`
2. `yarn db:seed` (каталоги `skills` и `languages` — **до** моков)
3. `yarn db:seed:mock-users` — читает YAML ниже, подставляет e-mail, никнеймы, `location`, `user_languages`, сохраняет пути к ассетам в виде `/mock-users/...`, создаёт учётки `credential` с хешом пароля (см. `src/lib/dev/mock-users-seed.ts` и `scripts/db/seed-mock-users.ts`).

| Variable              | Назначение                                                                                                                                                                                                                       |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`        | Подключение к Postgres.                                                                                                                                                                                                          |
| `NEXT_PUBLIC_APP_URL` | Не обязателен для текущего набора моков. Сейчас ассеты в YAML заданы относительными путями `/mock-users/...`. Переменная остаётся только как compatibility origin для legacy absolute URL при нормализации данных в сид-скрипте. |

**Пароль всех мок-аккаунтов (email+password):** `mock1234` (в репо не кладётся, только хеш в `accounts`).

**Почта фрилансеров** при сиде: читаемый локальный адрес `@yahoo.com` (таблица `FREELANCER_IDENTITY` в `src/lib/dev/mock-users-seed.ts`).

**Non-localhost:** если `DATABASE_URL` не `localhost` / `127.0.0.1`, скрипт спросит подтверждение; `--force` или `MOCK_SEED_CONFIRM=1` — без вопроса.

`users` в стиле Better Auth (**camelCase**); остальные таблицы — **snake_case** (Kysely).  
Таймстампы в YAML намеренно не перечислены — сид/БД ставят defaults.  
`user_profiles.search_vector` в БД **generated** — в сид не вносится.  
**~80%** фрилансеров с **и** `location`, **и** `user_languages` (см. правила в `mock-users-seed.ts`); у остальных намеренные пробелы для edge cases.

**Пять клиентов** (`role: client`, без `freelancer_profiles`) и разные **компании / роли в компании** теперь тоже описаны прямо в YAML ниже; у Yuki Tanaka `user_languages` намеренно пустой по сценарию.

- Avatars on disk: `public/mock-users/avatars/mock-avatar-01.jpg` … `mock-avatar-15.jpg` для фрилансеров; `mock-avatar-cl-01.jpg` … `mock-avatar-cl-05.jpg` для клиентов (`role: client`) (JPEG, quality 60)  
- Portfolio: `public/mock-users/portfolio/mock-portfolio-ai-*.jpg` (см. `ASSETS-TO-GENERATE.md` при регенерации)  
- В YAML ниже пути к ассетам заданы как относительные public-path значения: `/mock-users/...`

```yaml
users:
  - users:
      id: mock_ai_fl_01
      email: mock-ai-fl-01@neurogig.test
      name: Mira Chen
      role: freelancer
      emailVerified: true
      image: /mock-users/avatars/mock-avatar-01.jpg
    user_profiles:
      id: mock_ai_fl_01
      user_id: mock_ai_fl_01
      name: Mira Chen
      avatar_url: /mock-users/avatars/mock-avatar-01.jpg
      bio: Concept artist for sci-fi and fantasy. I help teams visualize worlds before production commits to a direction.
      company_name: null
      company_role: null
    freelancer_profiles:
      id: f0000000-0000-4000-8000-000000000001
      user_id: mock_ai_fl_01
      specialization: AI concept art and key visuals
      hourly_rate: 9500
      availability: full-time
      experience: Cinematic key art for games and short pitches. Fast iteration from thumbnails to polished stills with consistent characters and lighting.
    user_skills:
      - id: us_mock_ai_fl_01_mj
        user_id: mock_ai_fl_01
        skill_id: 00000000-0000-4000-8000-000000000101
        proficiency_level: expert
        legacy_skill_id: null
      - id: us_mock_ai_fl_01_sd
        user_id: mock_ai_fl_01
        skill_id: 00000000-0000-4000-8000-000000000102
        proficiency_level: advanced
        legacy_skill_id: null
      - id: us_mock_ai_fl_01_leo
        user_id: mock_ai_fl_01
        skill_id: 00000000-0000-4000-8000-000000000105
        proficiency_level: advanced
        legacy_skill_id: null
    portfolio_items:
      - id: e0000000-0000-4000-8000-000000000001
        freelancer_profile_id: f0000000-0000-4000-8000-000000000001
        title: AI art sample 1-1
        description: Synthetic portfolio frame for AI art work by Mira. Intended for local QA only.
        media_url: /mock-users/portfolio/mock-portfolio-ai-art-01.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: image_generation
        tools_used:
          - Midjourney
          - Photoshop
      - id: e0000000-0000-4000-8000-000000000002
        freelancer_profile_id: f0000000-0000-4000-8000-000000000001
        title: AI avatar sample 1-2
        description: Synthetic portfolio frame for AI avatar work by Mira. Intended for local QA only.
        media_url: /mock-users/portfolio/mock-portfolio-ai-avatar-01.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: image_generation
        tools_used:
          - Stable Diffusion
          - Clip Studio Paint
      - id: e0000000-0000-4000-8000-000000000003
        freelancer_profile_id: f0000000-0000-4000-8000-000000000001
        title: AI image editing sample 1-3
        description: Synthetic portfolio frame for AI image editing work by Mira. Intended for local QA only.
        media_url: /mock-users/portfolio/mock-portfolio-ai-edit-01.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: image_generation
        tools_used:
          - Photoshop
          - Lightroom
      - id: e0000000-0000-4000-8000-000000000004
        freelancer_profile_id: f0000000-0000-4000-8000-000000000001
        title: AI agents sample 1-4
        description: Synthetic portfolio frame for AI agents work by Mira. Intended for local QA only.
        media_url: /mock-users/portfolio/mock-portfolio-ai-agent-01.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: programming
        tools_used:
          - LangChain
          - OpenAI API
  - users:
      id: mock_ai_fl_02
      email: mock-ai-fl-02@neurogig.test
      name: Джордан Окоро
      role: freelancer
      emailVerified: true
      image: /mock-users/avatars/mock-avatar-02.jpg
    user_profiles:
      id: mock_ai_fl_02
      user_id: mock_ai_fl_02
      name: Джордан Окоро
      avatar_url: /mock-users/avatars/mock-avatar-02.jpg
      bio: "Создаю мобильные интерфейсы для AI-функций: онбординг, чаты, генерацию и понятные сценарии монетизации."
      company_name: null
      company_role: null
    freelancer_profiles:
      id: f0000000-0000-4000-8000-000000000002
      user_id: mock_ai_fl_02
      specialization: AI-native интерфейсы мобильных продуктов
      hourly_rate: 11000
      availability: part-time
      experience: "Мобильные сценарии с LLM-функциями: постепенное раскрытие возможностей, безопасные fallback-сценарии и измеримая аналитика для оценки качества."
    user_skills:
      - id: us_mock_ai_fl_02_g4
        user_id: mock_ai_fl_02
        skill_id: 00000000-0000-4000-8000-000000000001
        proficiency_level: advanced
        legacy_skill_id: null
      - id: us_mock_ai_fl_02_oapi
        user_id: mock_ai_fl_02
        skill_id: 00000000-0000-4000-8000-000000000402
        proficiency_level: expert
        legacy_skill_id: null
      - id: us_mock_ai_fl_02_pe
        user_id: mock_ai_fl_02
        skill_id: 00000000-0000-4000-8000-000000000501
        proficiency_level: advanced
        legacy_skill_id: null
    portfolio_items:
      - id: e0000000-0000-4000-8000-000000000005
        freelancer_profile_id: f0000000-0000-4000-8000-000000000002
        title: Пример AI mobile 2-1
        description: "Синтетический кадр портфолио для AI mobile-работ. Автор: Джордан Окоро. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-mobile-01.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: programming
        tools_used:
          - Figma
          - SwiftUI
      - id: e0000000-0000-4000-8000-000000000006
        freelancer_profile_id: f0000000-0000-4000-8000-000000000002
        title: Пример AI video 2-2
        description: "Синтетический кадр портфолио для AI video-работ. Автор: Джордан Окоро. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-video-01.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: video_generation
        tools_used:
          - Runway Gen-3
          - DaVinci Resolve
      - id: e0000000-0000-4000-8000-000000000007
        freelancer_profile_id: f0000000-0000-4000-8000-000000000002
        title: Пример AI-арта 2-3
        description: "Синтетический кадр портфолио для AI-арта. Автор: Джордан Окоро. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-art-02.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: image_generation
        tools_used:
          - Midjourney
          - Photoshop
      - id: e0000000-0000-4000-8000-000000000008
        freelancer_profile_id: f0000000-0000-4000-8000-000000000002
        title: Пример AI-аватара 2-4
        description: "Синтетический кадр портфолио для AI-аватаров. Автор: Джордан Окоро. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-avatar-02.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: image_generation
        tools_used:
          - Stable Diffusion
          - Clip Studio Paint
  - users:
      id: mock_ai_fl_03
      email: mock-ai-fl-03@neurogig.test
      name: Елена Васкес
      role: freelancer
      emailVerified: true
      image: /mock-users/avatars/mock-avatar-03.jpg
    user_profiles:
      id: mock_ai_fl_03
      user_id: mock_ai_fl_03
      name: Елена Васкес
      avatar_url: /mock-users/avatars/mock-avatar-03.jpg
      bio: Проектирую агентные сценарии для поддержки и внутренних операций с упором на handoff, guardrails и контроль качества.
      company_name: null
      company_role: null
    freelancer_profiles:
      id: f0000000-0000-4000-8000-000000000003
      user_id: mock_ai_fl_03
      specialization: AI-агенты для поддержки и операционных команд
      hourly_rate: 12000
      availability: full-time
      experience: Агентные системы с опорой на источники, передачей человеку и циклами оценки. Фокус на измеримом снижении нагрузки без рискованной автоматизации.
    user_skills:
      - id: us_mock_ai_fl_03_lc
        user_id: mock_ai_fl_03
        skill_id: 00000000-0000-4000-8000-000000000401
        proficiency_level: expert
        legacy_skill_id: null
      - id: us_mock_ai_fl_03_rag
        user_id: mock_ai_fl_03
        skill_id: 00000000-0000-4000-8000-000000000406
        proficiency_level: expert
        legacy_skill_id: null
      - id: us_mock_ai_fl_03_vdb
        user_id: mock_ai_fl_03
        skill_id: 00000000-0000-4000-8000-000000000405
        proficiency_level: advanced
        legacy_skill_id: null
    portfolio_items:
      - id: e0000000-0000-4000-8000-000000000009
        freelancer_profile_id: f0000000-0000-4000-8000-000000000003
        title: Пример AI-ретуши 3-1
        description: "Синтетический кадр портфолио для AI-ретуши. Автор: Елена Васкес. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-edit-02.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: image_generation
        tools_used:
          - Photoshop
          - Lightroom
      - id: e0000000-0000-4000-8000-000000000010
        freelancer_profile_id: f0000000-0000-4000-8000-000000000003
        title: Пример AI-агентов 3-2
        description: "Синтетический кадр портфолио для AI-агентов. Автор: Елена Васкес. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-agent-02.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: programming
        tools_used:
          - LangChain
          - OpenAI API
      - id: e0000000-0000-4000-8000-000000000011
        freelancer_profile_id: f0000000-0000-4000-8000-000000000003
        title: Пример AI mobile 3-3
        description: "Синтетический кадр портфолио для AI mobile-работ. Автор: Елена Васкес. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-mobile-02.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: programming
        tools_used:
          - Figma
          - SwiftUI
      - id: e0000000-0000-4000-8000-000000000012
        freelancer_profile_id: f0000000-0000-4000-8000-000000000003
        title: Пример AI video 3-4
        description: "Синтетический кадр портфолио для AI video-работ. Автор: Елена Васкес. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-video-02.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: video_generation
        tools_used:
          - Runway Gen-3
          - DaVinci Resolve
  - users:
      id: mock_ai_fl_04
      email: mock-ai-fl-04@neurogig.test
      name: Чхве Юджин
      role: freelancer
      emailVerified: true
      image: /mock-users/avatars/mock-avatar-04.jpg
    user_profiles:
      id: mock_ai_fl_04
      user_id: mock_ai_fl_04
      name: Чхве Юджин
      avatar_url: /mock-users/avatars/mock-avatar-04.jpg
      bio: "Помогаю маркетинговым командам быстро собирать clean visual comps: правки продукта, замена фона и единый визуальный стиль."
      company_name: null
      company_role: null
    freelancer_profiles:
      id: f0000000-0000-4000-8000-000000000004
      user_id: mock_ai_fl_04
      specialization: AI-ретушь и композитинг
      hourly_rate: 6500
      availability: weekends only
      experience: Каталожная и портретная ретушь с правдоподобной фактурой. Генеративные проходы для фонов и чистки там, где одного Photoshop уже недостаточно.
    user_skills:
      - id: us_mock_ai_fl_04_d3
        user_id: mock_ai_fl_04
        skill_id: 00000000-0000-4000-8000-000000000103
        proficiency_level: intermediate
        legacy_skill_id: null
      - id: us_mock_ai_fl_04_ff
        user_id: mock_ai_fl_04
        skill_id: 00000000-0000-4000-8000-000000000106
        proficiency_level: advanced
        legacy_skill_id: null
      - id: us_mock_ai_fl_04_id
        user_id: mock_ai_fl_04
        skill_id: 00000000-0000-4000-8000-000000000107
        proficiency_level: intermediate
        legacy_skill_id: null
    portfolio_items:
      - id: e0000000-0000-4000-8000-000000000013
        freelancer_profile_id: f0000000-0000-4000-8000-000000000004
        title: Пример AI-арта 4-1
        description: "Синтетический кадр портфолио для AI-арта. Автор: Чхве Юджин. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-art-03.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: image_generation
        tools_used:
          - Midjourney
          - Photoshop
      - id: e0000000-0000-4000-8000-000000000014
        freelancer_profile_id: f0000000-0000-4000-8000-000000000004
        title: Пример AI-аватара 4-2
        description: "Синтетический кадр портфолио для AI-аватаров. Автор: Чхве Юджин. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-avatar-03.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: image_generation
        tools_used:
          - Stable Diffusion
          - Clip Studio Paint
      - id: e0000000-0000-4000-8000-000000000015
        freelancer_profile_id: f0000000-0000-4000-8000-000000000004
        title: Пример AI-ретуши 4-3
        description: "Синтетический кадр портфолио для AI-ретуши. Автор: Чхве Юджин. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-edit-03.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: image_generation
        tools_used:
          - Photoshop
          - Lightroom
      - id: e0000000-0000-4000-8000-000000000016
        freelancer_profile_id: f0000000-0000-4000-8000-000000000004
        title: Пример AI-агентов 4-4
        description: "Синтетический кадр портфолио для AI-агентов. Автор: Чхве Юджин. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-agent-03.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: programming
        tools_used:
          - LangChain
          - OpenAI API
  - users:
      id: mock_ai_fl_05
      email: mock-ai-fl-05@neurogig.test
      name: Nina Kowalski
      role: freelancer
      emailVerified: true
      image: /mock-users/avatars/mock-avatar-05.jpg
    user_profiles:
      id: mock_ai_fl_05
      user_id: mock_ai_fl_05
      name: Nina Kowalski
      avatar_url: /mock-users/avatars/mock-avatar-05.jpg
      bio: Character designer blending paintover with diffusion exploration to keep identity stable.
      company_name: null
      company_role: null
    freelancer_profiles:
      id: f0000000-0000-4000-8000-000000000005
      user_id: mock_ai_fl_05
      specialization: AI avatars and character packs
      hourly_rate: 8500
      availability: part-time
      experience: "Stream-ready characters: readable silhouettes, expression sheets, and palette-locked variants."
    user_skills:
      - id: us_mock_ai_fl_05_mj
        user_id: mock_ai_fl_05
        skill_id: 00000000-0000-4000-8000-000000000101
        proficiency_level: advanced
        legacy_skill_id: null
      - id: us_mock_ai_fl_05_sd
        user_id: mock_ai_fl_05
        skill_id: 00000000-0000-4000-8000-000000000102
        proficiency_level: expert
        legacy_skill_id: null
      - id: us_mock_ai_fl_05_leo
        user_id: mock_ai_fl_05
        skill_id: 00000000-0000-4000-8000-000000000105
        proficiency_level: intermediate
        legacy_skill_id: null
    portfolio_items:
      - id: e0000000-0000-4000-8000-000000000017
        freelancer_profile_id: f0000000-0000-4000-8000-000000000005
        title: AI mobile sample 5-1
        description: Synthetic portfolio frame for AI mobile work by Nina. Intended for local QA only.
        media_url: /mock-users/portfolio/mock-portfolio-ai-mobile-03.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: programming
        tools_used:
          - Figma
          - SwiftUI
      - id: e0000000-0000-4000-8000-000000000018
        freelancer_profile_id: f0000000-0000-4000-8000-000000000005
        title: AI video sample 5-2
        description: Synthetic portfolio frame for AI video work by Nina. Intended for local QA only.
        media_url: /mock-users/portfolio/mock-portfolio-ai-video-03.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: video_generation
        tools_used:
          - Runway Gen-3
          - DaVinci Resolve
      - id: e0000000-0000-4000-8000-000000000019
        freelancer_profile_id: f0000000-0000-4000-8000-000000000005
        title: AI art sample 5-3
        description: Synthetic portfolio frame for AI art work by Nina. Intended for local QA only.
        media_url: /mock-users/portfolio/mock-portfolio-ai-art-04.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: image_generation
        tools_used:
          - Midjourney
          - Photoshop
      - id: e0000000-0000-4000-8000-000000000020
        freelancer_profile_id: f0000000-0000-4000-8000-000000000005
        title: AI avatar sample 5-4
        description: Synthetic portfolio frame for AI avatar work by Nina. Intended for local QA only.
        media_url: /mock-users/portfolio/mock-portfolio-ai-avatar-04.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: image_generation
        tools_used:
          - Stable Diffusion
          - Clip Studio Paint
  - users:
      id: mock_ai_fl_06
      email: mock-ai-fl-06@neurogig.test
      name: Theo Marin
      role: freelancer
      emailVerified: true
      image: /mock-users/avatars/mock-avatar-06.jpg
    user_profiles:
      id: mock_ai_fl_06
      user_id: mock_ai_fl_06
      name: Theo Marin
      avatar_url: /mock-users/avatars/mock-avatar-06.jpg
      bio: "Motion-minded generalist: I keep edits punchy and legible on phones."
      company_name: null
      company_role: null
    freelancer_profiles:
      id: f0000000-0000-4000-8000-000000000006
      user_id: mock_ai_fl_06
      specialization: AI video for ads and social
      hourly_rate: 9000
      availability: full-time
      experience: Short promos, B-roll augmentation, and storyboard-to-motion experiments with tight brand-safe palettes.
    user_skills:
      - id: us_mock_ai_fl_06_rw3
        user_id: mock_ai_fl_06
        skill_id: 00000000-0000-4000-8000-000000000201
        proficiency_level: expert
        legacy_skill_id: null
      - id: us_mock_ai_fl_06_pika
        user_id: mock_ai_fl_06
        skill_id: 00000000-0000-4000-8000-000000000203
        proficiency_level: advanced
        legacy_skill_id: null
      - id: us_mock_ai_fl_06_syn
        user_id: mock_ai_fl_06
        skill_id: 00000000-0000-4000-8000-000000000204
        proficiency_level: intermediate
        legacy_skill_id: null
    portfolio_items:
      - id: e0000000-0000-4000-8000-000000000021
        freelancer_profile_id: f0000000-0000-4000-8000-000000000006
        title: AI image editing sample 6-1
        description: Synthetic portfolio frame for AI image editing work by Theo. Intended for local QA only.
        media_url: /mock-users/portfolio/mock-portfolio-ai-edit-04.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: image_generation
        tools_used:
          - Photoshop
          - Lightroom
      - id: e0000000-0000-4000-8000-000000000022
        freelancer_profile_id: f0000000-0000-4000-8000-000000000006
        title: AI agents sample 6-2
        description: Synthetic portfolio frame for AI agents work by Theo. Intended for local QA only.
        media_url: /mock-users/portfolio/mock-portfolio-ai-agent-04.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: programming
        tools_used:
          - LangChain
          - OpenAI API
      - id: e0000000-0000-4000-8000-000000000023
        freelancer_profile_id: f0000000-0000-4000-8000-000000000006
        title: AI mobile sample 6-3
        description: Synthetic portfolio frame for AI mobile work by Theo. Intended for local QA only.
        media_url: /mock-users/portfolio/mock-portfolio-ai-mobile-04.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: programming
        tools_used:
          - Figma
          - SwiftUI
      - id: e0000000-0000-4000-8000-000000000024
        freelancer_profile_id: f0000000-0000-4000-8000-000000000006
        title: AI video sample 6-4
        description: Synthetic portfolio frame for AI video work by Theo. Intended for local QA only.
        media_url: /mock-users/portfolio/mock-portfolio-ai-video-04.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: video_generation
        tools_used:
          - Runway Gen-3
          - DaVinci Resolve
  - users:
      id: mock_ai_fl_07
      email: mock-ai-fl-07@neurogig.test
      name: Райли Брукс
      role: freelancer
      emailVerified: true
      image: /mock-users/avatars/mock-avatar-07.jpg
    user_profiles:
      id: mock_ai_fl_07
      user_id: mock_ai_fl_07
      name: Райли Брукс
      avatar_url: /mock-users/avatars/mock-avatar-07.jpg
      bio: Собираю продакшн-чатботов и внутренние AI-инструменты с аналитикой, guardrails и аккуратной интеграцией в рабочие процессы.
      company_name: null
      company_role: null
    freelancer_profiles:
      id: f0000000-0000-4000-8000-000000000007
      user_id: mock_ai_fl_07
      specialization: Чат-боты и интеграция LLM-приложений
      hourly_rate: 10000
      availability: part-time
      experience: Паттерны tool calling, структурированные ответы и guardrails для ассистентов, которые общаются с клиентами.
    user_skills:
      - id: us_mock_ai_fl_07_c35
        user_id: mock_ai_fl_07
        skill_id: 00000000-0000-4000-8000-000000000003
        proficiency_level: advanced
        legacy_skill_id: null
      - id: us_mock_ai_fl_07_aapi
        user_id: mock_ai_fl_07
        skill_id: 00000000-0000-4000-8000-000000000403
        proficiency_level: advanced
        legacy_skill_id: null
      - id: us_mock_ai_fl_07_oapi
        user_id: mock_ai_fl_07
        skill_id: 00000000-0000-4000-8000-000000000402
        proficiency_level: advanced
        legacy_skill_id: null
    portfolio_items:
      - id: e0000000-0000-4000-8000-000000000025
        freelancer_profile_id: f0000000-0000-4000-8000-000000000007
        title: Пример AI-арта 7-1
        description: "Синтетический кадр портфолио для AI-арта. Автор: Райли Брукс. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-art-05.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: image_generation
        tools_used:
          - Midjourney
          - Photoshop
      - id: e0000000-0000-4000-8000-000000000026
        freelancer_profile_id: f0000000-0000-4000-8000-000000000007
        title: Пример AI-аватара 7-2
        description: "Синтетический кадр портфолио для AI-аватаров. Автор: Райли Брукс. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-avatar-05.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: image_generation
        tools_used:
          - Stable Diffusion
          - Clip Studio Paint
      - id: e0000000-0000-4000-8000-000000000027
        freelancer_profile_id: f0000000-0000-4000-8000-000000000007
        title: Пример AI-ретуши 7-3
        description: "Синтетический кадр портфолио для AI-ретуши. Автор: Райли Брукс. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-edit-05.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: image_generation
        tools_used:
          - Photoshop
          - Lightroom
      - id: e0000000-0000-4000-8000-000000000028
        freelancer_profile_id: f0000000-0000-4000-8000-000000000007
        title: Пример AI-агентов 7-4
        description: "Синтетический кадр портфолио для AI-агентов. Автор: Райли Брукс. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-agent-05.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: programming
        tools_used:
          - LangChain
          - OpenAI API
  - users:
      id: mock_ai_fl_08
      email: mock-ai-fl-08@neurogig.test
      name: Фарис Аль-Фарси
      role: freelancer
      emailVerified: true
      image: /mock-users/avatars/mock-avatar-08.jpg
    user_profiles:
      id: mock_ai_fl_08
      user_id: mock_ai_fl_08
      name: Фарис Аль-Фарси
      avatar_url: /mock-users/avatars/mock-avatar-08.jpg
      bio: "Делаю яркие визуальные серии для бренд-кампаний: key visuals, social packs и быструю адаптацию под разные форматы."
      company_name: null
      company_role: null
    freelancer_profiles:
      id: f0000000-0000-4000-8000-000000000008
      user_id: mock_ai_fl_08
      specialization: AI-иллюстрации для бренд-кампаний
      hourly_rate: 7800
      availability: full-time
      experience: "Системы кампанийной иллюстрации: мотивы, цветовые ритмы и переиспользуемые фоны для маркетинговых команд."
    user_skills:
      - id: us_mock_ai_fl_08_mj
        user_id: mock_ai_fl_08
        skill_id: 00000000-0000-4000-8000-000000000101
        proficiency_level: advanced
        legacy_skill_id: null
      - id: us_mock_ai_fl_08_ff
        user_id: mock_ai_fl_08
        skill_id: 00000000-0000-4000-8000-000000000106
        proficiency_level: advanced
        legacy_skill_id: null
      - id: us_mock_ai_fl_08_pe
        user_id: mock_ai_fl_08
        skill_id: 00000000-0000-4000-8000-000000000501
        proficiency_level: expert
        legacy_skill_id: null
    portfolio_items:
      - id: e0000000-0000-4000-8000-000000000029
        freelancer_profile_id: f0000000-0000-4000-8000-000000000008
        title: Пример AI mobile 8-1
        description: "Синтетический кадр портфолио для AI mobile-работ. Автор: Фарис Аль-Фарси. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-mobile-05.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: programming
        tools_used:
          - Figma
          - SwiftUI
      - id: e0000000-0000-4000-8000-000000000030
        freelancer_profile_id: f0000000-0000-4000-8000-000000000008
        title: Пример AI video 8-2
        description: "Синтетический кадр портфолио для AI video-работ. Автор: Фарис Аль-Фарси. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-video-05.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: video_generation
        tools_used:
          - Runway Gen-3
          - DaVinci Resolve
      - id: e0000000-0000-4000-8000-000000000031
        freelancer_profile_id: f0000000-0000-4000-8000-000000000008
        title: Пример AI-арта 8-3
        description: "Синтетический кадр портфолио для AI-арта. Автор: Фарис Аль-Фарси. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-art-06.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: image_generation
        tools_used:
          - Midjourney
          - Photoshop
      - id: e0000000-0000-4000-8000-000000000032
        freelancer_profile_id: f0000000-0000-4000-8000-000000000008
        title: Пример AI-аватара 8-4
        description: "Синтетический кадр портфолио для AI-аватаров. Автор: Фарис Аль-Фарси. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-avatar-06.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: image_generation
        tools_used:
          - Stable Diffusion
          - Clip Studio Paint
  - users:
      id: mock_ai_fl_09
      email: mock-ai-fl-09@neurogig.test
      name: Nora Kelly
      role: freelancer
      emailVerified: true
      image: /mock-users/avatars/mock-avatar-09.jpg
    user_profiles:
      id: mock_ai_fl_09
      user_id: mock_ai_fl_09
      name: Nora Kelly
      avatar_url: /mock-users/avatars/mock-avatar-09.jpg
      bio: "Compositor who likes difficult edges: glass, hair, and messy practical sets."
      company_name: null
      company_role: null
    freelancer_profiles:
      id: f0000000-0000-4000-8000-000000000009
      user_id: mock_ai_fl_09
      specialization: Compositing and scene rebuilds
      hourly_rate: 7200
      availability: limited ~20h/wk
      experience: Complex masking, relighting, and environment rebuilds for hero marketing frames.
    user_skills:
      - id: us_mock_ai_fl_09_sd
        user_id: mock_ai_fl_09
        skill_id: 00000000-0000-4000-8000-000000000102
        proficiency_level: advanced
        legacy_skill_id: null
      - id: us_mock_ai_fl_09_d3
        user_id: mock_ai_fl_09
        skill_id: 00000000-0000-4000-8000-000000000103
        proficiency_level: intermediate
        legacy_skill_id: null
      - id: us_mock_ai_fl_09_leo
        user_id: mock_ai_fl_09
        skill_id: 00000000-0000-4000-8000-000000000105
        proficiency_level: intermediate
        legacy_skill_id: null
    portfolio_items:
      - id: e0000000-0000-4000-8000-000000000033
        freelancer_profile_id: f0000000-0000-4000-8000-000000000009
        title: AI image editing sample 9-1
        description: Synthetic portfolio frame for AI image editing work by Owen. Intended for local QA only.
        media_url: /mock-users/portfolio/mock-portfolio-ai-edit-06.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: image_generation
        tools_used:
          - Photoshop
          - Lightroom
      - id: e0000000-0000-4000-8000-000000000034
        freelancer_profile_id: f0000000-0000-4000-8000-000000000009
        title: AI agents sample 9-2
        description: Synthetic portfolio frame for AI agents work by Owen. Intended for local QA only.
        media_url: /mock-users/portfolio/mock-portfolio-ai-agent-06.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: programming
        tools_used:
          - LangChain
          - OpenAI API
      - id: e0000000-0000-4000-8000-000000000035
        freelancer_profile_id: f0000000-0000-4000-8000-000000000009
        title: AI mobile sample 9-3
        description: Synthetic portfolio frame for AI mobile work by Owen. Intended for local QA only.
        media_url: /mock-users/portfolio/mock-portfolio-ai-mobile-06.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: programming
        tools_used:
          - Figma
          - SwiftUI
      - id: e0000000-0000-4000-8000-000000000036
        freelancer_profile_id: f0000000-0000-4000-8000-000000000009
        title: AI video sample 9-4
        description: Synthetic portfolio frame for AI video work by Owen. Intended for local QA only.
        media_url: /mock-users/portfolio/mock-portfolio-ai-video-06.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: video_generation
        tools_used:
          - Runway Gen-3
          - DaVinci Resolve
  - users:
      id: mock_ai_fl_10
      email: mock-ai-fl-10@neurogig.test
      name: Арман Рахман
      role: freelancer
      emailVerified: true
      image: /mock-users/avatars/mock-avatar-10.jpg
    user_profiles:
      id: mock_ai_fl_10
      user_id: mock_ai_fl_10
      name: Арман Рахман
      avatar_url: /mock-users/avatars/mock-avatar-10.jpg
      bio: "Помогаю компаниям запускать RAG и knowledge assistants: от структуры знаний до качества ответов и observability."
      company_name: null
      company_role: null
    freelancer_profiles:
      id: f0000000-0000-4000-8000-000000000010
      user_id: mock_ai_fl_10
      specialization: Корпоративные RAG-системы и ассистенты знаний
      hourly_rate: 13000
      availability: full-time
      experience: Стратегии чанкинга, контроль доступа, наборы для оценки и red-team промпты для регулируемых команд.
    user_skills:
      - id: us_mock_ai_fl_10_rag
        user_id: mock_ai_fl_10
        skill_id: 00000000-0000-4000-8000-000000000406
        proficiency_level: expert
        legacy_skill_id: null
      - id: us_mock_ai_fl_10_ft
        user_id: mock_ai_fl_10
        skill_id: 00000000-0000-4000-8000-000000000407
        proficiency_level: intermediate
        legacy_skill_id: null
      - id: us_mock_ai_fl_10_g4t
        user_id: mock_ai_fl_10
        skill_id: 00000000-0000-4000-8000-000000000002
        proficiency_level: advanced
        legacy_skill_id: null
    portfolio_items:
      - id: e0000000-0000-4000-8000-000000000037
        freelancer_profile_id: f0000000-0000-4000-8000-000000000010
        title: Пример AI-арта 10-1
        description: "Синтетический кадр портфолио для AI-арта. Автор: Арман Рахман. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-art-07.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: image_generation
        tools_used:
          - Midjourney
          - Photoshop
      - id: e0000000-0000-4000-8000-000000000038
        freelancer_profile_id: f0000000-0000-4000-8000-000000000010
        title: Пример AI-аватара 10-2
        description: "Синтетический кадр портфолио для AI-аватаров. Автор: Арман Рахман. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-avatar-07.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: image_generation
        tools_used:
          - Stable Diffusion
          - Clip Studio Paint
      - id: e0000000-0000-4000-8000-000000000039
        freelancer_profile_id: f0000000-0000-4000-8000-000000000010
        title: Пример AI-ретуши 10-3
        description: "Синтетический кадр портфолио для AI-ретуши. Автор: Арман Рахман. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-edit-07.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: image_generation
        tools_used:
          - Photoshop
          - Lightroom
      - id: e0000000-0000-4000-8000-000000000040
        freelancer_profile_id: f0000000-0000-4000-8000-000000000010
        title: Пример AI-агентов 10-4
        description: "Синтетический кадр портфолио для AI-агентов. Автор: Арман Рахман. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-agent-07.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: programming
        tools_used:
          - LangChain
          - OpenAI API
  - users:
      id: mock_ai_fl_11
      email: mock-ai-fl-11@neurogig.test
      name: Леа Шмидт
      role: freelancer
      emailVerified: true
      image: /mock-users/avatars/mock-avatar-11.jpg
    user_profiles:
      id: mock_ai_fl_11
      user_id: mock_ai_fl_11
      name: Леа Шмидт
      avatar_url: /mock-users/avatars/mock-avatar-11.jpg
      bio: "Проектирую понятные интерфейсы для сложных AI-процессов: очереди задач, статусы агентов и управляемые сценарии запуска."
      company_name: null
      company_role: null
    freelancer_profiles:
      id: f0000000-0000-4000-8000-000000000011
      user_id: mock_ai_fl_11
      specialization: UX для автоматизации и оркестрации агентов
      hourly_rate: 8800
      availability: part-time
      experience: Многошаговые процессы с согласованиями, повторами и операторскими дашбордами для не-разработчиков.
    user_skills:
      - id: us_mock_ai_fl_11_lc
        user_id: mock_ai_fl_11
        skill_id: 00000000-0000-4000-8000-000000000401
        proficiency_level: advanced
        legacy_skill_id: null
      - id: us_mock_ai_fl_11_oapi
        user_id: mock_ai_fl_11
        skill_id: 00000000-0000-4000-8000-000000000402
        proficiency_level: advanced
        legacy_skill_id: null
      - id: us_mock_ai_fl_11_hf
        user_id: mock_ai_fl_11
        skill_id: 00000000-0000-4000-8000-000000000404
        proficiency_level: intermediate
        legacy_skill_id: null
    portfolio_items:
      - id: e0000000-0000-4000-8000-000000000041
        freelancer_profile_id: f0000000-0000-4000-8000-000000000011
        title: Пример AI mobile 11-1
        description: "Синтетический кадр портфолио для AI mobile-работ. Автор: Леа Шмидт. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-mobile-07.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: programming
        tools_used:
          - Figma
          - SwiftUI
      - id: e0000000-0000-4000-8000-000000000042
        freelancer_profile_id: f0000000-0000-4000-8000-000000000011
        title: Пример AI video 11-2
        description: "Синтетический кадр портфолио для AI video-работ. Автор: Леа Шмидт. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-video-07.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: video_generation
        tools_used:
          - Runway Gen-3
          - DaVinci Resolve
      - id: e0000000-0000-4000-8000-000000000043
        freelancer_profile_id: f0000000-0000-4000-8000-000000000011
        title: Пример AI-арта 11-3
        description: "Синтетический кадр портфолио для AI-арта. Автор: Леа Шмидт. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-art-08.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: image_generation
        tools_used:
          - Midjourney
          - Photoshop
      - id: e0000000-0000-4000-8000-000000000044
        freelancer_profile_id: f0000000-0000-4000-8000-000000000011
        title: Пример AI-аватара 11-4
        description: "Синтетический кадр портфолио для AI-аватаров. Автор: Леа Шмидт. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-avatar-08.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: image_generation
        tools_used:
          - Stable Diffusion
          - Clip Studio Paint
  - users:
      id: mock_ai_fl_12
      email: mock-ai-fl-12@neurogig.test
      name: Камила Риос
      role: freelancer
      emailVerified: true
      image: /mock-users/avatars/mock-avatar-12.jpg
    user_profiles:
      id: mock_ai_fl_12
      user_id: mock_ai_fl_12
      name: Камила Риос
      avatar_url: /mock-users/avatars/mock-avatar-12.jpg
      bio: Создаю наборы игровых пропсов и окружения для быстрых вертикальных срезов, питчей и production-friendly пайплайнов.
      company_name: null
      company_role: null
    freelancer_profiles:
      id: f0000000-0000-4000-8000-000000000012
      user_id: mock_ai_fl_12
      specialization: AI-пропсы и environment tiles для игр
      hourly_rate: 5800
      availability: full-time
      experience: Стилизованные пропсы, trim sheets и mood-исследования для небольших студий с жёсткими сроками.
    user_skills:
      - id: us_mock_ai_fl_12_sd
        user_id: mock_ai_fl_12
        skill_id: 00000000-0000-4000-8000-000000000102
        proficiency_level: expert
        legacy_skill_id: null
      - id: us_mock_ai_fl_12_leo
        user_id: mock_ai_fl_12
        skill_id: 00000000-0000-4000-8000-000000000105
        proficiency_level: advanced
        legacy_skill_id: null
      - id: us_mock_ai_fl_12_mj
        user_id: mock_ai_fl_12
        skill_id: 00000000-0000-4000-8000-000000000101
        proficiency_level: intermediate
        legacy_skill_id: null
    portfolio_items:
      - id: e0000000-0000-4000-8000-000000000045
        freelancer_profile_id: f0000000-0000-4000-8000-000000000012
        title: Пример AI-ретуши 12-1
        description: "Синтетический кадр портфолио для AI-ретуши. Автор: Камила Риос. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-edit-08.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: image_generation
        tools_used:
          - Photoshop
          - Lightroom
      - id: e0000000-0000-4000-8000-000000000046
        freelancer_profile_id: f0000000-0000-4000-8000-000000000012
        title: Пример AI-агентов 12-2
        description: "Синтетический кадр портфолио для AI-агентов. Автор: Камила Риос. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-agent-08.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: programming
        tools_used:
          - LangChain
          - OpenAI API
      - id: e0000000-0000-4000-8000-000000000047
        freelancer_profile_id: f0000000-0000-4000-8000-000000000012
        title: Пример AI mobile 12-3
        description: "Синтетический кадр портфолио для AI mobile-работ. Автор: Камила Риос. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-mobile-08.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: programming
        tools_used:
          - Figma
          - SwiftUI
      - id: e0000000-0000-4000-8000-000000000048
        freelancer_profile_id: f0000000-0000-4000-8000-000000000012
        title: Пример AI video 12-4
        description: "Синтетический кадр портфолио для AI video-работ. Автор: Камила Риос. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-video-08.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: video_generation
        tools_used:
          - Runway Gen-3
          - DaVinci Resolve
  - users:
      id: mock_ai_fl_13
      email: mock-ai-fl-13@neurogig.test
      name: Мила Волкова
      role: freelancer
      emailVerified: true
      image: /mock-users/avatars/mock-avatar-13.jpg
    user_profiles:
      id: mock_ai_fl_13
      user_id: mock_ai_fl_13
      name: Мила Волкова
      avatar_url: /mock-users/avatars/mock-avatar-13.jpg
      bio: "Собираю синтетические пакеты для аудио и видео: короткие циклы, lip-sync reference и материалы для тестирования пайплайнов."
      company_name: null
      company_role: null
    freelancer_profiles:
      id: f0000000-0000-4000-8000-000000000013
      user_id: mock_ai_fl_13
      specialization: AI-наборы для аудио и видеосинхронизации
      hourly_rate: 9200
      availability: part-time
      experience: Подложки для озвучки, короткие sonic logos и вертикальные монтажи, синхронизированные с beat markers.
    user_skills:
      - id: us_mock_ai_fl_13_el
        user_id: mock_ai_fl_13
        skill_id: 00000000-0000-4000-8000-000000000301
        proficiency_level: expert
        legacy_skill_id: null
      - id: us_mock_ai_fl_13_suno
        user_id: mock_ai_fl_13
        skill_id: 00000000-0000-4000-8000-000000000303
        proficiency_level: advanced
        legacy_skill_id: null
      - id: us_mock_ai_fl_13_rw2
        user_id: mock_ai_fl_13
        skill_id: 00000000-0000-4000-8000-000000000202
        proficiency_level: advanced
        legacy_skill_id: null
    portfolio_items:
      - id: e0000000-0000-4000-8000-000000000049
        freelancer_profile_id: f0000000-0000-4000-8000-000000000013
        title: Пример AI-арта 13-1
        description: "Синтетический кадр портфолио для AI-арта. Автор: Мила Волкова. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-art-09.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: image_generation
        tools_used:
          - Midjourney
          - Photoshop
      - id: e0000000-0000-4000-8000-000000000050
        freelancer_profile_id: f0000000-0000-4000-8000-000000000013
        title: Пример AI-аватара 13-2
        description: "Синтетический кадр портфолио для AI-аватаров. Автор: Мила Волкова. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-avatar-09.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: image_generation
        tools_used:
          - Stable Diffusion
          - Clip Studio Paint
      - id: e0000000-0000-4000-8000-000000000051
        freelancer_profile_id: f0000000-0000-4000-8000-000000000013
        title: Пример AI-ретуши 13-3
        description: "Синтетический кадр портфолио для AI-ретуши. Автор: Мила Волкова. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-edit-09.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: image_generation
        tools_used:
          - Photoshop
          - Lightroom
      - id: e0000000-0000-4000-8000-000000000052
        freelancer_profile_id: f0000000-0000-4000-8000-000000000013
        title: Пример AI-агентов 13-4
        description: "Синтетический кадр портфолио для AI-агентов. Автор: Мила Волкова. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-agent-09.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: programming
        tools_used:
          - LangChain
          - OpenAI API
  - users:
      id: mock_ai_fl_14
      email: mock-ai-fl-14@neurogig.test
      name: Ханна Нг
      role: freelancer
      emailVerified: true
      image: /mock-users/avatars/mock-avatar-14.jpg
    user_profiles:
      id: mock_ai_fl_14
      user_id: mock_ai_fl_14
      name: Ханна Нг
      avatar_url: /mock-users/avatars/mock-avatar-14.jpg
      bio: "Помогаю продуктовым командам упаковывать AI-возможности в понятный мобильный опыт: сценарии, доверие, объяснимость и conversion."
      company_name: null
      company_role: null
    freelancer_profiles:
      id: f0000000-0000-4000-8000-000000000014
      user_id: mock_ai_fl_14
      specialization: Мобильный UX для AI-функций
      hourly_rate: 10500
      availability: full-time
      experience: "Сценарии ассистентов, формирующие привычку: напоминания, сводки и offline-first оболочки."
    user_skills:
      - id: us_mock_ai_fl_14_gem
        user_id: mock_ai_fl_14
        skill_id: 00000000-0000-4000-8000-000000000005
        proficiency_level: intermediate
        legacy_skill_id: null
      - id: us_mock_ai_fl_14_oapi
        user_id: mock_ai_fl_14
        skill_id: 00000000-0000-4000-8000-000000000402
        proficiency_level: advanced
        legacy_skill_id: null
      - id: us_mock_ai_fl_14_pe
        user_id: mock_ai_fl_14
        skill_id: 00000000-0000-4000-8000-000000000501
        proficiency_level: advanced
        legacy_skill_id: null
    portfolio_items:
      - id: e0000000-0000-4000-8000-000000000053
        freelancer_profile_id: f0000000-0000-4000-8000-000000000014
        title: Пример AI mobile 14-1
        description: "Синтетический кадр портфолио для AI mobile-работ. Автор: Ханна Нг. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-mobile-09.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: programming
        tools_used:
          - Figma
          - SwiftUI
      - id: e0000000-0000-4000-8000-000000000054
        freelancer_profile_id: f0000000-0000-4000-8000-000000000014
        title: Пример AI video 14-2
        description: "Синтетический кадр портфолио для AI video-работ. Автор: Ханна Нг. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-video-09.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: video_generation
        tools_used:
          - Runway Gen-3
          - DaVinci Resolve
      - id: e0000000-0000-4000-8000-000000000055
        freelancer_profile_id: f0000000-0000-4000-8000-000000000014
        title: Пример AI-арта 14-3
        description: "Синтетический кадр портфолио для AI-арта. Автор: Ханна Нг. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-art-10.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: image_generation
        tools_used:
          - Midjourney
          - Photoshop
      - id: e0000000-0000-4000-8000-000000000056
        freelancer_profile_id: f0000000-0000-4000-8000-000000000014
        title: Пример AI-аватара 14-4
        description: "Синтетический кадр портфолио для AI-аватаров. Автор: Ханна Нг. Только для локального QA."
        media_url: /mock-users/portfolio/mock-portfolio-ai-avatar-10.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: image_generation
        tools_used:
          - Stable Diffusion
          - Clip Studio Paint
  - users:
      id: mock_ai_fl_15
      email: mock-ai-fl-15@neurogig.test
      name: Alex Rivera
      role: freelancer
      emailVerified: true
      image: /mock-users/avatars/mock-avatar-15.jpg
    user_profiles:
      id: mock_ai_fl_15
      user_id: mock_ai_fl_15
      name: Alex Rivera
      avatar_url: /mock-users/avatars/mock-avatar-15.jpg
      bio: "I help leaders ship AI without chaos: governance, metrics, and coaching."
      company_name: null
      company_role: null
    freelancer_profiles:
      id: f0000000-0000-4000-8000-000000000015
      user_id: mock_ai_fl_15
      specialization: Prompt systems and AI strategy
      hourly_rate: 14000
      availability: 2 client slots
      experience: Playbooks for evaluation, vendor selection, and team training with realistic ROI framing.
    user_skills:
      - id: us_mock_ai_fl_15_str
        user_id: mock_ai_fl_15
        skill_id: 00000000-0000-4000-8000-000000000502
        proficiency_level: expert
        legacy_skill_id: null
      - id: us_mock_ai_fl_15_trn
        user_id: mock_ai_fl_15
        skill_id: 00000000-0000-4000-8000-000000000503
        proficiency_level: advanced
        legacy_skill_id: null
      - id: us_mock_ai_fl_15_pe
        user_id: mock_ai_fl_15
        skill_id: 00000000-0000-4000-8000-000000000501
        proficiency_level: expert
        legacy_skill_id: null
    portfolio_items:
      - id: e0000000-0000-4000-8000-000000000057
        freelancer_profile_id: f0000000-0000-4000-8000-000000000015
        title: AI image editing sample 15-1
        description: Synthetic portfolio frame for AI image editing work by Alex. Intended for local QA only.
        media_url: /mock-users/portfolio/mock-portfolio-ai-edit-10.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: image_generation
        tools_used:
          - Photoshop
          - Lightroom
      - id: e0000000-0000-4000-8000-000000000058
        freelancer_profile_id: f0000000-0000-4000-8000-000000000015
        title: AI agents sample 15-2
        description: Synthetic portfolio frame for AI agents work by Alex. Intended for local QA only.
        media_url: /mock-users/portfolio/mock-portfolio-ai-agent-10.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: programming
        tools_used:
          - LangChain
          - OpenAI API
      - id: e0000000-0000-4000-8000-000000000059
        freelancer_profile_id: f0000000-0000-4000-8000-000000000015
        title: AI mobile sample 15-3
        description: Synthetic portfolio frame for AI mobile work by Alex. Intended for local QA only.
        media_url: /mock-users/portfolio/mock-portfolio-ai-mobile-10.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: programming
        tools_used:
          - Figma
          - SwiftUI
      - id: e0000000-0000-4000-8000-000000000060
        freelancer_profile_id: f0000000-0000-4000-8000-000000000015
        title: AI video sample 15-4
        description: Synthetic portfolio frame for AI video work by Alex. Intended for local QA only.
        media_url: /mock-users/portfolio/mock-portfolio-ai-video-10.jpg
        media_type: image/jpeg
        media_width: 1376
        media_height: 768
        caption: null
        category: video_generation
        tools_used:
          - Runway Gen-3
          - DaVinci Resolve
  - users:
      id: mock_cl_01
      email: sarah.mitchell@yahoo.com
      name: Sarah Mitchell
      role: client
      emailVerified: true
      image: /mock-users/avatars/mock-avatar-cl-01.jpg
    user_profiles:
      id: mock_cl_01
      user_id: mock_cl_01
      name: Sarah Mitchell
      nickname: sarah-mitchell
      avatar_url: /mock-users/avatars/mock-avatar-cl-01.jpg
      bio: Hiring generative-AI teams for industrial automation pilots.
      company_name: Acme Robotics
      company_role: VP of Engineering
      location: Detroit, MI
    user_languages:
      - language_code: en
        lang_level: native
      - language_code: de
        lang_level: conversational
    user_skills: []
    portfolio_items: []
  - users:
      id: mock_cl_02
      email: jamie.wu@yahoo.com
      name: Джейми Ву
      role: client
      emailVerified: true
      image: /mock-users/avatars/mock-avatar-cl-02.jpg
    user_profiles:
      id: mock_cl_02
      user_id: mock_cl_02
      name: Джейми Ву
      nickname: jamie-wu
      avatar_url: /mock-users/avatars/mock-avatar-cl-02.jpg
      bio: Планирует дорожные карты AI-функций для B2B SaaS-продуктов.
      company_name: Nordic Labs GmbH
      company_role: Head of Product
      location: Helsinki, Finland
    user_languages:
      - language_code: en
        lang_level: fluent
      - language_code: fr
        lang_level: conversational
    user_skills: []
    portfolio_items: []
  - users:
      id: mock_cl_03
      email: priya.sharma@yahoo.com
      name: Прия Шарма
      role: client
      emailVerified: true
      image: /mock-users/avatars/mock-avatar-cl-03.jpg
    user_profiles:
      id: mock_cl_03
      user_id: mock_cl_03
      name: Прия Шарма
      nickname: priya-sharma
      avatar_url: /mock-users/avatars/mock-avatar-cl-03.jpg
      bio: Ведет бренд-кампании и креативные процессы с использованием генеративных медиа.
      company_name: Horizon Media Group
      company_role: Creative Director
      location: Mumbai, India
    user_languages:
      - language_code: en
        lang_level: native
      - language_code: es
        lang_level: conversational
    user_skills: []
    portfolio_items: []
  - users:
      id: mock_cl_04
      email: mara.webb@yahoo.com
      name: Мара Уэбб
      role: client
      emailVerified: true
      image: /mock-users/avatars/mock-avatar-cl-04.jpg
    user_profiles:
      id: mock_cl_04
      user_id: mock_cl_04
      name: Мара Уэбб
      nickname: mara-webb
      avatar_url: /mock-users/avatars/mock-avatar-cl-04.jpg
      bio: Оценивает внедрение RAG- и LLM-решений для регулируемых отраслей.
      company_name: DeepStack Analytics
      company_role: CTO
      location: Chicago, IL
    user_languages:
      - language_code: en
        lang_level: native
      - language_code: es
        lang_level: conversational
    user_skills: []
    portfolio_items: []
  - users:
      id: mock_cl_05
      email: yuki.tanaka@yahoo.com
      name: Yuki Tanaka
      role: client
      emailVerified: true
      image: /mock-users/avatars/mock-avatar-cl-05.jpg
    user_profiles:
      id: mock_cl_05
      user_id: mock_cl_05
      name: Yuki Tanaka
      nickname: yuki-tanaka
      avatar_url: /mock-users/avatars/mock-avatar-cl-05.jpg
      bio: Store operations and customer-facing AI experiments.
      company_name: Sakura Retail Co.
      company_role: Operations Manager
      location: Osaka, Japan
    user_languages: []
    user_skills: []
    portfolio_items: []
```
