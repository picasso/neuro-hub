# Mui Theme Guide

## Как правильно расширять палитру новыми цветами в MUI

**Есть 2 основных варианта**:

1. Добавить новый слот внутри существующей группы (как background.block)
Нужно расширить тип TypeBackground через module augmentation.
Добавить в `src/components/ui-theme/mui-modules.d.ts`:

    ```ts
    declare module '@mui/material/styles' {
        // allow extra background slots (e.g. `background.block`)
        interface TypeBackground {
            block: string
        }
    }

    ```

    После этого `background.block` в теме типизируется нормально (и `yarn type-check` проходит).

2. Добавить новую палитру верхнего уровня (например brand, muted, surface, border, link)
Тогда расширяешь Palette и PaletteOptions, как у тебя уже сделано для contrast:

```ts
declare module '@mui/material/styles' {
  interface Palette {
    brand: Palette['primary']
  }
  interface PaletteOptions {
    brand?: PaletteOptions['primary']
  }
}
```

А если хочешь использовать `color="brand"` на компонентах (Button/IconButton/SvgIcon и т.п.) — дополнительно расширяешь *PropsColorOverrides в mui-modules.d.ts аналогично тому, как у тебя сделано для `contrast`.
