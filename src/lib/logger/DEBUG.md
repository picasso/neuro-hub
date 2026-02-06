# DevTools Debug Logger

A powerful console debugging utility with colored output, text formatting, change tracking, and advanced logging capabilities. All data is automatically cloned before output to prevent showing updated values. This is controlled by the internal config but happens transparently.

## Log Levels

Log levels control the verbosity of debug output. **Note:** Errors are always shown regardless of the level.

| Level | Aliases | Value | Description |
| ------- | --------- | ------- | ------------- |
| `none` | `0` | 0 | Only errors |
| `short` | `1` | 10 | Only milestone messages & warnings (without data) |
| `default` / `normal` | `2` | 20 | All messages & warnings (without data) |
| `verbose` / `full` | `3` | 30 | All messages with their data |

**Usage:**

The log level can be set using `devTools.logLevel()`. In most applications, this is set once during initialization (e.g., based on environment variables or build configuration) and rarely changed at runtime.

```typescript
import devTools from '@/lib/logger/debug'
import { DevLogLevel } from '@/lib/logger/debug'

// typical setup in your app initialization:
devTools.logLevel(process.env.NODE_ENV === 'production' ? DevLogLevel.none : DevLogLevel.default)

// once configured, just use the logger normally
devTools.log('This respects the configured log level')
devTools.logVerbose('Only shown if level is verbose or higher')
```

## Color Modifiers

Color modifiers are special characters placed at the **beginning** of a message string to change its color and make it bold.

| Modifier | Color | HEX | Usage |
| ---------- | ------- | ----- | ------- |
| `!` | Red (alert) | `#ff2020` | Errors, critical issues |
| `?` | Magenta (query) | `#cc0096` | Questions, queries |
| `*` | Green (ok) | `#1f993f` | Success, confirmations |
| `+` | Blue (info) | `#0070c9` | Information, notes |
| `#` | Yellow (data) | `#a79635` | Data output |
| `∞` | Gray | `#8F92A3` | Less important info |
| `^` | Dynamic | varies | Color depends on function and config |
| `>` | Group | - | Start a collapsed console group |

**Examples:**

```typescript
devTools.log('!Critical error occurred')       // red, bold
devTools.log('?Should we proceed?')           // magenta, bold
devTools.log('*Operation successful')         // green, bold
devTools.info('+User logged in', userData)    // blue, bold
devTools.log('#Processing data', dataSet)     // yellow, bold
devTools.log('∞Background task completed')    // gray, bold
```

## Text Markers

Text markers provide inline formatting within messages. They work with all logging functions.

### Inline Markers

| Marker | Style | Example |
| -------- | ------- | --------- |
| `§text§` | Bold | `'User §John§ logged in'` |
| `±text±` | Accent (orange bg) | `'Status: ±active±'` |
| `~text~` | Colored (green bg) | `'Mode: ~production~'` |
| `‡text‡` | Dim (faded) | `'‡Optional field‡'` |
| `[text]` | Params (orange) | `'User[id: 123]'` |
| `{text}` | Opaque badge | `'{NEW} feature released'` |
| `«text»` | Wan (faded bg) | `'«deprecated»'` |

### Special Symbols

| Symbol | Output | Usage |
| -------- | -------- | ------- |
| `{->}` | → (arrow) | Show transformation: `'status {->} active'` |
| `{>>}` | » (chevron) | Show progression: `'step 1 {>>} step 2'` |

**Examples:**

```typescript
devTools.log('User §John Doe§ with [id: 123] logged in')
devTools.info('Status changed ±from active± {->} ±to inactive±')
devTools.log('New feature {*BETA} available for testing')
devTools.log('Processing ~important~ data with ‡optional‡ parameters')
```

### Color Modifiers in Opaque Badges

You can combine color modifiers inside `{opaque}` markers:

```typescript
devTools.log('Status: {!ERROR}')      // red badge
devTools.log('Mode: {*SUCCESS}')      // green badge
devTools.log('Query: {?PENDING}')     // magenta badge
```

## Core API

These are the primary functions you'll use for everyday debugging.

