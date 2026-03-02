'use client'

import { useState } from 'react'
import { DemoRoot, DemoSection } from './components-utils'
import { type SelectDemoState } from './demo-selects-settings'
import { useSettings } from './settings-store'
import {
	Combobox,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Stack,
} from '@/ui'

export function DemoSelects() {
	const settings = useSettings<SelectDemoState>()
	const { error, disabled, required, helperText, freeSolo, markdown } = settings
	const [comboboxValue, setComboboxValue] = useState('')
	const [freeSoloValue, setFreeSoloValue] = useState('')
	const [selectValue, setSelectValue] = useState('')

	return (
		<DemoRoot>
			<DemoSection
				title="Interactive"
				desc="Обёртка `Combobox` — `Field` + shadcn `Combobox` с поиском и `freeSolo`"
				separator
			>
				<Combobox
					label="Навык"
					options={skillsOptions}
					value={comboboxValue}
					onValueChange={setComboboxValue}
					placeholder="Выберите или введите..."
					error={error ? 'Навык обязателен' : undefined}
					helperText={
						helperText
							? 'Это **важный** навык для `javascript` разработчика'
							: undefined
					}
					disabled={disabled}
					required={required}
					freeSolo={freeSolo}
					md={markdown ? { br: true } : false}
				/>
			</DemoSection>

			<DemoSection title="Select" separator>
				<Stack vertical gap={3} align="stretch">
					<div className="flex flex-col gap-1.5">
						<span className="text-sm font-medium">Роль</span>
						<Select value={selectValue} onValueChange={setSelectValue}>
							<SelectTrigger>
								<SelectValue placeholder="Выберите роль" />
							</SelectTrigger>
							<SelectContent>
								{rolesOptions.map((opt) => (
									<SelectItem key={opt.value} value={opt.value}>
										{opt.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</Stack>
			</DemoSection>

			<DemoSection title="Combobox" separator>
				<Combobox
					label="Технология"
					options={skillsOptions}
					value={comboboxValue}
					onValueChange={setComboboxValue}
					placeholder="Поиск..."
					helperText="Начните вводить для фильтрации"
				/>
			</DemoSection>

			<DemoSection title="Combobox freeSolo" separator>
				<Combobox
					label="Специализация"
					options={rolesOptions}
					value={freeSoloValue}
					onValueChange={setFreeSoloValue}
					placeholder="Выберите или введите своё..."
					helperText="Можно ввести произвольное значение"
					freeSolo
				/>
			</DemoSection>

			<DemoSection title="States">
				<Stack vertical gap={3} align="stretch">
					<Combobox
						label="Disabled"
						options={skillsOptions}
						placeholder="Недоступно"
						disabled
					/>
					<Combobox
						label="С ошибкой"
						options={skillsOptions}
						placeholder="Выберите навык"
						error="Это поле обязательно"
					/>
				</Stack>
			</DemoSection>
		</DemoRoot>
	)
}

const skillsOptions = [
	{ value: 'react', label: 'React' },
	{ value: 'vue', label: 'Vue' },
	{ value: 'angular', label: 'Angular' },
	{ value: 'svelte', label: 'Svelte' },
	{ value: 'nextjs', label: 'Next.js' },
	{ value: 'nuxt', label: 'Nuxt' },
]

const rolesOptions = [
	{ value: 'frontend', label: 'Frontend Developer' },
	{ value: 'backend', label: 'Backend Developer' },
	{ value: 'fullstack', label: 'Fullstack Developer' },
	{ value: 'ml', label: 'ML Engineer' },
	{ value: 'designer', label: 'UI/UX Designer' },
]
