'use client'

import { useGate, useUnit } from 'effector-react'
import { useState } from 'react'
import { config } from '@/config'
import { confirmYes } from '@/modals/plugin'
import {
	$portfolio,
	$form,
	$isBusy,
	$isLoading,
	$isSaving,
	$uploadProgress,
	FreelancerPortfolioGate,
	deletePortfolioItem,
	portfolioFormUpdated,
	submitPortfolioItem,
} from '@/stores/freelancer-portfolio'
import { Badge, Card, Empty, FileUploader, Portfolio, Skeleton, Stack, TextField } from '@/ui'
import { fileSize, pluralizeRuWithCount } from '@/utils'

const fileLimit = fileSize(config.uploadMaxSize, 0, true)

export function PortfolioEditor({ userId, profileId }: { userId: string; profileId: string }) {
	useGate(FreelancerPortfolioGate, { userId, profileId })
	const [selectedItemId, setSelectedItemId] = useState<string | null>(null)

	const [
		form,
		portfolio,
		isBusy,
		isLoading,
		isSaving,
		uploadProgress,
		onFormUpdated,
		onSubmit,
		onDelete,
	] = useUnit([
		$form,
		$portfolio,
		$isBusy,
		$isLoading,
		$isSaving,
		$uploadProgress,
		portfolioFormUpdated,
		submitPortfolioItem,
		deletePortfolioItem,
	])

	const canSubmit = !!form.title.trim() && !!form.file && !isBusy
	const submitLabel =
		uploadProgress !== null
			? `Загрузка ${uploadProgress}%`
			: isSaving
				? 'Сохраняем...'
				: isLoading
					? 'Загружаем...'
					: 'Добавить в портфолио'
	const activeSelectedItemId = portfolio.some((item) => item.id === selectedItemId)
		? selectedItemId
		: null

	return (
		<Stack vertical gap={6}>
			<Card
				fullWidth
				title="Добавить новую работу"
				description={
					'Загрузите медиа напрямую в наше хранилище, ' +
					'добавьте описание кейса и сохраните элемент в портфолио. ' +
					'Кнопка сохранения станет активной после инициализации контекста и выбора файла.'
				}
				button={submitLabel}
				buttonProps={{
					variant: 'default',
					size: 'md',
					leftIcon: 'folder-kanban',
					disabled: !canSubmit,
					onClick: () => onSubmit({ userId, profileId }),
				}}
				badge={`Лимит файла: ${fileLimit}`}
				badgeProps={{ icon: 'weight-tilde' }}
			>
				<Stack vertical gap={4}>
					<Stack wrap gap={1.5}>
						{uploadProgress !== null ? (
							<Badge
								variant="secondary"
								color="primary"
								label={`${uploadProgress}% загружено`}
							/>
						) : null}
					</Stack>
					<TextField
						label="Название"
						required
						value={form.title}
						onChange={(e) => onFormUpdated({ title: e.target.value })}
					/>
					<TextField
						label="Описание"
						multiline
						rows={4}
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
					<FileUploader
						outline
						compact
						fullWidth
						align="start"
						mediaIcon
						title="Медиафайл"
						value={form.file}
						onChange={(file) => onFormUpdated({ file })}
						accept={portfolioAccept}
						maxSizeBytes={config.uploadMaxSize}
						placeholder="Выберите изображение, видео, аудио или PDF"
						helper={`Поддерживаемые типы: image/video/audio/pdf. Лимит: ${fileLimit}.`}
						disabled={isBusy}
					/>
				</Stack>
			</Card>

			<Card
				fullWidth
				title="Ваши работы"
				description={
					'Нажмите на карточку, чтобы выбрать работу для предпросмотра или удаления.' +
					' Полноценное редактирование метаданных добавим вместе с backend update flow.'
				}
				badge={pluralizeRuWithCount(portfolio.length, 'work')}
			>
				{isLoading ? (
					<Skeleton shape="card" clean maxW="none" />
				) : portfolio.length === 0 ? (
					<Empty
						outline
						fullWidth
						align="start"
						icon="collections-bookmark"
						title="Портфолио пока пустое"
						helper="После первой загрузки здесь появится галерея с выбором работы, предпросмотром и возможностями модификации."
					/>
				) : (
					<Portfolio
						items={portfolio}
						disabled={isBusy}
						allowSelection
						linkActionPreview
						selectedActions={['preview', 'delete']}
						selectedId={activeSelectedItemId}
						onSelect={(selection) => setSelectedItemId(selection?.id ?? null)}
						onAction={async (id, action) => {
							if (action === 'delete') {
								const confirmed = await confirmYes({
									title: 'Удалить работу?',
									description:
										'Вы действительно хотите удалить эту работу из портфолио? Это действие нельзя отменить.',
									icon: 'trash',
									iconOptions: { color: 'secondary' },
									divider: true,
									actions: [
										{ id: 'cancel', value: false, label: 'Отмена' },
										{
											id: 'yes',
											value: true,
											label: 'Удалить',
											variant: 'destructive',
											leftIcon: 'trash',
										},
									],
									actionsPosition: 'center',
									showCloseButton: false,
								})
								if (confirmed) onDelete(id)
							}
						}}
					/>
				)}
			</Card>
		</Stack>
	)
}

const portfolioAccept = {
	'image/*': [],
	'video/*': [],
	'audio/*': [],
	'application/pdf': [],
}