### `log(message, ...data)`

Basic logging function with support for color modifiers and text markers.

```typescript
devTools.log('Simple message')
devTools.log('*Success: User created', { id: 123, name: 'John' })
devTools.log('Processing [count: §5§] items {->} ~done~')
```

### `logVerbose(...data)`

Only logs when level is `verbose` (30+). Useful for detailed debugging without cluttering output.

```typescript
devTools.logVerbose('Detailed state:', complexObject)
devTools.logVerbose('*Verbose success message')
```

### `warn(message, ...data)`

Warning messages (yellow warning icon in console). Always shown unless level is `none`.

```typescript
devTools.warn('Deprecated method called')
devTools.warn('Rate limit approaching', { current: 95, limit: 100 })
```

### `error(message, ...data)`

Error messages (red error icon in console). Always shown regardless of log level.

```typescript
devTools.error('Authentication failed', errorDetails)
devTools.error('Invalid configuration detected')
```

### `data(dataObject, marker?)`

Log data object(s) with automatic key display. Great for showing variable values.

```typescript
// show single value
devTools.data({ userId: 123 })  // output: "value for userId: 123"

// show multiple values
devTools.data({ status: 'active', count: 5 })

// with custom marker
devTools.data({ result }, 'API Response')
```

### `info(message, ...data)`

Information messages with special formatting. Automatically adds component name if available.

```typescript
devTools.info('User authenticated', { userId: 123 })
devTools.info('+Successfully loaded', { items: 42 })
devTools.info('-Skipping validation')  // - prefix hides component name
```

### `logGroup(name, data?, params?)`

Create collapsible console groups. Useful for organizing related logs.

```typescript
// simple group
devTools.logGroup('User Data', { id: 123, name: 'John' })

// group with array
const users = [{ id: 1 }, { id: 2 }, { id: 3 }]
devTools.logGroup('Users List', users, { 
  arrayName: 'user',
  withoutIndex: false 
})

// inline display (no group)
devTools.logGroup('+Quick Info', { status: 'ok' })  // + prefix: inline
devTools.logGroup('-Debug Data', someData)          // - prefix: dimmed inline
```

**Group params:**

- `withoutNil` - skip null/undefined values
- `withoutIndex` - hide array indexes
- `arrayName` - custom name for array items
- `resolveFuncData` - call function to get data

### `logGroupClose()`

Manually close a console group (if needed).

```typescript
devTools.logGroup('Processing...')
// ... some logs ...
devTools.logGroupClose()
```

### `logExpanded(...data)`

Output data using `console.dir()` for expanded object inspection.

```typescript
devTools.logExpanded(largeObject)
devTools.logExpanded(domElement, complexData)
```

### `logLevel(newLevel?)`

Get or set the current log level. Returns the current log level as a number.

```typescript
// get current log level
const currentLevel = devTools.logLevel()  // returns number (e.g., 20)

// set new log level
devTools.logLevel('verbose')  // set to verbose mode
devTools.logLevel('short')    // set to short mode
devTools.logLevel('none')     // disable all logs except errors

// set using numeric value aliases
devTools.logLevel('0')  // same as 'none'
devTools.logLevel('1')  // same as 'short'
```

**Valid level names:**
- `'none'` or `'0'` - only errors
- `'short'` or `'1'` - milestone messages only
- `'default'`, `'normal'`, or `'2'` - all messages without data
- `'verbose'`, `'full'`, or `'3'` - all messages with data

**Note:** If an invalid level name is provided, the current level remains unchanged.

## Advanced API

Advanced functions for change tracking, state comparison, and reducer logging.

### `logDataWasNow(currentData, previousData)`

Log changes between two data objects. Shows what changed, what was added, and what was removed.

```typescript
const prevState = { name: 'John', age: 25, city: 'NYC' }
const nextState = { name: 'John', age: 26, email: 'john@example.com' }

devTools.logDataWasNow(nextState, prevState)
// shows:
// - added key: email
// - removed key: city  
// - changed key: age (25 → 26)
```

### `onlyChanges(next, prev, updated?, parentKey?, keys?)`

