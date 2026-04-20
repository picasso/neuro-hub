'use client'

import { useEffect, useState } from 'react'
import {
	Button,
	Icon,
	IconButton,
	type IconName,
	StackSpan,
	TS,
	TextField,
	TextFieldAuto,
	type TextFieldAutoProps,
	type TextStyledProps,
} from '@/ui'
import { cn, sprintf } from '@/utils'

type AutoOnChangeParams = Parameters<NonNullable<TextFieldAutoProps['onChange']>>[0]
type AutoOnSaveParams = Parameters<NonNullable<TextFieldAutoProps['onSave']>>[0]
type InlineValue = Exclude<TextFieldAutoProps['value'], number | readonly string[]>
type InlineEditProps = Omit<TextFieldAutoProps, 'value' | 'onSave' | 'onChange' | 'multiline'> & {
	value?: InlineValue
	onChange?: (value: InlineValue) => void
	onSave: (value: InlineValue) => void
	variant?: TextStyledProps['variant']
	color?: TextStyledProps['color']
	template?: string
	icon?: IconName
	loading?: boolean
	multiline?: boolean
	rows?: number
	className?: string
	contentClassName?: string
	contentIcon?: IconName
}

export function InlineEdit({
	value,
	placeholder,
	disabled,
	color,
	template,
	loading,
	multiline,
	rows = 4,
	variant = 'body',
	icon = 'pencil',
	className,
	contentClassName,
	contentIcon,
	onSave,
	onChange,
	...props
}: InlineEditProps) {
	const [isEditing, setIsEditing] = useState(false)
	const [draftValue, setDraftValue] = useState(value)
	const [proxyLoading, setProxyLoading] = useState(loading)

	// delay loading state change to avoid flickering (only from true to false)
	useEffect(() => {
		if (loading) {
			setProxyLoading(true)
			return
		}

		const timeoutId = window.setTimeout(() => {
			setProxyLoading(false)
		}, 800)

		return () => {
			window.clearTimeout(timeoutId)
		}
	}, [loading])

	function onStartEditing() {
		if (disabled) return
		setDraftValue(value)
		setIsEditing(true)
	}

	function onCancelEditing() {
		setDraftValue(value)
		setIsEditing(false)
	}

	function onSaveProxy(value: AutoOnSaveParams) {
		onSave(value as InlineValue)
		setIsEditing(false)
	}

	function onChangeProxy(value: AutoOnChangeParams) {
		onChange?.(value as InlineValue)
	}

	return (
		<StackSpan className={cn('min-w-0', multiline && 'w-full relative', className)}>
			{isEditing ? (
				<StackSpan vertical gap={2} align="stretch" className={cn(multiline && 'w-full')}>
					{multiline ? (
						<StackSpan vertical gap={2} align="end" className="w-full">
							<TextField
								multiline
								value={draftValue}
								placeholder={placeholder}
								rows={rows}
								disabled={disabled}
								className={cn('w-full', '')}
								onChange={(event) => setDraftValue(event.target.value)}
							/>
							<StackSpan wrap>
								<Button
									size="xs"
									label="Ok"
									disabled={disabled}
									onClick={() => onSaveProxy(draftValue)}
								/>
								<Button
									size="xs"
									variant="outline"
									label="Отмена"
									disabled={disabled}
									onClick={onCancelEditing}
								/>
							</StackSpan>
						</StackSpan>
					) : (
						<TextFieldAuto
							endIconInline
							cancelable
							showClear
							value={value}
							variant={variant}
							placeholder={placeholder}
							disabled={disabled}
							onSave={onSaveProxy}
							onChange={onChangeProxy}
							onCancel={onCancelEditing}
							{...props}
						/>
					)}
				</StackSpan>
			) : (
				<StackSpan vertical align="start" justify="start" gap={0}>
					<StackSpan gap={1} className={contentClassName} align="start">
						<StackSpan gap={1}>
							{contentIcon && (
								<Icon
									size={
										variant === 'subtitle' || variant === 'caption'
											? 'xs'
											: 'sm'
									}
									name={contentIcon}
								/>
							)}
							<TS
								clean
								variant={variant}
								color={color}
								className={cn('transition-opacity', proxyLoading && 'opacity-50')}
								content={template && value ? sprintf(template, value) : value}
							/>
						</StackSpan>
						<IconButton
							rounded
							size={variant === 'subtitle' || variant === 'caption' ? 'xs' : 'sm'}
							variant="ghost"
							disabled={proxyLoading}
							icon={proxyLoading ? 'spinner' : icon}
							spinning={proxyLoading}
							onClick={onStartEditing}
							className={cn(
								variant === 'caption' && '-mt-0.75',
								multiline && 'absolute -top-10 -right-2',
							)}
						/>
					</StackSpan>
				</StackSpan>
			)}
		</StackSpan>
	)
}
