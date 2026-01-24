# Add New API Endpoint

## Overview
Create a new Next.js API route with proper structure, validation, and documentation.

## Steps

1. **Plan endpoint**
   - What is the endpoint purpose?
   - What HTTP method(s) needed? (GET, POST, PUT, DELETE)
   - What data validation required?
   - Authentication/authorization needed?
   - What responses to return?
   - Get confirmation from the user

2. **Create route file**
   - Location: `src/app/api/[name]/route.ts`
   - Follow existing patterns in `src/app/api/`
   - Export named functions: GET, POST, PUT, DELETE
   - Describe what you plan to do and wait for explicit confirmation

3. **Implement endpoint**
   - Import necessary utilities from `@/lib`
   - Add input validation using Zod schemas
   - Use proper error handling
   - Return standardized responses
   - Add TypeScript types
   - Show which files were created and wait for explicit confirmation

4. **Add Scalar documentation**
   - Add JSDoc comments with OpenAPI annotations
   - Document request/response schemas
   - Include examples
   - Update `src/lib/swagger/config.ts` if needed
   - Test documentation with user

5. **Handle authentication**
   - Use `@/lib/auth/server` for auth checks
   - Validate user permissions
   - Return 401/403 for unauthorized requests

6. **Database operations**
   - Use Kysely patterns from `.cursor/KYSELY-USAGE.md`
   - Handle transactions if needed
   - Proper error handling for DB errors
   - Use prepared statements
   - Describe what was implemented and wait for explicit confirmation

7. **Testing**
   - Test with different inputs
   - Test error cases
   - Test authentication/authorization
   - Check Swagger UI: `/api/docs`
   - Ask user to check Scalar documentation: `/api/reference`
   - Test with actual frontend integration

## Endpoint Template Structure

```ts
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { apiError, apiSuccess } from '@/utils/api-response';

const schema = z.object({
  // validation schema
});

export async function POST(request: NextRequest) {
  try {
    // parse and validate
    const body = await request.json();
    const validated = schema.parse(body);
    
    // check auth if needed
    
    // business logic
    
    // return response
    return apiSuccess(data, 200);
  } catch (error) {
    return apiError('Error message', 500);
  }
}
```

## Checklist
- [ ] Route file created in correct location
- [ ] Input validation with Zod
- [ ] Proper error handling
- [ ] Standardized API responses
- [ ] Authentication if required
- [ ] Swagger documentation added
- [ ] Types are properly defined
- [ ] Tested manually
- [ ] No console.log statements
- [ ] Follows project conventions