Extract only the changed fields between two objects. Returns modified data and keys.

```typescript
const prev = { name: 'John', age: 25, status: 'active' }
const next = { name: 'John', age: 26, status: 'active' }

const [changes, changedKeys] = devTools.onlyChanges(next, prev)
// changes: { next: { age: 26 }, prev: { age: 25 } }
// changedKeys: { root: ['age'] }
```

**Useful for:**
- Optimizing re-renders (only pass changed data)
- Debugging state updates
- Testing change detection logic

### `testOnlyChanges(next, prev)`

Test version of `onlyChanges` that logs the output for inspection.

```typescript
devTools.testOnlyChanges(nextState, prevState)
// logs the changes and keys for debugging
```

### `logReducer(name, mode, action, nextState, prevState)`

Specialized logging for Effector reducers or state machines. Shows action type and state changes.

```typescript
devTools.logReducer(
  'userStore',
  'changes',  // or 'default', 'verbose', etc.
  { type: 'USER_UPDATED', payload: { age: 26 } },
  nextState,
  prevState
)
```

**Modes:**
- `changes` - only show changed fields (compact)
- `default` - show action and state
- `verbose` - show everything with full data

**Output includes:**
- Action type with color coding
- Changed/unchanged indicator
- For `changes` mode: only modified fields with before/after values

### `funcName(prevFrames, asFuncGetter?)`

Get the calling function/component name from the call stack.

```typescript
const name = devTools.funcName(0)  // current function
const parent = devTools.funcName(1)  // calling function
```

## Examples

### Basic Logging

```typescript
import devTools from '@/lib/logger/debug'

// set log level if needed
devTools.logLevel('verbose')  // enable verbose logging
console.log('Current level:', devTools.logLevel())  // check current level

// simple messages
devTools.log('Application started')
devTools.log('*Successfully connected to database')
devTools.warn('Using fallback configuration')
devTools.error('Failed to load user data')

// with data
devTools.log('User logged in', { userId: 123, email: 'user@example.com' })
devTools.info('+API response received', responseData)
```

### Formatting Messages

```typescript
// color modifiers
devTools.log('!Critical: Payment failed')
devTools.log('?Confirm: Delete user §John Doe§?')
devTools.log('*Success: [count: 5] records updated')

// text markers
devTools.log('Status: ±active± {->} ±inactive±')
devTools.log('User §John§ with [id: 123] logged out')
devTools.log('Feature {*BETA} {>>} Processing ‡optional parameters‡')
```

### Change Tracking

```typescript
// simple change tracking
const oldUser = { name: 'John', age: 25, city: 'NYC' }
const newUser = { name: 'John', age: 26, country: 'USA' }

devTools.logDataWasNow(newUser, oldUser)
// output shows:
// - removed key: city
// - added key: country
// - changed key: age (25 → 26)

// extract only changes
const [changes, keys] = devTools.onlyChanges(newUser, oldUser)
console.log(changes)  // { next: { age: 26, country: 'USA' }, prev: { age: 25, city: 'NYC' } }
console.log(keys)     // { root: ['age'] }
```

### Grouped Logs

```typescript
// create a collapsed group
devTools.logGroup('User Details', { 
  id: 123, 
  name: 'John Doe',
  email: 'john@example.com',
  roles: ['admin', 'user']
})

// array with custom formatting
const items = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' }
]

devTools.logGroup('Items', items, {
  arrayName: 'item',
  withoutNil: true
})

// inline display (no group created)
devTools.logGroup('+Status', { connected: true })
devTools.logGroup('-Debug', { verbose: false })
```

### Component Debugging

```typescript
// in a React component
function UserProfile({ userId, name, email }) {
  // log component data (automatically includes component name)
  devTools.data({ userId, name })
  
  // log with message
  devTools.info('Rendering user profile', { userId })
  
  // without component name
  devTools.info('-Loading data...', { userId })
  
  return <div>...</div>
}
```

### Effector Integration

