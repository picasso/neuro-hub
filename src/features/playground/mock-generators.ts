import dayjs from 'dayjs'
import { indexOf, map, random, reduce, shuffle, uniqueId } from 'lodash'
import {
	genCoverUrl,
	genAvatarUrl,
	dates,
	getPictureUrl,
	mediaUrls,
	text,
	getPortfolio,
} from './mock'
import { pictures } from './pictures'
import type { ChatParticipantSummary } from '@/lib/chat/contracts'
import type { PublicFreelancerGridItem } from '@/lib/db/queries/freelancers'
import type {
	FreelancerApplicationListItem,
	PublicProjectListItem,
} from '@/lib/db/queries/projects'
import type { MediaItem } from '@/ui'

export type TimePreset = 'today' | 'yesterday' | 'recent' | 'weeks' | 'old' | 'random'

export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'error'

export function getTime(when: TimePreset = 'random') {
	if (when === 'today') return dayjs().utc().toISOString()
	if (when === 'yesterday') return dayjs().subtract(1, 'day').utc().toISOString()
	if (when === 'recent') return dayjs().subtract(random(2, 6), 'days').utc().toISOString()
	if (when === 'weeks') return dayjs().subtract(random(7, 100), 'days').utc().toISOString()
	if (when === 'old') return dayjs().subtract(random(340, 400), 'days').utc().toISOString()
	return dayjs().subtract(random(0, 14), 'days').utc().toISOString()
}

export function createShuffledPictureUrls() {
	return map(shuffle(pictures), (picture) => getPictureUrl(picture.file))
}

export function getNextConnectionStatus(prev: ConnectionStatus): ConnectionStatus {
	const statuses: ConnectionStatus[] = ['idle', 'connecting', 'connected', 'error']
	const index = indexOf(statuses, prev)

	return statuses[(index + 1) % statuses.length]!
}

export function createMessagePair() {
	return {
		in: {
			direction: 'in' as const,
			text: 'Привет! Это входящее сообщение с нейтральной bubble.',
			createdAt: getTime('recent'),
		},
		out: {
			direction: 'out' as const,
			text: 'Исходящее: pale primary, время + статус справа.',
			createdAt: getTime('yesterday'),
		},
	}
}

export function createScrollMessages(options?: { count?: number }) {
	const count = options?.count ?? 28

	return Array.from({ length: count }, (_, index) => {
		const direction = (['in', 'out'] as const)[index % 2]

		return {
			id: `scroll-${index}`,
			direction,
			text: `Сообщение ${index + 1}. Небольшой текст для проверки прокрутки области треда.`,
			createdAt: getTime(),
			...(direction === 'out' ? { status: 'sent' as const } : {}),
		}
	})
}

export function createChatRows(options?: { avatarUrl?: string | null }) {
	const avatarUrl = options?.avatarUrl ?? null

	return [
		{
			id: 'a',
			name: 'Команда NeuroGig',
			lastMessageText: text.preview.short,
			updatedAt: getTime('yesterday'),
			unreadCount: 3,
		},
		{
			id: 'b',
			name: 'Длинное имя чата для проверки обрезки и выравнивания',
			lastMessageText:
				'Очень длинный последний текст сообщения, который должен аккуратно обрезаться с многоточием в списке',
			updatedAt: getTime('recent'),
			unreadCount: 0,
		},
		{
			id: 'c',
			image: avatarUrl ?? undefined,
			name: 'Димон Отстань от меня',
			lastMessageText:
				'The main chat page was moved to the right layers, but the conversation-open flow is still exposed as an imperative API through @/features and then executed directly inside a React component. That leaves request/orchestration/error-routing logic in UI code and weakens the intended',
			updatedAt: getTime('weeks'),
			unreadCount: 200,
		},
		{
			id: 'd',
			name: 'Без непрочитанных',
			lastMessageText: 'Ок',
			updatedAt: getTime('today'),
			unreadCount: 0,
		},
	]
}

const clientBase = {
	userId: 'user-client-1',
	name: 'Анна Орлова',
	nickname: 'anna-orlova',
	companyName: 'ООО «НейроЛаб»',
	companyRole: 'Product lead',
	location: 'Belgrade, Serbia',
	languages: [
		{ code: 'ru', name: 'Russian', nativeName: 'Русский', langLevel: 'native' },
		{ code: 'en', name: 'English', nativeName: 'English', langLevel: 'fluent' },
	],
} as const

