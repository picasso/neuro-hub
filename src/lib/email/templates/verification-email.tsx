import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Link,
	Preview,
	Section,
	Text,
} from '@react-email/components'

interface VerificationEmailProps {
	email: string
	verificationUrl: string
}

export const VerificationEmail = ({ email, verificationUrl }: VerificationEmailProps) => (
	<Html>
		<Head />
		<Preview>Подтвердите ваш email адрес для NeuroHub</Preview>
		<Body style={main}>
			<Container style={container}>
				<Heading style={h1}>Подтверждение email</Heading>
				<Text style={text}>
					Добро пожаловать в NeuroHub! Для завершения регистрации, пожалуйста, подтвердите
					ваш email адрес.
				</Text>
				<Text style={text}>Ваш email: {email}</Text>
				<Section style={buttonContainer}>
					<Button style={button} href={verificationUrl}>
						Подтвердить email
					</Button>
				</Section>
				<Text style={text}>Или скопируйте и вставьте эту ссылку в ваш браузер:</Text>
				<Link href={verificationUrl} style={link}>
					{verificationUrl}
				</Link>
				<Hr style={hr} />
				<Text style={footer}>
					Если вы не регистрировались на NeuroHub, просто проигнорируйте это письмо.
				</Text>
				<Text style={footer}>
					Эта ссылка действительна в течение 24 часов и может быть использована только
					один раз.
				</Text>
			</Container>
		</Body>
	</Html>
)

VerificationEmail.PreviewProps = {
	email: 'user@example.com',
	verificationUrl: 'https://neurohub.dev/api/auth/verify-email?token=abc123',
} as VerificationEmailProps

const main = {
	backgroundColor: '#f6f9fc',
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
	backgroundColor: '#ffffff',
	margin: '0 auto',
	padding: '20px 0 48px',
	marginBottom: '64px',
	maxWidth: '560px',
	borderRadius: '8px',
	boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
}

const h1 = {
	color: '#1a1a1a',
	fontSize: '28px',
	fontWeight: '700',
	lineHeight: '1.3',
	margin: '40px 30px 30px',
	padding: '0',
}

const text = {
	color: '#404040',
	fontSize: '16px',
	lineHeight: '26px',
	margin: '16px 30px',
}

const buttonContainer = {
	padding: '27px 30px 27px',
}

const button = {
	backgroundColor: '#6366f1',
	borderRadius: '6px',
	color: '#fff',
	fontSize: '16px',
	fontWeight: '600',
	textDecoration: 'none',
	textAlign: 'center' as const,
	display: 'block',
	padding: '12px 20px',
	width: '100%',
}

const link = {
	color: '#6366f1',
	fontSize: '14px',
	textDecoration: 'underline',
	wordBreak: 'break-all' as const,
	margin: '0 30px',
	display: 'block',
}

const hr = {
	borderColor: '#e6ebf1',
	margin: '30px 30px',
}

const footer = {
	color: '#8898aa',
	fontSize: '13px',
	lineHeight: '20px',
	margin: '8px 30px',
}
