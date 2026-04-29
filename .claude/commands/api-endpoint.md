# Add New API Endpoint

Create a new Next.js API route with proper structure, validation, and documentation.

## Steps

### 1. Plan endpoint
- What is the endpoint's purpose?
- Which HTTP method(s)? (GET, POST, PUT, DELETE)
- What input validation is required?
- Authentication/authorization needed?
- What responses to return?

Propose the plan and wait for confirmation.

### 2. Create route file
- Location: `src/app/api/[name]/route.ts`
- Follow existing patterns in `src/app/api/`
- Export named handlers: `GET`, `POST`, `PUT`, `DELETE`

### 3. Implement endpoint
- Import utilities from `@/lib`
- Validate input with Zod schemas
- Use proper error handling
- Return standardized `ApiResponse<T>` responses
- Add TypeScript types (prefer `type`, no `any`)

Show which files were created and wait for confirmation.

### 4. Add Scalar / OpenAPI documentation
- Add JSDoc comments with OpenAPI annotations
- Document request/response schemas with examples
- Update `src/lib/swagger/config.ts` if needed
- Ask user to verify at `/api/reference`

### 5. Authentication
- Use `@/lib/auth/server` for auth checks
- Validate user permissions
- Return 401 for unauthenticated, 403 for unauthorized

### 6. Database operations
- Use Kysely patterns (see `src/lib/db/`)
- Use transactions for multi-step writes
- Parameterized queries only — never raw string interpolation

Show implementation summary and wait for confirmation.

### 7. Testing
- Test happy path, error cases, auth/authorization
- Check Scalar docs at `/api/reference`
- Test with actual frontend integration

---

## Route template

```ts
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { apiError, apiSuccess } from '@/lib/api'

const schema = z.object({
  // validation fields
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = schema.parse(body)

    // auth check if needed

    // business logic

    return apiSuccess(data, 201)
  } catch (error) {
    return apiError('Error message', 500)
  }
}
```

---

## Checklist

- [ ] Route in correct location (`src/app/api/[name]/route.ts`)
- [ ] Input validated with Zod
- [ ] Standardized `ApiResponse<T>` responses
- [ ] Authentication check if required
- [ ] Scalar/OpenAPI documentation added
- [ ] Types defined (no `any`)
- [ ] No `console.log`
- [ ] `yarn type-check` passes
- [ ] `yarn lint` passes
- [ ] Tested manually
