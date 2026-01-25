# Run All Tests and Fix Failures

## Overview
Execute full test suite, identify failures, and systematically fix issues.

## Steps

1. **Run test suite**
   - Execute: `yarn test`
   - Check coverage if needed: `yarn test --coverage`
   - Identify failing tests

2. **Run linter and type check**
   - Execute: `yarn lint:ci` and `yarn type-check`
   - Fix auto-fixable issues: `yarn lint --fix`
   - Address remaining linter errors

3. **Analyze failures**
   - Categorize by type: logic errors, broken tests, flaky tests
   - Prioritize by impact: critical paths first
   - Check if related to recent changes
   - Discuss findings with user

4. **Fix issues systematically**
   - Fix one test at a time
   - Re-run after each fix
   - Ensure no new failures introduced
   - Update test if business logic changed
   - Get confirmation from the user
   - Only after "OK" start fixing next test

5. **Verify integration**
   - Run full suite again
   - Check all tests pass
   - Verify linter passes
   - Test in dev environment if needed

## Testing Standards
- [ ] Use AAA pattern (Arrange, Act, Assert)
- [ ] Tests are focused and test one thing
- [ ] Test names are descriptive
- [ ] No test interdependencies
- [ ] Critical paths covered
- [ ] Mocks used appropriately

## Common Issues
- Database connection (check Docker container)
- Environment variables missing
- Type errors after schema changes
- Race conditions in async tests
