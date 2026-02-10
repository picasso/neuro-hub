import { type ThemeOptions } from '@mui/material/styles'
import { feedback } from './feedback'
import { LinkBehaviour } from '@/components/ui'

export const components: ThemeOptions['components'] = {
	MuiLink: {
		defaultProps: {
			component: LinkBehaviour,
		},
	},
	MuiButtonBase: {
		defaultProps: {
			LinkComponent: LinkBehaviour,
		},
	},
	MuiButton: {
		styleOverrides: {
			root: {
				textTransform: 'none',
				fontWeight: 600,
			},
			outlinedContrast: ({ theme }) => ({
				borderColor: theme.palette.contrast.main,
				color: theme.palette.contrast.main,
				'&:hover': {
					borderColor: theme.palette.contrast.main,
					backgroundColor: 'rgba(255, 255, 255, 0.1)',
				},
			}),
			containedContrast: ({ theme }) => ({
				backgroundColor: theme.palette.contrast.main,
				color: theme.palette.contrast.contrastText,
				'&:hover': {
					backgroundColor: theme.palette.contrast.light,
				},
			}),
			textContrast: ({ theme }) => ({
				color: theme.palette.contrast.main,
				'&:hover': {
					backgroundColor: 'rgba(255, 255, 255, 0.1)',
				},
			}),
		},
	},
	MuiSvgIcon: {
		defaultProps: {
			color: 'action',
		},
		styleOverrides: {
			colorAction: {
				color: 'var(--mui-palette-grey-500)',
			},
			colorContrast: ({ theme }) => ({
				color: theme.palette.contrast.main,
			}),
		},
	},
	MuiTypography: {
		styleOverrides: {
			colorContrast: ({ theme }) => ({
				color: theme.palette.contrast.main,
			}),
		},
	},
	...feedback,
}
