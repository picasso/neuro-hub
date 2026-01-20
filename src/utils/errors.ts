export class AppError extends Error {
	constructor(
		message: string,
		public statusCode: number = 500,
		public code?: string,
	) {
		super(message)
		this.name = 'AppError'
		Error.captureStackTrace(this, this.constructor)
	}
}

export class ValidationError extends AppError {
	constructor(
		message: string,
		public errors?: Record<string, string[]>,
	) {
		super(message, 400, 'VALIDATION_ERROR')
		this.name = 'ValidationError'
	}
}

export class NotFoundError extends AppError {
	constructor(message: string = 'Resource not found') {
		super(message, 404, 'NOT_FOUND')
		this.name = 'NotFoundError'
	}
}

export class UnauthorizedError extends AppError {
	constructor(message: string = 'Unauthorized') {
		super(message, 401, 'UNAUTHORIZED')
		this.name = 'UnauthorizedError'
	}
}

export class ForbiddenError extends AppError {
	constructor(message: string = 'Forbidden') {
		super(message, 403, 'FORBIDDEN')
		this.name = 'ForbiddenError'
	}
}

export class ConflictError extends AppError {
	constructor(message: string = 'Resource already exists') {
		super(message, 409, 'CONFLICT')
		this.name = 'ConflictError'
	}
}

export class RateLimitError extends AppError {
	constructor(message: string = 'Too many requests') {
		super(message, 429, 'RATE_LIMIT_EXCEEDED')
		this.name = 'RateLimitError'
	}
}
