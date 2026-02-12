# Effector Domain Logger

A powerful debugging utility for Effector domains that provides colored console logging with filtering, custom formatters, and helpful utilities for tracking state changes, events, and effects.

## Overview

This logger wraps Effector domains and automatically logs all events, stores, and effects created within them. It works only in development mode and provides:

- **Colored console output** with customizable colors for different unit types
- **Filtering** to show/hide specific events or stores
- **Custom formatters** to display complex data in a readable format
- **Helper functions** for common data transformations
- **Gates support** with special handling for open/close events
- **Effect lifecycle tracking** (start, done, fail)

## ⚠️ Critical: Always Name Your Units

**When creating stores, events, and effects, you MUST always provide explicit names.** Without names, the logger will display anonymous IDs (like `store-1`, `event-42`) instead of meaningful identifiers, making debugging extremely difficult.

```typescript
// ❌ BAD - anonymous units with auto-generated IDs
const $users = domain.createStore([])
const userAdded = domain.createEvent()
const loadUsersFx = domain.createEffect({ handler, name: 'loadUsersFx' })

// ✅ GOOD - named units that appear clearly in logs
const $users = domain.createStore([], { name: '$users' })
const userAdded = domain.createEvent('userAdded')
const loadUsersFx = domain.createEffect({ handler, name: 'loadUsersFx' })
```

**Best Practice:** The name should typically match the variable name for consistency and easy code navigation.

## Quick Start

### Basic Usage

```typescript
import { createDomainWatched } from '@/lib/logger'

// simple domain with default logging
export const myDomain = createDomainWatched('my-feature')

// create named units (REQUIRED for meaningful logs)
const $users = myDomain.createStore([], { name: '$users' })
const userAdded = myDomain.createEvent('userAdded')
const loadUsersFx = myDomain.createEffect({ handler: fetchUsers, name: 'loadUsersFx' })

// domain with logging disabled
export const silentDomain = createDomainWatched('silent-feature', {}, false)
```

### With Configuration

```typescript
import { createDomainWatched, type ConfigLogger } from '@/lib/logger'

const config: ConfigLogger = {
  colors: {
    $users: 'query',      // store with custom color
    loadUsers: 'fx',      // event with custom color
  },
  filter: {
    gate: false,          // hide gate events
    loadUsersFx_root: false, // hide effect root calls
  },
  fn: {
    $users: (users) => `${users.length} users`, // custom formatter
  },
}

export const usersDomain = createDomainWatched('users', config)

// create named units with config
const $users = usersDomain.createStore([], { name: '$users' })
const loadUsersFx = usersDomain.createEffect({ handler: fetchUsers, name: 'loadUsersFx' })
```

## API Reference

### `createDomainWatched(name?, config?, watch?)`

Creates a watched Effector domain with automatic logging.

**Parameters:**

- `name?: string` - domain name (will appear in logs)
- `config?: Config | ConfigLogger` - configuration object
- `watch?: DomainWatch` - enable/disable logging (`boolean` or `Record<string, boolean>`)

**Returns:** Effector `Domain`

**Config Options:**

```typescript
type Config = {
  domain?: Domain           // parent domain
  logger?: ConfigLogger     // logger configuration
  options?: ConfigOptions   // additional options
}

type ConfigLogger = {
  colors?: Record<string, ConfigColor>  // custom colors for units
  filter?: Record<string, boolean>      // show/hide specific units
  fn?: Record<string, ConfigFn>         // custom formatters
  options?: Record<string, DevGroupParams> // console group options
}

type ConfigColor = 'fail' | 'query' | 'ok' | 'data' | 'event' | 'fx' | 'green' | 'blue' | 'orange' | 'red' | 'gray'
```

### `watchedSettings(update)`

Configure global logger settings.

```typescript
import { watchedSettings } from '@/lib/logger'

// Hide stores that display '[empty]' or '[unset]'
watchedSettings({ hideEmptyStores: true })
```

## Helper Functions

These utilities help format data for display in logs:

### `size(o: any): number`

