'use client'

import { useUnit } from 'effector-react'
import { filter, find, includes, map, some, toLower } from 'lodash'
import { useState } from 'react'
import type { UserSkillInput } from '@/lib/validations'
import {
	$allSkills,
	$selectedSkills,
	type Skill,
	addSkill,
	loadSkillsFx,
	nextStep,
	prevStep,
	removeSkill,
	updateSkillLevel,
} from '@/stores'
import { Badge, Button, Checkbox, Select, Stack, TextField, TS } from '@/ui'

type ProficiencyLevel = UserSkillInput['proficiencyLevel']

const proficiencyItems = [
	{ value: 'beginner', label: 'Beginner' },
	{ value: 'intermediate', label: 'Intermediate' },
	{ value: 'advanced', label: 'Advanced' },
]

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
		<div>
			<div className="mb-8 text-center">
				<TS variant="h5" gutterBottom content="Выберите ваши навыки" />
				<TS
					variant="body"
					color="secondary"
					className="text-sm"
					content="Отметьте навыки, которыми вы владеете"
				/>
			</div>

			<div className="max-w-200 mx-auto">
				{selectedSkills.length > 0 && (
					<div className="mb-6 p-4 bg-muted/30 rounded">
						<TS
							variant="body"
							color="secondary"
							className="text-sm mb-2"
							content={`Выбрано навыков: ${selectedSkills.length}`}
						/>
						<Stack wrap align="center" gap={2}>
							{map(selectedSkills, (skill) => {
								const skillData = find(allSkills, { id: skill.skillId })
								return (
									<Stack
										key={skill.skillId}
										direction="row"
										align="center"
										gap={2}
									>
										<Badge
											variant="outline"
											size="sm"
											color="primary"
											label={skillData?.name || skill.skillId}
											onClose={() => removeSkill(skill.skillId)}
											ariaOnClose="Удалить навык"
										/>
										<Select
											value={skill.proficiencyLevel}
											onValueChange={(level) =>
												updateSkillLevel({
													skillId: skill.skillId,
													level: level as ProficiencyLevel,
												})
											}
											items={proficiencyItems}
											compact
											triggerClassName="min-w-[140px]"
										/>
									</Stack>
								)
							})}
						</Stack>
					</div>
				)}

				<TextField
					label="Поиск навыков"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="Начните вводить название..."
					className="mb-4"
				/>

				<div className="max-h-100 overflow-auto border border-border rounded mb-6">
					{isLoading ? (
						<div className="p-6 text-center">
							<TS
								variant="body"
								color="secondary"
								className="text-sm"
								content="Загрузка навыков..."
							/>
						</div>
					) : filteredSkills.length === 0 ? (
						<div className="p-6 text-center">
							<TS
								variant="body"
								color="secondary"
								className="text-sm"
								content="Навыки не найдены"
							/>
						</div>
					) : (
						<div className="divide-y divide-border">
							{map(filteredSkills, (skill) => {
								const selected = isSkillSelected(skill.id)
								return (
									<div key={skill.id} className="px-4 py-2">
										<Checkbox
											checked={selected}
											onCheckedChange={() => onSkillToggle(skill)}
											label={
												<div>
													<TS variant="subtitle" content={skill.name} />
													<Badge
														variant="secondary"
														size="xs"
														color="secondary"
														label={skill.category.replace('_', ' ')}
													/>
												</div>
											}
											horizontalClassName="w-full"
										/>
									</div>
								)
							})}
						</div>
					)}
				</div>

				<Stack justify="space-between">
					<Button variant="outline" size="lg" onClick={() => prevStep()} label="Назад" />
					<Button
						size="lg"
						onClick={onContinue}
						disabled={selectedSkills.length === 0}
						label="Продолжить"
					/>
				</Stack>
			</div>
		</div>
	)
}
