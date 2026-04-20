import { filter, map } from 'lodash'
import { type Language, type LanguageLevel, type LanguageOption } from './types'
import type { SelectOption } from '@/ui'

export const langLevelOptions: SelectOption[] = [
	{ value: 'basic', label: 'Базовый' },
	{ value: 'conversational', label: 'Разговорный' },
	{ value: 'fluent', label: 'Свободный' },
	{ value: 'native', label: 'Родной' },
]

type LanguageLike = Pick<Language, 'name' | 'nativeName'> & {
	languageCode?: string
	code?: string
}

export function formatLanguages(languages: LanguageLike[]) {
	const list = filter(languages, (l) => l && l.languageCode) as LanguageLike[]
	if (!list.length) return 'Языки не указаны'

	return map(
		list,
		(language) =>
			language.nativeName || language.name || language.languageCode || language.code,
	).join(', ')
}

export function getLanguageLabel(language: LanguageOption) {
	return language.nativeName === language.name
		? language.name
		: `${language.nativeName} (${language.name})`
}

export function getLanguageLevel(level: LanguageLevel) {
	switch (level) {
		case 'basic':
			return 'Basic'
		case 'conversational':
			return 'Conversational'
		case 'fluent':
			return 'Fluent'
		case 'native':
			return 'Native'
	}
}
