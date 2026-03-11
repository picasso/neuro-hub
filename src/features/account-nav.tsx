'use client'

import { usePathname } from 'next/navigation'
import { Link, TS } from '@/ui'
import { cn } from '@/utils'

const navItems = [
	{ href: '/dashboard', label: 'Dashboard' },
	{ href: '/projects', label: 'Проекты' },
	{ href: '/freelancers', label: 'Фрилансеры' },
	{ href: '/post-project', label: 'Разместить проект' },
	{ href: '/api/docs', label: 'API' },
]

export function AccountNav() {
	const pathname = usePathname()

	return (
		<nav aria-label="Навигация кабинета" className="flex flex-col gap-2">
			<TS
				variant="caption"
				color="secondary"
				className="px-3 pt-1 uppercase tracking-[0.2em]"
			>
				Workspace
			</TS>
			{navItems.map(({ href, label }) => {
				const isActive = pathname === href

				return (
					<Link
						key={href}
						href={href}
						color={isActive ? 'primary' : 'secondary'}
						className={cn(
							'rounded-xl px-3 py-2 text-sm transition-colors',
							isActive && 'bg-primary/10 font-medium text-primary',
						)}
						aria-current={isActive ? 'page' : undefined}
					>
						{label}
					</Link>
				)
			})}
		</nav>
	)
}
