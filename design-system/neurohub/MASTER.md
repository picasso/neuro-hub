# Design System - NeuroGig

Updated: 2026-02-19

## Color Palette

- Primary: #1dbf73 (green) - brand, links, navigation
- Primary Dark: #169e5f - hover states
- Primary Light: #35d48d - highlights, badges
- CTA Accent: #7C3AED (violet) - main CTA buttons, AI elements
- CTA Dark: #6D28D9 - CTA hover
- Background: #f7f7f4 (warm white) - page background
- Surface: #ffffff - cards, modals, paper
- Text: #26251e (warm dark) - primary text
- Text Secondary: #62646a - muted text
- Text Dimmed: #808288 - hints, placeholders
- Border: #e5e5e0 - dividers, input borders

Green primary (freelancing, growth) + violet CTA (AI, creativity, premium). Warm neutrals.

## Typography

Manrope (Google Font) for all text — headings and body.
Loaded via next/font/google with CSS variable --font-sans.
Subsets: latin, cyrillic. Weights: 400, 500, 600, 700.

## Component Specs

### Buttons

- CTA: bg #7C3AED, hover #6D28D9, white text
- Primary: bg #1dbf73, hover #169e5f, white text
- Outline: transparent bg, border #e5e5e0, text #26251e
- All buttons: padding 12px 24px, radius 8px, weight 600, transition 200ms

### Cards

- White bg, border 1px #e5e5e0, radius 12px, padding 24px
- Hover: shadow + translateY(-2px)

### Inputs

- Border #e5e5e0, radius 8px, font 16px
- Focus: border #1dbf73
- Placeholder: #808288

### Modals

- Overlay: dark with backdrop blur 4px
- Modal: white, radius 16px, padding 32px

## Style

Clean Modern with subtle Glassmorphism on overlays. Warm shadows, clean borders.

## Anti-Patterns

- No excessive animation
- No dark mode by default
- No emojis as icons (use Lucide SVG)
- cursor pointer on all clickable elements
- No layout-shifting hovers
- Minimum text contrast ratio 4.5
- Always transitions 150-300ms
- Visible focus states for a11y
