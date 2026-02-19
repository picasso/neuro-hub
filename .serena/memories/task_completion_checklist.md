# When Task is Completed

1. **Lint**: `yarn lint` or `yarn lint:fix` - fix ESLint issues
2. **Format**: `yarn format` - run Prettier
3. **Type-check**: `yarn type-check` - ensure no TS errors
4. **Test** (if applicable): `yarn test`
5. **Pre-commit**: Husky runs `yarn lint-staged` on commit (ESLint + Prettier on staged files)

Start editing from clean git state; all checks should pass before finishing.
