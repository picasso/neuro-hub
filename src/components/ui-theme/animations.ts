import { type CSSObject } from '@mui/material/styles'

export const animations = {
	rotate: {
		animationName: 'rotation',
		animationDuration: '1.5s',
		animationTimingFunction: 'linear',
		transformOrigin: '50% 50%',
		animationIterationCount: 'infinite',
		'@keyframes rotation': {
			'0%': {
				transform: 'rotate(0deg)',
			},
			'100%': {
				transform: 'rotate(360deg)',
			},
		},
	} as CSSObject,
}

export type ThemeAnimations = typeof animations
