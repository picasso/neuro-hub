import { ForbiddenError, ValidationError } from '@/utils/errors'

export function requireSameOrigin(request: Request) {
	const origin = request.headers.get('origin')

	if (!origin) {
		throw new ForbiddenError('Missing Origin header')
	}

	const requestOrigin = new URL(request.url).origin

	if (origin !== requestOrigin) {
		throw new ForbiddenError('Invalid Origin header')
	}
}

export async function readJsonBody<T>(request: Request): Promise<T> {
	try {
		return (await request.json()) as T
	} catch (error) {
		if (error instanceof SyntaxError) {
			throw new ValidationError('Malformed JSON body')
		}

		throw error
	}
}
