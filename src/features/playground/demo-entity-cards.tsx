'use client'

import { map, shuffle } from 'lodash'
import { useMemo, useState } from 'react'
import { ApplicationCard } from '../entity-cards/application-card'
// import { PersonCard } from '../entity-cards/person-card'
import { ProjectCard } from '../entity-cards/project-card'
import { DemoRoot, DemoSection } from './components-utils'
import { type EntityCardsDemoState } from './demo-entity-cards-settings'
import { pictures } from './pictures'
import { useSettings } from './settings-store'
import type { ChatParticipantSummary } from '@/lib/chat/contracts'
import type { PublicFreelancerGridItem } from '@/lib/db/queries/freelancers'
import type {
	FreelancerApplicationListItem,
	PublicProjectListItem,
} from '@/lib/db/queries/projects'
import { Stack, Tabs, type TabItem } from '@/ui'

type EntityTab = 'project' | 'person' | 'application'

export function DemoEntityCards() {
	const settings = useSettings<EntityCardsDemoState>()
	const { longLines, full, image, personVariant: _, personClientAvatar: __ } = settings
	const [activeTab, setActiveTab] = useState<EntityTab>('project')
	const projectItems = useMemo(() => buildProjectCards(longLines), [longLines])
	const personCards = useMemo(() => buildPersonCards(settings), [settings])
	const applicationCards = useMemo(
		() => buildApplicationCards(settings, projectItems),
		[settings, projectItems],
	)

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const mockUrls = useMemo(() => mockImages(), [image])
	const mockUrl = mockUrls[0]

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
					{/* <PersonCard variant={personVariant} client={card.client} full={full} /> */}
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
					<ApplicationCard application={applicationCards[0]} full={full} />
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
						? personCards.map((card) => (
								<div
									key={card.id}
									className={
										settings.full
											? 'min-w-70 max-w-md flex-1'
											: 'min-w-70 max-w-sm flex-1'
									}
								>
									{renderPersonCard(card, full) ?? null}
								</div>
							))
						: null}
					{activeTab === 'application'
						? applicationCards.map((application) => (
								<div key={application.id} className="min-w-70 max-w-xl flex-1">
									<ApplicationCard application={application} full={full} />
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
			id: string
			variant: 'client'
			client: ReturnType<typeof buildProjectClient>
	  }
	| {
			id: string
			variant: 'participant'
			participant: ChatParticipantSummary
	  }
	| {
			id: string
			variant: 'freelancer'
			freelancer: ReturnType<typeof buildFreelancerCardData>
	  }

function renderPersonCard(card: PersonPreviewCard, full: boolean) {
	if (card.variant === 'client' || full) {
		// 	return <PersonCard variant="client" client={card.client} full={full} />
	}
	// if (card.variant === 'participant') {
	// 	return <PersonCard variant="participant" participant={card.participant} full={full} />
	// }
	// return <PersonCard variant="freelancer" freelancer={card.freelancer} full={full} />
}

const mockImages = () => map(shuffle(pictures), (picture) => `/playground/pictures/${picture.file}`)
const randomUrls = mockImages()

// const MOCK_IMAGE_URL =
// 	'https://bycp5hmwsix5qx2u.public.blob.vercel-storage.com/portfolio/XD5LXKVkaPXvPFDNS0tfwYWPeirXGbT2/fantasy-01-QlbQcYix5SMh60NYLd8fg2BBF1E3Ei.jpg'

const MOCK_CLIENT_BASE = {
	userId: 'user-client-1',
	name: 'Анна Орлова',
	companyName: 'ООО «НейроЛаб»',
	companyRole: 'Product lead',
	avatarUrl: randomUrls[0],
} as const

function buildProjectClient(withAvatar: boolean, longLines: boolean) {
	return {
		...MOCK_CLIENT_BASE,
		name: longLines
			? `${MOCK_CLIENT_BASE.name} — очень длинное отображаемое имя для переносов`
			: MOCK_CLIENT_BASE.name,
		companyName: longLines
			? `${MOCK_CLIENT_BASE.companyName} и ещё немного юридического текста в одну строку`
			: MOCK_CLIENT_BASE.companyName,
		companyRole: longLines
			? `${MOCK_CLIENT_BASE.companyRole} / AI`
			: MOCK_CLIENT_BASE.companyRole,
		avatarUrl: withAvatar ? MOCK_CLIENT_BASE.avatarUrl : null,
	}
}

function buildChatParticipant(
	role: ChatParticipantSummary['role'],
	longLines: boolean,
): ChatParticipantSummary {
	return {
		id: 'part-1',
		name: longLines
			? 'Константин Волков-Смирновский (участник с длинным именем)'
			: 'Константин Волков',
		image: randomUrls[1],
		role,
	}
}

function buildFreelancerCardData(
	id: string,
	longLines: boolean,
	options?: {
		hasAvatar?: boolean
		hasPreview?: boolean
		availability?: string | null
		portfolioCount?: number
	},
): Pick<
	PublicFreelancerGridItem,
	| 'href'
	| 'name'
	| 'avatarUrl'
	| 'specialization'
	| 'bioSnippet'
	| 'hourlyRate'
	| 'availability'
	| 'topSkills'
	| 'portfolioCount'
	| 'latestPortfolioItem'
> {
	const hasAvatar = options?.hasAvatar ?? true
	const hasPreview = options?.hasPreview ?? true
	return {
		href: `/freelancers/${id}`,
		name: longLines
			? 'Елена Соколова — генеративный дизайн и визуальные пайплайны'
			: 'Елена Соколова',
		avatarUrl: hasAvatar ? randomUrls[2] : null,
		specialization: longLines
			? 'Stable Diffusion, ComfyUI, кастомные LoRA, пост-продакшн и короткие циклы итераций с заказчиком'
			: 'Generative visuals · SD · ComfyUI',
		bioSnippet: longLines
			? 'Помогаю AI-командам собирать production-ready пайплайны визуальной генерации: от поиска визуального направления до настройки inference, контроля качества и передачи процессов команде клиента.'
			: 'Production-ready visual pipelines for image generation teams.',
		hourlyRate: 65,
		availability: options?.availability ?? 'part-time',
		topSkills: [
			{
				id: `${id}-skill-1`,
				name: 'Stable Diffusion',
				category: 'image_generation',
				proficiencyLevel: 'advanced',
			},
			{
				id: `${id}-skill-2`,
				name: 'ComfyUI',
				category: 'image_generation',
				proficiencyLevel: 'advanced',
			},
			{
				id: `${id}-skill-3`,
				name: 'LoRA training',
				category: 'image_generation',
				proficiencyLevel: 'intermediate',
			},
			{
				id: `${id}-skill-4`,
				name: 'Prompt design',
				category: 'consulting',
				proficiencyLevel: 'advanced',
			},
		],
		portfolioCount: options?.portfolioCount ?? 8,
		latestPortfolioItem: hasPreview
			? {
					id: `${id}-portfolio-item-1`,
					title: longLines
						? 'Редизайн hero-визуалов для AI SaaS с вариативной генерацией и art direction'
						: 'AI SaaS hero visuals',
					mediaUrl: randomUrls[3],
					mediaType: 'image/jpeg',
					category: 'branding',
				}
			: null,
	}
}

function buildProjectCards(longText: boolean): PublicProjectListItem[] {
	return [
		buildPublicProjectListItem('proj-mock-1', longText, 'published'),
		buildPublicProjectListItem('proj-mock-2', false, 'published'),
		buildPublicProjectListItem('proj-mock-3', true, 'published'),
	]
}

function buildPublicProjectListItem(
	id: string,
	longText: boolean,
	status: PublicProjectListItem['status'],
): PublicProjectListItem {
	const title = longText
		? 'Миграция inference-пайплайна на GPU-кластер с SLA и мониторингом качества выдачи'
		: 'Inference-пайплайн на GPU'
	const descriptionSnippet = longText
		? 'Нужно перенести текущий сервис генерации изображений на выделенный кластер, добавить очереди, бюджеты по токенам и отчёты по качеству. Важно сохранить совместимость с текущим API и не останавливать прод на время работ.'
		: 'Перенос сервиса генерации на GPU-кластер с очередями и отчётами.'
	const deadline =
		id === 'proj-mock-2'
			? new Date('2026-06-10T18:00:00.000Z')
			: new Date('2026-05-20T18:00:00.000Z')
	const createdAt =
		id === 'proj-mock-3'
			? new Date('2026-03-28T09:30:00.000Z')
			: new Date('2026-04-02T09:30:00.000Z')

	return {
		id,
		href: `/projects/${id}`,
		title,
		descriptionSnippet,
		category: id === 'proj-mock-2' ? 'nlp' : 'image_generation',
		experienceLevel: id === 'proj-mock-3' ? 'senior' : 'middle',
		budgetType: id === 'proj-mock-2' ? 'hourly' : 'fixed',
		budgetMin: id === 'proj-mock-2' ? 3500 : 180000,
		budgetMax: id === 'proj-mock-2' ? 5000 : 260000,
		deadline,
		status,
		createdAt,
		client: buildProjectClient(id !== 'proj-mock-2', longText),
		skills: [
			{ id: `${id}-sk-1`, name: 'PyTorch', category: 'programming' },
			{
				id: `${id}-sk-2`,
				name: id === 'proj-mock-2' ? 'LLM evals' : 'CUDA',
				category: 'programming',
			},
			{
				id: `${id}-sk-3`,
				name: id === 'proj-mock-2' ? 'RAG' : 'Diffusers',
				category: id === 'proj-mock-2' ? 'nlp' : 'image_generation',
			},
			{ id: `${id}-sk-4`, name: 'Docker', category: 'programming' },
			{ id: `${id}-sk-5`, name: 'Observability', category: 'consulting' },
		],
	}
}

function buildPersonCards(settings: EntityCardsDemoState): PersonPreviewCard[] {
	if (settings.personVariant === 'client') {
		return [
			{
				id: 'client-1',
				variant: 'client',
				client: buildProjectClient(settings.personClientAvatar, settings.longLines),
			},
			{ id: 'client-2', variant: 'client', client: buildProjectClient(false, false) },
			{ id: 'client-3', variant: 'client', client: buildProjectClient(true, true) },
		]
	}
	if (settings.personVariant === 'participant') {
		return [
			{
				id: 'participant-1',
				variant: 'participant',
				participant: buildChatParticipant(
					settings.personParticipantRole,
					settings.longLines,
				),
			},
			{
				id: 'participant-2',
				variant: 'participant',
				participant: buildChatParticipant(
					settings.personParticipantRole === 'customer' ? 'freelancer' : 'customer',
					false,
				),
			},
			{
				id: 'participant-3',
				variant: 'participant',
				participant: buildChatParticipant(settings.personParticipantRole, true),
			},
		]
	}
	return [
		{
			id: 'freelancer-1',
			variant: 'freelancer',
			freelancer: buildFreelancerCardData('mock-profile-1', settings.longLines),
		},
		{
			id: 'freelancer-2',
			variant: 'freelancer',
			freelancer: buildFreelancerCardData('mock-profile-2', false, {
				hasAvatar: false,
				hasPreview: false,
				availability: 'full-time',
				portfolioCount: 2,
			}),
		},
		{
			id: 'freelancer-3',
			variant: 'freelancer',
			freelancer: buildFreelancerCardData('mock-profile-3', true, {
				hasAvatar: true,
				hasPreview: true,
				availability: 'weekends',
				portfolioCount: 14,
			}),
		},
	]
}

function buildApplicationCards(
	settings: EntityCardsDemoState,
	projectItems: PublicProjectListItem[],
): FreelancerApplicationListItem[] {
	const statuses = [
		settings.applicationStatus,
		'shortlisted',
		'accepted',
	] as FreelancerApplicationListItem['status'][]

	return statuses.map((status, index) =>
		buildFreelancerApplication(
			status,
			projectItems[index % projectItems.length],
			`app-mock-${index + 1}`,
		),
	)
}

function buildFreelancerApplication(
	status: FreelancerApplicationListItem['status'],
	projectSource: PublicProjectListItem,
	id: string,
): FreelancerApplicationListItem {
	const project = projectSource
	return {
		id,
		status,
		coverLetter:
			'Привет! Уже вёл похожие миграции для SD-команд: очереди на BullMQ, отдельный воркер-пул на A100, метрики по латентности и SSIM. Готов начать с аудита текущего деплоя и плана cutover без простоя.',
		proposedPrice: 195000,
		proposedDeadline: new Date('2026-06-01T12:00:00.000Z'),
		createdAt: new Date('2026-04-05T14:12:00.000Z'),
		updatedAt: new Date('2026-04-06T08:00:00.000Z'),
		project: {
			id: project.id,
			href: project.href,
			title: project.title,
			category: project.category,
			experienceLevel: project.experienceLevel,
			budgetType: project.budgetType,
			budgetMin: project.budgetMin,
			budgetMax: project.budgetMax,
			deadline: project.deadline,
			status: project.status,
			client: project.client,
			skills: project.skills,
		},
	}
}
