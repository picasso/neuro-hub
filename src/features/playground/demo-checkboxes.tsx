'use client'

import { useState } from 'react'
import { DemoRoot, DemoSection } from './components-utils'
import { type CheckboxDemoState } from './demo-checkboxes-settings'
import { useSettings } from './settings-store'
import { Checkbox, Field, FieldLabel, Stack, Switch } from '@/ui'

const skills = [
	{ value: 'react', label: 'React' },
	{ value: 'typescript', label: 'TypeScript' },
	{ value: 'nextjs', label: 'Next.js' },
	{ value: 'tailwind', label: 'Tailwind CSS' },
]

export function DemoCheckboxes() {
	const settings = useSettings<CheckboxDemoState>()
	const { error, helperText, disabled, required, markdown } = settings
	const [checked, setChecked] = useState(false)
	const [checked2, setChecked2] = useState(false)
	const [switchOn, setSwitchOn] = useState(false)
	const [selected, setSelected] = useState<Set<string>>(new Set())

	function onGroupToggle(value: string) {
		setSelected((prev) => {
			const next = new Set(prev)
			if (next.has(value)) next.delete(value)
			else next.add(value)
			return next
		})
	}

	return (
		<DemoRoot>
			<DemoSection
				title="Interactive"
				desc="Обёртка `Checkbox` — `Field` + shadcn `Checkbox` + `FieldLabel`"
				separator
				className="pt-6"
			>
				<Checkbox
					label="Принять условия соглашения"
					checked={checked}
					onCheckedChange={setChecked}
					error={error ? 'Необходимо принять условия' : undefined}
					helperText={
						helperText
							? 'Ознакомьтесь с **важным** `документом` перед принятием'
							: undefined
					}
					disabled={disabled}
					required={required}
					md={markdown ? { br: true } : false}
				/>
			</DemoSection>

			<DemoSection title="Variants" separator>
				<Stack vertical gap={3} align="stretch">
					<Checkbox checked={checked2} onCheckedChange={setChecked2} />
					<Checkbox
						label="Checkbox with label"
						checked={checked2}
						onCheckedChange={setChecked2}
					/>
					<Checkbox
						label="Checkbox with label & helperText"
						checked={checked2}
						onCheckedChange={setChecked2}
						helperText="Дополнительная информация"
					/>
					<Checkbox
						label="Checkbox with label & error"
						checked={checked2}
						onCheckedChange={setChecked2}
						error="Это поле обязательно"
					/>
				</Stack>
			</DemoSection>

			<DemoSection title="Switch (для сравнения)" separator>
				<Stack gap={3} align="center">
					<Field orientation="horizontal" className="gap-2 w-fit">
						<Switch id="switch" checked={switchOn} onCheckedChange={setSwitchOn} />
						<FieldLabel htmlFor="switch">
							{switchOn ? 'Включено' : 'Выключено'}
						</FieldLabel>
					</Field>
				</Stack>
			</DemoSection>

			<DemoSection title="Group" separator>
				<Stack vertical gap={2} align="stretch">
					{skills.map((skill) => (
						<Checkbox
							key={skill.value}
							label={skill.label}
							checked={selected.has(skill.value)}
							onCheckedChange={() => onGroupToggle(skill.value)}
							required={required}
							disabled={disabled}
						/>
					))}
				</Stack>
			</DemoSection>

			<DemoSection title="States">
				<Stack vertical gap={3} align="stretch">
					<Checkbox label="Disabled unchecked" checked={false} disabled />
					<Checkbox label="Disabled checked" checked disabled />
					<Checkbox label="Required" checked={false} required />
				</Stack>
			</DemoSection>
		</DemoRoot>
	)
}
