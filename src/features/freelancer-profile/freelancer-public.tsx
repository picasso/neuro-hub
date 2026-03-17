'use client'

import type { PublicFreelancerProfile } from '@/lib/db/queries/freelancers'
import { Portfolio } from '@/features/portfolio/portfolio'
import { Badge, Card, Empty, Stack, TS } from '@/ui'
import { pluralizeRuWithCount } from '@/utils'

export function FreelancerPublic({ profile }: { profile: PublicFreelancerProfile }) {
	return (
		<Stack vertical gap={6} align="stretch">
			<Card
				fullWidth
				title="О себе"
				description="Краткое описание опыта, специализации и подхода к работе."
			>
				{profile.userProfile?.bio ? (
					<TS
						variant="body"
						color="secondary"
						className="whitespace-pre-line"
						content={profile.userProfile.bio}
					/>
				) : (
					<Empty
						outline
						compact
						fullWidth
						align="start"
						title="Описание пока не добавлено"
						helper="Пользователь еще не заполнил публичный блок с рассказом о себе."
					/>
				)}
			</Card>

			<Card
				fullWidth
				title="Навыки"
				description="Ключевые компетенции и текущий уровень владения."
				badge={pluralizeRuWithCount(profile.skills.length, 'skill')}
			>
				{profile.skills.length === 0 ? (
					<Empty
						outline
						compact
						fullWidth
						align="start"
						title="Навыки не указаны"
						helper="Когда пользователь заполнит профиль, здесь появится список подтвержденных навыков."
					/>
				) : (
					<Stack wrap gap={2} align="start">
						{profile.skills.map((skill) => (
							<Badge
								key={skill.skillId}
								variant="outline"
								size="xs"
								color="secondary"
								icon="badge-check"
							>
								{skill.skill.name} · {levelLabel(skill.proficiencyLevel)}
							</Badge>
						))}
					</Stack>
				)}
			</Card>

			<Card
				fullWidth
				title="Портфолио"
				description="Галерея работ с готовым предпросмотром медиа через PortfolioViewer."
				badge={pluralizeRuWithCount(profile.portfolio.length, 'work')}
			>
				{profile.portfolio.length === 0 ? (
					<Empty
						outline
						compact
						fullWidth
						align="start"
						icon="collections-bookmark"
						title="Портфолио пока пустое"
						helper="Когда пользователь добавит кейсы, здесь появится галерея работ с предпросмотром."
					/>
				) : (
					<Portfolio items={profile.portfolio} />
				)}
			</Card>

			<div className="grid gap-6 md:grid-cols-2">
				<Card
					fullWidth
					title="Отзывы"
					description="Отзывы клиентов о работе с фрилансером."
				>
					<Empty
						outline
						compact
						fullWidth
						align="start"
						mediaIcon="center"
						icon="message-circle-check"
						title="Отзывы появятся позже"
						helper="Раздел отзывов будет добавлен на следующих этапах разработки публичного профиля."
					/>
				</Card>

				<Card
					fullWidth
					title="Статистика"
					description="Метрики по проектам, заказам и активности."
				>
					<Empty
						outline
						compact
						fullWidth
						align="start"
						mediaIcon="center"
						icon="chart-area"
						title="Статистика пока недоступна"
						helper="Для расчета показателей нужны данные по проектам, заказам и завершенным сделкам."
					/>
				</Card>
			</div>
		</Stack>
	)
}

function levelLabel(level: string | null) {
	switch (level) {
		case 'beginner':
			return 'Beginner'
		case 'intermediate':
			return 'Intermediate'
		case 'advanced':
			return 'Advanced'
		case 'expert':
			return 'Expert'
		default:
			return '—'
	}
}
