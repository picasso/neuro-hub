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
				borderRadius: theme.spacing(1),
				'&.MuiAlert-outlined': {
					borderWidth: 2,
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
					marginBottom: 5,
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
				fontWeight: 400,
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
			standardProgress: ({ theme }: { theme: Theme }) => ({
				backgroundColor: lighten(theme.palette.secondary.main, 0.9),
				color: theme.palette.secondary.dark,
				'& .MuiAlert-icon': {
					color: theme.palette.secondary.light,
				},
			}),
			filledProgress: ({ theme }: { theme: Theme }) => ({
				backgroundColor: theme.palette.secondary.main,
				color: theme.palette.secondary.contrastText,
			}),
			outlinedProgress: ({ theme }: { theme: Theme }) => ({
				backgroundColor: theme.palette.background.paper,
				borderColor: theme.palette.secondary.main,
				borderStyle: 'solid',
				borderWidth: 2,
				color: theme.palette.secondary.dark,
			}),
		},
	},
}
