## Stage 3 fixes — порядок работ (внутренний план, RU)

### Правило языка

- **Developer docs** (чтобы могли использовать другие разработчики): на английском. Примеры: `src/alerts/README.md`, `src/components/ui/FILE-UPLOADER.md`.
- **Всё остальное** (планы, обсуждения, внутренние документы): на русском.

---

## Порядок работ

Сначала делаем системные задачи **S1 → S2 → S3**, затем “точечные” фиксы из `src/FIXES.md`.

### Процесс для каждой системной задачи (S\*)

- Реализуем
- Добавляем демо/доки
- Пауза на тестирование
- Правки по фидбеку
- Коммит
- Следующий пункт

---

## Системные задачи

### S1 — Alerts (сделано)

- `$alerts` store как source of truth для активных алертов
- `updateAlert` для patch‑обновлений
- Progress UI (LinearProgress) + корректный cleanup overlay
- Playground demo + docs

Результат: закоммичено (см. историю ветки `fix/stage3-fixes`).

### S2 — Uploader (сделано)

- `FileUploader` на `react-dropzone` + MUI, кастомный picker UI (вариант B, без нативной Browse кнопки)
- Русские ошибки + `fileSize()` util
- Playground demo + developer docs

Результат: закоммичено (см. историю ветки `fix/stage3-fixes`).

### S3 — Portfolio Gallery (в работе/следующий пункт)

План: `.cursor/plans/s3_portfolio_gallery_e083737c.plan.md`

---

## После S1–S3: фиксы из `src/FIXES.md`

- MUI autofill: убрать кастомный цвет autofill для inputs
- Email verification UX: отдельная страница “Email подтверждён” + переход на `/login`
- Specialization: `Autocomplete multiple freeSolo`, хранение строкой через запятую, переиспользуемый компонент
- RU error mapping: типовые ошибки (profile/portfolio, Internal Server error, upload errors)
- Portfolio reset file input после загрузки
- Portfolio upload progress через `onUploadProgress` → `updateAlert` (+ UI)
- `db:check`: убрать дублирование ID/User ID в выводе
