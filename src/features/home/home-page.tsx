import { BenefitsSection } from './benefits-section'
import { FaqSection } from './faq-section'
import { HeroSection } from './hero-section'
import { ShowcaseSection } from './showcase-section'

export function HomePage() {
	return (
		<main>
			<HeroSection />
			<BenefitsSection />
			<ShowcaseSection />
			<FaqSection />
		</main>
	)
}
