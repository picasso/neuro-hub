'use client'

import { heroContent } from '@/config'
import { Button, PageContainer, TS } from '@/ui'

export function HeroSection() {
	return (
		<div
			className="py-16 md:py-24 text-center"
			style={{ background: 'linear-gradient(135deg, #169e5f 0%, #764ba2 100%)' }}
		>
			<PageContainer width="compact">
				<TS
					variant="h2"
					color="contrast"
					className="font-extrabold text-[2.5rem] md:text-[3.5rem]"
					content={heroContent.title}
				/>

				<TS
					variant="h5"
					color="contrast"
					thin
					className="text-xl sm:text-2xl mb-4 opacity-95"
					content={heroContent.subtitle}
				/>

				<TS
					variant="body"
					color="contrast"
					className="mb-8 text-base sm:text-[1.1rem] opacity-90 max-w-150 mx-auto"
					content={heroContent.description}
				/>

				<div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
					<Button
						href="/signup?role=freelancer"
						size="lg"
						leftIcon="work"
						iconOptions={{ color: 'primary' }}
						label={heroContent.ctaFreelancer}
						// TODO: check after migration
						className="bg-white text-primary px-8 py-3 text-[1.1rem] font-semibold hover:bg-gray-100"
					/>

					<Button
						href="/signup?role=client"
						variant="outline"
						size="lg"
						leftIcon="business"
						iconOptions={{ color: 'contrast' }}
						label={heroContent.ctaClient}
						// TODO: check after migration
						className="border-white text-white px-8 py-3 text-[1.1rem] font-semibold hover:bg-white/10"
					/>
				</div>

				<Button
					href="/login"
					variant="ghost"
					leftIcon="login"
					iconOptions={{ color: 'contrast' }}
					label={heroContent.ctaLogin}
					// TODO: check after migration
					className="text-white underline hover:bg-transparent hover:underline"
				/>
			</PageContainer>
		</div>
	)
}
