'use client'

import { type ButtonDemoState } from './demo-buttons-settings'
import { useSettings } from './settings-store'
import { Separator } from '@/components/shadcn/separator'
import { Button, Stack } from '@/components/ui'

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
					<Button variant="default" label="Save" />
					<Button variant="outline" label="Reject" />
					<Button variant="secondary" label="Help" />
					<Button variant="destructive" label="Remove" />
					<Button variant="ghost" label="Cancel" className="mr-10" />
					<Button variant="default" label="Default" leftIcon="book-marked" />
					<Button variant="outline" label="Outline" leftIcon="building" />
					<Button variant="secondary" label="Secondary" leftIcon="email" />
					<Button variant="destructive" label="Destructive" leftIcon="trash" />
					<Button variant="ghost" label="Ghost" leftIcon="login" />
				</Stack>
			</section>
			<section>
				<h3 className="my-1 text-sm font-medium text-foreground">Sizes</h3>
				<Stack gap={2} wrap align="stretch">
					<Button size="sm" variant="default" label="Button SM" />
					<Button size="md" variant="default" label="Button MD" />
					<Button size="lg" variant="default" label="Button LG" />
					<Button size="xl" variant="default" label="Button XL" />
				</Stack>
			</section>
		</Stack>
	)
}
