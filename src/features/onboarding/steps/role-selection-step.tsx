'use client'

import { useUnit } from 'effector-react'
import { map } from 'lodash'
import type { UserRole } from '@/lib/validations'
import { $role, setRole } from '@/stores'
import { Icon, TS, type IconName, Card } from '@/ui'
import { cn } from '@/utils'

type RoleOption = {
	value: UserRole
	title: string
	description: string
	icon: IconName
}

const roleOptions: RoleOption[] = [
	{
		value: 'freelancer',
		title: 'Фрилансер',
		description: 'Я ищу интересные проекты и хочу применить свои навыки в AI',
		icon: 'person',
	},
	{
		value: 'client',
		title: 'Заказчик',
		description: 'Мне нужны специалисты для реализации AI-проектов',
		icon: 'business',
	},
]

export function RoleSelectionStep() {
	const selectedRole = useUnit($role)

	return (
		<Card
			title="Выберите вашу роль"
			description="Это поможет нам персонализировать ваш опыт"
			className="border-none"
			headerClassName="justify-center text-center"
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
				{map(roleOptions, (option) => {
					const isSelected = selectedRole === option.value
					return (
						<div key={option.value}>
							<Card
								role="button"
								tabIndex={0}
								onClick={() => setRole(option.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault()
										setRole(option.value)
									}
								}}
								className="cursor-pointer max-w-auto transition-all duration-200 hover:shadow-sm"
								contentClassName="pt-8 text-center"
								footerClassName="p-6 text-center text-muted-foreground"
								footer={option.description}
							>
								<Icon
									name={option.icon}
									size={60}
									className={cn(
										'mx-auto mb-4 rounded-full transition-colors duration-200',
										'outline-8 hover:outline-primary',
										isSelected
											? 'bg-primary text-primary-foreground outline-primary'
											: 'bg-muted text-muted-foreground outline-muted',
										'hover:bg-primary hover:text-primary-foreground',
									)}
								/>
								<TS variant="h5" content={option.title} />
							</Card>
						</div>
					)
				})}
			</div>
		</Card>
	)
}
