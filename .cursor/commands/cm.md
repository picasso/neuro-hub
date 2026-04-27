# Suggest Commit Message

## Overview
Suggest a commit message for the selected git changes following a fixed project style.

This command must not stage files, create commits, amend commits, or modify files. It only
analyzes the requested change set and proposes commit messages.

## Accepted Arguments

Arguments can be combined in any order unless noted otherwise.

### Change Set

- No change-set argument: analyze all changed files, including staged, unstaged, and untracked files.
- `staged`: analyze only staged changes.
- `last commit <id>`: analyze the diff from `<id>` to `HEAD`.

### Commit Type

If one of these types is provided, use it exactly and do not choose another type:

- `feat`
- `fix`
- `docs`
- `style`
- `refactor`
- `test`
- `chore`

If no type is provided, choose the most appropriate type after analyzing the changes.

### Output Shape

- `short`: return a one-line commit message only.
- No `short`: return a full commit message with a required body.

## Analysis Steps

1. Determine the requested change set from the arguments.
2. Inspect only that change set:
   - Default: `git status --short`, `git diff --stat`, `git diff`, `git diff --cached`, and untracked file paths.
   - `staged`: `git diff --cached --stat` and `git diff --cached`.
   - `last commit <id>`: `git diff <id>..HEAD --stat` and `git diff <id>..HEAD`.
3. Classify the change by intent, not by the number of edited files.
4. Choose or apply the commit type.
5. Choose the narrowest accurate scope.
6. Detect whether the changes should be split before proposing a single commit message.

Do not analyze recent commit history to infer style. The style is defined in this command.

## Commit Message Format

Default format:

```text
<type>(<scope>): <imperative summary>

<why/effect sentence>.
<what changed sentence>.
<optional context sentence>.
```

Short format:

```text
<type>(<scope>): <imperative summary>
```

## Language

Use English for the entire commit message:

- Subject in English.
- Body in English.
- Split questions and explanations may follow the user's conversation language.

## Subject Rules

- Use imperative mood: `add`, `fix`, `update`, `replace`, `align`, `normalize`, `extract`,
  `remove`, `stabilize`, etc.
- Do not end with a period.
- Prefer 72 characters or fewer.
- Describe the user-facing, architectural, or behavioral result.
- Do not list touched files.
- Do not use vague summaries such as:
  - `small improvements`
  - `misc fixes`
  - `update stuff`
  - `enhance UI`

Good:

```text
refactor(ui): normalize social icon assets
```

Bad:

```text
refactor(ui): update assets.tsx and github icon and footer imports
```

## Body Rules

- Body is required unless `short` is provided.
- Use prose only. Do not use bullet lists.
- Prefer exactly two sentences:
  - First sentence: why the change exists or what effect it has.
  - Second sentence: what changed at the behavior, structure, or contract level.
- Add a third sentence only for important context such as migrations, breaking changes,
  production risk, compatibility, public API contracts, or generated types.
- Do not mention tests unless the commit is primarily about tests.
- Do not enumerate files unless the change is specifically about migrations, DB schema,
  config, generated types, or a public API contract.
- Do not add `Made-with`, `Co-authored-by`, Cursor attribution, or AI attribution.

Example:

```text
fix(mocks): stabilize production mock seeding

Load the production database URL before creating the pool to avoid using stale local config.
Resolve mock skill IDs from migrated production rows and randomize project publication dates.
```

## Scope Rules

Prefer domain or architectural scopes:

- `ui`
- `icons`
- `assets`
- `home`
- `onboarding`
- `portfolio`
- `freelancers`
- `projects`
- `account`
- `auth`
- `mocks`
- `db`
- `api`
- `validations`
- `playground`
- `docs`
- `tests`
- `deps`
- `config`

Component scopes are allowed only when the commit is dedicated to one specific component:

```text
feat(portfolio-card): add compact media layout
fix(project-card): preserve budget spacing
```

If multiple components in one area are changed, use the broader domain scope:

```text
refactor(ui): normalize card media layouts
```

Do not use a component scope when the commit also changes unrelated components, shared UI,
configuration, data, or feature wiring.

## Mixed Changes

If the selected changes are split-worthy, do not immediately propose one commit message.
Ask the user how to proceed with lettered options.

Use this shape:

```text
These changes look split-worthy. How do you want to proceed?

A. Split UI asset/icon normalization
   refactor(ui): normalize social icon assets

B. Split footer/social link updates
   refactor(footer): align social link rendering

C. Keep one commit anyway
   refactor(ui): normalize social assets and footer usage
```

When the user chooses a split option, propose a commit message only for that logical group
and mention which files or paths should be staged for it. When the user chooses to keep one
commit anyway, propose the most coherent single message possible.

## Output Rules

For normal changes, return:

```text
Recommended:
<commit message>

Alternatives:
1. <alternative subject or full message>
2. <alternative subject or full message>

Rationale:
<short explanation of type and scope>
```

For `short`, return only the recommended one-line commit message unless the changes are
split-worthy. If split-worthy, ask the split question first.

Never ask recent git history for style. Never create a commit unless the user explicitly
asks for it after reviewing the proposed message.
