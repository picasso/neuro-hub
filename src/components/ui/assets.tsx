//
// MUI icons --------------------------------------------------------------------------------------]
//
import doneOutline from '@mui/icons-material/DoneOutline'
import doNotDisturb from '@mui/icons-material/DoNotDisturb'
import errorOutline from '@mui/icons-material/ErrorOutline'
import infoOutline from '@mui/icons-material/InfoOutline'
import warning from '@mui/icons-material/WarningAmber'
import { kebabCase, reduce } from 'lodash'
import { type FC } from 'react'
import { customIcons } from './icons'
import type { SvgIconProps } from '@mui/material/SvgIcon'

const muiIcons = {
	doneOutline,
	warning,
	infoOutline,
	errorOutline,
	doNotDisturb,
}

// Project specific icons -------------------------------------------------------------------------]

type CustomIconName = keyof typeof customIcons

// Add 'SvgIcon' wrapper --------------------------------------------------------------------------]

export type CutSuffix<T, Suffix extends string> = T extends `${infer R}${Suffix}` ? R : T
export type CutPrefix<T, Prefix extends string> = T extends `${Prefix}${infer R}` ? R : T

type CamelToKebab<S extends string> = S extends `${infer T}${infer U}`
	? `${T extends Capitalize<T> ? '-' : ''}${Lowercase<T>}${CamelToKebab<U>}`
	: S

type PascalToKebab<T extends string> = CamelToKebab<Uncapitalize<T>>

export type MuiIconName = PascalToKebab<CutSuffix<keyof typeof muiIcons, 'Outline'>>

const library = reduce(
	{ ...muiIcons, ...customIcons },
	(acc, value, key) => {
		acc[kebabCase(key.replace('Outlined', '')) as MuiIconName] = value
		return acc
	},
	{} as Record<MuiIconName, FC<SvgIconProps>>,
)

// alias names that are added to the icon library for existing icons
const aliases = {
	check: 'done',
	loading: 'spinner',
	// delete: 'trash',
} as const

type AliasesName = keyof typeof aliases
export type IconName = MuiIconName | AliasesName | CustomIconName

const defaultIcon: IconName = 'do-not-disturb'

export const getIcon = (name: IconName) => {
	const icon =
		library[name as MuiIconName] ??
		customIcons[name as CustomIconName] ??
		library[aliases[name as AliasesName] as MuiIconName] ??
		customIcons[aliases[name as AliasesName] as CustomIconName] ??
		library[defaultIcon as MuiIconName]
	return icon
}
