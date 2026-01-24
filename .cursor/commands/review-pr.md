# Review Pull Request

## Overview
Comprehensive PR review following project standards and best practices.

## Review Checklist

### Code Quality
- [ ] Follows SOLID principles without over-engineering
- [ ] Self-explanatory code without unnecessary comments
- [ ] Files under 300 lines (or justified if longer)
- [ ] Proper separation of concerns

### Functionality
- [ ] Code does what it's supposed to do
- [ ] Edge cases are handled
- [ ] Error handling is appropriate
- [ ] No obvious bugs or logic errors

### Testing
- [ ] Critical paths have tests
- [ ] Tests use AAA pattern (Arrange, Act, Assert)
- [ ] Tests pass: `yarn test`
- [ ] Checks pass: `yarn lint:ci`, `yarn type-check`

### Database & API
- [ ] Kysely patterns are followed correctly
- [ ] Migrations are reversible
- [ ] API responses use proper format
- [ ] Swagger/Scalar docs are updated if needed

### Security
- [ ] No hardcoded secrets or credentials
- [ ] Input validation is present
- [ ] Sensitive data is handled properly
- [ ] Authentication/authorization checks

### Next.js Specific
- [ ] Server/Client components used appropriately
- [ ] No "use client" unless necessary
- [ ] Proper data fetching patterns
- [ ] No Layout Shifts (check console warnings)

### Project Standards
- [ ] Follows .cursor/rules patterns
- [ ] Matches existing code style
- [ ] No prohibited actions from RULE.md
- [ ] PR template filled properly
