import { heroContent } from '@/config'
import { Button, PageContainer, Stack, TS } from '@/ui'

export function HeroSection() {
	return (
		<div className="relative overflow-hidden py-18 text-center md:py-26">
			<div className="absolute inset-0 bg-linear-to-br from-[#169e5f] via-[#218569] to-[#6e4fa3]" />
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_28%)]" />

			<PageContainer width="compact" className="relative">
				<div className="rounded-4xl border border-white/15 bg-black/10 px-6 py-10 shadow-2xl shadow-black/10 backdrop-blur-[2px] md:px-10 md:py-14">
					<TS
						variant="h2"
						color="contrast"
						className="font-extrabold text-[2.5rem] leading-tight md:text-[3.5rem]"
						content={heroContent.title}
					/>

					<TS
						variant="h5"
						color="contrast"
						thin
						className="mb-4 text-xl opacity-95 sm:text-2xl"
						content={heroContent.subtitle}
					/>

					<TS
						variant="body"
						color="contrast"
						className="mx-auto mb-8 max-w-150 text-base font-light tracking-wide opacity-90 sm:text-[1.1rem]"
						content={heroContent.description}
					/>

					<Stack vertical gap={4} justify="center" className="mb-6 sm:flex-row">
						<Button
							inverse
							href="/signup?role=freelancer"
							size="lg"
							leftIcon="briefcase"
							label={heroContent.ctaFreelancer}
							className="shadow-lg shadow-black/10"
						/>

						<Button
							inverse
							href="/signup?role=client"
							variant="outline"
							size="lg"
							leftIcon="building"
							label={heroContent.ctaClient}
							className="shadow-lg shadow-black/10"
						/>
					</Stack>

					<Button
						inverse
						href="/login"
						variant="ghost"
						leftIcon="log-in"
						label={heroContent.ctaLogin}
					/>
				</div>
			</PageContainer>
		</div>
	)
}
