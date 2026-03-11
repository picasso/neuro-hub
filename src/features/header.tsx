import { HeaderAuthControls } from './header-auth-controls'
import { getSession } from '@/lib/auth/server'
import { Button, Link, PageContainer, Stack, TS } from '@/ui'

const guestNavItems = [
	{ href: '/projects', label: 'Проекты' },
	{ href: '/freelancers', label: 'Фрилансеры' },
	{ href: '/how-it-works', label: 'Как это работает' },
	{ href: '/api/reference', label: 'API' },
]

const authedNavItems = [
	{ href: '/projects', label: 'Проекты' },
	{ href: '/freelancers', label: 'Фрилансеры' },
	{ href: '/api/reference', label: 'API' },
]

export async function MarketingHeader() {
	const session = await getSession()
	const navItems = session ? authedNavItems : guestNavItems

	return (
		<header className="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/85">
			<PageContainer width="desktop" className="py-4 md:py-5">
				<Stack wrap gap={3} justify="space-between" className="md:flex-nowrap md:gap-6">
					<Stack wrap className="min-w-0 flex-1 gap-3 md:flex-nowrap md:gap-8">
						<Link
							href="/"
							className="inline-flex shrink-0 items-center whitespace-nowrap"
						>
							<TS variant="h5" clean strong content="NeuroGig" />
						</Link>

						<nav aria-label="Primary navigation" className="min-w-0 flex-1">
							<Stack wrap className="gap-x-5 gap-y-2">
								{navItems.map(({ href, label }) => (
									<Link
										key={href}
										href={href}
										hover="vivid"
										size="sm"
										color="secondary"
										label={label}
									/>
								))}
								{process.env.NODE_ENV === 'development' && (
									<Button
										href="/playground"
										variant="ghost"
										size="sm"
										label="Playground"
										leftIcon="code"
										className="text-dimmed border border-dashed border-border-dark"
									/>
								)}
							</Stack>
						</nav>
					</Stack>

					<Stack wrap justify="flex-end" className="shrink-0 gap-x-2 gap-y-2">
						{session ? (
							<HeaderAuthControls
								email={session.user.email}
								name={session.user.name}
								variant="marketing"
								slot={<Button href="/dashboard" size="sm" label="Dashboard" />}
							/>
						) : (
							<>
								<Button href="/login" variant="ghost" size="sm" label="Login" />
								<Button href="/signup" size="sm" label="Signup" />
							</>
						)}
					</Stack>
				</Stack>
			</PageContainer>
		</header>
	)
}
