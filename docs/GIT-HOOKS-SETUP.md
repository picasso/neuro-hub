# Git Hooks Configuration

## Overview

Проект использует Husky для управления git hooks с оптимизированным подходом к проверкам кода.

## Установленные хуки

### Pre-commit hook (быстрые проверки)

Запускается **перед каждым коммитом** и проверяет **только staged files** через `lint-staged`.

**Проверки:**
- ESLint с автоисправлением (`--fix`)
- Prettier форматирование

Полный **TypeScript type check** выполняется только в **pre-push** (`yarn type-check`), чтобы можно было коммитить незавершённые изменения без ошибок типов в других файлах.

**Время выполнения:** ~3-5 секунд (зависит от количества staged files)

**Конфигурация:** `.lintstagedrc`

```json
{
  "*.{ts,tsx}": ["eslint --fix --max-warnings 0", "prettier --write"],
  "*.{js,jsx,json,css,md}": ["prettier --write"]
}
```

### Pre-push hook (полные проверки)

Запускается **перед push** и проверяет **весь проект**.

**Проверки:**
- Type check всего проекта (`yarn type-check`)
- Lint всего проекта (`yarn lint:ci`)
- Format check всего проекта (`yarn format:check`)
- Запуск всех тестов (`yarn test`)

**Время выполнения:** ~10-30 секунд (зависит от размера проекта)

## Как это работает

### При коммите

```bash
git add .
git commit -m "feature: add new component"
# ↓ Автоматически запускается pre-commit
# ↓ Проверяет только staged files
# ↓ Автоматически исправляет форматирование
# ↓ Коммит создается с исправленными файлами
```

### При пуше

```bash
git push
# ↓ Автоматически запускается pre-push
# ↓ Проверяет весь проект
# ↓ Запускает все тесты
# ↓ Push происходит только если все проверки прошли
```

## Ручной запуск

Вы можете запустить проверки вручную:

```bash
# Проверка staged files
yarn lint-staged

# Полные проверки (как pre-push)
yarn type-check
yarn lint:ci
yarn format:check
yarn test
```

## Обход хуков (не рекомендуется)

Если нужно обойти хуки (например, для WIP коммита):

```bash
# Пропустить pre-commit
git commit --no-verify -m "WIP: work in progress"

# Пропустить pre-push
git push --no-verify
```

**⚠️ Внимание:** Обход хуков может привести к ошибкам в CI/CD.

## Установка хуков

Хуки устанавливаются автоматически после `yarn install` через скрипт `prepare`.

Если хуки не работают, выполните:

```bash
yarn husky install
```

## Troubleshooting

### Ошибка "Can't create the symlink for multishells" (fnm)

Если при коммите появляется:

```bash
error: Can't create the symlink for multishells at "~/.local/state/fnm_multishells/...".
Maybe there are some issues with permissions for the directory? Operation not permitted (os error 1)
```

**Причина:** Husky хуки используют `eval "$(fnm env --use-on-cd)"`, который пытается создавать временные multishell симлинки. В sandbox Cursor и других ограниченных окружениях эта операция блокируется.

**Решение:** Хуки настроены на стабильный PATH без multishell (см. `.cursor/FNM-MULTISHELLS-FIX.md`):

```bash
export PATH="$HOME/Library/Application Support/fnm/aliases/default/bin:$PATH"
```

Требование: `fnm alias default` должен быть настроен.

### Ошибка "env: node: No such file or directory"

Если хуки не находят node:

**Причина:** PATH не содержит node. Убедитесь, что используется стабильный fnm path (см. выше) и alias default настроен: `fnm alias default <version>`.

## Файлы конфигурации

- `.husky/pre-commit` - pre-commit hook script
- `.husky/pre-push` - pre-push hook script
- `.lintstagedrc` - конфигурация lint-staged
- `package.json` - scripts для хуков

## Преимущества текущей настройки

1. **Быстрые коммиты**: pre-commit проверяет только измененные файлы
2. **Безопасные пуши**: pre-push гарантирует, что код проходит все проверки
3. **Автоисправление**: lint-staged автоматически исправляет форматирование
4. **CI/CD синхронизация**: те же проверки, что и в GitHub Actions
