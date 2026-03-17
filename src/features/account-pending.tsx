import { Empty, Skeleton, Stack } from '@/ui'

export async function AccountPending() {
	return (
		<div className="w-full min-w-0">
			<Empty
				compact
				title="Development in progress"
				desc={
					'This section is not yet available.' +
					' We are working on it and it will be available soon. Please try again later.'
				}
				icon="construction"
				iconOptions={{
					size: 100,
					color: 'dimmed',
					tw: 'p-4 rounded-full bg-accent',
				}}
			/>
			<Stack vertical gap={0}>
				<Skeleton shape="avatar" maxW="xl" filler="w-1/4" />
				<Skeleton shape="card" maxW="xl" />
			</Stack>
		</div>
	)
}
