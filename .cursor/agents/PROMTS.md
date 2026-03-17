# Frontend Advocate Prompts

Готовые шаблоны для запуска `frontend-advocate` на strict refactor без предварительного согласования списка нарушений.

## 1. Strict Refactor

```zsh
Запусти frontend-advocate для [files].

Нужен strict refactor под project frontend conventions, сразу без предварительного review и без согласования списка нарушений. Сразу вноси изменения.

***[repeater для других вариантов]***
Цель:
- привести код к существующим frontend rules и wrapper-first подходу
- не менять user-facing behavior, routing, data flow и server/client boundaries
- сохранить текущую функциональность страницы

Обязательные правила:
- использовать существующие компоненты из `@/ui`, если они подходят
- не использовать `next/link`, если применим `Link` из `@/ui`
- не использовать raw `<img>`, если применим `next/image`
- типовые `div` с `flex` в `src/features` заменять на `Stack`, где это соответствует правилам
- typography переводить на `TS`, где это safe auto-refactor
- не собирать вручную visual surfaces, если подходит `Card`, `Empty` или другой approved wrapper
- не добавлять новые wrappers/abstractions, если подходящие уже есть
- не экспортировать internal sub-components в barrels
- не ломать accessibility и responsive behavior

Границы refactor:
- можно выносить internal sub-components и локальные helpers в соседние файлы
- нельзя менять публичные API компонентов без необходимости
- нельзя делать broad redesign
- если подходящего wrapper нет, не изобретай новый, а оставь минимально допустимую реализацию

После изменений дай отчет в таком формате:

## Changes
- список всех заметных замен и рефакторингов

## Convention Alignment
- какие именно project rules были применены
- что было заменено: `next/link` -> `Link`, `img` -> `next/image`, `div flex` -> `Stack`, raw text -> `TS`, manual surface -> `Card/Empty` и т.д.

## Remaining Drift
- что осталось неидеальным
- почему это не было изменено автоматически

## Verification
- результаты lint/type-check, если запускал
***[end of repeater]***
```

## 2. Strict Refactor + Findings

```zsh
Запусти frontend-advocate для [files].

Нужен strict refactor под project frontend conventions, нужно предварительное согласование списка нарушений. В финальном ответе отдельно перечисли все найденные нарушения.

***[repeater - см выше]***
```

## 3. Strict Refactor + Self-Check via Code Reviewer

```zsh
Запусти frontend-advocate для [files].

Нужен strict refactor под project frontend conventions, сразу без предварительного review и без согласования списка нарушений. Сразу вноси изменения. После завершения обязательно сделай self-check: запусти `code-reviewer` на итоговый diff/измененные файлы и учти его findings перед финальным ответом.

***[repeater - см выше]***

## Code Reviewer Follow-up
- какие findings дал `code-reviewer`
- что из этого было исправлено до финального ответа
- что осталось и почему
```
