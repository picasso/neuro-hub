import { produce } from 'immer'
import {
	cloneDeep,
	filter,
	find,
	forEach,
	has,
	isPlainObject,
	isString,
	keys,
	map,
	values,
} from 'lodash'
import { VisuallyHidden } from 'radix-ui'
import { useCallback, useMemo, type ComponentProps, type ReactNode } from 'react'
import { Button, type ButtonProps } from './button'
import { Icon, type IconName, type IconOptions } from './icon'
import {
	type DialogAnimation,
	Dialog as ShadcnDialog,
	DialogClose,
	DialogContent as ShadcnDialogContent,
	DialogDescription as ShadcnDialogDescription,
	DialogFooter as ShadcnDialogFooter,
	DialogHeader as ShadcnDialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle as ShadcnDialogTitle,
	DialogTrigger,
} from './shadcn/dialog'
import { Separator } from './shadcn/separator'
import { Stack } from './stack'
import { type TextStyledProps, TS } from './text-styled'
import { buttonOnAccent } from './types'
import { cn } from '@/utils'

export type { DialogAnimation }
export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export type DialogAction = Partial<
	Pick<
		ButtonProps,
		| 'label'
		| 'variant'
		| 'disabled'
		| 'leftIcon'
		| 'rightIcon'
		| 'iconOptions'
		| 'size'
		| 'fullWidth'
		| 'noWrap'
		| 'bold'
	>
> & {
	id: string
	value?: unknown
	kind?: 'button' | 'node'
	linked?: unknown
}

export type DialogProps<T = unknown, L = unknown> = ComponentProps<typeof ShadcnDialogContent> & {
	// controlled / uncontrolled
	open?: boolean
	onClose?: (value?: T | null, linked?: L) => void
	defaultOpen?: boolean
	modal?: boolean

	// title area — icon rendered inline before title text
	title?: ReactNode
	icon?: IconName
	iconOptions?: IconOptions
	srTitle?: string
	divider?: boolean
	compactTitle?: boolean

	// description — string → simpleMarkdown via TS; ReactNode → render as-is
	description?: ReactNode

	// composition shortcuts
	trigger?: ReactNode
	footer?: ReactNode
	labels?: ActionLabels | null
	actions?: DialogAction[] | null
	actionsPosition?: 'start' | 'end' | 'center'
	linkedData?: Record<string, L>

	// appearance
	size?: DialogSize
	showFooterClose?: boolean
	footerClassName?: string

	// these props already exist in ShadcnDialogContent:
	// overlay?: boolean
	// showCloseButton?: boolean
	// noPadding?: boolean
	// animation?: DialogAnimation
	// className?: string
	// children?: ReactNode

	md?: TextStyledProps['md']
}

