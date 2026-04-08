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

## 4. Rule Audit

```zsh
Запусти frontend-advocate для [files].

Нужен strict rule-audit + autofix под project frontend conventions. Не делай предварительное согласование списка нарушений. Сразу вноси исправления там, где нарушение можно безопасно исправить без изменения user-facing behavior, data flow, routing и server/client boundaries.

Сейчас не оценивай продуктовую спецификацию и не предлагай redesign, если он не связан напрямую с нарушением rules. Фокус только на drift относительно project rules и agreed frontend semantics.

Проверь особенно:
- wrapper-first подход из `@/ui`
- `Stack` вместо raw layout `div`, когда `div` выражает только `flex/gap/alignment`
- `TS` вместо raw text markup, где это уместно
- запрет nested `index.ts`
- `use client` boundaries
- comments style: только `//`, без `/** */`
- отсутствие deprecated event aliases вроде `FormEvent`
- отсутствие локальных `TooltipProvider`, если глобальный provider уже есть

Для `div` используй такой тест:
- если `div` существует в основном как layout-контейнер (`flex`, `gap`, `items-*`, `justify-*`, `flex-col`, `flex-row`, `wrap`) и не нужен для overflow/truncate/sticky/positioning/shape, считай это нарушением и предлагай `Stack`

Границы autofix:
- можно исправлять wrapper drift, imports, comments style, event typing drift, provider duplication, redundant props, `Stack`/`TS` migration, nested barrel drift
- нельзя менять публичные API без необходимости
- нельзя делать broad redesign
- если нарушение спорное или исправление может поменять поведение, не исправляй молча; оставь это в `Remaining Drift`

Формат ответа:

## Changes
- что именно было исправлено автоматически

## Rule Alignment
- какие project rules были проверены
- какие drift-случаи были устранены

## Remaining Drift
- что ты сознательно не исправил
- почему это не следует исправлять автоматически или почему нужен отдельный decision

## Acceptable Exceptions
- какие raw `div` или другие исключения допустимы
- почему они не считаются drift

## Verification
- запускал ли lint/type-check
- результаты проверок
```
