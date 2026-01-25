# Search Codebase First

## Overview
Before implementing new functionality, thoroughly search codebase for similar patterns and reusable code.

## Search Strategy

1. **Search for similar features**
   - Use semantic search for "how does X work?"
   - Check existing components/utilities
   - Look for similar API patterns
   - Find reusable validation schemas

2. **Search tools priority**
   - Exact text/symbols: Use grep/ripgrep
   - Known file names: Use glob patterns
   - Understanding flow: Use semantic search
   - Similar functionality: Browse existing code

3. **Key directories to check**
   - Components: `src/components/`
   - API routes: `src/app/api/`
   - Database: `src/lib/db/`
   - Utilities: `src/lib/` and `src/utils/`
   - Types: `src/types/`
   - Validations: `src/lib/validations/`

4. **Questions to answer**
   - Does similar functionality exist?
   - Can existing code be extended?
   - What patterns are used in project?
   - What libraries/tools are already available?
   - How do similar features work?
   - Describe what was found and how to use it
   - Explain pros and cons of each
   - Wait for user's choice

5. **Before implementing**
   - [ ] Searched for similar features
   - [ ] Checked existing patterns
   - [ ] Reviewed related files
   - [ ] Identified reusable code
   - [ ] Confirmed no duplication
   - [ ] Understand project conventions
   - [ ] Explicit confirmation from the user

## Common Search Patterns
- Find component: `grep -r "export.*ComponentName"`
- Find API usage: Search in `src/app/api/`
- Find types: Check `src/types/database.ts`
- Find validation: Check `src/lib/validations/`
- Find similar logic: Semantic search

## Rule Reference
This implements Rule #1: SEARCH FIRST - Use codebase_search/grep until finding similar functionality or confirming none exists.

## CRITICAL
It is better to give answers in Russian if possible.
