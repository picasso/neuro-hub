import { render } from '@react-email/render'
import { betterAuth } from 'better-auth'
import { pool } from '@/lib/db/pool'
import { emailConfig, resend } from '@/lib/email'
import { VerificationEmail } from '@/lib/email/templates/verification-email'

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
						subject: 'Восстановление пароля - NeuroHub',
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
						subject: 'Подтвердите ваш email - NeuroHub',
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
		},
	},
	advanced: {
		generateId: false,
		useSecureCookies: process.env.NODE_ENV === 'production',
		cookieSameSite: 'lax',
	},
})