const clientBio = `Помогаю AI-командам собирать production-ready пайплайны визуальной генерации:
от поиска визуального направления до настройки inference,
контроля качества и передачи процессов команде клиента.`

export function createProjectClient(options?: { withAvatar?: boolean; longLines?: boolean }) {
	const { withAvatar, longLines } = options ?? {}

	return {
		...clientBase,
		name: longLines
			? `${clientBase.name} — очень длинное отображаемое имя для переносов`
			: clientBase.name,
		companyName: longLines
			? `${clientBase.companyName} и ещё немного юридического текста в одну строку`
			: clientBase.companyName,
		companyRole: longLines ? `${clientBase.companyRole} / AI` : clientBase.companyRole,
		avatarUrl: withAvatar ? genAvatarUrl() : null,
		location: clientBase.location,
		languages: [...clientBase.languages],
		bio: clientBio,
	}
}

export function createChatParticipant(options: {
	role: ChatParticipantSummary['role']
	longLines?: boolean
	withAvatar?: boolean
}): ChatParticipantSummary {
	return {
		id: 'part-1',
		name: options.longLines
			? 'Константин Волков-Смирновский (участник с длинным именем)'
			: 'Константин Волков',
		image: options.withAvatar ? genAvatarUrl() : null,
		role: options.role,
	}
}

export function createFreelancerCardData(options: {
	id: string
	longLines?: boolean
	hasAvatar?: boolean
	hasPreview?: boolean
	availability?: string | null
	portfolioCount?: number
	bio?: boolean
}): PublicFreelancerGridItem & { portfolio: PublicFreelancerGridItem['latestPortfolioItem'][] } {
	const {
		id,
		longLines,
		hasAvatar,
		hasPreview,
		availability = 'part-time',
		portfolioCount = 9,
		bio,
	} = options

	const nickname = 'socol-lena'
	const portfolio = getPortfolio()
	const lastItem = portfolio[portfolio.length - 1]

	return {
		freelancerProfileId: id,
		nickname,
		skillCategories: ['image_generation', 'consulting'],
		href: `/freelancers/${nickname}`,
		name: longLines
			? 'Елена Соколова — генеративный дизайн и визуальные пайплайны'
			: 'Елена Соколова',
		avatarUrl: hasAvatar ? genAvatarUrl() : null,
		location: 'Tbilisi, Georgia',
		languages: [
			{ code: 'ru', name: 'Russian', nativeName: 'Русский', langLevel: 'native' },
			{ code: 'it', name: 'Italian', nativeName: 'Italiano', langLevel: 'basic' },
		],
		bio: bio
			? longLines
				? 'Помогаю AI-командам собирать production-ready пайплайны визуальной генерации: от поиска визуального направления до настройки inference, контроля качества и передачи процессов команде клиента.'
				: 'Production-ready visual pipelines for image generation teams.'
			: null,
		specialization: longLines
			? 'Stable Diffusion, ComfyUI, кастомные LoRA, пост-продакшн и короткие циклы итераций с заказчиком'
			: 'Generative visuals · SD · ComfyUI',
		hourlyRate: random(1500, 5000),
		availability,
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
		portfolioCount,
		latestPortfolioItem: hasPreview
			? {
					id: `${lastItem.id}-portfolio-item-1`,
					title: longLines
						? 'Редизайн hero-визуалов для AI SaaS с вариативной генерацией и art direction'
						: lastItem.title,
					mediaUrl: lastItem.mediaUrl,
					mediaType: lastItem.mediaType,
					category: lastItem.category,
				}
			: null,
		portfolio,
	}
}

