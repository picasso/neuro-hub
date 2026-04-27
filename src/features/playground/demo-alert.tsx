'use client'

import { map, noop } from 'lodash'
import { DemoRoot, DemoSection } from './components-utils'
import { type AlertOptionsDemoState } from './demo-alert-settings'
import { useSettings } from './settings-store'
import {
	createAlert,
	createAlertFx,
	removeAlert,
	updateAlert,
	type Alert as AlertOptions,
} from '@/alerts'
import { Alert, Stack, type ButtonProps, Button, TS } from '@/ui'
import { cn, simpleMarkdown } from '@/utils'

type Severity = 'info' | 'success' | 'warning' | 'error' | 'progress'
type AlertVariant = 'standard' | 'filled' | 'outlined'

export function DemoAlert() {
	const settings = useSettings<AlertOptionsDemoState>()
	const { descAsMarkdown } = settings

	return (
		<DemoRoot>
			<DemoSection
				title="Interactive"
				desc="Обёртка `?Alert` на базе **shadcn** + **Sonner** —> вариант, иконка, заголовок и описание"
				separator
			>
				<Stack vertical gap={4} align="stretch">
					{map(demoSections, (section, index) => (
						<Stack vertical key={`${section.title}-${index}`} align="stretch">
							<TS
								strong
								variant="caption"
								color="secondary"
								content={section.title}
							/>
							<Stack wrap>
								{map(section.demos, (demo, index) => (
									<Button
										key={`${demo.label}-${index}`}
										color={demo.buttonColor}
										variant={demo.buttonVariant ?? 'secondary'}
										leftIcon={demo.leftIcon}
										onClick={() => {
											if (demo.alertOptions.progress) {
												const id = createAlertFx.alertId(demo.label)
												let progress = demo.alertOptions.progress
												const timerId = setInterval(() => {
													dev.log(`${demo.label} progress: [${progress}]`)
													if (progress > 100) {
														clearInterval(timerId)
														removeAlert(id)
														dev.log(
															`{!${demo.label} progress}: [${progress}] - completed`,
														)
													} else {
														updateAlert({ id, progress })
														progress += 10
													}
												}, 1000)
												createAlert({
													id,
													...demo.alertOptions,
													onDismiss: () => clearInterval(timerId),
													onAutoClose: () => clearInterval(timerId),
												})
											} else {
												createAlert(demo.alertOptions)
											}
										}}
										label={demo.label}
									/>
								))}
							</Stack>
						</Stack>
					))}
				</Stack>
			</DemoSection>
			<DemoSection title="Variants & Severities" asBadge="circle-check">
				<Stack vertical gap={3} align="stretch">
					{map(variants, (variant) => (
						<Stack key={variant} align="flex-start">
							{map(severityItems, ({ severity, title, desc }) => (
								<Alert
									key={severity}
									variant={variant}
									severity={severity}
									title={title}
									desc={descAsMarkdown ? undefined : desc}
									onClose={noop}
									className={cn(
										'markdown-root',
										variant === 'filled' && 'contrast',
									)}
								>
									{descAsMarkdown
										? simpleMarkdown(testMarkdown, { br: true })
										: undefined}
								</Alert>
							))}
						</Stack>
					))}
				</Stack>
			</DemoSection>
		</DemoRoot>
	)
}

type DemoConfig = {
	label: string
	buttonColor?: string
	buttonVariant?: ButtonProps['variant']
	leftIcon?: ButtonProps['leftIcon']
	alertOptions: AlertOptions
}

type DemoSection = {
	title: string
	demos: DemoConfig[]
}

