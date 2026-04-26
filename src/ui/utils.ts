// shared UI helpers: contrast detection, disabled styles

export function needsContrast(variant: string | null, color?: string): boolean {
	return (
		['default', 'destructive', 'primary'].includes(variant as string) ||
		['contrast', 'soft'].includes(color as string) ||
		(['outline', 'secondary'].includes(variant as string) && ['cta'].includes(color as string))
	)
}

export const disabledLinkClasses = 'pointer-events-none opacity-50'
