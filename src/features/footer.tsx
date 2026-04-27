import { config, contactContent } from '@/config'
import { Badge, Icon, IconButton, Link, PageContainer, Stack, TS } from '@/ui'

const platformLinks = [
	{ href: '/projects', label: 'Проекты' },
	{ href: '/freelancers', label: 'Фрилансеры' },
	{ href: '/post-project', label: 'Разместить проект' },
	{ href: '/how-it-works', label: 'Как это работает' },
]

const resourceLinks = [{ href: '/api/reference', label: 'API for developers' }]

const socialLinks = [
	{ href: contactContent.social.github, icon: 'github' as const, label: 'GitHub' },
	{ href: contactContent.social.twitter, icon: 'x-twitter' as const, label: 'X / Twitter' },
	{ href: contactContent.social.linkedin, icon: 'linked-in' as const, label: 'LinkedIn' },
	{ href: contactContent.social.telegram, icon: 'telegram' as const, label: 'Telegram' },
]

export function MarketingFooter() {
	return (
		<footer className="mt-auto border-t border-primary/25 bg-linear-to-b from-primary/12 via-primary/6 to-muted/30">
			<PageContainer width="desktop" className="py-10 md:py-12">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-10">
					<Stack vertical align="start" gap={3}>
						<Stack gap={2}>
							<TS variant="h5" clean strong content="NeuroGig" />
							<Badge
								icon="check"
								variant="outline"
								color="secondary"
								label={config.version}
								size="xs"
							/>
						</Stack>
						<TS
							variant="subtitle"
							color="secondary"
							className="max-w-md leading-6"
							content="Платформа для проектов и найма специалистов по генеративному ИИ."
						/>
					</Stack>

					<Stack vertical align="start" gap={3}>
						<TS variant="h5" clean content="Платформа" />
						<nav aria-label="Навигация footer">
							<Stack vertical align="start" gap={2}>
								{platformLinks.map(({ href, label }) => (
									<Link
										key={href}
										href={href}
										size="sm"
										color="secondary"
										hover="vivid"
										label={label}
									/>
								))}
							</Stack>
						</nav>
					</Stack>

					<Stack vertical align="start" gap={3}>
						<TS variant="h5" clean content="Ресурсы и контакты" />
						<Stack vertical align="start" gap={2}>
							{resourceLinks.map(({ href, label }) => (
								<Link
									key={href}
									href={href}
									size="sm"
									color="secondary"
									hover="vivid"
									label={label}
								/>
							))}
							<Stack gap={2}>
								<Icon name="mail" size={16} color="dimmed" />
								<Link
									href={`mailto:${contactContent.email}`}
									size="sm"
									color="secondary"
									hover="underline"
									label={contactContent.email}
								/>
							</Stack>
						</Stack>
						<Stack gap={2}>
							{socialLinks.map(({ href, icon, label }) => (
								<IconButton
									key={href}
									rounded
									variant="ghost"
									icon={icon}
									href={href}
									target="_blank"
									rel="noopener noreferrer"
									size="icon"
									forceSize="md"
									className="border border-border/80 bg-background/75 hover:bg-background"
									title={label}
								/>
							))}
						</Stack>
					</Stack>
				</div>

				<Stack
					justify="space-between"
					wrap
					className="mt-8 border-t border-border pt-4 text-center md:text-left"
				>
					<TS
						variant="caption"
						color="secondary"
						clean
						content={`© ${new Date().getFullYear()} NeuroGig. Все права защищены.`}
					/>
					<TS
						variant="caption"
						color="secondary"
						clean
						content="Маркетинговый слой платформы: доверие, навигация и контакты."
					/>
				</Stack>
			</PageContainer>
		</footer>
	)
}
