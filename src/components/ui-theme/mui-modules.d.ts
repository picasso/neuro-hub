import { type ThemeAnimations } from './animations'
import { type ThemeColors } from './types'

type PaletteColor = ThemeColors['primary']
declare module '@mui/material/styles' {
	interface Theme {
		animations: ThemeAnimations
	}
	// allow configuration using `createTheme`
	interface ThemeOptions {
		animations?: ThemeAnimations
	}
}

declare module '@mui/material/SvgIcon' {
	interface SvgIconPropsColorOverrides extends PropMainColors {
		default: true
		placeholder: true
	}
	interface SvgIconPropsSizeOverrides {
		xsmall: true
	}
}

declare module '@mui/material/Alert' {
	interface AlertPropsColorOverrides {
		primary: true
	}
}

declare module '@mui/material/IconButton' {
	interface IconButtonPropsColorOverrides extends PropMainColors {
		default: true
		placeholder: true
	}
}

// declare module '@mui/material/Button' {
// 	interface ButtonPropsColorOverrides extends PropMainColors {
// 		default: true
// 	}
// 	interface ButtonPropsVariantOverrides {
// 		primary: true
// 		secondary: true
// 		light: true
// 		destructive: true
// 	}
// }
