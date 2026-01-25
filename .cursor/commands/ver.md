# Update Application Version

## Overview
Update application version in package.json based on completed stage from DEVELOPMENT-PLAN.md.

## CRITICAL
It is better to give answers in Russian if possible.

## Version Format Logic

Version is formed from stage number:
- Completed stage **2.1** → version **0.2.1**
- Completed stage **3.5** → version **0.3.5**
- Format: `0.{stage}.{substage}`

## STEP 1: Analyze DEVELOPMENT-PLAN.md Automatically

**Read and analyze development plan:**

1. **Read DEVELOPMENT-PLAN.md**
   - Scan all stages (ЭТАП 0, 1, 2, 3, etc.)
   - For each substage (0.1, 0.2, 1.1, 2.1, etc.)
   - Check task completion status `[x]` vs `[ ]`

2. **Identify completed stages**
   - Find substages where ALL tasks are marked `[x]`
   - List all fully completed substages
   - Identify the most recent/highest completed stage

3. **Read current version from package.json**
   - Get current version value
   - Compare with completed stages

4. **Determine most likely completed stage**
   - Find highest completed substage
   - If multiple substages completed, suggest the latest one
   - Prepare stage number and description

5. **Present findings to user**

   ```zsh
   Analysis of DEVELOPMENT-PLAN.md:
   
   Current version: 0.1.0
   
   Completed stages detected:
   - Stage 0.1: DevOps и окружение (all 8 tasks ✓)
   - Stage 0.2: База данных (all 5 tasks ✓)
   - Stage 1.1: Better Auth интеграция (all 7 tasks ✓)
   - Stage 2.1: Лендинг (all 8 tasks ✓)
   
   Suggested new version: 0.2.1 (based on stage 2.1)
   
   Is stage 2.1 "Лендинг" the one you want to mark as completed?
   Or specify different stage number (e.g., 1.4, 3.2):
   ```

**Wait for user confirmation or correction!**
This is important!

## STEP 2: Confirm or Correct Stage with User

After presenting analysis:

**User options:**
- Confirm suggested stage: "Yes" or "Correct"
- Specify different stage: "3.2" or "Stage 1.4"
- Provide stage name: "Authentication" (will find matching stage)

**After user response:**

1. **Verify selected stage in DEVELOPMENT-PLAN.md**
   - Find the specific substage
   - Show all tasks for this substage
   - Confirm completion status

2. **Calculate new version**
   - Format: `0.{stage}.{substage}`
   - Show: "Current version: X.X.X → New version: Y.Y.Y"

3. **Ask about incomplete tasks** (if any `[ ]` remain)
   - "Some tasks are not marked as complete. Update them to `[x]`?"
   - Wait for answer

## STEP 3: Propose Changes

**Present change plan:**

```zsh
Planned changes:

1. package.json
   - version: "0.1.0" → "0.2.1"

2. DEVELOPMENT-PLAN.md (optional)
   - Stage 2.1: [list of tasks to update]
   - [ ] Task 1 → [x] Task 1
   - [ ] Task 2 → [x] Task 2
   ...

Do you confirm these changes?
```

**Wait for "OK" confirmation from user!**

## STEP 4: Update package.json

After confirmation:

1. **Update version in package.json**
   - Change `"version"` field value
   - Use StrReplace tool

2. **Show result**

   ```zsh
   ✓ package.json updated
   Version: 0.1.0 → 0.2.1
   ```

3. **Verify syntax**
   - Ensure JSON is valid
   - Check no other fields were broken

## STEP 5: Update DEVELOPMENT-PLAN.md (Optional)

If user agreed to update plan:

1. **Update task statuses**
   - Replace `[ ]` with `[x]` for completed tasks
   - Use StrReplace for each task

2. **Show updated list**

   ```zsh
   ✓ DEVELOPMENT-PLAN.md updated
   Stage 2.1:
   [x] Create layout for public pages
   [x] Implement hero section
   ...
   ```

## STEP 5.5: Update CHANGELOG (Optional)

**Ask user first:**

```zsh
Do you want to update CHANGELOG.md for this release?
```

If user agrees:

1. **Read current CHANGELOG.md**
   - Get current content
   - Find the latest version entry
   - Determine date format (YYYY-MM-DD)

2. **Analyze completed stage**
   - Review tasks in the completed stage
   - Identify what was added/changed/fixed
   - Group changes by category

