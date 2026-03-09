import { isString, map } from 'lodash'
import { Icon, type IconName } from './icon'
import { cn } from '@/utils'

export type StepperProps = {
	activeStep?: number
	items: StepperItem[] | string[]
	chevron?: boolean
	chevronIcon?: IconName
	align?: 'start' | 'center' | 'end'
	fullWidth?: boolean
	className?: string
}

export function Stepper({
	activeStep,
	items,
	chevron = true,
	chevronIcon,
	align = 'start',
	fullWidth,
	className,
}: StepperProps) {
	return (
		<ul
			className={cn(
				'flex items-center gap-2 list-none',
				align && `justify-${align}`,
				fullWidth && 'w-full',
				className,
			)}
		>
			{map(items, (item: StepperItem | string, index: number) => {
				const stepItem = isString(item) ? { label: item, step: index + 1 } : item
				return (
					<>
						<StepperItem
							key={stepItem.step}
							active={stepItem.step === activeStep}
							{...stepItem}
						/>
						{chevron && (
							<Icon
								name={chevronIcon ?? 'chevron-right'}
								className="text-dimmed/60"
							/>
						)}
					</>
				)
			})}
		</ul>
	)
}

export type StepperItem = {
	label: string
	step?: number
	icon?: IconName
	className?: string
}

type StepperItemProps = StepperItem & {
	active: boolean
}

function StepperItem({ label, step, icon, active }: StepperItemProps) {
	return (
		<li className="flex items-center gap-3 text-sm list-none">
			<span
				className={cn(
					'flex items-center justify-center size-6 rounded-full text-primary-foreground',
					active ? 'bg-primary' : 'bg-dimmed/60',
				)}
			>
				{step}
			</span>
			{icon && <Icon name={icon} color="dimmed" />}
			<span
				className={cn(
					'text-sm font-semibold tracking-wide',
					active ? 'text-primary' : 'text-dimmed/90',
				)}
			>
				{label}
			</span>
		</li>
	)
}
