'use client'

import { useEffect, useState } from 'react'
import { DemoRoot, DemoSection } from './components-utils'
import { type AvatarEditorDemoState } from './demo-avatar-editor-settings'
import { imageUrls } from './mock'
import { useSettings } from './settings-store'
import { AvatarEditor, type AvatarEditorResult, Stack, TS } from '@/ui'
import { fileSize } from '@/utils'

export function DemoAvatarEditor() {
	const settings = useSettings<AvatarEditorDemoState>()
	const [isLoading, setIsLoading] = useState(false)
	const [result, setResult] = useState<string | null>(null)
	const { disabled, loading, asIcon, variant, outline, outputMimeType, refreshKey } = settings
	const [lastMeta, setLastMeta] = useState<{ name: string; size: number; type: string } | null>(
		null,
	)

	const onCompleted = ({ file }: AvatarEditorResult) => {
		setLastMeta({ name: file.name, size: file.size, type: file.type })
		setResult(null)
		setIsLoading(true)
		setTimeout(() => {
			setIsLoading(false)
			setResult(imageUrls.card)
		}, 5000)
	}

	useEffect(() => {
		setResult(null)
		setLastMeta(null)
		setIsLoading(false)
	}, [refreshKey])

	return (
		<DemoRoot>
			<DemoSection
				title="Interactive"
				desc="`?AvatarEditor` -> выбор изображения через avatar-режим `FileUploader`"
			>
				<Stack vertical className="mt-24">
					<AvatarEditor
						disabled={disabled}
						name={asIcon ? undefined : 'John Snow'}
						src={result}
						loading={isLoading || loading}
						variant={variant}
						outline={outline}
						outputMimeType={outputMimeType}
						onCompleted={onCompleted}
						completed={!!result}
					/>
					{lastMeta ? (
						<Stack vertical gap={0.5} align="stretch">
							<TS
								variant="caption"
								color="dimmed"
								content="Последний результат (локально)"
							/>
							<TS
								variant="caption"
								content={`${lastMeta.name} · ${fileSize(lastMeta.size)} · ${lastMeta.type}`}
							/>
						</Stack>
					) : (
						<TS
							variant="caption"
							color="dimmed"
							content="Сохранённый файл появится здесь после «Ok»."
						/>
					)}
				</Stack>
			</DemoSection>
		</DemoRoot>
	)
}
