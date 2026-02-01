import { css, type CSSObject } from '@mui/material/styles'

export const animations = {
	rotate: css`
		animation-name: rotation;
		animation-duration: 1.5s;
		animation-timing-function: linear;
		transform-origin: 50% 50%;
		animation-iteration-count: infinite;
		@keyframes rotation {
			0% {
				transform: rotate(0deg);
			}
			100% {
				transform: rotate(360deg);
			}
		}
	` as CSSObject,
}

export type ThemeAnimations = typeof animations
