# Frontend Rule Audit

## Target: $ARGUMENTS

Run a strict rule audit and autofix on the specified file or folder. Focus on drift relative to project frontend conventions — not product redesign.

---

## Scope

Check for and fix violations in:

- **Wrapper-first approach** — prefer `Button`, `Icon`, `TS`, `Stack` from `@/ui` over raw markup
- **`Stack` vs raw `div`** — replace layout-only `div` (flex/gap/alignment) with `Stack`; keep `div` only for overflow, positioning, semantic shell, or shape-specific styling
- **`TS` vs raw text** — replace raw text markup with `TS` where appropriate
- **Import hygiene** — no `@/ui/shadcn/*` direct imports; use `@/ui` barrel
- **Barrel hygiene** — no nested `index.ts`; no internal sub-components in barrel exports
- **`'use client'` boundaries** — follow the decision procedure from CLAUDE.md
- **Comments style** — only `//`, lowercase; no `/** */` or block comments in app code
- **Deprecated event aliases** — no `FormEvent`; prefer `ComponentPropsWithoutRef<'form'>['onSubmit']`
- **Provider duplication** — no local `TooltipProvider` when a global one already exists

### `div` → `Stack` test

Replace `div` with `Stack` when the element's primary purpose is layout (`flex`, `gap`, `items-*`, `justify-*`, `flex-col`, `flex-row`, `flex-wrap`). Keep `div` for overflow/truncate, sticky/absolute/relative positioning layers, and semantic shells where a wrapper component doesn't fit.

---

## Autofix boundaries

**Can fix automatically:**
- Wrapper drift (`div` → `Stack`, raw text → `TS`)
- Import violations (`@/ui/shadcn/*` → `@/ui`)
- Comment style (`/** */` → `//`)
- Deprecated event alias rewrites
- Provider duplication
- Redundant or extraneous props

**Do NOT fix automatically:**
- Public API changes without necessity
- Broad UI redesign
- Anything that changes user-facing behavior, data flow, routing, or server/client boundaries
- Ambiguous cases — put them in `Remaining Drift`

---

## Steps

1. Read the target file(s)
2. Identify violations across all categories above
3. Apply safe fixes immediately
4. Run `yarn type-check` and `yarn lint`

---

## Output format

### Changes
List what was fixed automatically and why.

### Rule Alignment
Which project rules were verified; which drift cases were resolved.

### Remaining Drift
What was intentionally not fixed and why (ambiguous behavior change, needs separate decision, etc.).

### Acceptable Exceptions
Raw `div` or other patterns that are correct and not drift — explain why.

### Verification
Results of `yarn type-check` and `yarn lint`.

---

## Usage examples

```
/front-audit src/ui/chat
/front-audit src/features/playground/demo-chat.tsx
/front-audit src/features/auth/login-modal.tsx
```
