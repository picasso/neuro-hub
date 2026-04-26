'use client'
import { map } from 'lodash'
import { useState } from 'react'
import type { ProjectAttachmentSummary } from '@/lib/db/queries/projects'
import { Badge, IconButton, Stack, TS, type MediaItem, Tooltip, type BadgeProps } from '@/ui'
import { MediaViewer } from '@/ui/portfolio/media-viewer'
import { fileSize } from '@/utils'

type AttachmentsProps = {
	attachments?: ProjectAttachmentSummary[] | null
	size?: BadgeProps['size']
	variant?: BadgeProps['variant']
	className?: string
}

export function Attachments({ attachments, size, variant, className }: AttachmentsProps) {
	const [openIndex, setOpenIndex] = useState<number | null>(null)

	if (!attachments || attachments.length === 0) return null

	const viewerItems: MediaItem[] = map(attachments, (attachment) => ({
		id: attachment.id,
		title: attachment.filename,
		caption: attachment.fileSizeBytes ? fileSize(attachment.fileSizeBytes) : null,
		mediaUrl: attachment.fileUrl,
		mediaType: attachment.mimeType,
	}))

	const onPreview = (index: number) => {
		setOpenIndex(index)
	}

	return (
		<>
			<Stack vertical gap={2} align="stretch" className={className}>
				{map(attachments, (attachment, index) => (
					<Stack
						key={attachment.id}
						justify="space-between"
						align="center"
						className="min-w-0"
					>
						<Stack gap={2} align="center" className="min-w-0">
							<Badge variant={variant} size={size} className="max-w-full truncate">
								{attachment.filename}
							</Badge>
							{attachment.fileSizeBytes && (
								<TS
									variant="caption"
									color="dimmed"
									content={fileSize(attachment.fileSizeBytes)}
								/>
							)}
						</Stack>

						<Stack gap={1} align="center">
							<Tooltip content="Preview" side="left">
								<IconButton
									rounded
									size="xs"
									variant="outline"
									icon="eye"
									aria-label={`Preview ${attachment.filename}`}
									onClick={() => onPreview(index)}
								/>
							</Tooltip>
							<Tooltip content="Download" side="right">
								<IconButton
									rounded
									size="xs"
									variant="outline"
									icon="download"
									aria-label={`Download ${attachment.filename}`}
									onClick={() => onDownload(attachment)}
								/>
							</Tooltip>
						</Stack>
					</Stack>
				))}
			</Stack>
			<MediaViewer
				items={viewerItems}
				openIndex={openIndex}
				onClose={() => setOpenIndex(null)}
			/>
		</>
	)
}

function onDownload(attachment: ProjectAttachmentSummary) {
	const anchor = document.createElement('a')
	anchor.href = attachment.fileUrl
	anchor.download = attachment.filename
	anchor.rel = 'noreferrer'
	anchor.target = '_blank'
	document.body.append(anchor)
	anchor.click()
	anchor.remove()
}