```typescript
import { createStore, createEvent } from 'effector'
import devTools from '@/lib/logger/debug'

const userUpdated = createEvent()
const $user = createStore({ name: 'John', age: 25 })
  .on(userUpdated, (state, payload) => {
    const nextState = { ...state, ...payload }
    
    // log reducer changes
    devTools.logReducer(
      '$user',
      'changes',
      { type: 'userUpdated', payload },
      nextState,
      state
    )
    
    return nextState
  })

// trigger update
userUpdated({ age: 26 })
// logs: userStore [userUpdated] - effective change
//       updated keys: [age]
//       age: { now: 26, was: 25 }
```

### Advanced Change Detection

```typescript
// complex nested object comparison
const prevState = {
  user: { 
    name: 'John', 
    profile: { age: 25, city: 'NYC' }
  },
  settings: { theme: 'dark' }
}

const nextState = {
  user: { 
    name: 'John', 
    profile: { age: 26, city: 'NYC' }
  },
  settings: { theme: 'light' }
}

// get detailed changes
const [changes, changedKeys] = devTools.onlyChanges(nextState, prevState)

console.log(changedKeys)
// {
//   'user': ['profile'],
//   'settings': ['theme']
// }

// test change detection
devTools.testOnlyChanges(nextState, prevState)
// logs full change details for debugging
```

## Tips & Best Practices

### 1. Use Color Modifiers Consistently

```typescript
// good: consistent meaning
devTools.log('*User created successfully')     // green for success
devTools.log('!Failed to create user')         // red for errors
devTools.log('?Confirm user deletion?')        // magenta for questions

// bad: random colors
devTools.log('#User created')  // yellow for data, not for status
```

### 2. Keep Messages Concise

```typescript
// good
devTools.log('*User authenticated', { userId: 123 })

// bad
devTools.log('*The user with ID 123 has been successfully authenticated and now has access to the system')
```

### 3. Use Groups for Related Logs

```typescript
// good: organized
devTools.logGroup('API Request', {
  method: 'POST',
  url: '/api/users',
  body: requestData
})

// bad: scattered logs
devTools.log('Method: POST')
devTools.log('URL: /api/users')
devTools.log('Body:', requestData)
```

### 4. Leverage Change Tracking

```typescript
// instead of logging everything
devTools.log('Previous state:', prevState)
devTools.log('Next state:', nextState)

// log only changes
devTools.logDataWasNow(nextState, prevState)
```

### 5. Use Appropriate Log Levels

```typescript
// set appropriate level for your environment
if (process.env.NODE_ENV === 'development') {
  devTools.logLevel('verbose')
} else if (process.env.DEBUG) {
  devTools.logLevel('default')
} else {
  devTools.logLevel('none')
}

// use logVerbose for detailed debugging
devTools.logVerbose('Detailed state dump:', complexState)
// use regular log for important messages
devTools.log('*User session started')
// use error for actual errors
devTools.error('Failed to load data', error)
```

## Configuration

The logger behavior is controlled by an internal configuration object. While you typically don't need to modify it directly, here's what it controls:

- `level` - Log level (0-31)
- `withoutCaller` - Hide component/function names
- `localDates` - Show dates in local timezone
- `simplify` - Simplify complex objects
- `clone` - Clone data before logging (prevents mutation issues)
- `colors` - Color configuration for different modes
- `markers` - Custom text markers
- `timing` - Show timing information

Most projects will set this globally during initialization rather than modifying it at runtime.

## Exported Utilities

Besides the main `DevTools` object, the logger exports additional utilities:

```typescript
import { logNames, isSimpleType, markers } from '@/lib/logger/debug'

// get level names
logNames(20)  // ['default', 'normal']

// check if value is simple type
isSimpleType('hello')  // true
isSimpleType({ obj: 1 })  // false

// text marker functions
markers._bold('text')      // §text§
markers._accented('text')  // ±text±
markers._colored('text')   // ~text~
markers._dim('text')       // ‡text‡
markers._param('text')     // [text]
markers._opaque('text')    // {text}
markers._wan('text')       // «text»
```

For TypeScript type definitions, see `./debug.ts`.

---

**Related Documentation:**

- [Effector Domain Logger](./README.md) - For Effector-specific logging with domain watchers
