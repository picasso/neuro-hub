'use client'

import { map } from 'lodash'
import { useMemo, useState } from 'react'
import { ApplicationCard } from '../entity-cards/application-card'
import { PersonCard } from '../entity-cards/person-card'
import { PortfolioCard } from '../entity-cards/portfolio-card'
import { ProjectCard } from '../entity-cards/project-card'
import { DemoRoot, DemoSection } from './components-utils'
import { type EntityCardsDemoState } from './demo-entity-cards-settings'
import {
	createApplicationCards,
	createChatParticipant,
	createFreelancerCardData,
	createProjectCards,
	createProjectClient,
} from './mock-generators'
import { useSettings, useUpdateSettings } from './settings-store'
import type { ChatParticipantSummary } from '@/lib/chat/contracts'
import { Stack, Tabs, type TabItem } from '@/ui'

type EntityTab = EntityCardsDemoState['entity']

export function DemoEntityCards() {
	const [update] = useUpdateSettings<EntityCardsDemoState>()
	const settings = useSettings<EntityCardsDemoState>()
	const { longLines, full, cover, hero, hoverable, innerOnly, forcedEmptyBio } = settings
	const [activeTab, setActiveTab] = useState<EntityTab>('project')
	const projectItems = useMemo(
		() =>
			createProjectCards({
				longText: longLines,
				withAvatar: true,
			}),
		[longLines],
	)
	const personCards = useMemo(() => buildPersonCards(settings), [settings])
	const portfolioCards = useMemo(() => buildPortfolioCards(settings), [settings])

	const applicationCards = useMemo(
		() =>
			createApplicationCards({
				applicationStatus: settings.applicationStatus,
				projectItems,
			}),
		[settings.applicationStatus, projectItems],
	)

	const coverUrl = cover ? projectItems[0]?.coverUrl : null
	const tabs: TabItem[] = [
		{
			value: 'project',
			title: 'ProjectCard',
			icon: 'briefcase-business',
			content: (
				<div className="py-4 px-8 max-w-md">
					<ProjectCard
						item={{ ...projectItems[0], coverUrl: cover ? coverUrl : null }}
						full={full}
						hoverable={hoverable}
					/>
				</div>
			),
		},
		{
			value: 'person',
			title: 'PersonCard',
			icon: 'users',
			content: (
				<div className="py-4 px-8 max-w-xl">
					<PersonCard
						{...personCards[0]}
						full={full}
						hero={hero}
						innerOnly={innerOnly}
						hoverable={hoverable}
						forcedEmptyBio={forcedEmptyBio}
					/>
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
					<ApplicationCard {...applicationCards[0]} full={full} hoverable={hoverable} />
				</div>
			),
		},
		{
			value: 'portfolio',
			title: 'PortfolioCard',
			icon: 'image',
			content: (
				<div className="py-4 px-8 max-w-xl">
					<PortfolioCard
						item="last"
						freelancer={portfolioCards[0].freelancer}
						full={full}
						hoverable={hoverable}
					/>
				</div>
			),
		},
	]

	return (
		<DemoRoot>
			<DemoSection
				title="Interactive"
				desc="Доменные `?ProjectCard`, `?PersonCard`, `?ApplicationCard` и `?PortfolioCard` с общими toggles и переключением preview по tab."
				separator
			>
				<Tabs
					bordered
					fullWidth
					size="sm"
					value={activeTab}
					onValueChange={(value) => {
						setActiveTab(value as EntityTab)
						update({ entity: value as EntityTab })
					}}
					items={tabs}
				/>
			</DemoSection>
			<DemoSection
				title="Wrap Preview"
				desc="Несколько карточек в `wrap`-раскладке. Набор зависит от выбранного tab и текущих settings."
			>
				<Stack gap={4} align="stretch" wrap className="max-w-6xl">
					{activeTab === 'project'
						? map(projectItems, (item) => (
								<div key={item.id} className="min-w-70 max-w-md flex-1">
									<ProjectCard
										item={{
											...item,
											coverUrl: cover ? item.coverUrl : null,
										}}
										full={full}
										hoverable={hoverable}
										splitTagsAt={3}
									/>
								</div>
							))
						: null}
					{activeTab === 'person'
						? map(personCards, (card, index) => (
								<div
									key={index}
									className={
										settings.full
											? 'min-w-70 max-w-md flex-1'
											: 'min-w-70 max-w-sm flex-1'
									}
								>
									<PersonCard
										{...card}
										full={full}
										hero={hero}
										innerOnly={innerOnly}
										hoverable={hoverable}
									/>
								</div>
							))
						: null}
					{activeTab === 'application'
						? map(applicationCards, (application) => (
								<div key={application.id} className="min-w-70 max-w-xl flex-1">
									<ApplicationCard
										{...application}
										full={full}
										hoverable={hoverable}
									/>
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
			client: ReturnType<typeof createProjectClient>
	  }
	| {
			chat: ChatParticipantSummary
	  }
	| {
			freelancer: ReturnType<typeof createFreelancerCardData>
	  }

function buildPersonCards(settings: EntityCardsDemoState): PersonPreviewCard[] {
	const { personVariant, personClientAvatar, longLines, personParticipantRole, forcedEmptyBio } =
		settings
	if (personVariant === 'client') {
		return [
			{
				client: createProjectClient({
					withAvatar: personClientAvatar,
					longLines,
				}),
			},
			{
				client: createProjectClient({
					withAvatar: false,
					longLines: false,
				}),
			},
			{
				client: createProjectClient({
					withAvatar: true,
					longLines: true,
				}),
			},
		]
	}
	if (personVariant === 'participant') {
		return [
			{
				chat: createChatParticipant({
					role: personParticipantRole,
					longLines,
					withAvatar: personClientAvatar,
				}),
			},
			{
				chat: createChatParticipant({
					role: personParticipantRole === 'customer' ? 'freelancer' : 'customer',
					longLines: false,
					withAvatar: personClientAvatar,
				}),
			},
			{
				chat: createChatParticipant({
					role: personParticipantRole,
					longLines: true,
					withAvatar: personClientAvatar,
				}),
			},
		]
	}
	return [
		{
			freelancer: createFreelancerCardData({
				id: 'mock-profile-1',
				longLines: settings.longLines,
				hasAvatar: personClientAvatar,
				bio: !forcedEmptyBio,
			}),
		},
		{
			freelancer: createFreelancerCardData({
				id: 'mock-profile-2',
				longLines: false,
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
				hasAvatar: true,
				hasPreview: true,
				availability: 'weekends',
				portfolioCount: 14,
			}),
		},
	]
}

function buildPortfolioCards(settings: EntityCardsDemoState) {
	const { personClientAvatar, longLines, portfolio, forcedEmptyBio } = settings
	return [
		{
			freelancer: createFreelancerCardData({
				id: 'mock-profile-1',
				longLines,
				hasAvatar: personClientAvatar,
				hasPreview: portfolio,
				bio: !forcedEmptyBio,
			}),
		},
		{
			freelancer: createFreelancerCardData({
				id: 'mock-profile-2',
				longLines: false,
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
				hasAvatar: true,
				hasPreview: true,
				availability: 'weekends',
				portfolioCount: 14,
			}),
		},
	]
}
