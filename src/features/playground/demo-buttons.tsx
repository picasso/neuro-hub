'use client'

import { DemoRoot, DemoSection } from './components-utils'
import { type ButtonDemoState } from './demo-buttons-settings'
import { useSettings } from './settings-store'
import { Button, Stack } from '@/ui'

export function DemoButtons() {
	const settings = useSettings<ButtonDemoState>()
	const { variant, size, disabled, fullWidth, bold: thin, noWrap, leftIcon, rightIcon } = settings

	return (
		<DemoRoot>
			<DemoSection title="Interactive" desc="Обёртка `Button` на базе shadcn" separator>
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
			</DemoSection>
			<DemoSection title="Variants" separator>
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
			</DemoSection>
			<DemoSection title="Sizes">
				<Stack gap={2} wrap align="stretch">
					<Button size="xs" variant="default" label="Button XS" />
					<Button size="sm" variant="default" label="Button SM" />
					<Button size="md" variant="default" label="Button MD" />
					<Button size="lg" variant="default" label="Button LG" />
					<Button size="xl" variant="default" label="Button XL" />
				</Stack>
			</DemoSection>
		</DemoRoot>
	)
}
