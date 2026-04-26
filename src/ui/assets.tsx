import { kebabCase, reduce } from 'lodash'
import {
	AlertTriangle,
	BadgeCheck,
	Construction,
	FileSliders,
	WeightTilde,
	Ban,
	Blocks,
	BookMarked,
	Bot,
	Briefcase,
	BriefcaseBusiness,
	Building2,
	Check,
	CheckCheck,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronsUpDown,
	Circle,
	CircleAlert,
	CircleCheck,
	Camera,
	Code,
	CircuitBoard,
	CreditCard,
	Download,
	Eye,
	EyeOff,
	FileText,
	FolderKanban,
	Frown,
	Gavel,
	Github,
	History,
	Image,
	Info,
	Languages,
	LayoutDashboard,
	LayoutGrid,
	Loader,
	LoaderCircle,
	LoaderPinwheel,
	LogIn,
	LogOut,
	Mail,
	MoreHorizontal,
	Pencil,
	MapPin,
	Percent,
	Plus,
	Quote,
	RotateCw,
	RotateCcw,
	Search,
	ShieldCheck,
	SlidersHorizontal,
	Scale,
	Star,
	ThumbsUp,
	Trash2,
	User,
	UserPlus,
	Users,
	UsersRound,
	Video,
	Volume2,
	Workflow,
	X,
	BrainCircuit,
	Binoculars,
	Film,
	Cog,
	MessageCircleCheck,
	ChartArea,
	Send,
	MessageSquare,
	MessagesSquare,
} from 'lucide-react'
import { type ComponentType, type SVGProps } from 'react'
import { customIcons } from './icons/icons'

type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>

// lucide icons -----------------------------------------------------------------------------------]

const lucideIcons = {
	AlertTriangle,
	BadgeCheck,
	Construction,
	FileSliders,
	WeightTilde,
	Ban,
	Blocks,
	BookMarked,
	Bot,
	Briefcase,
	BriefcaseBusiness,
	Building2,
	Check,
	CheckCheck,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronsUpDown,
	Circle,
	CircleAlert,
	CircleCheck,
	Code,
	CircuitBoard,
	CreditCard,
	Download,
	Eye,
	EyeOff,
	FileText,
	FolderKanban,
	Frown,
	Gavel,
	Github,
	History,
	Image,
	Info,
	Languages,
	LayoutDashboard,
	LayoutGrid,
	Loader,
	LoaderCircle,
	LoaderPinwheel,
	LogIn,
	LogOut,
	Mail,
	MoreHorizontal,
	Pencil,
	MapPin,
	Percent,
	Plus,
	Quote,
	RotateCw,
	RotateCcw,
	Search,
	ShieldCheck,
	SlidersHorizontal,
	Scale,
	Star,
	ThumbsUp,
	Trash2,
	User,
	UserPlus,
	Users,
	UsersRound,
	Video,
	Volume2,
	Workflow,
	X,
	BrainCircuit,
	Binoculars,
	Film,
	Cog,
	MessageCircleCheck,
	ChartArea,
	Send,
	MessageSquare,
	MessagesSquare,
	Camera,
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

type CustomIconName = PascalToKebab<TrimEndDigits<keyof typeof customIcons>>

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
	article: 'file-text',
	business: 'building',
	collections: 'layout-grid',
	'collections-bookmark': 'book-marked',
	email: 'mail',
	'format-quote': 'quote',
	groups: 'users',
	login: 'log-in',
	payment: 'credit-card',
	person: 'user',
	'person-add': 'user-plus',
	verified: 'badge-check',
	'video-library': 'video',
	visibility: 'eye',
	'visibility-off': 'eye-off',
	work: 'briefcase',

	'git-hub': 'github',
	'check-circle': 'circle-check',

	// chat status icons (lucide naming)
	ellipsis: 'more-horizontal',
} as const

type AliasName = keyof typeof aliases
export type IconName = LucideIconName | AliasName | CustomIconName

const defaultIcon = 'ban'

export function getIcon(name: IconName): SvgComponent {
	return library[name] ?? library[aliases[name as AliasName]] ?? library[defaultIcon]
}
