'use client'

import { useGate, useUnit } from 'effector-react'
import { type Route } from 'next'
import { InlineEdit } from '../entity-cards/inline-edit'
import { $isLoading, $isBusy, $form, ProfileGate, profileUpdated, $lastTouch } from './model'
import { ProfileHero } from './profile-hero'
import { type LanguageOption } from './types'
import { Button, Card, Skeleton, Stack } from '@/ui'

type ProfileEditorProps = {
	userId: string
	role: 'client' | 'freelancer'
	availableLanguages: LanguageOption[]
	headline?: string | null
	skillsHref?: string
}

export function ProfileEditor({
	userId,
	role,
	availableLanguages,
	headline,
	skillsHref = '/account/skills',
}: ProfileEditorProps) {
	useGate(ProfileGate, { userId })

	const [{ nickname, bio }, isBusy, isLoading, last, onUpdated] = useUnit([
		$form,
		$isBusy,
		$isLoading,
		$lastTouch,
		profileUpdated,
	])

	const publicHref = role === 'freelancer' ? (`/freelancers/${nickname}` as Route) : null

	if (isLoading) {
		return (
			<Stack vertical gap={4} align="stretch">
				<Skeleton className="h-72 w-full rounded-3xl" />
				<Skeleton className="h-64 w-full rounded-3xl" />
			</Stack>
		)
	}

	return (
		<Stack vertical gap={4} align="stretch" className="relative">
			<Stack className="absolute right-0 -top-16 flex-wrap">
				{role === 'freelancer' && (
					<Button
						variant="outline"
						size="sm"
						label="Skills & Experience"
						href={skillsHref as Route}
					/>
				)}
				{publicHref && (
					<Button
						leftIcon="eye"
						variant="outline"
						size="sm"
						label="Preview"
						href={publicHref}
					/>
				)}
			</Stack>
			<ProfileHero headline={headline} availableLanguages={availableLanguages} />

			<Card fullWidth flush title="О себе" className="pt-4!">
				<InlineEdit
					multiline
					value={bio}
					placeholder="Расскажите о себе, сильных сторонах и формате работы"
					loading={isBusy && last === 'bio'}
					variant="body"
					onSave={(update) => update && onUpdated({ bio: update })}
				/>
			</Card>
		</Stack>
	)
}
