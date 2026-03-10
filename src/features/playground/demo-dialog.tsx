'use client'

import { isNil, isString } from 'lodash'
import { useState } from 'react'
import { DemoRoot, DemoSection } from './components-utils'
import { ModalDemo } from './demo-dialog-modals'
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
	| 'actions'
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
		labels,
		actionsPosition,
	} = useSettings<DialogDemoState>()

	const [value, setValue] = useState<unknown>(null)
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
		actions: false,
		'no-overlay': false,
	})

	const setKey = (key: OpenKey, value: boolean) => setOpen((prev) => ({ ...prev, [key]: value }))

	const onClose = (key: OpenKey) => (value: unknown) => {
		setKey(key, false)
		setValue(value as unknown as string)
	}

	return (
		<DemoRoot>
			<DemoSection
				title="Interactive"
				desc="Обёртка `?Dialog` на базе **shadcn** — управляется настройками справа"
				separator
			>
				<Dialog
					open={open.interactive}
					onClose={onClose('interactive')}
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
					actionsPosition={actionsPosition}
					labels={labels ? ['no', 'yes'] : undefined}
				>
					{content && (
						<>
							<TS
								variant="body"
								color="secondary"
								content="Здесь может быть любой контент диалога:"
							/>
							<TS variant="list" content="формы\nизображения\nсписки\nи т.д." />
						</>
					)}
				</Dialog>
				<Button
					variant="default"
					label="Open"
					leftIcon="briefcase"
					onClick={() => setKey('interactive', true)}
				/>
				<TS
					variant="subtitle"
					color="secondary"
					content={
						`\`*value:\` -> \`${isString(value) ? '#"' : isNil(value) ? '!' : '+'}` +
						`${value}${isString(value) ? '"' : ''}\``
					}
					className="mt-4"
				/>
			</DemoSection>

			<DemoSection title="Sizes" asBadge="shield-check" separator>
				<Stack wrap gap={2}>
					{(['sm', 'md', 'lg', 'xl', 'full'] as const).map((s) => (
						<div key={s}>
							<Dialog
								open={open[s]}
								onClose={onClose(s)}
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
								onClose={onClose(key as OpenKey)}
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
					onClose={onClose('footer')}
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
								onClick={() => onClose('footer')('delete')}
							/>
						</Stack>
					}
					showFooterClose
				/>
				<Dialog
					open={open.actions}
					onClose={onClose('actions')}
					title="Действия"
					description="Выберите действие в зависимости от вашего желания:"
					icon="cog"
					iconOptions={{ color: 'info' }}
					actions={[
						{
							id: 'cancel',
							label: 'Отмена',
							variant: 'outline',
							leftIcon: 'x',
							size: 'xs',
						},
						{
							id: 'settings',
							label: 'Настройки',
							variant: 'outline',
							leftIcon: 'cog',
							size: 'xs',
						},
						{
							id: 'delete',
							label: 'Удалить',
							variant: 'destructive',
							leftIcon: 'trash',
							size: 'xs',
						},
						{
							id: 'confirm',
							label: 'Подтвердить',
							variant: 'default',
							leftIcon: 'check',
							size: 'xs',
						},
					]}
					actionsPosition={actionsPosition}
				/>
				<Stack>
					<Button
						variant="destructive"
						label="Dialog with footer"
						leftIcon="trash"
						onClick={() => setKey('footer', true)}
					/>
					<Button
						variant="outline"
						label="Dialog with actions"
						leftIcon="cog"
						onClick={() => setKey('actions', true)}
					/>
				</Stack>
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
			<DemoSection title="Modals system" asBadge="badge-check">
				<ModalDemo setValue={setValue} />
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
