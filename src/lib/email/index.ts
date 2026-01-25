import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
	console.warn('RESEND_API_KEY not configured. Email sending will be disabled.')
}

export const resend = new Resend(process.env.RESEND_API_KEY || 'dummy-key-for-development')

export const emailConfig = {
	from: process.env.EMAIL_FROM || 'NeuroHub <onboarding@resend.dev>',
	replyTo: process.env.EMAIL_REPLY_TO,
}
