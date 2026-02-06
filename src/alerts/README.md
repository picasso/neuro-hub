# Alerts System: Connecting People

Notifications with overlay support based on **Sonner** and **Effector**.

## Basic Usage

### Simple alert

The simplest way to show an alert is to call `createAlert()` with severity and message:

```tsx
import { createAlert } from '@/alerts'

// severity shortcut
createAlert('success', 'Operation completed successfully')
createAlert('error', 'Something went wrong')

// full object syntax
createAlert({
    severity: 'info',
    message: 'Lorem ipsum dolor sit amet',
})
```

### Severities

The alerts system supports 5 severity levels:

```tsx
// standard MUI severities
createAlert({ severity: 'info', message: 'Information message' })
createAlert({ severity: 'success', message: 'Success message' })
createAlert({ severity: 'warning', message: 'Warning message' })
createAlert({ severity: 'error', message: 'Error message' })

// custom progress severity with spinning icon
createAlert({
    severity: 'progress',
    title: 'Loading...',
    message: 'Please wait while we process your request',
})
```

### Variants

Alerts support three visual variants:

```tsx
// standard (default) - light background
createAlert({
    severity: 'info',
    variant: 'standard',
    message: 'Standard variant with light background',
})

// filled - solid colored background
createAlert({
    severity: 'info',
    variant: 'filled',
    message: 'Filled variant with solid background',
})

// outlined - border only
createAlert({
    severity: 'info',
    variant: 'outlined',
    message: 'Outlined variant with border',
})
```

### Title and Elevation

```tsx
// with title
createAlert({
    severity: 'success',
    title: 'Registered successfully',
    message: 'The panel has been registered',
})

// with elevation (shadow)
createAlert({
    severity: 'warning',
    elevation: 6,
    message: 'Alert with shadow',
})
```

## Special Features

### Overlay Mode

Blocking mode with semi-transparent backdrop for critical operations. Perfect for long-running processes like registration or uploads:

```tsx
import { createAlertFx } from '@/alerts'

// using createAlertFx for more control
sample({
    clock: registerPanelFx,
    fn: (panel) => createAlertFx.props({
        id: createAlertFx.alertId(panel.id),
        severity: 'progress',
        title: 'Registering panel...',
        message: ['The registration of `%s` by **%s** has begun', panel.name, author],
        overlay: true,
        disableClose: true,
    }),
    target: createAlertFx,
})
```

### Auto-close Control

Control alert dismissal behavior:

```tsx
// disable auto-close (explicit alternative to duration: Infinity)
createAlert({
    severity: 'warning',
    message: 'This requires your attention',
    disableAutoClose: true, // won't close automatically
})

// disable close button
createAlert({
    severity: 'error',
    title: 'Critical error',
    message: 'Cannot proceed with operation',
    disableClose: true, // no close button
})

// both together for critical blocking alerts
createAlert({
    severity: 'progress',
    title: 'Processing...',
    message: 'Please wait',
    overlay: true,
    disableClose: true,
    disableAutoClose: true,
})
```

### Custom Icons

Override default icons with custom ones and animation:

```tsx
createAlert({
    severity: 'warning',
    message: 'Custom icon example',
    icon: 'warning',
    iconOptions: {
        color: 'error',
        animation: 'rotate',
    },
})

createAlert({
    severity: 'info',
    message: 'Rocket launch!',
    icon: 'rocket',
})
```

### Markdown Support

Format messages with markdown syntax:

```tsx
// basic markdown
createAlert({
    severity: 'info',
    message: 'Lorem `ipsum` dolor sit **amet**, consectetur adipiscing elit',
})

// with line breaks
createAlert({
    severity: 'warning',
    message: 'Unfortunately, the data to restore the original order was lost.\n' +
        'Original (**not sorted**) oligo order cannot be restored.',
    md: { br: true }, // enable <br> tags instead of default <p>
})

// templated messages with sprintf syntax
createAlert({
    severity: 'warning',
    message: [
        'You can **reuse** %s entities, delete *%s* from this panel or `%s` and update panel.',
        23,
        'duplicate compounds',
        'cancel registration',
    ],
})

// disable markdown
createAlert({
    severity: 'info',
    message: 'Raw text without **formatting**',
    md: false,
})
```

