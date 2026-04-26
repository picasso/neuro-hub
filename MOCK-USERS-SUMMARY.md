# MOCK-USERS summary

Краткая сводка по 15 фрилансерам + **5 клиентов**; весь YAML-источник моков теперь в [MOCK-USERS.md](MOCK-USERS.md). **Сид в БД:** `yarn db:seed:mock-users` (после `yarn db:seed`); обязательный env — `DATABASE_URL`, детали и compatibility notes — в шапке `MOCK-USERS.md`. Картинки — JPEG с качеством 60. `art-01` → `mock-portfolio-ai-art-01.jpg` в `public/mock-users/portfolio/`; пути в данных — `/mock-users/...`.

1. **Mira Chen** — аватар `mock-avatar-01.jpg` — AI concept art and key visuals — портфолио: art-01, avatar-01, edit-01, agent-01
2. **Джордан Окоро** — аватар `mock-avatar-02.jpg` — AI-native интерфейсы мобильных продуктов — портфолио: mobile-01, video-01, art-02, avatar-02
3. **Елена Васкес** — аватар `mock-avatar-03.jpg` — AI-агенты для поддержки и операционных команд — портфолио: edit-02, agent-02, mobile-02, video-02
4. **Чхве Юджин** — аватар `mock-avatar-04.jpg` — AI-ретушь и композитинг — портфолио: art-03, avatar-03, edit-03, agent-03
5. **Nina Kowalski** — аватар `mock-avatar-05.jpg` — AI avatars and character packs — портфолио: mobile-03, video-03, art-04, avatar-04
6. **Theo Marin** — аватар `mock-avatar-06.jpg` — AI video for ads and social — портфолио: edit-04, agent-04, mobile-04, video-04
7. **Райли Брукс** — аватар `mock-avatar-07.jpg` — Чат-боты и интеграция LLM-приложений — портфолио: art-05, avatar-05, edit-05, agent-05
8. **Фарис Аль-Фарси** — аватар `mock-avatar-08.jpg` — AI-иллюстрации для бренд-кампаний — портфолио: mobile-05, video-05, art-06, avatar-06
9. **Nora Kelly** — аватар `mock-avatar-09.jpg` — Compositing and scene rebuilds — портфолио: edit-06, agent-06, mobile-06, video-06
10. **Арман Рахман** — аватар `mock-avatar-10.jpg` — Корпоративные RAG-системы и ассистенты знаний — портфолио: art-07, avatar-07, edit-07, agent-07
11. **Леа Шмидт** — аватар `mock-avatar-11.jpg` — UX для автоматизации и оркестрации агентов — портфолио: mobile-07, video-07, art-08, avatar-08
12. **Камила Риос** — аватар `mock-avatar-12.jpg` — AI-пропсы и environment tiles для игр — портфолио: edit-08, agent-08, mobile-08, video-08
13. **Мила Волкова** — аватар `mock-avatar-13.jpg` — AI-наборы для аудио и видеосинхронизации — портфолио: art-09, avatar-09, edit-09, agent-09
14. **Ханна Нг** — аватар `mock-avatar-14.jpg` — Мобильный UX для AI-функций — портфолио: mobile-09, video-09, art-10, avatar-10
15. **Alex Rivera** — аватар `mock-avatar-15.jpg` — Prompt systems and AI strategy — портфолио: edit-10, agent-10, mobile-10, video-10

## Клиенты (5) — теперь тоже в YAML

| Имя | Компания | Роль в компании |
| --- | --- | --- |
| Sarah Mitchell | Acme Robotics | VP of Engineering |
| Джейми Ву | Nordic Labs GmbH | Head of Product |
| Прия Шарма | Horizon Media Group | Creative Director |
| Мара Уэбб | DeepStack Analytics | CTO |
| Yuki Tanaka | Sakura Retail Co. | Operations Manager (без `user_languages` в YAML) |

Аватары: `public/mock-users/avatars/`. Работы: `public/mock-users/portfolio/`.
