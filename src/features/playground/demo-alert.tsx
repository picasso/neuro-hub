'use client'

import { map, noop } from 'lodash'
import { DemoRoot, DemoSection } from './components-utils'
import { type AlertDemoState } from './demo-alert-settings'
import { useSettings } from './settings-store'
import {
	createAlert,
	createAlertFx,
	removeAlert,
	updateAlert,
	type Alert as AlertOptions,
} from '@/alerts'
import { Alert, Stack, type ButtonProps, Button, TS } from '@/ui'

export function DemoAlert() {
	const settings = useSettings<AlertDemoState>()
	const { variant, withIcon, withDescription } = settings

	return (
		<DemoRoot>
			<DemoSection
				title="Interactive"
				desc="Обёртка `Alert` на базе **shadcn** — вариант, иконка, заголовок и описание"
				separator
			>
				{/* <Alert variant={variant}>
					{withIcon && (
						<Icon
							name={variant === 'destructive' ? 'alert-triangle' : 'info'}
							size="sm"
							className="shrink-0"
						/>
					)}
					<AlertTitle>Alert title</AlertTitle>
					{withDescription && (
						<AlertDescription>
							Optional description. You can put any content here.
						</AlertDescription>
					)}
				</Alert> */}
				<Stack vertical gap={4} align="stretch">
					{map(demoSections, (section, index) => (
						<Stack vertical key={`${section.title}-${index}`} align="stretch">
							<TS strong variant="subtitle" content={section.title} />
							<Stack wrap>
								{map(section.demos, (demo, index) => (
									<Button
										key={`${demo.label}-${index}`}
										color={demo.buttonColor}
										variant={demo.buttonVariant ?? 'outline'}
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
			<DemoSection title="Variants & Severities" separator>
				<Stack vertical gap={3} align="stretch">
					<Stack align="flex-start">
						<Alert
							variant="standard"
							severity="info"
							title="Standard"
							desc="Standard message."
							onClose={noop}
						/>
						<Alert
							variant="standard"
							severity="success"
							title="Success"
							desc="Success message."
							onClose={noop}
						/>
						<Alert
							variant="standard"
							severity="warning"
							title="Warning"
							desc="Warning message."
							onClose={noop}
						/>
						<Alert
							variant="standard"
							severity="error"
							title="Error"
							desc="Error message."
							onClose={noop}
						/>
						<Alert
							variant="standard"
							severity="progress"
							title="Progress"
							desc="Progress message."
							onClose={noop}
						/>
					</Stack>
					<Stack align="flex-start">
						<Alert
							variant="filled"
							severity="info"
							title="Filled"
							desc="Filled message."
							onClose={noop}
						/>
						<Alert
							variant="filled"
							severity="success"
							title="Success"
							desc="Success message."
							onClose={noop}
						/>
						<Alert
							variant="filled"
							severity="warning"
							title="Warning"
							desc="Warning message."
							onClose={noop}
						/>
						<Alert
							variant="filled"
							severity="error"
							title="Error"
							desc="Error message."
							onClose={noop}
						/>
						<Alert
							variant="filled"
							severity="progress"
							title="Progress"
							desc="Progress message."
							onClose={noop}
						/>
					</Stack>
					<Stack>
						<Alert
							variant="outlined"
							severity="info"
							title="Outlined"
							desc="Outlined message."
							onClose={noop}
						/>
						<Alert
							variant="outlined"
							severity="success"
							title="Success"
							desc="Success message."
							onClose={noop}
						/>
						<Alert
							variant="outlined"
							severity="warning"
							title="Warning"
							desc="Warning message."
							onClose={noop}
						/>
						<Alert
							variant="outlined"
							severity="error"
							title="Error"
							desc="Error message."
							onClose={noop}
						/>
						<Alert
							variant="outlined"
							severity="progress"
							title="Progress"
							desc="Progress message."
							onClose={noop}
						/>
					</Stack>
				</Stack>
			</DemoSection>
			<DemoSection title="With icon" separator>
				<Stack vertical gap={3} align="stretch">
					{variant}:{withIcon}:{withDescription}
					{/* <Alert variant="default">
						<Icon name="info" size="sm" className="shrink-0" />
						<AlertTitle>Info</AlertTitle>
						<AlertDescription>Default variant with leading icon.</AlertDescription>
					</Alert>
					<Alert variant="destructive">
						<Icon name="alert-triangle" size="sm" className="shrink-0" />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>Destructive variant with icon.</AlertDescription>
					</Alert> */}
				</Stack>
			</DemoSection>
			<DemoSection title="Title only">
				{/* <Alert variant="default">
					<AlertTitle>Short message without description</AlertTitle>
				</Alert> */}
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
					severity: 'progress',
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
					severity: 'progress',
					variant: 'outlined',
					title: 'Outlined variant',
					message: 'This variant has an **outlined** border',
					overlay: true,
				},
			},
		],
	},
	{
		title: 'Elevation',
		demos: [
			{
				label: 'Elevation 0',
				buttonColor: 'error',
				alertOptions: {
					severity: 'info',
					elevation: 0,
					title: 'Elevation 0',
					message: 'No shadow - flat appearance',
				},
			},
			{
				label: 'Elevation 3',
				buttonColor: 'error',
				alertOptions: {
					severity: 'warning',
					elevation: 3,
					title: 'Elevation 3',
					message: 'Small shadow - default elevation',
				},
			},
			{
				label: 'Elevation 6',
				buttonColor: 'error',
				alertOptions: {
					severity: 'success',
					elevation: 6,
					title: 'Elevation 6',
					message: 'Medium shadow - default elevation',
				},
			},
			{
				label: 'Elevation 12',
				buttonColor: 'error',
				alertOptions: {
					severity: 'error',
					elevation: 12,
					title: 'Elevation 12',
					message: 'High shadow - prominent appearance',
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
					icon: 'email',
					title: 'Custom icon',
					message: 'Using **warning** icon instead of default info icon',
				},
			},
			{
				label: 'Animated Icon',
				buttonColor: 'success',
				alertOptions: {
					severity: 'success',
					icon: 'spinner',
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
