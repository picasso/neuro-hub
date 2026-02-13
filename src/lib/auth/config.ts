import { render } from '@react-email/render'
import { betterAuth } from 'better-auth'
import { createAuthMiddleware } from 'better-auth/api'
import { map } from 'lodash'
import { nanoid } from 'nanoid'
import { kysely } from '@/lib/db'
import { pool } from '@/lib/db/pool'
import { emailConfig, resend } from '@/lib/email'
import { VerificationEmail } from '@/lib/email/templates/verification-email'

type BetterAuthSignUpReturned = {
	user: {
		id: string
		email: string
		name: string
		role: string
		emailVerified: boolean
		createdAt: string
		updatedAt: string
	}
	token: string | null
}

export const auth = betterAuth({
	database: pool,
	baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
	secret: process.env.BETTER_AUTH_SECRET || 'dev-secret-change-in-production',
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		sendResetPassword: async ({ user, url }) => {
			if (process.env.RESEND_API_KEY) {
				try {
					await resend.emails.send({
						from: emailConfig.from,
						to: user.email,
						subject: 'Восстановление пароля - NeuroGig',
						html: `
							<h1>Восстановление пароля</h1>
							<p>Вы запросили сброс пароля для вашей учетной записи.</p>
							<p><a href="${url}">Нажмите здесь, чтобы сбросить пароль</a></p>
							<p>Или скопируйте эту ссылку: ${url}</p>
							<p>Если вы не запрашивали сброс пароля, проигнорируйте это письмо.</p>
						`,
					})
				} catch (error) {
					console.error('Failed to send password reset email:', error)
				}
			} else {
				console.warn(`Password reset requested for ${user.email}. Reset URL: ${url}`)
				console.warn(
					'RESEND_API_KEY not configured. Email sending is disabled in development.',
				)
			}
		},
	},
	emailVerification: {
		sendOnSignUp: true,
		sendOnSignIn: true,
		sendVerificationEmail: async ({ user, url }) => {
			if (process.env.RESEND_API_KEY) {
				try {
					const emailHtml = await render(
						VerificationEmail({
							email: user.email,
							verificationUrl: url,
						}),
					)

					await resend.emails.send({
						from: emailConfig.from,
						to: user.email,
						subject: 'Подтвердите ваш email - NeuroGig',
						html: emailHtml,
					})
				} catch (error) {
					console.error('Failed to send verification email:', error)
					throw error
				}
			} else {
				console.warn(`Email verification requested for ${user.email}. URL: ${url}`)
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
		modelName: 'sessions',
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60,
		},
		expiresIn: 60 * 60 * 24 * 7,
		updateAge: 60 * 60 * 24,
	},
	user: {
		modelName: 'users',
		additionalFields: {
			role: {
				type: 'string',
				required: true,
				defaultValue: 'freelancer',
			},
		},
	},
	account: {
		modelName: 'accounts',
	},
	verification: {
		modelName: 'verifications',
	},
	hooks: {
		after: createAuthMiddleware(async (ctx) => {
			if (ctx.path === '/sign-up/email' && ctx.context.returned) {
				const returned = ctx.context.returned as BetterAuthSignUpReturned
				if (!returned.user) {
					return
				}
				const userId = returned.user.id
				const body = ctx.body as {
					role?: 'freelancer' | 'client'
					profileData?: {
						name: string
						bio?: string
						specialization?: string
						companyName?: string
						companyRole?: string
						skills?: Array<{
							skillId: string
							proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
						}>
					}
				}

				const profileData = body.profileData
				const role =
					body.role ?? (returned.user.role as 'freelancer' | 'client' | undefined)

				if (profileData) {
					try {
						await kysely
							.insertInto('user_profiles')
							.values({
								id: userId,
								user_id: userId,
								name: profileData.name,
								bio: profileData.bio || null,
								company_name: profileData.companyName || null,
								company_role: profileData.companyRole || null,
								updated_at: new Date(),
							})
							.onConflict((oc) =>
								oc.column('user_id').doUpdateSet({
									name: profileData.name,
									bio: profileData.bio || null,
									company_name: profileData.companyName || null,
									company_role: profileData.companyRole || null,
									updated_at: new Date(),
								}),
							)
							.execute()

						// Create/update freelancer profile only for freelancer role.
						if (role === 'freelancer') {
							await kysely
								.insertInto('freelancer_profiles')
								.values({
									user_id: userId,
									specialization: profileData.specialization ?? null,
									updated_at: new Date(),
								})
								.onConflict((oc) =>
									oc.column('user_id').doUpdateSet({
										specialization: profileData.specialization ?? null,
										updated_at: new Date(),
									}),
								)
								.execute()
						}

						if (profileData.skills && profileData.skills.length > 0) {
							await kysely
								.deleteFrom('user_skills')
								.where('user_id', '=', userId)
								.execute()

							const userSkills = map(profileData.skills, (skill) => ({
								id: nanoid(),
								user_id: userId,
								skill_id: skill.skillId,
								proficiency_level: skill.proficiencyLevel,
							}))

							await kysely.insertInto('user_skills').values(userSkills).execute()
						}
					} catch (error) {
						console.error('Failed to create user profile:', error)
					}
				}
			}
		}),
	},
	advanced: {
		generateId: true,
		useSecureCookies: process.env.NODE_ENV === 'production',
		cookieSameSite: 'lax',
	},
})
