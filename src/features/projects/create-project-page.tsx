'use client'

import { useGate, useUnit } from 'effector-react'
import { redirect } from 'next/navigation'
import {
	$createdProjectId,
	$errors,
	$form,
	$isLoadingSkills,
	$isSubmitting,
	$skills,
	$skillsError,
	CreateProjectGate,
	createProjectFormUpdated,
	createProjectSkillsReloadRequested,
	createProjectSkillToggled,
	createProjectSubmitted,
	resetCreateProjectForm,
} from './create-project-model'
import type { Route } from 'next'
import { Button, Card, Checkbox, PageShell, Select, Stack, TextField, TS } from '@/ui'

const categoryOptions = [
	{ label: 'Text generation', value: 'text_generation' },
	{ label: 'Image generation', value: 'image_generation' },
	{ label: 'Video generation', value: 'video_generation' },
	{ label: 'Audio generation', value: 'audio_generation' },
	{ label: 'Programming', value: 'programming' },
	{ label: 'Consulting', value: 'consulting' },
] as const

const experienceLevelOptions = [
	{ label: 'Junior', value: 'junior' },
	{ label: 'Middle', value: 'middle' },
	{ label: 'Senior', value: 'senior' },
	{ label: 'Lead', value: 'lead' },
] as const

const budgetTypeOptions = [
	{ label: 'Fixed', value: 'fixed' },
	{ label: 'Hourly', value: 'hourly' },
] as const

const statusOptions = [
	{ label: 'Черновик', value: 'draft' },
	{ label: 'Опубликовать сразу', value: 'published' },
] as const

