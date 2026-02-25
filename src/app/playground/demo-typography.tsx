'use client'

import {
	type TextStyledColor,
	type TextStyledVariant,
	type TypographyDemoState,
} from './demo-typography-settings'
import { useSettings } from './settings-store'
import { Separator } from '@/components/shadcn/separator'
import { Stack } from '@/components/ui'
import { TS } from '@/components/ui/text-styled'
import { cn } from '@/lib/utils'

// data -------------------------------------------------------------------------------------------]

const SAMPLE_TEXTS: Record<Exclude<TextStyledVariant, 'block'>, string> = {
	h1: 'Marketplace для ИИ-специалистов',
	h2: 'Генеративный ИИ — ваша профессия',
	h3: 'Находите лучших фрилансеров',
	h4: 'Профиль и портфолио',
	h5: 'Настройки аккаунта',
	subtitle: 'Платформа для специалистов в области **генеративного ИИ** — быстро, надёжно.',
	body: 'Разместите проект и получите отклики от квалифицированных специалистов в течение нескольких часов.',
	caption: 'Обновлено 3 минуты назад · Только для разработчиков',
	quote: '“Находим лучших специалистов для вашего проекта”',
}

const INTERACTIVE_SAMPLE =
	'Платформа для **фрилансеров** с `опытом` в *генеративном ИИ* — [NeuroGig](https://neurogig.com).'

const VARIANTS: Exclude<TextStyledVariant, 'block'>[] = [
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'quote',
	'body',
	'subtitle',
	'caption',
]

// section header ---------------------------------------------------------------------------------]

function SectionHeader({ title, desc }: { title: string; desc: string }) {
	return (
		<>
			<h3 className="my-1 text-sm font-medium text-foreground">{title}</h3>
			<p className="mb-4 text-xs text-muted-foreground">{desc}</p>
		</>
	)
}

// main demo --------------------------------------------------------------------------------------]

const VALID_VARIANTS = new Set<string>(VARIANTS)
const VALID_COLORS = new Set<string>(['primary', 'secondary', 'dimmed', 'contrast', 'soft'])

export function DemoTypography() {
	const settings = useSettings<TypographyDemoState>()
	const {
		variant: rawVariant,
		color: rawColor,
		strong,
		thin,
		gutterBottom,
		md,
		inline,
	} = settings
	const variant: TextStyledVariant = VALID_VARIANTS.has(rawVariant)
		? (rawVariant as TextStyledVariant)
		: 'body'
	const resolvedColor = VALID_COLORS.has(rawColor) ? (rawColor as TextStyledColor) : undefined
	const needsDarkBg = resolvedColor === 'contrast' || resolvedColor === 'soft'

	return (
		<Stack vertical gap={6} align="stretch">
			{/* Interactive */}
			<section>
				<SectionHeader
					title="Interactive"
					desc="Обёртка `Typography` на базе shadcn and Tailwind CSS."
				/>
				<div className={cn('min-h-14 rounded-md border p-4', needsDarkBg && 'bg-primary')}>
					<TS
						variant={variant}
						color={resolvedColor}
						strong={strong}
						thin={thin}
						gutterBottom={gutterBottom}
						inline={inline}
						md={md ? undefined : false}
						content={INTERACTIVE_SAMPLE}
					/>
				</div>
			</section>

			<Separator />

			{/* All variants */}
			<section>
				<SectionHeader title="Variants" desc="Все поддерживаемые variant-ы." />
				<Stack vertical gap={4} align="stretch">
					{VARIANTS.map((v) => (
						<div key={v} className="flex items-baseline gap-3">
							<span className="w-16 shrink-0 text-xs text-muted-foreground">{v}</span>
							<TS variant={v} content={SAMPLE_TEXTS[v]} />
						</div>
					))}
				</Stack>
			</section>

			<Separator />

			{/* Modifiers */}
			<section>
				<SectionHeader title="Modifiers" desc="strong, thin, gutterBottom, inline." />
				<Stack vertical gap={3} align="stretch">
					<div className="flex items-baseline gap-3">
						<span className="w-24 shrink-0 text-xs text-muted-foreground">default</span>
						<TS content="Обычный текст (body, без модификаторов)" />
					</div>
					<div className="flex items-baseline gap-3">
						<span className="w-24 shrink-0 text-xs text-muted-foreground">strong</span>
						<TS strong content="Strong — font-bold (700)" />
					</div>
					<div className="flex items-baseline gap-3">
						<span className="w-24 shrink-0 text-xs text-muted-foreground">thin</span>
						<TS variant="h3" thin content="Thin на h3 — font-medium вместо semibold" />
					</div>
					<div className="flex items-baseline gap-3">
						<span className="w-24 shrink-0 text-xs text-muted-foreground">gutter</span>
						<div>
							<TS gutterBottom content="gutterBottom — добавляет mb-2 снизу" />
							<TS color="secondary" content="Этот текст идёт сразу после" />
						</div>
					</div>
					<div className="flex items-baseline gap-3">
						<span className="w-24 shrink-0 text-xs text-muted-foreground">inline</span>
						<span>
							<TS inline content="Inline: " />
							<TS inline strong content="strong " />
							<TS inline color="secondary" content="и muted — в одной строке" />
						</span>
					</div>
				</Stack>
			</section>

			<Separator />

			{/* Markdown */}
			<section>
				<SectionHeader
					title="Markdown"
					desc="Встроенная поддержка простого Markdown через simpleMarkdown()."
				/>
				<Stack vertical gap={3} align="stretch">
					<div className="flex items-start gap-3">
						<span className="w-24 shrink-0 pt-1 text-xs text-muted-foreground">
							bold / em
						</span>
						<TS content="**Жирный** и *курсив* — через `**` и `*`" />
					</div>
					<div className="flex items-start gap-3">
						<span className="w-24 shrink-0 pt-1 text-xs text-muted-foreground">
							code
						</span>
						<TS content="`код` и цвета: `!ошибка` `?вопрос` `*успех` `+инфо` `#предупреждение`" />
					</div>
					<div className="flex items-start gap-3">
						<span className="w-24 shrink-0 pt-1 text-xs text-muted-foreground">
							link
						</span>
						<TS content="Ссылка: [NeuroGig](https://neurogig.com) откроется в новой вкладке" />
					</div>
					<div className="flex items-start gap-3">
						<span className="w-24 shrink-0 pt-1 text-xs text-muted-foreground">br</span>
						<TS inline content={'Строка 1\nСтрока 2 через inline+br'} />
					</div>
					<div className="flex items-start gap-3">
						<span className="w-24 shrink-0 pt-1 text-xs text-muted-foreground">
							md=false
						</span>
						<TS md={false} content="**Текст без Markdown** — отображается как есть" />
					</div>
				</Stack>
			</section>
		</Stack>
	)
}
