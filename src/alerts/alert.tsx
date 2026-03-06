'use client'

import { useStoreMap } from 'effector-react'
import { isNumber } from 'lodash'
import { useCallback } from 'react'
import { toast } from 'sonner'
import { $alerts, type AlertProps } from './model'
import { Alert, Progress, TS } from '@/ui'
import { cn, simpleMarkdown, templatedMessage } from '@/utils'

export function AlertComponent({ id }: AlertProps) {
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

	const mergedMessage = templatedMessage(message)
	const mergedTitle = title ? templatedMessage(title) : undefined
	const titleContent = mergedTitle ? simpleMarkdown(mergedTitle, md || {}) : undefined
	const messageContent = md === false ? mergedMessage : simpleMarkdown(mergedMessage, md || {})

	const mergedIconOptions = {
		...iconOptions,
		spinning: iconOptions?.spinning ?? isProgress,
		color: (isProgress && variant === 'filled' ? 'contrast' : undefined) ?? iconOptions?.color,
	}

	return (
		<Alert
			className={cn(
				'markdown-root min-w-[320px] lg:min-w-100 xl:min-w-150',
				variant === 'filled' && 'contrast',
			)}
			variant={variant}
			severity={severity}
			title={titleContent}
			icon={icon ?? (isProgress ? 'spinner' : undefined)}
			iconOptions={mergedIconOptions}
			onClose={disableClose ? undefined : onClose}
		>
			{messageContent}
			{progressValue !== undefined && (
				<div className="mt-2">
					<Progress
						value={progressValue}
						className={cn(
							'h-1.5 rounded-full',
							variant === 'filled' &&
								'bg-background/20 *:data-[slot="progress-indicator"]:bg-background',
						)}
					/>
					{!disableProgressCaption && (
						<TS
							variant="caption"
							content={`${Math.round(progressValue)}%`}
							className={cn(
								'block mt-1',
								variant === 'filled' ? 'text-background' : 'text-primary',
							)}
						/>
					)}
				</div>
			)}
		</Alert>
	)
}
