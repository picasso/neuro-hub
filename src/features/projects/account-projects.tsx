import { redirect } from 'next/navigation'
import { PendingContent } from '../account-pending'
import { ProjectCard } from '../entity-cards/project-card'
import { getAccountContext } from '@/lib/account'
import { listClientProjects } from '@/lib/db/queries/projects'
import { Button, Empty, Stack, TS } from '@/ui'

export async function AccountProjects() {
	const context = await getAccountContext()
	if (!context) redirect('/login?from=/account/projects')
	if (context.session.user.role !== 'client') {
		return (
			<PendingContent
				icon="construction"
				description="Проекты доступны только для клиентов. Для фрилансеров этот раздел не используется."
			/>
		)
	}

	const items = await listClientProjects({
		clientId: context.session.user.id,
	})

	return (
		<Stack vertical gap={5} align="stretch" className="w-full min-w-0">
			<Stack
				vertical
				gap={3}
				align="stretch"
				className="md:flex-row md:items-start md:justify-between"
			>
				<Stack vertical gap={2} align="stretch">
					<TS clean variant="h3" content="Мои проекты" />
					<TS
						variant="body"
						color="secondary"
						content="Управляйте всеми проектами аккаунта, включая черновики, опубликованные и завершённые."
					/>
				</Stack>
				<Button href="/account/projects/new" label="Создать проект" />
			</Stack>

			{items.length === 0 ? (
				<Empty
					outline
					fullWidth
					align="start"
					icon="folder-kanban"
					title="У вас пока нет проектов"
					helper="Создайте первый проект, чтобы собрать отклики и управлять наймом из аккаунта клиента."
				>
					<Button href="/account/projects/new" label="Создать проект" />
				</Empty>
			) : (
				<div className="grid gap-2 md:grid-cols-1 xl:grid-cols-2">
					{items.map((item) => (
						<ProjectCard key={item.id} item={item} />
					))}
				</div>
			)}
		</Stack>
	)
}
