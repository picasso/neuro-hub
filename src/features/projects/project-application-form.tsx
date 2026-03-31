'use client'

import { useGate, useUnit } from 'effector-react'
import { useRouter } from 'next/navigation'
import { type FormEvent } from 'react'
import {
	$applicationErrors,
	$form,
	ProjectApplicationFormGate,
	projectApplicationFormUpdated,
	resetProjectApplicationForm,
	submitProjectApplicationFx,
} from '@/stores/project-applications/model'
import { Button, Stack, TextField, TS } from '@/ui'

type ProjectApplicationFormProps = {
	projectId: string
}

export function ProjectApplicationForm({ projectId }: ProjectApplicationFormProps) {
	useGate(ProjectApplicationFormGate, { projectId })

	const router = useRouter()
	const [form, applicationErrors, isSubmitting, updateForm, resetForm, submitApplication] =
		useUnit([
			$form,
			$applicationErrors,
			submitProjectApplicationFx.pending,
			projectApplicationFormUpdated,
			resetProjectApplicationForm,
			submitProjectApplicationFx,
		])

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		await submitApplication({ projectId, form })
		router.refresh()
	}

	return (
		<form onSubmit={onSubmit}>
			<Stack vertical gap={4} align="stretch">
				<TS
					variant="body"
					color="secondary"
					content="Расскажите, почему ваша заявка подходит под задачу, и укажите бюджет и срок."
				/>
				<TextField
					label="О заявке"
					helper="Опишите релевантный опыт, подход к задаче и ключевые сроки."
					error={applicationErrors.coverLetter}
					multiline
					name="coverLetter"
					placeholder="Почему вам подходит этот проект"
					value={form.coverLetter}
					onChange={(event) => updateForm({ coverLetter: event.target.value })}
					rows={7}
					required
				/>
				<div className="grid gap-3 md:grid-cols-2">
					<TextField
						label="Бюджет заявки"
						name="proposedPrice"
						type="number"
						min="1"
						step="1"
						placeholder="Например, 1500"
						value={form.proposedPrice}
						onChange={(event) => updateForm({ proposedPrice: event.target.value })}
						error={applicationErrors.proposedPrice}
						required
					/>
					<TextField
						label="Срок выполнения"
						name="proposedDeadline"
						type="date"
						value={form.proposedDeadline}
						onChange={(event) => updateForm({ proposedDeadline: event.target.value })}
						error={applicationErrors.proposedDeadline}
					/>
				</div>
				<Stack wrap gap={3}>
					<Button
						type="submit"
						disabled={isSubmitting}
						label={isSubmitting ? 'Отправляем заявку...' : 'Подать заявку'}
					/>
					<Button
						type="button"
						variant="outline"
						disabled={isSubmitting}
						onClick={() => resetForm()}
						label="Очистить"
					/>
				</Stack>
			</Stack>
		</form>
	)
}
