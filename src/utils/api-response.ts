import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { AppError, ValidationError } from './errors'

export interface ApiSuccessResponse<T = unknown> {
	success: true
	data: T
	meta?: {
		page?: number
		pageSize?: number
		total?: number
		hasMore?: boolean
	}
}

export interface ApiErrorResponse {
	success: false
	error: {
		message: string
		code?: string
		statusCode: number
		errors?: Record<string, string[]>
	}
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse

export function successResponse<T>(
	data: T,
	meta?: ApiSuccessResponse<T>['meta'],
): NextResponse<ApiSuccessResponse<T>> {
	return NextResponse.json(
		{
			success: true,
			data,
			...(meta && { meta }),
		},
		{ status: 200 },
	)
}

export function createdResponse<T>(data: T): NextResponse<ApiSuccessResponse<T>> {
	return NextResponse.json(
		{
			success: true,
			data,
		},
		{ status: 201 },
	)
}

export function noContentResponse(): NextResponse {
	return new NextResponse(null, { status: 204 })
}

export function errorResponse(error: unknown): NextResponse<ApiErrorResponse> {
	if (error instanceof ZodError) {
		const validationErrors: Record<string, string[]> = {}
		error.issues.forEach((issue) => {
			const path = issue.path.join('.')
			if (!validationErrors[path]) {
				validationErrors[path] = []
			}
			validationErrors[path].push(issue.message)
		})

		return NextResponse.json(
			{
				success: false,
				error: {
					message: 'Validation failed',
					code: 'VALIDATION_ERROR',
					statusCode: 400,
					errors: validationErrors,
				},
			},
			{ status: 400 },
		)
	}

	if (error instanceof ValidationError) {
		return NextResponse.json(
			{
				success: false,
				error: {
					message: error.message,
					code: error.code || 'VALIDATION_ERROR',
					statusCode: error.statusCode,
					errors: error.errors,
				},
			},
			{ status: error.statusCode },
		)
	}

	if (error instanceof AppError) {
		return NextResponse.json(
			{
				success: false,
				error: {
					message: error.message,
					code: error.code,
					statusCode: error.statusCode,
				},
			},
			{ status: error.statusCode },
		)
	}

	console.error('Unexpected error:', error)

	return NextResponse.json(
		{
			success: false,
			error: {
				message: 'Internal server error',
				code: 'INTERNAL_ERROR',
				statusCode: 500,
			},
		},
		{ status: 500 },
	)
}
