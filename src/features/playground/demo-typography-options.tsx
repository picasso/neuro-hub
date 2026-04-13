'use client'

import { map } from 'lodash'
import { DemoLabel, DemoRoot, DemoSection } from './components-utils'
import {
	type TextStyledColor,
	type TextStyledVariant,
	type TypographyDemoState,
} from './demo-typography-settings'
import { useSettings } from './settings-store'
import { Stack, TS } from '@/ui'
import { cn } from '@/utils'

// main demo --------------------------------------------------------------------------------------]

export function DemoTypographyOptions() {
	const settings = useSettings<TypographyDemoState>()
	const {
		variant: rawVariant,
		color: rawColor,
		strong,
		thin,
		gutterBottom,
		md,
		inline,
		clean,
	} = settings
	const variant: TextStyledVariant = validVariants.has(rawVariant)
		? (rawVariant as TextStyledVariant)
		: 'body'
	const resolvedColor = validColors.has(rawColor) ? (rawColor as TextStyledColor) : undefined
	const needsDarkBg = resolvedColor === 'contrast' || resolvedColor === 'soft'

	return (
		<DemoRoot>
			<DemoSection
				title="Interactive"
				desc="Обёртка `?Typography` на базе shadcn and **Tailwind CSS**"
				separator
			>
				<div className={cn('min-h-14 rounded-md border p-4', needsDarkBg && 'bg-primary')}>
					<TS
						variant={variant}
						color={resolvedColor}
						clean={clean}
						strong={strong}
						thin={thin}
						gutterBottom={gutterBottom}
						inline={inline}
						md={md ? undefined : false}
						content={interactiveSample}
					/>
				</div>
			</DemoSection>

			<DemoSection
				title="Variants"
				desc="Все поддерживаемые `variant`-ы"
				asBadge="quote"
				separator
			>
				<Stack vertical gap={4} align="stretch">
					{map(variants, (v) => (
						<Stack key={v} gap={3} align="baseline">
							<DemoLabel content={v} size="sm" />
							<TS variant={v} clean={clean} content={sampleTexts[v]} />
						</Stack>
					))}
				</Stack>
			</DemoSection>

			<DemoSection
				title="Modifiers"
				desc="`*strong` `*thin` `*gutterBottom` `*inline`"
				asBadge="quote"
				separator
			>
				<Stack vertical gap={3} align="stretch">
					<Stack gap={3} align="baseline">
						<DemoLabel content="default" size="md" />
						<TS content="Обычный текст (body, без модификаторов)" />
					</Stack>
					<Stack gap={3} align="baseline">
						<DemoLabel content="strong" size="md" />
						<TS strong content="Strong — `font-bold (700)`" />
					</Stack>
					<Stack gap={3} align="baseline">
						<DemoLabel content="thin" size="md" />
						<TS
							variant="h3"
							thin
							content="Thin на h3 — `font-medium` вместо `semibold`"
						/>
					</Stack>
					<Stack gap={3} align="baseline">
						<DemoLabel content="gutterBottom" size="md" />
						<div>
							<TS gutterBottom content="gutterBottom — добавляет `mb-4` снизу" />
							<TS
								color="secondary"
								content="Этот текст идёт сразу после"
								className="border-t"
							/>
						</div>
					</Stack>
					<Stack gap={3} align="baseline">
						<DemoLabel content="inline" size="md" />
						<span>
							<TS inline content="Inline: " />
							<TS inline strong content="`strong` " />
							<TS inline color="secondary" content="и `muted` — в одной строке" />
						</span>
					</Stack>
				</Stack>
			</DemoSection>

			<DemoSection
				title="Markdown"
				desc="Встроенная поддержка простого Markdown через `simpleMarkdown()`"
				asBadge="quote"
			>
				<Stack vertical gap={3} align="stretch">
					<Stack gap={3} align="start">
						<DemoLabel content="bold / em" size="md" className="pt-1" />
						<TS
							variant="subtitle"
							content="**Жирный** и *курсив* — через `#**` и `#*`"
						/>
					</Stack>
					<Stack gap={3} align="start">
						<DemoLabel content="code" size="md" className="pt-1" />
						<TS
							variant="subtitle"
							content="`код` и цвета: `!ошибка` `?вопрос` `*успех` `+инфо` `#предупреждение`"
						/>
					</Stack>
					<Stack gap={3} align="start">
						<DemoLabel content="link" size="md" className="pt-1" />
						<TS
							variant="subtitle"
							content="Ссылка: [NeuroGig](https://neurogig.com) откроется в новой вкладке"
						/>
					</Stack>
					<Stack gap={3} align="start">
						<DemoLabel content="br" size="md" className="pt-1" />
						<TS
							variant="subtitle"
							inline
							content={'Строка 1\nСтрока 2 через inline+br'}
						/>
					</Stack>
					<Stack gap={3} align="start">
						<DemoLabel content="md=false" size="md" className="pt-1" />
						<TS
							variant="subtitle"
							md={false}
							content="**Текст без Markdown** — отображается как есть"
						/>
					</Stack>
				</Stack>
			</DemoSection>
		</DemoRoot>
	)
}

// data -------------------------------------------------------------------------------------------]

const sampleTexts: Record<Exclude<TextStyledVariant, 'block'>, string> = {
	h1: 'Marketplace для ИИ-специалистов',
	h2: 'Генеративный ИИ — ваша профессия',
	h3: 'Находите лучших фрилансеров',
	h4: 'Профиль и портфолио',
	h5: 'Настройки аккаунта',
	lead: 'Платформа для специалистов в области генеративного ИИ — быстро, надёжно.',
	subtitle: 'Платформа для специалистов в области **генеративного ИИ** — быстро, надёжно.',
	body: 'Разместите проект и получите отклики от квалифицированных специалистов в течение нескольких часов.',
	caption: 'Обновлено 3 минуты назад · Только для разработчиков',
	quote: '“Находим лучших специалистов для вашего проекта”',
	list: 'Первый `элемент` списка\nВторой **элемент** списка\nТретий *элемент* списка',
}

const interactiveSample =
	'Платформа для **фрилансеров** с `опытом` в *генеративном ИИ* — [NeuroGig](https://neurogig.com).'

const variants: Exclude<TextStyledVariant, 'block'>[] = [
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'lead',
	'quote',
	'body',
	'list',
	'subtitle',
	'caption',
]

const validVariants = new Set<string>(variants)
const validColors = new Set<string>(['primary', 'secondary', 'dimmed', 'contrast', 'soft'])