Returns the size of arrays, objects, Maps, or Sets.

```typescript
size([1, 2, 3])           // 3
size({ a: 1, b: 2 })      // 2
size(new Map([['a', 1]])) // 1
```

### `pl(noun: string, count: number): string`

Pluralizes a noun based on count.

```typescript
pl('item', 1)   // '1 item'
pl('item', 5)   // '5 items'
pl('query', 2)  // '2 queries'
```

### `items(o: any): string`

Returns count description for arrays/objects.

```typescript
items([1, 2, 3])     // '3 items'
items({})            // 'empty'
```

### `namedItems(name: string)`

Creates a custom item counter function.

```typescript
const userCounter = namedItems('user')
userCounter([1, 2, 3]) // '3 users'
userCounter([])        // 'empty'
```

### `list(o: any): string`

Returns comma-separated list of keys or array values.

```typescript
list([1, 2, 3])           // '1, 2, 3'
list({ a: 1, b: 2 })      // 'a, b'
list(new Set(['x', 'y'])) // 'x, y'
```

### `onOff(o: any, k?: string): string`

Returns 'on'/'off' status.

```typescript
onOff(true)              // 'on'
onOff({ enabled: true }, 'enabled') // 'enabled : on'
```

### `updated(o: object, keys: Record<string, Fn>): string`

Formats updated fields.

```typescript
updated(
  { name: 'John', age: 30 },
  {
    name: (v) => `Name: ${v}`,
    age: (v) => `Age: ${v}`,
  }
) // 'Name: John, Age: 30'
```

### `uuid(u: string, count?: number): string`

Shows last N characters of UUID.

```typescript
uuid('550e8400-e29b-41d4-a716-446655440000')    // '*-55440000'
uuid('550e8400-e29b-41d4-a716-446655440000', 4) // '*-0000'
```

## Real-World Examples

### Example 1: Simple Domain

```typescript
export const tasksDomain = createDomainWatched('tasks')

// all events, stores, and effects will be automatically logged
// IMPORTANT: always provide names for proper logging
const $tasks = tasksDomain.createStore([], { name: '$tasks' })
const taskAdded = tasksDomain.createEvent('taskAdded')
const loadTasksFx = tasksDomain.createEffect({
  handler: async () => {
    // ...
  },
  name: 'loadTasksFx',
})
```

### Example 2: Domain with Filtering

```typescript
import { listKey, uuid } from '@/lib/logger'

const config: ConfigLogger = {
  colors: {
    $materials: 'query',
    $selectedId: 'fx',
  },
  filter: {
    gate: true,                    // show gates
    selectedMaterial: false,        // hide this event
    getMaterialOptionsFx_root: false, // hide effect root
  },
  fn: {
    $materials: (m) => listKey(m, 'name'),  // show material names
    $selectedId: (id) => uuid(id),          // show short UUID
  },
}

export const materialsDomain = createDomainWatched(
  'materials',
  config,
  true // enable logging
)

// create named units
const $materials = materialsDomain.createStore([], { name: '$materials' })
const $selectedId = materialsDomain.createStore(null, { name: '$selectedId' })
const selectedMaterial = materialsDomain.createEvent('selectedMaterial')
```

### Example 3: Complex Formatters

```typescript
import { pl, size } from '@/lib/logger'

const taskEditConfig: ConfigLogger = {
  colors: {
    $flow: 'fx',
    $plates: 'green',
    setDirty: 'red',
  },
  filter: {
    gate: true,
    setDirty: false,
    resetDirty: false,
  },
  fn: {
    $flow: (flow) => `${flow.step ?? 'unset'}`,
    $plates: (plates) => 
      plates?.length
        ? plates.map(p => `${p.name} <${pl('container', size(p.containers))}>`).join(', ')
        : 'empty',
    $target: (t) => {
      const d = t.plates?.length && size(t.plates[0].containers) 
        ? t.dimension 
        : null
      return t.existing === undefined
        ? 'empty'
        : `${t.existing ? 'existing' : 'create'}, ${d ? d[0] + 'x' + d[1] : 'empty'}`
    },
  },
}

export const taskEditDomain = createDomainWatched('task-edit', taskEditConfig)

// create named units with matching variable names
const $flow = taskEditDomain.createStore({}, { name: '$flow' })
const $plates = taskEditDomain.createStore([], { name: '$plates' })
const $target = taskEditDomain.createStore(null, { name: '$target' })
const setDirty = taskEditDomain.createEvent('setDirty')
const resetDirty = taskEditDomain.createEvent('resetDirty')
```

