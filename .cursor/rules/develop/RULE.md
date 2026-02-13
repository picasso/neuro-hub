# Development Best Practices & Anti-patterns

Development rules discovered during project work. These practices complement core rules and help avoid common mistakes.

---

## 1. Effector - Architecture

### 1.1 Multiple `useUnit` calls

❌ **Bad:**

```tsx
const currentStep = useUnit($currentStep)
const role = useUnit($role)
const error = useUnit($error)
```

✅ **Good:**

```tsx
const [currentStep, role, error] = useUnit([$currentStep, $role, $error])
```

---

### 1.2 `useEffect` for business logic

❌ **Bad** - logic in component:

```tsx
useEffect(() => {
  fetch('/api/skills').then(data => setSkills(data))
}, [])
```

✅ **Good** - logic in Effector store:

```tsx
// in model.ts
export const loadSkillsFx = createEffect(async () => {
  const response = await fetch('/api/skills')
  return await response.json()
})

sample({
  clock: $currentStep,
  filter: (step) => step === 4,
  target: loadSkillsFx
})
```

**Rule:** All business logic (API calls, validation, computations) must be in Effector store. Components should be purely presentational.

---

### 1.3 `useState` for business data

❌ **Bad** - local state for business data:

```tsx
const [name, setName] = useState('')
const [errors, setErrors] = useState({})
```

✅ **Good** - state in Effector store:

```tsx
// in component
const [name, errors] = useUnit([$profileData, $profileErrors])

// events for mutations
updateProfileField({ field: 'name', value: '...' })
validateAndContinue()
```

**Rule:** `useState` only for local UI state (open/closed, selected tab, search query). Business data always in Effector.

---

### 1.4 Business logic in components

❌ **Bad** - validation/processing in event handler:

```tsx
const handleContinue = () => {
  const result = schema.safeParse(data)
  if (!result.success) {
    setErrors(result.error.flatten())
  } else {
    nextStep()
  }
}
```

✅ **Good** - logic in store via `sample`:

```tsx
// in model.ts
sample({
  clock: validateAndContinue,
  source: $profileData,
  filter: (data) => {
    const result = validateProfileData(data)
    return !result.success
  },
  fn: (data) => {
    const result = validateProfileData(data)
    return extractErrors(result.error)
  },
  target: $profileErrors
})

sample({
  clock: validateAndContinue,
  source: $profileData,
  filter: (data) => validateProfileData(data).success,
  target: nextStep
})
```

---

## 2. Effector - Syntax

### 2.1 Unnecessary object wrapper in `source` for single store

❌ **Bad:**

```tsx
sample({
  source: { credentials: $credentials },
  fn: ({ credentials }) => credentials.email,
  ...
})
```

✅ **Good:**

```tsx
sample({
  source: $credentials,
  fn: (credentials) => credentials.email,
  ...
})
```

**Rule:** Use object in `source` only when you need multiple stores. For single store - pass directly.

---

### 2.2 Array wrapper for single store in `useUnit`

❌ **Bad** - unnecessary array wrapper:

```tsx
const [selectedRole] = useUnit([$role])
```

✅ **Good** - direct store access:

```tsx
const selectedRole = useUnit($role)
```

**Rule:** Use array syntax in `useUnit` only when you need multiple stores. For single store - pass it directly without array wrapper.

**Common mistake:** Beginners often use array syntax everywhere because they see it in examples with multiple stores.

---

### 2.3 Repeated logic

❌ **Bad** - code duplication:

```tsx
sample({
  clock: validateAndContinue,
  source: $profileData,
  fn: (data) => {
    const { kind, ...dataWithoutKind } = data
    const schema = kind === 'freelancer' ? freelancerProfileSchema : clientProfileSchema
    return schema.safeParse(dataWithoutKind)
  },
  ...
})

sample({
  clock: anotherEvent,
  source: $profileData,
  fn: (data) => {
    const { kind, ...dataWithoutKind } = data
    const schema = kind === 'freelancer' ? freelancerProfileSchema : clientProfileSchema
    return schema.safeParse(dataWithoutKind)
  },
  ...
})
```

