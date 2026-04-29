# Run Tests and Fix Failures

Execute the full test suite, identify failures, and systematically fix them.

## Steps

### 1. Run test suite

```bash
yarn test
# with coverage:
yarn test --coverage
```

Identify failing tests and their error messages.

### 2. Run linter and type check

```bash
yarn lint
yarn type-check
```

Auto-fix what's possible:
```bash
yarn lint --fix
```

### 3. Analyze failures

Categorize by type:
- **Logic errors** — code behavior doesn't match test expectation
- **Broken tests** — test itself is outdated after a code change
- **Flaky tests** — async/timing issues

Prioritize critical paths first. Check if failures are related to recent changes. Discuss findings with user.

### 4. Fix systematically

- Fix one test at a time
- Re-run after each fix
- Confirm no new failures introduced
- If business logic changed, update the test to match the new contract
- Get confirmation from user
- Only after "OK" move to the next failing test

### 5. Verify

```bash
yarn test       # all passing
yarn lint       # 0 errors
yarn type-check # 0 errors
```

---

## Testing standards

- [ ] AAA pattern (Arrange, Act, Assert)
- [ ] Tests are focused and test one thing
- [ ] Descriptive test names
- [ ] No test interdependencies
- [ ] Critical paths covered
- [ ] Mocks used for external dependencies only

## Common issues

- **Database connection** — check Docker container: `docker ps`
- **Missing env vars** — check `.env.local` against `env.example`
- **Type errors after schema changes** — run `yarn type-check` first
- **Race conditions** — look for missing `await` or unresolved promises in async tests
