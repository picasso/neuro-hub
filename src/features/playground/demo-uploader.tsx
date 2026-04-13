'use client'

import { useState } from 'react'
import { DemoRoot, DemoSection } from './components-utils'
import { type UploaderDemoState } from './demo-uploader-settings'
import { text } from './mock'
import { useSettings } from './settings-store'
import { FileUploader, Stack } from '@/ui'

export function DemoUploader() {
	const settings = useSettings<UploaderDemoState>()
	const {
		title,
		icon,
		placeholder,
		helper,
		accept,
		maxSizeBytes,
		dropOnly,
		disabled,
		variant,
		outline,
		fullWidth,
		compact,
		align,
		mediaIcon,
	} = settings
	const [file, setFile] = useState<File | null>(null)
	const [file2, setFile2] = useState<File | null>(null)

	return (
		<DemoRoot>
			<DemoSection
				title="Interactive"
				desc="Компонент `?File Uploader` —> **shadcn** `Empty` and `TextField`"
				separator
			>
				<FileUploader
					mediaIcon={mediaIcon}
					dropOnly={dropOnly}
					value={file}
					onChange={setFile}
					accept={
						accept !== 'all media'
							? { [accept]: [] }
							: {
									'image/*': [],
									'video/*': [],
									'audio/*': [],
									'application/pdf': [],
								}
					}
					maxSizeBytes={maxSizeBytes * 1000}
					title={title ? 'Портфолио' : undefined}
					icon={icon ? 'video' : false}
					placeholder={placeholder ? text.placeholder.uploader : undefined}
					helper={
						helper
							? 'Ничто в настоящей Декларации не может быть истолковано, как предоставление какомулибо государству, группе лиц или отдельным лицам права заниматься какойлибо деятельностью или совершать действия, направленные к уничтожению прав и свобод, изложенных в настоящей Декларации.'
							: undefined
					}
					disabled={disabled}
					variant={variant}
					outline={outline}
					fullWidth={fullWidth}
					compact={compact}
					align={align}
				/>
			</DemoSection>
			<DemoSection title="Drop only" asBadge="video-library">
				<Stack align="stretch">
					<FileUploader
						outline
						mediaIcon
						align="center"
						compact
						value={file2}
						onChange={setFile2}
						dropOnly
						accept={{ 'image/*': [] }}
						maxSizeBytes={200 * 1024}
					/>
					<FileUploader
						outline
						title="PDF only"
						icon={false}
						variant="secondary"
						align="start"
						fullWidth
						compact
						value={file2}
						onChange={setFile2}
						dropOnly
						accept={{ 'application/pdf': [] }}
						maxSizeBytes={200 * 1024}
					/>
				</Stack>
			</DemoSection>
		</DemoRoot>
	)
}
