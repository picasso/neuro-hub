# Codebase Structure

## Top-level src/ layout

```zsh
src/
├── app/          ← Thin routes only (import + re-export, no logic)
├── features/     ← All business-logic components; import via '@/features'
├── ui/           ← UI primitives & design system; import via '@/ui'
├── alerts/       ← Effector-based alert system
├── config/       ← Metadata, mocks, constants
├── lib/          ← auth, db, email, swagger, validations
├── stores/       ← Effector stores
├── utils/        ← Pure utility functions
└── types/        ← Shared TypeScript types
```

## features/ structure

```zsh
features/
├── home/                   HeroSection, BenefitsSection, ShowcaseSection, FaqSection, HomePage
├── dashboard/              DashboardPage (async Server Component)
├── auth/                   LoginForm, LoginPage
├── onboarding/             OnboardingWizard, SignupPage
├── portfolio/              Portfolio, PortfolioEditor, portfolio-item, portfolio-viewer, portfolio-album
├── freelancer-profile/     FreelancerProfileEditor, PublicFreelancerProfileView, FreelancerProfilePage
├── playground/             PlaygroundPage + all demo components
├── header.tsx
├── footer.tsx
├── db-health-alert.tsx
├── how-it-works.tsx
├── freelancers-page.tsx
├── projects-page.tsx
├── post-project-page.tsx
└── index.ts                barrel export
```

## ui/ structure

```zsh
ui/
├── shadcn/      raw Radix/shadcn (INTERNAL — never import directly)
├── providers/   ThemeRegistry, FontProvider
├── icons/       custom SVG icons
├── button.tsx, icon.tsx, icon-button.tsx, link.tsx, stack.tsx
├── text-styled.tsx, file-uploader.tsx, assets.tsx
└── index.ts     barrel — always import from '@/ui'
```

## Import rules

- `import { X } from '@/features'` — always use barrel
- `import { X } from '@/ui'` — always use barrel
- NEVER: `import from '@/ui/shadcn/*'` or `import from '@/features/*/...'`

## app/ page pattern

Every page.tsx must be thin:

```tsx
import { SomePage } from '@/features'
export { someMetadata as metadata } from '@/config'
export default SomePage
```

## shadcn components

- Installed to `src/ui/shadcn/`
- Must be re-exported from `src/ui/index.ts`
- `components.json` aliases: `ui → @/ui/shadcn`, `components → @/ui`