✅ **Good** - helper function:

```tsx
// * * * helpers ---------------------------------------------------------------------------------]

function validateProfileData(profileData: ProfileData) {
  const { kind, ...dataWithoutKind } = profileData
  const schema = kind === 'freelancer' ? freelancerProfileSchema : clientProfileSchema
  return schema.safeParse(dataWithoutKind)
}
```

**Rule:** If logic repeats 2+ times - extract to helper function at bottom of file in `// * * * helpers` section.

---

## 3. Code Style - Naming

### 3.1 Incorrect handler prefixes

❌ **Bad** - `handle*` for event handlers:

```tsx
const handleClick = () => { ... }
const handleChange = () => { ... }
```

❌ **Bad** - `handle*` prefix for Effector events in `useUnit`:

```tsx
const [handleSetRole, handleNext] = useUnit([setRole, nextStep])
<Button onClick={handleSetRole} />
```

✅ **Good** - `on*` for event handlers, direct calls for Effector:

```tsx
// for local handlers with logic
const onSkillToggle = (skill: Skill) => {
  if (isSelected(skill.id)) {
    removeSkill(skill.id)
  } else {
    addSkill(skill)
  }
}

// for single store - without array
const selectedRole = useUnit($role)

// direct Effector event calls in JSX
<Button onClick={() => setRole('freelancer')} />
<Button onClick={() => nextStep()} />
```

**Rules:**
- Event handlers (with logic): `on*` prefix
- Effector events in `useUnit`: no `handle*` prefixes
- Direct event calls: use arrow functions in JSX
- Single store in `useUnit`: `const store = useUnit($store)` (without array)

---

### 3.2 Unnecessary wrapper functions

❌ **Bad** - wrapper only passes call through:

```tsx
const handleContinue = () => {
  nextStep()
}

const handlePrev = () => {
  prevStep()
}

<Button onClick={handleContinue} />
<Button onClick={handlePrev} />
```

✅ **Good** - direct event call:

```tsx
<Button onClick={() => nextStep()} />
<Button onClick={() => prevStep()} />
```

**Rule:** If function only calls single Effector event without arguments/logic - use direct call in JSX.

---

### 3.3 Component Declaration Style

❌ **Bad** - using `FC` type (unnecessary in modern React):

```tsx
import type { FC } from 'react'

type HeaderProps = {
    title: string
}

export const Header: FC<HeaderProps> = ({ title }) => {
    return <h1>{title}</h1>
}
```

✅ **Good** - function declaration with explicit props typing:

```tsx
type HeaderProps = {
    title: string
}

export function Header({ title }: HeaderProps) {
    return <h1>{title}</h1>
}
```

**Rule:** Use function declarations for all React components. Avoid `FC` type - it's unnecessary in modern React and not recommended by React team.

**Reasons:**
- Recommended by React team and TypeScript handbook
- Natural JavaScript syntax, easier to read
- Works with hoisting - can be used before declaration
- No extra imports needed
- Explicit props typing is clearer

---

## 4. TypeScript - Type Safety

### 4.1 Implicit type casting with `as`

❌ **Bad** - requires `as` casting to work with union type:

```tsx
type ProfileData = FreelancerProfile | ClientProfile

// in component
const clientData = profileData as ClientProfile | null
if (clientData?.companyName) { ... }
```

✅ **Good** - discriminated union with type narrowing:

```tsx
type ProfileData = {
  name: string
} & (
  | { kind: 'freelancer'; bio?: string; specialization?: string }
  | { kind: 'client'; companyName: string; companyRole?: string }
)

// in component - TypeScript automatically narrows type
if (profileData.kind === 'client') {
  // TypeScript knows companyName exists
  console.log(profileData.companyName)
}
```

