import {
	BenefitsSection,
	FaqSection,
	HeroSection,
	ShowcaseSection,
} from '@/components/features/home'

export default function HomePage() {
	return (
		<main>
			<HeroSection />
			<BenefitsSection />
			<ShowcaseSection />
			<FaqSection />
		</main>
	)
}
