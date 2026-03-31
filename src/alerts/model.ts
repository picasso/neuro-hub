'use client'

import { attach, type EventCallable, sample } from 'effector'
import { createGate } from 'effector-react'
import { produce, castDraft } from 'immer'
import { forEach, isString, merge, set, uniqueId } from 'lodash'
import { createElement, type FC, type ReactElement, type ReactNode } from 'react'
import { toast, type ExternalToast as ToastProps, type ToasterProps } from 'sonner'
import { alertsDomain as domain } from '@/lib/logger'
import { type IconName, type IconOptions } from '@/ui'
import { type MarkdownParams, type TemplatedMessage } from '@/utils'

// * * * Alert types ------------------------------------------------------------------------------]

export type AlertId = Exclude<NonNullable<ToastProps['id']>, number>

export type AlertSeverity = 'info' | 'success' | 'warning' | 'error' | 'progress'
export type AlertVariant = 'standard' | 'filled' | 'outlined'

export type AlertComponentProps = {
	id?: AlertId
	severity: AlertSeverity
	title?: TemplatedMessage
	message?: ReactNode | TemplatedMessage
	relaxed?: boolean
	// 0..100 for determinate progress UI
	progress?: number
	disableProgressCaption?: boolean
	variant?: AlertVariant
	overlay?: boolean
	icon?: IconName
	iconOptions?: IconOptions
	md?: Partial<MarkdownParams> | false
	disableClose?: boolean
	// if true, the toast will not be closed automatically after the `duration` prop
	// this is a more explicit alternative to `duration: Infinity`
	disableAutoClose?: boolean
}
type AllowedToastProps = Omit<
	ToastProps,
	| 'id'
	| 'description'
	| 'closeButton'
	| 'invert'
	| 'dismissible'
	| 'icon'
	| 'action'
	| 'cancel'
	| 'actionButtonStyle'
	| 'cancelButtonStyle'
	| 'richColors'
	| 'style'
	| 'unstyled'
	| 'classNames'
	| 'className'
	| 'descriptionClassName'
>
type TKeys = keyof AllowedToastProps

// * * * `toast` options that are not overridden by `AlertComponent` options ----------------------]
//
// - `duration` - Time in milliseconds that should elapse before automatically closing the toast.
// - `position` - Position of the toast.
// - `testId` - Test id for the toast for reliable e2e testing with data-testid attributes.
// - `toasterId` - The id of the toaster to render the toast in.
// - `onDismiss` - The function gets called when either the close button is clicked, or the toast is swiped.
// - `onAutoClose` - Function that gets called when the toast disappears automatically after its timeout (duration prop).
// - `containerAriaLabel` - Custom ARIA label for the toast container.

export type Alert = AllowedToastProps & AlertComponentProps
export type AlertProps = { id: AlertId }

export type AlertOptions = {
	position?: ToasterProps['position']
	visibleToasts?: ToasterProps['visibleToasts']
	offset?: ToasterProps['offset']
	mobileOffset?: ToasterProps['mobileOffset']
	duration?: ToasterProps['duration']
	gap?: ToasterProps['gap']
	expand?: ToasterProps['expand']
	toastOptions?: ToasterProps['toastOptions']
}

type AlertComponentType = FC<AlertProps>
type AlertWithId = Omit<Alert, 'id'> & { id: AlertId }
type AlertPatch = { id: AlertId } & Partial<Omit<Alert, 'id' | 'overlay' | TKeys>>
type Alerts = Record<AlertId, Alert>

// * * * gate -------------------------------------------------------------------------------------]

// NOTE: use Gate with props to resolve circular dependency between `alert.tsx` and model.tsx
export const AlertGate = createGate<FC<AlertProps>>({ domain, name: 'AlertGate' })

// * * * events -----------------------------------------------------------------------------------]

export const addAlert = domain.createEvent<Alert>('addAlert')
const upsertAlert = domain.createEvent<AlertWithId>('upsertAlert')
const patchAlert = domain.createEvent<AlertPatch>('patchAlert')
const deleteAlert = domain.createEvent<AlertId>('deleteAlert')
export const updateOptions = domain.createEvent<Partial<AlertOptions>>('updateOptions')
const resetOptions = domain.createEvent('resetOptions')
const incrementOverlay = domain.createEvent('incrementOverlay')
const decrementOverlay = domain.createEvent('decrementOverlay')

// * * * $alerts ----------------------------------------------------------------------------------]

const $component = domain.createStore<AlertComponentType | null>(null, { name: '$component' })
export const $alerts = domain.createStore<Alerts>({}, { name: '$alerts' })

$alerts.on(upsertAlert, (alerts, { id, ...alert }) =>
	produce(alerts, (draft) => {
		draft[id] = castDraft(alert)
	}),
)