const demoSections: DemoSection[] = [
	{
		title: 'Basic Severities & Special Modes',
		demos: [
			{
				label: 'Info',
				buttonColor: 'info',
				alertOptions: {
					severity: 'info',
					message: 'Lorem `#ipsum` dolor sit **amet**, consectetur adipiscing elit',
				},
			},
			{
				label: 'Warning & Block Auto Close',
				buttonColor: 'warning',
				alertOptions: {
					disableAutoClose: true,
					severity: 'warning',
					message: [
						'You can **reuse** %s entities, delete *%s* from this panel or `!%s` and update panel.',
						23,
						'duplicate compounds',
						'cancel registration',
					],
				},
			},
			{
				label: 'Error & Title & Disable Close',
				buttonColor: 'error',
				alertOptions: {
					severity: 'error',
					title: 'Registration failed',
					message:
						'Sed do `!eiusmod` tempor incididunt ut **labore** et dolore magna aliqua.',
					disableClose: true,
				},
			},
			{
				label: 'Success',
				buttonColor: 'success',
				alertOptions: {
					severity: 'success',
					title: 'Registered successfully',
					message: 'Lorem `?ipsum dolor` sit amet, **consectetur** adipiscing elit',
				},
			},
			{
				label: 'Progress',
				buttonColor: 'secondary',
				alertOptions: {
					severity: 'progress',
					title: 'Registering panel...',
					message: 'Lorem `*ipsum` dolor sit amet, **consectetur** adipiscing elit',
					progress: 35,
					disableClose: true,
					disableAutoClose: true,
				},
			},
			{
				label: 'Overlay',
				buttonColor: 'primary',
				alertOptions: {
					severity: 'progress',
					title: 'Loading data...',
					message: 'Please `wait while we process` your request',
					overlay: true,
					progress: 10,
					variant: 'filled',
					disableAutoClose: true,
					disableProgressCaption: true,
				},
			},
		],
	},
	{
		title: 'Variants',
		demos: [
			{
				label: 'Standard',
				buttonColor: 'warning',
				alertOptions: {
					severity: 'info',
					variant: 'standard',
					title: 'Standard variant',
					message: 'This is the **default** variant with no background fill',
				},
			},
			{
				label: 'Filled',
				buttonColor: 'warning',
				alertOptions: {
					severity: 'info',
					variant: 'filled',
					title: 'Filled variant',
					message: 'This variant has a **filled** background',
					disableAutoClose: true,
				},
			},
			{
				label: 'Outlined',
				buttonColor: 'warning',
				alertOptions: {
					severity: 'info',
					variant: 'outlined',
					title: 'Outlined variant',
					message: 'This variant has an **outlined** border',
				},
			},

			{
				label: 'Standard & Overlay',
				buttonColor: 'secondary',
				alertOptions: {
					severity: 'progress',
					variant: 'standard',
					title: 'Standard variant',
					message: 'This is the **default** variant with no background fill',
					overlay: true,
				},
			},
			{
				label: 'Filled & Overlay',
				buttonColor: 'secondary',
				alertOptions: {
					severity: 'error',
					variant: 'filled',
					title: 'Filled variant',
					message: 'This variant has a **filled** background',
					overlay: true,
				},
			},
			{
				label: 'Outlined & Overlay',
				buttonColor: 'secondary',
				alertOptions: {
					severity: 'warning',
					variant: 'outlined',
					title: 'Outlined variant',
					message: 'This variant has an **outlined** border',
					overlay: true,
				},
			},
		],
	},
	{
		title: 'Custom Icons',
		demos: [
			{
				label: 'Custom Icon',
				buttonColor: 'info',
				alertOptions: {
					severity: 'info',
					icon: 'mail',
					title: 'Custom icon',
					message: 'Using **warning** icon instead of default info icon',
				},
			},
			{
				label: 'Animated Icon',
				buttonColor: 'success',
				alertOptions: {
					severity: 'success',
					icon: 'loader-pinwheel',
					iconOptions: { spinning: true },
					title: 'Animated icon',
					message: 'Icon with **rotate** animation',
				},
			},
			{
				label: 'Sized & Colored',
				buttonColor: 'warning',
				alertOptions: {
					severity: 'warning',
					icon: 'media-audio',
					iconOptions: { size: 'xl', color: 'error' },
					title: 'Sized & colored icon',
					message: 'Large **error** icon with error color',
				},
			},
		],
	},
	{
		title: 'Duration & Dismissible',
		demos: [
			{
				label: 'Short (1s)',
				alertOptions: {
					severity: 'info',
					title: 'Short duration (1s)',
					message: 'This alert will disappear quickly',
					duration: 1000,
				},
			},
			{
				label: 'Long (10s)',
				alertOptions: {
					severity: 'info',
					title: 'Long duration (10s)',
					message: 'This alert will stay visible longer',
					duration: 10000,
				},
			},
			{
				label: 'Infinite',
				alertOptions: {
					severity: 'info',
					title: 'Infinite duration',
					message: 'This alert stays until manually dismissed',
					duration: Infinity,
				},
			},
		],
	},
	{
		title: 'Markdown',
		demos: [
			{
				label: 'With Markdown',
				buttonColor: 'success',
				alertOptions: {
					severity: 'success',
					title: 'With Markdown',
					message: [
						'Supports **bold**, *italic*, `code` and [%s](%s) formatting\n' +
							'And colored `!code` and `?code` and `*code` and `+code` and `#code`',
						'links',
						'https://example.com',
					],
					disableAutoClose: true,
					md: { br: true },
				},
			},
			{
				label: 'Without Markdown',
				buttonColor: 'error',
				alertOptions: {
					severity: 'error',
					title: 'Without Markdown',
					message:
						'This shows **raw** text without *markdown* `parsing`' +
						'--|--|--|--|--|--|' +
						'And colored `!code` and `?code` and `*code` and `+code` and `#code`',
					disableAutoClose: true,
					md: false,
				},
			},
		],
	},
]

const severityItems: { severity: Severity; title: string; desc: string }[] = [
	{ severity: 'info', title: 'Standard', desc: 'Standard message.' },
	{ severity: 'success', title: 'Success', desc: 'Success message.' },
	{ severity: 'warning', title: 'Warning', desc: 'Warning message.' },
	{ severity: 'error', title: 'Error', desc: 'Error message.' },
	{ severity: 'progress', title: 'Progress', desc: 'Progress message.' },
]

const variants: AlertVariant[] = ['standard', 'filled', 'outlined']
const testMarkdown =
	'Supports **bold**, *italic*, `code` and [links](https://example.com) formatting\n' +
	'And colored `!code` and `?code` and `*code` and `+code` and `#code`'
