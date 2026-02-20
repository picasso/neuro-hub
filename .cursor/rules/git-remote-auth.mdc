---
name: Git remote & auth
description: Как диагностировать git push / gh auth mismatch и ошибки ремоута
alwaysApply: true
---

# Git remote & GitHub auth (Cursor agent)

## Перед любыми GitHub-операциями (push / PR / release)

- **Проверить `git remote -v`**
  - если `origin` по HTTPS содержит username (например `https://picasso@github.com/...`) — `git push` будет пытаться аутентифицироваться как этот пользователь
- **Проверить `gh auth status`**
  - активный аккаунт `gh` должен соответствовать тому, под кем ожидаются операции в репозитории
  - если активный аккаунт неверный: `gh auth switch -u <account>`
- **Проверить доступ к репозиторию**
  - `gh repo view <owner>/<repo> --json name,owner,url`

## Типовые ошибки и что делать

### 1) `Could not resolve host: github.com`

- **Причина**: нет сетевого доступа/ограничения окружения
- **Действие**: повторить команду с разрешением сети (в агенте: `required_permissions: ["full_network"]` или `["all"]`)

### 2) `could not read Password ... Device not configured` (git push по HTTPS)

- **Причина**: git не может интерактивно запросить пароль/токен (credential prompt/keychain недоступен)
- **Действия (по порядку)**:
  1. Убедиться, что активный `gh` аккаунт совпадает с username в `origin`, при необходимости `gh auth switch -u ...`
  2. Повторить push с полными правами окружения (в агенте: `required_permissions: ["all"]`)
  3. Если всё равно не получается — предложить:
     - push из локального терминала пользователя, где креды настроены, **или**
     - переключить `origin` на SSH (если у пользователя настроен SSH ключ)

## Примечание про `gh` и sandbox

- Любые `gh` команды часто требуют `required_permissions: ["all"]` (иначе токены/keyring могут быть недоступны)