$alerts.on(patchAlert, (alerts, { id, ...patch }) =>
	produce(alerts, (draft) => {
		if (alerts[id]) {
			forEach(patch, (value, key) => {
				set(draft[id], key, value)
			})
		}
	}),
)

$alerts.on(deleteAlert, (alerts, id) =>
	produce(alerts, (draft) => {
		if (alerts[id]) {
			delete draft[id]
		}
	}),
)

// * * * effects ----------------------------------------------------------------------------------]

export const addAlertFx = attach({
	source: $component,
	effect: (alertComponent, options: Alert) => {
		if (!alertComponent) return
		const alertId = (options.id ?? createAlertId()) as AlertId

		// store as a single source of truth
		const stored: AlertWithId = { ...options, id: alertId }
		upsertAlert(stored)

		// overlay lifecycle (immutable after create)
		if (stored.overlay) incrementOverlay()

		toast.custom(
			(id): ReactElement => createElement(alertComponent, { id: String(id) as AlertId }),
			buildToastProps(stored),
		)

		return alertId
	},
	domain,
	name: 'addAlertFx',
})

// * * * stores -----------------------------------------------------------------------------------]

export const $overlay = domain
	.createStore<number>(0, { name: '$overlay' })
	.on(incrementOverlay, (count) => count + 1)
	.on(decrementOverlay, (count) => Math.max(0, count - 1))

export const $options = domain
	.createStore<AlertOptions>(
		{
			visibleToasts: 3,
			duration: 4000,
			position: 'bottom-left',
			gap: 10,
			expand: true,
			offset: { bottom: '80px', left: '16px' },
			mobileOffset: { bottom: '16px', left: '16px' },
		},
		{ name: '$options' },
	)
	.on(updateOptions, (options, update) => merge({}, options, update))
	.reset(resetOptions)

// * * * connections ------------------------------------------------------------------------------]

// store toast renderer component when alert gate opens
sample({
	clock: AlertGate.open,
	target: $component,
})

// enqueue toast via effect when `addAlert` fires and gate is ready
sample({
	clock: addAlert,
	filter: AlertGate.status,
	target: addAlertFx,
})

// effect for creating alerts via effector helpers ------------------------------------------------]

const createAlertId = (key?: string) => (key ? `alert-${key}` : uniqueId('alert-'))

interface AlertParams extends Alert {
	id?: string
	target?: EventCallable<string>
}

type AlertExtra = Pick<AlertParams, 'target' | 'id'>

const createFx = domain.createEffect<AlertParams, string>({
	handler: ({ id, target, ...alert }) => {
		const alertId = id ?? createAlertId()
		addAlert({ id: alertId, ...alert })
		if (target) target(alertId)
		return alertId
	},
	name: 'createAlertFx',
})

const removeFx = domain.createEffect<AlertExtra, void>({
	handler: ({ id, target }) => {
		if (id) {
			removeAlert(id)
			if (target) target(id)
		}
	},
	name: 'removeAlertFx',
})

export const createAlertFx = Object.assign(createFx, {
	props: (alert: AlertParams) => alert,
	removeFx,
	remove: removeAlert,
	update: updateAlert,
	alertId: createAlertId,
})

// * * * helpers ----------------------------------------------------------------------------------]

function buildToastProps({
	id,
	position,
	duration,
	overlay,
	onDismiss,
	onAutoClose,
	testId,
	toasterId,
	disableClose,
	disableAutoClose,
}: Alert): ToastProps {
	const onDismissProxy: ToastProps['onDismiss'] = (toast) => {
		if (overlay) decrementOverlay()
		onDismiss?.(toast)
		if (id) deleteAlert(id)
	}
	const onAutoCloseProxy: ToastProps['onAutoClose'] = (toast) => {
		if (overlay) decrementOverlay()
		onAutoClose?.(toast)
		if (id) deleteAlert(id)
	}
	return {
		id,
		position,
		duration: duration ? duration : disableAutoClose ? Infinity : undefined,
		testId,
		toasterId,
		onDismiss: onDismissProxy,
		onAutoClose: onAutoCloseProxy,
		dismissible: !disableClose,
	} as ToastProps
}

export function createAlert(alert: Alert['severity'] | Alert, message?: Alert['message']) {
	const newAlert = isString(alert) ? { severity: alert, message } : alert
	const id = createAlertId() as AlertId
	addAlert({ id, ...newAlert } as Alert)
	return id
}

export function updateAlert(alert: AlertPatch) {
	patchAlert(alert)
}

export function removeAlert(id: ToastProps['id']) {
	toast.dismiss(id)
}

export function updateAlertOptions(options: Partial<AlertOptions>) {
	updateOptions(options)
}

export function resetAlertOptions() {
	resetOptions()
}
