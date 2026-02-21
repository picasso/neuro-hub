# Font Switcher Removal Guide

После того как выбор шрифта сделан, этот документ описывает, как удалить временный font switcher и оставить только выбранный шрифт.

## Предварительно

1. Решить, какой шрифт остаётся: **Manrope**, **Inter** или **Open Sans**
2. Сохранить этот документ локально или в другой ветке — он будет удалён вместе с кодом

---

## Шаги удаления

### 1. Упростить `src/app/fonts.ts`

Оставить только выбранный шрифт. Пример для Manrope (текущий дефолт):

```ts
import { Manrope } from 'next/font/google'

export const fontSans = Manrope({
    subsets: ['latin', 'cyrillic'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-sans',
})
```

Для Inter:

```ts
import { Inter } from 'next/font/google'

export const fontSans = Inter({
    subsets: ['latin', 'cyrillic'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-sans',
})
```

Для Open Sans:

```ts
import { Open_Sans } from 'next/font/google'

export const fontSans = Open_Sans({
    subsets: ['latin', 'cyrillic'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-sans',
})
```

Удалить: `fontOptions`, `fonts`, `fontLabels`, тип `FontId`.

---

### 2. Обновить `src/app/layout.tsx`

- Заменить `import { fonts } from './fonts'` на `import { fontSans } from './fonts'`
- Вернуть `body` к одному классу:

  ```tsx
  className={fontSans.variable}
  ```

- Удалить обёртку `FontProvider` — оставить только `ThemeRegistry` и его children
- Удалить `import { cn } from '@/lib/utils'` (если больше не используется)

---

### 3. Очистить `src/app/globals.css`

- Удалить блок с `body` и `body[data-font='...']` (правила переключения шрифта)
- В `@theme inline` вернуть `--font-sans` к стандартному виду:

  ```css
  --font-sans: var(--font-sans), 'Manrope', ui-sans-serif, system-ui, sans-serif;
  ```

  (или Inter / Open Sans вместо Manrope, в зависимости от выбора)

---

### 4. Удалить `src/components/providers/font-provider.tsx`

Полностью удалить файл.

---

### 5. Обновить `src/components/providers/index.ts`

Удалить экспорты `FontProvider` и `FontSwitcher`:

```ts
export { ThemeRegistry } from './theme-registry'
```

---

### 6. Обновить `src/components/ui/header.tsx`

- Удалить `import { FontSwitcher } from '@/components/providers'`
- Удалить `<FontSwitcher />` из `Stack`

---

### 7. Очистить localStorage (опционально)

Пользователи могли сохранить `font-preference` в localStorage. Ключ: `font-preference`. При желании можно добавить одноразовую миграцию для его удаления, но обычно это не требуется.

---

### 8. Удалить этот документ

```bash
rm docs/FONT-SWITCHER-REMOVAL.md
```

---

## Чек-лист

- [ ] Упростить `fonts.ts` до одного шрифта
- [ ] Обновить `layout.tsx`: убрать FontProvider, вернуть один font variable class
- [ ] Очистить `globals.css` от font-switcher правил
- [ ] Удалить `font-provider.tsx`
- [ ] Обновить `providers/index.ts`
- [ ] Убрать FontSwitcher из `header.tsx`
- [ ] Удалить `docs/FONT-SWITCHER-REMOVAL.md`
- [ ] `yarn lint` и `yarn type-check` проходят
