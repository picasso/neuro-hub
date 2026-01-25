# Create Pull Request

## Overview
Create well-structured PR following project conventions.

## Pre-PR Checklist
- [ ] All tests pass: `yarn test`
- [ ] Linter passes: `yarn lint:ci`
- [ ] Branch is up to date with main
- [ ] Commits are clean and descriptive
- [ ] No debugging code or console.logs
- [ ] All changes are committed

## Steps

1. **Prepare branch**
   - Verify: `git status`
   - Push: `git push -u origin HEAD`
   - Check CI passes on GitHub

2. **Extract ticket from branch**
   - Branch format: `feature/XXXX-description`
   - Extract XXXX for PR title/description

3. **Create PR using template**
   - Use: `gh pr create`
   - Fill `.github/pull_request_template.md`
   - Include ticket reference
   - Language format: Headings and checklist items in English, content descriptions in Russian
   - Create meaningful description and wait for explicit confirmation or changes

4. **PR Description Template**
   - Be brief, don't include unnecessary details
   - Use `.github/pull_request_template.md` template

5. **Set up PR**
   - Add appropriate labels
   - Assign reviewers
   - Link related issues
   - Request review

## Project Standards
- Title should be clear and concise
- Reference ticket number
- Include testing instructions
- Add screenshots or video for UI changes
- Mention breaking changes if any
