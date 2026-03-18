'use client'

import { useUnit } from 'effector-react'
import { useRouter } from 'next/navigation'
import { type FormEvent, useEffect } from 'react'
import {
	$form,
	projectApplicationFormScopeChanged,
	projectApplicationFormUpdated,
	resetProjectApplicationForm,
	submitProjectApplicationFx,
} from '@/stores/project-applications/model'
import { Button, Stack, TextField, TS } from '@/ui'

type ProjectApplicationFormProps = {
	projectId: string
}

export function ProjectApplicationForm({ projectId }: ProjectApplicationFormProps) {
	const router = useRouter()
	const [form, isSubmitting, scopeChanged, updateForm, resetForm, submitApplication] = useUnit([
		$form,
		submitProjectApplicationFx.pending,
		projectApplicationFormScopeChanged,
		projectApplicationFormUpdated,
		resetProjectApplicationForm,
		submitProjectApplicationFx,
	])

	useEffect(() => {
		scopeChanged(projectId)

		return () => {
			resetForm()
		}
	}, [projectId, resetForm, scopeChanged])

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
						required
					/>
					<TextField
						label="Срок выполнения"
						name="proposedDeadline"
						type="date"
						value={form.proposedDeadline}
						onChange={(event) => updateForm({ proposedDeadline: event.target.value })}
					/>
				</div>
				<Stack wrap gap={3}>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? 'Отправляем заявку...' : 'Подать заявку'}
					</Button>
					<Button
						type="button"
						variant="outline"
						disabled={isSubmitting}
						onClick={() => resetForm()}
					>
						Очистить
					</Button>
				</Stack>
			</Stack>
		</form>
	)
}
