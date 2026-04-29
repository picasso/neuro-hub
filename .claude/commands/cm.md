# Suggest Commit Message

Analyze the requested change set and propose a commit message. Do not stage files, create commits, amend commits, or modify any files.

## Arguments: $ARGUMENTS

Arguments can be combined in any order.

### Change set (pick one or omit)
- *(none)* — all changed files: staged, unstaged, untracked
- `staged` — staged changes only
- `last commit <id>` — diff from `<id>` to HEAD

### Commit type (optional — if provided, use it exactly)
`feat` · `fix` · `docs` · `style` · `refactor` · `test` · `chore`

### Output shape
- `short` — one-line message only
- *(none)* — full message with body

---

## Analysis steps

1. Determine the change set from arguments.
2. Inspect only that set:
   - Default: `git status --short`, `git diff --stat`, `git diff`, `git diff --cached`, untracked paths
   - `staged`: `git diff --cached --stat` and `git diff --cached`
   - `last commit <id>`: `git diff <id>..HEAD --stat` and `git diff <id>..HEAD`
3. Classify by intent, not file count.
4. Choose or apply the commit type.
5. Choose the narrowest accurate scope.
6. Detect whether changes should be split before proposing one message.

Do not analyze recent commit history to infer style — style is defined here.

---

## Format

Default:
```
<type>(<scope>): <imperative summary>

<why/effect sentence>.
<what changed sentence>.
<optional context sentence>.
```

Short:
```
<type>(<scope>): <imperative summary>
```

---

## Language

Entire commit message in English. Split questions and explanations can follow the conversation language.

## Subject rules

- Imperative mood: `add`, `fix`, `update`, `replace`, `align`, `normalize`, `extract`, `remove`, `stabilize`
- No trailing period
- 72 characters or fewer
- Describe the user-facing, architectural, or behavioral result — not touched files
- No vague summaries: `small improvements`, `misc fixes`, `update stuff`, `enhance UI`

**Good:** `refactor(ui): normalize social icon assets`  
**Bad:** `refactor(ui): update assets.tsx and github icon and footer imports`

## Body rules

- Required unless `short` is provided
- Prose only — no bullet lists
- Prefer exactly two sentences: (1) why the change exists / what effect it has; (2) what changed at behavior/structure/contract level
- Add a third sentence only for migrations, breaking changes, production risk, compatibility, public API contracts, or generated types
- Do not mention tests unless the commit is primarily about tests
- Do not enumerate files unless the change is about migrations, DB schema, config, generated types, or a public API contract
- No `Made-with`, `Co-authored-by`, or AI attribution

**Example:**
```
fix(mocks): stabilize production mock seeding

Load the production database URL before creating the pool to avoid using stale local config.
Resolve mock skill IDs from migrated production rows and randomize project publication dates.
```

## Scopes

Domain/architectural scopes preferred:

`ui` · `icons` · `assets` · `home` · `onboarding` · `portfolio` · `freelancers` · `projects` · `account` · `auth` · `mocks` · `db` · `api` · `validations` · `playground` · `docs` · `tests` · `deps` · `config`

Component scope allowed only when the commit is dedicated to one specific component:
```
feat(portfolio-card): add compact media layout
```

If multiple components in one area changed → use the broader domain scope.

## Mixed / split-worthy changes

If changes are split-worthy, do not propose one message — ask:

```
These changes look split-worthy. How do you want to proceed?

A. Split UI asset/icon normalization
   refactor(ui): normalize social icon assets

B. Split footer/social link updates
   refactor(footer): align social link rendering

C. Keep one commit anyway
   refactor(ui): normalize social assets and footer usage
```

When the user picks a split option, propose a message for that logical group only and mention which files to stage for it.

## Output

```
Recommended:
<commit message>

Alternatives:
1. <alternative>
2. <alternative>

Rationale:
<short explanation of type and scope>
```

For `short` — return only the one-line message (unless split-worthy, in which case ask first).

Never create a commit unless the user explicitly asks after reviewing the proposed message.