## Alert Options Management

Global configuration for all alerts in the application.

### updateAlertOptions()

Change global settings for position, duration, and more:

```tsx
import { updateAlertOptions } from '@/alerts'

// change position
updateAlertOptions({
    position: 'top-right',
})

// change default duration
updateAlertOptions({
    duration: 5000, // 5 seconds
})

// multiple options at once
updateAlertOptions({
    position: 'bottom-center',
    duration: 3000,
    visibleToasts: 5,
    gap: 12,
})
```

### resetAlertOptions()

Reset all options to defaults:

```tsx
import { resetAlertOptions } from '@/alerts'

resetAlertOptions()
```

Default options:

```tsx
{
    visibleToasts: 3,
    duration: 4000,
    position: 'bottom-left',
    gap: 10,
    expand: true,
    offset: { bottom: '80px', left: '16px' },
    mobileOffset: { bottom: '16px', left: '16px' },
}
```

## Advanced Usage

### Effector Integration

For complex flows with Effector, use `createAlertFx` for better control:

```tsx
import { sample } from 'effector'
import { createAlertFx } from '@/alerts'

// display alert when effect succeeds
sample({
    clock: alertedSuccess,
    fn: (name) => createAlertFx.props({
        severity: 'success',
        title: 'Registered successfully',
        message: ['The panel `%s` registered', name],
    }),
    target: createAlertFx,
})

// display alert on error
sample({
    clock: addedCompounds,
    source: { panels: $panels, active: $activePanel },
    filter: ({ panels, active }, added) => {
        // check if compounds already exist
        if (active) {
            const { compounds } = panels[active.id]
            return some(added, ({ id }) => find(compounds, { id }))
        }
        return false
    },
    fn: ({ active }) => createAlertFx.props({
        severity: 'error',
        title: 'Error while adding compounds',
        message: ['One of your compounds already exists in panel `%s`', active?.id as string],
        disableAutoClose: true,
    }),
    target: createAlertFx,
})
```

### Duration & Position Control

```tsx
// custom duration for specific alert
createAlert({
    severity: 'info',
    message: 'Quick message',
    duration: 2000, // 2 seconds
})

// infinite duration (use disableAutoClose instead)
createAlert({
    severity: 'warning',
    message: 'Important notice',
    disableAutoClose: true, // preferred way
    // or
    duration: Infinity, // alternative
})

// custom position per alert
createAlert({
    severity: 'success',
    message: 'Top center notification',
    position: 'top-center',
})
```

### Callbacks

React to alert lifecycle events:

```tsx
createAlert({
    severity: 'info',
    message: 'Alert with callbacks',
    onDismiss: (toast) => {
        console.log('Alert dismissed', toast.id)
        // cleanup or additional actions
    },
    onAutoClose: (toast) => {
        console.log('Alert auto-closed', toast.id)
        // track auto-close analytics
    },
})
```

## Best Practices

### When to use overlay mode

Use `overlay: true` for:
- Long-running operations (registration, upload, processing)
- Critical operations that should block user interaction
- Progress indicators for async processes

```tsx
// good: blocking critical operation
createAlert({
    severity: 'progress',
    title: 'Registering panel...',
    message: 'Please wait while we register your panel',
    overlay: true,
    disableClose: true,
})

// bad: don't use overlay for simple notifications
createAlert({
    severity: 'success',
    message: 'Item saved',
    overlay: true, // ❌ unnecessary
})
```

### When to use disableAutoClose

Use `disableAutoClose: true` for:
- Error messages requiring user action
- Validation warnings that need acknowledgment
- Information that users must read

```tsx
// good: error requiring attention
createAlert({
    severity: 'error',
    title: 'Error while adding compounds',
    message: 'One of your compounds already exists in this panel',
    disableAutoClose: true, // user must dismiss manually
})

// good: hidden columns warning
createAlert({
    severity: 'warning',
    title: 'You cannot see "ML Insights"',
    message: 'Toggle on the ML Insights checkbox to display these columns.',
    disableAutoClose: true, // important info
})

// bad: success messages should auto-close
createAlert({
    severity: 'success',
    message: 'Saved successfully',
    disableAutoClose: true, // ❌ let it auto-close
})
```

