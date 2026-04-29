# Update Application Version

## Arguments: $ARGUMENTS

Update `package.json` version based on a completed stage from `DEVELOPMENT-PLAN.md`.

**If an explicit version is provided** (e.g. `/ver 0.4.1`), skip stage analysis and use that version directly — still show the change plan and wait for confirmation.

---

## Version format

Stage number → version: `0.{stage}.{substage}`

- Completed stage **2.1** → version **0.2.1**
- Completed stage **3.5** → version **0.3.5**

---

## Step 1: Analyze DEVELOPMENT-PLAN.md (skip if version provided)

1. Read `DEVELOPMENT-PLAN.md`
2. Scan all stages and substages
3. Check task completion: `[x]` vs `[ ]`
4. Identify the most recent fully completed substage
5. Read current version from `package.json`
6. Present findings:

```
Analysis of DEVELOPMENT-PLAN.md:

Current version: 0.1.0

Completed stages detected:
- Stage 0.1: DevOps и окружение (all 8 tasks ✓)
- Stage 1.1: Better Auth (all 7 tasks ✓)
- Stage 2.1: Лендинг (all 8 tasks ✓)

Suggested new version: 0.2.1 (based on stage 2.1)

Is stage 2.1 "Лендинг" the one you want to mark as completed?
Or specify a different stage:
```

**Wait for user confirmation or correction.**

---

## Step 2: Confirm stage (skip if version provided)

After user response:
1. Verify the selected stage in `DEVELOPMENT-PLAN.md`
2. Show all tasks for that substage
3. Calculate new version: `0.{stage}.{substage}`
4. If some tasks are `[ ]`, ask: "Some tasks are incomplete. Update them to `[x]`?"

---

## Step 3: Propose changes

```
Planned changes:

1. package.json
   version: "0.1.0" → "0.2.1"

2. DEVELOPMENT-PLAN.md (if tasks need updating)
   [ ] Task 1 → [x] Task 1

Confirm?
```

**Wait for "OK".**

---

## Step 4: Update package.json

Change the `"version"` field. Verify the file is valid JSON:

```bash
node -e "require('./package.json')"
```

---

## Step 5: Update DEVELOPMENT-PLAN.md (if agreed)

Replace `[ ]` with `[x]` for completed tasks. Show the updated section.

---

## Step 6: Update CHANGELOG.md (optional)

Ask: "Do you want to update CHANGELOG.md for this release?"

If yes:
1. Read current `CHANGELOG.md`
2. Analyze the completed stage tasks
3. Propose an entry (in English, [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format):

```markdown
## [0.2.1] - 2026-04-29

### Added
- Landing page with hero section
- Benefits showcase section

### Changed
- Updated routing for public pages
```

4. Wait for feedback or approval
5. Insert new entry after the header, before previous version
6. Update comparison links at the bottom if present

**All CHANGELOG entries in English.** Don't update without user approval on the content.

---

## Step 7: Verify

```bash
node -e "require('./package.json')"   # valid JSON
```

Show summary of all changes applied.

---

## Step 8: Commit

```
Version updated to 0.2.1 (stage 2.1)

Changed files:
- package.json
- DEVELOPMENT-PLAN.md (if updated)
- CHANGELOG.md (if updated)

Proposed commit: chore: bump version to 0.2.1 (stage 2.1 completed)

Ready to commit?
```

**Wait for explicit "yes".**

After commit, optionally offer:
- `git tag v0.2.1`
- `git push && git push --tags`

---

## Checklist

- [ ] Stage analyzed or explicit version accepted
- [ ] Change plan shown and confirmed
- [ ] `package.json` updated
- [ ] `DEVELOPMENT-PLAN.md` updated (if needed)
- [ ] CHANGELOG entry proposed, approved, and added (if agreed)
- [ ] JSON validity verified
- [ ] User approved commit
- [ ] Commit created
