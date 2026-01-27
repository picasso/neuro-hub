'use client'

import BusinessIcon from '@mui/icons-material/Business'
import PersonIcon from '@mui/icons-material/Person'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useUnit } from 'effector-react'
import type { UserRole } from '@/lib/validations'
import { $role, setRole } from '@/stores/onboarding'

type RoleOption = {
	value: UserRole
	title: string
	description: string
	icon: typeof PersonIcon
}

const roleOptions: RoleOption[] = [
	{
		value: 'freelancer',
		title: 'Фрилансер',
		description: 'Я ищу интересные проекты и хочу применить свои навыки в AI',
		icon: PersonIcon,
	},
	{
		value: 'client',
		title: 'Заказчик',
		description: 'Мне нужны специалисты для реализации AI-проектов',
		icon: BusinessIcon,
	},
]

export function RoleSelectionStep() {
	const selectedRole = useUnit($role)

	return (
		<Box>
			<Box sx={{ mb: 4, textAlign: 'center' }}>
				<Typography variant="h5" gutterBottom>
					Выберите вашу роль
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Это поможет нам персонализировать ваш опыт
				</Typography>
			</Box>

			<Grid container spacing={3} sx={{ mb: 4 }}>
				{roleOptions.map((option) => {
					const Icon = option.icon
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
										}}
									>
										<Icon
											sx={{
												fontSize: 40,
												color: isSelected ? 'white' : 'grey.600',
											}}
										/>
									</Box>
									<Typography variant="h6" gutterBottom>
										{option.title}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										{option.description}
									</Typography>
								</CardContent>
							</Card>
						</Grid>
					)
				})}
			</Grid>
		</Box>
	)
}
