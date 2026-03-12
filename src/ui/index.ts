// custom UI primitives
export { Link, type LinkProps, type LinkColor } from './link'
export { Icon, type IconProps, type IconName, type IconOptions, type IconSize } from './icon'
export { TS, TextStyled, type TextStyledProps } from './text-styled'
export { Button, HrefButton, buttonSize, outlineStyle, type ButtonProps } from './button'
export { IconButton, contrastStyle, type IconButtonProps } from './icon-button'
export { Stack, type StackProps } from './stack'
export {
	PageContainer,
	PageShell,
	type PageContainerProps,
	type PageShellProps,
	type PageInset,
	type PagePreset,
	type PageSpacing,
	type PageWidth,
} from './page-shell'
export { FileUploader, type FileUploaderProps } from './file-uploader-client'
export { FieldWrapper, type FieldWrapperProps } from './field'
export { Empty, type EmptyProps, type EmptyShadcnProps } from './empty'
export { TextField, type TextFieldProps } from './text-field'
export { Checkbox, Switch, type CheckboxProps, type SwitchProps } from './checkbox-switch'
export {
	Combobox,
	ComboboxSimple,
	ComboboxGroupped,
	ComboboxCustom,
	type ComboboxProps,
	type ComboOption,
	type ComboGroup,
	type ComboCustomItem,
	type ComboboxCustomProps,
} from './combobox'
export {
	Select,
	SelectGroupped,
	type SelectProps,
	type SelectOption,
	type SelectOptionGroup,
} from './select'
export { Avatar, type AvatarProps, type AvatarBadgeStatus } from './avatar'
export { Badge, type BadgeProps } from './badge'
export { Alert, AlertTitle, AlertDescription, type AlertProps } from './alert'
export {
	Dialog,
	DialogRoot,
	type DialogProps,
	type DialogSize,
	type DialogAnimation,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
} from './dialog-client'
export {
	SidebarProvider,
	Sidebar,
	SidebarTrigger,
	SidebarRail,
	SidebarInset,
	SidebarInput,
	SidebarHeader,
	SidebarFooter,
	SidebarSeparator,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarGroupAction,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarMenuAction,
	SidebarMenuBadge,
	SidebarMenuSkeleton,
	SidebarMenuSub,
	SidebarMenuSubItem,
	SidebarMenuSubButton,
	useSidebar,
	type SidebarProviderProps,
	type SidebarProps,
	type SidebarTriggerProps,
	type SidebarRailProps,
	type SidebarInsetProps,
	type SidebarInputProps,
	type SidebarHeaderProps,
	type SidebarFooterProps,
	type SidebarSeparatorProps,
	type SidebarContentProps,
	type SidebarGroupProps,
	type SidebarGroupLabelProps,
	type SidebarGroupActionProps,
	type SidebarGroupContentProps,
	type SidebarMenuProps,
	type SidebarMenuItemProps,
	type SidebarMenuButtonProps,
	type SidebarMenuActionProps,
	type SidebarMenuBadgeProps,
	type SidebarMenuSkeletonProps,
	type SidebarMenuSubProps,
	type SidebarMenuSubItemProps,
	type SidebarMenuSubButtonProps,
} from './sidebar-client'
export {
	Accordion,
	AccordionRoot,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
	type AccordionProps,
	type AccordionOption,
} from './accordion'
export {
	Tabs,
	TabsRoot,
	TabsList,
	TabsTrigger,
	TabsContent,
	type TabsProps,
	type TabItem,
} from './tabs'
export { Stepper, type StepperProps, type StepperItem } from './stepper'
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
	Select as SelectRoot,
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
export {
	Item,
	ItemMedia,
	ItemContent,
	ItemActions,
	ItemGroup,
	ItemSeparator,
	ItemTitle,
	ItemDescription,
	ItemHeader,
	ItemFooter,
} from './shadcn/item'
