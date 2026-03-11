import { config } from '@/config'
import { Badge, Link, PageContainer, Stack, TS } from '@/ui'

export function AccountFooter() {
	return (
		<footer className="border-t border-border bg-accent/80">
			<PageContainer width="desktop" className="py-4 md:py-5">
				<div className="grid grid-cols-1 items-center gap-3 text-center md:grid-cols-[1fr_auto_1fr] md:text-left">
					<Stack wrap gap={2.5} className="justify-center md:justify-start">
						<Link href="/" className="inline-flex items-center">
							<TS variant="caption" clean strong content="NeuroGig" />
						</Link>
						<Badge
							icon="done"
							variant="outline"
							color="secondary"
							label={config.version}
							size="xs"
						/>
					</Stack>

					<Stack wrap gap={3} className="justify-center">
						<Link
							href="/api/reference"
							size="sm"
							color="secondary"
							hover="vivid"
							label="Документация"
						/>
						<Link
							href="/faq"
							size="sm"
							color="secondary"
							hover="none"
							label="FAQ"
							aria-disabled="true"
							tabIndex={-1}
							className="pointer-events-none opacity-60"
						/>
					</Stack>

					<TS
						variant="caption"
						color="secondary"
						clean
						className="justify-self-center md:justify-self-end"
						content={`© ${new Date().getFullYear()} NeuroGig. Все права защищены.`}
					/>
				</div>
			</PageContainer>
		</footer>
	)
}
