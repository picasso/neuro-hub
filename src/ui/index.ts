// Providers
export { FontProvider, FontSwitcher } from './providers/font-provider'
export { ThemeRegistry } from './providers/theme-registry'

// Custom UI primitives
export { Link, type LinkProps } from './link'
export {
	Icon,
	type IconProps,
	type IconName,
	type IconOptions,
	type IconColor,
	type IconSize,
} from './icon'
export { TS, TextStyled, type TextStyledProps } from './text-styled'
export { Button, HrefButton, buttonSize, outlineStyle, type ButtonProps } from './button'
export { IconButton, contrastStyle, type IconButtonProps } from './icon-button'
export { Stack, type StackProps } from './stack'
export { FileUploader, type FileUploaderProps } from './file-uploader'
export { Avatar, type AvatarProps } from './avatar'
export { Badge, type BadgeProps } from './badge'

// shadcn/ui primitives (use @/ui, never @/ui/shadcn directly in app code)
export { buttonVariants } from './shadcn/button'
export { AvatarGroup, AvatarGroupCount } from './shadcn/avatar'
export {
	Command,
	CommandDialog,
	CommandInput,
	CommandList,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandShortcut,
	CommandSeparator,
} from './shadcn/command'
export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
} from './shadcn/dialog'
export { Label } from './shadcn/label'
export {
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverAnchor,
	PopoverHeader,
	PopoverTitle,
	PopoverDescription,
} from './shadcn/popover'
export {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectScrollDownButton,
	SelectScrollUpButton,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from './shadcn/select'
export { Separator } from './shadcn/separator'
export { Slider } from './shadcn/slider'
export { Switch } from './shadcn/switch'
export { Toggle, toggleVariants } from './shadcn/toggle'
export { ToggleGroup, ToggleGroupItem } from './shadcn/toggle-group'
