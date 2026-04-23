import { useGate, useUnit } from 'effector-react'
import { filter, includes, map, some, toLower } from 'lodash'
import { useMemo, useState } from 'react'
import {
	$allSkills,
	$isSkillsCatalogLoading,
	$selectedSkills,
	SkillsPickerGate,
	skillAdded,
	skillLevelUpdated,
	skillRemoved,
} from './model'
import { SkillsPickerSelected } from './skills-picker-selected'
import { type SkillItem } from './types'
import { Badge, Checkbox, Empty, Skeleton, Stack, TextField, TS } from '@/ui'

type SkillsPickerProps = {
	searchLabel?: string
	searchPlaceholder?: string
	selectedCountLabel?: (count: number) => string
}

export function SkillsPicker({
	searchLabel = 'Поиск навыков',
	searchPlaceholder = 'Начните вводить название...',
	selectedCountLabel = (count) => `Выбрано навыков: ${count}`,
}: SkillsPickerProps) {
	useGate(SkillsPickerGate)

	const [selectedSkills, allSkills, isLoading, onAddSkill, onRemoveSkill, onUpdateSkillLevel] =
		useUnit([
			$selectedSkills,
			$allSkills,
			$isSkillsCatalogLoading,
			skillAdded,
			skillRemoved,
			skillLevelUpdated,
		])

	const [searchQuery, setSearchQuery] = useState('')

	const filteredSkills = useMemo(
		() => filter(allSkills, (skill) => includes(toLower(skill.name), toLower(searchQuery))),
		[allSkills, searchQuery],
	)

	const isSkillSelected = (skillId: string) => some(selectedSkills, { skillId })

	const onSkillToggle = (skill: SkillItem) => {
		if (isSkillSelected(skill.id)) {
			onRemoveSkill(skill.id)
			return
		}

		onAddSkill({
			skillId: skill.id,
			proficiencyLevel: 'intermediate',
		})
	}

	return (
		<Stack vertical gap={4} align="stretch" className="w-full">
			{selectedSkills.length > 0 ? (
				<SkillsPickerSelected
					selectedSkills={selectedSkills}
					allSkills={allSkills}
					selectedCountLabel={selectedCountLabel}
					onRemoveSkill={onRemoveSkill}
					onUpdateSkillLevel={onUpdateSkillLevel}
				/>
			) : null}

			<TextField
				label={searchLabel}
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				placeholder={searchPlaceholder}
			/>

			<div className="max-h-100 overflow-auto rounded border border-border">
				{isLoading ? (
					<div className="p-4">
						<Skeleton shape="text" clean className="w-full" />
					</div>
				) : filteredSkills.length === 0 ? (
					<Empty
						compact
						fullWidth
						title="Навыки не найдены"
						desc="Попробуйте изменить поисковый запрос"
						className="m-0 max-w-none border-0 p-6"
					/>
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
												{skill.category ? (
													<Badge
														variant="secondary"
														size="xs"
														color="secondary"
														label={skill.category.replace('_', ' ')}
													/>
												) : null}
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
		</Stack>
	)
}
