import { type ThemeAnimations } from './animations'
type PropMainColors = {
	primary: true
	secondary: true
	error: true
	info: true
	success: true
	warning: true
}

declare module '@mui/material/styles' {
	interface Theme {
		animations: ThemeAnimations
	}
	// allow configuration using `createTheme`
	interface ThemeOptions {
		animations?: ThemeAnimations
	}
	interface Palette {
		contrast: Palette['primary']
	}
	interface PaletteOptions {
		contrast?: PaletteOptions['primary']
	}

	// allow extra background slots (e.g. `background.block`)
	interface TypeBackground {
		block: string
	}
	interface TypeText {
		dimmed: string
		pale: string
	}
}

declare module '@mui/material/SvgIcon' {
	interface SvgIconPropsColorOverrides extends PropMainColors {
		default: true
		contrast: true
	}
	interface SvgIconPropsSizeOverrides {
		xsmall: true
	}
	interface SvgIconClasses {
		colorContrast: string
	}
}

declare module '@mui/material/Alert' {
	interface AlertPropsColorOverrides {
		progress: true
	}
	interface AlertClasses {
		standardProgress: string
		filledProgress: string
		outlinedProgress: string
	}
}

declare module '@mui/material/IconButton' {
	interface IconButtonPropsColorOverrides extends PropMainColors {
		default: true
		contrast: true
	}
}

declare module '@mui/material/Button' {
	interface ButtonPropsColorOverrides extends PropMainColors {
		default: true
		contrast: true
	}
	interface ButtonClasses {
		outlinedContrast: string
		containedContrast: string
		textContrast: string
	}
}

declare module '@mui/material/Typography' {
	interface TypographyPropsColorOverrides {
		contrast: true
	}
	interface TypographyClasses {
		colorContrast: string
	}
}

declare module '@mui/material/Link' {
	interface LinkPropsColorOverrides {
		contrast: true
	}
	interface LinkClasses {
		colorContrast: string
	}
}