**Rule:** For union types use discriminated unions with `kind`/`type` field. This allows TypeScript to automatically determine type without `as`.

---

### 4.2 Legacy types not removed

❌ **Bad** - unused types remain in code:

```tsx
export type OnboardingState = { ... }  // not used anywhere
export type StepValidation = { ... }   // not used anywhere

export type ProfileData = { ... }      // used
```

✅ **Good** - unused types removed:

```tsx
export type ProfileData = { ... }      // used
export type ProfileField = { ... }    // used
```

**Rule:** During refactoring always check and remove unused types/imports.

---

## 5. MUI/React - API

### 5.1 Deprecated API `inputProps`

❌ **Bad** - deprecated API:

```tsx
<TextField
  inputProps={{ maxLength: 500 }}
/>

<TextField
  InputProps={{
    endAdornment: <IconButton>...</IconButton>
  }}
/>
```

✅ **Good** - new API via `slotProps`:

```tsx
<TextField
  slotProps={{ 
    htmlInput: { maxLength: 500 } 
  }}
/>

<TextField
  slotProps={{ 
    input: {
      endAdornment: <IconButton>...</IconButton>
    }
  }}
/>
```

**Rule:** Use `slotProps` instead of `inputProps` and `InputProps` in MUI v7.

---

## 6. Error Handling & Alerts

Based on [src/alerts/README.md](../../src/alerts/README.md). User-facing errors and notifications go through the alerts system only.

### 6.1 Single channel for user-facing errors

❌ **Bad:** `alert()`, custom toasts, or only `console.error` for user-visible errors.

✅ **Good:** Use `@/alerts` — `createAlert()` for one-off, `createAlertFx` in Effector flows.

**Rule:** All user-visible error/success/warning messages use `createAlert` or `createAlertFx` from `@/alerts`. No `alert()`, no ad-hoc toast libs.

### 6.2 Errors that require attention

❌ **Bad:** Error alert with default auto-close (user may miss it).

✅ **Good:** For errors requiring action or reading — `severity: 'error'` and `disableAutoClose: true`. Success/info can keep auto-close.

**Rule:** Critical/error messages: `disableAutoClose: true`. Success/info: allow default auto-close.

### 6.3 Alerts in Effector

❌ **Bad:** Showing alerts inside components (e.g. in `useEffect` or after `effect.doneData` in component).

✅ **Good:** In store: `sample({ clock: effect.doneData })` or `sample({ clock: effect.failData })` → `fn` builds alert props → `target: createAlertFx`.

**Rule:** Wire success/error alerts to effects via `sample` + `createAlertFx` in the model. Components do not show alerts for effect results.

### 6.4 Progress alerts

❌ **Bad:** Progress alert without cleanup when operation finishes.

✅ **Good:** Use `id: createAlertFx.alertId(entityId)`. On success or failure call `createAlertFx.remove(alertId)`, then show result alert if needed.

**Rule:** Long-running operations: show progress with stable `id`, remove that alert when done (success or fail), then show outcome alert.

---

## 7. Lodash - Data Manipulation

### Use Lodash as default choice for data manipulation

Lodash is included in the bundle and provides significant advantages over native methods.

### Why Lodash?

**1. Runtime Safety (null/undefined handling)**

TypeScript guarantees types at compile time, but runtime data (API responses, user input) can be unexpected. Lodash utilities safely handle null/undefined without throwing exceptions, preventing application crashes in production.

```tsx
// ❌ native - runtime error if name is undefined
user.name.toUpperCase() // 💥 cannot read property 'toUpperCase' of undefined

// ✅ lodash - safe, returns undefined
get(user, 'name', 'Unknown').toUpperCase() // works even if name is missing
```

**2. Universal API for arrays and objects**

Most collection methods (`map`, `filter`, `forEach`, `reduce`, `find`, `some`, `every`, etc.) work for both arrays and objects, reducing code complexity and improving readability.

