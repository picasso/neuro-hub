'use client'

import { Skills } from '../entity-cards/skills'
import type { PublicFreelancerProfile } from '@/lib/db/queries/freelancers'
import { Card, Empty, Stack, Portfolio } from '@/ui'
import { pluralizeRuWithCount } from '@/utils'

export function FreelancerPublic({ profile }: { profile: PublicFreelancerProfile }) {
	return (
		<Stack vertical gap={6} align="stretch">
			<Card
				fullWidth
				title="Навыки"
				description="Ключевые компетенции и текущий уровень владения."
				badge={pluralizeRuWithCount(profile.skills.length, 'skill')}
				gap="none"
			>
				{profile.skills.length === 0 ? (
					<Empty
						outline
						compact
						fullWidth
						dark
						align="start"
						mediaIcon="start"
						icon="brain-circuit"
						title="Навыки не указаны"
						helper={{
							helper: 'Когда пользователь заполнит профиль,\nздесь появится список подтвержденных навыков.',
							md: { br: true },
						}}
					/>
				) : (
					<Skills withLevel variant="secondary" skills={profile.skills} />
				)}
			</Card>

			<Card
				fullWidth
				title="Портфолио"
				description="Галерея работ с готовым предпросмотром медиа через PortfolioViewer."
				badge={pluralizeRuWithCount(profile.portfolio.length, 'work')}
				gap="none"
			>
				{profile.portfolio.length === 0 ? (
					<Empty
						outline
						compact
						fullWidth
						dark
						align="start"
						mediaIcon="start"
						icon="book-marked"
						title="Портфолио пока пустое"
						helper={{
							helper: 'Когда пользователь добавит кейсы,\nздесь появится галерея работ с предпросмотром.',
							md: { br: true },
						}}
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
					gap="none"
				>
					<Empty
						outline
						compact
						fullWidth
						dark
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
					gap="none"
				>
					<Empty
						outline
						compact
						fullWidth
						dark
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
