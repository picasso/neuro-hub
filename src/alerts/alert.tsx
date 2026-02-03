'use client'

import MuiAlert, { type AlertProps as MuiAlertProps } from '@mui/material/Alert'
import MuiAlertTitle from '@mui/material/AlertTitle'
import { type FC } from 'react'
import { toast } from 'sonner'
import { type AlertComponentProps } from './model'
import { Icon } from '@/components/ui'
import { simpleMarkdown, templatedMessage } from '@/utils'

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

const iconMapping: MuiAlertProps['iconMapping'] = {
	success: <Icon name="check" color="success" />,
	info: <Icon name="info" color="info" />,
	warning: <Icon name="warning" color="warning" />,
	error: <Icon name="error" color="error" />,
}

export const AlertComponent: FC<AlertComponentProps> = (props) => {
	const {
		id,
		title,
		message,
		severity,
		elevation,
		variant,
		icon,
		iconOptions,
		md,
		disableClose,
	} = props

	const isProgress = severity === 'progress'

	const onClose = () => {
		if (!disableClose) {
			toast.dismiss(id)
		}
	}

	const iconNode =
		!icon && !isProgress ? null : (
			<Icon
				name={icon ?? 'spinner'}
				color={iconOptions?.color ?? (isProgress ? 'secondary' : undefined)}
				fontSize={iconOptions?.size}
				animation={iconOptions?.animation ?? (isProgress ? 'rotate' : undefined)}
				sx={{ mr: iconOptions?.spacing }}
			/>
		)

	const mergedMessage = templatedMessage(message)
	const mergedTitle = title ? templatedMessage(title) : undefined

	return (
		<MuiAlert
			onClose={onClose}
			severity={severity}
			variant={variant}
			icon={iconNode}
			iconMapping={iconMapping}
			elevation={elevation ?? 3}
			sx={[
				{ minWidth: { md: 'none', lg: 400, xl: 600 } },
				{ '.MuiAlert-message': { width: '100%' } },
				!title && { '.MuiAlert-action': { py: 0.75, pl: 2 } },
			]}
		>
			{mergedTitle && <MuiAlertTitle>{simpleMarkdown(mergedTitle, md || {})}</MuiAlertTitle>}
			{md === false ? mergedMessage : simpleMarkdown(mergedMessage, md)}
		</MuiAlert>
	)
}
