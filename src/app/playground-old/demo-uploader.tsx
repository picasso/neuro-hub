'use client'

import Stack from '@mui/material/Stack'
import { useState } from 'react'
import { FileUploader, TS } from '@/ui'

export function UploaderDemo() {
	const [file, setFile] = useState<File | null>(null)
	const [file2, setFile2] = useState<File | null>(null)

	return (
		<Stack spacing={2} sx={{ width: 1 }}>
			<TS variant="h5" content="Uploader (combo)" />
			<FileUploader
				value={file}
				onChange={setFile}
				accept={{
					'image/*': [],
					'video/*': [],
					'audio/*': [],
					'application/pdf': [],
				}}
				maxSizeBytes={50 * 1024 * 1024}
				title="Портфолио"
				placeholder="Выберите медиафайл для портфолио"
				helper="Ничто в настоящей Декларации не может быть истолковано, как предоставление какомулибо государству, группе лиц или отдельным лицам права заниматься какойлибо деятельностью или совершать действия, направленные к уничтожению прав и свобод, изложенных в настоящей Декларации."
			/>
			<TS variant="h5" content="Uploader (drop only)" />
			<FileUploader
				icon={false}
				value={file2}
				onChange={setFile2}
				dropOnly
				accept={{ 'image/*': [] }}
				maxSizeBytes={200 * 1024}
			/>
		</Stack>
	)
}
