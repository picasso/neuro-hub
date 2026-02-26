'use client'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { map } from 'lodash'
import { Icon, type IconName, type IconProps, TS } from '@/ui'

export const IconsDemo = () => {
	const availableIcons: Array<{ name: IconName; color?: IconProps['color'] }> = [
		{ name: 'done', color: 'success' },
		{ name: 'warning', color: 'warning' },
		{ name: 'info', color: 'info' },
		{ name: 'error', color: 'error' },
		{ name: 'do-not-disturb' },
		{ name: 'spinner', color: 'primary' },
		{ name: 'check', color: 'success' },
		{ name: 'loading', color: 'muted' },
	]

	const sizes: Array<{ size: IconProps['size']; name?: IconName }> = [
		{ size: 'xs', name: 'info' },
		{ size: 'sm', name: 'warning' },
		{ size: 'md', name: 'error' },
		{ size: 'lg', name: 'check' },
	]

	const colors: Array<{ color: IconProps['color']; name?: IconName }> = [
		{ color: 'primary', name: 'info' },
		{ color: 'muted', name: 'done' },
		{ color: 'error', name: 'error' },
		{ color: 'info', name: 'info' },
		{ color: 'success', name: 'check' },
		{ color: 'warning', name: 'warning' },
	]

	return (
		<Stack spacing={4}>
			<Box>
				<TS variant="h5" gutterBottom>
					Available Icons
				</TS>
				<Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
					{map(availableIcons, ({ name, color }) => (
						<Stack key={name} alignItems="center" spacing={0.5}>
							<Icon name={name} size="lg" color={color} />
							<TS variant="caption" color="secondary">
								{name}
							</TS>
						</Stack>
					))}
				</Stack>
			</Box>

			<Box>
				<TS variant="h5" gutterBottom>
					Colors
				</TS>
				<Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
					{map(colors, ({ color, name = 'info' }) => (
						<Stack key={color} alignItems="center" spacing={0.5}>
							<Icon name={name} size="lg" color={color} />
							<TS variant="caption" color="secondary">
								{color}
							</TS>
						</Stack>
					))}
				</Stack>
			</Box>

			<Box>
				<TS variant="h5" gutterBottom>
					Animation (rotate)
				</TS>
				<Stack direction="row" spacing={3} alignItems="center">
					<Stack alignItems="center" spacing={0.5}>
						<Icon name="loading" size="lg" spinning color="primary" />
						<TS variant="caption" color="secondary">
							loading
						</TS>
					</Stack>
					<Stack alignItems="center" spacing={0.5}>
						<Icon name="spinner" size="lg" spinning />
						<TS variant="caption" color="secondary">
							spinner
						</TS>
					</Stack>
				</Stack>
			</Box>

			<Box>
				<TS variant="h5" gutterBottom>
					Sizes (size)
				</TS>
				<Stack direction="row" spacing={3} alignItems="center">
					{map(sizes, ({ size, name = 'info' }) => (
						<Stack key={size} alignItems="center" spacing={0.5}>
							<Icon name={name} size={size} />
							<TS variant="caption" color="secondary">
								{size}
							</TS>
						</Stack>
					))}
				</Stack>
			</Box>

			<Box>
				<TS variant="h5" gutterBottom>
					Custom Sizes (size)
				</TS>
				<Stack direction="row" spacing={3} alignItems="center">
					<Stack alignItems="center" spacing={0.5}>
						<Icon name="info" size={32} />
						<TS variant="caption" color="secondary">
							32px
						</TS>
					</Stack>
					<Stack alignItems="center" spacing={0.5}>
						<Icon name="warning" size={48} />
						<TS variant="caption" color="secondary">
							48px
						</TS>
					</Stack>
					<Stack alignItems="center" spacing={0.5}>
						<Icon name="error" size={64} />
						<TS variant="caption" color="secondary">
							64px
						</TS>
					</Stack>
					<Stack alignItems="center" spacing={0.5}>
						<Icon name="check" size={80} />
						<TS variant="caption" color="secondary">
							80px
						</TS>
					</Stack>
				</Stack>
			</Box>
		</Stack>
	)
}
