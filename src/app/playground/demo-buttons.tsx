'use client'

import { type ButtonDemoState } from './demo-buttons-settings'
import { useSettings } from './settings-store'
import { Button as ShadcnButton } from '@/components/shadcn/button'
import { Separator } from '@/components/shadcn/separator'
import { Button, Icon, Stack } from '@/components/ui'

export function DemoButtons() {
	const settings = useSettings<ButtonDemoState>()
	const { variant, size, disabled, fullWidth, bold: thin, noWrap, leftIcon, rightIcon } = settings

	return (
		<Stack vertical gap={6} align="stretch">
			<section>
				<h3 className="my-1 text-sm font-medium text-foreground">Interactive</h3>
				<p className="mb-4 text-xs text-muted-foreground">
					Обёртка `Button` на базе shadcn.
				</p>
				<Button
					variant={variant}
					size={size}
					disabled={disabled}
					fullWidth={fullWidth}
					bold={thin}
					noWrap={noWrap}
					leftIcon={leftIcon ? 'star' : undefined}
					rightIcon={rightIcon ? 'chevron-right' : undefined}
					label={noWrap ? 'Long button label that should not wrap' : 'Button Action'}
				/>
			</section>

			<Separator />

			<section>
				<h3 className="my-1 text-sm font-medium text-foreground">Variants</h3>
				<Stack gap={2} wrap align="stretch">
					<Button variant="default" label="Default" leftIcon="star" />
					<Button variant="outline" label="Outline" leftIcon="star" />
					<Button variant="ghost" label="Ghost" leftIcon="star" />
				</Stack>
			</section>

			<section>
				<h3 className="my-1 text-sm font-medium text-foreground">Sizes</h3>
				<Stack gap={2} wrap align="stretch">
					<Button size="sm" variant="default" label="sm" />
					<Button size="md" variant="default" label="md" />
					<Button size="lg" variant="default" label="lg" />
					<Button size="xl" variant="default" label="xl" />
				</Stack>
			</section>

			<section>
				<h3 className="my-1 text-sm font-medium text-foreground">Icon buttons (shadcn)</h3>
				<p className="mb-4 text-xs text-muted-foreground">
					Для IconButton используем shadcn `Button` со size `icon-*`.
				</p>
				<Stack gap={2} wrap align="stretch">
					<ShadcnButton variant="ghost" size="icon" aria-label="Like">
						<Icon name="thumbs-up" size="sm" className="size-4" />
					</ShadcnButton>
					<ShadcnButton variant="ghost" size="icon-sm" aria-label="Search">
						<Icon name="search" size="sm" className="size-4" />
					</ShadcnButton>
					<ShadcnButton variant="outline" size="icon" aria-label="Delete">
						<Icon name="trash" size="sm" className="size-4" />
					</ShadcnButton>
				</Stack>
			</section>
		</Stack>
	)
}
