'use client'

import { map } from 'lodash'
import { useMemo, useState } from 'react'
import { ApplicationCard } from '../entity-cards/application-card'
import { PersonCard } from '../entity-cards/person-card'
import { ProjectCard } from '../entity-cards/project-card'
import { DemoRoot, DemoSection } from './components-utils'
import { type EntityCardsDemoState } from './demo-entity-cards-settings'
import {
	createApplicationCards,
	createChatParticipant,
	createFreelancerCardData,
	createProjectCards,
	createProjectClient,
	createShuffledPictureUrls,
} from './mock-generators'
import { useSettings } from './settings-store'
import type { ChatParticipantSummary } from '@/lib/chat/contracts'
import { Stack, Tabs, type TabItem } from '@/ui'

type EntityTab = 'project' | 'person' | 'application'

export function DemoEntityCards() {
	const settings = useSettings<EntityCardsDemoState>()
	const { longLines, full, image, personVariant: _, personClientAvatar: __ } = settings
	const [activeTab, setActiveTab] = useState<EntityTab>('project')
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const mockUrls = useMemo(() => createShuffledPictureUrls(), [image])
	const mockUrl = mockUrls[0]
	const projectItems = useMemo(
		() =>
			createProjectCards({
				longText: longLines,
				clientAvatarUrl: mockUrls[0] ?? null,
			}),
		[longLines, mockUrls],
	)
	const personCards = useMemo(() => buildPersonCards(settings, mockUrls), [settings, mockUrls])
	const applicationCards = useMemo(
		() =>
			createApplicationCards({
				applicationStatus: settings.applicationStatus,
				projectItems,
			}),
		[settings.applicationStatus, projectItems],
	)

	const tabs: TabItem[] = [
		{
			value: 'project',
			title: 'ProjectCard',
			icon: 'briefcase-business',
			content: (
				<div className="py-4 px-8 max-w-md">
					<ProjectCard
						item={{ ...projectItems[0], image: image ? mockUrl : undefined }}
						full={full}
					/>
				</div>
			),
		},
		{
			value: 'person',
			title: 'PersonCard',
			icon: 'users',
			content: (
				<div className="py-4 px-8 max-w-md">
					<PersonCard {...personCards[0]} full={full} />
					{/* {renderPersonCard(personCards[0], full)} */}
				</div>
			),
		},
		{
			value: 'application',
			title: 'ApplicationCard',
			icon: 'file-text',
			content: (
				<div className="py-4 px-8 max-w-xl">
					<ApplicationCard {...applicationCards[0]} full={full} />
				</div>
			),
		},
	]

	return (
		<DemoRoot>
			<DemoSection
				title="Interactive"
				desc="Доменные `ProjectCard`, `PersonCard`, `ApplicationCard` с общими toggles и переключением preview по tab."
				separator
			>
				<Tabs
					bordered
					fullWidth
					size="sm"
					value={activeTab}
					onValueChange={(value) => setActiveTab(value as EntityTab)}
					items={tabs}
				/>
			</DemoSection>
			<DemoSection
				title="Wrap Preview"
				desc="Несколько карточек в `wrap`-раскладке. Набор зависит от выбранного tab и текущих settings."
			>
				<Stack gap={4} align="stretch" wrap className="max-w-6xl">
					{activeTab === 'project'
						? map(projectItems, (item, index) => (
								<div key={item.id} className="min-w-70 max-w-md flex-1">
									<ProjectCard
										item={{
											...item,
											image: image ? mockUrls[index + 1] : undefined,
										}}
										full={full}
									/>
								</div>
							))
						: null}
					{activeTab === 'person'
						? map(personCards, (_card, index) => (
								<div
									key={index}
									className={
										settings.full
											? 'min-w-70 max-w-md flex-1'
											: 'min-w-70 max-w-sm flex-1'
									}
								>
									{/* {renderPersonCard(card, full) ?? null} */}
								</div>
							))
						: null}
					{activeTab === 'application'
						? map(applicationCards, (application) => (
								<div key={application.id} className="min-w-70 max-w-xl flex-1">
									<ApplicationCard {...application} full={full} />
								</div>
							))
						: null}
				</Stack>
			</DemoSection>
		</DemoRoot>
	)
}

type PersonPreviewCard =
	| {
			// id: string
			// variant: 'client'
			client: ReturnType<typeof createProjectClient>
	  }
	| {
			// id: string
			// variant: 'participant'
			chat: ChatParticipantSummary
	  }
	| {
			// id: string
			// variant: 'freelancer'
			freelancer: ReturnType<typeof createFreelancerCardData>
	  }

// function renderPersonCard(card: PersonPreviewCard, full: boolean) {
// 	if (card.variant === 'client' || full) {
// 		// 	return <PersonCard variant="client" client={card.client} full={full} />
// 	}
// 	// if (card.variant === 'participant') {
// 	// 	return <PersonCard variant="participant" participant={card.participant} full={full} />
// 	// }
// 	// return <PersonCard variant="freelancer" freelancer={card.freelancer} full={full} />
// }

function buildPersonCards(settings: EntityCardsDemoState, mockUrls: string[]): PersonPreviewCard[] {
	if (settings.personVariant === 'client') {
		return [
			{
				client: createProjectClient({
					withAvatar: settings.personClientAvatar,
					longLines: settings.longLines,
					avatarUrl: mockUrls[0] ?? null,
				}),
			},
			{
				client: createProjectClient({
					withAvatar: false,
					longLines: false,
					avatarUrl: mockUrls[0] ?? null,
				}),
			},
			{
				client: createProjectClient({
					withAvatar: true,
					longLines: true,
					avatarUrl: mockUrls[0] ?? null,
				}),
			},
		]
	}
	if (settings.personVariant === 'participant') {
		return [
			{
				chat: createChatParticipant({
					role: settings.personParticipantRole,
					longLines: settings.longLines,
					image: mockUrls[1] ?? null,
				}),
			},
			{
				chat: createChatParticipant({
					role: settings.personParticipantRole === 'customer' ? 'freelancer' : 'customer',
					longLines: false,
					image: mockUrls[1] ?? null,
				}),
			},
			{
				chat: createChatParticipant({
					role: settings.personParticipantRole,
					longLines: true,
					image: mockUrls[1] ?? null,
				}),
			},
		]
	}
	return [
		{
			freelancer: createFreelancerCardData({
				id: 'mock-profile-1',
				longLines: settings.longLines,
				avatarUrl: mockUrls[2] ?? null,
				previewUrl: mockUrls[3] ?? null,
			}),
		},
		{
			freelancer: createFreelancerCardData({
				id: 'mock-profile-2',
				longLines: false,
				avatarUrl: mockUrls[2] ?? null,
				previewUrl: mockUrls[3] ?? null,
				hasAvatar: false,
				hasPreview: false,
				availability: 'full-time',
				portfolioCount: 2,
			}),
		},
		{
			freelancer: createFreelancerCardData({
				id: 'mock-profile-3',
				longLines: true,
				avatarUrl: mockUrls[2] ?? null,
				previewUrl: mockUrls[3] ?? null,
				hasAvatar: true,
				hasPreview: true,
				availability: 'weekends',
				portfolioCount: 14,
			}),
		},
	]
}
