/**
 * standard MUI Typography color values that don't require custom handling.
 * any color not in this list will be treated as a custom palette color
 * and converted to sx={{ color: 'customColor.main' }} format.
 */
export const STANDARD_MUI_TYPOGRAPHY_COLORS = [
	'primary',
	'secondary',
	'error',
	'info',
	'success',
	'warning',
	'textPrimary',
	'textSecondary',
	'textDisabled',
	'inherit',
	'initial',
] as const
