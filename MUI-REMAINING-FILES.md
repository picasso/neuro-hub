# Полный список файлов, где всё ещё используется MUI (старые компоненты)

> **Помечено:** ~~зачёркнуто~~ = мигрировано (Группы 1–5, 7). ✅ = пункт выполнен.

## Глобальная тема и провайдеры

- `src/ui/providers/theme-registry.tsx` — `CssBaseline`, `ThemeProvider` из `@mui/material/styles`, `AppRouterCacheProvider`, импорт `theme` из `@/ui-theme`
- `src/ui/providers/font-provider.tsx` — `ToggleButton`, `ToggleButtonGroup` из `@mui/material`
- `src/ui-theme/mui-modules.d.ts` — декларации модулей MUI (типовые расширения)
- `src/ui-theme/theme.ts` — `alpha`, `createTheme`, `lighten` из `@mui/material/styles`
- `src/ui-theme/feedback.ts` — `lighten`, `Theme`, `ThemeOptions` из `@mui/material/styles`
- `src/ui-theme/components.ts` — `ThemeOptions` и конфиг компонентов MUI (`MuiLink` и др.)
- `src/ui-theme/animations.ts` — `CSSObject` из `@mui/material/styles`
- `src/ui-theme/index.ts` — экспорт `STANDARD_MUI_TYPOGRAPHY_COLORS` (не используется в новом TS, но сама константа осталась)

## Alert-система и связанные UI

- ~~`src/alerts/model.ts` — типы `AlertProps` из `@mui/material/Alert`~~ ✅ (уже на @/ui)
- ~~`src/alerts/alert.tsx` — `MuiAlert`, `MuiAlertTitle`, `Box`, `LinearProgress` из MUI~~ ✅
- ~~`src/alerts/plugin.tsx` — `Box` из `@mui/material/Box`~~ ✅

## Фичи: навигация, лэйаут, онбординг, auth, портфолио, главная

- ~~`src/features/footer.tsx` — `Box`, `Container`, `Grid`, `Stack` из MUI (контейнеры/лэйаут)~~ ✅
- ~~`src/features/header.tsx` — `AppBar`, `Container`, `Stack`, `Toolbar` из MUI~~ ✅
- ~~`src/features/home/hero-section.tsx` — `Box`, `Container`, `Stack`~~ ✅
- `src/features/home/faq-section.tsx` — `Accordion`, `AccordionDetails`, `AccordionSummary`, `Box`, `Container`, `Grid` (отложено: Группа 6)
- ~~`src/features/home/benefits-section.tsx` — `Box`, `Container`, `Grid`, `Paper`, `Stack`~~ ✅
- ~~`src/features/home/showcase-section.tsx` — `Container`, `Grid` (Card/Avatar уже shadcn)~~ ✅
- ~~`src/features/dashboard/dashboard-page.tsx` — `Box`, `Container`~~ ✅
- ~~`src/features/post-project-page.tsx` — `Box`, `Container`~~ ✅
- ~~`src/features/projects-page.tsx` — `Box`, `Container`~~ ✅
- ~~`src/features/freelancers-page.tsx` — `Box`, `Container`~~ ✅
- ~~`src/features/how-it-works.tsx` — `Box`, `Container`~~ ✅
- ~~`src/features/onboarding/onboarding-wizard.tsx` — `Container`, `Paper`, `Stack`~~ ✅
- `src/features/onboarding/progress-stepper.tsx` — `Box`, `Step`, `StepLabel`, `Stepper`, `useTheme`, `useMediaQuery` из MUI (отложено: Группа 6)
- ~~`src/features/onboarding/signup-page.tsx` — `CircularProgress`, `Stack`~~ ✅
- ~~`src/features/onboarding/steps/role-selection-step.tsx` — `Box`, `Grid` (Card уже shadcn)~~ ✅
- ~~`src/features/onboarding/steps/skills-selection-step.tsx` — `Box`, `Checkbox`, `FormControl`, `FormControlLabel`, `List`, `ListItem`, `MenuItem`, `Select`, `Stack`, `TextField`~~ ✅
- ~~`src/features/onboarding/steps/client-profile-step.tsx` — `Box`, `Stack`, `TextField`~~ ✅
- ~~`src/features/onboarding/steps/freelancer-profile-step.tsx` — `Autocomplete`, `Box`, `Stack`, `TextField`~~ ✅
- ~~`src/features/onboarding/steps/email-verification-step.tsx` — `Alert`, `Box`, `Stack`~~ ✅
- ~~`src/features/onboarding/steps/credentials-step.tsx` — `Box`, `InputAdornment`, `Stack`, `TextField`~~ ✅
- ~~`src/features/auth/login-page.tsx` — `CircularProgress`, `Container`, `Stack`~~ ✅
- ~~`src/features/auth/login-form.tsx` — `Box`, `Checkbox`, `Container`, `FormControlLabel`, `Stack`, `TextField`~~ ✅
- `src/features/freelancer-profile/freelancer-profile-page.tsx` — `Box`, `Container`, `Stack`
- ~~`src/features/freelancer-profile/freelancer-profile-editor.tsx` — `Box`, `Stack`, `TextField`~~ ✅
- ~~`src/features/freelancer-profile/public-profile-view.tsx` — `Box`, `Dialog`, `DialogContent`, `DialogTitle`, `Stack` (Badge/Link/TS уже новые)~~ ✅
- ~~`src/features/portfolio/portfolio-item.tsx` — `Box`, `Tooltip`~~ ✅
- ~~`src/features/portfolio/portfolio-editor.tsx` — `Box`, `Divider`, `Stack`, `TextField` (IconButton MUI закомментирован)~~ ✅
- ~~`src/features/portfolio/portfolio-viewer.tsx` — `Box`, `Dialog`, `DialogContent`, `Stack` (IconButton/Link/TS уже новые)~~ ✅

## Прочее

- `src/ui/file-uploader.tsx` — `InputAdornment`, `Paper`, `Stack`, `alpha/darken/lighten` из `@mui/material/styles`, `TextField`
- Старый playground (`src/app/playground-old/*.tsx`) — MUI `Stack`, `Box`, `Tabs`, `Tab` и т.п.; весь каталог `playground-old` можно считать легаси
