'use client'

'use client'

import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { alpha, darken, lighten } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import { isFunction, join, keys } from 'lodash'
import { useCallback, useEffect, useState, type ChangeEvent } from 'react'
import { useDropzone, type Accept, type FileError, type FileRejection } from 'react-dropzone'
import { Icon } from './icon'
import { TS } from './text-styled'
import { fileSize } from '@/utils'

export type FileUploaderProps = {
	value: File | null
	onChangeAction: (file: File | null) => void
	disabled?: boolean
	accept?: Accept
	maxSizeBytes?: number
	helperText?: string
	dropOnly?: boolean
}

function acceptLabelFrom(accept?: Accept) {
	return accept ? join(keys(accept), ', ') : null
}

function fileExtension(name: string) {
	const idx = name.lastIndexOf('.')
	if (idx === -1) return null
	return name.slice(idx).toLowerCase()
}

function isFileAccepted(file: File, accept?: Accept) {
	if (!accept) return true

	const ext = fileExtension(file.name)
	for (const [mime, exts] of Object.entries(accept)) {
		if (mime === file.type) return true

		if (mime.endsWith('/*')) {
			const prefix = mime.slice(0, -1) // keep trailing slash
			if (file.type.startsWith(prefix)) return true
		}

		if (ext && exts?.some((e) => e.toLowerCase() === ext)) return true
	}

	return false
}

function validatePickedFile(
	file: File,
	opts: { maxSizeBytes?: number; accept?: Accept },
): FileError | null {
	if (opts.maxSizeBytes && file.size > opts.maxSizeBytes) {
		return { code: 'file-too-large', message: 'file-too-large' }
	}
	if (opts.accept && !isFileAccepted(file, opts.accept)) {
		return { code: 'file-invalid-type', message: 'file-invalid-type' }
	}
	return null
}

function buildFileErrorMessage(
	error: FileError,
	ctx: { file: File; maxSizeBytes?: number; acceptLabel: string | null },
): string {
	switch (error.code) {
		case 'file-too-large': {
			const limit = ctx.maxSizeBytes ? ` Максимум: ${fileSize(ctx.maxSizeBytes)}.` : ''
			return `Файл слишком большой: ${fileSize(ctx.file.size)}.${limit}`
		}
		case 'file-invalid-type': {
			const allowed = ctx.acceptLabel ? ` Разрешены: ${ctx.acceptLabel}.` : ''
			return `Недопустимый тип файла.${allowed}`
		}
		case 'too-many-files':
			return 'Можно выбрать только один файл.'
		default:
			return error.message || 'Не удалось выбрать файл.'
	}
}

export function FileUploader({
	value,
	onChangeAction,
	disabled = false,
	accept,
	maxSizeBytes,
	helperText,
	dropOnly,
}: FileUploaderProps) {
	const [inputKey, setInputKey] = useState(0)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

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
				return
			}
			setErrorMessage(
				buildFileErrorMessage(error, {
					file: rejection.file,
					maxSizeBytes,
					acceptLabel: acceptLabelFrom(accept),
				}),
			)
		},
		[accept, maxSizeBytes],
	)

	// string for native input accept
	const htmlInput = accept ? { accept: join(keys(accept), ',') } : undefined

	const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
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

	const onPickFile = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const next = e.target.files?.[0] ?? null
			if (!next) {
				onUpdate(null)
				return
			}

			const validationError = validatePickedFile(next, { maxSizeBytes, accept })
			if (validationError) {
				setErrorMessage(
					buildFileErrorMessage(validationError, {
						file: next,
						maxSizeBytes,
						acceptLabel: acceptLabelFrom(accept),
					}),
				)
				setFileValue(null)
				setInputKey((k) => k + 1)
				return
			}

			onUpdate(next)
		},
		[accept, maxSizeBytes, onUpdate, setFileValue],
	)

	dev.log({ isDragReject, isDragActive })

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
							: // 'error.main'
								isDragActive
								? 'primary.light'
								: 'background.block',
					// ? alpha(theme.palette.primary.light, 0.35)
					// : alpha(theme.palette.primary.light, 0.12),
					color: isDragActive ? 'contrast.main' : undefined,
					cursor: disabled ? 'not-allowed' : 'default',
					userSelect: 'none',
				}}
			>
				<input key={inputKey} {...getInputProps()} />
				<Stack direction="row" alignItems="center" gap={1} sx={{ mb: 3 }}>
					<Icon
						name="collections-bookmark"
						fontSize="medium"
						color="inherit"
						sx={{ color: isDragActive ? 'common.white' : 'primary.main' }}
					/>
					<TS
						strong
						variant="body1"
						content="Портфолио"
						sx={{ color: isDragActive ? 'common.white' : 'primary.main' }}
					/>
				</Stack>
				<Stack gap={0.5}>
					<TS
						variant="subtitle2"
						content={
							isDragActive
								? 'Отпустите файл, чтобы выбрать его'
								: 'Перетащите файл сюда или воспользуйтесь полем ввода ниже'
						}
						sx={{ pb: 1 }}
					/>
					{dropOnly ? null : (
						<TextField
							key={inputKey}
							type="file"
							size="small"
							disabled={disabled}
							onChange={onPickFile}
							error={!!errorMessage}
							slotProps={{
								htmlInput,
							}}
							sx={({ palette }) => ({
								borderRadius: 2,
								'&::file-selector-button': {
									display: 'none',
								},
								'& .MuiInputBase-root': {
									backgroundColor: alpha(
										isDragReject ? palette.error.dark : palette.primary.light,
										0.15,
									),
									color: isDragReject
										? palette.contrast.main
										: darken(palette.primary.dark, 0.2),
								},
								'& .MuiOutlinedInput-notchedOutline.MuiOutlinedInput-notchedOutline':
									{
										borderColor: alpha(
											isDragReject
												? palette.error.light
												: palette.primary.light,
											0.3,
										),
									},
								'&:hover .MuiOutlinedInput-notchedOutline.MuiOutlinedInput-notchedOutline':
									{ borderColor: alpha(palette.primary.light, 0.5) },
								'& .MuiInputBase-root.Mui-error': {
									backgroundColor: lighten(palette.error.dark, 0.9),
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
								sx={{
									opacity: 0.6,
									color: isDragActive ? 'common.white' : 'text.secondary',
								}}
							/>
							<TS
								variant="caption"
								content={value.name}
								sx={{ color: isDragActive ? 'common.white' : 'text.secondary' }}
							/>
							<TS
								variant="caption"
								content={`(${fileSize(value.size)})`}
								sx={{
									opacity: 0.8,
									color: isDragActive ? 'common.white' : 'primary.dark',
								}}
							/>
						</Stack>
					) : null}
					{errorMessage ? (
						<TS
							variant="caption"
							color="error"
							content={errorMessage}
							sx={{ display: 'block' }}
						/>
					) : null}
					{helperText ? (
						<TS
							variant="caption"
							content={helperText}
							sx={{
								display: 'block',
								pt: 2,
								opacity: 0.7,
								color: isDragActive ? 'common.white' : 'primary.dark',
							}}
						/>
					) : null}
				</Stack>
			</Paper>
		</Stack>
	)
}
