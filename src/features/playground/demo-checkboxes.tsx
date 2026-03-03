'use client'

import { useState } from 'react'
import { DemoRoot, DemoSection } from './components-utils'
import { type CheckboxDemoState } from './demo-checkboxes-settings'
import { useSettings } from './settings-store'
import { Checkbox, Stack, Switch } from '@/ui'

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
				desc="Обёртка `?Checkbox` & `?Switch` —> `FieldWrapper` + **shadcn** `Checkbox` and `Switch`"
				separator
				className="pt-6"
			>
				<Checkbox
					label="Принять условия соглашения"
					checked={checked}
					onCheckedChange={setChecked}
					error={error ? 'Необходимо принять условия' : undefined}
					helper={{
						helper: helperText
							? 'Ознакомьтесь с **важным** `документом` перед принятием'
							: undefined,
						md: markdown ? { br: true } : false,
					}}
					disabled={disabled}
					required={required}
				/>
			</DemoSection>

			<DemoSection title="Variants" asBadge="check" separator>
				<Stack vertical gap={3} align="stretch">
					<Checkbox checked={checked2} onCheckedChange={setChecked2} />
					<Checkbox
						label="Checkbox with label"
						checked={checked2}
						onCheckedChange={setChecked2}
					/>
					<Checkbox
						label="Checkbox with label & helper text"
						checked={checked2}
						onCheckedChange={setChecked2}
						helper="Дополнительная информация"
					/>
					<Checkbox
						label="Checkbox with label & error"
						checked={checked2}
						onCheckedChange={setChecked2}
						error="Это поле обязательно"
					/>
				</Stack>
			</DemoSection>

			<DemoSection title="Switch (для сравнения)" asBadge="check" separator>
				<Switch
					label={switchOn ? 'Включено' : 'Выключено'}
					id="switch"
					required={required}
					disabled={disabled}
					error={error ? 'Это поле обязательно' : undefined}
					helper={
						helperText
							? 'Использован `horizontalClassName` `*gap-4 flex-row-reverse justify-end`'
							: undefined
					}
					horizontalClassName={'gap-4 flex-row-reverse justify-end'}
					checked={switchOn}
					onCheckedChange={setSwitchOn}
				/>
			</DemoSection>

			<DemoSection title="Group" asBadge="check" separator>
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

			<DemoSection title="States" asBadge="check">
				<Stack vertical gap={3} align="stretch">
					<Checkbox label="Disabled unchecked" checked={false} disabled />
					<Checkbox label="Disabled checked" checked disabled />
					<Checkbox label="Required" checked={false} required />
				</Stack>
			</DemoSection>
		</DemoRoot>
	)
}
