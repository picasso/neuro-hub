import 'dayjs/locale/ru'

import { dayjs } from '@/utils/common'

export function smartTime(timestamp: string, now = new Date()) {
	const date = dayjs(timestamp).locale('ru')

	if (!date.isValid()) {
		return timestamp
	}

	const reference = dayjs(now).locale('ru')
	const dayDiff = reference.startOf('day').diff(date.startOf('day'), 'day')

	if (dayDiff === 0) {
		return date.format('HH:mm')
	}

	if (dayDiff === 1) {
		return `вчера ${date.format('HH:mm')}`
	}

	if (dayDiff >= 2 && dayDiff <= 6) {
		return date.format('dddd HH:mm')
	}

	if (date.isSame(reference, 'year')) {
		return date.format('D.MM')
	}

	return date.format('DD.MM.YY')
}

export function fullTime(timestamp: string) {
	const date = dayjs(timestamp).locale('ru')
	return !date.isValid() ? null : date.format('DD.MM.YY HH:mm')
}
