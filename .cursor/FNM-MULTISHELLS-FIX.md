# Решение проблемы fnm multishells symlink

## Проблема

При работе с fnm в терминале и GUI приложениях (Cursor, VSCode) возникали две проблемы:

1. **Ошибка в Cursor sandbox:**

    ```bash
    error: Can't create the symlink for multishells at "~/.local/state/fnm_multishells/...". 
    Maybe there are some issues with permissions for the directory? Operation not permitted (os error 1)
    ```

2. **Git hooks не работают в GUI:**

    ```bash
    env: node: No such file or directory
    husky - pre-commit script failed (code 127)
    ```

## Причина

### Корневая проблема: `eval "$(fnm env --use-on-cd)"`

`fnm env` создаёт **временные multishell симлинки** при каждой инициализации shell:
- Путь: `~/.local/state/fnm_multishells/<random_id>/bin`
- При каждом старте shell создаётся **новый уникальный путь**
- GUI приложения (Cursor/VSCode) запоминают PATH при запуске
- Когда симлинк удаляется → `node: No such file or directory`

### Где был fnm:
- `~/.zshenv` - загружается первым, **всегда**
- `~/.zprofile` - для login shells
- `~/.zshrc` - для interactive shells

Все три файла вызывали `fnm env`, что создавало конфликты и множественные PATH записи.

## ✅ Решение (работающее)

### Использовать стабильный PATH через default alias

Вместо динамических multishell симлинков используем постоянный путь:

```zsh
/Users/<user>/Library/Application Support/fnm/aliases/default/bin
```

### Шаг 1: Очистить .zshenv и .zprofile

**~/.zshenv:**

```bash
# fnm configuration moved to .zshrc for better control
```

**~/.zprofile:**

```bash
# fnm configuration moved to .zshrc for better control
```

### Шаг 2: Настроить .zshrc

**~/.zshrc:**

```bash
# fnm - Fast and simple Node.js version manager, built in Rust
# РЕШЕНИЕ ПРОБЛЕМЫ: Используем стабильный PATH через default alias вместо multishell

# Настройка переменных окружения fnm
export FNM_DIR="$HOME/Library/Application Support/fnm"
export FNM_MULTISHELL_PATH="$FNM_DIR/aliases/default"
export FNM_NODE_DIST_MIRROR="https://nodejs.org/dist"
export FNM_LOGLEVEL="info"
export FNM_ARCH="arm64"

# Добавляем default alias в PATH (стабильный путь, не меняется между сессиями)
export PATH="$FNM_DIR/aliases/default/bin:$PATH"

# Функция для автоматического переключения версии при переходе в директорию с .nvmrc или .node-version
autoload -U add-zsh-hook
_fnm_autoload_hook () {
  if [[ -f .nvmrc || -f .node-version ]]; then
    fnm use --silent-if-unchanged 2>/dev/null
  fi
}
add-zsh-hook chpwd _fnm_autoload_hook
_fnm_autoload_hook  # Вызываем сразу при старте shell

# Автоматическая очистка старых fnm multishells (запускается раз в день)
if [[ ! -f ~/.fnm_cleanup_today ]] || [[ -n $(find ~/.fnm_cleanup_today -mtime +1 2>/dev/null) ]]; then
  find ~/.local/state/fnm_multishells/ -type l -mtime +1 -delete 2>/dev/null
  touch ~/.fnm_cleanup_today
fi
```

### Шаг 3: Убедиться что default alias настроен

```bash
fnm list
# Должна быть строка:
# * v24.13.0 default
```

Если нет, создать alias:

```bash
fnm alias default 24.13.0
```

### Шаг 4: Перезапустить приложения

1. Закрыть все терминалы
2. Перезапустить Cursor/VSCode
3. Открыть новый терминал и проверить:

```bash
which node
# Должно быть: /Users/<user>/Library/Application Support/fnm/aliases/default/bin/node

echo $PATH | head -1
# Первая запись должна быть: /Users/<user>/Library/Application Support/fnm/aliases/default/bin
```

## ✅ Результат

**Было:**
- ❌ fnm создавал временные multishell симлинки при каждой сессии
- ❌ GUI приложения получали устаревший PATH
- ❌ Git hooks не работали (node not found)
- ❌ Постоянные ошибки "Can't create the symlink"

**Стало:**
- ✅ Стабильный PATH через default alias
- ✅ GUI и терминал используют одинаковый PATH
- ✅ Git hooks работают из коробки
- ✅ Никаких ошибок о symlink
- ✅ Автопереключение версий через `.nvmrc` работает

## Проверка

```bash
# В новом терминале:
which node
# /Users/<user>/Library/Application Support/fnm/aliases/default/bin/node

echo $FNM_MULTISHELL_PATH
# /Users/<user>/Library/Application Support/fnm/aliases/default

# Проверка git hooks в проекте:
git commit -m "test"
# Должно работать без ошибок node not found
```

## Преимущества

1. **Стабильность**: PATH не меняется между сессиями
2. **Совместимость**: GUI приложения всегда видят актуальный node
3. **Производительность**: Не создаются временные симлинки
4. **Простота**: Одна конфигурация в `.zshrc`
5. **Гибкость**: Автопереключение версий через `.nvmrc` сохраняется

## Дата внедрения

10 февраля 2026 - протестировано и работает