```tsx
// works for both arrays and objects
map(arrayOrObject, item => transform(item))
filter(arrayOrObject, predicate)
forEach(arrayOrObject, iterator)
```

**3. Short-circuit support**

`forEach` can be stopped by returning `false` - more convenient than `for...of` + `break`.

```tsx
forEach(items, item => {
    if (condition) return false // stops iteration
    process(item)
})
```

**4. Shorthand forms**

Cleaner syntax for common operations.

```tsx
// lodash
find(users, { id: 123 })

// native
users?.find(user => user.id === 123)
```

**5. Rich utility library**

`kebabCase`, `debounce`, `throttle`, `merge`, `cloneDeep`, `uniqueId`, etc. - no native equivalents.

---

### Import Style

❌ **Bad** - imports entire library (breaks tree-shaking):

```tsx
import _ from 'lodash'
import lo from 'lodash'
```

✅ **Good** - named imports (enables tree-shaking):

```tsx
import { map, find, get, kebabCase } from 'lodash'
```

---

### When to use native instead?

Only when:
- You have a clear, measured performance requirement
- Lodash doesn't provide the needed function
- The code is simpler without Lodash (rare)

**Default rule:** When in doubt, use Lodash.

---

## 8. UI Components - Centralized System

Use centralized wrapper components instead of direct MUI imports. This provides consistent API, better type safety, and easier refactoring.

### 8.0 Layout: Stack vs Box

**Rule:** Prefer `Stack` for simple flex layouts (row/column with spacing & alignment).

❌ **Bad** - repeated `Box` + `display: 'flex'` everywhere:

```tsx
import Box from '@mui/material/Box'

<Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
  <Link href="/a">A</Link>
  <Link href="/b">B</Link>
</Box>
```

✅ **Good** - `Stack` expresses intent and reduces noise:

```tsx
import Stack from '@mui/material/Stack'

<Stack direction="row" spacing={2} alignItems="center">
  <Link href="/a">A</Link>
  <Link href="/b">B</Link>
</Stack>
```

**When `Box` is still OK:**
- you need a generic wrapper without “stack semantics”
- you need custom CSS that is not simply “row/column + spacing”

---

### 8.1 Icon component

❌ **Bad** - direct MUI icon imports:

```tsx
import WorkIcon from '@mui/icons-material/Work'
import BusinessIcon from '@mui/icons-material/Business'

<Button startIcon={<WorkIcon color="primary" />}>
  Label
</Button>
```

✅ **Good** - centralized Icon component:

```tsx
import { Icon } from '@/components/ui/icon'

<Button leftIcon="work" iconOptions={{ color: 'primary' }}>
  Label
</Button>
```

**Rule:** Always use `Icon` component with kebab-case names. All MUI icons are registered in `assets.tsx`.

---

### 8.2 Button component

❌ **Bad** - direct MUI Button with Icon:

```tsx
import Button from '@mui/material/Button'
import LoginIcon from '@mui/icons-material/Login'

<Button startIcon={<LoginIcon />}>Login</Button>
```

✅ **Good** - centralized Button with icon props:

```tsx
import { Button } from '@/components/ui/button'

<Button leftIcon="login" label="Login" />
```

**Rules:**
- Use `@/components/ui/button` instead of `@mui/material/Button`
- Icons via `leftIcon`/`rightIcon` props, options via `iconOptions`
- **Always use `label` prop for button text, not `children`**

#### When to use `label` vs `children`

**Use `label` prop (default):**
- Variables: `label={heroContent.ctaClient}`
- Strings: `label="Продолжить"`
- Conditionals: `label={isLoading ? 'Загрузка...' : 'Продолжить'}`

**Use `children` (rare):**
- Only when button contains complex JSX (not just text)

**Default rule:** Always use `label` for simple text. Use `children` only for complex JSX content.

---

### 8.3 Text component (TS)

❌ **Bad** - direct MUI Typography:

