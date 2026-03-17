# Modals (shadcn-based)

The modal system is built on top of `Dialog` from `@/ui/dialog` and managed via Effector.

Core API lives in `@/modals`:

- `registerModal` - register a modal template by id
- `createModal` - create an async opener (`Promise<boolean>` by default, configurable via generics/mapper)
- `createModalWithIds` - helper that returns `Promise<string>` with action ids
- `ModalPlugin` - renderer that must be mounted once in layout
- `confirmYes` - built-in confirmation modal

## Quick start

The common workflow has three steps:

1. Register modal configuration once with `registerModal(id, props)`.
2. Create an opener function with `createModal(id)`.
3. Call opener where needed and handle resolved result.

### 1) Register a modal

```ts
import { registerModal } from '@/modals'

registerModal('restore', {
  icon: 'badge-check',
  title: 'You have unsaved changes',
  description: 'Do you want to restore them?',
  labels: ['cancel', { yes: 'Restore' }],
})
```

Registered props are `DialogProps` from `@/ui/dialog` (except `open`, `onClose`) plus optional:

```ts
onFilter?: (id: string) => boolean | undefined
```

Why `open` and `onClose` are excluded: they are controlled by modal infrastructure.
Your code only describes visual/content behavior and action semantics.

### 2) Create opener and use it

```tsx
import { createModal } from '@/modals'

const confirmRestore = createModal('restore')

async function handleRestore() {
  const result = await confirmRestore()
  if (result) {
    // user confirmed action
  }
}
```

By default, the promise resolves to `value ?? false` from the clicked action.
For most confirmation flows this means `Promise<boolean>` out of the box.

### 3) Mount plugin once

`ModalPlugin` must be mounted once near app root (already done in `src/app/layout.tsx`):

```tsx
import { ModalPlugin } from '@/modals'
```

## Overriding modal props per call

The function returned by `createModal` accepts:

- object override
- function override `(registeredProps) => nextProps`

This is useful when a modal is mostly static, but part of text or action config
depends on runtime data (entity name, count, current mode, etc.).

```tsx
const confirmRestore = createModal('restore')

const result = await confirmRestore({
  title: 'Are you sure?',
  iconOptions: { color: 'warning' },
  actionsPosition: 'center',
})

const result2 = await confirmRestore((props) => ({
  ...props,
  description: String(props.description).replace('%s', 'Document A'),
}))
```

## Mapping result (`createModal` 2nd arg)

Use mapper when you want custom return type:

```ts
import { createModal } from '@/modals'

const chooseAction = createModal<string>('restore', ({ result }) => {
  return typeof result.value === 'string' ? result.value : 'cancel'
})
```

Mapper receives rich close context and lets you normalize result into domain-friendly
types (for example, `'save' | 'discard' | 'cancel'` instead of boolean).

## `createModalWithIds`

Shortcut for id-based result:

```ts
import { createModalWithIds } from '@/modals'

const confirmById = createModalWithIds('restore', 'cancel')
const id = await confirmById()
// id -> 'yes' | 'no' | 'cancel' | ...
```

Use this helper when business logic branches by action id and boolean is not expressive enough.

## Actions, labels and linked data

### `labels`

`labels` is a compact shortcut for default actions (`ok`, `cancel`, `yes`, `no`).
Use it when you only need to choose order and optionally rename labels.

Important limitation: with `labels` you only configure which default actions are shown;
you do not control full button props (variant, icons, size, etc.).

```ts
labels: ['cancel', 'yes']
labels: ['cancel', { yes: 'Continue' }]
```

### `actions`

Use `actions` when you need full control over footer behavior and button props
(`variant`, `leftIcon`, `disabled`, `size`, custom values, and so on).
If `actions` are provided, they effectively replace default `labels` actions.

```ts
actions: [
  { id: 'cancel', label: 'Cancel', variant: 'ghost' },
  { id: 'delete', label: 'Delete', variant: 'destructive', leftIcon: 'trash' },
  { id: 'reuse', label: 'Reuse', variant: 'default', leftIcon: 'check' },
]
```

### `linkedData`

`linkedData` attaches extra payload per action id.
That payload is returned as `linked` and is useful when the same modal action
must return contextual data (for example, ids selected for delete/reuse).

```ts
const openDuplicateModal = createModal<string, null, string[]>(
  'duplicate-modal',
  ({ result }) => (result.value ? result : { value: 'cancel', linked: [] }),
)

const result = await openDuplicateModal({
  linkedData: {
    reuse: ['existing-1'],
    delete: ['dup-1', 'dup-2'],
    cancel: [],
  },
})
// result: { value: 'reuse' | 'delete' | 'cancel', linked: string[] }
```

## Filtering close with `onFilter`

`onFilter` is called before close for string action values.
If it returns `false`, modal stays open.

```ts
registerModal('validated-modal', {
  title: 'Confirm',
  description: 'Please confirm your action',
  labels: ['cancel', 'ok'],
  onFilter: (id) => id !== 'cancel',
})
```

Typical use cases:

- block close until form inside modal is valid
- require explicit action (for example, disallow accidental "cancel")
- run lightweight guard logic before resolving promise

## Force remount per open (`withResetKey`)

Third argument of `createModal` enables unique key per invocation:

```ts
const openWizard = createModal('wizard-modal', null, true)

await openWizard() // fresh instance
await openWizard() // fresh instance again
```

Useful when modal has local internal state that must be reset between opens.
This is especially helpful for custom modal components with forms/wizards.

## Custom modal component

You can register a fully custom modal component instead of `Dialog`.

Requirements:

- accept `open`
- call `onClose(value?, linked?)` to resolve promise
- optional `onCompleted` callback can be passed through override

Choose custom modal when `Dialog` props are not enough (complex layout,
multi-step flow, embedded async operations, custom keyboard handling).

```tsx
import { createModal, type ModalComponentProps, registerModal } from '@/modals'

function CustomModal({ open, onClose, onCompleted }: ModalComponentProps) {
  if (!open) return null

  return (
    <div>
      <button
        onClick={() => {
          onClose(true)
          onCompleted?.()
        }}
      >
        Done
      </button>
    </div>
  )
}

registerModal('custom-modal', null, CustomModal)

const openCustom = createModal('custom-modal')
```

## Built-in modal

### `confirmYes`

Pre-registered modal id: `confirm-yes`.
Exported helper: `confirmYes`.

```tsx
import { confirmYes } from '@/modals'

const result = await confirmYes({
  title: 'Delete item?',
  description: 'This action cannot be undone.',
})
if (result) {
  // user clicked Yes
}
```

## Fallback for unknown ids

There is an internal fallback modal (`wrongModalId`) shown when an unregistered id is opened.
It is auto-registered in the plugin and shows a helpful "id not found" message.

## Notes

- Prefer importing public API from `@/modals`.
- `description` supports string markdown (rendered via `TS`) or `ReactNode`.
- `labels` and `actions` are mutually exclusive in practice - use one approach per modal.