### Creating unique alert IDs

For operations tied to specific entities, use consistent IDs to manage alerts:

```tsx
// good: use entity ID for alert tracking
const alertId = createAlertFx.alertId(panel.id)

createAlert({
    id: alertId,
    severity: 'progress',
    title: 'Processing...',
})

// later, remove the specific alert
createAlertFx.remove(alertId)

// good: check and remove stale alerts
if (alertId && job.status !== 'PENDING') {
    createAlertFx.remove(alertId)
}
```

### Removing progress alerts

Always clean up progress alerts when operations complete:

```tsx
// good: remove alert when operation finishes
const alertId = createAlertFx.alertId(entity.id)

createAlert({
    id: alertId,
    severity: 'progress',
    title: 'Loading...',
})

// after operation completes
if (alertId) {
    createAlertFx.remove(alertId)
}

// then show result alert
createAlert({
    severity: 'success',
    title: 'Completed',
})
```

## API Reference

### Alert Props

- `severity` - `'info' | 'success' | 'warning' | 'error' | 'progress'` - Alert severity level
- `title` - `TemplatedMessage` - Optional alert title
- `message` - `string | TemplatedMessage` - Alert message content
- `variant` - `'standard' | 'filled' | 'outlined'` - Visual variant (default: `'standard'`)
- `elevation` - `number` - Shadow elevation (0-24)
- `overlay` - `boolean` - Show semi-transparent backdrop (default: `false`)
- `icon` - `IconName` - Custom icon name
- `iconOptions` - `IconOptions` - Custom icon options (color, animation)
- `md` - `Partial<MarkdownParams> | false` - Markdown configuration or disable
- `sx` - `MuiAlertProps['sx']` - MUI sx prop for custom styling
- `disableClose` - `boolean` - Hide close button (default: `false`)
- `disableAutoClose` - `boolean` - Disable automatic closing (default: `false`)

**Inherited from Sonner ToastProps:**

- `id` - `string | number` - Unique alert identifier
- `duration` - `number` - Time in ms before auto-close (default: 4000)
- `position` - `'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'` - Alert position
- `onDismiss` - `(toast: ToastT) => void` - Callback when alert is dismissed
- `onAutoClose` - `(toast: ToastT) => void` - Callback when alert auto-closes
- `testId` - `string` - Test ID for e2e testing
- `toasterId` - `string` - ID of toaster to render in
- `containerAriaLabel` - `string` - Custom ARIA label

### AlertOptions Props

Global configuration for all alerts:

- `position` - `'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'` - Default position for all alerts (default: `'bottom-left'`)
- `visibleToasts` - `number` - Maximum number of visible alerts (default: `3`)
- `offset` - `{ top?: string, bottom?: string, left?: string, right?: string }` - Offset from viewport edges (default: `{ bottom: '80px', left: '16px' }`)
- `mobileOffset` - `{ top?: string, bottom?: string, left?: string, right?: string }` - Offset on mobile devices (default: `{ bottom: '16px', left: '16px' }`)
- `duration` - `number` - Default auto-close duration in ms (default: `4000`)
- `gap` - `number` - Gap between alerts in px (default: `10`)
- `expand` - `boolean` - Expand alerts to show all content (default: `true`)
- `toastOptions` - `ToasterProps['toastOptions']` - Default options for all toasts

#### createAlertFx

Effector effect for creating alerts with advanced features.

**Methods:**

- `createAlertFx(alert)` - Create alert via Effector effect
- `createAlertFx.props(alert)` - Helper to construct alert params
- `createAlertFx.alertId(key?)` - Generate unique alert ID
- `createAlertFx.remove(id)` - Remove alert by ID
- `createAlertFx.removeFx` - Effector effect for removing alerts

---

Built on top of [Sonner](https://sonner.emilkowal.ski/) by Emil Kowalski.
