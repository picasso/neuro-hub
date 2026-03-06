'use client'

import { useState } from 'react'
import { DemoRoot, DemoSection } from './components-utils'
import { type DialogDemoState } from './demo-dialog-settings'
import { useSettings } from './settings-store'
import { Button, Dialog, Stack, TS } from '@/ui'

type OpenKey =
	| 'interactive'
	| 'sm'
	| 'md'
	| 'lg'
	| 'xl'
	| 'full'
	| 'icon-info'
	| 'icon-warning'
	| 'icon-success'
	| 'icon-error'
	| 'footer'
	| 'no-overlay'

export function DemoDialog() {
	const {
		size,
		animation,
		closeButton,
		footerClose,
		overlay,
		modal,
		icon,
		title,
		description,
		content,
	} = useSettings<DialogDemoState>()

	const [open, setOpen] = useState<Record<OpenKey, boolean>>({
		interactive: false,
		sm: false,
		md: false,
		lg: false,
		xl: false,
		full: false,
		'icon-info': false,
		'icon-warning': false,
		'icon-success': false,
		'icon-error': false,
		footer: false,
		'no-overlay': false,
	})

	const setKey = (key: OpenKey, value: boolean) => setOpen((prev) => ({ ...prev, [key]: value }))

	return (
		<DemoRoot>
			<DemoSection
				title="Interactive"
				desc="Обёртка `?Dialog` на базе **shadcn** — управляется настройками справа"
				separator
			>
				<Dialog
					open={open.interactive}
					onClose={() => setKey('interactive', false)}
					icon={icon ? 'briefcase' : undefined}
					iconOptions={{ color: 'primary' }}
					title={title ? 'Заголовок диалога' : undefined}
					description={
						description
							? 'Описание с `markdown` поддержкой: **bold**, *italic*, [ссылки](https://example.com).'
							: undefined
					}
					size={size}
					animation={animation}
					overlay={overlay}
					showCloseButton={closeButton}
					showFooterClose={footerClose}
					modal={modal}
				>
					{content && (
						<>
							<TS
								variant="body"
								color="secondary"
								content="Здесь может быть любой контент диалога:"
							/>
							<ul className="list-disc list-inside">
								<li>формы</li>
								<li>изображения</li>
								<li>списки</li>
								<li>и т.д.</li>
							</ul>
						</>
					)}
				</Dialog>
				<Button
					variant="default"
					label="Open"
					leftIcon="briefcase"
					onClick={() => setKey('interactive', true)}
				/>
			</DemoSection>

			<DemoSection title="Sizes" asBadge="shield-check" separator>
				<Stack wrap gap={2}>
					{(['sm', 'md', 'lg', 'xl', 'full'] as const).map((s) => (
						<div key={s}>
							<Dialog
								open={open[s]}
								onClose={() => setKey(s, false)}
								title={`Size: ${s}`}
								description={`Диалог с размером **${s}**.\nШирина контролируется пропом \`size\``}
								size={s}
								showCloseButton
							>
								<TS
									variant="body"
									color="secondary"
									content={`\`!max-width\` : **${sizeDesc[s]}**`}
									md={{ br: true }}
								/>
							</Dialog>
							<Button
								variant="outline"
								label={s}
								size="sm"
								onClick={() => setKey(s, true)}
							/>
						</div>
					))}
				</Stack>
			</DemoSection>

			<DemoSection title="Icon in title" asBadge="badge-check" separator>
				<Stack wrap gap={2}>
					{iconVariants.map(({ key, icon, color, label }) => (
						<div key={key}>
							<Dialog
								open={open[key as OpenKey]}
								onClose={() => setKey(key as OpenKey, false)}
								title={label}
								icon={icon}
								iconOptions={{ color }}
								description={`Иконка **${icon}** цвета \`${color}\` в заголовке диалога.`}
								showCloseButton
							>
								<TS
									variant="body"
									color="secondary"
									content="Контент диалога с иконкой в заголовке."
								/>
							</Dialog>
							<Button
								variant="secondary"
								label={label}
								leftIcon={icon}
								size="sm"
								onClick={() => setKey(key as OpenKey, true)}
							/>
						</div>
					))}
				</Stack>
			</DemoSection>

			<DemoSection title="With footer" asBadge="badge-check" separator>
				<Dialog
					open={open.footer}
					onClose={() => setKey('footer', false)}
					title="Подтверждение действия"
					description="Вы уверены, что хотите продолжить? Это действие **нельзя отменить**."
					icon="alert-triangle"
					iconOptions={{ color: 'warning' }}
					footer={
						<Stack gap={2}>
							<Button
								variant="destructive"
								size="sm"
								label="Удалить"
								leftIcon="trash"
								onClick={() => setKey('footer', false)}
							/>
						</Stack>
					}
					showFooterClose
				/>
				<Button
					variant="destructive"
					label="Dialog with footer"
					leftIcon="trash"
					onClick={() => setKey('footer', true)}
				/>
			</DemoSection>

			<DemoSection title="No overlay" asBadge="badge-check" separator>
				<Dialog
					open={open['no-overlay']}
					onClose={() => setKey('no-overlay', false)}
					title="Without overlay"
					description="Диалог с `overlay={false}` — фон страницы остаётся интерактивным."
					overlay={false}
					showCloseButton
				>
					<TS
						variant="body"
						color="secondary"
						content="Без backdrop клик вне диалога не закрывает его — закройте кнопкой X."
					/>
				</Dialog>
				<Button
					variant="outline"
					label="Without overlay"
					leftIcon="ban"
					onClick={() => setKey('no-overlay', true)}
				/>
			</DemoSection>
		</DemoRoot>
	)
}

const sizeDesc: Record<string, string> = {
	sm: 'max-w-sm (~384px)',
	md: 'max-w-lg (~512px)',
	lg: 'max-w-2xl (~672px)',
	xl: 'max-w-4xl (~896px)',
	full: 'max-w-[95vw]',
}

const iconVariants = [
	{ key: 'icon-info', icon: 'info' as const, color: 'info' as const, label: 'Info' },
	{
		key: 'icon-warning',
		icon: 'alert-triangle' as const,
		color: 'warning' as const,
		label: 'Warning',
	},
	{
		key: 'icon-success',
		icon: 'shield-check' as const,
		color: 'success' as const,
		label: 'Success',
	},
	{ key: 'icon-error', icon: 'circle-alert' as const, color: 'error' as const, label: 'Error' },
]
