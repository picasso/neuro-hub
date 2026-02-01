'use client'

import { type AlertProps as MuiAlertProps } from '@mui/material/Alert'
import { createDomain, sample } from 'effector'
import { createGate } from 'effector-react'
import { isString, uniqueId } from 'lodash'
import { type ReactElement } from 'react'
import { toast, type ExternalToast as ToastProps } from 'sonner'
import { AlertComponent } from './alert'
import { type IconName, type IconOptions } from '@/components/ui'
import { type TemplatedMessage, type MarkdownParams } from '@/utils'

// type Options = Omit<AlertProps, 'id' | 'text'> & {
// 	message: string | ((id: number) => ReactElement) | ReactNode
// 	duration?: number
// }

const domain = createDomain('alerts')
export const AlertGate = createGate({ domain })

// store for received alerts ----------------------------------------------------------------------]

// export interface AlertProps {
// 	id: number
// 	text: string | ReactNode
// 	title?: string
// 	disableClose?: boolean
// 	severity?: 'success' | 'info' | 'warning' | 'error' | 'progress'
// 	variant?: MuiAlertProps['variant']
// 	elevation?: MuiAlertProps['elevation']
// 	icon?: IconName
// 	iconOptions?: IconOptions
// 	status?: number
// 	statusText?: string
// }
// Omit<MuiAlertProps, 'id' | 'text'>

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
	disableClose?: boolean | undefined
}

export type Alert = Omit<
	ToastProps,
	| 'description'
	| 'icon'
	| 'invert'
	| 'closeButton'
	| 'action'
	| 'cancel'
	| 'actionButtonStyle'
	| 'cancelButtonStyle'
> &
	Omit<AlertComponentProps, 'id'>

export const addAlert = domain.createEvent<Alert>()

export const createAlertFx = domain.createEffect((options: Alert) => {
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
		...rest
	} = options

	const alertId = id ?? createAlertId()

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
			/>
		)
	}

	toast.custom(render, { id: alertId, ...rest } as ToastProps)

	return alertId
})

sample({
	clock: addAlert,
	filter: AlertGate.status,
	target: createAlertFx,
})

// helpers ----------------------------------------------------------------------------------------]

const createAlertId = (key?: string) => (key ? `alert-${key}` : uniqueId('alert-'))

export function createAlert(alert: Alert['severity'] | Alert, message?: Alert['message']) {
	const newAlert = isString(alert) ? { severity: alert, message } : alert
	const id = createAlertId()
	addAlert({ id, ...newAlert })
	return id
}

export function removeAlert(id: ToastProps['id']) {
	toast.dismiss(id)
}
