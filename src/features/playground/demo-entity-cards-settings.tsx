'use client'

import { includes } from 'lodash'
import { useEffect } from 'react'
import { DemoRoot, SettingSelect, SettingToggle } from './components-utils'
import { useReset, useSettings } from './settings-store'
import { Separator } from '@/ui'

export type EntityCardsDemoState = {
	entity: 'project' | 'person' | 'application'
	full: boolean
	image: boolean
	hero: boolean
	personVariant: 'client' | 'participant' | 'freelancer'
	personClientAvatar: boolean
	personParticipantRole: 'customer' | 'freelancer'
	longLines: boolean
	applicationStatus: 'submitted' | 'shortlisted' | 'accepted' | 'rejected' | 'withdrawn'
}

const defaultState: EntityCardsDemoState = {
	entity: 'project',
	full: false,
	image: false,
	hero: false,
	longLines: false,
	personVariant: 'client',
	personClientAvatar: true,
	personParticipantRole: 'freelancer',
	applicationStatus: 'submitted',
}

export function DemoEntityCardsSettings() {
	const reset = useReset<EntityCardsDemoState>(defaultState)
	const {
		entity,
		full,
		hero,
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
			<SettingToggle
				id="image"
				label="Image"
				checked={image}
				disabled={entity !== 'project'}
			/>
			<Separator />
			{entity === 'person' && (
				<>
					{includes(['client', 'freelancer'], personVariant) && (
						<>
							<SettingToggle id="hero" label="Hero" checked={hero} />
							<SettingToggle
								id="personClientAvatar"
								label="Client Avatar URL"
								checked={personClientAvatar}
							/>
						</>
					)}
					<SettingSelect
						id="personVariant"
						label="Person Source"
						value={personVariant}
						options={[
							{ label: 'Project Client', value: 'client' },
							{ label: 'Chat Participant', value: 'participant' },
							{ label: 'Freelancer Pick', value: 'freelancer' },
						]}
					/>

					{personVariant === 'participant' ? (
						<SettingSelect
							id="personParticipantRole"
							label="Participant Role"
							value={personParticipantRole}
							options={[
								{ label: 'customer', value: 'customer' },
								{ label: 'freelancer', value: 'freelancer' },
							]}
						/>
					) : null}
				</>
			)}
			{entity === 'application' && (
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
			)}
		</DemoRoot>
	)
}
