import type { OpenAPIV3 } from 'openapi-types'

export const swaggerConfig: OpenAPIV3.Document = {
	openapi: '3.0.0',
	info: {
		title: 'NeuroHub API',
		version: '1.0.0',
		description:
			'API documentation for NeuroHub - AI freelance marketplace platform. Connect AI specialists with clients for generative AI projects.',
		contact: {
			name: 'NeuroHub API Support',
			email: 'api@neurohub.dev',
		},
	},
	servers: [
		{
			url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
			description: 'Development server',
		},
	],
	tags: [
		{ name: 'Health', description: 'Health check endpoints' },
		{ name: 'Users', description: 'User management endpoints' },
		{ name: 'Auth', description: 'Authentication endpoints' },
		{ name: 'Skills', description: 'Skills management' },
		{ name: 'Projects', description: 'Project management' },
		{ name: 'Orders', description: 'Order management' },
	],
	components: {
		securitySchemes: {
			bearerAuth: {
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
			},
		},
		schemas: {
			Error: {
				type: 'object',
				properties: {
					success: {
						type: 'boolean',
						example: false,
					},
					error: {
						type: 'object',
						properties: {
							message: { type: 'string' },
							code: { type: 'string' },
							statusCode: { type: 'number' },
							errors: {
								type: 'object',
								additionalProperties: {
									type: 'array',
									items: { type: 'string' },
								},
							},
						},
					},
				},
			},
			Pagination: {
				type: 'object',
				properties: {
					page: { type: 'number', example: 1 },
					pageSize: { type: 'number', example: 20 },
					total: { type: 'number', example: 100 },
					hasMore: { type: 'boolean', example: true },
				},
			},
			User: {
				type: 'object',
				properties: {
					id: { type: 'string', format: 'uuid' },
					email: { type: 'string', format: 'email' },
					role: { type: 'string', enum: ['freelancer', 'client'] },
					emailVerified: { type: 'boolean' },
					createdAt: { type: 'string', format: 'date-time' },
					updatedAt: { type: 'string', format: 'date-time' },
				},
			},
			UserProfile: {
				type: 'object',
				properties: {
					id: { type: 'string', format: 'uuid' },
					userId: { type: 'string', format: 'uuid' },
					name: { type: 'string' },
					avatarUrl: { type: 'string', format: 'uri' },
					bio: { type: 'string' },
					companyName: { type: 'string' },
					companyRole: { type: 'string' },
				},
			},
			Skill: {
				type: 'object',
				properties: {
					id: { type: 'string', format: 'uuid' },
					name: { type: 'string' },
					category: {
						type: 'string',
						enum: [
							'text_generation',
							'image_generation',
							'video_generation',
							'audio_generation',
							'programming',
							'consulting',
						],
					},
				},
			},
		},
	},
	paths: {},
}