```tsx
import Typography from '@mui/material/Typography'

<Typography variant="h6">Title</Typography>
<Typography variant="body1">{user.name}</Typography>
```

✅ **Good** - centralized TS component:

```tsx
import { TS } from '@/components/ui/text-styled'

<TS variant="h6" content="Title" />
<TS variant="body1" content={user.name} />
```

**Rule:** Use `TS` (Text Styled) from `@/components/ui/text-styled` for all text rendering instead of MUI Typography.

---

#### When to use `content` vs `children`

**Use `content` prop (most cases):**
- Variables/dynamic values: `content={heroContent.title}`
- Short strings: `content="Создайте аккаунт"`
- Template strings: `content={`Шаг ${currentStep} из ${steps.length}`}`
- Numbers: `content={count}`

**Use `children` (rare cases):**
- Only for long string literals in code (2+ lines):

```tsx
<TS variant="body2">
  Проверьте почту и перейдите по ссылке в письме для подтверждения вашего
  аккаунта. Если письмо не пришло, проверьте папку "Спам".
</TS>
```

**Default rule:** Use `content` prop by default. Use `children` only for long multi-line string literals.

---

### Why centralized components?

1. **Consistent API** - all icons use same pattern (`leftIcon="name"`)
2. **Type safety** - autocomplete for icon names, compile-time validation
3. **Easy refactoring** - change implementation in one place
4. **Bundle optimization** - tree-shaking, no duplicate icon imports
5. **Custom enhancements** - animations, spacing, sizing without prop drilling

---

## Pre-commit Component Checklist

Use this checklist to review components before committing:

### Effector:
- [ ] No multiple `useUnit` calls - use array for multiple stores
- [ ] Single store in `useUnit` without array wrapper: `const store = useUnit($store)`
- [ ] Multiple stores in `useUnit` with array: `const [a, b] = useUnit([$a, $b])`
- [ ] No `useEffect` for business logic
- [ ] No `useState` for business data
- [ ] All validation/computations in store via `sample`
- [ ] In `sample` with single store: `source: $store` (without object wrapper)

### Naming:
- [ ] Event handlers with logic: `on*` prefix
- [ ] No `handle*` prefixes for Effector events
- [ ] No unnecessary wrapper functions
- [ ] Direct event calls via arrow functions in JSX
- [ ] Components use `function` declaration (not `const` + `FC`)

### TypeScript:
- [ ] Union types use discriminated unions
- [ ] No `as` casting (except edge cases)
- [ ] Unused types/imports removed

### React/MUI:
- [ ] `slotProps` instead of `inputProps`/`InputProps`
- [ ] No deprecated APIs

### Alerts / Error handling:
- [ ] User-facing errors via `@/alerts` (createAlert / createAlertFx)
- [ ] Critical errors use `disableAutoClose: true`
- [ ] Effect success/error alerts wired in store via sample → createAlertFx
- [ ] Progress alerts use stable id and remove on completion

### Code Quality:
- [ ] Repeated logic extracted to helpers
- [ ] TypeScript: `npm run type-check` passes
- [ ] ESLint: `npm run lint` passes

### Lodash:
- [ ] Named imports used: `import { map, find } from 'lodash'`
- [ ] No default imports: avoid `import _` or `import lo`

### UI Components:
- [ ] Use `Icon` from `@/components/ui/icon` (not `@mui/icons-material`)
- [ ] Use `Button` from `@/components/ui/button` (not `@mui/material/Button`)
- [ ] Use `TS` from `@/components/ui/text-styled` (not `@mui/material/Typography`)
- [ ] Icons use kebab-case names: `leftIcon="work"`, not `<WorkIcon />`
- [ ] Button icons via `leftIcon`/`rightIcon` props with optional `iconOptions`
- [ ] Button text via `label` prop (not `children`): `label="Text"` or `label={variable}`
- [ ] TS text via `content` prop (not `children`) for variables/short strings
