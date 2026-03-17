# MUI → shadcn Миграция: ЗАВЕРШЕНА ✅

> Все MUI-компоненты мигрированы. Зависимости `@mui/*` и `@emotion/*` удалены из `package.json`.

## Глобальная тема и провайдеры

- ~~`src/ui/providers/theme-registry.tsx` — `CssBaseline`, `ThemeProvider`, `AppRouterCacheProvider`~~ ✅ (удалён)
- ~~`src/ui/providers/font-provider.tsx` — `ToggleButton`, `ToggleButtonGroup`~~ ✅ (удалён)
- ~~`src/ui-theme/` — весь каталог~~ ✅ (удалён)

## Alert-система и связанные UI

- ~~`src/alerts/model.ts`~~ ✅
- ~~`src/alerts/alert.tsx`~~ ✅
- ~~`src/alerts/plugin.tsx`~~ ✅

## Фичи: навигация, лэйаут, онбординг, auth, портфолио, главная

- ~~`src/features/footer.tsx`~~ ✅
- ~~`src/features/header.tsx`~~ ✅
- ~~`src/features/home/hero-section.tsx`~~ ✅
- ~~`src/features/home/faq-section.tsx`~~ ✅ (Группа 6)
- ~~`src/features/home/benefits-section.tsx`~~ ✅
- ~~`src/features/home/showcase-section.tsx`~~ ✅
- ~~`src/features/dashboard/dashboard-page.tsx`~~ ✅
- ~~`src/features/post-project-page.tsx`~~ ✅
- ~~`src/features/projects-page.tsx`~~ ✅
- ~~`src/features/freelancers-page.tsx`~~ ✅
- ~~`src/features/how-it-works.tsx`~~ ✅
- ~~`src/features/onboarding/onboarding-wizard.tsx`~~ ✅
- ~~`src/features/onboarding/progress-stepper.tsx`~~ ✅ (Группа 6 — кастомный Stepper)
- ~~`src/features/onboarding/signup-page.tsx`~~ ✅
- ~~`src/features/onboarding/steps/role-selection-step.tsx`~~ ✅
- ~~`src/features/onboarding/steps/skills-selection-step.tsx`~~ ✅
- ~~`src/features/onboarding/steps/client-profile-step.tsx`~~ ✅
- ~~`src/features/onboarding/steps/freelancer-profile-step.tsx`~~ ✅
- ~~`src/features/onboarding/steps/email-verification-step.tsx`~~ ✅
- ~~`src/features/onboarding/steps/credentials-step.tsx`~~ ✅
- ~~`src/features/auth/login-page.tsx`~~ ✅
- ~~`src/features/auth/login-form.tsx`~~ ✅
- ~~`src/features/freelancer-profile/freelancer-profile-page.tsx`~~ ✅
- ~~`src/features/freelancer-profile/freelancer-profile-editor.tsx`~~ ✅
- ~~`src/features/freelancer-profile/public-profile-view.tsx`~~ ✅
- ~~`src/features/portfolio/portfolio-item.tsx`~~ ✅
- ~~`src/features/portfolio/portfolio-editor.tsx`~~ ✅
- ~~`src/features/portfolio/portfolio-viewer.tsx`~~ ✅

## Прочее

- ~~`src/ui/file-uploader.tsx`~~ ✅
- ~~`src/app/playground-old/`~~ ✅ (удалён)