3. **Propose CHANGELOG entry**

   ```zsh
   Proposed CHANGELOG entry for version 0.2.1:
   
   ## [0.2.1] - 2026-01-25
   
   ### Added
   - Landing page with hero section
   - Benefits showcase section
   - FAQ section
   - Responsive design for mobile devices
   
   ### Changed
   - Updated project structure for public pages
   - Improved navigation and routing
   
   ### Fixed
   - (if any fixes were made)
   
   Please review and edit if needed, or confirm with "OK"
   ```

4. **Wait for user feedback**
   - User can:
     - Confirm: "OK", "Yes", "Correct"
     - Edit text: "Change 'Benefits showcase' to 'Benefits and testimonials'"
     - Provide completely new text
   - If user provides edits, update the entry and show again
   - Repeat until user confirms with "OK"

5. **Update CHANGELOG.md**
   - Insert new version entry after the header
   - Before the previous version entry
   - Maintain format and spacing
   - Update version comparison links at the bottom

6. **Show result**

   ```zsh
   ✓ CHANGELOG.md updated
   Version 0.2.1 entry added
   ```

**Important:**
- Always follow [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format
- Use categories: Added, Changed, Deprecated, Removed, Fixed, Security
- Keep entries clear and user-focused
- Don't update CHANGELOG without user agreement on content

## STEP 6: Verify Changes

1. **Verify package.json**
   - Read file again
   - Ensure version updated correctly
   - Show new version field content

2. **Verify DEVELOPMENT-PLAN.md** (if updated)
   - Read updated stage
   - Ensure tasks marked correctly
   - Show updated section

3. **Verify CHANGELOG.md** (if updated)
   - Read updated changelog
   - Ensure new version entry added correctly
   - Check format and links

4. **Show summary**

   ```zsh
   Changes applied:
   ✓ package.json: version 0.2.1
   ✓ DEVELOPMENT-PLAN.md: stage 2.1 marked as completed
   ✓ CHANGELOG.md: version 0.2.1 entry added
   ```

## STEP 7: Run Validation

1. **Verify JSON syntax**
   - Run: `node -e "require('./package.json')"`
   - Ensure no errors

2. **Check markdown linter** (if plan was updated)
   - Run: `yarn format:check DEVELOPMENT-PLAN.md`
   - Or: `yarn format DEVELOPMENT-PLAN.md` for auto-fix

3. **Show results**

   ```zsh
   ✓ package.json - valid JSON
   ✓ DEVELOPMENT-PLAN.md - formatting OK
   ```

## STEP 8: Ask About Commit

**Ask user:**

```zsh
Version updated to 0.2.1 based on stage 2.1

Changed files:
- package.json
- DEVELOPMENT-PLAN.md (if updated)
- CHANGELOG.md (if updated)

Ready to commit changes?
Proposed commit message:
"chore: bump version to 0.2.1 (stage 2.1 completed)"
```

**Wait for explicit "yes"!**
Only commit after confirmation!

## STEP 9: Create Commit (If Approved)

After confirmation:

1. **Create commit**

   ```bash
   git add package.json DEVELOPMENT-PLAN.md CHANGELOG.md
   git commit -m "chore: bump version to 0.2.1 (stage 2.1 completed)"
   ```

   **Note:** Include only files that were actually updated

2. **Show result**

   ```zsh
   ✓ Commit created
   ✓ Version 0.2.1
   
   Next steps:
   - Can push: git push
   - Can create tag: git tag v0.2.1
   ```

3. **Ask about tag** (optional)
   - "Create git tag v0.2.1?"
   - Wait for answer
   - If yes: `git tag v0.2.1`

4. **Ask about push** (optional)
   - "Push to remote repository?"
   - Wait for answer
   - If yes: use `git push && git push --tags`

   **Important:** Git push requires proper permissions:
   - Use `required_permissions: ["git_write", "network"]`
   - Git uses credential manager for authentication
   - This works correctly when both permissions are specified
   - If authentication fails, user can push manually from terminal

## Version Checklist

- [ ] Analyzed DEVELOPMENT-PLAN.md automatically
- [ ] Identified completed stages
- [ ] Suggested most likely completed stage
- [ ] Confirmed/corrected stage with user
- [ ] Read current version
- [ ] Calculated new version (0.{stage}.{substage})
- [ ] Showed change plan
- [ ] Got user confirmation
- [ ] Updated package.json
- [ ] Updated DEVELOPMENT-PLAN.md (if needed)
- [ ] Asked about CHANGELOG update
- [ ] Proposed CHANGELOG entry (if agreed)
- [ ] Got user approval for CHANGELOG text
- [ ] Updated CHANGELOG.md (if approved)
- [ ] Verified file validity
- [ ] Asked about commit
- [ ] Got "yes" confirmation
- [ ] Created commit (if approved)
- [ ] Offered to create git tag
- [ ] Asked about push to remote (optional)
- [ ] Used correct permissions for git push (if approved)

## Common Stages Reference

For reference, main stages:

```zsh
STAGE 0: Infrastructure
├── 0.1 DevOps and environment
├── 0.2 Database
└── 0.3 Basic architecture

STAGE 1: Authentication and users
├── 1.1 Better Auth integration
├── 1.2 User database
├── 1.3 Email verification
└── 1.4 Authentication API endpoints

STAGE 2: Homepage and onboarding
├── 2.1 Landing
├── 2.2 Registration wizard
└── 2.3 Onboarding database

STAGE 3: Freelancer profiles
STAGE 4: Project posting
STAGE 5: Search and filtering
STAGE 6: Interaction and responses
...
```

## Important Notes

- **Always ask for confirmation** before changes
- **Show what will change** before making changes
- **Verify result** after each change
- **Don't commit without explicit "yes"** from user
- **Version format is strict**: `0.{stage}.{substage}`
- **First analyze DEVELOPMENT-PLAN.md** to detect completed stages
- **Suggest the stage** before asking user to confirm

## Example Workflow

```zsh
User: /ver

AI: [analyzes DEVELOPMENT-PLAN.md automatically]
    "Analysis of DEVELOPMENT-PLAN.md:
    
     Current version: 0.1.0
     
     Completed stages detected:
     - Stage 0.1: DevOps и окружение (all 8 tasks ✓)
     - Stage 0.2: База данных (all 5 tasks ✓)
     - Stage 1.1: Better Auth (all 7 tasks ✓)
     - Stage 2.1: Лендинг (all 8 tasks ✓)
     
     Suggested new version: 0.2.1 (based on stage 2.1)
     
     Stage 2.1 tasks:
     [x] Create layout for public pages
     [x] Implement hero section
     [x] Create benefits section
     ...
     
     Is stage 2.1 'Лендинг' correct?"

User: "Yes"

AI: "Planned changes:
     1. package.json: 0.1.0 → 0.2.1
     2. DEVELOPMENT-PLAN.md: already marked
     
     Confirm?"

User: "Yes"

AI: [updates package.json]
    "✓ package.json updated: 0.1.0 → 0.2.1
     
     Do you want to update CHANGELOG.md for this release?"

User: "Yes"

AI: "Proposed CHANGELOG entry for version 0.2.1:
     
     ## [0.2.1] - 2026-01-25
     
     ### Added
     - Landing page with hero section
     - Benefits showcase section
     - FAQ section with common questions
     - Responsive design for mobile devices
     
     ### Changed
     - Updated project structure for public pages
     - Improved navigation and routing
     
     Please review and edit if needed, or confirm with 'OK'"

User: "Change FAQ section to 'FAQ section answering common questions'"

AI: "Updated CHANGELOG entry:
     
     ## [0.2.1] - 2026-01-25
     
     ### Added
     - Landing page with hero section
     - Benefits showcase section
     - FAQ section answering common questions
     - Responsive design for mobile devices
     
     ### Changed
     - Updated project structure for public pages
     - Improved navigation and routing
     
     Is this correct?"

User: "OK"

AI: [updates CHANGELOG.md]
    "✓ CHANGELOG.md updated
     
     Ready to commit?
     
     Changed files:
     - package.json
     - CHANGELOG.md
     
     Message: 'chore: bump version to 0.2.1 (stage 2.1 completed)'"

User: "Yes"

AI: [creates commit]
    "✓ Commit created
     Create git tag v0.2.1?"

User: "Yes"

AI: [creates tag]
    "✓ Tag v0.2.1 created
     
     Push to remote repository?
     - git push
     - git push --tags"

User: "Yes"

AI: [pushes with required_permissions: ["git_write", "network"]]
    "✓ Changes pushed to remote
     ✓ Tags pushed to remote
     
     Version 0.2.1 successfully released!"
```

**Remember: Analyze first, suggest stage, get confirmation for all changes!**
