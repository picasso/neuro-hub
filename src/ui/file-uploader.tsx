import { isFunction, join, keys, replace } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone, type Accept, type FileError, type FileRejection } from 'react-dropzone'
import { Avatar } from './avatar'
import { Empty, type EmptyProps } from './empty'
import { type IconOptions, type IconName, Icon } from './icon'
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
	avatar?: 'icon' | string
	avatarSrc?: string | null
	completed?: boolean
	loading?: boolean
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
	icon: icon = 'book-marked',
	iconOptions,
	mediaIcon,
	compact,
	outline,
	fullWidth,
	align = 'start',
	variant = 'primary',
	className,
	wrapperClassName,
	avatar,
	avatarSrc,
	completed,
	loading,
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
	})

	const openFileDialog = useCallback(() => {
		if (disabled) return
		inputRef.current?.click()
	}, [disabled, inputRef])

	return (
		<div
			{...getRootProps()}
			className={cn(
				'relative',
				fullWidth && !avatar ? 'flex-1 w-full' : 'w-fit',
				wrapperClassName,
			)}
		>
			{avatar && (
				<>
					<input key={inputKey} {...getInputProps()} />
					<Avatar
						name={avatar}
						src={avatarSrc}
						size="editor"
						color={null}
						fallbackClassName={cn(
							'ring-offset-background ring-2 ring-transparent ring-offset-2',
							avatarVariants[variant],
							outline && 'border border-dashed',
							// dragging indicator styles
							'data-drag:border-primary-dark data-drag:bg-primary-light data-drag:text-primary-foreground',
							'data-reject:border-destructive data-reject:bg-destructive/60',
							disabled ? 'cursor-not-allowed' : 'cursor-pointer',
						)}
						fallbackNode={
							avatar === 'icon' ? (
								<Icon name="camera" size={60} color="current" />
							) : undefined
						}
						isDrag={isDragActive || undefined}
						isReject={isDragReject || undefined}
						className={cn(
							'transition-opacity cursor-pointer',
							avatarSrc && !completed && 'opacity-50',
							className,
						)}
					/>
					{loading && (
						<div className="absolute inset-0 rounded-full border-3 border-transparent border-t-primary animate-spin" />
					)}
					{avatarSrc && (isDragActive || isDragReject) && (
						<div
							className={cn(
								'absolute inset-0 rounded-full opacity-50',
								isDragActive && 'bg-primary-light',
								isDragReject && 'bg-destructive/60',
							)}
						/>
					)}
					{avatarSrc && !(isDragActive || isDragReject) && (
						<Stack
							justify="center"
							className={cn(
								'cursor-pointer transition-opacity duration-500 opacity-0',
								'absolute inset-0 rounded-full bg-black/50',
								'hover:opacity-100',
							)}
						>
							<Icon name="camera" size={60} color="contrast" />
						</Stack>
					)}
				</>
			)}
			{!avatar && (
				<Empty
					mediaIcon={mediaIcon}
					outline={outline}
					fullWidth={fullWidth}
					compact={compact}
					align={align}
					title={title}
					icon={icon === false ? undefined : icon}
					iconOptions={{
						...iconOptions,
						color: isDragActive
							? 'contrast'
							: (iconOptions?.color ?? iconColors[variant]),
						size: iconOptions?.size ?? 'lg',
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
						disabled ? 'cursor-not-allowed' : 'cursor-pointer',
						className,
					)}
					mediaClassName={cn('m-0 rounded-full', mediaIcon && mediaBg[variant])}
					helperClassName={cn(
						helperVariants[variant],
						fullWidth ? 'max-w-full' : 'max-w-sm',
					)}
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
			)}
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

const avatarVariants: Record<UploaderVariant, string> = {
	primary: 'border-primary-light bg-primary-fond text-primary/80',
	secondary: 'border-foreground/20 bg-secondary text-foreground/80',
	ghost: 'border-border-dark bg-border text-muted-foreground/80',
}
