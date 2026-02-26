'use client'

import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
// import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
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
import { Button, IconButton } from '@/ui'
import { TS } from '@/ui/text-styled'

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
		<Box>
			<TS variant="h5" gutterBottom content="Портфолио" />
			<TS
				variant="body"
				color="secondary"
				className="text-sm mb-6"
				content="Загрузите медиа напрямую в Vercel Blob и сохраните элемент портфолио."
			/>

			<Stack spacing={2} sx={{ mb: 3 }}>
				<TextField
					label="Название"
					fullWidth
					required
					value={form.title}
					onChange={(e) => onFormUpdated({ title: e.target.value })}
				/>
				<TextField
					label="Описание"
					fullWidth
					multiline
					minRows={3}
					value={form.description}
					onChange={(e) => onFormUpdated({ description: e.target.value })}
				/>
				<TextField
					label="Категория"
					fullWidth
					value={form.category}
					onChange={(e) => onFormUpdated({ category: e.target.value })}
					helperText="Например: chatbots, automation, analytics"
				/>
				<TextField
					label="Инструменты (через запятую)"
					fullWidth
					value={form.toolsUsed}
					onChange={(e) => onFormUpdated({ toolsUsed: e.target.value })}
					helperText="Например: LangChain, Postgres, OpenAI"
				/>

				<Box>
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
				</Box>

				<Button
					variant="default"
					size="lg"
					label={isBusy ? 'Сохраняем...' : 'Добавить в портфолио'}
					onClick={onSubmit}
					disabled={!canSubmit}
				/>
			</Stack>

			<Divider sx={{ mb: 2 }} />

			<TS variant="h5" gutterBottom content="Ваши работы" />

			{portfolio.length === 0 ? (
				<TS variant="body" color="secondary" className="text-sm" content="Пока пусто." />
			) : (
				<Stack spacing={1}>
					{portfolio.map((item) => (
						<Stack
							key={item.id}
							direction="row"
							alignItems="center"
							justifyContent="space-between"
							sx={{
								gap: 2,
								p: 1.5,
								borderRadius: 2,
								border: '1px solid',
								borderColor: 'divider',
							}}
						>
							<Box sx={{ minWidth: 0 }}>
								<TS variant="subtitle" content={item.title} className="mb-0.5" />
								<TS
									variant="caption"
									color="secondary"
									className="block break-all"
									content={item.mediaUrl}
								/>
							</Box>
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
		</Box>
	)
}
