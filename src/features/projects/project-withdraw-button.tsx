'use client'

import { useUnit } from 'effector-react'
import { useRouter } from 'next/navigation'
import {
	$pendingWithdrawByApplicationId,
	withdrawProjectApplicationFx,
} from '@/stores/project-applications/model'
import { Button } from '@/ui'

type WithdrawApplicationButtonProps = {
	applicationId: string
	className?: string
}

export function WithdrawApplicationButton({
	applicationId,
	className,
}: WithdrawApplicationButtonProps) {
	const router = useRouter()
	const [pendingByApplicationId, withdrawApplication] = useUnit([
		$pendingWithdrawByApplicationId,
		withdrawProjectApplicationFx,
	])
	const isPending = Boolean(pendingByApplicationId[applicationId])

	async function onClick() {
		await withdrawApplication({ applicationId })
		router.refresh()
	}

	return (
		<Button variant="outline" disabled={isPending} onClick={onClick} className={className}>
			{isPending ? 'Отзываем заявку...' : 'Отозвать заявку'}
		</Button>
	)
}
