import { z } from 'zod'

export const uuidSchema = z.string().uuid('Invalid UUID format')

/**
 * Better Auth user IDs are opaque strings (not UUIDs).
 * Treat as non-empty strings and validate more strictly only if we later
 * standardize the format (e.g. nanoid length).
 */
export const authIdSchema = z.string().min(1, 'Invalid auth id')

/**
 * Opaque string IDs used across the app (e.g. Better Auth `users.id`,
 * and existing nanoid()-backed IDs in some domain tables).
 *
 * Keep intentionally permissive to avoid breaking auth/provider formats.
 */
export const idSchema = z.string().min(1, 'Invalid id')

export const emailSchema = z.string().email('Invalid email format')

export const paginationSchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	pageSize: z.coerce.number().int().positive().max(100).default(20),
})

export const idParamSchema = z.object({
	id: idSchema,
})

export type PaginationInput = z.infer<typeof paginationSchema>
export type IdParam = z.infer<typeof idParamSchema>
