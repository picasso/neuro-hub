import { sprintf } from './common'

export function fileSize(size: number, round: number = 2, binary: boolean = false): string {
	const div = binary ? 1024 : 1000
	const fileSize = Math.abs(size)
	if (fileSize < div) return fileSize + ' B'
	else if (fileSize < div * div) return (fileSize / div).toFixed(round) + ' KB'
	else if (fileSize < div * div * div) return (fileSize / (div * div)).toFixed(round) + ' MB'
	else return (fileSize / (div * div * div)).toFixed(round) + ' GB'
}

// checks if 'value' contains non-Latin characters or is greater than 'maxlen'
// returns an error message or 'undefined' if everything is ok
export const cyrilicValidator = (
	value: string | undefined | null,
	minLen?: number | null,
	maxlen?: number | null,
	onlyLatin = true,
) => {
	if (!value) {
		return
	}

	if (minLen && value.length < minLen) {
		return sprintf(
			'Допустимо не менее %s знаков%s, цифр или символов',
			minLen,
			onlyLatin ? ' латиницы' : '',
		)
	}

	if (maxlen && value.length > maxlen) {
		return sprintf(
			'Допустимо не более %s знаков%s, цифр или символов',
			maxlen,
			onlyLatin ? ' латиницы' : '',
		)
	}

	if (onlyLatin && !RegexOnlyLatin.test(value)) {
		return 'Допустимы только латинские буквы, цифры или символы'
	}

	return
}

const RegexOnlyLatin = /^[\s\w!"#$%&'()*+,./:;<=>?@[\\\]^{|}-]*$/