export function createPublicProjectListItem(options: {
	id: string
	status: PublicProjectListItem['status']
	longText?: boolean
}) {
	const { id, status, longText = false } = options
	const title = longText
		? 'Миграция inference-пайплайна на GPU-кластер с SLA и мониторингом качества выдачи'
		: 'Inference-пайплайн на GPU'
	const descriptionSnippet = longText
		? 'Нужно перенести текущий сервис генерации изображений на выделенный кластер, добавить очереди, бюджеты по токенам и отчёты по качеству. Важно сохранить совместимость с текущим API и не останавливать прод на время работ.'
		: 'Перенос сервиса генерации на GPU-кластер с очередями и отчётами.'
	const deadline = id === 'proj-mock-2' ? dates.jun_10 : dates.may_20
	const createdAt = id === 'proj-mock-3' ? dates.mar_28 : dates.apr_02

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
		coverUrl: genCoverUrl(),
		createdAt,
		client: createProjectClient({
			withAvatar: id !== 'proj-mock-2',
			longLines: longText,
		}),
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

export function createProjectCards(options?: { longText?: boolean; withAvatar?: boolean }) {
	const { longText = false } = options ?? {}

	return [
		createPublicProjectListItem({
			id: 'proj-mock-1',
			longText,
			status: 'published',
		}),
		createPublicProjectListItem({
			id: 'proj-mock-2',
			longText: false,
			status: 'published',
		}),
		createPublicProjectListItem({
			id: 'proj-mock-3',
			longText: true,
			status: 'published',
		}),
	]
}

export function createFreelancerApplication(options: {
	id: string
	status: FreelancerApplicationListItem['status']
	projectSource: PublicProjectListItem
}) {
	const { id, status, projectSource } = options

	return {
		id,
		status,
		coverLetter:
			'Привет! Уже вёл похожие миграции для SD-команд: очереди на BullMQ, отдельный воркер-пул на A100, метрики по латентности и SSIM. Готов начать с аудита текущего деплоя и плана cutover без простоя.',
		proposedPrice: 195000,
		proposedDeadline: dates.jun_01,
		createdAt: dates.apr_05,
		updatedAt: dates.apr_06,
		project: {
			id: projectSource.id,
			href: projectSource.href,
			title: projectSource.title,
			category: projectSource.category,
			experienceLevel: projectSource.experienceLevel,
			budgetType: projectSource.budgetType,
			budgetMin: projectSource.budgetMin,
			budgetMax: projectSource.budgetMax,
			deadline: projectSource.deadline,
			status: projectSource.status,
			coverUrl: projectSource.coverUrl,
			client: projectSource.client,
			skills: projectSource.skills,
		},
	}
}

export function createApplicationCards(options: {
	applicationStatus: FreelancerApplicationListItem['status']
	projectItems: PublicProjectListItem[]
}) {
	const statuses: FreelancerApplicationListItem['status'][] = [
		options.applicationStatus,
		'shortlisted',
		'accepted',
	]

	return map(statuses, (status, index) =>
		createFreelancerApplication({
			id: `app-mock-${index + 1}`,
			status,
			projectSource: options.projectItems[index % options.projectItems.length]!,
		}),
	)
}

export function createPortfolioItems(options?: { onlyImages?: boolean }) {
	const onlyImages = options?.onlyImages ?? false
	const itemCount = pictures.length
	const indexes: number[] = []

	while (indexes.length < 3) {
		const index = random(0, itemCount - 1)
		if (!indexes.includes(index)) indexes.push(index)
	}

	return reduce(
		shuffle(pictures),
		(acc, picture, index) => {
			if (!onlyImages) {
				if (index === indexes[0]) {
					acc.push({
						id: uniqueId('video-'),
						title: 'Video item',
						mediaUrl: mediaUrls.video,
						mediaType: 'video/mp4',
					})
				}
				if (index === indexes[1]) {
					acc.push({
						id: uniqueId('audio-'),
						title: 'Audio item',
						mediaUrl: mediaUrls.audio,
						mediaType: 'audio/mpeg',
					})
				}
				if (index === indexes[2]) {
					acc.push({
						id: uniqueId('pdf-'),
						title: 'PDF item',
						mediaUrl: mediaUrls.pdf,
						mediaType: 'application/pdf',
					})
				}
			}

			acc.push({
				id: uniqueId('image-'),
				title: picture.file.replace('.jpg', '').replace(/-/g, ' '),
				mediaUrl: getPictureUrl(picture.file),
				mediaType: 'image/jpeg',
				mediaWidth: picture.width,
				mediaHeight: picture.height,
			})

			return acc
		},
		[] as MediaItem[],
	)
}
