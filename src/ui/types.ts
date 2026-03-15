// shared UI types and class maps for color/size unification (SemanticColor = base, IconColor extends)

export type SemanticColor = 'primary' | 'secondary' | 'dimmed' | 'contrast' | 'soft' | 'destructive'

export type IconColor =
	| SemanticColor
	| 'current'
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
	current: 'text-current',
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

export type MaxW =
	| 'none'
	| 'xs'
	| 'sm'
	| 'md'
	| 'lg'
	| 'xl'
	| '2xl'
	| '3xl'
	| '4xl'
	| '5xl'
	| '6xl'
	| '7xl'
	| '8xl'
	| '9xl'
	| '10xl'

export const maxWClasses: Record<MaxW, string> = {
	none: '',
	xs: 'max-w-xs',
	sm: 'max-w-sm',
	md: 'max-w-md',
	lg: 'max-w-lg',
	xl: 'max-w-xl',
	'2xl': 'max-w-2xl',
	'3xl': 'max-w-3xl',
	'4xl': 'max-w-4xl',
	'5xl': 'max-w-5xl',
	'6xl': 'max-w-6xl',
	'7xl': 'max-w-7xl',
	'8xl': 'max-w-8xl',
	'9xl': 'max-w-9xl',
	'10xl': 'max-w-10xl',
}

export type Shadow = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export const shadowClasses: Record<Shadow, string> = {
	none: 'shadow-none',
	sm: 'shadow-sm',
	md: 'shadow-md',
	lg: 'shadow-lg',
	xl: 'shadow-xl',
	'2xl': 'shadow-2xl',
}

export function buttonOnAccent(bright?: boolean) {
	return [
		bright
			? '**:data-[variant=outline]:border-accent-dark'
			: '**:data-[variant=outline]:border-border-dark',
		bright ? '**:data-[variant=outline]:bg-surface' : '**:data-[variant=outline]:bg-background',
		'**:data-[variant=outline]:hover:bg-primary/10',
		'**:data-[variant=outline]:hover:border-primary-light',
		'**:data-[variant=ghost]:hover:bg-accent-dark',
	].join(' ')
}