### Example 4: Conditional Logging

```typescript
// control logging per domain type
const debugStores = {
  generic: true,
  meta: false,
  materials: false,
  tasks: true,
}

export const genericDomain = createDomainWatched(
  'generic',
  {},
  debugStores.generic // true
)

export const metaDomain = createDomainWatched(
  'meta',
  metaConfig,
  debugStores.meta // false - no logging
)

// always name units even when logging is disabled
// (easier to enable logging later for debugging)
const $meta = metaDomain.createStore({}, { name: '$meta' })
const updatedMeta = metaDomain.createEvent('updatedMeta')
```

## Color Reference

Available colors for console output:

- `fail` - red, for errors and failures
- `query` - magenta, for queries and questions
- `ok` - green, for success
- `data` - yellow, for data display
- `event` - gray, for events
- `fx` - orange, for effects
- `green` - green
- `blue` - blue
- `orange` - orange
- `red` - red
- `gray` - gray

## Filter Patterns

Common filter patterns:

```typescript
filter: {
  gate: false,                  // hide all gate events
  'eventName': false,           // hide specific event
  'effectName_root': false,     // hide effect start
  'effectName_done': false,     // hide effect success
  'effectName_fail': false,     // hide effect failure
  '$storeName': false,          // hide store updates
}
```

## Best Practices

1. **Always name your units** - use `{ name: 'unitName' }` for stores and effects, plain string for events. Name should match the variable name.
2. **Use filtering** to reduce noise - hide gates, root effects, and internal events
3. **Create custom formatters** for complex data structures
4. **Use helper functions** for consistent data display
5. **Set meaningful colors** to quickly identify different unit types
6. **Enable `hideEmptyStores`** globally to skip empty store logs
7. **Disable logging in production** (happens automatically based on `NODE_ENV`)
8. **Group related domains** with consistent naming (`feature-name`)

## Tips

- **Always name units**: without names you'll see anonymous IDs like `store-1` or `event-42` in logs
- Gates automatically show as OPEN/CLOSED with special formatting
- Effects show three states: start, done, and fail
- Store updates are skipped if value didn't change
- Use `_root` suffix in filter to hide only the initial call
- Custom formatters receive the payload/state as argument
- Return `null` from formatter to skip logging that update
- Name should match variable name for easy code navigation: `const $users = domain.createStore([], { name: '$users' })`

## Development vs Production

The logger automatically detects `NODE_ENV`:

- **Development**: full logging with colors and formatting
- **Production**: all logging is disabled (noop functions)

This ensures zero performance impact in production.

## Common Mistakes

### ❌ Anonymous Units

```typescript
// BAD - will show as "store-1", "event-2" in logs
const $users = domain.createStore([])
const userAdded = domain.createEvent()
const loadUsersFx = domain.createEffect({ handler, name: 'loadUsersFx' })
```

### ✅ Named Units

```typescript
// GOOD - clear, meaningful logs
const $users = domain.createStore([], { name: '$users' })
const userAdded = domain.createEvent('userAdded')
const loadUsersFx = domain.createEffect({ handler, name: 'loadUsersFx' })
```

### Name Consistency

Always match the variable name with the unit name for easy debugging and code navigation:

```typescript
// variable name ↓        unit name ↓
const updatedMeta = domain.createEvent('updatedMeta')
const $meta = domain.createStore({}, { name: '$meta' })
const getTaskFx = domain.createEffect({ handler: getTask, name: 'getTaskFx' })
```
