type ErrorWithDetails = {
	message?: string
	code?: string
	address?: string
	port?: number
	database?: string
	errors?: unknown[]
}

type FormattedDatabaseError = {
	message: string
	hints: string[]
}

function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null
}

function asErrorWithDetails(value: unknown): ErrorWithDetails | null {
	return isObject(value) ? (value as ErrorWithDetails) : null
}

function collectNestedErrors(error: unknown): unknown[] {
	const nestedErrors = [error]
	const errorDetails = asErrorWithDetails(error)

	if (errorDetails?.errors && Array.isArray(errorDetails.errors)) {
		nestedErrors.push(...errorDetails.errors)
	}

	return nestedErrors
}

function formatConnectionRefusedError(errors: unknown[]): FormattedDatabaseError | null {
	const connectionError = errors
		.map(asErrorWithDetails)
		.find((entry) => entry?.code === 'ECONNREFUSED')

	if (!connectionError) {
		return null
	}

	const location =
		connectionError.address && connectionError.port
			? `${connectionError.address}:${connectionError.port}`
			: 'the configured database address'

	return {
		message: `Database connection refused at ${location}`,
		hints: [
			'Make sure PostgreSQL is running.',
			'Check the host and port in `knexfile.ts` or `DATABASE_URL`.',
		],
	}
}

function formatKnownPgError(errors: unknown[]): FormattedDatabaseError | null {
	const pgError = errors.map(asErrorWithDetails).find(Boolean)

	if (!pgError?.code) {
		return null
	}

	switch (pgError.code) {
		case '28P01':
			return {
				message: 'Database authentication failed',
				hints: [
					'Check the configured database username and password.',
					'Verify that your local PostgreSQL instance accepts these credentials.',
				],
			}
		case '3D000':
			return {
				message: `Database "${pgError.database ?? 'unknown'}" does not exist`,
				hints: [
					'Create the database before running migrations.',
					'Check the configured database name in `knexfile.ts` or `DATABASE_URL`.',
				],
			}
		default:
			return null
	}
}

export function formatDatabaseConnectionError(error: unknown): FormattedDatabaseError {
	const nestedErrors = collectNestedErrors(error)

	return (
		formatConnectionRefusedError(nestedErrors) ??
		formatKnownPgError(nestedErrors) ?? {
			message: error instanceof Error ? error.message : String(error),
			hints: [],
		}
	)
}
