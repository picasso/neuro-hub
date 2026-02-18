import { alpha, type ThemeOptions } from '@mui/material/styles'
import { feedback } from './feedback'
import { LinkBehaviour } from '@/components/ui'

export const components: ThemeOptions['components'] = {
	MuiLink: {
		defaultProps: {
			component: LinkBehaviour,
		},
		styleOverrides: {
			root: ({ theme }) => ({
				color: theme.palette.primary.main,
				textDecorationColor: 'transparent',
				textUnderlineOffset: '0.25em',
				'&:hover': {
					color: theme.palette.primary.dark,
					textDecorationColor: alpha(theme.palette.primary.dark, 0.7),
				},
			}),
		},
		variants: [
			{
				props: { color: 'contrast' },
				style: ({ theme }) => ({
					color: alpha(theme.palette.contrast.main, 0.75),
					textDecorationColor: 'transparent',
					textUnderlineOffset: '0.25em',
					'&:hover, &:focus-visible': {
						color: theme.palette.contrast.main,
						textDecorationColor: alpha(theme.palette.contrast.main, 0.7),
					},
				}),
			},
		],
	},
	MuiButtonBase: {
		defaultProps: {
			LinkComponent: LinkBehaviour,
		},
	},
	MuiButton: {
		styleOverrides: {
			root: ({ theme }) => ({
				textTransform: 'none',
				fontWeight: 600,
				borderRadius: 8,
				boxShadow: 'none',
				minHeight: 36,
				padding: theme.spacing(1, 2),
				'&:hover': {
					boxShadow: 'none',
				},
			}),
			sizeSmall: ({ theme }) => ({
				minHeight: 32,
				padding: theme.spacing(0.75, 1.5),
			}),
			sizeLarge: ({ theme }) => ({
				minHeight: 44,
				padding: theme.spacing(1.25, 2.5),
			}),
			containedPrimary: ({ theme }) => ({
				backgroundColor: theme.palette.primary.main,
				color: theme.palette.common.white,
				'&:hover': {
					backgroundColor: theme.palette.primary.dark,
				},
			}),
			outlinedPrimary: ({ theme }) => ({
				borderColor: theme.palette.divider,
				color: theme.palette.text.primary,
				backgroundColor: theme.palette.background.paper,
				'&:hover': {
					borderColor: alpha(theme.palette.primary.main, 0.35),
					backgroundColor: alpha(theme.palette.primary.main, 0.06),
				},
			}),
			textPrimary: ({ theme }) => ({
				'&:hover': {
					backgroundColor: alpha(theme.palette.primary.main, 0.06),
				},
			}),
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
	MuiOutlinedInput: {
		styleOverrides: {
			root: ({ theme }) => ({
				borderRadius: 8,
				backgroundColor: theme.palette.background.paper,
				'& .MuiOutlinedInput-notchedOutline': {
					borderColor: theme.palette.divider,
				},
				'&:hover .MuiOutlinedInput-notchedOutline': {
					borderColor: alpha(theme.palette.text.primary, 0.35),
				},
				'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
					borderColor: theme.palette.primary.main,
					borderWidth: 2,
				},
				'&.Mui-error .MuiOutlinedInput-notchedOutline': {
					borderColor: theme.palette.error.main,
				},
			}),
		},
	},
	MuiInputLabel: {
		styleOverrides: {
			root: ({ theme }) => ({
				color: theme.palette.text.secondary,
				'&.Mui-focused': {
					color: theme.palette.text.primary,
				},
				'&.Mui-error': {
					color: theme.palette.error.main,
				},
			}),
		},
	},
	MuiFormHelperText: {
		styleOverrides: {
			root: ({ theme }) => ({
				marginLeft: 0,
				marginRight: 0,
				color: theme.palette.text.secondary,
				'&.Mui-error': {
					color: theme.palette.error.main,
				},
			}),
		},
	},
	MuiPaper: {
		defaultProps: {
			elevation: 0,
		},
		styleOverrides: {
			root: ({ theme }) => ({
				borderRadius: 16,
				border: `1px solid ${theme.palette.divider}`,
				backgroundImage: 'none',
			}),
		},
	},
	MuiCard: {
		defaultProps: {
			variant: 'outlined',
		},
		styleOverrides: {
			root: ({ theme }) => ({
				borderRadius: 16,
				borderColor: theme.palette.divider,
				boxShadow: 'none',
				backgroundImage: 'none',
			}),
		},
	},
	MuiMenu: {
		styleOverrides: {
			paper: ({ theme }) => ({
				borderRadius: 16,
				border: `1px solid ${theme.palette.divider}`,
				boxShadow: `0 10px 30px ${alpha('#000', 0.08)}`,
			}),
		},
	},
	MuiPopover: {
		styleOverrides: {
			paper: ({ theme }) => ({
				borderRadius: 16,
				border: `1px solid ${theme.palette.divider}`,
				boxShadow: `0 10px 30px ${alpha('#000', 0.08)}`,
			}),
		},
	},
	MuiAppBar: {
		styleOverrides: {
			root: {
				borderRadius: 0,
				border: 0,
			},
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
			colorDisabled: {
				color: 'var(--mui-palette-grey-300)',
			},
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
