# Chat UI Spec

Работаем в репозитории `neuro-hub`.

Этот документ покрывает только автономный UI для чата.

Вне scope:
- `src/stores/chat/*`
- интеграция с текущим `src/features/chat/*`
- routing, realtime, optimistic lifecycle, read sync, API mapping

Отдельный follow-up план на stores/integration делается после завершения этого UI-среза.

## Goal

Собрать независимый набор chat UI-компонентов в `src/ui/chat/*` и отдельный Playground demo для визуальной проверки без данных.

## File scope

- `src/ui/chat/message.tsx`
- `src/ui/chat/messages.tsx`
- `src/ui/chat/chat.tsx`
- `src/ui/chat/chats.tsx`
- `src/ui/chat/status.tsx`
- `src/ui/chat/composer.tsx`
- `src/ui/chat/container.tsx`
- `src/ui/chat/index.ts`
- `src/features/playground/components.tsx`
- новые `demo-*` / `demo-*-settings` файлы для chat UI

## Component hierarchy

Компоненты внутри `src/ui/chat` именуются без префикса `chat-`.

### `Message`

Роль:
- базовый bubble одного сообщения

Props:
- `direction: 'in' | 'out'`
- `text`
- `timestamp`
- `author`
- `read?`
- `reaction?`
- `link?`
- `file?`

Правила:
- `author` пока future-facing prop, визуально не акцентируется
- `reaction`, `link`, `file` пока остаются в API, но не обязаны получать полноценный UI в первом срезе

### `Messages`

Роль:
- список сообщений и базовые состояния

Props:
- `items`
- `loading?`
- `error?`

Правила:
- в первом срезе без date separators
- в первом срезе без pagination affordances

### `Chat`

Роль:
- один item списка диалогов

Props:
- `id`
- `name`
- `avatar?`
- `lastMessage?`
- `updatedAt`
- `unreadCount?`
- `onSelect?`

### `Chats`

Роль:
- список диалогов и его состояния

Props:
- `items`
- `activeId`
- `loading?`
- `error?`
- `onRefresh?`
- `onSelect?`

### `Status`

Роль:
- маленький badge-индикатор статуса с tooltip

Props:
- `status: 'sent' | 'sending' | 'failed' | 'loading'`
- `tooltip?`

Иконки:
- `loading` -> `ellipsis`
- `failed` -> `x`
- `sent` -> `check`
- `read`/delivered-read visual state -> `check-check`

### `Composer`

Роль:
- controlled-компонент ввода сообщения

Props:
- `value`
- `label`
- `onChange`
- `onSubmit`
- `disabled?`
- `isSubmitting?`
- `maxLength?`
- `placeholder?`
- `actions?`

### `Container`

Роль:
- общий responsive container для chat UI-зон

Props:
- `children`
- `background?`
- `padding?`
- `header?`
- `footer?`
- `stickyHeader?`
- `stickyFooter?`

Почему один контейнер:
- на текущем этапе нет полезной разницы между `ChatsContainer` и `MessagesContainer`
- если позже появится разница, можно сделать thin wrappers поверх `Container`

## Visual direction

### Overall

- плотность: `balanced`
- visual style: messenger-style
- `Chats` ближе к mobile messenger list
- `Messages` ближе к Telegram-style thread, но строже и менее round/pill
- фон области сообщений: `soft-tint`

### `Chats`

Опорный референс:
- messenger-like row list

Характер:
- плоские row-items, не card-grid
- avatar + name + preview + updatedAt + unread badge
- заметный compact unread badge
- не desktop CRM sidebar

### `Message`

Опорный референс:
- messenger thread с Telegram-like bubbles

Геометрия:
- bubble не pill-shaped
- мягкие углы, но не чрезмерно круглые
- у `out` прямой/срезанный `right-bottom` угол
- у `in` прямой/срезанный `left-bottom` угол

Meta:
- `out`: время + status/read
- `in`: только время
- status/read рендерится только для `out`
- status/read визуально частично перекрываются как в Telegram

Цвет:
- `out`: `muted-messenger`, не слишком brand-accent
- `in`: светлая нейтральная bubble surface

### First slice

Первый визуальный срез минимальный:
- `text + time + status/read`
- без date separators
- без визуальных placeholders для `link` и `file`

## Playground

Нужен отдельный demo-track в `src/features/playground/*`.

Что показать в Playground:
- `Message`: `in` / `out`, normal / sending / sent / failed / read
- `Messages`: normal / loading / error
- `Chat`: with unread / without unread / long preview
- `Chats`: normal / active / loading / error / empty
- `Status`: все состояния отдельно
- `Composer`: idle / disabled / submitting

Playground должен работать:
- на моковых данных
- без store wiring
- без backend wiring

## Decisions locked

- UI-план автономный и не зависит от текущей реализации `features/chat`
- отдельный integration/store план будет после
- один `Container` вместо двух контейнеров
- `Chats` и `Messages` не навязывают page layout
- `Messages` first slice минимальный
- визуальная база для thread: Telegram-inspired, но более строгая по форме bubbles
