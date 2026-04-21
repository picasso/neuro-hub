'use client'

import { useUnit } from 'effector-react'
import { useCallback } from 'react'
import { $form, $isBusy, $isUploadingAvatar, avatarSelected } from './model'
import { AvatarEditor, type AvatarEditorResult } from '@/ui'

export function ProfileAvatar() {
	const [{ avatarUrl }, isBusy, isUploadingAvatar, onSelected] = useUnit([
		$form,
		$isBusy,
		$isUploadingAvatar,
		avatarSelected,
	])

	const onCompleted = useCallback(
		({ file }: AvatarEditorResult) => {
			onSelected(file)
		},
		[onSelected],
	)
	return (
		<div className="shrink-0 lg:col-start-1 lg:row-start-1">
			<AvatarEditor
				name="icon"
				src={avatarUrl}
				loading={isUploadingAvatar}
				completed={!!avatarUrl}
				disabled={isBusy}
				onCompleted={onCompleted}
			/>
		</div>
	)
}
