// pages (client-safe only; server-only pages live in ./server.ts)
export { HomePage } from './home/home-page'
export { LoginPage } from './auth/login-page'
export { SignupPage } from './onboarding/signup-page'
export { HowItWorksPage } from './how-it-works'
export { CreateProjectPage } from './projects/create-project-page'
// NOTE: `PlaygroundPage` is intentionally not exported here for not to break the barrel export rule
// export { PlaygroundPage } from './playground/playground-page'
export { ChatPage } from './chat/page'

// sections & components
export { BenefitsSection } from './home/benefits-section'
export { FaqSection } from './home/faq-section'
export { HeroSection } from './home/hero-section'
export { ShowcaseSection } from './home/showcase-section'
export { FreelancerProfileEditor } from './freelancer-profile/freelancer-profile-editor'
export { FreelancerPublic as PublicFreelancer } from './freelancer-profile/freelancer-public'
export { OnboardingWizard } from './onboarding/onboarding-wizard'
export { PortfolioEditor } from './account-portfolio-editor'
export { DbHealthAlert } from './db-health-alert'
export { loginModal } from './auth/login-page'
export { openChatConversation } from './chat/api'
