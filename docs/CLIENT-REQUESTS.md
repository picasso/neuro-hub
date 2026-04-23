# CLIENT-REQUESTS

## Baseline

Use `requestJson()` from `src/lib/api-client.ts` for standard client requests that:
- expect the shared `ApiResponse<T>` envelope
- return JSON `data`
- do not need `meta`
- do not need `204 No Content` handling
- do not need streaming, upload transport, or custom response parsing

`requestJson()` already supports:
- `json` request bodies
- automatic `content-type: application/json`
- typed error fields: `message`, `code`, `statusCode`, `errors`
- `normalizeJson`
  - `omitEmptyStrings`
  - `omitNulls`
  - `omitEmptyArrays`

## Use `requestJson()` Directly

Prefer plain `requestJson()` when the endpoint fits the shared success envelope and the caller only needs `data`.

Current examples:
- `src/features/skills/model.ts`
- `src/features/profile/model.ts`
- `src/stores/freelancer-portfolio/model.ts` for standard read/create flows
- `src/features/projects/create-project-model.ts` for skills loading

## Use `requestJson()` Plus Error Utilities

Use `requestJson()` plus `parseClientApiError()` and the helpers from `src/utils/api-error-user-message.ts` when:
- the transport is still standard JSON envelope
- but the UI needs field-level validation messages
- or the feature maps server errors into domain-specific user-facing copy

Current examples:
- `src/features/projects/create-project-model.ts`
- `src/stores/project-applications/model.ts`

This keeps transport logic shared while leaving form UX mapping local.

## Keep A Local Wrapper

Keep a request wrapper local when the feature needs behavior that does not fit the shared baseline:
- success `meta`
- domain-specific code-to-message mapping
- `204 No Content`
- uploads
- health checks
- streaming or realtime protocols

Current examples:
- `src/stores/chat/api.ts` keeps a local wrapper because it needs `meta` and chat-specific error mapping
- `src/stores/freelancer-portfolio/model.ts` keeps local delete logic because the endpoint uses `204`
- `src/features/db-health-alert.tsx` stays local because it is a one-off health probe

## Normalization Boundary

Use `normalizeJson` only for generic payload cleanup.

Good fit:
- empty strings should be omitted across a request payload
- `null` or empty arrays should be removed generically

Keep normalization inline at the call site when the rule is field-specific.

Example:
- `location: form.location.trim() || null` is clearer inline than encoding “empty string becomes null for exactly this field” into a generic helper

## Not Added Yet

Do not add a shared `requestApi()` helper until at least two concrete consumers need `meta` or the full success envelope.

Right now `src/stores/chat/api.ts` is the only clear consumer, so a shared richer transport helper would be premature.
