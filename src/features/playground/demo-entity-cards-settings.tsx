'use client'

import { includes } from 'lodash'
import { useEffect } from 'react'
import { DemoRoot, SettingSelect, SettingToggle } from './components-utils'
import { useReset, useSettings } from './settings-store'
import { Separator } from '@/ui'

export type EntityCardsDemoState = {
	entity: 'project' | 'person' | 'application' | 'portfolio'
	full: boolean
	cover: boolean
	hero: boolean
	portfolio: boolean
	innerOnly: boolean
	forcedEmptyBio: boolean
	personVariant: 'client' | 'participant' | 'freelancer'
	personClientAvatar: boolean
	personParticipantRole: 'customer' | 'freelancer'
	longLines: boolean
	hoverable: boolean
	applicationStatus: 'submitted' | 'shortlisted' | 'accepted' | 'rejected' | 'withdrawn'
}

const defaultState: EntityCardsDemoState = {
	entity: 'project',
	full: false,
	cover: false,
	hero: false,
	portfolio: false,
	innerOnly: false,
	forcedEmptyBio: false,
	longLines: false,
	hoverable: false,
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
		portfolio,
		innerOnly,
		forcedEmptyBio,
		longLines,
		cover,
		hoverable,
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
				id="cover"
				label="Cover"
				checked={cover}
				disabled={entity !== 'project'}
			/>
			<SettingToggle id="hoverable" label="Hoverable" checked={hoverable} />
			<Separator />
			<SettingToggle
				id="personClientAvatar"
				label="Client Avatar URL"
				checked={personClientAvatar}
			/>
			{entity === 'portfolio' && (
				<SettingToggle id="portfolio" label="Portfolio" checked={portfolio} />
			)}
			{entity === 'person' && (
				<>
					{includes(['client', 'freelancer'], personVariant) && (
						<>
							<SettingToggle id="hero" label="Hero" checked={hero} />
							<SettingToggle id="innerOnly" label="Inner only" checked={innerOnly} />
							<SettingToggle
								id="forcedEmptyBio"
								label="Forced empty bio"
								checked={forcedEmptyBio}
							/>
						</>
					)}
					<SettingSelect
						id="personVariant"
						label="Person Source"
						value={personVariant}
						options={[
							{ label: 'Client', value: 'client' },
							{ label: 'Freelancer', value: 'freelancer' },
							{ label: 'Chat Participant', value: 'participant' },
						]}
					/>

					{personVariant === 'participant' ? (
						<SettingSelect
							id="personParticipantRole"
							label="Participant Role"
							value={personParticipantRole}
							options={[
								{ label: 'Client', value: 'customer' },
								{ label: 'Freelancer', value: 'freelancer' },
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
