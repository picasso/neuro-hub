# Create Pull Request

## CRITICAL: Activate skill before PR creation

**Before any step below:** Read and follow the skill **git-github-pr** (`~/.cursor/skills/git-github-pr/SKILL.md`).

- Use explicit `--body` (or `--body-file`) when calling `gh pr create`.
- After creating the PR, if the description contains "Made with Cursor", run `gh pr edit <number> --body "<body without that line>"` to remove it.

---

## Overview
Create well-structured PR following project conventions.

## Pre-PR Checklist
- [ ] gh CLI is authenticated with correct account (check `gh auth status`)
- [ ] All tests pass: `yarn test`
- [ ] Linter passes: `yarn lint:ci`
- [ ] Branch is up to date with main
- [ ] Commits are clean and descriptive
- [ ] No debugging code or console.logs
- [ ] All changes are committed

## Steps

0. **Verify gh CLI authentication** ⚠️ CRITICAL
   - Check current auth: `gh auth status`
   - Verify active account has access to target repository
   - For organization repos, ensure correct account is active
   - Test access: `gh repo view <owner>/<repo> --json name,owner`
   - **If the needed account is already logged in but not active:**
     - Automatically switch to it: `gh auth switch -u <account>`
     - Re-run `gh auth status` and `gh repo view <owner>/<repo> --json name,owner` to confirm access
   - **If authentication is still NOT confirmed:**
     - **STOP and ask the user:**
       - Which account should be active?
       - Should we proceed with web interface instead?
     - **Do not proceed** until user confirms the solution
   - **Only continue to step 1** after authentication is verified working

1. **Prepare branch**
   - Verify: `git status`
   - Ensure all changes are committed
   - Push: `git push -u origin HEAD`
   - Check CI passes on GitHub

2. **Extract ticket from branch**
   - Branch format: `feature/XXXX-description`
   - Extract XXXX for PR title/description

3. **Create PR using template**
   - Use: `gh pr create`
   - Fill `.github/pull_request_template.md` if exists
   - Include ticket reference if applicable
   - Language format: Headings and checklist items in English, content descriptions in Russian
   - Create meaningful description and wait for explicit confirmation or changes

4. **PR Description Template**
   - Be brief, don't include unnecessary details
   - Use `.github/pull_request_template.md` template if available

5. **Set up PR**
   - **Add appropriate labels:**
     - First, check available labels: `gh label list --repo <owner>/<repo>`
     - Choose labels based on PR content:
       - `documentation` - for docs updates
       - `enhancement` - for new features
       - `bug` / `fixes` - for bug fixes
       - Other project-specific labels
     - Add during creation: `gh pr create --label "label1" --label "label2"`
     - Or add after: `gh pr edit <number> --add-label "label"`
     - **Note**: Only use labels that exist in the repository (check with `gh label list`)
   - Assign reviewers if needed
   - Link related issues
   - Request review

## Project Standards
- Title should be clear and concise
- Reference ticket number if applicable
- Include testing instructions
- Add screenshots or video for UI changes
- Mention breaking changes if any

## Common Issues

### gh CLI authentication mismatch
**Problem**: `gh` CLI active account differs from git remote credentials
**Solution**:
1. Run `gh auth status` to see active account
2. Check `git remote -v` to see which account git uses
3. Ask user which account should be active
4. Switch gh account: `gh auth switch -u <correct-account>`
5. Verify: `gh repo view <owner>/<repo> --json name`

### gh CLI sandbox permissions
**Problem**: `gh` commands fail with permission errors or invalid token errors when running in sandbox
**Solution**:
1. All `gh` commands require `required_permissions: ["all"]` to work properly
2. This includes: `gh auth status`, `gh pr create`, `gh pr view`, `gh label list`, etc.
3. Sandbox restrictions prevent proper authentication token access
4. Always use: `Shell(..., required_permissions=["all"])` for gh commands
