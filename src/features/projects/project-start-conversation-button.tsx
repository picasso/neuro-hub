'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createAlert } from '@/alerts'
import { openChatConversation } from '@/stores/chat/api'
import { Button } from '@/ui'

type ProjectStartConversationButtonProps = {
	projectId: string
	freelancerId: string
	className?: string
}

export function ProjectStartConversationButton({
	projectId,
	freelancerId,
	className,
}: ProjectStartConversationButtonProps) {
	const router = useRouter()
	const [isPending, setIsPending] = useState(false)

	async function onClick() {
		if (isPending) return

		setIsPending(true)

		try {
			const result = await openChatConversation({
				contextType: 'project',
				contextId: projectId,
				freelancerId,
			})

			router.push(`/account/chat/${result.conversation.id}`)
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: 'Не удалось начать обсуждение. Попробуйте еще раз.'

			createAlert({
				severity: 'error',
				title: 'Не удалось открыть чат',
				message,
			})
			setIsPending(false)
		}
	}

	return (
		<Button
			aria-busy={isPending}
			variant="outline"
			size="sm"
			disabled={isPending}
			className={className}
			leftIcon={isPending ? 'spinner' : 'message-circle-check'}
			iconOptions={{ spinning: isPending }}
			label={isPending ? 'Открываем обсуждение...' : 'Начать обсуждение'}
			onClick={onClick}
		/>
	)
}
