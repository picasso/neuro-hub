import { betterAuth } from 'better-auth'
import { db } from '@/lib/db'

export const auth = betterAuth({
	database: db,
	baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
	secret: process.env.BETTER_AUTH_SECRET || 'dev-secret-change-in-production',
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
		sendResetPassword: async ({ user, url }) => {
			if (process.env.RESEND_API_KEY) {
				// TODO: Implement email sending via Resend
			} else {
				console.warn(`Password reset requested for ${user.email}. Reset URL: ${url}`)
				console.warn(
					'RESEND_API_KEY not configured. Email sending is disabled in development.',
				)
			}
		},
	},
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID || '',
			clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
			enabled: !!process.env.GITHUB_CLIENT_ID,
		},
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID || '',
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
			enabled: !!process.env.GOOGLE_CLIENT_ID,
		},
	},
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60,
		},
		expiresIn: 60 * 60 * 24 * 7,
		updateAge: 60 * 60 * 24,
	},
	user: {
		additionalFields: {
			role: {
				type: 'string',
				required: true,
				defaultValue: 'freelancer',
			},
			email_verified: {
				type: 'boolean',
				required: false,
				defaultValue: false,
				fieldName: 'emailVerified',
			},
		},
		modelName: 'users',
		fields: {
			email: 'email',
			name: 'name',
			image: 'image',
			emailVerified: 'email_verified_at',
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	},
	advanced: {
		generateId: false,
		useSecureCookies: process.env.NODE_ENV === 'production',
		cookieSameSite: 'lax',
	},
})
