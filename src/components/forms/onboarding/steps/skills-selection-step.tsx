'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useUnit } from 'effector-react'
import { useState } from 'react'
import type { UserSkillInput } from '@/lib/validations'
import {
	$allSkills,
	$selectedSkills,
	addSkill,
	loadSkillsFx,
	nextStep,
	prevStep,
	removeSkill,
	updateSkillLevel,
	type Skill,
} from '@/stores/onboarding'

type ProficiencyLevel = UserSkillInput['proficiencyLevel']

export function SkillsSelectionStep() {
	const [selectedSkills, allSkills, isLoading] = useUnit([
		$selectedSkills,
		$allSkills,
		loadSkillsFx.pending,
	])

	const [searchQuery, setSearchQuery] = useState('')

	const filteredSkills = allSkills.filter((skill) =>
		skill.name.toLowerCase().includes(searchQuery.toLowerCase()),
	)

	const isSkillSelected = (skillId: string) => {
		return selectedSkills.some((s) => s.skillId === skillId)
	}

	const onSkillToggle = (skill: Skill) => {
		if (isSkillSelected(skill.id)) {
			removeSkill(skill.id)
		} else {
			addSkill({
				skillId: skill.id,
				proficiencyLevel: 'intermediate',
			})
		}
	}

	const onContinue = () => {
		if (selectedSkills.length > 0) {
			nextStep()
		}
	}

	return (
		<Box>
			<Box sx={{ mb: 4, textAlign: 'center' }}>
				<Typography variant="h5" gutterBottom>
					Выберите ваши навыки
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Отметьте навыки, которыми вы владеете
				</Typography>
			</Box>

			<Box sx={{ maxWidth: 800, mx: 'auto' }}>
				{selectedSkills.length > 0 && (
					<Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
							Выбрано навыков: {selectedSkills.length}
						</Typography>
						<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
							{selectedSkills.map((skill) => {
								const skillData = allSkills.find((s) => s.id === skill.skillId)
								return (
									<Box key={skill.skillId} sx={{ display: 'flex', gap: 1 }}>
										<Chip
											label={skillData?.name || skill.skillId}
											onDelete={() => removeSkill(skill.skillId)}
										/>
										<FormControl size="small" sx={{ minWidth: 140 }}>
											<Select
												value={skill.proficiencyLevel}
												onChange={(e) =>
													updateSkillLevel({
														skillId: skill.skillId,
														level: e.target.value as ProficiencyLevel,
													})
												}
											>
												<MenuItem value="beginner">Beginner</MenuItem>
												<MenuItem value="intermediate">
													Intermediate
												</MenuItem>
												<MenuItem value="advanced">Advanced</MenuItem>
											</Select>
										</FormControl>
									</Box>
								)
							})}
						</Box>
					</Box>
				)}

				<TextField
					label="Поиск навыков"
					fullWidth
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="Начните вводить название..."
					sx={{ mb: 2 }}
				/>

				<Box
					sx={{
						maxHeight: 400,
						overflow: 'auto',
						border: 1,
						borderColor: 'grey.300',
						borderRadius: 1,
						mb: 3,
					}}
				>
					{isLoading ? (
						<Box sx={{ p: 3, textAlign: 'center' }}>
							<Typography variant="body2" color="text.secondary">
								Загрузка навыков...
							</Typography>
						</Box>
					) : filteredSkills.length === 0 ? (
						<Box sx={{ p: 3, textAlign: 'center' }}>
							<Typography variant="body2" color="text.secondary">
								Навыки не найдены
							</Typography>
						</Box>
					) : (
						<List>
							{filteredSkills.map((skill) => {
								const selected = isSkillSelected(skill.id)
								return (
									<ListItem
										key={skill.id}
										sx={{
											borderBottom: 1,
											borderColor: 'grey.200',
											'&:last-child': { borderBottom: 0 },
										}}
									>
										<FormControlLabel
											control={
												<Checkbox
													checked={selected}
													onChange={() => onSkillToggle(skill)}
												/>
											}
											label={
												<Box>
													<Typography variant="body2">
														{skill.name}
													</Typography>
													<Typography
														variant="caption"
														color="text.secondary"
													>
														{skill.category}
													</Typography>
												</Box>
											}
											sx={{ width: 1 }}
										/>
									</ListItem>
								)
							})}
						</List>
					)}
				</Box>

				<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
					<Button variant="outlined" size="large" onClick={() => prevStep()}>
						Назад
					</Button>
					<Button
						variant="contained"
						size="large"
						onClick={onContinue}
						disabled={selectedSkills.length === 0}
					>
						Продолжить
					</Button>
				</Box>
			</Box>
		</Box>
	)
}
