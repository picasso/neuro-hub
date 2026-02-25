'use client'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { useUnit } from 'effector-react'
import { map } from 'lodash'
import type { UserRole } from '@/lib/validations'
import type { ReactElement } from 'react'
import { Icon } from '@/components/ui/icon'
import { TS } from '@/components/ui/text-styled'
import { $role, setRole } from '@/stores/onboarding'

type RoleOption = {
	value: UserRole
	title: string
	description: string
	icon: ReactElement
}

const roleOptions: RoleOption[] = [
	{
		value: 'freelancer',
		title: 'Фрилансер',
		description: 'Я ищу интересные проекты и хочу применить свои навыки в AI',
		icon: <Icon name="person" size={40} />,
	},
	{
		value: 'client',
		title: 'Заказчик',
		description: 'Мне нужны специалисты для реализации AI-проектов',
		icon: <Icon name="business" size={40} />,
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
								onClick={() => setRole(option.value)}
								sx={{
									cursor: 'pointer',
									border: 2,
									borderColor: isSelected ? 'primary.main' : 'transparent',
									transition: 'all 0.2s',
									'&:hover': {
										borderColor: isSelected ? 'primary.main' : 'grey.300',
										boxShadow: 2,
									},
								}}
							>
								<CardContent
									sx={{
										textAlign: 'center',
										py: 4,
									}}
								>
									<Box
										sx={{
											width: 80,
											height: 80,
											borderRadius: '50%',
											bgcolor: isSelected ? 'primary.main' : 'grey.100',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											mx: 'auto',
											mb: 2,
											color: isSelected ? 'white' : 'grey.600',
										}}
									>
										{option.icon}
									</Box>
									<TS variant="h5" gutterBottom content={option.title} />
									<TS
										variant="body"
										color="secondary"
										className="text-sm"
										content={option.description}
									/>
								</CardContent>
							</Card>
						</Grid>
					)
				})}
			</Grid>
		</Box>
	)
}
