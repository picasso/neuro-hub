'use client'

import { useState } from 'react'
import { DemoRoot, DemoSection } from './components-utils'
import { type SelectDemoState } from './demo-selects-settings'
import { imageUrls } from './mock'
import { useSettings } from './settings-store'
import {
	Combobox,
	ComboboxSimple,
	ComboboxGroupped,
	Select,
	SelectGroupped,
	Stack,
	useComboboxAnchor,
	type ComboOption,
	type ComboGroup,
	type ComboCustomItem,
	type SelectOption,
	type SelectOptionGroup,
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
		alignWithTrigger,
	} = settings
	const [selectValue, setSelectValue] = useState('')
	const [selectGroupValue, setSelectGroupValue] = useState('')
	const [value, setValue] = useState<string | null>(null)
	const [values, setValues] = useState<string[] | null>(null)
	const [comboValue, setComboValue] = useState<ComboOption | null>(null)
	const [comboGroupValue, setComboGroupValue] = useState<ComboGroup | null>(null)
	const [customValue, setCustomValue] = useState<ComboCustomItem | null>(null)
	const chipsAnchor = useComboboxAnchor()

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
				<Stack vertical gap={4} align="stretch">
					<Select
						label="Роль"
						placeholder="Выберите роль..."
						items={selectOptions}
						value={selectValue}
						onValueChange={setSelectValue}
						error={error ? 'Поле обязательно' : undefined}
						helper={{
							helper: helperText
								? 'Выберите **вашу** основную `developer` роль'
								: undefined,
							md: markdown ? { br: true } : false,
						}}
						disabled={disabled}
						required={required}
						alignWithTrigger={alignWithTrigger}
					/>
					<SelectGroupped
						label="Специализация"
						placeholder="Выберите специализацию..."
						groups={selectGroups}
						value={selectGroupValue}
						onValueChange={setSelectGroupValue}
						helper="Сгруппировано по **направлению** development"
						disabled={disabled}
						required={required}
						alignWithTrigger={alignWithTrigger}
					/>
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

const selectOptions: SelectOption[] = [
	{ value: 'frontend', label: 'Frontend Developer' },
	{ value: 'backend', label: 'Backend Developer' },
	{ value: 'fullstack', label: 'Fullstack Developer' },
	{ value: 'ml', label: 'ML Engineer' },
	{ value: 'designer', label: 'UI/UX Designer' },
]

const selectGroups: SelectOptionGroup[] = [
	{
		label: 'Frontend',
		options: [
			{ value: 'react', label: 'React Developer' },
			{ value: 'vue', label: 'Vue Developer' },
			{ value: 'angular', label: 'Angular Developer' },
		],
		separator: true,
	},
	{
		label: 'Backend',
		options: [
			{ value: 'node', label: 'Node.js Developer' },
			{ value: 'python', label: 'Python Developer' },
			{ value: 'java', label: 'Java Developer' },
		],
		separator: true,
	},
	{
		label: 'AI / ML',
		options: [
			{ value: 'ml-eng', label: 'ML Engineer' },
			{ value: 'llm', label: 'LLM Specialist' },
		],
	},
]

const skills: string[] = ['React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt']

const skillsOptions: ComboOption[] = [
	{ value: 'react', label: 'React' },
	{ value: 'vue', label: 'Vue' },
	{ value: 'angular', label: 'Angular' },
	{ value: 'svelte', label: 'Svelte' },
	{ value: 'nextjs', label: 'Next.js' },
	{ value: 'nuxt', label: 'Nuxt' },
]

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
		image: imageUrls.banner,
	},
	{
		value: 'nextjs',
		title: 'Next.js from Vercel',
		desc: 'Next.js is a JavaScript framework for building user interfaces.',
		avatar: 'John Doe',
		avatarSize: 'lg',
		avatarBordered: true,
		avatarSrc: imageUrls.avatar,
	},
	{
		value: 'nuxt',
		title: 'Nuxt from NuxtLabs',
		avatar: 'Jane Doe',
		avatarSize: 'sm',
		footer: 'Это просто какой-то футер и ещё какой-то текст...',
	},
]