export function Dialog<T = boolean, L = unknown>({
	open,
	onClose,
	defaultOpen,
	modal = true,
	title,
	icon,
	iconOptions,
	srTitle,
	divider,
	compactTitle,
	description: desc,
	trigger,
	footer,
	footerClassName,
	actions: dialogActions,
	linkedData,
	labels,
	actionsPosition = 'end',
	size = 'md',
	overlay = true,
	showCloseButton = true,
	noPadding = false,
	animation = 'zoom',
	showFooterClose,
	className,
	children,
	md,
	...props
}: DialogProps<T, L>) {
	const actions = useMemo(() => {
		const defaults = cloneDeep(defaultActions) as DialogAction[]
		const actions =
			dialogActions ??
			map(labels, (data) => {
				const { id, label }: Record<string, string> = isPlainObject(data)
					? {
							id: keys(data)[0],
							label: values(data)[0],
						}
					: { id: data as string }
				const action = find(defaults, { id }) ?? defaults[0]
				if (label) action.label = label
				return action
			})

		return produce(actions, (draft) => {
			const buttonActions = filter(draft, ({ kind }) => kind !== 'node')
			// if only one action, then the button is always 'default'
			if (buttonActions.length === 1) buttonActions[0].variant = 'default'
			// if more than 2 actions then the leftmost will be 'ghost'
			if (buttonActions.length > 2) buttonActions[0].variant = 'ghost'
			// if linkedData is provided, then add it to the action
			if (linkedData) {
				forEach(draft, (action) => {
					if (has(linkedData, action.id)) {
						action.linked = linkedData[action.id]
					}
				})
			}
		})
	}, [dialogActions, labels, linkedData])

	const createOnClick = useCallback(
		(id: string, value: unknown, linked: unknown) => {
			return () => onClose?.((value ?? id) as T, linked as L)
		},
		[onClose],
	)

	const hiddenSrTitle = useMemo(
		() => (
			<VisuallyHidden.Root asChild>
				<ShadcnDialogTitle>{srTitle ?? 'Dialog'}</ShadcnDialogTitle>
			</VisuallyHidden.Root>
		),
		[srTitle],
	)

	const headerNode = useMemo(
		() => (
			<ShadcnDialogHeader className={cn(compactTitle && '-mt-3')}>
				{icon || title ? (
					<ShadcnDialogTitle>
						<span
							className={cn(
								'flex items-center gap-2 tracking-normal',
								compactTitle && 'text-sm',
							)}
						>
							{icon && (
								<Icon
									name={icon}
									size={iconOptions?.size ?? (compactTitle ? 'sm' : 'md')}
									color={iconOptions?.color}
									spinning={iconOptions?.spinning}
									className={iconOptions?.tw}
								/>
							)}
							{title}
						</span>
					</ShadcnDialogTitle>
				) : (
					hiddenSrTitle
				)}
				{divider && (
					<Separator
						className={cn(
							'-mx-5 w-[calc(100%+2.5rem)]!',
							compactTitle ? (desc ? 'my-0.5' : 'mt-0.5') : desc ? 'my-1' : 'mt-1.5',
						)}
					/>
				)}
				{desc && (
					<ShadcnDialogDescription asChild>
						{isString(desc) ? <TS clean inlineBlock content={desc} md={md} /> : desc}
					</ShadcnDialogDescription>
				)}
			</ShadcnDialogHeader>
		),
		[title, icon, iconOptions, hiddenSrTitle, desc, md, divider, compactTitle],
	)

	const footerNode = useMemo(
		() =>
			footer !== undefined || showFooterClose || actions.length > 0 ? (
				<ShadcnDialogFooter className={cn(buttonOnAccent(), footerClassName)}>
					{footer}
					{actions.length > 0 && (
						<Stack
							gap={2}
							className={cn(
								'w-full',
								actionsPosition === 'start' && 'justify-start',
								actionsPosition === 'end' && 'justify-end',
								actionsPosition === 'center' && 'justify-center',
							)}
						>
							{map(actions, (action, index) => {
								const {
									id,
									kind = 'button',
									variant = 'outline',
									value,
									size = 'sm',
									linked,
									...actionProps
								} = action
								if (kind === 'button') {
									return (
										<Button
											key={index}
											variant={variant}
											size={size}
											onClick={createOnClick(id, value, linked)}
											{...actionProps}
										/>
									)
								} else {
									return value as ReactNode
								}
							})}
						</Stack>
					)}
					{showFooterClose && (
						<DialogClose asChild>
							<Button size="sm" variant="outline" label="Close" />
						</DialogClose>
					)}
				</ShadcnDialogFooter>
			) : null,
		[footer, showFooterClose, actions, createOnClick, actionsPosition, footerClassName],
	)

	return (
		<ShadcnDialog
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose?.(null)
			}}
			defaultOpen={defaultOpen}
			modal={modal}
		>
			{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
			<ShadcnDialogContent
				overlay={overlay}
				showCloseButton={showCloseButton}
				noPadding={noPadding}
				animation={animation}
				className={cn(
					sizeClasses[size],
					compactTitle && '**:data-[slot=dialog-close]:top-3',
					className,
				)}
				{...(desc ? {} : { 'aria-describedby': undefined })}
				{...props}
			>
				{headerNode ?? hiddenSrTitle}
				{children}
				{footerNode}
			</ShadcnDialogContent>
		</ShadcnDialog>
	)
}

const sizeClasses: Record<DialogSize, string> = {
	sm: 'sm:max-w-sm',
	md: 'sm:max-w-lg',
	lg: 'sm:max-w-2xl',
	xl: 'sm:max-w-4xl',
	full: 'sm:max-w-[95vw]',
}

export {
	Dialog as DialogRoot,
	DialogTrigger,
	ShadcnDialogContent as DialogContent,
	ShadcnDialogHeader as DialogHeader,
	ShadcnDialogFooter as DialogFooter,
	ShadcnDialogTitle as DialogTitle,
	ShadcnDialogDescription as DialogDescription,
	DialogClose,
	DialogOverlay,
	DialogPortal,
}

const defaultActions = [
	{
		id: 'cancel',
		label: 'Cancel',
		value: false,
		variant: 'outline',
	},
	{
		id: 'ok',
		label: 'Ok',
		value: true,
		variant: 'default',
	},
	{
		id: 'no',
		label: 'No',
		variant: 'outline',
		value: false,
	},
	{
		id: 'yes',
		label: 'Yes',
		variant: 'default',
		value: true,
	},
] as const satisfies DialogAction[]

type DefaultActions = (typeof defaultActions)[number]['id']
type ActionLabels = (Record<string, string> | DefaultActions)[]
