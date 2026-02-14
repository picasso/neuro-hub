---
name: effector
description: This rule provides standards for frontend state-management framework.
---

# Overview

Effector is a comprehensive state management library designed to facilitate efficient and predictable state management in JavaScript applications. Consider the Effector LLM-focused guide for scopes, effects, SSR, and testing patterns: [Effector LLM guide](https://effector.dev/docs/llms-full.txt)

Here are a few principles that **Effector** follows:

- Application stores should be as light as possible - the idea of adding a store for specific needs should not be frightening or damaging to the developer;
- Application stores should be freely combined - data that the application needs can be statically distributed, showing how it will be converted in runtime;
- Autonomy from controversial concepts - no decorators, no need to use classes or proxies - this is not required to control the state of the application and therefore the api library uses only functions and plain JS objects.

## Immer

Application `internal state` is based on immutable data structures. Immutable data structures allow for (efficient) change detection: if the reference to an object didn't change, the object itself did not change. In addition, it makes cloning relatively cheap: unchanged parts of a data tree don't need to be copied and are shared in memory with older versions of the same state.

Use [Immer](https://immerjs.github.io/immer/) to work with immutable state in a more convenient way. Here is an overview how to update objects and collections with immer: [Update Patterns](https://immerjs.github.io/immer/update-patterns/).

## ESLint: effector plugin

This codebase uses `eslint-plugin-effector` and enables these configs:

- `effector/recommended`
- `effector/scope`

### No `.getState()` for orchestration (race conditions)

**CRITICAL:** Avoid `store.getState()` in runtime orchestration (effects, sampling logic, UI handlers). It can read a value that is not consistent with the current reactive graph and lead to race conditions.

Prefer Effector-native patterns:

- `sample({ source, clock, fn, target })`
- `attach({ source, effect, mapParams })`
- `store.watch(fn)` (for debug/logging; note: it calls immediately with current state)

```ts
// ❌ BAD
const value = $store.getState()
someEvent(value)

// ✅ GOOD
sample({
  clock: someEvent,
  source: $store,
  fn: (value) => value,
  target: someOtherEvent,
})
```

## Domain Structure

### Watched Domains

Use `createDomainWatched` from `@/lib/logger` for all feature domains to enable automatic logging in development:

```typescript
import { createDomainWatched } from '@/lib/logger'

// create watched domain with logging config
const featureDomain = createDomainWatched('feature-name', {
    colors: {
        $store: 'query',
        eventName: 'fx',
    },
    filter: {
        gate: false, // hide gate events
    },
    fn: {
        $store: (data) => `custom format: ${data.length}`,
    },
})
```

### Named Units

**CRITICAL:** Always name all units (stores, events, effects) for meaningful logs:

```typescript
// ✅ GOOD - named units
const $user = domain.createStore(null, { name: '$user' })
const userUpdated = domain.createEvent('userUpdated')
const loadUserFx = domain.createEffect({ handler, name: 'loadUserFx' })

// ❌ BAD - anonymous units (will show as "store-1", "event-2")
const $user = domain.createStore(null)
const userUpdated = domain.createEvent()
const loadUserFx = domain.createEffect(handler)
```

**Naming convention:** Match the variable name with the unit name for easy debugging.

## Store Architecture

### Small Independent Stores

**DO NOT** create one large store and slice it with `.map()` (Redux anti-pattern).

**DO** create many small independent stores:

```typescript
// ❌ BAD - Redux style
const $state = domain.createStore({
    step: 1,
    data: null,
    loading: false,
})
const $step = $state.map((s) => s.step)
const $data = $state.map((s) => s.data)

// ✅ GOOD - Effector style
const $step = domain.createStore(1, { name: '$step' })
const $data = domain.createStore(null, { name: '$data' })
const $loading = domain.createStore(false, { name: '$loading' })
```

### Computed Stores

Use `.map()` for simple derivations and `combine()` for merging multiple stores:

```typescript
// simple derivation
const $userIds = $users.map((users) => users.map((u) => u.id))

// combining multiple stores
const $canSubmit = combine(
    {
        step: $step,
        data: $data,
        loading: $loading,
    },
    ({ step, data, loading }) => step === 3 && !!data && !loading,
)
```

## Event Patterns

### Naming Conventions

Follow consistent naming patterns for events:

```typescript
// update events - use past tense or 'updated' prefix
const updatedMeta = domain.createEvent('updatedMeta')
const updatedFlow = domain.createEvent('updatedFlow')

// reset events
const resetMeta = domain.createEvent('resetMeta')
const resetFlow = domain.createEvent('resetFlow')

// action events
const toggleInProgress = domain.createEvent('toggleInProgress')
const setDirty = domain.createEvent('setDirty')

// lifecycle events
const completeFilled = domain.createEvent('completeFilled')
const partiallyFilled = domain.createEvent('partiallyFilled')
```

## Store Updates

### Using `.on()` for Direct Updates

Use `.on()` for direct store updates in response to events:

```typescript
// simple updates
$step.on(setStep, (_, step) => step)
$role.on(setRole, (_, role) => role)

// with Immer for complex updates
$target.on(resetEmptyTarget, (store) =>
    produce(store, (draft) => {
        draft.ids = []
        draft.loaded = false
        draft.plates = createEmptyPlate(store.dimension)
    }),
)

```

### Using `sample()` for Logic

Use `sample()` for all business logic, transformations, and side effects:

```typescript
// transform and update
sample({
    clock: getTaskFx.doneData,
    source: $statusMap,
    fn: (statuses, response) => mapResponse(response, statuses),
    target: $meta,
})

// conditional logic
sample({
    clock: updatedMeta,
    source: $meta,
    filter: (meta) => meta.status !== 'completed',
    target: setDirty,
})

// multi-source logic
sample({
    clock: $flow,
    source: { template: $template, filled: $filled },
    filter: ({ filled }, flow) => !includes(filled, flow.selectedId),
    fn: ({ template }, flow) => processTemplate(template, flow),
    target: loadDataFx,
})
```

## File Structure

Organize stores in feature-based files with consistent structure:

```typescript
// feature-store.ts

import { domain } from '@/logger'

// * * * $storeName -------------------------------------------------------------------------------]

const resetStoreName = domain.createEvent('resetStoreName')
export const updatedStoreName = domain.createEvent<Update>('updatedStoreName')
export const $storeName = domain.createStore<Store>({}, { name: '$storeName' })

$storeName.reset(resetStoreName)
$storeName.on(updatedStoreName, updateStore<Store>)

// * * * Effects ----------------------------------------------------------------------------------]

export const loadDataFx = domain.createEffect({
    handler: async (params) => {
        // implementation
    },
    name: 'loadDataFx',
})

// * * * Computed stores --------------------------------------------------------------------------]

export const $isLoading = loadDataFx.pending

export const $canSubmit = combine(
    {
        data: $storeName,
        loading: $isLoading,
    },
    ({ data, loading }) => !!data && !loading,
)

// * * * connections and consequences -------------------------------------------------------------]

// reset store when gate closes
sample({
    clock: FeatureGate.close,
    target: resetStoreName,
})

// load data when store updates
sample({
    clock: updatedStoreName,
    filter: (update) => !!update.id,
    fn: (update) => update.id,
    target: loadDataFx,
})

// update store when data loaded
sample({
    clock: loadDataFx.doneData,
    target: $storeName,
})
```

## Best Practices

1. **Domain per feature** - create separate watched domain for each feature
2. **Small stores** - one responsibility per store
3. **Named units** - always provide explicit names matching variable names
4. **sample() for logic** - all business logic goes through `sample()`
5. **`.on()` for updates** - direct store updates only
6. **Comment blocks** - use `// * * *` to separate sections
7. **Descriptive comments** - explain what each `sample()` does
8. **Immer sparingly** - use only for complex nested updates
9. **reset events** - provide reset events for cleanup
10. **Type safety** - always provide TypeScript types for stores and events

## Anti-Patterns to Avoid

### ❌ Large State Object

```typescript
// BAD - Redux-style single source of truth
const $onboarding = domain.createStore({
    currentStep: 1,
    role: null,
    credentials: null,
    profileData: null,
    selectedSkills: [],
    isLoading: false,
    error: null,
})

// slicing with .map()
const $currentStep = $onboarding.map((s) => s.currentStep)
const $role = $onboarding.map((s) => s.role)
```

### ❌ Logic in `.on()`

```typescript
// BAD - business logic in .on()
$users.on(userAdded, (users, newUser) => {
    if (users.length > 10) {
        showAlert('Too many users')
    }
    return [...users, newUser]
})

// GOOD - logic in sample()
$users.on(userAdded, (users, user) => [...users, user])

sample({
    clock: userAdded,
    source: $users,
    filter: (users) => users.length > 10,
    fn: () => 'Too many users',
    target: showAlertFx,
})
```

### ❌ Anonymous Units

```typescript
// BAD - makes debugging impossible
const $data = domain.createStore([])
const updated = domain.createEvent()

// GOOD - clear names in logs
const $data = domain.createStore([], { name: '$data' })
const updated = domain.createEvent('updated')
```

### ❌ Over-using Immer

```typescript
// BAD - Immer for simple update
$step.on(nextStep, (step) => produce(step, (draft) => draft + 1))

// GOOD - direct update
$step.on(nextStep, (step) => step + 1)
```

### ❌ Spread Operators for Complex Updates

```typescript
// BAD - spread hell for nested array updates
$selectedSkills.on(updateSkillLevel, (skills, { skillId, level }) =>
    skills.map((skill) =>
        skill.skillId === skillId ? { ...skill, proficiencyLevel: level } : skill,
    ),
)

// BAD - removing from array with spread
$selectedSkills.on(removeSkill, (skills, skillId) =>
    skills.filter((skill) => skill.skillId !== skillId),
)

// BAD - adding to array with conditional check
$selectedSkills.on(addSkill, (skills, skill) => {
    const exists = skills.find((s) => s.skillId === skill.skillId)
    return exists ? skills : [...skills, skill]
})

// GOOD - Immer for clarity and safety
$selectedSkills.on(updateSkillLevel, (skills, { skillId, level }) =>
    produce(skills, (draft) => {
        const skill = draft.find((s) => s.skillId === skillId)
        if (skill) {
            skill.proficiencyLevel = level
        }
    }),
)

$selectedSkills.on(removeSkill, (skills, skillId) =>
    produce(skills, (draft) => {
        const index = draft.findIndex((s) => s.skillId === skillId)
        if (index !== -1) {
            draft.splice(index, 1)
        }
    }),
)

$selectedSkills.on(addSkill, (skills, skill) =>
    produce(skills, (draft) => {
        const exists = draft.find((s) => s.skillId === skill.skillId)
        if (!exists) {
            draft.push(skill)
        }
    }),
)
```

**Why Immer is better here:**

- **Readability:** Imperative mutations are easier to read than nested spreads
- **Safety:** Structural sharing prevents accidental mutations
- **Performance:** Immer optimizes unchanged branches
- **Maintainability:** Easy to extend with more complex logic
