# Frontend Rule Audit Autofix

## Overview

Запусти `frontend-advocate` на указанный `@file` или `@folder` в режиме strict rule-audit + autofix.

Фокус команды:
- project frontend conventions
- wrapper-first подход
- `Stack` вместо raw layout `div`
- `TS` вместо raw text markup
- import/barrel hygiene
- comments style
- deprecated event aliases
- provider duplication

Эта команда не про продуктовую спецификацию и не про redesign. Она нужна именно для выравнивания под project rules.

## Prompt

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
- если `div` существует в основном как layout-контейнер (`flex`, `gap`, `items-*`, `justify-*`, `flex-col`, `flex-row`, `wrap`) и не нужен для overflow/truncate/sticky/positioning/shape, считай это нарушением и заменяй на `Stack`

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

## Usage Examples

- `/front-audit @src/ui/chat`
- `/front-audit @src/features/playground/demo-chat.tsx`
- `/front-audit @src/features/auth/login-modal.tsx`
