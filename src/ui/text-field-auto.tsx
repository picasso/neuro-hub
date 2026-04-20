'use client'

import {
	useCallback,
	useState,
	type KeyboardEvent,
	useRef,
	type ChangeEvent,
	type FocusEvent,
	useEffect,
} from 'react'
import { useClickOutside } from './hooks/use-click-outside'
import { InputField, type TextFieldProps } from './text-field'
import { variantToText, type TextStyledProps } from './text-styled'
import { cn, cyrilicValidator } from '@/utils'

type InputVariantProps = Extract<TextFieldProps, { multiline?: false }>

type InputValue = InputVariantProps['value']
type BaseProps = {
	value?: InputValue
	variant?: TextStyledProps['variant']
	onSave: (value?: InputValue) => void
	onChange?: (value?: InputValue) => void
	onCancel?: () => void
	onlyLatin?: boolean
	minimum?: number | null
	limit?: number | null
	notEmpty?: boolean
	enableOnFocus?: boolean
	cancelable?: boolean
}
export type TextFieldAutoProps = BaseProps &
	Omit<
		InputVariantProps,
		'endIconDisabled' | 'onEndClick' | 'onClearClick' | 'ref' | 'value' | 'onChange'
	>

export function TextFieldAuto({
	value,
	variant = 'body',
	helper,
	onSave,
	onCancel,
	onChange,
	error: errorEx,
	cancelable,
	onlyLatin,
	minimum = null,
	limit = null,
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
	const error = errorEx ?? validate({ value: proxyValue, notEmpty, minimum, limit, onlyLatin })

	// cancel editing on click outside
	const rootRef = useRef<HTMLDivElement>(null)
	const onRootClickOutside = useCallback(() => {
		debugEvents('outside')
		if (cancelable) onCancel?.()
	}, [cancelable, onCancel])
	useClickOutside(rootRef, onRootClickOutside, { enabled: !!cancelable })

	// input element
	const inputRef = useRef<HTMLInputElement>(null)
	const pointerInsideRootRef = useRef(false)

	useEffect(() => {
		const onPointerDownCapture = (e: PointerEvent) => {
			const root = rootRef.current
			const t = e.target
			if (!root || !(t instanceof Node)) {
				pointerInsideRootRef.current = false
				return
			}
			pointerInsideRootRef.current = root.contains(t)
		}
		document.addEventListener('pointerdown', onPointerDownCapture, true)
		return () => document.removeEventListener('pointerdown', onPointerDownCapture, true)
	}, [])

	// focus the input element on mount
	useEffect(() => {
		requestAnimationFrame(() => {
			inputRef.current?.focus()
		})
	}, [])

	// button actions -----------------------------------------------------------------------------]

	const focus = useCallback(() => {
		inputRef.current?.focus()
	}, [])

	const onCancelProxy = useCallback(() => {
		debugEvents('cancel')
		if (isDirty) setProxyValue(value)
		onCancel?.()
	}, [isDirty, value, onCancel])

	const onChangeProxy = useCallback(
		(ev: ChangeEvent<HTMLInputElement>) => {
			debugEvents('change')
			const value = ev.target.value
			setProxyValue(value)
			onChange?.(value)
		},
		[onChange],
	)

	const onSaveProxy = useCallback(() => {
		debugEvents('save')
		if (isDirty && !error) onSave(proxyValue)
		if (cancelable) onCancelProxy()
	}, [error, isDirty, onSave, proxyValue, cancelable, onCancelProxy])

	const onKeyDown = useCallback(
		(ev: KeyboardEvent<HTMLInputElement>) => {
			if (ev.key === 'Enter') {
				onSaveProxy()
			} else if (ev.key === 'Escape') {
				onCancelProxy()
			}
		},
		[onCancelProxy, onSaveProxy],
	)

	const onBlur = useCallback(
		(ev: FocusEvent<HTMLInputElement>) => {
			debugEvents('blur')
			const root = rootRef.current
			const rel = ev.relatedTarget
			const isNode = (node: EventTarget | null): node is Node => node instanceof Node
			const isInside = (node: EventTarget | null) => isNode(node) && root?.contains(node)

			if (isInside(rel)) {
				focus()
				debugEvents('ignore')
				pointerInsideRootRef.current = false
				return
			}

			// give browser time to focus the next element
			requestAnimationFrame(() => {
				// sometimes the focus is not immediate, so we need to check again
				requestAnimationFrame(() => {
					const inside = isInside(document.activeElement) || pointerInsideRootRef.current
					pointerInsideRootRef.current = false
					if (inside) {
						focus()
						debugEvents('ignore')
					} else {
						setEnableActions(false)
						onSaveProxy()
					}
					// check if the new focused element is not an action button of the original container
					// if (rootRef.current?.contains(ev.relatedTarget ?? document.activeElement)) {
					// 	focus()
					// 	debugEvents('ignore')
					// } else {
					// 	dev.data({
					// 		relatedTarget: ev.relatedTarget,
					// 		activeElement: document.activeElement,
					// 	})
					// 	// if (!ev.relatedTarget?.getAttribute('data-action')) {
					// 	setEnableActions(false)
					// 	onSaveProxy()
					// }
					// else {
					// 	debugEvents('ignore')
					// }
				})
			})
		},
		[focus, onSaveProxy],
	)

	const onFocus = useCallback(() => {
		setEnableActions(true)
	}, [])

	const onActionCancel = useCallback(() => {
		onCancelProxy()
		requestAnimationFrame(() => focus())
	}, [onCancelProxy, focus])

	const onActionSave = useCallback(() => {
		onSaveProxy()
		requestAnimationFrame(() => focus())
	}, [onSaveProxy, focus])

	const isDisabled = !isDirty

	return (
		<InputField
			ref={inputRef}
			rootRef={rootRef}
			error={error}
			helper={helper}
			value={proxyValue}
			onChange={onChangeProxy}
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
			inputClassName={cn(
				variantToText[variant],
				'[field-sizing:content] min-w-[3ch]',
				// inputClassName,
			)}
			{...props}
		/>
	)
}

function debugEvents(ev: 'blur' | 'change' | 'save' | 'cancel' | 'ignore' | 'outside') {
	const color = eventColors[ev]
	dev.info(`{${color}${ev}}`)
}

const eventColors: Record<Parameters<typeof debugEvents>[0], string> = {
	blur: '#',
	change: '+',
	save: '*',
	cancel: '?',
	ignore: '!',
	outside: '$',
}

function validate({
	value,
	notEmpty,
	minimum,
	limit,
	onlyLatin,
}: {
	value: BaseProps['value']
	notEmpty: BaseProps['notEmpty']
	minimum: BaseProps['minimum']
	limit: BaseProps['limit']
	onlyLatin: BaseProps['onlyLatin']
}) {
	return notEmpty && value === ''
		? 'Не должно быть пустым'
		: cyrilicValidator(value ? String(value) : null, minimum, limit, !!onlyLatin)
}
