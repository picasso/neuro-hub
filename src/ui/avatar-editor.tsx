'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import ReactAvatarEditor, { type AvatarEditorRef } from 'react-avatar-editor'
import { Button } from './button'
import { Dialog } from './dialog'
import { FileUploader, type FileUploaderProps } from './file-uploader'
import { IconButton } from './icon-button'
import { Slider } from './shadcn/slider'
import { Stack } from './stack'
import { createAlert } from '@/alerts'
import { cn } from '@/utils'

export type AvatarEditorResult = {
	blob: Blob
	file: File
}

export type AvatarEditorMimeType = 'image/jpeg' | 'image/png' | 'image/webp'

export type AvatarEditorProps = Pick<
	FileUploaderProps,
	'accept' | 'maxSizeBytes' | 'disabled' | 'variant' | 'outline'
> & {
	onCompleted: (result: AvatarEditorResult) => void
	className?: string
	wrapperClassName?: string
	name?: string
	src?: string | null
	loading?: boolean
	completed?: boolean
	cropSize?: number
	outputMimeType?: AvatarEditorMimeType
	outputQuality?: number
}

const defaults = {
	accept: { 'image/*': [] },
	maxSize: 10 * 1024 * 1024,
	cropSize: 280,
	outputMimeType: 'image/jpeg' as AvatarEditorMimeType,
	outputQuality: 0.92,
}

