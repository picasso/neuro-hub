import { isFunction, join, keys, replace } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone, type Accept, type FileError, type FileRejection } from 'react-dropzone'
import { Empty, type EmptyProps } from './empty'
import { type IconOptions, type IconName } from './icon'
import { Stack } from './stack'
import { TextField } from './text-field'
import { TS } from './text-styled'
import { cn, fileSize, sprintf } from '@/utils'

type UploaderVariant = 'primary' | 'secondary' | 'ghost'

export type FileUploaderProps = {
	value: File | null
	onChange: (file: File | null) => void
	disabled?: boolean
	accept?: Accept
	maxSizeBytes?: number
	helper?: string
	dropOnly?: boolean
	placeholder?: string
	title?: string
	icon?: IconName | false
	iconOptions?: IconOptions
	mediaIcon?: boolean
	compact?: boolean
	outline?: boolean
	fullWidth?: boolean
	align?: EmptyProps['align']
	variant?: UploaderVariant
	className?: string
	wrapperClassName?: string
}

export function FileUploader({
	value,
	onChange,
	disabled = false,
	accept,
	maxSizeBytes,
	helper,
	dropOnly,
	placeholder,
	title,
	icon: icon = 'collections-bookmark',
	iconOptions,
	mediaIcon,
	compact,
	outline,
	fullWidth,
	align = 'start',
	variant = 'primary',
	className,
	wrapperClassName,
}: FileUploaderProps) {
	const [inputKey, setInputKey] = useState(0)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const setFileValue = useCallback(
		(file: File | null) => {
			if (isFunction(onChange)) onChange(file)
		},
		[onChange],
	)

	const onUpdate = useCallback(
		(file: File | null) => {
			dev.data({ onUpdate: file })
			setErrorMessage(null)
			setFileValue(file)
		},
		[setFileValue],
	)

	useEffect(() => {
		setErrorMessage(null)
		if (!value) setInputKey((k) => k + 1)
	}, [value])

	const onDropAccepted = useCallback((files: File[]) => onUpdate(files[0] ?? null), [onUpdate])
	const onDropRejected = useCallback(
		(rejections: FileRejection[]) => {
			const rejection = rejections[0]
			const error = rejection?.errors?.[0]
			if (!rejection || !error) {
				setErrorMessage(null)
			} else {
				setErrorMessage(
					buildErrorMessage(error, {
						file: rejection.file,
						maxSize: maxSizeBytes,
						accept: accept ? join(keys(accept), ', ') : null,
					}),
				)
			}
		},
		[accept, maxSizeBytes],
	)

	const { getRootProps, getInputProps, inputRef, isDragActive, isDragReject } = useDropzone({
		accept,
		disabled,
		maxFiles: 1,
		maxSize: maxSizeBytes,
		multiple: false,
		onDropAccepted,
		onDropRejected,
		noClick: true,
		noKeyboard: true,
	})

	const openFileDialog = useCallback(() => {
		if (disabled) return
		inputRef.current?.click()
	}, [disabled, inputRef])

	return (
		<div
			{...getRootProps()}
			className={cn(fullWidth ? 'flex-1 w-full' : 'w-fit', wrapperClassName)}
		>
			<Empty
				mediaIcon={mediaIcon}
				outline={outline}
				fullWidth={fullWidth}
				compact={compact}
				align={align}
				title={title}
				icon={icon === false ? undefined : icon}
				iconOptions={{
					color: isDragActive ? 'contrast' : (iconOptions?.color ?? iconColors[variant]),
					size: iconOptions?.size ?? 'lg',
					spinning: iconOptions?.spinning,
					tw: iconOptions?.tw,
				}}
				disabled={disabled}
				error={!!errorMessage}
				helper={helper}
				data-drag={isDragActive || undefined}
				data-reject={isDragReject || undefined}
				className={cn(
					'rounded p-4 select-none transition-colors',
					variants[variant],
					// dragging indicator styles
					'data-drag:border-primary-dark data-drag:bg-primary-light data-drag:text-primary-foreground',
					'data-reject:border-destructive data-reject:bg-destructive/60',
					'data-drag:**:data-[input=control]:placeholder:text-white/70 data-reject:**:data-[input=control]:placeholder:text-white/70',
					'data-drag:**:data-[input=wrapper]:text-white/70 data-drag:**:data-[input=wrapper]:border-white/30',
					'data-reject:**:data-[input=wrapper]:text-white/70 data-reject:**:data-[input=wrapper]:border-white/40',
					'data-drag:**:data-[slot=helper]:text-white/50 data-reject:**:data-[slot=helper]:text-white/50',
					'data-drag:**:data-[clear=true]:[&_svg]:text-white/50 data-reject:**:data-[clear=true]:[&_svg]:text-white/50',
					disabled ? 'cursor-not-allowed' : 'cursor-default',
					className,
				)}
				mediaClassName={cn('m-0 rounded-full', mediaIcon && mediaBg[variant])}
				helperClassName={cn(helperVariants[variant], fullWidth ? 'max-w-full' : 'max-w-sm')}
			>
				<input key={inputKey} {...getInputProps()} />
				<Stack
					vertical
					gap={0.5}
					align={align === 'start' ? 'flex-start' : 'center'}
					className={cn(fullWidth ? 'max-w-full' : 'w-full')}
				>
					<TS
						variant="subtitle"
						className="pb-2 w-full truncate"
						content={
							isDragActive
								? 'Отпустите файл, чтобы выбрать его'
								: 'Перетащите файл сюда' +
									(dropOnly ? '' : ' или кликните для выбора ниже')
						}
						data-slot="dragging"
					/>
					{dropOnly ? null : (
						<TextField
							showClear
							readOnly
							disabled={disabled}
							value={value?.name ?? ''}
							placeholder={placeholder}
							onClick={openFileDialog}
							onClearClick={() => onUpdate(null)}
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault()
									openFileDialog()
								}
							}}
							onChange={() => {}}
							error={!!errorMessage}
							className={cn(
								'cursor-pointer select-none',
								'data-[disabled=true]:cursor-not-allowed',
								'*:data-[input=wrapper]:caret-transparent',
							)}
						/>
					)}
					{value ? (
						<Stack
							gap={1}
							className={cn('mt-0.5', fullWidth ? 'max-w-full' : 'w-full')}
							justify={align === 'start' ? 'flex-start' : 'center'}
						>
							<TS
								inline
								nowrap
								variant="caption"
								content="Выбран файл: "
								color={isDragActive ? 'contrast' : 'dimmed'}
							/>
							<TS
								variant="caption"
								content={value.name}
								color={isDragActive ? 'contrast' : 'secondary'}
								className="truncate"
							/>
							<TS
								inline
								nowrap
								variant="caption"
								content={`(${fileSize(value.size)})`}
								color={isDragActive ? 'contrast' : 'primary'}
							/>
						</Stack>
					) : null}
					{errorMessage ? (
						<TS
							variant="caption"
							className="block text-destructive"
							content={errorMessage}
						/>
					) : null}
				</Stack>
			</Empty>
		</div>
	)
}

