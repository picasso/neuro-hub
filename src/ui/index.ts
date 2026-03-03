// Providers
export { FontProvider, FontSwitcher } from './providers/font-provider'
export { ThemeRegistry } from './providers/theme-registry'

// Custom UI primitives
export { Link, type LinkProps, type LinkColor } from './link'
export { Icon, type IconProps, type IconName, type IconOptions, type IconSize } from './icon'
export { TS, TextStyled, type TextStyledProps } from './text-styled'
export { Button, HrefButton, buttonSize, outlineStyle, type ButtonProps } from './button'
export { IconButton, contrastStyle, type IconButtonProps } from './icon-button'
export { Stack, type StackProps } from './stack'
export { FileUploader, type FileUploaderProps } from './file-uploader'
export { FieldWrapper, type FieldWrapperProps } from './field'
export { TextField, type TextFieldProps } from './text-field'
export { Checkbox, Switch, type CheckboxProps, type SwitchProps } from './checkbox-switch'
export {
	Combobox,
	ComboboxSimple,
	ComboboxGroupped,
	type ComboboxProps,
	type ComboOption,
	type ComboGroup,
} from './combobox'
export { Avatar, type AvatarProps, type AvatarBadgeStatus } from './avatar'
export { Badge, type BadgeProps } from './badge'
export { Alert, AlertTitle, AlertDescription, type AlertProps } from './alert'
export { type SemanticColor, type IconColor } from './types'
export { needsContrast } from './utils'

// shadcn/ui primitives (use @/ui, never @/ui/shadcn directly in app code)
export { AvatarGroup, AvatarGroupCount } from './shadcn/avatar'
export {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardAction,
	CardDescription,
	CardContent,
} from './shadcn/card'
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
export { Progress } from './shadcn/progress'
export { Slider } from './shadcn/slider'
// export { Switch } from './shadcn/switch'
export { Toggle } from './shadcn/toggle'
export { ToggleGroup, ToggleGroupItem } from './shadcn/toggle-group'
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './shadcn/tooltip'
export { Input } from './shadcn/input'
export { Textarea } from './shadcn/textarea'
export {
	Field,
	FieldLabel,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldContent,
	FieldSet,
	FieldLegend,
} from './shadcn/field'
export {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
	InputGroupText,
	InputGroupTextarea,
} from './shadcn/input-group'
export { ButtonGroup, ButtonGroupSeparator } from './shadcn/button-group'
export {
	Combobox as ComboboxRoot,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxGroup,
	ComboboxLabel,
	ComboboxCollection,
	ComboboxSeparator,
	ComboboxChips,
	ComboboxChip,
	ComboboxChipsInput,
	ComboboxTrigger,
	ComboboxValue,
	useComboboxAnchor,
} from './shadcn/combobox'
