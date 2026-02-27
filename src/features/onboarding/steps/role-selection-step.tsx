'use client'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useUnit } from 'effector-react'
import { map } from 'lodash'
import type { UserRole } from '@/lib/validations'
import { cn } from '@/lib/utils'
import { $role, setRole } from '@/stores/onboarding'
import { Card, CardContent, TS, Icon, type IconName, CardFooter } from '@/ui'

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
		<Box>
			<Box sx={{ mb: 4, textAlign: 'center' }}>
				<TS variant="h5" gutterBottom content="Выберите вашу роль" />
				<TS
					variant="body"
					color="secondary"
					className="text-sm"
					content="Это поможет нам персонализировать ваш опыт"
				/>
			</Box>

			<Grid container spacing={3} sx={{ mb: 4 }}>
				{map(roleOptions, (option) => {
					const isSelected = selectedRole === option.value
					return (
						<Grid size={{ xs: 12, md: 6 }} key={option.value}>
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
								className="cursor-pointer max-w-auto transition-all duration-200 hover:shadow-md"
							>
								<CardContent className="pt-8 text-center">
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
								</CardContent>
								<CardFooter className="p-6">
									<TS
										variant="subtitle"
										color="dimmed"
										content={option.description}
									/>
								</CardFooter>
							</Card>
						</Grid>
					)
				})}
			</Grid>
		</Box>
	)
}
