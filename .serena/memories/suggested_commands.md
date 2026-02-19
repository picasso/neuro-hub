# Suggested Commands for neuro-hub

## Development
- `yarn dev` - start dev server (http://localhost:3000)
- `yarn build` - production build
- `yarn start` - run production server

## Code Quality (run before/after tasks)
- `yarn lint` - run ESLint
- `yarn lint:fix` - auto-fix ESLint
- `yarn lint:ci` - lint with zero-warning policy
- `yarn format` - format with Prettier
- `yarn format:check` - check formatting
- `yarn type-check` - TypeScript check (tsc --noEmit)

## Testing
- `yarn test` - run Jest
- `yarn test:watch` - Jest watch mode

## Database (local)
- `yarn db:auth:migrate` - Better Auth tables
- `yarn db:migrate` - run Knex migrations
- `yarn db:seed` - run seeds
- `yarn db:migrate:make <name>` - create migration
- `yarn db:test` - test connection

## Git/Shell (Darwin)
- `git status`, `git diff`, `git add`, `git commit`
- `ls`, `cd`, `grep`, `find` (standard Unix)
