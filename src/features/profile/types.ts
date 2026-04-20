export type LanguageLevel = 'basic' | 'conversational' | 'fluent' | 'native'

export type LanguageOption = {
	code: string
	name: string
	nativeName: string
}

export type Language = {
	id: string
	languageCode: string
	name: string
	nativeName: string
	langLevel?: LanguageLevel
}

export type LanguageDTO = Omit<Language, 'id'>

export type ProfileDTO = {
	id: string
	userId: string
	name: string | null
	nickname: string
	location: string | null
	bio: string | null
	avatarUrl: string | null
	companyName: string | null
	companyRole: string | null
	languages: LanguageDTO[]
	createdAt: string | Date | null
	updatedAt: string | Date | null
}

export type ProfileForm = {
	name: string
	nickname: string
	location: string
	bio: string
	avatarUrl: string
	languages: Language[]
}

export type NickStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid' | 'error'
