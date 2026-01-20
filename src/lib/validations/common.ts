import { z } from 'zod'

export const uuidSchema = z.string().uuid('Invalid UUID format')

export const emailSchema = z.string().email('Invalid email format')

export const paginationSchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	pageSize: z.coerce.number().int().positive().max(100).default(20),
})

export const idParamSchema = z.object({
	id: uuidSchema,
})

export type PaginationInput = z.infer<typeof paginationSchema>
export type IdParam = z.infer<typeof idParamSchema>
