---
name: MUI to shadcn migration
overview: Поэтапная миграция проекта neuro-hub с MUI v7 + Emotion на shadcn/ui + Tailwind CSS с параллельным обновлением дизайна. 48 файлов с MUI-импортами, 44+ иконки, кастомная тема — мигрируем инкрементально через Playground с ручным тестированием на каждом шаге.
todos:
  - id: phase-0-design
    content: "Phase 0: Дизайн-система — UI/UX скилл, новые токены, ревизия .cursor/rules (6 файлов с MUI)"
    status: pending
  - id: phase-0-review
    content: "Phase 0 checkpoint: Ревизия плана миграции — что не нужно мигрировать после обновления дизайна"
    status: pending
  - id: phase-1-infra
    content: "Phase 1: Инфраструктура — Tailwind + shadcn + MCP + Tailwind IntelliSense Extension"
    status: pending
  - id: phase-2-playground
    content: "Phase 2: Новый Playground — обсудить требования, создать на основе shadcn шаблона"
    status: pending
  - id: phase-3-icons
    content: "Phase 3: Иконки — lucide-react маппинг, демо в Playground, затем замена в коде"
    status: pending
  - id: phase-4-base
    content: "Phase 4: Базовые компоненты — Button, TS, Link, Card, Badge, Avatar (Playground -> код)"
    status: pending
  - id: phase-5-feedback
    content: "Phase 5: Feedback/Overlay — Dialog, Alert, Tooltip, Progress (Playground -> код)"
    status: pending
  - id: phase-6-forms
    content: "Phase 6: Формы — Input, Checkbox, Select, Autocomplete, FileUploader (Playground -> код)"
    status: pending
  - id: phase-7-complex
    content: "Phase 7: Tabs, AppBar/Header (Playground -> код). Stepper и Accordion — в конец/опционально"
    status: pending
  - id: phase-8-layouts
    content: "Phase 8: Layout-примитивы — Stack компонент, Container, замена Box/Grid/Paper"
    status: pending
  - id: phase-9-pages
    content: "Phase 9: Миграция страниц — только после отдельного согласования по каждой странице"
    status: pending
  - id: phase-10-providers
    content: "Phase 10: Удаление MUI ThemeProvider, замена useTheme/useMediaQuery, включение preflight"
    status: pending
  - id: phase-11-cleanup
    content: "Phase 11: Финальная очистка — удаление ui-theme, MUI/Emotion deps, финальный билд"
    status: pending
  - id: phase-end-deferred
    content: "Deferred: Stepper/Accordion — мигрировать только если нужно после нового дизайна"
    status: pending
isProject: false
---

# Миграция neuro-hub: MUI -> shadcn/ui

## Текущее состояние

- **48 файлов** с импортами из `@mui/`* (material, icons-material, material-nextjs)
- **0 CSS/Tailwind** — стилизация полностью через MUI `sx` prop
- **Кастомная тема**: расширенная палитра (`contrast`, `dimmed`, `pale`, `background.block`), component overrides, анимации
- **Обёртки**: `Button`, `TextStyled/TS`, `Icon` (44+ MUI-иконок в [assets.tsx](src/components/ui/assets.tsx))
- **Сложные MUI-компоненты**: Stepper, Autocomplete, Accordion, Dialog, Tabs
- **Провайдер**: [theme-registry.tsx](src/components/providers/theme-registry.tsx) (ThemeProvider + CssBaseline + AppRouterCacheProvider)
- **6 из 13 Cursor rules** упоминают MUI и требуют обновления

## Ключевые принципы миграции

1. **Playground-first** — каждый компонент сначала реализуется и доводится в Playground, только потом заменяется в коде
2. **По одному** — замена компонентов в коде по одному, с ручной проверкой и утверждением после каждого
3. **Цвета сразу** — shadcn использует CSS-переменные в `globals.css`, правильные цвета работают с момента настройки (Фаза 1)
4. **MUI + Tailwind сосуществуют** — Tailwind с `preflight: false`, обе системы работают параллельно до полного удаления MUI
5. **Страницы — отдельно** — миграция каждой страницы только после согласования (мигрировать / переделать по дизайну)

---

