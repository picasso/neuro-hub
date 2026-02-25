'use client'

import MuiAlert, { type AlertProps as MuiAlertProps } from '@mui/material/Alert'
import MuiAlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import { useStoreMap } from 'effector-react'
import { isNumber } from 'lodash'
import { useCallback } from 'react'
import { toast } from 'sonner'
import { $alerts, type AlertId } from './model'
import { Icon, TS } from '@/components/ui'
import { cn } from '@/lib/utils'
import { simpleMarkdown, templatedMessage } from '@/utils'

const iconMapping: MuiAlertProps['iconMapping'] = {
	success: <Icon name="done-filled" color="success" size="lg" />,
	info: <Icon name="info-filled" color="info" size="lg" />,
	warning: <Icon name="warning-filled" color="warning" size="lg" />,
	error: <Icon name="error-filled" color="error" size="lg" />,
}

export function AlertComponent({ id }: { id: AlertId }) {
	const alert = useStoreMap({
		store: $alerts,
		keys: [String(id)],
		fn: (alerts, [key]) => alerts[key],
	})

	if (!alert) {
		return null
	}

	const {
		title,
		message,
		severity,
		progress,
		disableProgressCaption = false,
		elevation,
		variant,
		icon,
		iconOptions,
		md,
		disableClose,
	} = alert

	const isProgress = severity === 'progress'
	const progressValue = isNumber(progress) ? Math.min(100, Math.max(0, progress)) : undefined

	const onClose = useCallback(() => {
		if (!disableClose) {
			toast.dismiss(id)
		}
	}, [disableClose, id])

	const iconNode =
		!icon && !isProgress ? null : (
			<Icon
				name={icon ?? 'spinner'}
				color={
					iconOptions?.color ??
					(isProgress ? (variant === 'filled' ? 'contrast' : 'primary') : undefined)
				}
				size={iconOptions?.size ?? 'lg'}
				spinning={iconOptions?.spinning ?? isProgress}
				className={iconOptions?.tw}
			/>
		)

	const mergedMessage = templatedMessage(message)
	const mergedTitle = title ? templatedMessage(title) : undefined

	return (
		<MuiAlert
			className={cn('markdown-root', variant === 'filled' && 'contrast')}
			onClose={disableClose ? undefined : onClose}
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

			{progressValue !== undefined ? (
				<Box sx={{ mt: 1 }}>
					<LinearProgress
						variant="determinate"
						value={progressValue}
						sx={(theme) => ({
							height: 6,
							borderRadius: 999,
							backgroundColor:
								isProgress && variant === 'filled'
									? theme.palette.primary.dark
									: theme.palette.action.disabledBackground,
							'& .MuiLinearProgress-bar': {
								borderRadius: 999,
								backgroundColor:
									isProgress && variant === 'filled'
										? theme.palette.contrast.main
										: undefined,
							},
						})}
					/>
					{!disableProgressCaption && (
						<TS
							variant="caption"
							sx={{ display: 'block', mt: 0.5 }}
							content={`${Math.round(progressValue)}%`}
							color={isProgress && variant === 'filled' ? 'contrast' : 'primary.dark'}
						/>
					)}
				</Box>
			) : null}
		</MuiAlert>
	)
}
