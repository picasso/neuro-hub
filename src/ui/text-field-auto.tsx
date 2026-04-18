'use client'

import {
	type Ref,
	useCallback,
	useState,
	type KeyboardEvent,
	useRef,
	type ChangeEvent,
	type FocusEvent,
} from 'react'
import { TextField, type TextFieldProps } from './text-field'
import { cn, cyrilicValidator } from '@/utils'

type InputVariantProps = Extract<TextFieldProps, { multiline?: false }>

type BaseProps = {
	value?: string | null
	onSave: (value?: string | null) => void
	onlyLatin?: boolean
	limit?: number
	notEmpty?: boolean
	enableOnFocus?: boolean
}
export type TextFieldAutoProps = BaseProps &
	Omit<InputVariantProps, 'endIconDisabled' | 'onEndClick' | 'onClearClick' | 'error'> & {
		multiline?: false
		ref?: Ref<HTMLInputElement>
	}

export function TextFieldAuto({
	ref,
	value,
	helper,
	onSave,
	onlyLatin,
	limit,
	notEmpty,
	showClear,
	endIconInline,
	enableOnFocus,
	className,
	...props
}: TextFieldAutoProps) {
	const [proxyValue, setProxyValue] = useState(value)
	const [enableActions, setEnableActions] = useState(false)
	const isDirty = proxyValue !== value
	const interactive = enableOnFocus && endIconInline

	const error =
		notEmpty && proxyValue === ''
			? 'Не должно быть пустым'
			: cyrilicValidator(proxyValue, null, limit, !!onlyLatin)

	const onSaveProxy = useCallback(() => {
		debugEvents('save')
		if (isDirty && !error) onSave(proxyValue)
	}, [error, isDirty, onSave, proxyValue])

	const onCancel = useCallback(() => {
		debugEvents('cancel')
		if (isDirty) setProxyValue(value)
	}, [isDirty, value])

	const onChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
		debugEvents('change')
		setProxyValue(ev.target.value)
	}, [])

	const onKeyDown = useCallback(
		(ev: KeyboardEvent<HTMLInputElement>) => {
			if (ev.key === 'Enter') {
				onSaveProxy()
			} else if (ev.key === 'Escape') {
				onCancel()
			}
		},
		[onCancel, onSaveProxy],
	)

	const onBlur = useCallback(
		(ev: FocusEvent<HTMLInputElement>) => {
			debugEvents('blur')
			// give browser time to focus the next element
			requestAnimationFrame(() => {
				// check if the new focused element is not an action button of the original container
				if (!ev.relatedTarget?.getAttribute('data-action')) {
					setEnableActions(false)
					onSaveProxy()
				} else {
					debugEvents('ignore')
				}
			})
		},
		[onSaveProxy],
	)

	const onFocus = useCallback(() => {
		setEnableActions(true)
	}, [])

	// button actions -----------------------------------------------------------------------------]

	const inputRef = useRef<HTMLInputElement>(null)

	const focus = useCallback(() => {
		inputRef?.current?.focus()
	}, [])

	const onActionCancel = useCallback(() => {
		onCancel()
		requestAnimationFrame(() => focus())
	}, [onCancel, focus])

	const onActionSave = useCallback(() => {
		onSaveProxy()
		requestAnimationFrame(() => focus())
	}, [onSaveProxy, focus])

	const isDisabled = !isDirty

	return (
		<TextField
			ref={ref ?? inputRef}
			error={error}
			helper={helper}
			value={proxyValue}
			onChange={onChange}
			onBlur={onBlur}
			onFocus={onFocus}
			onKeyDown={onKeyDown}
			onEndClick={onActionSave}
			onClearClick={onActionCancel}
			showClear={showClear}
			clearIconDisabled={isDisabled}
			endIcon="check"
			endIconInline={endIconInline}
			endIconDisabled={isDisabled}
			className={cn(
				'transition-opacity duration-100',
				interactive && enableActions && '**:data-[action=true]:opacity-100',
				interactive && enableActions && isDisabled && '**:data-[action=true]:opacity-50',
				interactive && !enableActions && '**:data-[action=true]:opacity-0',
				className,
			)}
			{...props}
		/>
	)
}

function debugEvents(ev: 'blur' | 'change' | 'save' | 'cancel' | 'ignore') {
	const color = eventColors[ev]
	dev.info(`{${color}${ev}}`)
}

const eventColors: Record<Parameters<typeof debugEvents>[0], string> = {
	blur: '#',
	change: '+',
	save: '*',
	cancel: '?',
	ignore: '!',
}
