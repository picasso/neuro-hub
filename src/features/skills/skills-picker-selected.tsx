import { find, map } from 'lodash'
import { skilLevelOptions, type SkillItem } from './types'
import type { UserSkillInput } from '@/lib/validations'
import { Badge, Select, Stack, TS } from '@/ui'

type SkillsPickerSelectedProps = {
	selectedSkills: UserSkillInput[]
	allSkills: SkillItem[]
	selectedCountLabel: (count: number) => string
	onRemoveSkill: (skillId: string) => void
	onUpdateSkillLevel: (params: {
		skillId: string
		level: UserSkillInput['proficiencyLevel']
	}) => void
}

export function SkillsPickerSelected({
	selectedSkills,
	allSkills,
	selectedCountLabel,
	onRemoveSkill,
	onUpdateSkillLevel,
}: SkillsPickerSelectedProps) {
	return (
		<Stack vertical gap={3} className="rounded border border-border bg-muted/30 p-4">
			<TS
				variant="body"
				color="secondary"
				className="text-sm"
				content={selectedCountLabel(selectedSkills.length)}
			/>
			<Stack wrap align="center" gap={2}>
				{map(selectedSkills, (skill) => {
					const skillData = find(allSkills, { id: skill.skillId })
					return (
						<Stack key={skill.skillId} direction="row" align="center" gap={2}>
							<Badge
								variant="outline"
								size="sm"
								color="primary"
								label={skillData?.name || skill.skillId}
								onClose={() => onRemoveSkill(skill.skillId)}
								ariaOnClose="Удалить навык"
							/>
							<Select
								value={skill.proficiencyLevel}
								onValueChange={(level) =>
									onUpdateSkillLevel({
										skillId: skill.skillId,
										level: level as UserSkillInput['proficiencyLevel'],
									})
								}
								items={skilLevelOptions}
								compact
								triggerClassName="min-w-[140px]"
							/>
						</Stack>
					)
				})}
			</Stack>
		</Stack>
	)
}
