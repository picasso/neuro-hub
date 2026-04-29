# Create Pull Request

Create a well-structured PR following project conventions.

## Pre-PR checklist

- [ ] `yarn lint` — 0 errors
- [ ] `yarn type-check` — 0 errors
- [ ] `yarn test` — all passing
- [ ] No debugging code or `console.log`
- [ ] All changes committed

---

## Steps

### 0. Verify gh CLI authentication ⚠️

```bash
gh auth status
```

- Verify the active account has access to the target repository
- Test: `gh repo view <owner>/<repo> --json name,owner`

**If the needed account is logged in but not active:**
```bash
gh auth switch -u <account>
```

**If authentication is still not confirmed** — stop and ask the user which account to use or whether to proceed via web interface. Do not continue until auth is verified.

### 1. Prepare branch

```bash
git status                    # confirm all changes are committed
git push -u origin HEAD
```

### 2. Extract ticket from branch name

Branch format: `feature/XXXX-description` → extract `XXXX` for PR title/description.

### 3. Create PR

```bash
gh pr create --title "..." --body "$(cat <<'EOF'
...
EOF
)"
```

**Language split:**
- Title, section headings, checklist items → **English**
- Summary paragraphs, change descriptions, testing notes → **Russian**

Check if `.github/pull_request_template.md` exists and fill it. Propose the description and wait for confirmation before creating.

### 4. Add labels

```bash
gh label list --repo <owner>/<repo>
```

Pick from existing labels based on PR content:
- `documentation` — docs updates
- `enhancement` — new features
- `bug` / `fixes` — bug fixes

Add during creation: `--label "enhancement"` or after: `gh pr edit <number> --add-label "label"`.

Only use labels that actually exist in the repository.

---

## PR description template

```markdown
## Summary
- <bullet 1>
- <bullet 2>

## Changes
<Russian description of what changed and why>

## Testing
- [ ] <test step 1>
- [ ] <test step 2>

## Notes
<Any breaking changes, migration steps, or caveats>
```

---

## Common issues

**gh CLI sandbox / token access:**
All `gh` commands need access to system keychain. If commands fail with permission errors, ask the user to run the push/PR from their local terminal.

**Auth mismatch:**
1. `gh auth status` — see active account
2. `git remote -v` — see which account git uses
3. `gh auth switch -u <correct-account>`
4. Verify: `gh repo view <owner>/<repo> --json name`
