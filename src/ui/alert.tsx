import { isString } from 'lodash'
import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from 'react'
import { Icon, type IconName, type IconOptions } from './icon'
import { IconButton } from './icon-button'
import {
	Alert as ShadcnAlert,
	AlertTitle as ShadcnAlertTitle,
	AlertDescription as ShadcnAlertDescription,
} from './shadcn/alert'
import { cn } from '@/utils'

type Severity = 'info' | 'success' | 'warning' | 'error' | 'progress'
type AlertVariant = 'standard' | 'filled' | 'outlined'

export type AlertProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
	severity: Severity
	variant?: AlertVariant
	title?: ReactNode
	desc?: string
	icon?: IconName | false
	iconOptions?: IconOptions
	onClose?: () => void
	children?: ReactNode
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
	{
		variant = 'standard',
		severity = 'info',
		className,
		title,
		desc,
		icon,
		iconOptions,
		onClose,
		children,
		...props
	},
	ref,
) {
	const mergedClassName = cn(
		'*:data-[slot=alert-title]:font-bold *:data-[slot=alert-title]:tracking-wide',
		'*:data-[slot=alert-description]:text-inherit',
		variantClasses[variant],
		severityToClasses(severity, variant),
		className,
	)
	const content = desc ?? children
	return (
		<ShadcnAlert ref={ref} variant="default" className={mergedClassName} {...props}>
			{icon !== false && (
				<Icon
					data-slot="alert-icon"
					name={icon ?? iconMap[severity]}
					size={iconOptions?.size ?? 'lg'}
					color={iconOptions?.color ?? severity}
					accent={iconOptions?.accent}
					spinning={!!(iconOptions?.spinning ?? severity === 'progress')}
					className={iconOptions?.tw}
				/>
			)}
			{title && <ShadcnAlertTitle>{title}</ShadcnAlertTitle>}
			{onClose && (
				<IconButton
					data-slot="alert-close"
					icon="x"
					size="xs"
					variant={'ghost'}
					onClick={onClose}
					className={cn(
						'p-1.5! absolute top-1 right-1 cursor-pointer opacity-50 hover:opacity-100 rounded-full',
						hoverClasses(severity, variant),
					)}
				/>
			)}
			{content && (
				<ShadcnAlertDescription className="block w-full">{content}</ShadcnAlertDescription>
			)}
		</ShadcnAlert>
	)
})

const variantClasses: Record<AlertVariant, string> = {
	standard: '',
	filled: '[&>svg]:text-white/60',
	outlined: 'bg-surface',
}

const hoverClasses = (severity: Severity, variant: AlertVariant) => {
	const classes: Record<AlertVariant, Record<Severity, string> | string> = {
		standard: {
			info: 'hover:bg-blue-200',
			success: 'hover:bg-emerald-200',
			warning: 'hover:bg-amber-200',
			error: 'hover:bg-red-200',
			progress: 'hover:bg-purple-300',
		},
		filled: '[&>svg]:text-white hover:bg-white/15',
		outlined: {
			info: 'hover:bg-blue-50',
			success: 'hover:bg-emerald-50',
			warning: 'hover:bg-amber-50',
			error: 'hover:bg-red-50',
			progress: 'hover:bg-purple-50',
		},
	}
	const selected = classes[variant]
	return isString(selected) ? selected : selected[severity]
}

const severityToClasses = (severity: Severity, variant: AlertVariant) => {
	const classes: Record<AlertVariant, Record<Severity, string>> = {
		standard: {
			info: 'bg-blue-100 border-blue-200',
			success: 'bg-emerald-100 border-emerald-200',
			warning: 'bg-amber-100 border-amber-200',
			error: 'bg-red-100 border-red-200',
			progress: 'bg-purple-200 border-purple-300',
		},
		filled: {
			info: 'bg-blue-500 text-white border-0',
			success: 'bg-emerald-500 text-white border-0',
			warning: 'bg-amber-500 text-white border-0',
			error: 'bg-red-500 text-white border-0',
			progress: 'bg-purple-500 text-white border-0',
		},
		outlined: {
			info: 'text-blue-600/80 border-blue-400/40 [&_svg]:text-blue-400/80',
			success: 'text-emerald-600/80 border-emerald-400/40 [&_svg]:text-emerald-400/80',
			warning: 'text-amber-600/80 border-amber-400/40 [&_svg]:text-amber-400/80',
			error: 'text-red-600/80 border-red-400/40 [&_svg]:text-red-400/80',
			progress: 'text-purple-600/80 border-purple-400/40 [&_svg]:text-purple-400/80',
		},
	}
	return classes[variant][severity]
}

const iconMap: Record<Severity, IconName> = {
	success: 'shield-check',
	info: 'info',
	warning: 'alert-triangle',
	error: 'circle-alert',
	progress: 'spinner',
}

export const AlertTitle = ShadcnAlertTitle
export const AlertDescription = ShadcnAlertDescription
