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
			AuthUser: {
				type: 'object',
				properties: {
					id: { type: 'string', example: 'uGNkZ5R7O6s1ik9JD3YjkicrieY0KAdP' },
					email: { type: 'string', format: 'email', example: 'user@example.com' },
					name: { type: 'string', example: 'John Doe' },
					image: { type: 'string', format: 'uri', nullable: true },
					emailVerified: { type: 'boolean', example: false },
					role: { type: 'string', enum: ['freelancer', 'client'], example: 'freelancer' },
					createdAt: { type: 'string', format: 'date-time' },
					updatedAt: { type: 'string', format: 'date-time' },
				},
			},
			Session: {
				type: 'object',
				properties: {
					id: { type: 'string' },
					userId: { type: 'string' },
					token: { type: 'string' },
					expiresAt: { type: 'string', format: 'date-time' },
					ipAddress: { type: 'string', nullable: true },
					userAgent: { type: 'string', nullable: true },
					createdAt: { type: 'string', format: 'date-time' },
					updatedAt: { type: 'string', format: 'date-time' },
				},
			},
			SignUpRequest: {
				type: 'object',
				required: ['email', 'password', 'name'],
				properties: {
					email: { type: 'string', format: 'email', example: 'user@example.com' },
					password: {
						type: 'string',
						format: 'password',
						minLength: 8,
						example: 'SecurePass123!',
					},
					name: { type: 'string', example: 'John Doe' },
				},
			},
			SignInRequest: {
				type: 'object',
				required: ['email', 'password'],
				properties: {
					email: { type: 'string', format: 'email', example: 'user@example.com' },
					password: { type: 'string', format: 'password', example: 'SecurePass123!' },
				},
			},
			AuthResponse: {
				type: 'object',
				properties: {
					token: { type: 'string', example: 'sKrpHa0he3OoAjyrfsf0OUNfgx5BFSYY' },
					user: { $ref: '#/components/schemas/AuthUser' },
				},
			},
			SessionResponse: {
				type: 'object',
				properties: {
					session: { $ref: '#/components/schemas/Session' },
					user: { $ref: '#/components/schemas/AuthUser' },
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
	paths: {
		'/api/auth/sign-up/email': {
			post: {
				tags: ['Auth'],
				summary: 'Register new user',
				description: 'Create a new user account with email and password',
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/SignUpRequest' },
						},
					},
				},
				responses: {
					'200': {
						description: 'User successfully registered',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/AuthResponse' },
							},
						},
					},
					'422': {
						description: 'Validation error or user already exists',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										code: { type: 'string', example: 'FAILED_TO_CREATE_USER' },
										message: {
											type: 'string',
											example: 'Failed to create user',
										},
									},
								},
							},
						},
					},
				},
			},
		},
		'/api/auth/sign-in/email': {
			post: {
				tags: ['Auth'],
				summary: 'Sign in user',
				description: 'Authenticate user with email and password',
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/SignInRequest' },
						},
					},
				},
				responses: {
					'200': {
						description: 'User successfully authenticated',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/AuthResponse' },
							},
						},
					},
					'401': {
						description: 'Invalid credentials',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										code: { type: 'string', example: 'INVALID_CREDENTIALS' },
										message: {
											type: 'string',
											example: 'Invalid email or password',
										},
									},
								},
							},
						},
					},
				},
			},
		},
		'/api/auth/sign-out': {
			post: {
				tags: ['Auth'],
				summary: 'Sign out user',
				description: 'Invalidate current user session',
				responses: {
					'200': {
						description: 'User successfully signed out',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										success: { type: 'boolean', example: true },
									},
								},
							},
						},
					},
				},
			},
		},
		'/api/auth/get-session': {
			get: {
				tags: ['Auth'],
				summary: 'Get current session',
				description:
					'Retrieve current user session and user information. Returns null if no active session.',
				responses: {
					'200': {
						description:
							'Session retrieved successfully (or null if not authenticated)',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/SessionResponse',
									nullable: true,
								},
								examples: {
									authenticated: {
										summary: 'Authenticated user',
										value: {
											session: {
												id: 'AKwBZkb2QDgldUBJLqqkN8MySRppkYiz',
												userId: 'uGNkZ5R7O6s1ik9JD3YjkicrieY0KAdP',
												token: 'CcFjhkPLH95OZHVkfehFeGe6tWlf04Ng',
												expiresAt: '2026-01-29T21:56:21.452Z',
												ipAddress: '127.0.0.1',
												userAgent: 'Mozilla/5.0',
												createdAt: '2026-01-22T21:56:21.453Z',
												updatedAt: '2026-01-22T21:56:21.453Z',
											},
											user: {
												id: 'uGNkZ5R7O6s1ik9JD3YjkicrieY0KAdP',
												email: 'user@example.com',
												name: 'John Doe',
												emailVerified: false,
												image: null,
												role: 'freelancer',
												createdAt: '2026-01-22T21:55:59.732Z',
												updatedAt: '2026-01-22T21:55:59.732Z',
											},
										},
									},
									unauthenticated: {
										summary: 'No active session',
										value: null,
									},
								},
							},
						},
					},
				},
			},
		},
		'/api/auth/verify-email': {
			get: {
				tags: ['Auth'],
				summary: 'Verify email address',
				description:
					'Verify user email address using token from verification email. Called automatically when user clicks link in email.',
				parameters: [
					{
						name: 'token',
						in: 'query',
						required: true,
						schema: { type: 'string' },
						description: 'Email verification token from verification email',
						example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
					},
				],
				responses: {
					'200': {
						description: 'Email verified successfully',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										success: { type: 'boolean', example: true },
										message: {
											type: 'string',
											example: 'Email verified successfully',
										},
									},
								},
							},
						},
					},
					'400': {
						description: 'Invalid or expired token',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										code: { type: 'string', example: 'INVALID_TOKEN' },
										message: {
											type: 'string',
											example: 'Invalid or expired verification token',
										},
									},
								},
							},
						},
					},
				},
			},
		},
	},
}
