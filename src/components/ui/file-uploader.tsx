'use client'

import InputAdornment from '@mui/material/InputAdornment'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { alpha, darken, lighten } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import { isFunction, join, keys, replace } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone, type Accept, type FileError, type FileRejection } from 'react-dropzone'
import { Icon, type IconName } from './icon'
import { IconButton } from './icon-button'
import { TS } from './text-styled'
import { fileSize, sprintf } from '@/utils'

export type FileUploaderProps = {
	value: File | null
	onChangeAction: (file: File | null) => void
	disabled?: boolean
	accept?: Accept
	maxSizeBytes?: number
	helperText?: string
	dropOnly?: boolean
	placeholder?: string
	title?: string
	titleIcon?: IconName | false
}

export function FileUploader({
	value,
	onChangeAction,
	disabled = false,
	accept,
	maxSizeBytes,
	helperText,
	dropOnly,
	placeholder = 'Выберите файл',
	title = 'Медиафайл',
	titleIcon = 'collections-bookmark',
}: FileUploaderProps) {
	const [inputKey, setInputKey] = useState(0)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [acceptLabel] = useState<string | null>(() => (accept ? join(keys(accept), ', ') : null))

	const setFileValue = useCallback(
		(file: File | null) => {
			if (isFunction(onChangeAction)) onChangeAction(file)
		},
		[onChangeAction],
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
						accept: acceptLabel,
					}),
				)
			}
		},
		[acceptLabel, maxSizeBytes],
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
		<Stack spacing={1.5}>
			<Paper
				variant="outlined"
				{...getRootProps()}
				sx={{
					p: 2,
					borderStyle: 'dashed',
					borderRadius: 1,
					borderColor: isDragReject
						? 'error.light'
						: isDragActive
							? 'primary.dark'
							: 'primary.light',
					bgcolor: (theme) =>
						isDragReject
							? lighten(theme.palette.error.light, 0.4)
							: isDragActive
								? 'primary.light'
								: 'background.block',
					color: isDragActive ? 'contrast.main' : undefined,
					cursor: disabled ? 'not-allowed' : 'default',
					userSelect: 'none',
				}}
			>
				<input key={inputKey} {...getInputProps()} />
				<Stack direction="row" alignItems="center" gap={1} sx={{ mb: 3 }}>
					{titleIcon ? (
						<Icon
							name={titleIcon}
							size="md"
							color={isDragActive ? 'contrast' : 'primary'}
						/>
					) : null}
					{title ? (
						<TS
							strong
							variant="body"
							content={title}
							color={isDragActive ? 'contrast' : 'primary'}
						/>
					) : null}
				</Stack>
				<Stack gap={0.5}>
					<TS
						variant="subtitle"
						className="pb-2"
						content={
							isDragActive
								? 'Отпустите файл, чтобы выбрать его'
								: 'Перетащите файл сюда или воспользуйтесь полем ввода ниже'
						}
					/>
					{dropOnly ? null : (
						<TextField
							size="small"
							disabled={disabled}
							value={value?.name ?? ''}
							placeholder={placeholder}
							onClick={openFileDialog}
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault()
									openFileDialog()
								}
							}}
							error={!!errorMessage}
							slotProps={{
								htmlInput: {
									accept: acceptLabel ?? undefined,
									readOnly: true,
								},
								input: {
									readOnly: true,
									endAdornment:
										!disabled && value ? (
											<InputAdornment position="end">
												<IconButton
													rounded
													icon="close"
													variant="ghost"
													title="Очистить файл"
													aria-label="Очистить файл"
													size="sm"
													forceSize="xs"
													onClick={(e) => {
														e.preventDefault()
														e.stopPropagation()
														onUpdate(null)
													}}
													className="hover:bg-primary/10 mr-[-8]"
													iconClassName="text-primary-dark"
												/>
											</InputAdornment>
										) : undefined,
								},
							}}
							sx={({ palette }) => ({
								borderRadius: 2,
								'& .MuiInputBase-root': {
									backgroundColor: alpha(
										isDragReject
											? palette.error.dark
											: isDragActive
												? lighten(palette.primary.light, 1)
												: palette.primary.light,
										0.15,
									),
									color: isDragReject
										? palette.contrast.main
										: isDragActive
											? palette.contrast.main
											: darken(palette.primary.dark, 0.2),
								},
								'& .MuiInputBase-input': {
									cursor: disabled ? 'not-allowed' : 'pointer',
									caretColor: 'transparent',
									userSelect: 'none',
								},
								'& .MuiInputBase-root .MuiOutlinedInput-notchedOutline': {
									borderColor: alpha(
										isDragReject ? palette.error.light : palette.primary.light,
										0.3,
									),
								},
								'&:hover .MuiInputBase-root .MuiOutlinedInput-notchedOutline': {
									borderColor: alpha(palette.primary.light, 0.7),
								},
								// error styles
								'& .MuiInputBase-root.Mui-error': {
									backgroundColor: lighten(palette.error.dark, 0.9),
									color: palette.error.dark,
								},
								'& .Mui-error .MuiOutlinedInput-notchedOutline': {
									borderColor: alpha(palette.error.dark, 0.5),
								},
								// clear icon button styles
								'& .MuiInputAdornment-positionEnd .MuiSvgIcon-root': {
									color: isDragReject
										? palette.error.dark
										: isDragActive
											? alpha(palette.contrast.main, 0.5)
											: palette.primary.dark,
								},
								'& .Mui-error .MuiInputAdornment-positionEnd .MuiSvgIcon-root': {
									color: palette.error.dark,
								},
							})}
						/>
					)}
					{value ? (
						<Stack direction="row" alignItems="center" gap={1}>
							<TS
								variant="caption"
								content="Выбран файл: "
								color={isDragActive ? 'contrast' : 'secondary'}
								inline
								className="opacity-60"
							/>
							<TS
								variant="caption"
								content={value.name}
								color={isDragActive ? 'contrast' : 'secondary'}
								inline
							/>
							<TS
								variant="caption"
								content={`(${fileSize(value.size)})`}
								color={isDragActive ? 'contrast' : 'primary'}
								inline
								className="opacity-80"
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
					{helperText ? (
						<TS
							variant="caption"
							content={helperText}
							color={isDragActive ? 'contrast' : 'primary'}
							className="block pt-4 opacity-70"
						/>
					) : null}
				</Stack>
			</Paper>
		</Stack>
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