## Фаза 0: Дизайн-система (перед миграцией)

### 0.1 UI/UX Pro Max скилл

Установить скилл ([https://skills.sh/nextlevelbuilder/ui-ux-pro-max-skill/ui-ux-pro-max](https://skills.sh/nextlevelbuilder/ui-ux-pro-max-skill/ui-ux-pro-max)) и с его помощью:

- Обновить цветовую палитру и дизайн-токены
- Определить новый визуальный стиль компонентов
- Зафиксировать решения в формате CSS variables / Tailwind config

### 0.2 Ревизия .cursor/rules

6 файлов содержат упоминания MUI и требуют обновления:

| Файл                                                           | Что менять                                                              |
| -------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [code-style/RULE.md](.cursor/rules/code-style/RULE.md)         | Секция "MUI sx Prop Syntax" -> Tailwind conventions                     |
| [develop/RULE.md](.cursor/rules/develop/RULE.md)               | Секции 5 (MUI/React API), 8 (UI Components), чеклист -> shadcn patterns |
| [next-js/RULE.md](.cursor/rules/next-js/RULE.md)               | Секция "MUI Grid v7" -> Tailwind grid                                   |
| [anti-patterns/RULE.md](.cursor/rules/anti-patterns/RULE.md)   | `styled-components -> @emotion` -> Tailwind                             |
| [tech-stack/RULE.md](.cursor/rules/tech-stack/RULE.md)         | MUI 7.3+ / @emotion -> shadcn/ui + Tailwind                             |
| [role-expertise/RULE.md](.cursor/rules/role-expertise/RULE.md) | Material UI в описании экспертизы -> shadcn/Tailwind                    |

### 0.3 Checkpoint: ревизия плана

После определения нового дизайна — пересмотреть план миграции:

- Какие компоненты больше не нужны (удаляем, а не мигрируем)
- Какие страницы будут переделаны с нуля (не мигрируем)
- Нужен ли Stepper/Accordion в новом дизайне

**Результат:** финальные дизайн-токены, обновлённые rules, скорректированный план.

---

## Фаза 1: Инфраструктура Tailwind + shadcn

### 1.1 Tailwind CSS

- Установить `tailwindcss`, `@tailwindcss/postcss`, `postcss`
- Создать `postcss.config.mjs` с плагином Tailwind
- Создать `src/app/globals.css` с Tailwind directives и CSS-переменными из Фазы 0
- Импортировать `globals.css` в [layout.tsx](src/app/layout.tsx)
- `preflight: false` на время сосуществования с MUI

### 1.2 shadcn/ui

- Инициализировать: `npx shadcn@latest init` (создаст `components.json`)
- Настроить `cn()` утилиту (добавить `tailwind-merge` к существующему `clsx`)

### 1.3 Tooling

- Установить **Tailwind CSS IntelliSense** расширение в VS Code / Cursor
- Установить и настроить **shadcn MCP** для AI-assisted работы с компонентами

### 1.4 CSS-переменные (цвета сразу работают)

```css
/* globals.css */
@import "tailwindcss";

@layer base {
  :root {
    --background: <из Фазы 0>;
    --foreground: <из Фазы 0>;
    --primary: <из Фазы 0>;
    --primary-foreground: <из Фазы 0>;
    /* ... остальные токены */
  }
}
```

Все shadcn-компоненты будут использовать эти переменные и отображать правильные цвета сразу.

**Контрольная точка:** Tailwind-классы работают рядом с MUI-компонентами, ничего не ломается, IntelliSense подсказывает классы.

---

## Фаза 2: Новый Playground

### 2.1 Обсуждение требований

Перед созданием — обсудить:

- Что берём из shadcn Playground шаблона ([https://ui.shadcn.com/examples/playground](https://ui.shadcn.com/examples/playground)), а что нет
- Структура табов/секций для демо компонентов
- Нужен ли сайдбар, пресеты, или другие элементы из шаблона

### 2.2 Создание

- Новый Playground на базе shadcn + Tailwind (заменяет текущий MUI-based [playground/page.tsx](src/app/playground/page.tsx))
- Dev-only ограничение сохраняется ([playground/layout.tsx](src/app/playground/layout.tsx))
- Секции для каждого типа компонентов (добавляются по мере миграции)

**Контрольная точка:** Playground работает, готов к наполнению демо-компонентами.

---

## Фаза 3: Иконочная система (lucide-react)

### Workflow: Playground -> Код

**Шаг 1 — Playground:**

- Установить `lucide-react`
- Создать маппинг MUI icons -> lucide в новом [assets.tsx](src/components/ui/assets.tsx)
- Переписать [icon.tsx](src/components/ui/icon.tsx) на lucide (без `SvgIcon`)
- Демо всех иконок в Playground, довести до совершенства

**Шаг 2 — Код (по одному):**

- Заменить использование иконок в коде файл за файлом
- Ручная проверка после каждой замены
- Удалить `@mui/icons-material` после полной замены

**Контрольная точка:** все иконки в Playground и в коде, `@mui/icons-material` удалён.

---

## Фаза 4: Базовые UI-компоненты

Каждый компонент: **демо в Playground -> утвердили -> замена в коде по одному**

### 4.1 Button

- `npx shadcn@latest add button`
- Переписать [button.tsx](src/components/ui/button.tsx) на shadcn Button
- Сохранить API: `label`, `thin`, `noWrap`, `leftIcon`, `rightIcon`
- `IconButton` -> shadcn Button `variant="ghost" size="icon"`

### 4.2 Typography / TextStyled

- Создать свой на Tailwind (shadcn не имеет Typography)
- Переписать [text-styled.tsx](src/components/ui/text-styled.tsx)
- Сохранить `md`, `strong`, `thin`, `inline`

### 4.3 Link

- Заменить `MuiLink` на Next.js `Link` + Tailwind
- Удалить [link-behaviour.tsx](src/components/ui/link-behaviour.tsx)

### 4.4 Card, Badge (Chip), Avatar

- `npx shadcn@latest add card badge avatar`

**Контрольная точка:** базовые компоненты в Playground и в коде.

---

## Фаза 5: Feedback и Overlay компоненты

Каждый компонент: **Playground -> утвердили -> код**

- `npx shadcn@latest add dialog alert tooltip progress`
- `Dialog` / `DialogContent` / `DialogTitle` (~3 файла)
- Кастомная Alert-система ([alert.tsx](src/alerts/alert.tsx)) -> shadcn Alert
- `Tooltip` (~1 файл)
- `CircularProgress` / `LinearProgress` (~3 файла) -> shadcn Progress / spinner
- `sonner` — оставить как есть

**Контрольная точка:** диалоги, алерты и прогрессы работают.

---

## Фаза 6: Форменные компоненты

Каждый компонент: **Playground -> утвердили -> код**

- `npx shadcn@latest add input label checkbox select`
- `TextField` (~10 файлов) -> shadcn `Input` + `Label`
- `Checkbox` + `FormControlLabel` (~3 файла)
- `Select` + `MenuItem` (~2 файла)
- `Autocomplete` (~1 файл) -> shadcn Combobox (popover + command)
- `InputAdornment` -> встроенные иконки
- [file-uploader.tsx](src/components/ui/file-uploader.tsx) на Tailwind

**Ключевые файлы:**

- [credentials-step.tsx](src/components/forms/onboarding/steps/credentials-step.tsx)
- [freelancer-profile-step.tsx](src/components/forms/onboarding/steps/freelancer-profile-step.tsx)
- [skills-selection-step.tsx](src/components/forms/onboarding/steps/skills-selection-step.tsx)
- [login-form.tsx](src/app/login/login-form.tsx)

**Контрольная точка:** все формы работают через shadcn.

---

## Фаза 7: Сложные компоненты

### Мигрируем сейчас:

- `npx shadcn@latest add tabs`
- `Tabs`/`Tab` -> shadcn Tabs
- `AppBar`/`Toolbar` ([header.tsx](src/components/ui/header.tsx)) -> кастомный header на Tailwind

### Откладываем (deferred):

- **Stepper/Step/StepLabel** ([progress-stepper.tsx](src/components/forms/onboarding/progress-stepper.tsx)) — оставляем на самый конец, может не понадобиться после нового дизайна
- **Accordion/AccordionSummary/AccordionDetails** ([faq-section.tsx](src/components/features/home/faq-section.tsx)) — аналогично

**Контрольная точка:** Tabs и Header мигрированы, Stepper/Accordion отложены.

---

## Фаза 8: Layout-примитивы

### 8.1 Stack компонент

- Создать свой `Stack` компонент (по аналогии с MUI): `direction`, `spacing`, `alignItems`, `justifyContent`
- Реализация через `<div>` + Tailwind flex классы
- Демо в Playground

### 8.2 Остальные примитивы

- `Box` (~40 файлов) -> `<div>` с Tailwind-классами
- `Container` (~15 файлов) -> кастомный Container wrapper
- `Grid` (~6 файлов) -> CSS Grid с Tailwind (`grid grid-cols-...`)
- `Paper` (~4 файла) -> `<div>` с border/rounded/shadow
- `Divider` -> `<hr>` или shadcn Separator

**Контрольная точка:** все MUI layout-компоненты заменены.

---

## Фаза 9: Миграция страниц

**Только после отдельного согласования по каждой странице:**

- Мигрировать (заменить MUI на shadcn в существующем коде)
- Или создать заново по новому дизайну

Страницы для согласования:

1. Home page (hero, showcase, benefits, FAQ)
2. Login / Signup
3. Onboarding wizard
4. Dashboard
5. Freelancer pages (listing, profile)
6. How it works / Post project / Projects

---

## Фаза 10: Провайдер и утилиты

**Примечание:** цвета в shadcn-компонентах работают сразу с Фазы 1 через CSS-переменные. Эта фаза — про удаление MUI-специфичных хуков и утилит.

- Убрать `useTheme` -> CSS variables или Tailwind
- Убрать `useMediaQuery` -> Tailwind responsive или кастомный хук `matchMedia`
- Убрать `alpha()` / `lighten()` / `darken()` -> Tailwind opacity (`bg-primary/50`) или CSS `color-mix()`
- Переписать [theme-registry.tsx](src/components/providers/theme-registry.tsx) — убрать MUI ThemeProvider, CssBaseline, AppRouterCacheProvider
- Включить Tailwind `preflight` (CSS reset)

**Контрольная точка:** MUI ThemeProvider полностью удалён.

---

## Фаза 11: Финальная очистка

- Удалить [src/components/ui-theme/](src/components/ui-theme/) целиком
- Удалить зависимости: `@mui/material`, `@mui/material-nextjs`, `@emotion/react`, `@emotion/styled`, `@emotion/cache`
- Проверить отсутствие `@mui` импортов: `grep -r "@mui" src/`
- Обновить ESLint/TypeScript конфиги
- `yarn build` + визуальная проверка всех страниц

**Контрольная точка:** проект полностью на shadcn/ui + Tailwind, MUI удалён, билд чистый.

---

## Deferred: Stepper и Accordion

Решение по миграции принимается после финализации нового дизайна:

- Если нужны — мигрируем (shadcn Accordion для FAQ, кастомный Stepper для onboarding)
- Если дизайн меняет эти секции — реализуем по-новому
- Если убираем — удаляем

---

## Риски и митигация

- **CSS-конфликты при сосуществовании**: Tailwind preflight отключен до полного удаления MUI
- **Потеря функциональности Autocomplete**: shadcn Combobox менее feature-rich — может потребоваться доработка
- **Маппинг иконок**: не все 44 MUI-иконки имеют точные аналоги в lucide — ручная проверка в Playground
- **Markdown в TextStyled**: `simpleMarkdown()` не зависит от MUI — переносится как есть
- **Bundle size**: временно вырастет (MUI + Tailwind + shadcn) до полного удаления MUI

## Ожидаемый результат

- Удаление 6 MUI/Emotion зависимостей (~200-300KB из бандла)
- Добавление: `tailwindcss`, `tailwind-merge`, `lucide-react`, `@radix-ui/`* (через shadcn)
- Полный контроль над компонентами (код живёт в проекте)
- Tailwind-first стилизация
- Playground как центр разработки и тестирования компонентов
- Обновлённые .cursor/rules под shadcn/Tailwind
