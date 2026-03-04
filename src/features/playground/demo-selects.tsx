'use client'

import { useState } from 'react'
import { DemoRoot, DemoSection } from './components-utils'
import { type SelectDemoState } from './demo-selects-settings'
import { useSettings } from './settings-store'
import {
	Combobox,
	ComboboxSimple,
	ComboboxGroupped,
	Stack,
	useComboboxAnchor,
	type ComboOption,
	type ComboGroup,
	type ComboCustomItem,
	ComboboxCustom,
} from '@/ui'

export function DemoSelects() {
	const settings = useSettings<SelectDemoState>()
	const {
		error,
		disabled,
		required,
		helperText,
		markdown,
		showClear,
		autoHighlight,
		customVariant,
		customSize,
	} = settings
	const [value, setValue] = useState<string | null>(null)
	const [values, setValues] = useState<string[] | null>(null)
	const [comboValue, setComboValue] = useState<ComboOption | null>(null)
	const [comboGroupValue, setComboGroupValue] = useState<ComboGroup | null>(null)
	const [customValue, setCustomValue] = useState<ComboCustomItem | null>(null)
	const chipsAnchor = useComboboxAnchor()
	// const [selectValue, setSelectValue] = useState('')

	return (
		<DemoRoot>
			<DemoSection
				title="Interactive"
				desc="Обёртка `?Combobox` & `?Select` —> `FieldWrapper` + **shadcn** `Combobox` and `Select` с поиском и множественным выбором"
				separator
			>
				<Combobox
					label="Навык"
					items={skillsOptions}
					value={comboValue}
					onValueChange={setComboValue}
					placeholder="Выберите или введите..."
					error={error ? 'Навык обязателен' : undefined}
					helper={{
						helper: helperText
							? 'Это **важный** навык для `javascript` разработчика'
							: undefined,
						md: markdown ? { br: true } : false,
					}}
					disabled={disabled}
					required={required}
					showClear={showClear}
					autoHighlight={autoHighlight}
				/>
			</DemoSection>

			<DemoSection title="Select" asBadge="chevrons-up-down" separator>
				<Stack vertical gap={3} align="stretch">
					<div className="flex flex-col gap-1.5">
						{/* <span className="text-sm font-medium">Роль</span>
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
						</Select> */}
					</div>
				</Stack>
			</DemoSection>

			<DemoSection title="Combobox" asBadge="chevrons-up-down" separator>
				<ComboboxSimple
					label="Технология"
					items={skills}
					value={value}
					onValueChange={setValue}
					placeholder="Поиск..."
					helper="Начните вводить для фильтрации"
				/>
			</DemoSection>

			<DemoSection title="Combobox Groupped" asBadge="chevrons-up-down" separator>
				<ComboboxGroupped
					label="Специализация"
					items={rolesOptions}
					value={comboGroupValue}
					onValueChange={setComboGroupValue}
					placeholder="Выберите или начните вводить свою специализацию..."
					helper="Выберите или введите свою специализацию"
				/>
			</DemoSection>

			<DemoSection title="Combobox Multiple" asBadge="chevrons-up-down" separator>
				<Combobox<string, true>
					multiple
					chipsAnchor={chipsAnchor}
					label="Навыки"
					items={skills}
					value={values}
					onValueChange={setValues}
					placeholder="Выберите или введите..."
					helper="Выберите один или несколько навыков"
				/>
			</DemoSection>

			<DemoSection title="Custom Items" asBadge="chevrons-up-down">
				<ComboboxCustom
					label="Источники технологий"
					items={customItems}
					value={customValue}
					onValueChange={setCustomValue}
					variant={customVariant}
					itemClassName={'w-full'}
					size={customSize}
					placeholder="Выберите или введите..."
					helper="Начните вводить для фильтрации"
					showClear
				/>
			</DemoSection>
		</DemoRoot>
	)
}

const skills: string[] = ['React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt']

const skillsOptions: ComboOption[] = [
	{ value: 'react', label: 'React' },
	{ value: 'vue', label: 'Vue' },
	{ value: 'angular', label: 'Angular' },
	{ value: 'svelte', label: 'Svelte' },
	{ value: 'nextjs', label: 'Next.js' },
	{ value: 'nuxt', label: 'Nuxt' },
]

// const rolesOptions: ComboOption[] = [
// 	{ value: 'frontend', label: 'Frontend Developer' },
// 	{ value: 'backend', label: 'Backend Developer' },
// 	{ value: 'fullstack', label: 'Fullstack Developer' },
// 	{ value: 'ml', label: 'ML Engineer' },
// 	{ value: 'designer', label: 'UI/UX Designer' },
// ]

const rolesOptions: ComboGroup[] = [
	{ value: 'frontend', items: ['React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt'] },
	{ value: 'backend', items: ['Node.js', 'Python', 'Java', 'C#', 'PHP'] },
	{
		value: 'fullstack',
		items: [
			'React',
			'Vue',
			'Angular',
			'Svelte',
			'Next.js',
			'Nuxt',
			'Node.js',
			'Python',
			'Java',
			'C#',
			'PHP',
		],
	},
	{ value: 'ml', items: ['Python', 'Java', 'C#', 'PHP'] },
	{ value: 'designer', items: ['UI/UX Designer', 'Graphic Designer', 'Web Designer'] },
]

const customItems: ComboCustomItem[] = [
	{
		value: 'react',
		title: 'React from Facebook',
		desc: 'React is a **JavaScript library** for building `!user` interfaces.',
		button: 'Follow',
		buttonRightIcon: 'email',
	},
	{
		value: 'vue',
		title: 'Vue from Evan You',
		desc: 'Vue is a JavaScript framework for building user interfaces.',
		icon: 'book-marked',
		button: 'Remove',
		buttonVariant: 'destructive',
		buttonSize: 'sm',
		buttonLeftIcon: 'trash',
	},
	{
		value: 'angular',
		title: 'Angular from Google',
		desc: 'Angular is a JavaScript framework for building user interfaces.',
		icon: 'credit-card',
		iconSize: 'sm',
		iconColor: 'error',
	},
	{
		value: 'svelte',
		title: 'Svelte from Svelte Society',
		desc: 'Svelte is a JavaScript compiler for building user interfaces.',
		image: 'https://raw.githubusercontent.com/wiki/picasso/zukit/assets/banner-1544x500.png',
	},
	{
		value: 'nextjs',
		title: 'Next.js from Vercel',
		desc: 'Next.js is a JavaScript framework for building user interfaces.',
		avatar: 'John Doe',
		avatarSize: 'lg',
		avatarBordered: true,
		avatarSrc: 'https://avatars.githubusercontent.com/u/399395',
	},
	{
		value: 'nuxt',
		title: 'Nuxt from NuxtLabs',
		avatar: 'Jane Doe',
		avatarSize: 'sm',
		footer: 'Это просто какой-то футер и ещё какой-то текст...',
	},
]