const errors = {
	'file-too-large': 'Файл слишком большой: **%s**.%s',
	'file-maximum': ' Допустимый размер: **%s**.',
	'file-invalid-type': 'Недопустимый тип файла: **%s**.%s',
	'file-allowed': ' Разрешены только: **%s**.',
	'too-many-files': 'Можно выбрать только один файл.',
	default: 'Не удалось выбрать файл.',
} as const

function buildErrorMessage(
	error: FileError,
	{ file, maxSize, accept }: { file: File; maxSize?: number; accept: string | null },
): string {
	const message = errors[error.code as keyof typeof errors] ?? errors.default
	if (error.code === 'file-too-large') {
		const limit = maxSize ? sprintf(errors['file-maximum'], fileSize(maxSize, 0)) : ''
		return sprintf(message, fileSize(file.size), limit)
	} else if (error.code === 'file-invalid-type') {
		const allowed = accept ? sprintf(errors['file-allowed'], replace(accept, /\*/g, '✳︎')) : ''
		return sprintf(message, file.type, allowed)
	}
	return message
}

const variants: Record<UploaderVariant, EmptyProps['className']> = {
	primary: cn(
		'border-primary-light bg-primary-fond',
		'**:data-[input=wrapper]:text-primary-dark **:data-[input=wrapper]:border-primary/30',
		'**:data-[input=control]:placeholder:text-primary-dark/50',
		'**:data-[clear=true]:[&_svg]:text-primary-dark/70 **:data-[clear=true]:hover:bg-primary/10',
	),
	secondary: cn(
		'border-foreground/20 bg-secondary',
		'**:data-[input=wrapper]:text-muted-foreground **:data-[input=wrapper]:border-foreground/10',
		'**:data-[input=control]:placeholder:text-foreground/40',
		'**:data-[clear=true]:[&_svg]:text-foreground/40 **:data-[clear=true]:hover:bg-foreground/5',
	),
	ghost: cn(
		'border-border',
		'**:data-[input=wrapper]:text-muted-foreground **:data-[input=wrapper]:border-border',
		'**:data-[input=control]:placeholder:text-foreground/40',
		'**:data-[clear=true]:[&_svg]:text-foreground/40 **:data-[clear=true]:hover:bg-foreground/5',
	),
}

const helperVariants: Record<UploaderVariant, EmptyProps['helperClassName']> = {
	primary: 'text-primary-dark/50',
	secondary: 'text-foreground/50',
	ghost: 'text-dimmed',
}

const iconColors: Record<UploaderVariant, IconOptions['color']> = {
	primary: 'primary',
	secondary: 'secondary',
	ghost: 'dimmed',
}

const mediaBg: Record<UploaderVariant, IconOptions['tw']> = {
	primary: 'bg-primary-light/10',
	secondary: 'bg-foreground/5',
	ghost: 'bg-dimmed/10',
}
