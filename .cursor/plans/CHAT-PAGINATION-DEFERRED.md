# Chat Pagination Deferred

## Status

Отложено относительно ближайшей фазы chat integration.

## Why Deferred

В текущей фазе приоритет у:

- переноса chat orchestration в `src/stores/chat/*`
- интеграции готового `src/ui/chat` с реальным feature
- перехода от двухколоночного workspace к flow `list page -> conversation page`

Pagination и older-messages пока не входят в runtime-реализацию, чтобы не смешивать структурную миграцию с дополнительным UX/state scope.

## Deferred Scope

- загрузка старых сообщений по cursor / page token
- UI affordances для `load older`
- автоматический или ручной infinite scroll вверх
- отдельные loading / error состояния для older-messages
- сохранение позиции скролла при дозагрузке истории
- формат взаимодействия pagination-state с realtime и optimistic rows

## Current Known Connections

Связанные данные и логика уже упоминаются в текущем плане интеграции:

- `pagination cursor state`
- `loadOlderChatMessagesFx`
- `hasOlderMessages`
- `isLoadingOlderMessages`

Это означает, что при переносе в `src/stores/chat/*` нужно не потерять точки расширения, но не включать полный UX этой функциональности в первую интеграционную фазу.

## Files To Revisit Later

- `src/stores/chat/model.ts`
- `src/stores/chat/api.ts`
- `src/stores/chat/helpers.ts`
- `src/stores/chat/realtime.ts`
- `src/features/chat/page.tsx`
- `src/features/chat/thread.tsx`
- `src/features/chat/workspace.tsx`
- `src/ui/chat/messages.tsx`
- `src/ui/chat/container.tsx`
- `.cursor/plans/CHAT-UI-INTEGRATION-NEXT.md`

## Requirements For Future Phase

- определить, остается ли pagination cursor-based
- решить, где живет trigger `load older`: feature adapter или UI kit extension
- определить UX для conversation page:
  - отдельная кнопка `Load older`
  - sentinel/infinite scroll
  - комбинированный вариант
- зафиксировать поведение скролла после prepend older messages
- проверить совместимость с optimistic messages и realtime append
- определить, нужен ли отдельный UI contract в `src/ui/chat/messages.tsx`

## Current Implementation Guidance

В ближайшей фазе:

- не реализовывать `load older` в интерфейсе
- не добавлять production pagination UX
- оставить безопасные заглушки или внутренние seams для будущего расширения
- не форматировать deferred-функциональность в UI kit заранее без отдельного решения
