'use client'

import { useGate, useUnit } from 'effector-react'
import { useEffect } from 'react'
import {
	$portfolio,
	$form,
	$isBusy,
	FreelancerPortfolioGate,
	deletePortfolioItem,
	portfolioFormUpdated,
	submitPortfolioItem,
	submitFreelancerPortfolio,
} from '@/stores/freelancer-portfolio'
import { Button, IconButton, Separator, Stack, TextField, TS } from '@/ui'

export function PortfolioEditor({ userId, profileId }: { userId: string; profileId: string }) {
	useGate(FreelancerPortfolioGate)

	const [form, portfolio, isBusy, onFormUpdated, onSetUserId, onSubmit, onDelete] = useUnit([
		$form,
		$portfolio,
		$isBusy,
		portfolioFormUpdated,
		submitFreelancerPortfolio,
		submitPortfolioItem,
		deletePortfolioItem,
	])

	const canSubmit = !!form.title.trim() && !!form.file && !isBusy

	useEffect(() => {
		onSetUserId({ userId, profileId })
	}, [onSetUserId, profileId, userId])

	return (
		<div>
			<TS variant="h5" gutterBottom content="Портфолио" />
			<TS
				variant="body"
				color="secondary"
				className="text-sm mb-6"
				content="Загрузите медиа напрямую в Vercel Blob и сохраните элемент портфолио."
			/>

			<Stack vertical gap={4} className="mb-6">
				<TextField
					label="Название"
					required
					value={form.title}
					onChange={(e) => onFormUpdated({ title: e.target.value })}
				/>
				<TextField
					label="Описание"
					multiline
					rows={3}
					value={form.description}
					onChange={(e) => onFormUpdated({ description: e.target.value })}
				/>
				<TextField
					label="Категория"
					value={form.category}
					onChange={(e) => onFormUpdated({ category: e.target.value })}
					helper="Например: chatbots, automation, analytics"
				/>
				<TextField
					label="Инструменты (через запятую)"
					value={form.toolsUsed}
					onChange={(e) => onFormUpdated({ toolsUsed: e.target.value })}
					helper="Например: LangChain, Postgres, OpenAI"
				/>

				<div>
					<input
						type="file"
						onChange={(e) => onFormUpdated({ file: e.target.files?.[0] ?? null })}
						accept="image/*,video/*,audio/*,application/pdf"
					/>
					<TS
						variant="caption"
						color="secondary"
						className="block mt-1"
						content="Поддерживаемые типы: image/video/audio/pdf. Лимит: 50MB."
					/>
				</div>

				<Button
					variant="default"
					size="lg"
					label={isBusy ? 'Сохраняем...' : 'Добавить в портфолио'}
					onClick={onSubmit}
					disabled={!canSubmit}
				/>
			</Stack>

			<Separator className="mb-4" />

			<TS variant="h5" gutterBottom content="Ваши работы" />

			{portfolio.length === 0 ? (
				<TS variant="body" color="secondary" className="text-sm" content="Пока пусто." />
			) : (
				<Stack vertical gap={2}>
					{portfolio.map((item) => (
						<Stack
							key={item.id}
							direction="row"
							align="center"
							justify="space-between"
							gap={4}
							className="p-3 rounded-lg border border-border"
						>
							<div className="min-w-0">
								<TS variant="subtitle" content={item.title} className="mb-0.5" />
								<TS
									variant="caption"
									color="secondary"
									className="block break-all"
									content={item.mediaUrl}
								/>
							</div>
							<IconButton
								rounded
								icon="trash"
								variant="destructive"
								aria-label="Удалить"
								onClick={() => onDelete(item.id)}
								disabled={isBusy}
							/>
						</Stack>
					))}
				</Stack>
			)}
		</div>
	)
}
