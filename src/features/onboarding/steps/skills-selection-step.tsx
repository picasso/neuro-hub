'use client'

import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useUnit } from 'effector-react'
import { filter, find, includes, map, some, toLower } from 'lodash'
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
import { Button } from '@/ui/button'
import { TS } from '@/ui/text-styled'

type ProficiencyLevel = UserSkillInput['proficiencyLevel']

export function SkillsSelectionStep() {
	const [selectedSkills, allSkills, isLoading] = useUnit([
		$selectedSkills,
		$allSkills,
		loadSkillsFx.pending,
	])

	const [searchQuery, setSearchQuery] = useState('')

	const filteredSkills = filter(allSkills, (skill) =>
		includes(toLower(skill.name), toLower(searchQuery)),
	)

	const isSkillSelected = (skillId: string) => {
		return some(selectedSkills, { skillId })
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
				<TS variant="h5" gutterBottom content="Выберите ваши навыки" />
				<TS
					variant="body"
					color="secondary"
					className="text-sm"
					content="Отметьте навыки, которыми вы владеете"
				/>
			</Box>

			<Box sx={{ maxWidth: 800, mx: 'auto' }}>
				{selectedSkills.length > 0 && (
					<Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
						<TS
							variant="body"
							color="secondary"
							className="text-sm mb-2"
							content={`Выбрано навыков: ${selectedSkills.length}`}
						/>
						<Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
							{map(selectedSkills, (skill) => {
								const skillData = find(allSkills, { id: skill.skillId })
								return (
									<Stack
										key={skill.skillId}
										direction="row"
										alignItems="center"
										gap={1}
									>
										<Chip
											color="primary"
											label={skillData?.name || skill.skillId}
											onDelete={() => removeSkill(skill.skillId)}
										/>
										<FormControl size="small" sx={{ minWidth: 140 }}>
											<Select
												size="small"
												value={skill.proficiencyLevel}
												onChange={(e) =>
													updateSkillLevel({
														skillId: skill.skillId,
														level: e.target.value as ProficiencyLevel,
													})
												}
												sx={{ height: 32 }}
											>
												<MenuItem value="beginner">Beginner</MenuItem>
												<MenuItem value="intermediate">
													Intermediate
												</MenuItem>
												<MenuItem value="advanced">Advanced</MenuItem>
											</Select>
										</FormControl>
									</Stack>
								)
							})}
						</Stack>
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
							<TS
								variant="body"
								color="secondary"
								className="text-sm"
								content="Загрузка навыков..."
							/>
						</Box>
					) : filteredSkills.length === 0 ? (
						<Box sx={{ p: 3, textAlign: 'center' }}>
							<TS
								variant="body"
								color="secondary"
								className="text-sm"
								content="Навыки не найдены"
							/>
						</Box>
					) : (
						<List>
							{map(filteredSkills, (skill) => {
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
													<TS variant="subtitle" content={skill.name} />
													<Chip
														size="small"
														label={skill.category.replace('_', ' ')}
													/>
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

				<Stack direction="row" justifyContent="space-between">
					<Button variant="outline" size="lg" onClick={() => prevStep()} label="Назад" />
					<Button
						size="lg"
						onClick={onContinue}
						disabled={selectedSkills.length === 0}
						label="Продолжить"
					/>
				</Stack>
			</Box>
		</Box>
	)
}
