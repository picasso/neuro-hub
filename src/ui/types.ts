// shared UI types and class maps for color/size unification (SemanticColor = base, IconColor extends)

export type SemanticColor = 'primary' | 'secondary' | 'dimmed' | 'contrast' | 'soft' | 'destructive'

export type IconColor =
	| SemanticColor
	| 'cta'
	| 'error'
	| 'success'
	| 'warning'
	| 'info'
	| 'progress'

export const semanticColorClasses: Record<SemanticColor, string> = {
	primary: 'text-foreground',
	secondary: 'text-muted-foreground',
	dimmed: 'text-dimmed',
	destructive: 'text-destructive',
	contrast: 'text-background',
	soft: 'text-background/60',
}

// link: primary uses text-primary for clickable emphasis
export const linkColorClasses: Record<SemanticColor | 'inherit', string> = {
	...semanticColorClasses,
	primary: 'text-primary',
	inherit: 'text-inherit',
}

// icon tailwind classes: SemanticColor + semantic extensions (cta, error, success, etc.)
export const iconColorClasses: Record<IconColor, string> = {
	...semanticColorClasses,
	primary: 'text-primary',
	cta: 'text-cta',
	error: 'text-destructive',
	success: 'text-green-500',
	warning: 'text-amber-500',
	info: 'text-blue-500',
	progress: 'text-purple-500',
	contrast: 'text-white',
}

export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export const textSizeClasses: Record<TextSize, string> = {
	xs: 'text-xs',
	sm: 'text-sm',
	md: 'text-base',
	lg: 'text-lg',
	xl: 'text-xl',
}