export function CreateProjectPage() {
	useGate(CreateProjectGate)
	const [
		form,
		errors,
		skills,
		skillsError,
		createdProjectId,
		isLoadingSkills,
		isSubmitting,
		onFormUpdated,
		onSkillToggled,
		onSubmit,
		onResetForm,
		onReloadSkills,
	] = useUnit([
		$form,
		$errors,
		$skills,
		$skillsError,
		$createdProjectId,
		$isLoadingSkills,
		$isSubmitting,
		createProjectFormUpdated,
		createProjectSkillToggled,
		createProjectSubmitted,
		resetCreateProjectForm,
		createProjectSkillsReloadRequested,
	])

	if (createdProjectId) {
		redirect(`/projects/${createdProjectId}` as Route)
	}

	return (
		<PageShell preset="content">
			<Stack vertical gap={6} align="stretch">
				<Stack vertical gap={2} align="stretch">
					<TS clean variant="h2" content="Создать проект" />
					<TS
						variant="body"
						color="secondary"
						content="Опишите задачу, выберите ключевые параметры и опубликуйте проект для фрилансеров."
					/>
				</Stack>

				<Card
					fullWidth
					title="Новый проект"
					description="Минимальная форма для быстрого создания проекта в MVP."
				>
					<form
						onSubmit={(event) => {
							event.preventDefault()
							onSubmit()
						}}
					>
						<Stack vertical gap={4} align="stretch">
							<TextField
								label="Название проекта"
								name="title"
								placeholder="Например, AI-ассистент для поддержки клиентов"
								value={form.title}
								onChange={(event) => onFormUpdated({ title: event.target.value })}
								error={errors.title}
								required
								minLength={10}
								maxLength={255}
								disabled={isSubmitting}
							/>

							<TextField
								label="Описание"
								name="description"
								placeholder="Кратко опишите задачу, результат и ключевые ограничения"
								value={form.description}
								onChange={(event) =>
									onFormUpdated({ description: event.target.value })
								}
								error={errors.description}
								helper="Минимум 50 символов"
								required
								minLength={50}
								maxLength={5000}
								rows={8}
								multiline
								disabled={isSubmitting}
							/>

							<div className="grid gap-4 md:grid-cols-2">
								<Select
									label="Категория"
									value={form.category}
									items={categoryOptions.map((item) => ({ ...item }))}
									onValueChange={(value) =>
										onFormUpdated({
											category: value as typeof form.category,
										})
									}
									error={errors.category}
									disabled={isSubmitting}
								/>
								<Select
									label="Уровень исполнителя"
									value={form.experienceLevel}
									items={experienceLevelOptions.map((item) => ({ ...item }))}
									onValueChange={(value) =>
										onFormUpdated({
											experienceLevel: value as typeof form.experienceLevel,
										})
									}
									error={errors.experienceLevel}
									disabled={isSubmitting}
								/>
								<Select
									label="Формат бюджета"
									value={form.budgetType}
									items={budgetTypeOptions.map((item) => ({ ...item }))}
									onValueChange={(value) =>
										onFormUpdated({
											budgetType: value as typeof form.budgetType,
										})
									}
									error={errors.budgetType}
									disabled={isSubmitting}
								/>
								<Select
									label="Статус"
									value={form.status}
									items={statusOptions.map((item) => ({ ...item }))}
									onValueChange={(value) =>
										onFormUpdated({
											status: value as typeof form.status,
										})
									}
									error={errors.status}
									disabled={isSubmitting}
								/>
							</div>

							<div className="grid gap-4 md:grid-cols-3">
								<TextField
									label="Бюджет от"
									name="budgetMin"
									type="number"
									inputMode="numeric"
									placeholder="1000"
									value={form.budgetMin}
									onChange={(event) =>
										onFormUpdated({ budgetMin: event.target.value })
									}
									error={errors.budgetMin}
									required
									min="1"
									step="1"
									disabled={isSubmitting}
								/>
								<TextField
									label="Бюджет до"
									name="budgetMax"
									type="number"
									inputMode="numeric"
									placeholder="3000"
									value={form.budgetMax}
									onChange={(event) =>
										onFormUpdated({ budgetMax: event.target.value })
									}
									error={errors.budgetMax}
									required
									min="1"
									step="1"
									disabled={isSubmitting}
								/>
								<TextField
									label="Дедлайн"
									name="deadline"
									type="date"
									value={form.deadline}
									onChange={(event) =>
										onFormUpdated({ deadline: event.target.value })
									}
									error={errors.deadline}
									required
									disabled={isSubmitting}
								/>
							</div>

							<Stack vertical gap={3} align="stretch">
								<Stack vertical gap={1} align="stretch">
									<TS clean variant="subtitle" content="Навыки" />
									<TS
										variant="caption"
										color="secondary"
										content="Выберите навыки, которые понадобятся для проекта."
									/>
								</Stack>

								{skills.length > 0 ? (
									<div className="grid gap-3 md:grid-cols-2">
										{skills.map((skill) => (
											<Checkbox
												key={skill.id}
												label={skill.name}
												helper={formatCategory(skill.category)}
												checked={form.skillIds.includes(skill.id)}
												onCheckedChange={() => onSkillToggled(skill.id)}
												disabled={isSubmitting}
											/>
										))}
									</div>
								) : (
									<Stack wrap gap={3} align="center">
										<TS
											variant="caption"
											color="secondary"
											content={
												isLoadingSkills
													? 'Загружаем доступные навыки...'
													: skillsError || 'Навыки пока недоступны'
											}
										/>
										{!isLoadingSkills && (
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => onReloadSkills()}
												label="Повторить"
											/>
										)}
									</Stack>
								)}

								{errors.skillIds ? (
									<TS
										variant="caption"
										content={errors.skillIds}
										className="text-destructive"
									/>
								) : null}
							</Stack>

							<Stack wrap gap={3}>
								<Button
									type="submit"
									disabled={isSubmitting}
									label={isSubmitting ? 'Создаём проект...' : 'Создать проект'}
								/>
								<Button
									type="button"
									variant="outline"
									disabled={isSubmitting}
									onClick={() => onResetForm()}
									label="Очистить"
								/>
							</Stack>
						</Stack>
					</form>
				</Card>
			</Stack>
		</PageShell>
	)
}

function formatCategory(category: string) {
	switch (category) {
		case 'text_generation':
			return 'Text generation'
		case 'image_generation':
			return 'Image generation'
		case 'video_generation':
			return 'Video generation'
		case 'audio_generation':
			return 'Audio generation'
		case 'programming':
			return 'Programming'
		case 'consulting':
			return 'Consulting'
		default:
			return category
	}
}
