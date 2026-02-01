'use client'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { Icon, type IconName, type IconProps, TS } from '@/components/ui'

export const IconsDemo = () => {
	const availableIcons: Array<{ name: IconName; color?: IconProps['color'] }> = [
		{ name: 'done', color: 'success' },
		{ name: 'warning', color: 'warning' },
		{ name: 'info', color: 'info' },
		{ name: 'error', color: 'error' },
		{ name: 'do-not-disturb' },
		{ name: 'spinner', color: 'primary' },
		{ name: 'check', color: 'success' },
		{ name: 'loading', color: 'secondary' },
	]

	const sizes: Array<{ size: IconProps['fontSize']; name?: IconName }> = [
		{ size: 'inherit', name: 'info' },
		{ size: 'small', name: 'warning' },
		{ size: 'medium', name: 'error' },
		{ size: 'large', name: 'check' },
	]

	const colors: Array<{ color: IconProps['color']; name?: IconName }> = [
		{ color: 'primary', name: 'info' },
		{ color: 'secondary', name: 'done' },
		{ color: 'error', name: 'error' },
		{ color: 'info', name: 'info' },
		{ color: 'success', name: 'check' },
		{ color: 'warning', name: 'warning' },
	]

	return (
		<Stack spacing={4}>
			<Box>
				<TS variant="h6" gutterBottom>
					Available Icons
				</TS>
				<Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
					{availableIcons.map(({ name, color }) => (
						<Stack key={name} alignItems="center" spacing={0.5}>
							<Icon name={name} fontSize="large" color={color} />
							<TS variant="caption" color="text.secondary">
								{name}
							</TS>
						</Stack>
					))}
				</Stack>
			</Box>

			<Box>
				<TS variant="h6" gutterBottom>
					Colors
				</TS>
				<Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
					{colors.map(({ color, name = 'info' }) => (
						<Stack key={color} alignItems="center" spacing={0.5}>
							<Icon name={name} fontSize="large" color={color} />
							<TS variant="caption" color="text.secondary">
								{color}
							</TS>
						</Stack>
					))}
				</Stack>
			</Box>

			<Box>
				<TS variant="h6" gutterBottom>
					Animation (rotate)
				</TS>
				<Stack direction="row" spacing={3} alignItems="center">
					<Stack alignItems="center" spacing={0.5}>
						<Icon name="loading" fontSize="large" animation="rotate" color="primary" />
						<TS variant="caption" color="text.secondary">
							loading
						</TS>
					</Stack>
					<Stack alignItems="center" spacing={0.5}>
						<Icon name="spinner" fontSize="large" animation="rotate" />
						<TS variant="caption" color="text.secondary">
							spinner
						</TS>
					</Stack>
				</Stack>
			</Box>

			<Box>
				<TS variant="h6" gutterBottom>
					Sizes (fontSize)
				</TS>
				<Stack direction="row" spacing={3} alignItems="center">
					{sizes.map(({ size, name = 'info' }) => (
						<Stack key={size} alignItems="center" spacing={0.5}>
							<Icon name={name} fontSize={size} />
							<TS variant="caption" color="text.secondary">
								{size}
							</TS>
						</Stack>
					))}
				</Stack>
			</Box>

			<Box>
				<TS variant="h6" gutterBottom>
					Custom Sizes (forceSize)
				</TS>
				<Stack direction="row" spacing={3} alignItems="center">
					<Stack alignItems="center" spacing={0.5}>
						<Icon name="info" forceSize={32} />
						<TS variant="caption" color="text.secondary">
							32px
						</TS>
					</Stack>
					<Stack alignItems="center" spacing={0.5}>
						<Icon name="warning" forceSize={48} />
						<TS variant="caption" color="text.secondary">
							48px
						</TS>
					</Stack>
					<Stack alignItems="center" spacing={0.5}>
						<Icon name="error" forceSize={64} />
						<TS variant="caption" color="text.secondary">
							64px
						</TS>
					</Stack>
					<Stack alignItems="center" spacing={0.5}>
						<Icon name="check" forceSize={[80, 40]} />
						<TS variant="caption" color="text.secondary">
							[80, 40]
						</TS>
					</Stack>
				</Stack>
			</Box>
		</Stack>
	)
}
