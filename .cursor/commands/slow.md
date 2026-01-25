# Slow Down - Remember Collaboration Rules

## Overview
Reminder to follow project collaboration rules and proper AI-human interaction workflow.

## CRITICAL: Review Project Rules

Before continuing, review and apply these rules:

1. **Read collaboration rules**: `.cursor/rules/collaboration/RULE.md`
2. **Check all project rules**: `.cursor/rules/` directory
3. **Apply rule sequence**: From user rules (SEARCH FIRST, REUSE FIRST, NO ASSUMPTIONS, etc.)

## Required Interaction Mode

### 1. Planning BEFORE Implementation

**ALWAYS propose plan, DO NOT implement immediately:**

- Describe what you plan to do
- Show which files will be modified
- Get user confirmation
- Only after "OK" start implementation

❌ **WRONG**: "I'll add this feature..." → immediately makes changes

✅ **RIGHT**: "I propose to add X by:
1. Modifying file A
2. Creating file B
3. Updating file C
Do you approve?"

### 2. Propose Options, NOT Solutions

**When facing a problem:**

- Describe the issue clearly
- Propose 2-3 solution options
- Explain pros and cons of each
- Wait for user's choice
- Implement ONLY chosen option

❌ **WRONG**: "I see error X, fixing now..." → fixes automatically

✅ **RIGHT**: "Found error X. Options:
1. Solution A (pros/cons)
2. Solution B (pros/cons)  
3. Solution C (pros/cons)
Which do you prefer?"

### 3. Never Commit Without Approval

**NEVER commit without explicit consent:**

- Show what was done (list of changes)
- Ask: "Work complete. Ready to commit?"
- Wait for explicit confirmation
- Only after "yes" create commit

### 4. Ask About Documentation

**Always check if docs need updating:**

- After significant changes ask about updating:
  - `ARCHITECTURE-DECISIONS.md`
  - `DEVELOPMENT-PLAN.md`
  - Other relevant docs
- Propose what to update
- Get approval first

### 5. Search and Reuse First

**Before implementing anything:**

- [ ] Search for similar functionality
- [ ] Check existing patterns
- [ ] Identify reusable code
- [ ] Confirm no duplication
- [ ] Get explicit user confirmation

### 6. No Assumptions

**Only use:**

- Files you've read
- User messages
- Tool results
- **Never assume** - search then ask

### 7. Challenge Ideas

**Do not blindly agree:**

- Question assumptions
- Offer counterpoints
- Test reasoning
- Prioritize truth over agreement
- State flaws/risks/better approaches directly

## Checklist Before ANY Action

- [ ] Have I read relevant project rules?
- [ ] Did I search for existing solutions?
- [ ] Have I proposed a plan?
- [ ] Did user approve the plan?
- [ ] Am I offering options, not forcing solutions?
- [ ] Have I checked logs after changes?
- [ ] Is work complete and verified?
- [ ] Did user approve committing?

## Reset Your Behavior

If you were:

- ❌ Implementing without approval
- ❌ Making automatic fixes
- ❌ Committing without asking
- ❌ Skipping search phase
- ❌ Assuming instead of asking
- ❌ Agreeing without challenging

**STOP and return to proper collaboration mode.**

## Remember Rule Sequence

Always reply with: "Applying rules X,Y,Z"

1. SEARCH FIRST
2. REUSE FIRST
3. NO ASSUMPTIONS
4. CHALLENGE IDEAS
5. BE HONEST
6. PERIODICALLY self-check
7. LOG CHECK after changes
8. RULE REFRESH every few messages

## Example of Correct Workflow

**User**: "Add user profile page"

**AI Response**:
"Applying rules 1,2,3

Let me search for existing profile-related code first...

[searches codebase]

Found: We have user profile API at `src/app/api/user/profile/route.ts` and profile types in `src/types/database.ts`.

I propose to:
1. Create `src/app/profile/page.tsx` using existing layout pattern
2. Reuse profile API endpoint
3. Add profile form component in `src/components/forms/`
4. Use existing validation from `src/lib/validations/user.ts`

Estimated changes:
- New: `src/app/profile/page.tsx`
- New: `src/components/forms/ProfileForm.tsx`
- Modify: Add types if needed

Do you approve this plan?"

**USE THIS MODE FOR ALL INTERACTIONS**
Remember every few messages
