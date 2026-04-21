import { map } from 'lodash'
import { type ProjectSkillSummary } from '@/lib/db/queries/projects'
import { Badge, type BadgeProps, Stack, type StackProps, Tooltip, type TooltipProps } from '@/ui'

type SkillsProps = {
	splitAt?: number
	skills?: ProjectSkillSummary[] | null
	align?: StackProps['align']
	size?: BadgeProps['size']
	variant?: BadgeProps['variant']
	side?: TooltipProps['side']
	className?: string
}

export function Skills({
	splitAt = 4,
	skills,
	align = 'start',
	size = 'xs',
	variant = 'outline',
	side = 'right',
	className,
}: SkillsProps) {
	if (!skills || skills.length === 0) return null
	const visibleSkills = skills.slice(0, splitAt)
	const remainingSkills = skills.slice(splitAt)
	const restCount = skills.length - visibleSkills.length

	return (
		<Stack wrap gap={1} align={align} className={className}>
			{map(visibleSkills, (skill) => (
				<Badge key={skill.id} variant={variant} size={size}>
					{skill.name}
				</Badge>
			))}
			{restCount > 0 ? (
				<Tooltip
					content={map(remainingSkills, (skill) => skill.name).join('\n')}
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
