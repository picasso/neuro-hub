import { alpha, lighten, type Theme, type ThemeOptions } from '@mui/material/styles'

export const feedback: ThemeOptions['components'] = {
	MuiAlertTitle: {
		styleOverrides: {
			root: {
				color: 'inherit',
				fontSize: '1rem',
				fontWeight: 700,
				letterSpacing: '0.03125rem', // 0.5 px
			},
		},
	},
	MuiAlert: {
		styleOverrides: {
			root: ({ theme }) => ({
				borderRadius: 8,
				border: `1px solid ${theme.palette.divider}`,
				'&.MuiAlert-outlined': {
					borderWidth: 1,
				},
				'span.__code': {
					position: 'relative',
					padding: '2px 6px',
					borderRadius: 6,
					backgroundColor: alpha(theme.palette.text.primary, 0.05),
					letterSpacing: 0.5,
				},
				'span.__code:after': {
					content: '""',
					position: 'absolute',
					top: 0,
					left: 0,
					bottom: 0,
					right: 0,
					borderRadius: 6,
					border: '1px solid',
					opacity: 0.25,
				},
				br: {
					marginBottom: 2,
				},
				'br + br': {
					marginBottom: 0,
				},
			}),
			icon: {
				'.MuiSvgIcon-root': {
					color: 'inherit',
				},
			},
			message: {
				color: 'inherit',
				fontSize: '0.875rem',
				fontWeight: 500,
				lineHeight: '1.5rem',
			},
			action: {
				'.MuiSvgIcon-root': {
					color: 'inherit',
					opacity: 0.5,
				},
			},
			outlined: ({ theme }) => ({
				backgroundColor: theme.palette.background.paper,
			}),
			filled: {
				borderColor: 'rgba(0, 0, 0, 0.12)',
			},
			standardInfo: ({ theme }: { theme: Theme }) => ({
				backgroundColor: lighten(theme.palette.info.main, 0.8),
				color: theme.palette.text.primary,
				borderColor: lighten(theme.palette.info.main, 0.7),
				'& .MuiAlert-icon': {
					color: theme.palette.info.main,
				},
				'& .MuiIconButton-root .MuiSvgIcon-colorAction': {
					color: theme.palette.info.dark,
				},
			}),
			standardSuccess: ({ theme }: { theme: Theme }) => ({
				backgroundColor: lighten(theme.palette.success.main, 0.8),
				color: theme.palette.text.primary,
				borderColor: lighten(theme.palette.success.main, 0.7),
				'& .MuiAlert-icon': {
					color: theme.palette.success.main,
				},
				'& .MuiIconButton-root .MuiSvgIcon-colorAction': {
					color: theme.palette.success.dark,
				},
			}),
			standardWarning: ({ theme }: { theme: Theme }) => ({
				backgroundColor: lighten(theme.palette.warning.main, 0.85),
				color: theme.palette.text.primary,
				borderColor: lighten(theme.palette.warning.main, 0.7),
				'& .MuiAlert-icon': {
					color: theme.palette.warning.main,
				},
				'& .MuiIconButton-root .MuiSvgIcon-colorAction': {
					color: theme.palette.warning.dark,
				},
			}),
			standardError: ({ theme }: { theme: Theme }) => ({
				backgroundColor: lighten(theme.palette.error.main, 0.85),
				color: theme.palette.text.primary,
				borderColor: lighten(theme.palette.error.main, 0.7),
				'& .MuiAlert-icon': {
					color: theme.palette.error.main,
				},
				'& .MuiIconButton-root .MuiSvgIcon-colorAction': {
					color: theme.palette.error.dark,
				},
			}),
			standardProgress: ({ theme }: { theme: Theme }) => ({
				backgroundColor: lighten(theme.palette.primary.main, 0.75),
				color: theme.palette.text.primary,
				borderColor: lighten(theme.palette.primary.main, 0.7),
				'& .MuiAlert-icon': {
					color: theme.palette.primary.main,
				},
				'& .MuiIconButton-root .MuiSvgIcon-colorAction': {
					color: theme.palette.primary.dark,
				},
			}),
			filledProgress: ({ theme }: { theme: Theme }) => ({
				backgroundColor: theme.palette.primary.main,
				color: theme.palette.common.white,
			}),
			outlinedProgress: ({ theme }: { theme: Theme }) => ({
				backgroundColor: theme.palette.background.paper,
				borderColor: lighten(theme.palette.primary.main, 0.6),
				borderStyle: 'solid',
				borderWidth: 1,
				color: theme.palette.text.primary,
			}),
		},
	},
}
