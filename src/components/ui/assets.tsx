//
// MUI icons --------------------------------------------------------------------------------------]
//
import article from '@mui/icons-material/Article'
import business from '@mui/icons-material/Business'
import checkCircle from '@mui/icons-material/CheckCircle'
import code from '@mui/icons-material/Code'
import deleteOutline from '@mui/icons-material/DeleteOutline'
import doneOutline from '@mui/icons-material/DoneOutline'
import doNotDisturb from '@mui/icons-material/DoNotDisturb'
import email from '@mui/icons-material/Email'
import errorOutline from '@mui/icons-material/ErrorOutline'
import expandMore from '@mui/icons-material/ExpandMore'
import formatQuote from '@mui/icons-material/FormatQuote'
import gavel from '@mui/icons-material/Gavel'
import gitHub from '@mui/icons-material/GitHub'
import groups from '@mui/icons-material/Groups'
import image from '@mui/icons-material/Image'
import info from '@mui/icons-material/Info'
import infoOutline from '@mui/icons-material/InfoOutline'
import linkedIn from '@mui/icons-material/LinkedIn'
import login from '@mui/icons-material/Login'
import payment from '@mui/icons-material/Payment'
import percent from '@mui/icons-material/Percent'
import person from '@mui/icons-material/Person'
import personAdd from '@mui/icons-material/PersonAdd'
import search from '@mui/icons-material/Search'
import star from '@mui/icons-material/Star'
import telegram from '@mui/icons-material/Telegram'
import thumbUp from '@mui/icons-material/ThumbUp'
import verified from '@mui/icons-material/Verified'
import verifiedUser from '@mui/icons-material/VerifiedUser'
import videoLibrary from '@mui/icons-material/VideoLibrary'
import visibility from '@mui/icons-material/Visibility'
import visibilityOff from '@mui/icons-material/VisibilityOff'
import warning from '@mui/icons-material/WarningAmber'
import work from '@mui/icons-material/Work'
import x from '@mui/icons-material/X'
import { kebabCase, reduce } from 'lodash'
import { type ComponentType } from 'react'
import { customIcons } from './icons'
import type { SvgIconProps } from '@mui/material/SvgIcon'

const muiIcons = {
	article,
	business,
	checkCircle,
	code,
	deleteOutline,
	doNotDisturb,
	doneOutline,
	email,
	errorOutline,
	expandMore,
	formatQuote,
	gavel,
	gitHub,
	groups,
	image,
	info,
	infoOutline,
	linkedIn,
	login,
	payment,
	percent,
	person,
	personAdd,
	search,
	star,
	telegram,
	thumbUp,
	verified,
	verifiedUser,
	videoLibrary,
	visibility,
	visibilityOff,
	warning,
	work,
	x,
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
		acc[kebabCase(key.replace(/Outline$/, '')) as MuiIconName] = value
		return acc
	},
	{} as Record<MuiIconName, ComponentType<SvgIconProps>>,
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
