export type LoginCredentials = {
	email: string
	password: string
	rememberMe: boolean
	callbackURL: string
}

export type LoginErrors = {
	email?: string
	password?: string
}
