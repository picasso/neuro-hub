import { kebabCase, reduce } from 'lodash'
import {
	AlertTriangle,
	BadgeCheck,
	Ban,
	BookMarked,
	Briefcase,
	Building2,
	Check,
	ChevronDown,
	ChevronsUpDown,
	Circle,
	CircleAlert,
	CircleCheck,
	Code,
	CreditCard,
	Eye,
	EyeOff,
	FileText,
	Gavel,
	Github,
	Image,
	Info,
	LayoutGrid,
	LogIn,
	Mail,
	Percent,
	Quote,
	RotateCcw,
	Search,
	ShieldCheck,
	Star,
	ThumbsUp,
	Trash2,
	User,
	UserPlus,
	Users,
	Video,
	Volume2,
	X,
	Loader,
	LoaderCircle,
	LoaderPinwheel,
	ChevronLeft,
	ChevronRight,
} from 'lucide-react'
import { type ComponentType, type SVGProps } from 'react'
import { customIcons } from './icons'

type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>

// lucide icons -----------------------------------------------------------------------------------]

const lucideIcons = {
	AlertTriangle,
	BadgeCheck,
	Ban,
	BookMarked,
	Briefcase,
	Building2,
	Check,
	ChevronDown,
	ChevronsUpDown,
	Circle,
	CircleAlert,
	CircleCheck,
	Code,
	CreditCard,
	Eye,
	EyeOff,
	FileText,
	Gavel,
	Github,
	Image,
	Info,
	LayoutGrid,
	LogIn,
	Mail,
	Percent,
	Quote,
	RotateCcw,
	Search,
	ShieldCheck,
	Star,
	ThumbsUp,
	Trash2,
	User,
	UserPlus,
	Users,
	Video,
	Volume2,
	X,
	Loader,
	LoaderCircle,
	LoaderPinwheel,
	ChevronLeft,
	ChevronRight,
}

// type generation --------------------------------------------------------------------------------]

export type CutSuffix<T, Suffix extends string> = T extends `${infer R}${Suffix}` ? R : T
export type CutPrefix<T, Prefix extends string> = T extends `${Prefix}${infer R}` ? R : T

type CamelToKebab<S extends string> = S extends `${infer T}${infer U}`
	? `${T extends Capitalize<T> ? '-' : ''}${Lowercase<T>}${CamelToKebab<U>}`
	: S

type PascalToKebab<T extends string> = CamelToKebab<Uncapitalize<T>>

type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
type TrimEndDigits<T extends string> = T extends `${infer R}${Digit}` ? TrimEndDigits<R> : T

export type LucideIconName = PascalToKebab<TrimEndDigits<keyof typeof lucideIcons>>

// library ----------------------------------------------------------------------------------------]

type CustomIconName = keyof typeof customIcons

const library = reduce(
	{ ...lucideIcons, ...customIcons },
	(acc, value, key) => {
		acc[kebabCase(key.replace(/\d+$/, ''))] = value as SvgComponent
		return acc
	},
	{} as Record<string, SvgComponent>,
)

// aliases ----------------------------------------------------------------------------------------]

const aliases = {
	// backward compat: old MUI names -> new lucide names
	close: 'x',
	done: 'check',
	'done-filled': 'shield-check',
	delete: 'trash',
	'delete-outline': 'trash',
	'do-not-disturb': 'ban',
	'expand-more': 'chevron-down',
	error: 'circle-alert',
	'error-filled': 'circle-alert',
	info: 'info',
	'info-filled': 'info',
	warning: 'alert-triangle',
	'warning-filled': 'alert-triangle',
	'verified-user': 'shield-check',

	// media aliases
	'media-image': 'image',
	'media-video': 'video',
	'media-audio': 'volume',
	'media-pdf': 'file-text',

	// semantic aliases
	loading: 'spinner',
	check: 'check',
	article: 'file-text',
	business: 'building',
	collections: 'layout-grid',
	'collections-bookmark': 'book-marked',
	email: 'mail',
	'format-quote': 'quote',
	groups: 'users',
	'linked-in': 'linked-in',
	login: 'log-in',
	payment: 'credit-card',
	person: 'user',
	'person-add': 'user-plus',
	'thumb-up': 'thumbs-up',
	verified: 'badge-check',
	'video-library': 'video',
	visibility: 'eye',
	'visibility-off': 'eye-off',
	work: 'briefcase',
	'x-twitter': 'x-twitter',
	'git-hub': 'github',
	'check-circle': 'circle-check',
} as const

type AliasName = keyof typeof aliases
export type IconName = LucideIconName | AliasName | CustomIconName

const defaultIcon = 'ban'

export function getIcon(name: IconName): SvgComponent {
	return library[name] ?? library[aliases[name as AliasName]] ?? library[defaultIcon]
}
