import { ApiReference } from '@scalar/nextjs-api-reference'

const config = {
	theme: 'purple' as const,
	url: '/api/docs',
}

export const GET = ApiReference(config)
