'use client'

import { type AlertProps as MuiAlertProps } from '@mui/material/Alert'
import { createDomain, type EventCallable, sample } from 'effector'
import { createGate } from 'effector-react'
import { isString, merge, uniqueId } from 'lodash'
import { type ReactElement } from 'react'
import { toast, type ExternalToast as ToastProps, type ToasterProps } from 'sonner'
import { AlertComponent } from './alert'
import { type IconName, type IconOptions } from '@/components/ui'
import { type MarkdownParams, type TemplatedMessage } from '@/utils'

const domain = createDomain('alerts')

// * * * Alert types ------------------------------------------------------------------------------]

export type AlertComponentProps = {
	id?: ToastProps['id']
	severity: NonNullable<MuiAlertProps['severity']> | 'progress'
	title?: TemplatedMessage
	message?: MuiAlertProps['children'] | TemplatedMessage
	variant?: MuiAlertProps['variant']
	elevation?: MuiAlertProps['elevation']
	overlay?: boolean
	icon?: IconName
	iconOptions?: IconOptions
	md?: Partial<MarkdownParams> | false
	sx?: MuiAlertProps['sx']
	disableClose?: boolean
	// if true, the toast will not be closed automatically after the `duration` prop
	// this is a more explicit alternative to `duration: Infinity`
	disableAutoClose?: boolean
}

export type Alert = Omit<
	ToastProps,
	| 'description'
	| 'closeButton'
	| 'invert'
	| 'dismissible'
	| 'icon'
	| 'action'
	| 'cancel'
	| 'actionButtonStyle'
	| 'cancelButtonStyle'
> &
	Omit<AlertComponentProps, 'id'>

// * * * `toast` options that are not overridden by `AlertComponent` options ----------------------]
//
// - `duration` - Time in milliseconds that should elapse before automatically closing the toast.
// - `position` - Position of the toast.
// - `testId` - Test id for the toast for reliable e2e testing with data-testid attributes.
// - `toasterId` - The id of the toaster to render the toast in.
// - `onDismiss` - The function gets called when either the close button is clicked, or the toast is swiped.
// - `onAutoClose` - Function that gets called when the toast disappears automatically after its timeout (duration prop).
// - `containerAriaLabel` - Custom ARIA label for the toast container.

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

// * * * gate -------------------------------------------------------------------------------------]

export const AlertGate = createGate({ domain, name: 'AlertGate' })

// * * * events -----------------------------------------------------------------------------------]

export const addAlert = domain.createEvent<Alert>('addAlert')
export const updateOptions = domain.createEvent<Partial<AlertOptions>>('updateOptions')
const resetOptions = domain.createEvent('resetOptions')
const incrementOverlay = domain.createEvent('incrementOverlay')
const decrementOverlay = domain.createEvent('decrementOverlay')

// * * * effects ----------------------------------------------------------------------------------]

export const addAlertFx = domain.createEffect({
	handler: (options: Alert) => {
		const {
			id,
			severity,
			title,
			message,
			variant,
			elevation,
			overlay,
			icon,
			iconOptions,
			md,
			sx,
			disableClose,
			disableAutoClose,
			// toast options for overlay control
			onDismiss,
			onAutoClose,
			...rest
		} = options

		const alertId = id ?? createAlertId()

		if (overlay) {
			incrementOverlay()
		}

		const onDismissProxy: ToastProps['onDismiss'] = overlay
			? (toast) => {
					decrementOverlay()
					onDismiss?.(toast)
				}
			: onDismiss

		const onAutoCloseProxy: ToastProps['onAutoClose'] = overlay
			? (toast) => {
					decrementOverlay()
					onAutoClose?.(toast)
				}
			: onAutoClose

		const render = (id: number | string): ReactElement => {
			return (
				<AlertComponent
					id={id}
					severity={severity}
					title={title}
					message={message}
					elevation={elevation}
					variant={variant}
					overlay={overlay}
					icon={icon}
					iconOptions={iconOptions}
					md={md}
					sx={sx}
					disableClose={disableClose}
				/>
			)
		}

		toast.custom(render, {
			id: alertId,
			onDismiss: onDismissProxy,
			onAutoClose: onAutoCloseProxy,
			dismissible: !disableClose,
			duration: disableAutoClose ? Infinity : undefined,
			...rest,
		} as ToastProps)

		return alertId
	},
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

// create alert when `addAlert` event triggered and gate is open
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

const createFx = domain.createEffect<AlertParams, string>(({ id, target, ...alert }) => {
	const alertId = id ?? createAlertId()
	addAlert({ id: alertId, ...alert })
	if (target) target(alertId)
	return alertId
})

const removeFx = domain.createEffect<AlertExtra, void>(({ id, target }) => {
	if (id) {
		removeAlert(id)
		if (target) target(id)
	}
})

export const createAlertFx = Object.assign(createFx, {
	props: (alert: AlertParams) => alert,
	removeFx,
	remove: removeAlert,
	alertId: createAlertId,
})

// * * * helpers ----------------------------------------------------------------------------------]

export function createAlert(alert: Alert['severity'] | Alert, message?: Alert['message']) {
	const newAlert = isString(alert) ? { severity: alert, message } : alert
	const id = createAlertId()
	addAlert({ id, ...newAlert })
	return id
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
