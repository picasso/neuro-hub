import { map } from 'lodash'
import { formatList, joinList } from './utils'
import { type PublicFreelancerProfile } from '@/lib/db/queries/freelancers'
import { type ProjectSkillSummary } from '@/lib/db/queries/projects'
import { Badge, type BadgeProps, Stack, type StackProps, Tooltip, type TooltipProps } from '@/ui'

type Skill = ProjectSkillSummary | PublicFreelancerProfile['skills'][number]
type SkillsProps = {
	splitAt?: number
	skills?: Skill[] | null
	align?: StackProps['align']
	size?: BadgeProps['size']
	variant?: BadgeProps['variant']
	side?: TooltipProps['side']
	withLevel?: boolean
	className?: string
}

export function Skills({
	splitAt = 4,
	skills,
	align = 'start',
	size = 'xs',
	variant = 'outline',
	side = 'right',
	withLevel,
	className,
}: SkillsProps) {
	if (!skills || skills.length === 0) return null
	const visibleSkills = skills.slice(0, splitAt)
	const remainingSkills = skills.slice(splitAt)
	const restCount = skills.length - visibleSkills.length

	return (
		<Stack wrap gap={1} align={align} className={className}>
			{map(visibleSkills, (skill) => (
				<Badge key={getSkill(skill, 'id')} variant={variant} size={size}>
					{withLevel
						? formatList([<b>{getSkill(skill)}</b>, getSkill(skill, 'level')])
						: getSkill(skill)}
				</Badge>
			))}
			{restCount > 0 ? (
				<Tooltip
					content={map(remainingSkills, (skill) =>
						withLevel
							? joinList([getSkill(skill), getSkill(skill, 'level')])
							: getSkill(skill),
					).join('\n')}
					side={side}
				>
					<Badge variant={variant} size={size}>
						+{restCount}
					</Badge>
				</Tooltip>
			) : null}
		</Stack>
	)
}

function getSkill(skill: Skill, key: 'id' | 'name' | 'level' = 'name') {
	if ('skillId' in skill) return key === 'level' ? level(skill) : skill.skill[key]
	return key === 'level' ? null : skill[key]
}

function level(skill: Exclude<Skill, ProjectSkillSummary>) {
	const level = skill.proficiencyLevel
	if (!level) return '—'
	const mapping: Record<string, string> = {
		beginner: 'Beginner',
		intermediate: 'Intermediate',
		advanced: 'Advanced',
		expert: 'Expert',
	}
	return mapping[level]
}
