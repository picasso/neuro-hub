'use client'

import { config, contactContent } from '@/config'
import { Badge, Icon, IconButton, Link, Stack, TS } from '@/ui'

export function Footer() {
	return (
		<footer
			className="py-12 px-4 mt-auto"
			style={{ background: 'linear-gradient(to bottom, #169e5f, #1dbf73)' }}
		>
			<div className="container max-w-5xl mx-auto">
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
					<div>
						<Stack align="center" gap={2} className="mb-2">
							<TS variant="h5">NeuroGig</TS>
							<Badge
								icon="done"
								variant="outline"
								color="soft"
								label={config.version}
								size="xs"
							/>
						</Stack>
						<TS variant="subtitle" color="soft">
							Платформа для фриланса в сфере генеративного ИИ
						</TS>
					</div>

					<div>
						<TS variant="h5" gutterBottom>
							Для фрилансеров
						</TS>
						<Stack vertical gap={2}>
							<Link href="/projects" color="soft" hover="vivid">
								Найти проекты
							</Link>
							<Link href="/how-it-works" color="soft" hover="vivid">
								Как это работает
							</Link>
						</Stack>
					</div>

					<div>
						<TS variant="h5" gutterBottom>
							Для заказчиков
						</TS>
						<Stack vertical gap={2}>
							<Link href="/freelancers" color="soft" hover="vivid">
								Найти фрилансера
							</Link>
							<Link href="/post-project" color="soft" hover="vivid">
								Разместить проект
							</Link>
						</Stack>
					</div>
				</div>

				<div className="mt-8 pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
					<Stack align="center" gap={2}>
						<Icon name="email" size={20} className="text-white/80" />
						<Link
							href={`mailto:${contactContent.email}`}
							color="contrast"
							hover="underline"
							size="sm"
						>
							{contactContent.email}
						</Link>
					</Stack>

					<Stack gap={2}>
						<IconButton
							rounded
							variant="contrast"
							icon="git-hub"
							href={contactContent.social.github}
							target="_blank"
							rel="noopener noreferrer"
							size="icon"
							forceSize="md"
						/>
						<IconButton
							rounded
							variant="contrast"
							icon="x-twitter"
							href={contactContent.social.twitter}
							target="_blank"
							rel="noopener noreferrer"
							size="icon"
							forceSize="md"
						/>
						<IconButton
							rounded
							variant="contrast"
							icon="linked-in"
							href={contactContent.social.twitter}
							target="_blank"
							rel="noopener noreferrer"
							size="icon"
							forceSize="md"
						/>
						<IconButton
							rounded
							variant="contrast"
							icon="telegram"
							href={contactContent.social.telegram}
							target="_blank"
							rel="noopener noreferrer"
							size="icon"
							forceSize="md"
						/>
					</Stack>
				</div>

				<div className="mt-4 pt-4 border-t border-white/20">
					<TS variant="caption" color="contrast" className="text-center">
						© {new Date().getFullYear()} NeuroGig. Все права защищены.
					</TS>
				</div>
			</div>
		</footer>
	)
}