export function AvatarEditor({
	onCompleted,
	disabled,
	variant,
	outline,
	className,
	wrapperClassName,
	name,
	src,
	loading,
	completed,
	accept = defaults.accept,
	maxSizeBytes = defaults.maxSize,
	cropSize = defaults.cropSize,
	outputMimeType = defaults.outputMimeType,
	outputQuality = defaults.outputQuality,
}: AvatarEditorProps) {
	const editorRef = useRef<AvatarEditorRef>(null)
	const [uploaderKey, setUploaderKey] = useState(0)
	const [scale, setScale] = useState(1.2)
	const [rotate, setRotate] = useState(0)
	const [cropFile, setCropFile] = useState<File | null>(null)
	const [dialogOpen, setDialogOpen] = useState(false)
	const [previewSrc, setPreviewSrc] = useState<string | null>(null)
	const [isSaving, setIsSaving] = useState(false)
	// after upload: true until the remote `src` has loaded and blob preview is cleared
	const [isRemoteImagePending, setIsRemoteImagePending] = useState(false)

	const safeCropSize = Number.isFinite(cropSize) && cropSize > 0 ? cropSize : defaults.cropSize

	// do not clear blob preview on `completed` — that caused a flash before the remote <img> loaded.
	// preload the network `src` first, then clear preview in the onload path
	useEffect(() => {
		if (!completed || !src || !previewSrc) {
			setIsRemoteImagePending(false)
			return
		}

		setIsRemoteImagePending(true)
		// preload the network `src` to avoid flash before the remote <img> loaded
		const img = new Image()
		let cancelled = false
		const finish = () => {
			if (cancelled) return
			cancelled = true
			setIsRemoteImagePending(false)
			setPreviewSrc((prev) => {
				if (prev) URL.revokeObjectURL(prev)
				return null
			})
		}
		img.onload = finish
		img.onerror = finish
		img.src = src

		return () => {
			cancelled = true
		}
	}, [completed, src, previewSrc])

	useEffect(() => {
		if (!cropFile) return
		setScale(1.2)
		setRotate(0)
	}, [cropFile])

	useEffect(() => {
		return () => {
			if (previewSrc) URL.revokeObjectURL(previewSrc)
		}
	}, [previewSrc])

	const resetFlow = useCallback(() => {
		setCropFile(null)
		setDialogOpen(false)
		setIsSaving(false)
		setUploaderKey((k) => k + 1)
	}, [])

	const onPickFile = useCallback(
		(file: File | null) => {
			if (!file || disabled) return
			setCropFile(file)
			setDialogOpen(true)
			setUploaderKey((k) => k + 1)
		},
		[disabled],
	)

	const onDialogClose = useCallback(() => {
		if (isSaving) return
		resetFlow()
	}, [isSaving, resetFlow])

	const onConfirm = useCallback(() => {
		const editor = editorRef.current
		if (!editor || isSaving) return
		setIsSaving(true)
		const canvas = editor.getImageScaledToCanvas()
		canvas.toBlob(
			(blob) => {
				if (!blob) {
					createAlert({
						severity: 'error',
						title: 'Не удалось подготовить изображение',
						message: 'Попробуйте выбрать другое изображение или повторить попытку.',
					})
					setIsSaving(false)
					return
				}
				const ext = extension[outputMimeType]
				const file = new File([blob], `avatar.${ext}`, { type: outputMimeType })
				setPreviewSrc((prev) => {
					if (prev) URL.revokeObjectURL(prev)
					return URL.createObjectURL(blob)
				})
				onCompleted({ blob, file })
				resetFlow()
			},
			outputMimeType,
			outputQuality,
		)
	}, [isSaving, onCompleted, outputMimeType, outputQuality, resetFlow])

	const onRotateLeft = useCallback(() => {
		setRotate((r) => r - 90)
	}, [])

	const onRotateRight = useCallback(() => {
		setRotate((r) => r + 90)
	}, [])

	const displaySrc = completed ? (previewSrc ?? src ?? null) : (previewSrc ?? null)
	const isLoading = Boolean(loading) || isSaving || isRemoteImagePending

	return (
		<Stack vertical gap={2} align="center" className={cn('inline-flex', className)}>
			<FileUploader
				key={uploaderKey}
				value={null}
				onChange={onPickFile}
				disabled={disabled}
				accept={accept}
				maxSizeBytes={maxSizeBytes}
				variant={variant ?? 'secondary'}
				outline={outline}
				wrapperClassName={wrapperClassName}
				avatar={name ?? 'icon'}
				avatarSrc={displaySrc}
				completed={completed}
				loading={isLoading}
			/>
			<Dialog
				closeOnDark
				open={dialogOpen}
				onClose={onDialogClose}
				size="md"
				className="w-82 border-muted-foreground"
				footer={
					<Stack justify="flex-end" className="w-full">
						<Button
							variant="outline"
							size="sm"
							label="Отмена"
							disabled={isSaving}
							onClick={onDialogClose}
						/>
						<Button
							size="sm"
							disabled={isSaving}
							label={isSaving ? 'Обработка...' : 'Ok'}
							leftIcon={isSaving ? 'spinner' : undefined}
							iconOptions={{ spinning: isSaving }}
							onClick={onConfirm}
						/>
					</Stack>
				}
			>
				{cropFile && (
					<Stack vertical className="-mt-10 -mx-5">
						<ReactAvatarEditor
							ref={editorRef}
							image={cropFile}
							width={safeCropSize}
							height={safeCropSize}
							border={24}
							borderRadius={safeCropSize / 2}
							color={[0, 0, 0, 0.45]}
							scale={scale}
							rotate={rotate}
						/>
						<Stack className="w-full px-4">
							<Slider
								tint="accent"
								min={1}
								max={3}
								step={0.01}
								value={[scale]}
								onValueChange={(v) => setScale(v[0] ?? 1)}
								aria-label="Масштаб изображения"
								className="mr-2"
							/>
							<IconButton
								size="md"
								variant="outline"
								icon="rotate-ccw"
								aria-label="Повернуть против часовой стрелки"
								onClick={onRotateLeft}
							/>
							<IconButton
								size="md"
								variant="outline"
								icon="rotate-cw"
								aria-label="Повернуть по часовой стрелке"
								onClick={onRotateRight}
							/>
						</Stack>
					</Stack>
				)}
			</Dialog>
		</Stack>
	)
}

const extension: Record<AvatarEditorMimeType, string> = {
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp',
}
