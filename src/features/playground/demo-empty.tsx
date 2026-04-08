'use client'

import { map } from 'lodash'
import { DemoLabel, DemoRoot, DemoSection } from './components-utils'
import { type EmptyDemoState } from './demo-empty-settings'
import { useSettings } from './settings-store'
import { Button, Empty, type EmptyProps, Stack } from '@/ui'
import { cn } from '@/utils'

export function DemoEmpty() {
	const {
		align,
		mediaIcon,
		icon,
		title,
		desc,
		outline,
		error,
		dark,
		light,
		disabled,
		fullWidth,
		compact,
		helper,
		actions,
	} = useSettings<EmptyDemoState>()

	return (
		<DemoRoot>
			<DemoSection
				title="Interactive"
				desc="Обёртка `?Empty` на базе **shadcn** —> выравнивание, иконка, заголовок, описание, error, dark/light и прочее"
				separator
			>
				<Empty
					align={align}
					icon={icon ? 'folder-kanban' : undefined}
					mediaIcon={
						mediaIcon === 'default'
							? true
							: mediaIcon === 'none'
								? undefined
								: mediaIcon
					}
					title={title ? 'Нет элементов' : undefined}
					desc={
						desc
							? 'Создайте первую запись или импортируйте данные из файла.'
							: undefined
					}
					outline={outline}
					error={error}
					dark={dark}
					light={light}
					disabled={disabled}
					fullWidth={fullWidth}
					compact={compact}
					helper={helper ? 'Подсказка: поддерживаются форматы CSV и JSON.' : undefined}
				>
					{actions ? (
						<Stack direction="row" gap={2} wrap>
							<Button label="Создать" size="sm" />
							<Button label="Импорт" variant="outline" size="sm" />
						</Stack>
					) : undefined}
				</Empty>
			</DemoSection>
			<DemoSection
				title="Variants gallery"
				desc="Некоторые варианты с разными свойствами и layouts."
				separator
			>
				<Stack gap={6} align="start" wrap>
					{map(variants, ({ label, ...props }, index) => (
						<Stack
							key={index}
							vertical
							align="start"
							className={cn(
								'w-full max-w-80',
								index === variants.length - 1 && 'max-w-2xl',
							)}
						>
							<DemoLabel content={label} nowrap />
							<Empty {...props} />
						</Stack>
					))}
				</Stack>
			</DemoSection>
		</DemoRoot>
	)
}
const variants: Array<EmptyProps & { label: string }> = [
	{
		label: 'Outline & icon',
		icon: 'image',
		outline: true,
		title: 'Галерея пуста',
		desc: 'Загрузите изображения, чтобы заполнить блок.',
	},
	{
		label: 'Error & helper text',
		icon: 'alert-triangle',
		mediaIcon: 'center',
		error: true,
		title: 'Не удалось загрузить',
		desc: 'Проверьте соединение и попробуйте снова.',
		helper: 'Код: NETWORK_TIMEOUT',
	},
	{
		label: 'Dark & icon (align: start)',
		icon: 'folder-kanban',
		outline: true,
		align: 'start',
		dark: true,
		title: 'Нет элементов',
		desc: 'Создайте первую запись или импортируйте данные из файла.',
	},
	{
		label: 'Compact light',
		icon: 'user',
		compact: true,
		mediaIcon: 'center',
		align: 'start',
		light: true,
		title: 'Start',
		desc: 'Выравнивание start + media center.',
		helper: 'Это поможет вам начать работу.',
	},
	{
		label: 'Compact dark & black Markdown description',
		compact: true,
		align: 'start',
		dark: true,
		outline: true,
		fullWidth: true,
		desc: 'Лучше это делать не встроенной `?Tailwind`-утилитой вида **darken(chat-1)**. Для цветов из CSS variables самый практичный вариант это `*color-mix()`',
		helper: 'Это единственный совет, который я могу дать.',
		className: 'text-pretty **:data-[slot=empty-description]:text-foreground',
	},
]
