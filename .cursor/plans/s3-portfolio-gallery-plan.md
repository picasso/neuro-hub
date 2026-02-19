---
name: S3 Галерея портфолио
overview: Разработать UI-компоненты портфолио на react-photo-album (grid с превью и модальный viewer) + Playground demo + developer docs. Без встраивания в страницы на этом шаге.
todos:
  - id: schema-media-dimensions
    content: Добавить в модель/API mediaWidth, mediaHeight и опционально caption (миграция + типы + API)
    status: pending
  - id: deps-photo-album
    content: Добавить зависимость react-photo-album
    status: pending
  - id: component-gallery
    content: Реализовать <Portfolio /> (columns grid, превью, плейсхолдеры только где нужно)
    status: pending
  - id: modal-viewer
    content: Реализовать <PortfolioViewer /> (модалка + next/prev + клавиатура)
    status: pending
  - id: playground-demo
    content: Добавить демо-вкладку в Playground для галереи
    status: pending
  - id: docs-gallery
    content: Написать developer docs на английском (PORTFOLIO-GALLERY.md)
    status: pending
isProject: false
---

## Цель

- Разработать переиспользуемые UI-компоненты портфолио:
  - `<Portfolio />`: превью-галерея на основе `react-photo-album` (Columns grid).
  - `<PortfolioViewer />`: модальный просмотр элемента + навигация next/prev (кнопки + стрелки клавиатуры).
- На этом шаге сделать **Playground demo** и **developer docs**. Встраивание в реальные страницы — позже отдельным пунктом.

## Ключевые решения (подтверждены)

- Layout: **Columns grid**.
- Mixed media:
  - **image**: есть превью (показываем реальное изображение) и **сохраняем аспект**.
  - **video**: сейчас плейсхолдер с аспектом **16:9** (HD). В будущем — будет сгенерированное превью и аспект будет браться оттуда.
  - **audio/pdf/unknown**: квадратные плейсхолдеры с иконками (если нет превью).
- Модалка: **есть next/prev навигация**.
- Next.js Image: используем `render.image` из `react-photo-album` (поддерживается официально).
- API: **controlled viewer** — `<Portfolio items onOpen(index) />` + `<PortfolioViewer openIndex onChangeIndex onClose />`.

## План реализации

### 1) Схема/модель/API (нужно для корректного аспекта в grid)

- Добавить поля в `portfolio_items`:
  - `media_width` (int, nullable)
  - `media_height` (int, nullable)
  - `caption` (text, nullable) — опционально
- Обновить типы:
  - `src/stores/freelancer-portfolio/types.ts` (`PortfolioItem`)
  - `src/types/database.ts` (если генерируется — обновлять через `db:generate-types`)
- Обновить API маппинги:
  - `src/app/api/freelancers/[id]/portfolio/route.ts` (GET/POST должны отдавать/принимать новые поля)
- Источник значений для image на MVP: **вариант 1 (client-side)**:
  - после выбора файла вычисляем `mediaWidth/mediaHeight` на клиенте (`createImageBitmap(file)` или `new Image()` + `URL.createObjectURL(file)`)
  - отправляем в `POST /api/freelancers/:id/portfolio` вместе с `mediaUrl/mediaType/caption`
  - сервер принимает и сохраняет значения (без дополнительного fetch к Blob на MVP)

### 2) UI-компоненты

- Добавить зависимость: `react-photo-album`.
- `<Portfolio />`:
  - Новый файл: `src/components/ui/portfolio.tsx`
  - Вход: `items` + обработчик `onOpen(index)`
  - Маппирование `kind` по `mediaType` и/или расширению `mediaUrl`: `image | video | audio | pdf | unknown`
  - Для `react-photo-album` нужны `width/height`:
    - image: `mediaWidth/mediaHeight` из модели/API
    - video placeholder: 16:9 (например `width=16 height=9`)
    - audio/pdf/unknown placeholders: 1:1
  - Рендер:
    - image: реальное превью с сохранением аспекта
    - placeholders: квадратные/16:9 tiles с иконкой + подписью

- `<PortfolioViewer />`:
  - Новый файл: `src/components/ui/portfolio-viewer.tsx`
  - MUI `Dialog`
  - Навигация: next/prev + ArrowLeft/ArrowRight + Escape
  - Рендер по `kind`:
    - image: Next `Image` через `render.image` (официально поддерживается)
    - video/audio: нативные `<video>/<audio>`
    - pdf/unknown: ссылка `target=_blank` (+ опциональный embed)

## Playground demo

- Добавить демо-компонент `src/app/playground/demo-portfolio-gallery.tsx` с небольшим набором:
  - image item(s) (можно внешние URL для демо)
  - video/audio/pdf плейсхолдеры
- Добавить вкладку в `src/app/playground/page.tsx` (например `Portfolio Gallery`)

## Документация (developer docs)

- Техническую документацию по компоненту (которой могут пользоваться другие разработчики) ведём **на английском**:
  - `src/components/ui/PORTFOLIO-GALLERY.md` (uppercase + kebab-case)
  - Props, поддерживаемые media types, поведение модалки и навигации

## Acceptance checklist

- Playground demo: ровная сетка превью, модалка с next/prev
- Mixed media: понятные плейсхолдеры
- `yarn lint` + `yarn type-check` проходят
- Playground demo работает
