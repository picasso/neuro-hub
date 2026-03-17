import { BenefitsSection } from './benefits-section'
import { FaqSection } from './faq-section'
import { HeroSection } from './hero-section'
import { ShowcaseSection } from './showcase-section'
import { PageShell } from '@/ui'

export function HomePage() {
	return (
		<PageShell preset="full">
			<HeroSection />
			<BenefitsSection />
			<ShowcaseSection />
			<FaqSection />
		</PageShell>
	)
}
