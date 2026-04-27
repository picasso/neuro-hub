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
	// useful aliases
	close: 'x',
	warning: 'alert-triangle',
	error: 'circle-alert',
	ellipsis: 'more-horizontal',
	// media aliases
	'media-image': 'image',
	'media-video': 'video',
	'media-audio': 'volume',
	'media-pdf': 'file-text',
} as const

type AliasName = keyof typeof aliases
export type IconName = LucideIconName | AliasName | CustomIconName

const defaultIcon = 'ban'

export function getIcon(name: IconName): SvgComponent {
	return library[name] ?? library[aliases[name as AliasName]] ?? library[defaultIcon]
}
