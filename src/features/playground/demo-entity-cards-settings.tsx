'use client'

import { useEffect } from 'react'
import { DemoRoot, SettingSelect, SettingToggle } from './components-utils'
import { useReset, useSettings } from './settings-store'
import { Separator } from '@/ui'

export type EntityCardsDemoState = {
	full: boolean
	image: boolean
	personVariant: 'client' | 'participant' | 'freelancer'
	personClientAvatar: boolean
	personParticipantRole: 'customer' | 'freelancer'
	longLines: boolean
	applicationStatus: 'submitted' | 'shortlisted' | 'accepted' | 'rejected' | 'withdrawn'
}

const defaultState: EntityCardsDemoState = {
	full: false,
	image: false,
	longLines: false,
	personVariant: 'client',
	personClientAvatar: true,
	personParticipantRole: 'freelancer',
	applicationStatus: 'submitted',
}

export function DemoEntityCardsSettings() {
	const reset = useReset<EntityCardsDemoState>(defaultState)
	const {
		full,
		longLines,
		image,
		personVariant,
		personClientAvatar,
		personParticipantRole,
		applicationStatus,
	} = useSettings<EntityCardsDemoState>()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => reset(), [])

	return (
		<DemoRoot>
			<SettingToggle id="full" label="Full card" checked={full} />
			<SettingToggle id="longLines" label="Long lines" checked={longLines} />
			<SettingToggle id="image" label="Image" checked={image} />
			<Separator />
			<SettingSelect
				id="personVariant"
				label="PersonCard source"
				value={personVariant}
				options={[
					{ label: 'ProjectClientSummary', value: 'client' },
					{ label: 'ChatParticipantSummary', value: 'participant' },
					{ label: 'Freelancer grid pick', value: 'freelancer' },
				]}
			/>
			{personVariant === 'client' ? (
				<SettingToggle
					id="personClientAvatar"
					label="Client avatar URL"
					checked={personClientAvatar}
				/>
			) : null}
			{personVariant === 'participant' ? (
				<SettingSelect
					id="personParticipantRole"
					label="Participant role"
					value={personParticipantRole}
					options={[
						{ label: 'customer', value: 'customer' },
						{ label: 'freelancer', value: 'freelancer' },
					]}
				/>
			) : null}

			<SettingSelect
				id="applicationStatus"
				label="ApplicationCard status"
				value={applicationStatus}
				options={[
					{ label: 'submitted', value: 'submitted' },
					{ label: 'shortlisted', value: 'shortlisted' },
					{ label: 'accepted', value: 'accepted' },
					{ label: 'rejected', value: 'rejected' },
					{ label: 'withdrawn', value: 'withdrawn' },
				]}
			/>
		</DemoRoot>
	)
}
